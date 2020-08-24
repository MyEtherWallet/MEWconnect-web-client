/* eslint-disable */
import createLogger from 'logging';
import debugLogger from 'debug';

import SimplePeer from 'simple-peer';
import { isBrowser } from 'browser-or-node';

import uuid from 'uuid/v4';
import MewConnectCommon from './MewConnectCommon';

const debug = debugLogger('MEWconnect:webRTC-communication');
const debugPeer = debugLogger('MEWconnectVerbose:peer-instances');
const debugStages = debugLogger('MEWconnect:peer-stages');
const logger = createLogger('WebRtcCommunication');

export default class WebRtcCommunication extends MewConnectCommon {
  constructor(mewCrypto) {
    super();
    this.Peer = SimplePeer;
    this.mewCrypto = mewCrypto;
    this.peersCreated = {};
    this.allPeerIds = [];
    this.iceState = '';
    this.answerReceived = {};
    this.answersReceived = [];
    this.offersSent = -1;
    this.turnTimer = null;
    this.turnWaitTime = 5000;
    this.enableTimer = true;
    this.tryingTurn = false;
    this.connected = false;

    this.signals = this.jsonDetails.signals;
    this.rtcEvents = this.jsonDetails.rtc;
    this.version = this.jsonDetails.version;
    this.versions = this.jsonDetails.versions;
    this.lifeCycle = this.jsonDetails.lifeCycle;
    this.iceStates = this.jsonDetails.iceConnectionState;
    this.activeInitiatorId = null;
    this.usingVersion = '';
    this.p = null;
    this.canSignal = false;
  }

  clearExtraOnConnection() {
    this.peersCreated = {};
    this.allPeerIds = [];
    this.answerReceived = {};
    this.answersReceived = [];
  }

  isAlive() {
    if (this.p !== null) {
      return this.p.connected && !this.p.destroyed;
    }
    return false;
  }

  setConnectionVersion(version) {
    this.usingVersion = version;
  }

  setActiveInitiatorId(id){
    this.activeInitiatorId = id;
  }

  // can be used to listen to specific events, especially those that pass data
  uiCommunicator(event, data) {
    debug(event, data);
    this.emit(event, data);
    this.emitStatus(event);
  }

