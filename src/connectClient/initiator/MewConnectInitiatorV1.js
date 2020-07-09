import createLogger from 'logging';
import debugLogger from 'debug';
import {V1endpoint, V2endpoint} from '../config';

import wrtc from 'wrtc';
import io from 'socket.io-client';
import MewConnectCommon from '../MewConnectCommon';

const debug = debugLogger('MEWconnect:initiator-V1');
const debugPeer = debugLogger('MEWconnectVerbose:peer-instances-V1');
const debugStages = debugLogger('MEWconnect:initiator-stages-V1');
const logger = createLogger('MewConnectInitiator-V1');

export default class MewConnectInitiatorV1 extends MewConnectCommon {
  constructor(options = {}) {
    super('V1');

    try {
      this.supportedBrowser = MewConnectCommon.checkBrowser();
      this.uiCommunicator = options.uiCommunicator;
      this.active = true;
      this.activePeerId = '';
      this.allPeerIds = [];
      this.peersCreated = [];

      this.Url = options.url || V1endpoint;
      this.v2Url = options.v2Url || V2endpoint;

      this.turnTest = options.turnTest;

      this.p = null;
      this.socketConnected = false;
      this.connected = false;
      this.tryingTurn = false;
      this.turnDisabled = false;
      this.signalUrl = null;
      this.iceState = '';
      this.turnServers = [];

      this.webRtcCommunication = options.webRtcCommunication;

      this.io = io;

      this.signals = this.jsonDetails.signals;
      this.rtcEvents = this.jsonDetails.rtc;
      this.version = this.jsonDetails.version;
      this.versions = this.jsonDetails.versions;
      this.lifeCycle = this.jsonDetails.lifeCycle;
      this.stunServers = options.stunServers || this.jsonDetails.stunSrvers;
      this.iceStates = this.jsonDetails.iceConnectionState;
      this.timer = null;
      debug(this.signals);
    } catch (e) {
      debug('constructor error:', e);
    }
  }

  setWebRtc(webRtcCommunication) {
    this.webRtcCommunication = webRtcCommunication;
  }

  // Initalize a websocket connection with the signal server
  async initiatorStart(url = this.Url, cryptoInstance, details) {
    try {
      this.mewCrypto = cryptoInstance;
      const toSign = this.mewCrypto.generateMessage();
      this.connId = details.connId;
      this.uiCommunicator(this.lifeCycle.signatureCheck);
      const options = {
        query: {
          stage: 'initiator',
          signed: details.signed,
          message: toSign,
          connId: this.connId
        },
        transports: ['websocket', 'polling', 'flashsocket'],
        secure: true
      };
      this.socketManager = this.io(url, options);
      this.socket = this.socketManager.connect();
      this.initiatorConnect(this.socket);
    } catch (e) {
      debug(e);
    }
  }

  // ------------- WebSocket Communication Methods and Handlers ------------------------------

  // ----- Setup handlers for communication with the signal server
  initiatorConnect(socket) {
    debugStages('INITIATOR CONNECT');
    this.uiCommunicator(this.lifeCycle.SocketConnectedEvent);

    this.socket.on(this.signals.connect, () => {
      debug(': SOCKET CONNECTED');
      this.socketConnected = true;
    });

    this.socketOn(this.signals.confirmation, this.beginRtcSequence.bind(this)); // response
    this.socketOn(this.signals.answer, this.recieveAnswer.bind(this));
    this.socketOn(
      this.signals.confirmationFailedBusy,
      this.busyFailure.bind(this)
    );
    this.socketOn(
      this.signals.confirmationFailed,
      this.confirmationFailure.bind(this)
    );
    this.socketOn(
      this.signals.invalidConnection,
      this.invalidFailure.bind(this)
    );
    this.socketOn(
      this.signals.disconnect,
      this.socketDisconnectHandler.bind(this)
    );
    this.socketOn(this.signals.attemptingTurn, this.willAttemptTurn.bind(this));
    this.socketOn(this.signals.turnToken, this.beginTurn.bind(this));
    return socket;
  }

  // ----- Wrapper around Socket.IO methods
  // socket.emit wrapper
  socketEmit(signal, data) {
    this.socket.binary(false).emit(signal, data);
  }

  // socket.disconnect wrapper
  socketDisconnect() {
    this.active = false;
    this.socket.disconnect();
    this.socketConnected = false;
    debug('webSocket Disconnected');
  }

  // socket.on listener registration wrapper
  socketOn(signal, func) {
    this.socket.on(signal, func);
  }

  // ----- Socket Event handlers

  // Handle Socket Disconnect Event
  socketDisconnectHandler(reason) {
    debug(reason);
    this.socketConnected = false;
  }

  // Handle Socket Attempting Turn informative signal
  // Provide Notice that initial WebRTC connection failed and the fallback method will be used
  willAttemptTurn() {
    this.tryingTurn = true;
    debugStages('TRY TURN CONNECTION');
    this.uiCommunicator(this.lifeCycle.UsingFallback);
  }

  // Handle Socket event to initiate turn connection
  // Handle Receipt of TURN server details, and begin a WebRTC connection attempt using TURN
  beginTurn(data) {
    this.tryingTurn = true;
    this.webRtcCommunication.turnReset(this.activePeerId);
    this.retryViaTurn(data);
  }

  // ----- Failure Handlers

