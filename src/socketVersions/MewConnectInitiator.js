import createLogger from 'logging';
import debugLogger from 'debug';
import { isBrowser } from 'browser-or-node';
import uuid from 'uuid/v4';
import WebSocket from '../websocketWrapper';
import SimplePeer from 'simple-peer';
import wrtc from 'wrtc';
import MewConnectCommon from '../MewConnectCommon';
import MewConnectCrypto from '../MewConnectCrypto';
// import version1 from './MewConnectInitiatorV1';
// import version2 from './MewConnectInitiatorV2';
import io from 'socket.io-client';

const debug = debugLogger('MEWconnect:initiator');
const debugPeer = debugLogger('MEWconnectVerbose:peer-instances');
const debugStages = debugLogger('MEWconnect:initiator-stages');
const logger = createLogger('MewConnectInitiator');

export default class MewConnectInitiator extends MewConnectCommon {
  constructor(options = {}) {
    super(options.version);

    try {
      this.supportedBrowser = MewConnectCommon.checkBrowser();

      this.activePeerId = '';
      this.allPeerIds = [];
      this.peersCreated = [];
      this.turnTest = options.turnTest;

      this.destroyOnUnload();
      this.p = null;
      this.socketV2Connected = false;
      this.socketV1Connected = false;
      this.connected = false;
      this.tryingTurn = false;
      this.turnDisabled = false;
      this.signalUrl = null;
      this.iceState = '';
      this.turnServers = [];

      // this.Peer = options.wrtc || SimplePeer; //WebRTCConnection
      this.Peer = SimplePeer;
      this.mewCrypto = options.cryptoImpl || MewConnectCrypto.create();

      this.socketV2 = new WebSocket();
      this.io = io;
      this.connPath = '';

      this.signals = this.jsonDetails.signals;
      this.signalsV1 = this.jsonDetails.signalsV1;
      this.signalsV2 = this.jsonDetails.signalsV2;
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
    } catch (e) {
      debug('constructor error:', e);
    }

  }

  isAlive() {
    if (this.p !== null) {
      return this.p.connected && !this.p.destroyed;
    }
    return false;
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
    return this.socketV1Connected || this.socketV2Connected;
  }

  // Returns a boolean indicating whether the WebRTC connection exists and is active
  getConnectonState() {
    return this.connected;
  }

  // can be used to listen to specific events, especially those that pass data
  uiCommunicator(event, data) {
    console.log('uiCommunicator:', event); // todo remove dev item
    this.emit(event, data);
    this.emitStatus(event);
  }

  // special status emitter to allow simple listening of various statuses in one listener
  emitStatus(event) {
    this.emit('status', event);
  }

  // Emit/Provide the details used in creating the QR Code
  displayCode(privateKey) {
    try {
      if (privateKey instanceof Buffer) {
        privateKey = privateKey.toString('hex');
      }
      debug('handshake', privateKey);
      this.socketKey = privateKey;
      const separator = this.jsonDetails.connectionCodeSeparator;
      const qrCodeString =
        this.version + separator + privateKey + separator + this.connId;

      debug(qrCodeString); // todo remove dev item

      this.uiCommunicator(this.lifeCycle.codeDisplay, qrCodeString);
      this.uiCommunicator(this.lifeCycle.checkNumber, privateKey);
      this.uiCommunicator(this.lifeCycle.ConnectionId, this.connId);
    } catch (e) {
      debug('displayCode error:', e);
    }
  }

  /*
===================================================================================
Keys
===================================================================================
*/

