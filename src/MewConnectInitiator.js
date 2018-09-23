import createLogger from 'logging';
import EventEmitter from 'events';

const debug = require('debug')('MEWconnect:initiator');

const io = require('socket.io-client');
const SimplePeer = require('simple-peer');

const MewConnectCommon = require('./MewConnectCommon');
const MewConnectCrypto = require('./MewConnectCrypto');
const logger = createLogger('MewConnectInitiator');

class MewConnectInitiator extends MewConnectCommon {
  constructor(uiCommunicatorFunc = null, loggingFunc, userSuppliedLibs) {
    super(uiCommunicatorFunc, loggingFunc);

    const additionalLibs = userSuppliedLibs || {};

    this.destroyOnUnload();
    this.p = null;
    this.qrCodeString = null;
    this.socketConnected = false;
    this.connected = false;
    this.signalUrl = null;
    this.turnServers = [];

    this.status = new EventEmitter();
    this.uiCommunicationEmitter = new EventEmitter();

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

  /**
   * Factory function
   */
  static init(uiCommunicatorFunc, loggingFunc, additionalLibs) {
    return new MewConnectInitiator(
      uiCommunicatorFunc,
      loggingFunc,
      additionalLibs
    );
  }

  // Check if a WebRTC connection exists before a window/tab is closed or refreshed
  // Destroy the connection if one exists
  destroyOnUnload() {
    if (this.isBrowser) {
      window.onunload = window.onbeforeunload = function(e) {
        const _this = this;
        if (!!this.Peer && !this.Peer.destroyed) {
          _this.rtcDestroy();
        }
      };
    }
  }

  /**
   * Returns a boolean indicating whether the socket connection exists and is active
   */
  getSocketConnectionState() {
    return this.socketConnected;
  }

  /**
   * Returns a boolean indicating whether the WebRTC connection exists and is active
   */
  getConnectonState() {
    return this.connected;
  }

  uiCommunicator(event, data) {
    this.emit(event, data);
    this.emitStatus(event);
  }

  // special status emitter to allow simple catching of various statuses in one listener
  emitStatus(event) {
    this.status('status', event);
  }

  /**
   * Emit/Provide the details used in creating the QR Code
   */
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

  // ////////////// Initialize Communication Process //////////////////////////////

  /**
   * The initial method called to initiate the exchange that can create a WebRTC connection
   */

  async regenerateCode() {
    if (this.signalUrl === null) {
      throw Error('regenerateCode called before initial code generation');
    }
    this.initiatorStart(this.signalUrl);
  }

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
    this.emitStatus(this.lifeCycle.signatureCheck);
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

  // ////////////// WebSocket Communication Methods and Handlers //////////////////////////////

  /**
   * Setup message handlers for communication with the signal server
   */
  initiatorConnect(socket) {
    debug('INITIATOR CONNECT');
    this.emitStatus(this.lifeCycle.SocketConnectedEvent);

    this.socket.on(this.signals.connect, () => {
      debug('SOCKET CONNECTED');
      this.socketConnected = true;
      this.applyDatahandlers(
        JSON.stringify({ type: 'socketConnected', data: null })
      );
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

  // Wrapper around socket.emit method
  socketEmit(signal, data) {
    this.socket.binary(false).emit(signal, data);
  }

  // Wrapper around socket.disconnect method
  socketDisconnect() {
    this.socket.disconnect();
  }

  // Wrapper around socket.on listener registration method
  socketOn(signal, func) {
    this.socket.on(signal, func);
  }

  // Socket Event handlers

  // Handle Socket Disconnect Event
  socketDisconnectHandler(reason) {
    debug(reason);
    this.socketConnected = false;
  }

  // Handle Socket Attempting Turn informative signal
  // Provide Notice that initial WebRTC connection failed and the fallback method will be used
  willAttemptTurn() {
    this.uiCommunicator(this.lifeCycle.UsingFallback);
    debug('TRY TURN CONNECTION');
  }

  // Handle Socket event to initiate turn connection
  // Handle Receipt of TURN server details, and begin a WebRTC connection attempt using TURN
  attemptingTurn(data) {
    this.retryViaTurn(data);
  }

  // Failure Handlers

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

  // /////////////////////////////////////////////////////////////////////////////////////////////

  // //////////////////////// WebRTC Communication Related ///////////////////////////////////////

  // ////////////// WebRTC Communication Setup Methods ///////////////////////////////////////////

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
    // TODO encrypt the options object
    return async function offerEmmiter(data) {
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
      reconnectTimer: 100,
      iceTransportPolicy: 'relay',
      config: {
        iceServers: webRtcServers
      }
    };

    const simpleOptions = {
      ...defaultOptions,
      suppliedOptions
    };

    this.emitStatus(this.lifeCycle.RtcInitiatedEvent);
    this.p = new this.Peer(simpleOptions);
    this.p.on(this.rtcEvents.error, this.onError.bind(this));
    this.p.on(this.rtcEvents.connect, this.onConnect.bind(this));
    this.p.on(this.rtcEvents.close, this.onClose.bind(this));
    this.p.on(this.rtcEvents.data, this.onData.bind(this));
    this.p.on(this.rtcEvents.signal, signalListener.bind(this));
    debug('simple peer', this.p);
  }

  // ////////////// WebRTC Communication Event Handlers //////////////////////////////

  onConnect() {
    this.logger('CONNECT', 'ok');
    this.connected = true;
    this.socketEmit(this.signals.rtcConnected, this.socketKey);
    this.socketDisconnect();
    setTimeout(() => {
      this.emitStatus(this.lifeCycle.RtcConnectedEvent);
      this.applyDatahandlers(
        JSON.stringify({ type: 'rtcConnected', data: null })
      );
    }, 100);
  }

  async onData(data) {
    this.logger('DATA RECEIVED', data.toString());
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
        this.logger('DECRYPTED DATA RECEIVED', parsed);
        this.emit(parsed.type, parsed.data);
      } else {
        this.logger('DECRYPTED DATA RECEIVED', decryptedData);
        this.emit(decryptedData.type, decryptedData.data);
      }
    } catch (e) {
      logger.error(e);
      this.logger('peer2 ERROR: data=', data);
      this.logger('peer2 ERROR: data.toString()=', data.toString());
    }
  }

  onClose(data) {
    this.logger('WRTC CLOSE', data);
    this.connected = false;
    this.emitStatus(this.lifeCycle.RtcClosedEvent);
    this.uiCommunicator(this.lifeCycle.RtcClosedEvent, err);
  }

  onError(err) {
    logger.error('WRTC ERROR');
    this.logger('error', err);
    this.emitStatus(this.lifeCycle.RtcErrorEvent);
    this.uiCommunicator(this.lifeCycle.RtcErrorEvent, err);
  }

  // /////////////////////// WebRTC Communication Methods /////////////////////////////////////////
  testRTC(msg) {
    return function() {
      const _this = this;
      _this.rtcSend(JSON.stringify({ type: 2, text: msg }));
    }.bind(this);
  }

  sendRtcMessageClosure(type, msg) {
    return function() {
      const _this = this;
      _this.logger('[SEND RTC MESSAGE] type: ', type, ' message: ', msg);
      _this.rtcSend(JSON.stringify({ type: type, data: msg }));
    }.bind(this);
  }

  sendRtcMessage(type, msg) {
    this.logger('[SEND RTC MESSAGE] type: ', type, ' message: ', msg);
    this.rtcSend(JSON.stringify({ type: type, data: msg }));
  }

  disconnectRTCClosure() {
    const _this = this;
    return function() {
      _this.uiCommunicator(_this.lifeCycle.RtcDisconnectEvent);
      _this.rtcDestroy();
      _this.instance = null;
    }.bind(this);
  }

  disconnectRTC() {
    this.rtcDestroy();
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
    this.p.send(JSON.stringify(encryptedSend));
  }

  rtcDestroy() {
    if (this.p !== null) {
      this.p.destroy();
    }
  }

  // ////////////// WebRTC Communication TURN Fallback Initiator/Handler ///////////////////////////
  /**
   * Fallback Step if initial webRTC connection attempt fails.
   * Retries setting up the WebRTC connection using TURN
   */
  retryViaTurn(data) {
    const options = {
      signalListener: this.initiatorSignalListener,
      webRtcConfig: {
        servers: data.data
      }
    };
    this.initiatorStartRTC(this.socket, options);
  }
}

module.exports = MewConnectInitiator;
