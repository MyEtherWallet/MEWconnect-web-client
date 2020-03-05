import createLogger from 'logging';
import debugLogger from 'debug';

import wrtc from 'wrtc';
import io from 'socket.io-client';
import MewConnectCommon from '../MewConnectCommon';
import MewConnectCrypto from '../MewConnectCrypto';
import uuid from 'uuid/v4';
import SimplePeer from 'simple-peer';

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
      this.Url = options.url || 'wss://connect.mewapi.io';
      this.v2Url = options.v2Url || 'wss://connect2.mewapi.io/staging';
      this.Peer = SimplePeer;

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
      this.signalsV1 = this.jsonDetails.signalsV1;
      this.rtcEvents = this.jsonDetails.rtc;
      this.version = this.jsonDetails.version;
      this.versions = this.jsonDetails.versions;
      this.lifeCycle = this.jsonDetails.lifeCycle;
      this.stunServers = options.stunServers || this.jsonDetails.stunSrvers;
      this.iceStates = this.jsonDetails.iceConnectionState;
      // Socket is abandoned.  disconnect.
      this.timer = null;
      setTimeout(() => {
        if (this.socket) {
          this.socketDisconnect();
        }
      }, 120000);
      debug(this.signals); // todo remove dev item
    } catch (e) {
      debug(e); // todo remove dev item
      debug('constructor error:', e);
    }
  }

  isAlive() {
    if (this.p !== null) {
      return this.p.connected && !this.p.destroyed;
    }
    return false;
  }

  setWebRtc(webRtcCommunication) {
    this.webRtcCommunication = webRtcCommunication;
  }

  generateKeys(testPrivate) {
    if (!this.mewCrypto) this.mewCrypto = MewConnectCrypto.create();
    let keys = {};
    if (testPrivate) {
      keys = this.mewCrypto.setPrivate(testPrivate);
    } else {
      keys = this.mewCrypto.generateKeys();
    }
    this.publicKey = keys.publicKey;
    this.privateKey = keys.privateKey;
    this.connId = this.mewCrypto.generateConnId(this.publicKey);
    this.signed = this.mewCrypto.signMessageSync(
      this.privateKey,
      this.privateKey
    );
    debug('this.signed', this.signed);
  }

  // TODO change this to handle supplying urls at time point
  // async initiatorStartV1(url = this.Url, cryptoInstance, details) {
  //   console.log(url, testPrivate); // todo remove dev item
  //   this.generateKeys(testPrivate);
  //   this.mewCrypto = cryptoInstance;
  //   this.displayCode(this.privateKey);
  //   this.initiatorStart(this.Url);
  // }

  beginRtcSequence(source, data) {
    if (source === 'V2') {
      this.connPath = 'V2';
      this.socketV1Disconnect();
      this.beginRtcSequenceV2(data);
    } else if (source === 'V1') {
      this.connPath = 'V1';
      this.socketV2Disconnect();
      this.beginRtcSequenceV2(data);
    }
  }

  // ===============================================
  // V1
  // ============================================

  // Initalize a websocket connection with the signal server
  async initiatorStart(url = this.Url, cryptoInstance, details) {
    // const toSign = this.mewCrypto.generateMessage();
    //
    // this.uiCommunicator(this.lifeCycle.signatureCheck);
    // const options = {
    //   query: {
    //     stage: 'initiator',
    //     signed: this.signed,
    //     message: toSign,
    //     connId: this.connId
    //   },
    //   transports: ['websocket', 'polling', 'flashsocket'],
    //   secure: true
    // };
    // this.socketManager = this.io(url, options);
    // this.socketV1 = this.socketManager.connect();
    // this.initiatorConnectV1(this.socketV1);
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
      this.socketV1 = this.socketManager.connect();
      this.initiatorConnectV1(this.socketV1);
    } catch (e) {
      debug(e);
    }
  }

  // ------------- WebSocket Communication Methods and Handlers ------------------------------

  // ----- Wrapper around Socket.IO methods
  // socket.emit wrapper
  socketV1Emit(signal, data) {
    this.socketV1.binary(false).emit(signal, data);
  }

  // socket.disconnect wrapper
  socketV1Disconnect() {
    this.socketV1.disconnect();
    this.socketV1Connected = false;
  }

  // socket.on listener registration wrapper
  socketV1On(signal, func) {
    this.socketV1.on(signal, func);
  }

  // ----- Setup handlers for communication with the signal server
  initiatorConnectV1(socket) {
    debugStages('INITIATOR CONNECT');
    this.uiCommunicator(this.lifeCycle.SocketConnectedEvent);

    this.socketV1.on(this.signalsV1.connect, () => {
      console.log('V1: SOCKET CONNECTED');
      this.socketV1Connected = true;
    });

    this.socketV1On(this.signalsV1.confirmation, this.sendOfferV1.bind(this, 'V1')); // response
    this.socketV1On(this.signalsV1.answer, this.recieveAnswerV1.bind(this));
    this.socketV1On(
      this.signalsV1.confirmationFailedBusy,
      this.busyFailure.bind(this)
    );
    this.socketV1On(
      this.signalsV1.confirmationFailed,
      this.confirmationFailure.bind(this)
    );
    this.socketV1On(
      this.signalsV1.invalidConnection,
      this.invalidFailure.bind(this)
    );
    this.socketV1On(
      this.signalsV1.disconnect,
      this.socketDisconnectHandler.bind(this)
    );
    this.socketV1On(this.signalsV1.attemptingTurn, this.willAttemptTurn.bind(this));
    this.socketV1On(this.signalsV1.turnToken, this.beginTurn.bind(this));
    return socket;
  }

  // ----- Socket Event handlers

  // Handle Socket Disconnect Event
  socketDisconnectHandler(reason) {
    debug(reason);
    this.socketV1Connected = false;
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
    this.retryViaTurn(data);
  }

  retryViaTurn(data) {
    if (this.connPath === 'V2') {
      this.retryViaTurnV2(data);
    } else if (this.connPath === 'V1') {
      this.retryViaTurnV1(data);
    }
  }

  retryViaTurnV1(data) {
    debugStages('Retrying via TURN v1');
    const options = {
      signalListener: this.initiatorSignalListener,
      webRtcConfig: {
        servers: data.data
      }
    };
    this.initiatorStartRTCV1(this.socket, options);
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
  async sendOfferV1(source, data) {
    this.connPath = source;
    this.emit("socketPaired");
    const plainTextVersion = await this.mewCrypto.decrypt(data.version);
    this.peerVersion = plainTextVersion;
    this.uiCommunicator(this.lifeCycle.receiverVersion, plainTextVersion);
    debug('sendOffer', data);
    const options = {
      signalListener: this.initiatorSignalListener,
      webRtcConfig: {
        servers: this.stunServers
      }
    };
    this.initiatorStartRTCV1(this.socketV1, options);
  }

  initiatorSignalListener(socket, options) {
    return async data => {
      try {
        debug('SIGNAL', JSON.stringify(data));
        const encryptedSend = await this.mewCrypto.encrypt(
          JSON.stringify(data)
        );
        this.uiCommunicator(this.lifeCycle.sendOffer);
        this.socketV1Emit(this.signalsV1.offerSignal, {
          data: encryptedSend,
          connId: this.connId,
          options: options.servers
        });
      } catch (e) {
        logger.error(e);
      }
    };
  }

  // Handle the WebRTC ANSWER from the opposite (mobile) peer
  async recieveAnswerV1(data) {
    try {
      const plainTextOffer = await this.mewCrypto.decrypt(data.data);
      this.rtcRecieveAnswer({ data: plainTextOffer });
    } catch (e) {
      logger.error(e);
    }
  }

  rtcRecieveAnswer(data) {
    this.uiCommunicator(this.lifeCycle.answerReceived);
    this.p.signal(JSON.parse(data.data));
  }

  setActivePeerId() {
    this.activePeerId = uuid();
    this.allPeerIds.push(this.activePeerId);
  }

  getActivePeerId() {
    const split = this.activePeerId.split('-');
    return split.join('-');
  }

  initiatorStartRTCV1(socket, options) {
    this.setActivePeerId();
    const webRtcConfig = options.webRtcConfig || {};
    const signalListener = this.initiatorSignalListener(
      socket,
      webRtcConfig.servers
    );
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
    this.uiCommunicator(this.lifeCycle.RtcInitiatedEvent);
    this.p = new this.Peer(simpleOptions);
    const peerID = this.getActivePeerId();
    this.p.peerInstanceId = peerID;
    this.peersCreated.push(this.p);
    this.p.on(this.rtcEvents.error, this.onError.bind(this, peerID));
    this.p.on(this.rtcEvents.connect, this.onConnectV1.bind(this, peerID));
    this.p.on(this.rtcEvents.close, this.onClose.bind(this, peerID));
    this.p.on(this.rtcEvents.data, this.onData.bind(this, peerID));
    this.p.on(this.rtcEvents.signal, signalListener.bind(this));
    this.p._pc.addEventListener(
      'iceconnectionstatechange',
      this.stateChangeListener.bind(this, peerID)
    );
  }

  async useFallbackV1() {
    this.socketV1Emit(this.signalsV1.tryTurn, { connId: this.connId });
  }

  // ----- WebRTC Communication Event Handlers

  onConnectV1(peerID) {
    debugStages('RTC CONNECT', 'ok');
    debugPeer('peerID', peerID);
    this.webRtcCommunication.emit('connect', peerID);
    this.connected = true;
    this.turnDisabled = true;
    this.socketV1Emit(this.signalsV1.rtcConnected, this.socketKey);
    this.socketV1Disconnect();
    this.uiCommunicator(this.lifeCycle.RtcConnectedEvent);
  }

  async onData(peerID, data) {
    debug('DATA RECEIVED', data.toString());
    debugPeer('peerID', peerID);
    try {
      let decryptedData;
      if (this.isJSON(data)) {
        decryptedData = await this.mewCrypto.decrypt(
          JSON.parse(data.toString())
        );
      } else {
        decryptedData = await this.mewCrypto.decrypt(
          JSON.parse(data.toString())
        );
      }
      if (this.isJSON(decryptedData)) {
        const parsed = JSON.parse(decryptedData);
        debug('DECRYPTED DATA RECEIVED 1', parsed);
        this.emit(parsed.type, parsed.data);
      } else {
        debug('DECRYPTED DATA RECEIVED 2', decryptedData);
        this.emit(decryptedData.type, decryptedData.data);
      }
    } catch (e) {
      logger.error(e);
      debug('onData ERROR: data=', data);
      debug('onData ERROR: data.toString()=', data.toString());
    }
  }

  onClose(peerID, data) {
    debugStages('WRTC MAYBE CLOSE');
    debugPeer('peerID', peerID);
    if (!this.isAlive()) {
      debugStages('WRTC CLOSE', data);
      if (this.connected) {
        this.uiCommunicator(this.lifeCycle.RtcClosedEvent);
        this.connected = false;
      } else {
        this.connected = false;
      }
    }
  }

  onError(peerID, err) {
    debugStages('WRTC ERROR');
    debugPeer('peerID', peerID);
    debug(err.code);
    debug('error', err);
    if (!this.connected && !this.tryingTurn && !this.turnDisabled) {
      this.useFallback();
    } else {
      if (!this.isAlive()) {
        this.uiCommunicator(this.lifeCycle.RtcErrorEvent);
      }
    }
  }

  useFallback() {
    this.useFallbackV1();
  }

  stateChangeListener(peerID, evt) {
    // eslint-disable-next-line no-undef
    if (typeof jest === 'undefined') {
      // included because target is not defined in jest
      debug(`iceConnectionState: ${evt.target.iceConnectionState}`);
      debugPeer('this.allPeerIds', this.allPeerIds);
      debugPeer('peerID', peerID);
      if (
        evt.target.iceConnectionState === 'connected' ||
        evt.target.iceConnectionState === 'completed'
      ) {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        if (!this.connected) {
          this.connected = true;
          this.uiCommunicator(this.lifeCycle.RtcConnectedEvent);
        }
      }
      if ((evt.target.iceConnectionState === 'failed' ||
        evt.target.iceConnectionState === 'disconnected') &&
        !this.turnDisabled) {
        this.turnDisabled = true;
        this.useFallback();
        // this.timer = setTimeout(this.useFallback, 5000)
      }
      // if(evt.target.iceConnectionState === 'checking' && !this.turnDisabled){
      //   this.turnDisabled = true;
      //   this.useFallback();
      //   // this.timer = setTimeout(this.useFallback, 5000)
      // }
      // if(evt.target.iceConnectionState === 'disconnected' && !this.turnDisabled){
      //   this.useFallback();
      // }
    }
  }

}
