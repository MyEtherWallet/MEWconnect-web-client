import createLogger from 'logging';
import debugLogger from 'debug';
import { isBrowser } from 'browser-or-node';

import MewConnectCommon from '../MewConnectCommon';
import MewConnectCrypto from '../MewConnectCrypto';
import MewConnectInitiatorV2 from './MewConnectInitiatorV2';
import MewConnectInitiatorV1 from './MewConnectInitiatorV1';

import WebRtcCommunication from '../WebRtcCommunication';

const debug = debugLogger('MEWconnect:initiator-base');
const debugPeer = debugLogger('MEWconnectVerbose:peer-instances');
const debugStages = debugLogger('MEWconnect:initiator-stages');
const logger = createLogger('MewConnectInitiator');

export default class MewConnectInitiator extends MewConnectCommon {
  constructor(options = {}) {
    super(options.version);
    this.optionVersion = options.version;
    try {
      this.supportedBrowser = MewConnectCommon.checkBrowser();

      this.V1 = {};
      this.V2 = {};

      this.activePeerId = '';
      this.allPeerIds = [];
      this.peersCreated = [];
      this.v1Url = options.v1Url || 'wss://connect.mewapi.io';
      this.v2Url = options.v2Url || 'wss://connect2.mewapi.io/staging';

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
      // this.Peer = SimplePeer;
      this.mewCrypto = options.cryptoImpl || MewConnectCrypto.create();
      this.webRtcCommunication = new WebRtcCommunication(this.mewCrypto);

      this.connPath = '';

      // this.signals = this.jsonDetails.signals;
      // this.signalsV1 = this.jsonDetails.signalsV1;
      // this.signalsV2 = this.jsonDetails.signalsV2;
      // this.rtcEvents = this.jsonDetails.rtc;
      // this.version = this.jsonDetails.version;
      // this.versions = this.jsonDetails.versions;
      this.lifeCycle = this.jsonDetails.lifeCycle;
      this.stunServers = options.stunServers || this.jsonDetails.stunSrvers;
      // this.iceStates = this.jsonDetails.iceConnectionState;
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


  // TODO change this to handle supplying urls at time point
  async initiatorStart(url, testPrivate) {
    this.generateKeys(testPrivate);
    this.displayCode(this.privateKey);
    const options = {
      stunServers: this.stunServers,
      turnTest: this.turnTest,
      version: this.optionVersion,
      uiCommunicator: this.uiCommunicator.bind(this),
      webRtcCommunication: this.webRtcCommunication,
      crypto: this.mewCrypto
    };
    this.webRtcCommunication.on('data', this.dataReceived.bind(this));
    this.V1 = new MewConnectInitiatorV1({ url: this.v1Url, ...options });
    this.V2 = new MewConnectInitiatorV2({ url: this.v2Url, ...options });
    await this.V1.initiatorStart(this.v1Url, this.mewCrypto, {
      signed: this.signed,
      connId: this.connId
    });
    await this.V2.initiatorStart(this.v2Url, this.mewCrypto, {
      signed: this.signed,
      connId: this.connId
    });

    this.V1.on('socketPaired', () =>{
      this.V2.socketDisconnect();
    })

    this.V2.on('socketPaired', () =>{
      this.V1.socketDisconnect();
    })
  }

  disconnectRTC() {
    debugStages('DISCONNECT RTC');
    this.connected = false;
    this.uiCommunicator(this.lifeCycle.RtcDisconnectEvent);
    this.V1.disconnectRTC();
    this.V2.disconnectRTC();
    this.instance = null;
  }

  beginRtcSequence(source, data) {
    console.log('beginRtcSequence', source, data); // todo remove dev item
    if (source === 'V2') {
      this.connPath = 'V2';
      this.V1.socketDisconnect();
      this.beginRtcSequenceV2(data);
    } else if (source === 'V1') {
      this.connPath = 'V1';
      this.socketV2Disconnect();
      this.beginRtcSequenceV2(data);
    }
  }

  async rtcSend(arg) {
    this.webRtcCommunication.rtcSend(arg);
  }

  dataReceived(data) {
    debug('dataReceived', data);
    this.uiCommunicator(data.type, data.data)
  }


  testV1Turn(){
    this.V1.disconnectRTC();
  }

  testV2Turn(){
    this.V2.disconnectRTC();
    this.V2.emit(this.lifeCycle)
  }

}
