import debugLogger from 'debug';
import uuid from 'uuid/v4';
import WebSocket from '../websocketWrapper';
import wrtc from 'wrtc';
import MewConnectCommon from '../MewConnectCommon';
import { stunServers } from '../config';

const debug = debugLogger('MEWconnect:initiator-V2');
const debugTurn = debugLogger('MEWconnect:turn-V2');
const debugStages = debugLogger('MEWconnect:initiator-stages-V2');

export default class MewConnectInitiatorV2 extends MewConnectCommon {
  constructor(options = {}) {
    super('V2');
    try {
      this.uiCommunicator = this.emit; //options.uiCommunicator;
      this.supportedBrowser = MewConnectCommon.checkBrowser();

      this.activePeerId = '';
      this.allPeerIds = [];
      this.peersCreated = [];
      this.Url = options.url || 'wss://connect2.mewapi.io/staging';
      this.active = true;
      this.turnTest = options.turnTest;
      this.socketConnected = false;
      this.socketV1Connected = false;
      this.connected = false;
      this.tryingTurn = false;
      this.turnDisabled = false;
      this.signalUrl = null;
      this.iceState = '';
      this.turnServers = [];
      this.states = this.setResetStates();
      this.offersSent = [];

      this.webRtcCommunication = options.webRtcCommunication;

      this.socket = new WebSocket();

      this.signals = this.jsonDetails.signals;
      this.signals = this.jsonDetails.signalsV2;
      this.rtcEvents = this.jsonDetails.rtc;
      this.version = this.jsonDetails.version;
      this.versions = this.jsonDetails.versions;
      this.lifeCycle = this.jsonDetails.lifeCycle;
      this.stunServers = options.stunServers || this.jsonDetails.stunSrvers;
      this.iceStates = this.jsonDetails.iceConnectionState;
      this.initiatorId = uuid();
      this.isActiveInstance = true;
      this.timer = null;

      this.retryCount = 0;

      // WebRTC options
      this.trickle = false;
    } catch (e) {
      debug('constructor error:', e);
    }
    this.webRtcCommunication.on(this.lifeCycle.UsingFallback, id => {
      debug('USING TURN FALLBACK', id, this.initiatorId);
      if (this.initiatorId === id) {
        this.useFallback();
      } else {
        this.socketDisconnect();
        this.isActiveInstance = false;
      }
    });
  }

  setResetStates() {
    return {
      offerSent: false,
      answerReceived: false
    };
  }

  isAlive() {
    return this.webRtcCommunication.isAlive();
  }