  // Handle Failure due to an attempt to join a connection with two existing endpoints
  busyFailure() {
    this.uiCommunicator(
      this.lifeCycle.Failed,
      this.lifeCycle.confirmationFailedBusyEvent
    );
    debug('confirmation Failed: Busy');
  }

  // Handle Failure due to no opposing peer existing
  invalidFailure() {
    this.uiCommunicator(
      this.lifeCycle.Failed,
      this.lifeCycle.invalidConnectionEvent
    );
    debug('confirmation Failed: no opposite peer found');
  }

  // Handle Failure due to the handshake/ verify details being invalid for the connection ID
  confirmationFailure() {
    this.uiCommunicator(
      this.lifeCycle.Failed,
      this.lifeCycle.confirmationFailedEvent
    );
    debug('confirmation Failed: invalid confirmation');
  }

  // =============== [End] WebSocket Communication Methods and Handlers ========================

  // ======================== [Start] WebRTC Communication Methods =============================

  // ----- WebRTC Setup Methods

  // A connection pair exists, create and send WebRTC OFFER
  async beginRtcSequence(data) {
    this.emit('socketPaired');
    debug(data);
    debug('sendOffer: SOCKET CONFIRMATION');
    this.emit('beginRtcSequence', 'V1');
    // this.connPath = source;
    // const plainTextVersion = await this.mewCrypto.decrypt(data.version);
    // this.peerVersion = plainTextVersion;
    // this.uiCommunicator(this.lifeCycle.receiverVersion, plainTextVersion);
    debug('sendOffer', data);
    const options = {
      webRtcConfig: {
        servers: this.stunServers
      }
    };
    this.initiatorStartRTC(this.socket, options);
  }

  initiatorStartRTC(socket, options) {
    debug('initiatorStartRTC');
    const webRtcConfig = options.webRtcConfig || {};

    const webRtcServers = webRtcConfig.servers || this.stunServers;

    const suppliedOptions = options.webRtcOptions || {};

    const defaultOptions = {
      initiator: true,
      trickle: false,
      iceTransportPolicy: 'relay',
      config: {
        iceServers: webRtcServers
      },
      wrtc: wrtc
    };

    const simpleOptions = {
      ...defaultOptions,
      suppliedOptions
    };

    debug(`initiatorStartRTC - options: ${simpleOptions}`);
    debug('START V1'); // todo remove dev item
    this.webRtcCommunication.setConnectionVersion('V1');
    this.webRtcCommunication.start(simpleOptions);
    this.uiCommunicator(this.lifeCycle.RtcInitiatedEvent);
    const peerID = this.webRtcCommunication.getActivePeerId();
    this.webRtcCommunication.once('connect', this.onConnect.bind(this, peerID));
    this.webRtcCommunication.once('signal', this.onSignal.bind(this));
    this.webRtcCommunication.once('data', this.onData.bind(this, peerID));
  }

  onConnect(peerID) {
    debugStages('RTC CONNECT', 'ok');
    debugPeer('peerID', peerID);
    this.connected = true;
    this.turnDisabled = true;
    this.socketEmit(this.signals.rtcConnected, this.socketKey);
    this.socketDisconnect();
    this.uiCommunicator(this.lifeCycle.RtcConnectedEvent);
  }

  async onSignal(data) {
    debug('onSignal');
    debug(data);
    const encryptedSend = await this.mewCrypto.encrypt(JSON.stringify(data));
    this.uiCommunicator(this.lifeCycle.sendOffer);
    this.socketEmit(this.signals.offerSignal, {
      data: encryptedSend,
      connId: this.connId,
      options: this.stunServers
    });
  }

  // Handle the WebRTC ANSWER from the opposite (mobile) peer
  async recieveAnswer(data) {
    debug('recieveAnswer', data);
    try {
      const plainTextOffer = await this.mewCrypto.decrypt(data.data);
      this.webRtcCommunication.receiveAnswer(JSON.parse(plainTextOffer));
      // this.rtcRecieveAnswer({ data: plainTextOffer });
    } catch (e) {
      logger.error(e);
    }
  }

  rtcRecieveAnswer(data) {
    this.uiCommunicator(this.lifeCycle.answerReceived);
    this.p.signal(JSON.parse(data.data));
  }

  rtcDestroy() {
    if (this.active) {
      this.webRtcCommunication.rtcDestroy();
      this.connected = false;
      this.uiCommunicator(this.lifeCycle.RtcDestroyedEvent);
    }
  }

  disconnectRTCClosure() {
    return () => {
      debugStages('DISCONNECT RTC Closure');
      this.connected = false;
      this.uiCommunicator(this.lifeCycle.RtcDisconnectEvent);
      this.rtcDestroy();
      this.instance = null;
    };
  }

  disconnectRTC() {
    debugStages('DISCONNECT RTC');
    this.connected = false;
    this.uiCommunicator(this.lifeCycle.RtcDisconnectEvent);
    this.rtcDestroy();
    this.instance = null;
  }

  async useFallback() {
    this.socketEmit(this.signals.tryTurn, { connId: this.connId });
  }

  // ----- WebRTC Communication Event Handlers

  onData(data) {
    this.emit(data.type, data.data);
  }

  retryViaTurn(data) {
    debugStages('Retrying via TURN v1');
    debug(data);
    const options = {
      signalListener: this.initiatorSignalListener,
      webRtcConfig: {
        servers: data.data
      }
    };
    this.beginRtcSequence(options);
  }
}
