import debugLogger from 'debug';
import SimplePeer from 'simple-peer';
import { isBrowser } from 'browser-or-node';
import uuid from 'uuid/v4';
import MewConnectCommon from './MewConnectCommon';

const debug = debugLogger('MEWconnect:webRTC-communication');
const debugPeer = debugLogger('MEWconnectVerbose:peer-instances');
const debugStages = debugLogger('MEWconnect:peer-stages');

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
    this.turnWaitTime = 2000;
    this.enableTimer = true;
    this.tryingTurn = false;
    this.connected = false;
    this.refreshEnabled = false;
    this.sentMessageIds = [];

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
    this.outstandingMobileMessage = false;
    this.channelTest = false;
    this.channelTestTimer = null;
  }

  closeDataChannelForDemo() {
    if (this.isAlive()) {
      this.p._channel.close();
    }
  }

  clearExtraOnConnection() {
    this.peersCreated = {};
    this.allPeerIds = [];
    this.answerReceived = {};
    this.answersReceived = [];
  }

  isAlive() {
    if (this.p !== null) {
      if (this.p._connected && !this.p.destroyed) {
        return true;
      }
      return;
    }
    return false;
  }

  setConnectionVersion(version) {
    this.usingVersion = version;
  }

  setActiveInitiatorId(id) {
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
    if (this.connected && this.turnTimer !== null) {
      clearTimeout(this.turnTimer);
      this.turnTimer = null;
    } else if (this.connected) {
      return;
    }
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
    if (this.p !== null) {
      this.p.destroy();
    }
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
    this.p._pc.addEventListener('icecandidateerror', event => {
      debug('ICE CANIDATE ERROR', event);
    });
  }

  onConnect(peerID) {
    debug('onConnect', peerID);
    this.connected = true;
    this.emit(this.jsonDetails.lifeCycle.RtcConnectedEvent, peerID);
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

  receiveAnswer(plainTextOffer) {
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
    if (!this.connected && this.tryingTurn && this.usingVersion === 'V2') {
      this.refreshQrTimer();
      this.refreshEnabled = false;
    }
    if (!this.tryingTurn && this.usingVersion === 'V2') {
      debugStages('[webRTC Comm.] TRY TURN CONNECTION');
      debugStages(' TRY TURN V2');
      this.tryingTurn = true;
      try {
        this.useFallback();
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
    }
    this.tryingTurn = true;
  }

  refreshQrTimer() {
    setTimeout(() => {
      if (!this.connected && !this.refreshEnabled) {
        this.tryingTurn = false;
        this.refreshEnabled = true;
        this.emit('showRefresh');
        // this.uiCommunicator('showRefresh');
      }
    }, 10000);
  }

  turnReset(peerId) {
    debug('TURN_RESET');
    this.tryingTurn = true;
    this.answerReceived[peerId] = false;
  }

  useFallback() {
    if (!this.connected) {
      this.emit(this.lifeCycle.UsingFallback, this.activeInitiatorId);
    }
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
          // this.emit(this.lifeCycle.RtcConnectedEvent, this.p.peerInstanceId);
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
    if (!this.connected) {
      this.fallbackTimer();
    }
    this.outstandingMobileMessage = false;
    // this.emit('appData', data);
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
        if (this.channelTest && parsed.type === 'address') {
          this.channelTest = false;
          debug('new channel connected');
          return;
        }
        this.emit('appData', {
          type: parsed.type,
          data: parsed.data,
          id: parsed.id
        });
      } else {
        if (this.channelTest && decryptedData.type === 'address') {
          this.channelTest = false;
          debug('new channel connected');
          return;
        }
        this.emit('appData', {
          type: decryptedData.type,
          data: decryptedData.data,
          id: decryptedData.id
        });
      }
      this.initialAddressRequest = 'complete';
    } catch (e) {
      this.uiCommunicator(this.lifeCycle.decryptError);
      console.error(e);
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
        this.connected = false;
        this.uiCommunicator(this.lifeCycle.RtcClosedEvent);
        this.uiCommunicator(this.lifeCycle.disconnected);
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
    if (err.code && this.connected) {
      if (err.code.includes('ERR_DATA_CHANNEL')) {
        if (this.isAlive() && this.p.createNewDataChannel) {
          try {
            debug('re-create dataChannel');
            this.p.createNewDataChannel(uuid());
            if (!this.channelTest && !this.outstandingMobileMessage) {
              this.channelTest = true;
              // this.sendRtcMessage('address', '', '123')
              this.channelTestTimer = setTimeout(() => {
                if (this.channelTest) {
                  debug('new data channel failed to respond');
                  this.disconnectRTC();
                }
              }, 5000);
              return;
            }
          } catch (e) {
            // eslint-disable-next-line
            debug(e);
            this.disconnectRTC();
          }
        }
      }
    }

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
      debug(
        `[WebRTC Comm - SEND RTC MESSAGE Closure] type:  ${type},  message:  ${msg}`
      );
      this.rtcSend(JSON.stringify({ type, data: msg, id }));
    };
  }

  sendRtcMessage(type, msg, id) {
    debug(msg);
    if (type === 'address' && !this.initialAddressRequest) {
      this.initialAddressRequest = 'sent';
    }

    // TODO: could break on batch transactions
    // Doesn't when using mew V5 swap
    if (this.lastSentType !== type) {
      this.lastSentType = type;
      setTimeout(() => {
        this.lastSentType = '';
      }, 100);
    } else {
      return;
    }

    debug(
      `[WebRTC Comm - SEND RTC MESSAGE] type:  ${type},  message:  ${msg}, id: ${id}`
    );
    this.rtcSend(JSON.stringify({ type, data: msg, id })).catch(err => {
      console.error(err);
      debug(err);
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
      if (this.connected) {
        debugStages('DISCONNECT RTC');
        this.connected = false;
        this.uiCommunicator(this.lifeCycle.RtcDisconnectEvent);
        this.rtcDestroy();
        this.instance = null;
      }
    } catch (e) {
      console.error(e);
      debug(e);
    }
  }

  async rtcSend(arg) {
    try {
      debug(this.isAlive());
      if (this.isAlive()) {
        let encryptedSend;
        if (typeof arg === 'string') {
          encryptedSend = await this.mewCrypto.encrypt(arg);
        } else {
          encryptedSend = await this.mewCrypto.encrypt(JSON.stringify(arg));
        }
        this.outstandingMobileMessage = true;
        this.p.send(JSON.stringify(encryptedSend));
        debug('SENDING RTC');
      } else {
        // eslint-disable-next-line
        this.uiCommunicator(this.lifeCycle.attemptedDisconnectedSend);
        console.error(Error('No connection present to send'));
        return false;
      }
    } catch (e) {
      console.error(e);
      debug(e);
    }
  }

  rtcDestroy() {
    debug('rtcDestroy');
    if (this.isAlive()) {
      this.p.destroy();
      debug('DESTROYED');
      this.connected = false;
      this.uiCommunicator(this.lifeCycle.RtcDestroyedEvent);
    } else if (!this.p.destroyed) {
      try {
        this.p.destroy();
      } catch (e) {
        console.error(e);
      }
    }
  }
}
