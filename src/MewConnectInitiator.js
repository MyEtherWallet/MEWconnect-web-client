import createLogger from 'logging';
import debugLogger from 'debug';
import { isBrowser } from 'browser-or-node';
import uuid from 'uuid/v4';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';
import MewConnectCommon from './MewConnectCommon';
import MewConnectCrypto from './MewConnectCrypto';

const debug = debugLogger('MEWconnect:initiator');
const debugPeer = debugLogger('MEWconnectVerbose:peer-instances');
const debugStages = debugLogger('MEWconnect:initiator-stages');
const logger = createLogger('MewConnectInitiator');

export default class MewConnectInitiator extends MewConnectCommon {
  constructor(options = {}) {
    super();

    this.supportedBrowser = MewConnectCommon.checkBrowser();

    this.activePeerId = '';
    this.allPeerIds = [];
    this.peersCreated = [];

    this.destroyOnUnload();
    this.p = null;
    this.socketConnected = false;
    this.connected = false;
    this.tryingTurn = false;
    this.turnDisabled = false;
    this.signalUrl = null;
    this.iceState = '';
    this.turnServers = [];

    this.io = options.io || io;
    this.Peer = options.wrtc || SimplePeer;
    this.mewCrypto = options.cryptoImpl || MewConnectCrypto.create();

    this.signals = this.jsonDetails.signals;
    this.rtcEvents = this.jsonDetails.rtc;
    this.version = this.jsonDetails.version;
    this.versions = this.jsonDetails.versions;
    this.lifeCycle = this.jsonDetails.lifeCycle;
    this.stunServers = options.stunServers || this.jsonDetails.stunSrvers;
    this.iceStates = this.jsonDetails.iceConnectionState;

    // Socket is abandoned.  disconnect.
    setTimeout(() => {
      if (this.socket) {
        this.socketDisconnect();
      }
    }, 120000);
  }

  isAlive() {
    if (this.p !== null) {
      return this.p.connected && !this.p.destroyed;
    }
    return false;
  }

  // Factory function to create instance using default supplied libraries
  static init(opts) {
    const options = opts !== null ? opts : {};
    return new MewConnectInitiator(options);
  }

  // Check if a WebRTC connection exists before a window/tab is closed or refreshed
  // Destroy the connection if one exists
  destroyOnUnload() {
    if (isBrowser) {
      // eslint-disable-next-line no-undef
      window.onunload = window.onbeforeunload = () => {
        const iceStates = [
          this.iceStates.new,
          this.iceStates.connecting,
          this.iceStates.connected
        ];
        if (!this.Peer.destroyed || iceStates.includes(this.iceState)) {
          this.rtcDestroy();
        }
      };
    }
  }

  static checkBrowser() {
    return MewConnectCommon.checkBrowser();
  }

  static checkWebRTCAvailable() {
    return MewConnectCommon.checkWebRTCAvailable();
  }

  // Returns a boolean indicating whether the socket connection exists and is active
  getSocketConnectionState() {
    return this.socketConnected;
  }

  // Returns a boolean indicating whether the WebRTC connection exists and is active
  getConnectonState() {
    return this.connected;
  }

  // can be used to listen to specific events, especially those that pass data
  uiCommunicator(event, data) {
    this.emit(event, data);
    this.emitStatus(event);
  }

  // special status emitter to allow simple listening of various statuses in one listener
  emitStatus(event) {
    this.emit('status', event);
  }

  // Emit/Provide the details used in creating the QR Code
  displayCode(data) {
    debug('handshake', data);
    this.socketKey = data;
    const separator = this.jsonDetails.connectionCodeSeparator;
    const qrCodeString =
      this.version + separator + data + separator + this.connId;

    this.uiCommunicator(this.lifeCycle.codeDisplay, qrCodeString);
    this.uiCommunicator(this.lifeCycle.checkNumber, data);
    this.uiCommunicator(this.lifeCycle.ConnectionId, this.connId);
  }

  // ===================== [Start] WebSocket Communication Methods and Handlers ========================

  // The initial method called to initiate the exchange that can create a WebRTC connection
  async regenerateCode() {
    if (this.signalUrl === null) {
      throw Error('regenerateCode called before initial code generation');
    }
    this.socketDisconnect();
    this.initiatorStart(this.signalUrl);
  }

  async useFallback() {
    this.socketEmit(this.signals.tryTurn, { connId: this.connId });
  }

