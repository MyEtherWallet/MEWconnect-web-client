import debugLogger from 'debug';
import { isBrowser } from 'browser-or-node';
import { V1endpoint, V2endpoint } from '../config';
import uuid from 'uuid/v4';

import MewConnectCommon from '../MewConnectCommon';
import MewConnectCrypto from '../MewConnectCrypto';
import MewConnectInitiatorV2 from './MewConnectInitiatorV2';
import MewConnectInitiatorV1 from './MewConnectInitiatorV1';

import PopUpCreator from '../../connectWindow/popUpCreator';
import MEWconnectWallet from '../../connectProvider/web3Provider/MEWconnect/index';
import PopUpHandler from '../../connectWindow/popUpHandler';

import WebRtcCommunication from '../WebRtcCommunication';
import { DISCONNECTED, CONNECTED } from '../../config';
import packageJson from '../../../package.json';

const debug = debugLogger('MEWconnect:initiator-base');
const debugStages = debugLogger('MEWconnect:initiator-stages');
const debugConnectionState = debugLogger('MEWconnect:connection-state');
let qrString;
export default class MewConnectInitiator extends MewConnectCommon {
  constructor(options = {}) {
    super(options.version);
    this.optionVersion = options.version || 2.0;
    this.showPopup = options.showPopup || false;
    try {
      this.supportedBrowser = MewConnectCommon.checkBrowser();
      this.requestIds = [];
      this.V1 = {};
      this.V2 = {};

      this.activePeerId = '';
      this.allPeerIds = [];
      this.peersCreated = [];
      this.v1Url = options.v1Url || V1endpoint;
      this.v2Url = options.v2Url || V2endpoint;

      this.turnTest = options.turnTest;

      this.destroyOnUnload(typeof window !== 'undefined');
      this.p = null;
      this.socketV2Connected = false;
      this.socketV1Connected = false;
      this.showingQR = false;
      this.connected = false;
      this.tryingTurn = false;
      this.turnDisabled = false;
      this.signalUrl = null;
      this.iceState = '';
      this.turnServers = [];
      this.refreshDelay = 20000;
      this.socketsCreated = false;
      this.refreshCount = 0;
      this.abandonedTimeout = 300000;
      this.showingRefresh = false;

      this.mewCrypto = options.cryptoImpl || MewConnectCrypto.create();
      this.webRtcCommunication = new WebRtcCommunication(this.mewCrypto);
      this.popupCreator = options.popupCreator
        ? options.popupCreator
        : options.newPopupCreator
        ? new PopUpCreator()
        : undefined;

      debugConnectionState(
        'Initial Connection State:',
        MewConnectInitiator.getConnectionState()
      );
      this.version = this.jsonDetails.version;
      this.lifeCycle = this.jsonDetails.lifeCycle;
      this.iceStates = this.jsonDetails.iceConnectionState;
      this.stunServers = options.stunServers || this.jsonDetails.stunSrvers;

      // Socket is abandoned.  disconnect.
      this.timer = null;
      setTimeout(() => {
        if (this.socket) {
          this.socketDisconnect();
        }
      }, this.abandonedTimeout);

      console.log(`Using MEWconnect v${packageJson.version}`);
    } catch (e) {
      debug('constructor error:', e);
    }
  }

  static setConnectionState(connectionState) {
    if (!connectionState) MewConnectInitiator.connectionState = DISCONNECTED;
    else MewConnectInitiator.connectionState = connectionState;
  }

  static getConnectionState() {
    if (!MewConnectInitiator.connectionState) return DISCONNECTED;
    return MewConnectInitiator.connectionState;
  }

  async createWalletOnly(network) {
    this.popUpHandler = new PopUpHandler();
    return MEWconnectWallet({ network }, this.popupCreator, this.popUpHandler);
  }

  isAlive() {
    if (this.p !== null) {
      return this.p.connected && !this.p.destroyed;
    }
    return false;
  }

  focusPopupWindow() {
    if (!this.popupCreator) return;
    if (this.popupCreator.popupWindowOpen) {
      this.popupCreator.popupWindow.focus();
    }
  }