  // special status emitter to allow simple listening of various statuses in one listener
  emitStatus(event) {
    this.emit('status', event);
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

  setActivePeerId() {
    this.activePeerId = uuid();
    this.allPeerIds.push(this.activePeerId);
  }

  getActivePeerId() {
    const split = this.activePeerId.split('-');
    return split.join('-');
  }

  fallbackTimer(clear) {
    if (this.usingVersion === 'V2') {
      if (clear) {
        clearTimeout(this.turnTimer);
      } else if (this.enableTimer) {
        clearTimeout(this.turnTimer);
        this.turnTimer = setTimeout(() => {
          this.willAttemptTurn();
        }, this.turnWaitTime);
      }
    }
  }

  start(simpleOptions) {
    this.canSignal = !this.canSignal;
    this.fallbackTimer();
    this.setActivePeerId();
    this.p = new this.Peer(simpleOptions);
    const peerID = this.getActivePeerId();
    this.answerReceived[peerID] = false;
    this.p.peerInstanceId = peerID;
    this.peersCreated[peerID] = this.p;
    this.p.on(this.rtcEvents.error, this.onError.bind(this, peerID));
    this.p.on(this.rtcEvents.connect, this.onConnect.bind(this, peerID));
    this.p.on(this.rtcEvents.close, this.onClose.bind(this, peerID));
    this.p.on(this.rtcEvents.data, this.onData.bind(this, peerID));
    this.p.on(this.rtcEvents.signal, this.signalListener.bind(this));
    debug(`active PEER_ID: ${this.p.peerInstanceId}`);
    this.p._pc.addEventListener(
      'iceconnectionstatechange',
      this.stateChangeListener.bind(this, peerID)
    );
  }

  onConnect(peerID) {
    debug('onConnect', peerID);
    this.connected = true;
    this.emit('connect', peerID);
    this.clearExtraOnConnection();
  }

  signalListener(data) {
    if (this.canSignal) {
      this.canSignal = !this.canSignal;
      ++this.offersSent;
      debug('webRTC setup signal received');
      this.emit('signal', data);
    }
  }

  receiveAnswer(plainTextOffer, peerID) {
    debug('receiveAnswer for version: ', this.usingVersion);
    this.fallbackTimer();
    if (this.tryingTurn && this.usingVersion === 'V1') {
      this.answersReceived.push(plainTextOffer);
      if (this.turnTimer === null) {
        const _self = this;
        this.turnTimer = setTimeout(this.receiveTurnAnswer.bind(_self), 1000);
      }
    } else if (this.tryingTurn && this.usingVersion === 'V2') {
      this.enableTimer = false;
      if (this.turnTimer !== null) {
        clearTimeout(this.turnTimer);
      }
      debug('webRtc receiveAnswer');
      debug(`active PEER_ID: ${this.p.peerInstanceId}`);
      try {
        this.p.signal(plainTextOffer);
        debug('webRTC answer received and processed');
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
    } else {
      debug('webRtc receiveAnswer', this.answerReceived);
      debug(`active PEER_ID: ${this.p.peerInstanceId}`);
      try {
        this.answerReceived[this.p.peerInstanceId] = true;
        this.p.signal(plainTextOffer);
        debug('webRTC answer received and processed');
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
    }
  }

  receiveTurnAnswer() {
    const plainTextOffer = this.answersReceived[
      this.answersReceived.length - 1
    ];
    debug('webRtc receiveTurnAnswer', this.answerReceived);
    debug(`active PEER_ID: ${this.p.peerInstanceId}`);
    try {
      this.answerReceived[this.p.peerInstanceId] = true;
      this.p.signal(plainTextOffer);
      debug('webRTC answer received and processed');
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
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
    debugStages('TRY TURN CONNECTION');
    this.uiCommunicator(this.lifeCycle.UsingFallback);
    if (!this.tryingTurn && this.usingVersion === 'V2') {
      debugStages(' TRY TURN V2');
      this.tryingTurn = true;
      try {
        this.useFallback();
        this.uiCommunicator(this.lifeCycle.UsingFallback);
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
    }
    this.tryingTurn = true;
  }

  turnReset(peerId) {
    debug('TURN_RESET');
    this.tryingTurn = true;
    this.answerReceived[peerId] = false;
  }

  useFallback() {
    if (!this.connected) {
      this.emit('useFallback', this.activeInitiatorId);
    }
  }

  // Handle Socket event to initiate turn connection
  // Handle Receipt of TURN server details, and begin a WebRTC connection attempt using TURN
  beginTurn(data) {
    this.tryingTurn = true;
    this.retryViaTurn(data);
  }

  // ----- Failure Handlers

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
      if (
        (evt.target.iceConnectionState === 'failed' ||
          evt.target.iceConnectionState === 'disconnected') &&
        !this.turnDisabled
      ) {
        this.turnDisabled = true;
        this.useFallback();
      }
    }
  }

  // =========================================================
  // =========================================================
  // =========================================================
  async onData(peerID, data) {
    debug('DATA RECEIVED');
    debugPeer('peerID', peerID);
    this.fallbackTimer();

    this.emit('data', data);
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
        this.emit('data', { type: parsed.type, data: parsed.data, id: parsed.id });
      } else {
        this.emit('data', {
          type: decryptedData.type,
          data: decryptedData.data,
         id: decryptedData.id
        });
      }
    } catch (e) {
      logger.error(e);
      debug('onData ERROR: data=', data);
      debug('onData ERROR: data.toString()=', data.toString());
    }
  }

  onClose(peerID, data) {
    debugStages('WRTC onClose event');
    debug('peerID', peerID);
    if (!this.isAlive()) {
      debugStages('WRTC CLOSE', data);
      if (this.connected) {
        this.uiCommunicator(this.lifeCycle.RtcClosedEvent);
        this.uiCommunicator(this.lifeCycle.disconnected);
        this.connected = false;
      } else {
        this.connected = false;
      }
    }
  }

  onError(peerID, err) {
    debugStages('WRTC onError event');
    debug('peerID', peerID);
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

  sendRtcMessageClosure(type, msg, id) {
    return () => {
      debug(`[SEND RTC MESSAGE Closure] type:  ${type},  message:  ${msg}`);
      this.rtcSend(JSON.stringify({ type, data: msg, id }));
    };
  }

  sendRtcMessage(type, msg, id) {
    debug(msg);
    debug(`[SEND RTC MESSAGE] type:  ${type},  message:  ${msg}, id: ${id}`);
    this.rtcSend(JSON.stringify({ type, data: msg, id }));
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
    debug(this.isAlive()); // todo remove dev item
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
    debug('rtcDestroy'); // todo remove dev item
    if (this.isAlive()) {
      this.p.destroy();
      debug('DESTROYED'); // todo remove dev item
      this.connected = false;
      this.uiCommunicator(this.lifeCycle.RtcDestroyedEvent);
    } else if (!this.p.destroyed) {
      try {
        this.p.destroy();
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
    }
  }
}