  setWebRtc(webRtcCommunication) {
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

  async initiatorStart(url = this.Url, cryptoInstance, details = {}) {
    this.connId = details.connId;
    this.signed = details.signed;
    try {
      debug('initiatorStart V2');
      this.mewCrypto = cryptoInstance;
      this.uiCommunicator(this.lifeCycle.signatureCheck);
      await this.connect(url);
      this.setupListeners();
    } catch (e) {
      debug('initiatorStart error:', e);
    }
  }
  async connect(websocketURL, options = null) {
    try {
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
    this.retryCount++;
    if (this.retryCount >= 4) {
      this.emit('showRefresh');
      return;
    }
    if (!this.credentialsRequested) {
      this.credentialsRequested = true;
      this.socketEmit(this.signals.tryTurn, { connId: this.connId });
    }
  }

  socketEmit(signal, data) {
    try {
      if (this.socket) this.socket.send(signal, data);
    } catch (e) {
      debug('socketEmit error:', e);
    }
  }

  socketDisconnect() {
    debug(`Socket already disconnected: ${this.active}`);
    this.active = false;
    if (this.socket)
      this.socket.disconnect().catch(err => {
        debug('socketDisconnect', err);
      });
    debug('webSocket Disconnected');
    this.socket = null;
    this.socketConnected = false;
  }

  socketOn(signal, func) {
    try {
      this.socket.on(signal, func);
    } catch (e) {
      debug('socketOn error:', e);
    }
  }

  setupListeners() {
    try {
      debugStages('INITIATOR CONNECT');
      this.uiCommunicator(this.lifeCycle.SocketConnectedEvent);

      this.socket.on(this.signals.connect, () => {
        debugStages('SOCKET CONNECTED');
        this.socketConnected = true;
        this.emit('SOCKET_CONNECTED');
      });

      this.socket.on('onClose', () => {
        debugStages('SOCKET DISCONNECTED');
        this.socketConnected = false;
        if (!this.connected) {
          this.emit('socketDisconnected');
        }
      });
      this.socketOn(this.signals.disconnected, () => {
        this.emit('socketDisconnected');
      });

      this.socketOn(this.signals.initiated, this.initiated.bind(this));

      this.socketOn(this.signals.confirmation, data => {
        if (data !== '' && data) {
          data.iceServers.map(obj => {
            const newObject = {};
            delete Object.assign(newObject, obj, { ['urls']: obj['url'] })[
              'url'
            ];
            return newObject;
          });
          this.beginRtcSequence(data.iceServers);
        } else {
          this.beginRtcSequence(stunServers);
        }
      });
      // this.signals.answer
      this.socketOn('answer', this.recieveAnswer.bind(this));
      // TODO: check if these failure signals are even being used in V2
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
      debug('setupListeners error:', e);
    }
  }

  // Handle Socket Disconnect Event
  socketDisconnectHandler(reason) {
    debug(reason);
    this.socketConnected = false;
  }

  // ----- Failure Handlers
  // Handle Socket Attempting Turn informative signal
  // Provide Notice that initial WebRTC connection failed and the fallback method will be used
  willAttemptTurn() {
    this.tryingTurn = true;
    debugTurn('TRY TURN CONNECTION');
    this.uiCommunicator(this.lifeCycle.UsingFallback);
  }

  // Handle Socket event to initiate turn connection
  // Handle Receipt of TURN server details, and begin a WebRTC connection attempt using TURN
  beginTurn(data) {
    this.tryingTurn = true;
    this.credentialsRequested = false;
    this.webRtcCommunication.turnReset(this.activePeerId);
    this.retryViaTurn(data);
  }

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

  initiated(data) {
    this.uiCommunicator(this.signals.initiated, data);
    debug('initiator', this.signals.initiated, data);
  }

  beginRtcSequence(stunServers) {
    this.emit('socketPaired');
    this.emit('beginRtcSequence', 'V2');
    try {
      debug('beginRtcSequence ');
      debug('sendOffer', stunServers);
      this.iceServers = null;
      this.stunServers = stunServers !== '' ? this.stunServers : stunServers;
      const options = {
        servers: this.stunServers,
        webRtcConfig: {
          initiator: true,
          trickle: this.trickle,
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
    if (!this.isActiveInstance) return;
    // prevent sending duplicate offers
    if (this.offersSent.includes(data.sdp)) return;
    this.offersSent.push(data.sdp);
    // App was waiting for turn data and not sending back an answer
    this.offerTimer = setTimeout(() => {
      this.useFallback();
    }, 5000);
    debug('sendOffer', this.initiatorId);
    try {
      this.emit('sendingOffer');
      debug('SIGNAL', JSON.stringify(data));
      const encryptedSend = await this.mewCrypto.encrypt(JSON.stringify(data));
      this.states.offer = true;
      this.socketEmit(this.signals.offerSignal, {
        data: encryptedSend,
        connId: this.connId
      });
    } catch (e) {
      console.error(e);
      debug('sendOffer error:', e);
    }
  }

  // Handle the WebRTC ANSWER from the opposite (mobile) peer
  async recieveAnswer(data) {
    if (!this.isActiveInstance) return;
    if (this.offerTimer) {
      clearTimeout(this.offerTimer);
    }
    debug('received answer');
    try {
      const plainTextOffer = await this.mewCrypto.decrypt(data.data);
      this.uiCommunicator(this.lifeCycle.answerReceived);
      debug(plainTextOffer);
      this.webRtcCommunication.receiveAnswer(
        JSON.parse(plainTextOffer),
        this.activePeerId
      );
      debug('answer relayed to webRTC instance');
    } catch (e) {
      console.error(e);
      debug('recieveAnswer error:', e);
    }
  }

  setActivePeerId(peerId) {
    this.activePeerId = peerId;
    // this.allPeerIds.push(this.activePeerId);
  }

  getActivePeerId() {
    const split = this.activePeerId.split('-');
    return split.join('-');
  }

  initiatorStartRTC(options) {
    try {
      debug('initiatorStartRTC');
      const webRtcConfig = options.webRtcConfig || {};
      const webRtcServers = webRtcConfig.servers || this.stunServers;

      this.iceServers = null;
      const defaultOptions = {
        initiator: true,
        trickle: this.trickle,
        config: {
          iceServers: webRtcServers
        },
        wrtc: wrtc
      };

      const simpleOptions = {
        ...defaultOptions,
        ...webRtcConfig
      };

      this.webRtcCommunication.setConnectionVersion('V2');
      this.webRtcCommunication.start(simpleOptions);

      debug(`initiatorStartRTC - options: ${simpleOptions}`);
      this.uiCommunicator(this.lifeCycle.RtcInitiatedEvent);
      const peerID = this.webRtcCommunication.getActivePeerId();
      this.setActivePeerId(peerID);
      this.webRtcCommunication.once(
        this.jsonDetails.lifeCycle.RtcConnectedEvent,
        this.onConnect.bind(this, peerID)
      );
      this.webRtcCommunication.once('signal', this.sendOffer.bind(this));
      this.webRtcCommunication.once('data', this.onData.bind(this, peerID));
    } catch (e) {
      debug('initiatorStartRTC error:', e);
    }
  }

  onConnect(peerID) {
    if (!this.isActiveInstance) return;
    try {
      debugStages('RTC CONNECT', 'ok');
      debug('peerID', peerID);
      this.connected = true;
      this.turnDisabled = true;
      this.socketEmit(this.signals.rtcConnected, this.socketKey);
      this.socketDisconnect();
    } catch (e) {
      debug('onConnect error:', e);
    }
  }

  async decryptIncomming(data) {
    if (this.isJSON(data)) {
      const parsedJson = JSON.parse(data);
      if (parsedJson.type && parsedJson.data) {
        return parsedJson;
      }
      return await this.mewCrypto.decrypt(JSON.parse(data));
    }
    if (data.type && data.data) {
      return data;
    }
    return await this.mewCrypto.decrypt(JSON.parse(JSON.stringify(data)));
  }

  async onData(peerID, data) {
    debug(data); // todo remove dev item
    debug('DATA RECEIVED', data.toString());
    debug('peerID', peerID);
  }

  onClose(peerID, data) {
    debugStages('WRTC MAYBE CLOSE');
    debug('peerID', peerID);
    if (!this.isAlive()) {
      debugStages('WRTC CLOSE', data);
      if (this.connected) {
        this.connected = false;
      } else {
        this.connected = false;
      }
    }
  }

  onError(peerID, err) {
    debugStages('WRTC ERROR');
    debug('peerID', peerID);
    debug(err.code);
    debug('error', err);
    if (!this.connected && !this.tryingTurn && !this.turnDisabled) {
      this.useFallback();
    } else if (!this.connected && this.tryingTurn && !this.turnDisabled) {
      this.emit('ShowReload');
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
    debugStages('V2 DISCONNECT RTC');
    if (this.connected) {
      this.connected = false;
      this.uiCommunicator(this.lifeCycle.RtcDisconnectEvent);
      this.rtcDestroy();
      this.instance = null;
    }
  }

  retryViaTurn(data) {
    try {
      this.emit('retryingViaTurn');
      this.states = this.setResetStates();
      debugTurn('Retrying via TURN v2');
      this.iceServers = null;
      const options = {
        servers: data.iceServers.map(obj => {
          const newObject = {};
          delete Object.assign(newObject, obj, { ['urls']: obj['url'] })['url'];
          return newObject;
        }),
        webRtcConfig: {
          initiator: true,
          trickle: this.trickle,
          config: {
            iceServers: data.iceServers.map(obj => {
              const newObject = {};
              delete Object.assign(newObject, obj, { ['urls']: obj['url'] })[
                'url'
              ];
              return newObject;
            })
          },
          wrtc: wrtc
        }
      };
      debug('turn info arrived and begin turn'); // todo remove dev item
      this.initiatorStartRTC(options);
    } catch (e) {
      debugTurn('retryViaTurn error:', e);
    }
  }
}
