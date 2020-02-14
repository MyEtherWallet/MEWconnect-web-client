import createLogger from 'logging';
import debugLogger from 'debug';

import SimplePeer from 'simple-peer';
import { isBrowser } from 'browser-or-node';

import uuid from 'uuid/v4';
import MewConnectCommon from './MewConnectCommon';

const debug = debugLogger('MEWconnect:webRTC-communication');
const debugPeer = debugLogger('MEWconnectVerbose:peer-instances');
const debugStages = debugLogger('MEWconnect:initiator-stages');
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

    this.signals = this.jsonDetails.signals;
    this.rtcEvents = this.jsonDetails.rtc;
    this.version = this.jsonDetails.version;
    this.versions = this.jsonDetails.versions;
    this.lifeCycle = this.jsonDetails.lifeCycle;
    this.iceStates = this.jsonDetails.iceConnectionState;
  }

  isAlive() {
    if (this.p !== null) {
      return this.p.connected && !this.p.destroyed;
    }
    return false;
  }

  // can be used to listen to specific events, especially those that pass data
  uiCommunicator(event, data) {
    debug(event, data); // todo remove dev item
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

  start(simpleOptions) {
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
    debug('onConnect', peerID); // todo remove dev item
    this.emit('connect', peerID);
  }

  signalListener(data) {
    ++this.offersSent;
    debug('signalListener'); // todo remove dev item
    this.emit('signal', data);
  }

  receiveAnswer(plainTextOffer, peerID) {
    if (this.tryingTurn) {
      this.answersReceived.push(plainTextOffer);
      if(this.turnTimer === null){
        debug(this.turnTimer); // todo remove dev item
        const _self = this;
        this.turnTimer = setTimeout(this.receiveTurnAnswer.bind(_self), 2000)
      }
    } else {
      debug('webRtc receiveAnswer', this.answerReceived);
      debug(`active PEER_ID: ${this.p.peerInstanceId}`);
      try {
        this.answerReceived[this.p.peerInstanceId] = true;
        debug('recieveAnswer: plaintext', plainTextOffer); // todo remove dev item
        this.p.signal(plainTextOffer);
        debug('============ INITIATOR ================='); // todo remove dev item
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
    }
  }

  receiveTurnAnswer(){
    const plainTextOffer = this.answersReceived[this.answersReceived.length - 1];
    debug('webRtc receiveTurnAnswer', this.answerReceived);
    debug(`active PEER_ID: ${this.p.peerInstanceId}`);
    try {
      this.answerReceived[this.p.peerInstanceId] = true;
      debug('recieveAnswer: plaintext', plainTextOffer); // todo remove dev item
      this.p.signal(plainTextOffer);
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
    debug('DATA RECEIVED', data.toString());
    debugPeer('peerID', peerID);
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
        debug('DECRYPTED DATA RECEIVED 1', parsed);
        debug(parsed.type, parsed.data); // todo remove dev item
        this.emit('data', { type: parsed.type, data: parsed.data });
      } else {
        debug('DECRYPTED DATA RECEIVED 2', decryptedData);
        this.emit('data', {
          type: decryptedData.type,
          data: decryptedData.data
        });
      }
    } catch (e) {
      logger.error(e);
      debug('onData ERROR: data=', data);
      debug('onData ERROR: data.toString()=', data.toString());
    }
  }

  onClose(peerID, data) {
    debugStages('WRTC MAYBE CLOSE');
    debug('peerID', peerID);
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

  turnReset(peerId) {
    debug('TURN_RESET');
    this.tryingTurn = true;
    this.answerReceived[peerId] = false;
  }

  useFallback() {
    this.emit('useFallback');
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
    if (this.isAlive()) {
      this.p.destroy();
      this.connected = false;
      this.uiCommunicator(this.lifeCycle.RtcDestroyedEvent);
    }
  }
}
