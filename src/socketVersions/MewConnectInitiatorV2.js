import createLogger from 'logging';
import debugLogger from 'debug';
import { isBrowser } from 'browser-or-node';
import uuid from 'uuid/v4';
import WebSocket from '../websocketWrapper';
import SimplePeer from 'simple-peer';
import wrtc from 'wrtc';
import MewConnectCommon from '../MewConnectCommon';
import MewConnectCrypto from '../MewConnectCrypto';

const debug = debugLogger('MEWconnect:initiator');
const debugPeer = debugLogger('MEWconnectVerbose:peer-instances');
const debugStages = debugLogger('MEWconnect:initiator-stages');
const logger = createLogger('MewConnectInitiator');

export default class MewConnectInitiatorV2 extends MewConnectCommon {
  constructor(options = {}) {
    super(options.version);

    try {
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

      // this.Peer = options.wrtc || SimplePeer; //WebRTCConnection
      this.Peer = SimplePeer;
      this.mewCrypto = options.cryptoImpl || MewConnectCrypto.create();

      this.socket = new WebSocket();

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

  // Factory function to create instance using default supplied libraries
  static init(opts) {
    const options = opts !== null ? opts : {};
    return new MewConnectInitiatorV2(options);
  }

  // Check if a WebRTC connection exists before a window/tab is closed or refreshed
  // Destroy the connection if one exists
  destroyOnUnload() {
    try {
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
    } catch (e) {
      debug('destroyOnUnload error:', e);
    }
  }

  static checkBrowser() {
    return MewConnectCommon.checkBrowser();
  }

  static checkWebRTCAvailable() {
    return MewConnectCommon.checkWebRTCAvailable();
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
    debug('this.signed', this.signed);
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

      debug(websocketURL, queryOptions);
      await this.socket.connect(websocketURL, queryOptions);
    } catch (e) {
      debug('connect error:', e);
    }
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
  async initiatorStart(url, testPrivate) {
    try {
      if (this.signalUrl === null) {
        this.signalUrl = url;
      }
      this.generateKeys(testPrivate);
      this.displayCode(this.privateKey);
      this.uiCommunicator(this.lifeCycle.signatureCheck);
      await this.connect(this.signalUrl);
      // this.socket = this.socketManager.connect();
      this.initiatorConnect();
    } catch (e) {
      debug('initiatorStart error:', e);
    }
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
      debug(qrCodeString);

      this.uiCommunicator(this.lifeCycle.codeDisplay, qrCodeString);
      this.uiCommunicator(this.lifeCycle.checkNumber, privateKey);
      this.uiCommunicator(this.lifeCycle.ConnectionId, this.connId);
    } catch (e) {
      debug('displayCode error:', e);
    }
  }

  // ------------- WebSocket Communication Methods and Handlers ------------------------------

  // ----- Wrapper around Socket.IO methods
  // socket.emit wrapper
  socketEmit(signal, data) {
    try {
      this.socket.send(signal, data);
    } catch (e) {
      debug('socketEmit error:', e);
    }
  }

  // socket.disconnect wrapper
  socketDisconnect() {
    this.socket.disconnect().catch(err => {
      debug('socketDisconnect', err);
    });
    this.socketConnected = false;
  }

  // socket.on listener registration wrapper
  socketOn(signal, func) {
    try {
      this.socket.on(signal, func);
    } catch (e) {
      debug('socketOn error:', e);
    }
  }

  // ----- Setup handlers for communication with the signal server
  initiatorConnect() {
    try {
      debugStages('INITIATOR CONNECT');
      this.uiCommunicator(this.lifeCycle.SocketConnectedEvent);

      this.socket.on(this.signals.connect, () => {
        debugStages('SOCKET CONNECTED');
        this.socketConnected = true;
      });

      this.socketOn(this.signals.initiated, this.initiated.bind(this)); // response
      this.socketOn(
        this.signals.confirmation,
        this.beginRtcSequence.bind(this)
      ); // response

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
      this.socketOn(
        this.signals.attemptingTurn,
        this.willAttemptTurn.bind(this)
      );
      this.socketOn(this.signals.turnToken, this.beginTurn.bind(this));
    } catch (e) {
      debug('initiatorConnect error:', e);
    }
  }

  // ----- Socket Event handlers

  initiated(data) {
    this.uiCommunicator(this.signals.initiated, data);
    debug('initiator', this.signals.initiated, data);
  }

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
  beginRtcSequence(data) {
    try {
      debug('beginRtcSequence');
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

      this.initiatorStartRTC(options);
    } catch (e) {
      debug('beginRtcSequence error:', e);
    }
  }

  async sendOffer(data) {
    debug('sendOffer');
    try {
      debug('SIGNAL', JSON.stringify(data));
      const encryptedSend = await this.mewCrypto.encrypt(JSON.stringify(data));
      this.uiCommunicator(this.lifeCycle.sendOffer);
      this.socketEmit(this.signals.offerSignal, {
        data: encryptedSend,
        connId: this.connId
      });
    } catch (e) {
      logger.error(e);
      debug('sendOffer error:', e);
    }
  }

  // Handle the WebRTC ANSWER from the opposite (mobile) peer
  async recieveAnswer(data) {
    debug('recieved answer');
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

  initiatorStartRTC(options) {
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
      this.p.on(this.rtcEvents.connect, this.onConnect.bind(this, peerID));
      this.p.on(this.rtcEvents.close, this.onClose.bind(this, peerID));
      this.p.on(this.rtcEvents.data, this.onData.bind(this, peerID));
      this.p.on(this.rtcEvents.signal, this.sendOffer.bind(this));
      this.p._pc.addEventListener(
        'iceconnectionstatechange',
        this.stateChangeListener.bind(this, peerID)
      );
    } catch (e) {
      debug('initiatorStartRTC error:', e);
    }
  }

  // ----- WebRTC Communication Event Handlers

  stateChangeListener(peerID, evt) {
    try {
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
    } catch (e) {
      debug('stateChangeListener error:', e);
    }
  }

  onConnect(peerID) {
    try {
      debugStages('RTC CONNECT', 'ok');
      debugPeer('peerID', peerID);
      this.connected = true;
      this.turnDisabled = true;
      this.socketEmit(this.signals.rtcConnected, this.socketKey);
      this.socketDisconnect();
      this.uiCommunicator(this.lifeCycle.RtcConnectedEvent);
    } catch (e) {
      debug('onConnect error:', e);
    }
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
    try {
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
    } catch (e) {
      debug('onClose error:', e);
    }
  }

  onError(peerID, err) {
    debugStages('WRTC ERROR');
    debugPeer('peerID', peerID);
    debug(err.code);
    debug('error', err);
    if (!this.connected && !this.tryingTurn && !this.turnDisabled) {
      this.useFallback().catch(err => {
        debug('onError', err);
      });
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
      this.rtcSend(JSON.stringify({ type, data: msg })).catch(err => {
        debug('sendRtcMessageClosure', err);
      });
    };
  }

  sendRtcMessage(type, msg) {
    debug(`[SEND RTC MESSAGE] type:  ${type},  message:  ${msg}`);
    this.rtcSend(JSON.stringify({ type, data: msg })).catch(err => {
      debug('sendRtcMessage', err);
    });
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
    try {
      debugStages('DISCONNECT RTC');
      this.connected = false;
      this.uiCommunicator(this.lifeCycle.RtcDisconnectEvent);
      this.rtcDestroy();
      this.instance = null;
    } catch (e) {
      debug('disconnectRTC error:', e);
    }
  }

  async rtcSend(arg) {
    try {
      if (this.isAlive()) {
        let encryptedSend;
        if (typeof arg === 'string') {
          encryptedSend = await this.mewCrypto.encrypt(arg);
        } else {
          encryptedSend = await this.mewCrypto.encrypt(JSON.stringify(arg));
        }
        debug('SENDING RTC');
        this.p.send(JSON.stringify(encryptedSend));
        return true;
      }
      // eslint-disable-next-line
      this.uiCommunicator(this.lifeCycle.attemptedDisconnectedSend);
      return false;
    } catch (e) {
      debug('rtcSend error:', e);
    }
  }

  rtcDestroy() {
    try {
      if (this.isAlive()) {
        this.p.destroy();
        this.connected = false;
        this.uiCommunicator(this.lifeCycle.RtcDestroyedEvent);
      }
    } catch (e) {
      debug('rtcDestroy', e);
    }
  }

  // ----- WebRTC Communication TURN Fallback Initiator/Handler
  // Fallback Step if initial webRTC connection attempt fails.
  // Retries setting up the WebRTC connection using TURN
  retryViaTurn(data) {
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

  // ======================== [End] WebRTC Communication Methods =============================
}
