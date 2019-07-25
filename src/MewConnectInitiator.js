/* eslint-disable */
import createLogger from 'logging';
import debugLogger from 'debug';
import { isBrowser } from 'browser-or-node';
import uuid from 'uuid/v4';
import CryptoUtils from './utils/crypto-utils';
import WebsocketConnection from './utils/basic-websocket-connection';
import WebRTCConnection from './utils/webrtc-connection';
// import io from 'socket.io-client';
// import SimplePeer from 'simple-peer';
import MewConnectCommon from './MewConnectCommon';
import MewConnectCrypto from './MewConnectCrypto';

const debug = debugLogger('MEWconnect:initiator');
const debugPeer = debugLogger('MEWconnectVerbose:peer-instances');
const debugStages = debugLogger('MEWconnect:initiator-stages');
const logger = createLogger('MewConnectInitiator');
// wss://0ec2scxqck.execute-api.us-west-1.amazonaws.com/dev?connId=33e7b913f46109a428c2cf03065c9047&role=initiator&signed=1ba9d582b8723561ab36fa6b072cd0ca10ec2ec38133b2c1f113d4bd5442834f65007966be9b56df443c53b4c295fa91d61b43496daec3bead34c03b5c4e1cab91
export default class MewConnectInitiator extends MewConnectCommon {
  constructor(options = {}) {
    super();

    this.supportedBrowser = MewConnectCommon.checkBrowser();
    this.generateKeys();
    this.socket = new WebsocketConnection();
    this.wrtc = new WebRTCConnection();
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

    // this.io = options.io || io;
    // this.Peer = options.wrtc || SimplePeer;
    this.mewCrypto = options.cryptoImpl || MewConnectCrypto.create();

    this.signals = this.jsonDetails.signals;
    this.rtcEvents = this.jsonDetails.rtc;
    this.version = this.jsonDetails.version;
    this.versions = this.jsonDetails.versions;
    this.lifeCycle = this.jsonDetails.lifeCycle;
    this.stunServers = options.stunServers || this.jsonDetails.stunSrvers;
    this.iceStates = this.jsonDetails.iceConnectionState;

    this.connId = null;
    // Socket is abandoned.  disconnect.
    setTimeout(() => {
      if (this.socket) {
        this.socketDisconnect();
      }
    }, 120000);
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
  generateKeys() {
    const keys = CryptoUtils.generateKeys();
    this.publicKey = keys.publicKey;
    this.privateKey = keys.privateKey;
    this.connId = CryptoUtils.generateConnId(this.publicKey);
    this.signed = CryptoUtils.signMessage(this.privateKey, this.privateKey);
  }

  /*
===================================================================================
  Encryption
===================================================================================
*/

  /**
   * Using the generated privateKey, encrypt a message.
   * The message must be a String, however, if an object is given,
   * it will become stringified for proper encryption.
   *
   * @param  {Object} message - String or Object to be encrypted
   * @return {Object} - Encrypted message
   */
  async encrypt(message) {
    message = typeof message === 'String' ? message : JSON.stringify(message);
    return await CryptoUtils.encrypt(message, this.privateKey);
  }

  /**
   * Decrypt an encrypted message using the generated privateKey.
   *
   * @param  {Object} message - Message to be decrypted.
   * @return {Object} - Decrypted message object
   */
  async decrypt(message) {
    const decryptedMessageString = await CryptoUtils.decrypt(
      message,
      this.privateKey
    );
    return JSON.parse(decryptedMessageString);
  }

  /*
===================================================================================
  Websocket
===================================================================================
*/

  /**
   * Given a @websocketURL, attempt to connect with given query param @options.
   * If no options are given, default to -what should- be the correct parameters.
   *
   * @param  {String} websocketURL - WS/WSS websocket URL
   * @param  {Object} options - (Optional) Connection query parameters
   */
  async connect(websocketURL, options = null) {
    if (!websocketURL) websocketURL = 'wss://0ec2scxqck.execute-api.us-west-1.amazonaws.com/dev';
    if (typeof jest !== 'undefined' && this.connId === null) {
      this.generateKeys();
    }
    const queryOptions = options
      ? options
      : {
        role: this.jsonDetails.stages.initiator,
        connId: this.connId,
        signed: this.signed
      };
    await this.socket.connect(websocketURL, queryOptions);
  }

  /**
   * Bind a particular websocket signal/event to a given callback function.
   *
   * @param  {String} signal - Signal to listen to. E.g. 'onoffer'
   * @param  {Function} fn - Callback function to perform on given signal
   */
  socketOn(signal, fn) {
    this.socket.on(signal, fn);
  }

  /**
   * Unbind listening to a particular signal that was bound in on()
   * @param  {String} signal - Signal to stop listening to. E.g. 'onoffer'
   */
  socketOff(signal) {
    this.socket.off(signal);
  }

  /**
   * Emit a @signal event with a given @data payload.
   *
   * @param  {String} signal - Signal to emit. E.g. 'offersignal'
   * @param  {Object} data - Data/message payload to send
   */
  socketEmit(signal, data) {
    this.socket.send(signal, data);
  }

  /*
  ===================================================================================
    WebRTC
  ===================================================================================
  */

  /**
   * Attempt to create a WebRTC Offer.
   * Return the encrypted offer for transmission to the receiver.
   *
   * @return {Object} - Encrypted WebRTC offer
   */
  async offer(options = null) {
    const offer = await this.wrtc.offer(options);
    return await this.encrypt(offer);
  }

  /**
   * Given a WebRTC response from the receiver, complete p2p connection.
   *
   * @param  {Object} answer - WebRTC answer created by receiver
   */
  async signal(answer) {
    return await this.wrtc.connect(answer);
  }

  /**
   * Disconnect from current WebRTC connection
   */
  async disconnectRTC() {
    this.wrtc = new WebRTCConnection();
  }

  /**
   * On a given @signal event from the WebRTC connection, perform callback function.
   *
   * @param  {String} signal - Signal to listen to. E.g. 'data'
   * @param  {Function} fn - Callback function to perform
   */
  onRTC(signal, fn) {
    this.wrtc.on(signal, fn);
  }

  //==========================================================================================
  //==========================================================================================
  //==========================================================================================

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
        // if (!this.Peer.destroyed || iceStates.includes(this.iceState)) {
        //   this.rtcDestroy();
        // }
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


  // ------------- WebSocket Communication Methods and Handlers ------------------------------

  // ----- Wrapper around Socket.IO methods
  // socket.emit wrapper
  // socketEmit(signal, data) {
  //   this.socket.binary(false).emit(signal, data);
  // }

  // socket.disconnect wrapper
  socketDisconnect() {
    console.log('socket disconnect'); // todo remove dev item
    this.socket.disconnect();
    this.socketConnected = false;
  }

  // socket.on listener registration wrapper
  /**
   * Bind a particular websocket signal/event to a given callback function.
   *
   * @param  {String} signal - Signal to listen to. E.g. 'onoffer'
   * @param  {Function} fn - Callback function to perform on given signal
   */
  // on(signal, fn) {
  //   this.socket.on(signal, fn)
  // }
  // socketOn(signal, func) {
  //   this.socket.on(signal, func);
  // }

  async initiatorStart(url) {
    if (this.signalUrl === null) {
      this.signalUrl = url;
    }
    this.generateKeys();

    this.displayCode(this.privateKey);

    await this.initiatorConnect(this.signalUrl);
  }

  // ----- Setup handlers for communication with the signal server
  async initiatorConnect(url) {
    debugStages('INITIATOR CONNECT');
    this.uiCommunicator(this.lifeCycle.SocketConnectedEvent);
    this.signalUrl = 'wss://0ec2scxqck.execute-api.us-west-1.amazonaws.com/dev';

    // this.socket.on(this.signals.connect, () => {
    //   debugStages('SOCKET CONNECTED');
    //   this.socketConnected = true;
    // });
    this.socketOn(this.signals.initiated, this.initiated.bind(this)); // response

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
    this.socketOn('rtcconnected', data => {
      console.log('initiator rtcconnected'); // todo remove dev item
    })
    this.socketOn(
      this.signals.disconnect,
      this.socketDisconnectHandler.bind(this)
    );




    await this.connect(url);
    // this.socketOn(this.signals.attemptingTurn, this.willAttemptTurn.bind(this));
    this.socketOn(this.signals.turnToken, this.beginTurn.bind(this));
    // return socket;
  }

  initiated(data) {
    // console.log('this.signals.initiated', reason); // todo remove dev item
    this.uiCommunicator(this.signals.initiated, data);
    console.log('initiator', this.signals.initiated, data); // todo remove dev item

  }

  // ----- Socket Event handlers

  // Handle Socket Disconnect Event
  socketDisconnectHandler(reason) {
    console.log('socketDisconnectHandler', reason); // todo remove dev item
    if (typeof jest !== 'undefined') {
      this.uiCommunicator(this.signals.disconnect, reason);
    }
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
    if (typeof jest !== 'undefined') {
      this.uiCommunicator(this.signals.confirmation, data);
      console.log('initiator', this.signals.confirmation); // todo remove dev item
    }
    // this.uiCommunicator(this.lifeCycle.receiverVersion, plainTextVersion);
    // debug('sendOffer', data);
    const offer = await this.offer();
    const message = { data: offer };
    console.log('initiator offer', message); // todo remove dev item
    this.socketEmit(this.signals.offerSignal, message);
    this.initiatorStartRTC();
  }

  initiatorSignalListener(socket, options) {
    this.uiCommunicator(this.lifeCycle.sendOffer);
    debug('SIGNAL', JSON.stringify(data));
  }

  // Handle the WebRTC ANSWER from the opposite (mobile) peer
  async recieveAnswer(data) {
    console.log('signals.answer', data); // todo remove dev item

    if (typeof jest !== 'undefined') {
      this.uiCommunicator(this.signals.answer, data);
      console.log('initiator', this.signals.answer, data); // todo remove dev item
    }
    this.uiCommunicator(this.lifeCycle.answerReceived);
    const webRTCAnswer = await this.decrypt(data.data);
    await this.signal(webRTCAnswer)
    // this.wrtc.signal(webRTCAnswer);
  }

  rtcRecieveAnswer(data) {
    if (typeof jest !== 'undefined') {
      console.log('initiator: answer RTC', this.signals.answer, data); // todo remove dev item
    }

     this.wrtc.signal(JSON.parse(data.data));
  }

  setActivePeerId() {
    this.activePeerId = uuid();
    this.allPeerIds.push(this.activePeerId);
  }

  getActivePeerId() {
    const split = this.activePeerId.split('-');
    return split.join('-');
  }

  initiatorStartRTC() {
    console.log('initiatorStartRTC'); // todo remove dev item
    this.setActivePeerId();
    const peerID = this.getActivePeerId();

    this.onRTC(this.rtcEvents.error, this.onError.bind(this, peerID));
    this.onRTC(this.rtcEvents.connect, this.onConnect.bind(this, peerID));
    this.onRTC(this.rtcEvents.close, this.onClose.bind(this, peerID));
    this.onRTC(this.rtcEvents.data, this.onData.bind(this, peerID));
    // this.onRTC(this.rtcEvents.signal, signalListener.bind(this));
    // this.p._pc.addEventListener(
    //   'iceconnectionstatechange',
    //   this.stateChangeListener.bind(this, peerID)
    // );

    // const webRtcConfig = options.webRtcConfig || {};
    // const signalListener = this.initiatorSignalListener(
    //   socket,
    //   webRtcConfig.servers
    // );
    // const webRtcServers = webRtcConfig.servers || this.stunServers;
    //
    // const suppliedOptions = options.webRtcOptions || {};
    //
    // const defaultOptions = {
    //   initiator: true,
    //   trickle: false,
    //   iceTransportPolicy: 'relay',
    //   config: {
    //     iceServers: webRtcServers
    //   }
    // };
    //
    // const simpleOptions = {
    //   ...defaultOptions,
    //   suppliedOptions
    // };
    // console.log('RTC STEP'); // todo remove dev item
    // debug(`initiatorStartRTC - options: ${simpleOptions}`);
    // this.uiCommunicator(this.lifeCycle.RtcInitiatedEvent);
    // this.p = new this.Peer(simpleOptions);
    // const peerID = this.getActivePeerId();
    // this.p.peerInstanceId = peerID;
    // this.peersCreated.push(this.p);
    // this.p.on(this.rtcEvents.error, this.onError.bind(this, peerID));
    // this.p.on(this.rtcEvents.connect, this.onConnect.bind(this, peerID));
    // this.p.on(this.rtcEvents.close, this.onClose.bind(this, peerID));
    // this.p.on(this.rtcEvents.data, this.onData.bind(this, peerID));
    // this.p.on(this.rtcEvents.signal, signalListener.bind(this));
    // this.p._pc.addEventListener(
    //   'iceconnectionstatechange',
    //   this.stateChangeListener.bind(this, peerID)
    // );
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
        decryptedData = await this.decrypt(
          JSON.parse(data.toString())
        );
      } else {
        decryptedData = await this.decrypt(
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

  // disconnectRTC() {
  //   debugStages('DISCONNECT RTC');
  //   this.connected = false;
  //   this.uiCommunicator(this.lifeCycle.RtcDisconnectEvent);
  //   this.rtcDestroy();
  //   this.instance = null;
  // }

  async rtcSend(arg) {
    if (this.isAlive()) {
      let encryptedSend;
      if (typeof arg === 'string') {
        encryptedSend = await this.encrypt(arg);
      } else {
        encryptedSend = await this.encrypt(JSON.stringify(arg));
      }
      debug('SENDING RTC');
      this.wrtc.peer.send(JSON.stringify(encryptedSend));
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