  /* Set the public and private keys, connId, and signed that will be used
   * for the duration of the pairing process. The receiver will need to have access
   * to this information as well, however, the initiator creates the credentials to be
   * shared with the receiver.
   */
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
    debug('this.signed', this.signed); // todo remove dev item
  }

  async initiatorStart(url, testPrivate) {
    this.generateKeys(testPrivate);
    this.displayCode(this.privateKey);
    const v1Url = 'wss://connect.mewapi.io';
    this.initiatorStartV1(v1Url);
    const v2Url =
      'wss://0ec2scxqck.execute-api.us-west-1.amazonaws.com/dev';
    await this.initiatorStartV2(v2Url);
  }

  beginRtcSequence(source, data) {
    console.log('source: ', source); // todo remove dev item
    if (source === 'V2') {
      this.connPath = 'V2';
      this.socketV1Disconnect();
      this.beginRtcSequenceV2(data);
    } else if (source === 'V1') {
      this.connPath = 'V1';
      this.socketV2Disconnect();
      console.log(data); // todo remove dev item
      this.beginRtcSequenceV2(data);
    }
  }

  // ===============================================
  // V1
  // ============================================

  // Initalize a websocket connection with the signal server
  async initiatorStartV1(url) {
    // if (this.signalUrl === null) {
    //   this.signalUrl = url;
    // }
    // this.keys = this.mewCrypto.prepareKey();
    const toSign = this.mewCrypto.generateMessage();

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
    this.socketV1 = this.socketManager.connect();
    this.initiatorConnectV1(this.socketV1);
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
    this.socketV2Disconnect();
    console.log('sendOfferV1(data)'); // todo remove dev item
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

  onConnectV1(peerID) {
    console.log('RTC CONNECT'); // todo remove dev item
    debugStages('RTC CONNECT', 'ok');
    debugPeer('peerID', peerID);
    this.connected = true;
    this.turnDisabled = true;
    this.socketV1Emit(this.signalsV1.rtcConnected, this.socketKey);
    this.socketV1Disconnect();
    this.uiCommunicator(this.lifeCycle.RtcConnectedEvent);
  }

  //========================================================
  // V2
  //========================================================

  async connect(websocketURL, options = null) {
    try {
      if (!websocketURL)
        websocketURL =
          'wss://0ec2scxqck.execute-api.us-west-1.amazonaws.com/dev';
      if (typeof jest !== 'undefined' && this.connId === null) {
        // for tests only
        // this.generateKeys();
      }
      const queryOptions = options
        ? options
        : {
          role: this.jsonDetails.stages.initiator,
          connId: this.connId,
          signed: this.signed
        };
      console.log(websocketURL, queryOptions); // todo remove dev item

      debug(websocketURL, queryOptions); // todo remove dev item
      await this.socketV2.connect(websocketURL, queryOptions);
    } catch (e) {
      debug('connect error:', e);
    }
  }

  async regenerateCode() {
    if (this.signalUrl === null) {
      throw Error('regenerateCode called before initial code generation');
    }
    this.socketDisconnect();
    this.initiatorStart(this.signalUrl);
  }

  async useFallbackV2() {
    this.socketV2Emit(this.signalsV2.tryTurn, { connId: this.connId });
  }

  async initiatorStartV2(url, testPrivate) {
    try {
      this.uiCommunicator(this.lifeCycle.signatureCheck);
      await this.connect(url);
      // this.socket = this.socketManager.connect();
      this.initiatorConnectV2();
    } catch (e) {
      debug('initiatorStart error:', e);
    }
  }

  socketV2Emit(signal, data) {
    try {
      this.socketV2.send(signal, data);
    } catch (e) {
      debug('socketEmit error:', e);
    }
  }

  socketV2Disconnect() {
    this.socketV2.disconnect().catch(err => {
      debug('socketDisconnect', err);
    });
    this.socketV2 = {};
    this.socketV2Connected = false;
  }

  socketV2On(signal, func) {
    try {
      this.socketV2.on(signal, func);
    } catch (e) {
      debug('socketOn error:', e);
    }
  }

  initiatorConnectV2() {
    try {
      debugStages('INITIATOR CONNECT');
      this.uiCommunicator(this.lifeCycle.SocketConnectedEvent);

      this.socketV2.on(this.signalsV2.connect, () => {
        debugStages('SOCKET CONNECTED');
        this.socketV2Connected = true;
      });

      this.socketV2On(this.signalsV2.initiated, this.initiated.bind(this)); // response
      this.socketV2On(
        this.signalsV2.confirmation,
        this.beginRtcSequence.bind(this, 'V2')
      ); // response

      this.socketV2On(this.signalsV2.answer, this.recieveAnswerV2.bind(this));
      this.socketV2On(
        this.signalsV2.confirmationFailedBusy,
        this.busyFailure.bind(this)
      );
      this.socketV2On(
        this.signalsV2.confirmationFailed,
        this.confirmationFailure.bind(this)
      );
      this.socketV2On(
        this.signalsV2.invalidConnection,
        this.invalidFailure.bind(this)
      );
      this.socketV2On(
        this.signalsV2.disconnect,
        this.socketDisconnectHandler.bind(this)
      );
      this.socketV2On(
        this.signalsV2.attemptingTurn,
        this.willAttemptTurn.bind(this)
      );
      this.socketV2On(this.signalsV2.turnToken, this.beginTurn.bind(this));
    } catch (e) {
      debug('initiatorConnect error:', e);
    }
  }

  initiated(data) {
    this.uiCommunicator(this.signalsV2.initiated, data);
    debug('initiator', this.signalsV2.initiated, data); // todo remove dev item
  }

  beginRtcSequenceV2(data) {
    try {
      console.log('============================================================================='); // todo remove dev item
      debug('beginRtcSequence V2');
      debug('sendOffer', data);
      this.iceServers = null;
      const options = {
        servers: this.stunServers,
        webRtcConfig: {
          initiator: true,
          trickle: false,
          iceTransportPolicy: 'relay',
          config: {
            iceServers: this.stunServers
          },
          wrtc: wrtc
        }
      };

      this.initiatorStartRTCV2(options);
    } catch (e) {
      debug('beginRtcSequence error:', e);
    }
  }

  async sendOfferV2(data) {
    debug('sendOffer');
    try {
      debug('SIGNAL', JSON.stringify(data));
      const encryptedSend = await this.mewCrypto.encrypt(JSON.stringify(data));
      this.uiCommunicator(this.lifeCycle.sendOffer);
      this.socketV2Emit(this.signalsV2.offerSignal, {
        data: encryptedSend,
        connId: this.connId
      });
    } catch (e) {
      logger.error(e);
      debug('sendOffer error:', e);
    }
  }

  // Handle the WebRTC ANSWER from the opposite (mobile) peer
  async recieveAnswerV2(data) {
    debug('recieved answer'); // todo remove dev item
    try {
      const plainTextOffer = await this.mewCrypto.decrypt(data.data);
      this.uiCommunicator(this.lifeCycle.answerReceived);
      this.p.signal(JSON.parse(plainTextOffer));
    } catch (e) {
      logger.error(e);
      debug('recieveAnswer error:', e);
    }
  }

  setActivePeerId() {
    this.activePeerId = uuid();
    this.allPeerIds.push(this.activePeerId);
  }

  getActivePeerId() {
    const split = this.activePeerId.split('-');
    return split.join('-');
  }

  initiatorStartRTCV2(options) {
    try {
      debug('initiatorStartRTC');
      this.setActivePeerId();
      const webRtcConfig = options.webRtcConfig || {};
      const webRtcServers = webRtcConfig.servers || this.stunServers;

      this.iceServers = null;
      const defaultOptions = {
        initiator: true,
        trickle: false,
        iceTransportPolicy: 'relay',
        config: {
          iceServers: webRtcServers
        },
        wrtc: wrtc
      };

      //
      const simpleOptions = {
        ...defaultOptions,
        ...webRtcConfig
      };

      debug(`initiatorStartRTC - options: ${simpleOptions}`);
      this.uiCommunicator(this.lifeCycle.RtcInitiatedEvent);
      this.p = new this.Peer(simpleOptions);
      const peerID = this.getActivePeerId();
      this.p.peerInstanceId = peerID;
      this.peersCreated.push(this.p);
      this.p.on(this.rtcEvents.error, this.onError.bind(this, peerID));
      this.p.on(this.rtcEvents.connect, this.onConnectV2.bind(this, peerID));
      this.p.on(this.rtcEvents.close, this.onClose.bind(this, peerID));
      this.p.on(this.rtcEvents.data, this.onData.bind(this, peerID));
      this.p.on(this.rtcEvents.signal, this.sendOfferV2.bind(this));
      this.p._pc.addEventListener(
        'iceconnectionstatechange',
        this.stateChangeListener.bind(this, peerID)
      );
    } catch (e) {
      debug('initiatorStartRTC error:', e);
    }
  }

  onConnectV2(peerID) {
    try {
      debugStages('RTC CONNECT', 'ok');
      debugPeer('peerID', peerID);
      this.connected = true;
      this.turnDisabled = true;
      this.socketV2Emit(this.signalsV2.rtcConnected, this.socketKey);
      this.socketV2Disconnect();
      this.uiCommunicator(this.lifeCycle.RtcConnectedEvent);
    } catch (e) {
      debug('onConnect error:', e);
    }
  }

  // =========================================================
  // =========================================================
  // =========================================================
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

  useFallback(){
    if ( this.connPath === 'V2') {
      this.useFallbackV2();
    } else if ( this.connPath === 'V1') {
      this.useFallbackV1()
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
    if (this.connPath === 'V2') {
      this.retryViaTurnV2(data);
    } else if (this.connPath === 'V1') {
      this.retryViaTurnV1(data);
    }
  }

  retryViaTurnV1(data) {
    debugStages('Retrying via TURN');
    const options = {
      signalListener: this.initiatorSignalListener,
      webRtcConfig: {
        servers: data.data
      }
    };
    this.initiatorStartRTCV1(this.socket, options);
  }

  retryViaTurnV2(data) {
    try {
      debugStages('Retrying via TURN');
      const options = {
        signalListener: this.initiatorSignalListener,
        servers: data.iceServers.map(obj => {
          const newObject = {};
          delete Object.assign(newObject, obj, { ['urls']: obj['url'] })['url'];
          return newObject;
        })
      };
      this.initiatorStartRTC(this.socket, options);
    } catch (e) {
      debug('retryViaTurn error:', e);
    }
  }
}
