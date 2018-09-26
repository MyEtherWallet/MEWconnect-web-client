import createLogger from 'logging';
import debugLogger from 'debug';
import { isBrowser } from 'browser-or-node';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';
import MewConnectCommon from './MewConnectCommon';
import MewConnectCrypto from './MewConnectCrypto';

const debug = debugLogger('MEWconnect:initiator');

const logger = createLogger('MewConnectInitiator');

export default class MewConnectInitiator extends MewConnectCommon {
  constructor(
    additionalLibs = {}
  ) {
    super();

    this.supportedBrowser = MewConnectCommon.checkBrowser();

    this.destroyOnUnload();
    this.p = null;
    this.qrCodeString = null;
    this.socketConnected = false;
    this.connected = false;
    this.signalUrl = null;
    this.turnServers = [];

    this.io = additionalLibs.io || io;
    this.Peer = additionalLibs.wrtc || SimplePeer;
    this.mewCrypto = additionalLibs.cryptoImpl || MewConnectCrypto.create();

    this.signals = this.jsonDetails.signals;
    this.rtcEvents = this.jsonDetails.rtc;
    this.version = this.jsonDetails.version;
    this.versions = this.jsonDetails.versions;
    this.lifeCycle = this.jsonDetails.lifeCycle;
    this.stunServers = this.jsonDetails.stunSrvers;
  }

  // Factory function to create instance using default supplied libraries
  static init() {
    return new MewConnectInitiator();
  }

  // Check if a WebRTC connection exists before a window/tab is closed or refreshed
  // Destroy the connection if one exists
  destroyOnUnload() {
    if (isBrowser) {
      window.onunload = window.onbeforeunload = () => {
        if (!!this.Peer && !this.Peer.destroyed) {
          _this.rtcDestroy();
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
    this.qrCodeString = qrCodeString;

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
    this.initiatorStart(this.signalUrl);
  }

  async useFallback(){
    this.socketEmit(this.signals.tryTurn, {connId: this.connId})
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
  }

  // socket.on listener registration wrapper
  socketOn(signal, func) {
    this.socket.on(signal, func);
  }

  // ----- Setup handlers for communication with the signal server
  initiatorConnect(socket) {
    debug('INITIATOR CONNECT');
    this.uiCommunicator(this.lifeCycle.SocketConnectedEvent);

    this.socket.on(this.signals.connect, () => {
      debug('SOCKET CONNECTED');
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
    this.socketOn(this.signals.turnToken, this.attemptingTurn.bind(this));
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
    debug('TRY TURN CONNECTION');
    this.uiCommunicator(this.lifeCycle.UsingFallback);
  }

  // Handle Socket event to initiate turn connection
  // Handle Receipt of TURN server details, and begin a WebRTC connection attempt using TURN
  attemptingTurn(data) {
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
        const _this = this;
        debug('SIGNAL', JSON.stringify(data));
        const encryptedSend = await _this.mewCrypto.encrypt(
          JSON.stringify(data)
        );
        _this.socketEmit(_this.signals.offerSignal, {
          data: encryptedSend,
          connId: _this.connId,
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
      let plainTextOffer;
      plainTextOffer = await this.mewCrypto.decrypt(data.data);
      this.rtcRecieveAnswer({ data: plainTextOffer });
    } catch (e) {
      logger.error(e);
    }
  }

  rtcRecieveAnswer(data) {
    this.p.signal(JSON.parse(data.data));
  }

  initiatorStartRTC(socket, options) {
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
    this.p.on(this.rtcEvents.error, this.onError.bind(this));
    this.p.on(this.rtcEvents.connect, this.onConnect.bind(this));
    this.p.on(this.rtcEvents.close, this.onClose.bind(this));
    this.p.on(this.rtcEvents.data, this.onData.bind(this));
    this.p.on(this.rtcEvents.signal, signalListener.bind(this));
    debug('simple peer', this.p);
  }

  // ----- WebRTC Communication Event Handlers

  onConnect() {
    debug('CONNECT', 'ok');
    this.connected = true;
    this.socketEmit(this.signals.rtcConnected, this.socketKey);
    this.socketDisconnect();
    setTimeout(() => {
      this.uiCommunicator(this.lifeCycle.RtcConnectedEvent);
    }, 100);
  }

  async onData(data) {
    debug('DATA RECEIVED', data.toString());
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
        debug('DECRYPTED DATA RECEIVED', parsed);
        this.emit(parsed.type, parsed.data);
      } else {
        debug('DECRYPTED DATA RECEIVED', decryptedData);
        this.emit(decryptedData.type, decryptedData.data);
      }
    } catch (e) {
      logger.error(e);
      debug('onData ERROR: data=', data);
      debug('onData ERROR: data.toString()=', data.toString());
    }
  }

  onClose(data) {
    debug('WRTC CLOSE', data);
    this.connected = false;
    this.uiCommunicator(this.lifeCycle.RtcClosedEvent);
  }

  onError(err) {
    debug(err.code);
    debug('WRTC ERROR');
    debug('error', err);
    this.uiCommunicator(this.lifeCycle.RtcErrorEvent);
  }

  // ----- WebRTC Communication Methods

  sendRtcMessageClosure(type, msg) {
    return () => {
      debug(`[SEND RTC MESSAGE Closure] type:  ${type},  message:  ${msg}`);
      _this.rtcSend(JSON.stringify({ type: type, data: msg }));
    };
  }

  sendRtcMessage(type, msg) {
    debug(`[SEND RTC MESSAGE] type:  ${type},  message:  ${msg}`);
    this.rtcSend(JSON.stringify({ type: type, data: msg }));
  }

  disconnectRTCClosure() {
    return () => {
      debug('DISCONNECT RTC Closure');
      _this.uiCommunicator(_this.lifeCycle.RtcDisconnectEvent);
      _this.rtcDestroy();
      _this.instance = null;
    };
  }

  disconnectRTC() {
    debug('DISCONNECT RTC');
    this.uiCommunicator(this.lifeCycle.RtcDisconnectEvent);
    this.rtcDestroy();
    this.instance = null;
  }

  async rtcSend(arg) {
    let encryptedSend;
    if (typeof arg === 'string') {
      encryptedSend = await this.mewCrypto.encrypt(arg);
    } else {
      encryptedSend = await this.mewCrypto.encrypt(JSON.stringify(arg));
    }
    debug('SENDING RTC');
    this.p.send(JSON.stringify(encryptedSend));
  }

  rtcDestroy() {
    if (this.p !== null) {
      this.p.destroy();
    }
  }

  // ----- WebRTC Communication TURN Fallback Initiator/Handler
  // Fallback Step if initial webRTC connection attempt fails.
  // Retries setting up the WebRTC connection using TURN
  retryViaTurn(data) {
    debug('Retrying via TURN');
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