  // Check if a WebRTC connection exists before a window/tab is closed or refreshed
  // Destroy the connection if one exists
  destroyOnUnload() {
    if (isBrowser) {
      try {
        // eslint-disable-next-line no-undef
        if (!window) return;
        // eslint-disable-next-line no-undef
        window.onunload = window.onbeforeunload = () => {
          const iceStates = [
            this.iceStates.new,
            this.iceStates.connecting,
            this.iceStates.connected
          ];
          if (this.Peer) {
            if (!this.Peer.destroyed || iceStates.includes(this.iceState)) {
              this.rtcDestroy();
            }
          }
          if (this.popupCreator) {
            this.popupCreator.removeWindowClosedListener();
            this.popupCreator.closePopupWindow();
          }
        };
      } catch (e) {
        debug(e);
      }
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
    debug('MewConnectInitiator event emitted', event);
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
      let dapp = 'example';
      if (typeof window !== 'undefined') {
        dapp = window.location.hostname;
      }
      debug('handshake', privateKey);
      this.socketKey = privateKey;
      const separator = this.jsonDetails.connectionCodeSeparator;
      let qrCodeString =
        this.version +
        separator +
        privateKey +
        separator +
        this.connId +
        ':name=' +
        dapp.replace(/^www\./, '');
      if (dapp.includes('myetherwallet.com')) {
        qrCodeString =
          this.version + separator + privateKey + separator + this.connId;
      } else if (dapp.includes('mewbuilds.com')) {
        qrCodeString =
          this.version + separator + privateKey + separator + this.connId;
      } else if (dapp.includes('localhost')) {
        qrCodeString =
          this.version + separator + privateKey + separator + this.connId;
      }

      qrString = qrCodeString;

      debug(qrCodeString);
    } catch (e) {
      debug('displayCode error:', e);
    }
  }

