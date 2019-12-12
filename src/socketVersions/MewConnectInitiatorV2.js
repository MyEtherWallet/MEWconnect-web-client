import createLogger from 'logging';
import debugLogger from 'debug';
import { isBrowser } from 'browser-or-node';
import uuid from 'uuid/v4';
import WebSocket from '../websocketWrapper';
import SimplePeer from 'simple-peer';
import wrtc from 'wrtc';
import MewConnectCommon from '../MewConnectCommon';
import MewConnectCrypto from '../MewConnectCrypto';
import WebRtcCommunication from '../WebRtcCommunication';

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
      this.v1Url = options.v1Url || 'wss://connect.mewapi.io';
      this.Url = options.Url || 'wss://connect2.mewapi.io/staging';

      this.turnTest = options.turnTest;

      this.destroyOnUnload();
      this.p = null;
      this.socketConnected = false;
      this.socketV1Connected = false;
      this.connected = false;
      this.tryingTurn = false;
      this.turnDisabled = false;
      this.signalUrl = null;
      this.iceState = '';
      this.turnServers = [];

      // this.Peer = options.wrtc || SimplePeer; //WebRTCConnection
      this.Peer = SimplePeer;
      // this.webRtcCommunication = new WebRtcCommunication();
      // this.mewCrypto = options.cryptoImpl || MewConnectCrypto.create();

      this.socket = new WebSocket();
      this.io = io;
      this.connPath = '';

      this.signals = this.jsonDetails.signals;
      this.signalsV1 = this.jsonDetails.signalsV1;
      this.signals = this.jsonDetails.signalsV2;
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

  setWebRtc(webRtcCommunication){
    this.webRtcCommunication = webRtcCommunication;
  }

  static checkBrowser() {
    return MewConnectCommon.checkBrowser();
  }

  static checkWebRTCAvailable() {
    return MewConnectCommon.checkWebRTCAvailable();
  }

  // Returns a boolean indicating whether the socket connection exists and is active
  getSocketConnectionState() {
    return this.socketV1Connected || this.socketConnected;
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

  // async initiatorStart(url, testPrivate) {
  //   this.generateKeys(testPrivate);
  //   this.displayCode(this.privateKey);
  //   this.initiatorStartV1(this.v1Url);
  //   await this.initiatorStart(this.Url);
  // }

  async initiatorStart(url, cryptoInstance) {
    try {
      this.mewCrypto = cryptoInstance;
      this.uiCommunicator(this.lifeCycle.signatureCheck);
      await this.connect(url);
      // this.socket = this.socketManager.connect();
      this.initiatorConnect();
    } catch (e) {
      debug('initiatorStart error:', e);
    }
  }

  // beginRtcSequence(source, data) {
  //   if (source === '') {
  //     this.connPath = '';
  //     this.socketV1Disconnect();
  //     this.beginRtcSequence(data);
  //   } else if (source === 'V1') {
  //     this.connPath = 'V1';
  //     this.socketDisconnect();
  //     this.beginRtcSequence(data);
  //   }
  // }

  async connect(websocketURL, options = null) {
    try {
      // if (!websocketURL)
      //   websocketURL =
      //     'wss://0ec2scxqck.execute-api.us-west-1.amazonaws.com/dev';
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
      await this.socket.connect(this.Url, queryOptions);
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

  async useFallback() {
    this.socketEmit(this.signals.tryTurn, { connId: this.connId });
  }

  socketEmit(signal, data) {
    try {
      this.socket.send(signal, data);
    } catch (e) {
      debug('socketEmit error:', e);
    }
  }

  socketDisconnect() {
    this.socket.disconnect().catch(err => {
      debug('socketDisconnect', err);
    });
    this.socket = {};
    this.socketConnected = false;
  }

  socketOn(signal, func) {
    try {
      this.socket.on(signal, func);
    } catch (e) {
      debug('socketOn error:', e);
    }
  }

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
        this.beginRtcSequence.bind(this, '')
      ); // response
// this.signals.answer
      this.socketOn('answer', this.recieveAnswer.bind(this));
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

  initiated(data) {
    this.uiCommunicator(this.signals.initiated, data);
    debug('initiator', this.signals.initiated, data);
  }

  beginRtcSequence(data) {
    try {
      debug('beginRtcSequence ');
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
      debug(plainTextOffer);
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
      // this.p = new this.Peer(simpleOptions);
      const peerID = this.getActivePeerId();
      // this.p.peerInstanceId = peerID;
      // this.peersCreated.push(this.p);
      // this.rtcEvents.error
      // this.p.on('error', this.onError.bind(this, peerID));
      this.webRtcCommunication.on('connect', this.onConnect.bind(this, peerID));
      this.webRtcCommunication.on('signal', this.sendOffer.bind(this));
      this.webRtcCommunication.on('data', this.onData.bind(this, peerID));
      this.p._pc.addEventListener(
        'iceconnectionstatechange',
        this.stateChangeListener.bind(this, peerID)
      );
    } catch (e) {
      debug('initiatorStartRTC error:', e);
    }
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
      }
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
      return false;
    }
  }

  rtcDestroy() {
    if (this.isAlive()) {
      this.p.destroy();
      this.connected = false;
      this.uiCommunicator(this.lifeCycle.RtcDestroyedEvent);
    }
  }

  retryViaTurn(data) {
    try {
      debugStages('Retrying via TURN v2');
      this.iceServers = null;
      const options = {
        servers: data.iceServers.map(obj => {
          const newObject = {};
          delete Object.assign(newObject, obj, { ['urls']: obj['url'] })['url'];
          return newObject;
        }),
        webRtcConfig: {
          initiator: true,
          trickle: false,
          iceTransportPolicy: 'relay',
          config: {
            iceServers: data.iceServers.map(obj => {
              const newObject = {};
              delete Object.assign(newObject, obj, { ['urls']: obj['url'] })['url'];
              return newObject;
            })
          },
          wrtc: wrtc
        }
      };
      this.initiatorStartRTC(options);
    } catch (e) {
      debug('retryViaTurn error:', e);
    }
  }

}