  // Initalize a websocket connection with the signal server
  async initiatorStart(url) {
    if (this.signalUrl === null) {
      this.signalUrl = url;
    }
    this.keys = this.mewCrypto.prepareKey();
    const toSign = this.mewCrypto.generateMessage();
    this.signed = await this.mewCrypto.signMessage(
      this.keys.pvt.toString('hex')
    );
    this.connId = this.mewCrypto.bufferToConnId(this.keys.pub);
    this.displayCode(this.keys.pvt.toString('hex'));
    this.uiCommunicator(this.lifeCycle.signatureCheck);
    const options = {
      query: {
        stage: 'initiator',
        signed: this.signed,
        message: toSign,
        connId: this.connId
      },
      transports: ['websocket', 'polling', 'flashsocket'],
      secure: true
    };
    this.socketManager = this.io(url, options);
    this.socket = this.socketManager.connect();
    this.initiatorConnect(this.socket);
  }

  // ------------- WebSocket Communication Methods and Handlers ------------------------------

  // ----- Wrapper around Socket.IO methods
  // socket.emit wrapper
  socketEmit(signal, data) {
    this.socket.binary(false).emit(signal, data);
  }

  // socket.disconnect wrapper
  socketDisconnect() {
    this.socket.disconnect();
    this.socketConnected = false;
  }

  // socket.on listener registration wrapper
  socketOn(signal, func) {
    this.socket.on(signal, func);
  }

  // ----- Setup handlers for communication with the signal server
  initiatorConnect(socket) {
    debugStages('INITIATOR CONNECT');
    this.uiCommunicator(this.lifeCycle.SocketConnectedEvent);

    this.socket.on(this.signals.connect, () => {
      debugStages('SOCKET CONNECTED');
      this.socketConnected = true;
    });

    this.socketOn(this.signals.confirmation, this.sendOffer.bind(this)); // response
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
  async sendOffer(data) {
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
    this.initiatorStartRTC(this.socket, options);
  }

  initiatorSignalListener(socket, options) {
    return async data => {
      try {
        debug('SIGNAL', JSON.stringify(data));
        const encryptedSend = await this.mewCrypto.encrypt(
          JSON.stringify(data)
        );
        this.uiCommunicator(this.lifeCycle.sendOffer);
        this.socketEmit(this.signals.offerSignal, {
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
  async recieveAnswer(data) {
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

  initiatorStartRTC(socket, options) {
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
      }
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
    this.p.on(this.rtcEvents.connect, this.onConnect.bind(this, peerID));
    this.p.on(this.rtcEvents.close, this.onClose.bind(this, peerID));
    this.p.on(this.rtcEvents.data, this.onData.bind(this, peerID));
    this.p.on(this.rtcEvents.signal, signalListener.bind(this));
    this.p._pc.addEventListener(
      'iceconnectionstatechange',
      this.stateChangeListener.bind(this, peerID)
    );
  }

  // ----- WebRTC Communication Event Handlers

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
        if (!this.connected) {
          this.connected = true;
          this.uiCommunicator(this.lifeCycle.RtcConnectedEvent);
        }
      }
    }
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

  // ----- WebRTC Communication Methods

  sendRtcMessageClosure(type, msg) {
    return () => {
      debug(`[SEND RTC MESSAGE Closure] type:  ${type},  message:  ${msg}`);
      this.rtcSend(JSON.stringify({ type, data: msg }));
    };
  }

  sendRtcMessage(type, msg) {
    debug(`[SEND RTC MESSAGE] type:  ${type},  message:  ${msg}`);
    this.rtcSend(JSON.stringify({ type, data: msg }));
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

  async rtcSend(arg) {
    if (this.isAlive()) {
      let encryptedSend;
      if (typeof arg === 'string') {
        encryptedSend = await this.mewCrypto.encrypt(arg);
      } else {
        encryptedSend = await this.mewCrypto.encrypt(JSON.stringify(arg));
      }
      debug('SENDING RTC');
      this.p.send(JSON.stringify(encryptedSend));
    } else {
      // eslint-disable-next-line
      this.uiCommunicator(this.lifeCycle.attemptedDisconnectedSend);
    }
  }

  rtcDestroy() {
    if (this.isAlive()) {
      this.p.destroy();
      this.connected = false;
      this.uiCommunicator(this.lifeCycle.RtcDestroyedEvent);
    }
  }

  // ----- WebRTC Communication TURN Fallback Initiator/Handler
  // Fallback Step if initial webRTC connection attempt fails.
  // Retries setting up the WebRTC connection using TURN
  retryViaTurn(data) {
    debugStages('Retrying via TURN');
    const options = {
      signalListener: this.initiatorSignalListener,
      webRtcConfig: {
        servers: data.data
      }
    };
    this.initiatorStartRTC(this.socket, options);
  }

  // ======================== [End] WebRTC Communication Methods =============================
}