  ShowQr(qrCodeString) {
    const unloadOrClosed = () => {
      if (!this.connected) {
        // eslint-disable-next-line no-console
        debug('popup window closed');
        this.uiCommunicator('popup_window_closed');
        MewConnectInitiator.setConnectionState();
        this.socketDisconnect();
        this.emit(this.lifeCycle.AuthRejected);
      }
    };

    debug(qrCodeString);
    if (this.showPopup) {
      if (this.popupCreator.popupWindowOpen) {
        if (this.popupCreator) this.popupCreator.updateQrCode(qrCodeString);
      } else {
        if (this.popupCreator)
          this.popupCreator.refreshQrcode = this.initiatorStart.bind(this);
        this.popupCreator.openPopupWindow(qrCodeString);
        if (this.popupCreator)
          this.popupCreator.container.addEventListener(
            'mewModalClosed',
            unloadOrClosed,
            { once: true }
          );
      }
    } else {
      this.uiCommunicator(this.lifeCycle.codeDisplay, qrCodeString);
      // this.uiCommunicator(this.lifeCycle.checkNumber, privateKey);
      this.uiCommunicator(this.lifeCycle.ConnectionId, this.connId);
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
    debug('this.signed', this.signed);
  }

  async refreshCode() {
    // this.showingRefresh = false;
    const v2Events = [
      'sendingOffer',
      'retryingViaTurn',
      'socketDisconnected',
      'socketPaired'
    ];
    const webRtcCommEvents = [
      'disconnected',
      'data',
      'UsingFallback',
      'showRefresh',
      'decryptError',
      'RtcConnectedEvent',
      'signal'
    ];
    // "sendingOffer", "retryingViaTurn", "socketDisconnected", "socketPaired"
    // "disconnected", "data", "UsingFallback", "showRefresh", "decryptError", "RtcConnectedEvent", "signal"
    webRtcCommEvents.forEach(event =>
      this.webRtcCommunication.removeAllListeners(event)
    );
    v2Events.forEach(event => this.V2.removeAllListeners(event));
    this.V2.socketDisconnect();

    if (this.popupCreator) this.popupCreator.popupWindowOpen = true;
    this.webRtcCommunication = new WebRtcCommunication(this.mewCrypto);
    this.initiatorStart();
  }

  // TODO change this to use supplied urls at time point
  async initiatorStart(url, testPrivate) {
    if (this.socketV1Connected) {
      this.V1.socketDisconnect();
    }
    if (this.socketV2Connected) {
      this.V2.socketDisconnect();
    }
    this.generateKeys(testPrivate);
    this.displayCode(this.privateKey);
    this.webRtcCommunication.once(
      this.lifeCycle.disconnected,
      this.uiCommunicator.bind(this, this.lifeCycle.RtcClosedEvent)
    );
    const options = {
      stunServers: this.stunServers,
      turnTest: this.turnTest,
      version: this.optionVersion,
      uiCommunicator: this.uiCommunicator.bind(this),
      webRtcCommunication: this.webRtcCommunication,
      crypto: this.mewCrypto
    };
    this.webRtcCommunication.on('data', this.dataReceived.bind(this));
    try {
      this.V2 = new MewConnectInitiatorV2({ url: V2endpoint, ...options });
      await this.V2.initiatorStart(V2endpoint, this.mewCrypto, {
        signed: this.signed,
        connId: this.connId
      });

      this.V2.on('sendingOffer', () => {
        if (this.popupCreator) this.popupCreator.showConnecting();
      });

      this.V2.on('retryingViaTurn', () => {
        this.showingRefresh = false; // reset refresh
      });
      const regenerateQRcodeOnClick = () => {
        debug('REGENERATE');
        this.refreshCode();
      };

      const showRefresh = () => {
        if (!this.connected) {
          if (!this.showingRefresh) {
            this.showingRefresh = true; // only process one refresh event
            if (this.popupCreator)
              this.popupCreator.showRetry(regenerateQRcodeOnClick);
          }
        }
      };

      this.V2.on('socketDisconnected', showRefresh.bind(this));
      this.V2.on('showRefresh', showRefresh.bind(this));
      this.webRtcCommunication.on('showRefresh', showRefresh.bind(this));

      this.webRtcCommunication.on(this.lifeCycle.decryptError, () => {
        if (this.webRtcCommunication.initialAddressRequest !== 'complete') {
          MewConnectInitiator.setConnectionState(DISCONNECTED);
          this.webRtcCommunication.rtcDestroy();
        }
      });
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
      this.V2 = null;
    }

    try {
      this.V1 = new MewConnectInitiatorV1({ url: V1endpoint, ...options });
      await this.V1.initiatorStart(V1endpoint, this.mewCrypto, {
        signed: this.signed,
        connId: this.connId
      });
    } catch (e) {
      console.error(e);
      this.V1 = {};
    }

    this.webRtcCommunication.setActiveInitiatorId(this.V2.initiatorId);
    const connectionErrorTimeOut = setTimeout(() => {
      window.alert('Failed to start MEWconnect. Please try again.');
    }, 60000);

    if (this.V1.on) {
      this.V1.on('socketPaired', () => {
        if (this.V2.socketDisconnect) this.V2.socketDisconnect();
        this.socketV1Connected = true;
      });
      this.V1.once('SOCKET_CONNECTED', () => {
        if (!this.showingQR) {
          clearTimeout(connectionErrorTimeOut);
          this.showingQR = true;
          this.ShowQr(qrString);
        }
      });
    }

    if (this.V2.on) {
      this.V2.on('socketPaired', () => {
        if (this.V1.socketDisconnect) this.V1.socketDisconnect();
        this.socketV2Connected = true;
      });
      this.V2.once('SOCKET_CONNECTED', () => {
        if (!this.showingQR) {
          clearTimeout(connectionErrorTimeOut);
          this.showingQR = true;
          this.ShowQr(qrString);
        }
      });
    }

    this.webRtcCommunication.once(
      this.jsonDetails.lifeCycle.RtcConnectedEvent,
      () => {
        this.webRtcCommunication.removeAllListeners(
          this.jsonDetails.lifeCycle.RtcConnectedEvent
        );
        debug('RTC CONNECTED ENVIRONMENT SETUP');
        this.emit(this.lifeCycle.RtcConnectedEvent);
        this.webRtcCommunication.on('appData', this.dataReceived.bind(this));
        this.connected = true;
        if (this.popupCreator) this.popupCreator.removeWindowClosedListener();
        if (this.popupCreator) this.popupCreator.closePopupWindow();
        MewConnectInitiator.setConnectionState(CONNECTED);
      }
    );
  }

  socketDisconnect() {
    this.V2.socketDisconnect();
    this.V1.socketDisconnect();
  }

  disconnectRTC() {
    if (this.connected) {
      debugStages('DISCONNECT RTC');
      this.uiCommunicator(this.lifeCycle.RtcDisconnectEvent);
      this.webRtcCommunication.disconnectRTC();
      this.connected = false;
      this.instance = null;
    }
  }

  async rtcSend(arg) {
    await this.webRtcCommunication.rtcSend(arg);
  }

  sendRtcMessage(type, data) {
    const id = uuid();
    this.requestIds.push(id);
    debug('MESSAGE IDS KNOWN', this.requestIds);
    this.webRtcCommunication.sendRtcMessage(type, data, id);
  }

  dataReceived(data) {
    debug('dataReceived', data);
    if (data.id) {
      debug('MESSAGE ID RECEIVED', data.id);
      if (this.requestIds.includes(data.id)) {
        this.uiCommunicator(data.type, data.data);
        const idx = this.requestIds.findIndex(item => item === data.id);
        this.requestIds.splice(idx, 1);
        debug('MESSAGE IDS KNOWN', this.requestIds);
      } else {
        debug('**NO MESSAGE ID RECEIVED : field present**');
        this.uiCommunicator(data.type, data.data);
      }
    } else {
      debug('**NO MESSAGE ID RECEIVED : field absent**');
      this.uiCommunicator(data.type, data.data);
    }
  }

  testV1Turn() {
    this.V1.disconnectRTC();
  }

  testV2Turn() {
    this.V2.disconnectRTC();
    this.V2.emit(this.lifeCycle);
  }
}
