// const eccrypto = require('eccrypto');
// const ethUtils = require('ethereumjs-util');
// const crypto = require('crypto');
// const secp256k1 = require('secp256k1');
// const buffer = require('buffer').Buffer;
const io = require('socket.io-client');
const SimplePeer = require('simple-peer');

const MewConnectCrypto = require('./MewConnectCrypto');
const MewConnectCommon = require('./MewConnectCommon');

class MewConnectReceiver extends MewConnectCommon {
  /**
   *
   * @param uiCommunicatorFunc
   * @param loggingFunc
   * @param additionalLibs
   */
  constructor(uiCommunicatorFunc, loggingFunc, additionalLibs) {
    super(uiCommunicatorFunc, loggingFunc);
    // eslint-disable-next-line no-param-reassign
    additionalLibs = additionalLibs || {};
    if (this.isBrowser) {
      // eslint-disable-next-line no-undef,no-multi-assign,no-unused-vars
      window.onunload = window.onbeforeunload = function (e) {
        const _this = this;
        if (!!this.Peer && !this.Peer.destroyed) {
          _this.rtcDestroy();
        }
      };
    }

    this.p = null;
    this.tryTurn = true;
    this.triedTurn = false;

    this.io = additionalLibs.io || io;

    this.signals = this.jsonDetails.signals;
    this.rtcEvents = this.jsonDetails.rtc;
    this.version = this.jsonDetails.version;
    this.versions = this.jsonDetails.versions;

    console.log(this.versions); // todo remove dev item
    // Library used to facilitate the WebRTC connection and subsequent communications
    this.Peer = additionalLibs.wrtc || SimplePeer;
    this.nodeWebRTC = additionalLibs.webRTC || null;

    // Initial (STUN) server set used to initiate a WebRTC connection
    this.stunServers = [
      { url: 'stun:global.stun.twilio.com:3478?transport=udp' },
    ];
    // Initialization of the array to hold the TURN
    // server information if the initial connection attempt fails
    this.turnServers = [];

    // Object with specific methods used in relation to cryptographic operations
    this.mewCrypto = additionalLibs.cryptoImpl || MewConnectCrypto.create();
    // this.mewCrypto = additionalLibs.cryptoImpl || new MewConnect.Crypto({
    //     eccrypto,
    //     crypto,
    //     secp256k1,
    //     ethUtils,
    //     buffer
    //   });
  }

  /**
   * Helper method for parsing the connection details string (data in the QR Code)
   */
  // eslint-disable-next-line consistent-return
  parseConnectionCodeString(str) {
    try {
      const connParts = str.split(this.jsonDetails.connectionCodeSeparator);
      // console.log('connParts', connParts);
      if (this.versions.indexOf(connParts[0].trim()) > -1) {
        return {
          connId: connParts[2].trim(),
          key: connParts[1].trim(),
          version: connParts[0].trim(),
        };
      }
      return {
        connId: connParts[1].trim(),
        key: connParts[0].trim(),
      };
    } catch (e) {
      console.error(e);
    }
  }

  // ////////////// Initialize Communication Process //////////////////////////////

  /**
   * The reply method called to continue the exchange that can create a WebRTC connection
   */
  async receiverStart(url, params) {
    const _this = this;
    console.log(url, params); // todo remove dev item
    try {
      console.log(params);
      // Set the private key sent via a QR code scan
      this.mewCrypto.setPrivate(params.key); // todo uncomment after dev
      const signed = await this.mewCrypto.signMessage(params.key);
      this.connId = params.connId;
      const options = {
        query: {
          signed,
          connId: this.connId,
          stage: 'receiver',
        },
        secure: true,
      };
      console.log('receiverStart options', options);
      this.socketManager = this.io(url, options);
      this.socket = this.socketManager.connect();

      // (currently redundant) send details to server to identify
      // identity and locate an opposing peer
      this.socketOn(this.signals.handshake, this.socketHandshake.bind(this));
      // Handle the WebRTC OFFER from the opposite (web) peer
      this.socketOn(this.signals.offer, this.processOfferReceipt.bind(this));
      // Handle Failure due to no opposing peer existing
      this.socketOn(this.signals.invalidConnection, () => {
        _this.uiCommunicator('InvalidConnection');
      });
      // Handle Receipt of TURN server details, and begin a WebRTC connection attempt using TURN
      this.socketOn(this.signals.turnToken, (data) => {
        this.retryViaTurn(data);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // eslint-disable-next-line no-unused-vars
  async socketHandshake(data) {
    this.signed = await this.mewCrypto.signMessage(this.mewCrypto.prvt.toString('hex'));
    this.uiCommunicator('signatureCheck', this.signed);
    const encryptedVersion = await this.mewCrypto.encrypt(this.version);
    this.socketEmit(this.signals.signature, {
      signed: this.signed,
      connId: this.connId,
      version: encryptedVersion,
    });
  }

  // Wrapper around socket.emit method
  socketEmit(signal, data) {
    this.socket.emit(signal, data);
  }

  // Wrapper around socket.disconnect method
  socketDisconnect() {
    this.socket.disconnect();
  }

  // Wrapper around socket.on listener registration method
  socketOn(signal, func) {
    // console.log('socketOn', typeof func === 'function'); // todo remove dev item
    if (typeof func !== 'function') console.log('not a function?', signal); // one of the handlers is/was not initializing properly
    this.socket.on(signal, func);
  }

  // /////////////////////////////////////////////////////////////////////////////////////////////

  // //////////////////////// WebRTC Communication Related ///////////////////////////////////////

  // ////////////// WebRTC Communication Setup Methods ///////////////////////////////////////////

  /**
   * Processes the WebRTC OFFER
   */
  async processOfferReceipt(data) {
    try {
      console.log('processOfferReceipt', data); // todo remove dev item
      const decryptedOffer = await this.mewCrypto.decrypt(data.data);
      // let decryptedOptions = await this.mewCrypto.decrypt(data.options);

      const decryptedData = {
        data: decryptedOffer,
        // options: decryptedOptions //TODO should also encrypt this (decrypted here)
      };
      console.log(decryptedData); // todo remove dev item
      this.receiveOffer(decryptedData);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * creates the WebRTC ANSWER (Receives the answer created by the webrtc lib) and
   * emits it along with the connection ID to the signal server
   */
  async onSignal(data) {
    this.logger('SIGNAL: ', JSON.stringify(data));
    const encryptedSend = await this.mewCrypto.encrypt(JSON.stringify(data));
    this.socketEmit(this.signals.answerSignal, { data: encryptedSend, connId: this.connId });
    this.uiCommunicator('RtcSignalEvent');
  }

  /**
   * Initiates one side (recipient peer) of the WebRTC connection
   */
  receiveOffer(data) {
    this.logger(data);
    // let webRtcServers,
    //   webRtcConfig;
    const webRtcConfig = data.options || {};
    const webRtcServers = webRtcConfig.servers || this.stunServers;

    const simpleOptions = {
      initiator: false,
      trickle: false,
      reconnectTimer: 100,
      iceTransportPolicy: 'relay',
      config: {
        iceServers: webRtcServers,
      },
    };

    if (!this.isBrowser && this.nodeWebRTC) {
      simpleOptions.wrtc = this.nodeWebRTC;
    }

    console.log(data); // todo remove dev item

    this.p = new this.Peer(simpleOptions);
    this.p.signal(JSON.parse(data.data));
    this.p.on(this.rtcEvents.error, this.onError.bind(this));
    this.p.on(this.rtcEvents.connect, this.onConnect.bind(this));
    this.p.on(this.rtcEvents.close, this.onClose.bind(this));
    this.p.on(this.rtcEvents.data, this.onData.bind(this));
    this.p.on('signal', this.onSignal.bind(this));
  }

  // ////////////// WebRTC Communication Event Handlers //////////////////////////////

  /**
   * Emitted when the  webRTC connection is established
   */
  onConnect() {
    this.logger('CONNECTED');
    this.rtcSend({ type: 'text', data: 'From Web' });
    this.uiCommunicator('RtcConnectedEvent');
    this.socketEmit(this.signals.rtcConnected, this.connId);
    this.tryTurn = false;
    this.socketDisconnect();
  }

  /**
   * Emitted when the data is received via the webRTC connection
   */
  async onData(data) {
    this.logger('DATA RECEIVED', data.toString());
    try {
      let decryptedData;// = await this.handleIncommingData(data);
      if (this.isJSON(data)) {
        decryptedData = await this.mewCrypto.decrypt(JSON.parse(data.toString()));
      } else {
        decryptedData = await this.mewCrypto.decrypt(JSON.parse(data.toString()));
      }
      if (this.isJSON(decryptedData)) {
        this.applyDatahandlers(JSON.parse(decryptedData));
      } else {
        this.applyDatahandlers(decryptedData);
      }
    } catch (e) {
      console.error(e);
      this.logger('peer2 ERROR: data=', data);
      this.logger('peer2 ERROR: data.toString()=', data.toString());
      // this.applyDatahandlers(data);
    }
  }

  /**
   * Emitted when one end of the webRTC connection closes
   */
  // eslint-disable-next-line no-unused-vars
  onClose(data) {
    this.logger('WRTC CLOSE');
    this.uiCommunicator('RtcClosedEvent');
    if (!this.triedTurn && this.tryTurn) {
      this.attemptTurnConnect();
    }
  }

  /**
   * Emitted when there is an error with the webRTC connection
   */
  onError(err) {
    console.error('WRTC ERROR');
    console.error(err);
  }

  // /////////////////////////// WebRTC Communication Methods ///////////////////////////////////
  /**
   * sends a hardcoded message through the rtc connection
   */
  testRTC(msg) {
    return function () {
      const _this = this;
      _this.rtcSend(JSON.stringify({ type: 2, text: msg }));
    }.bind(this);
  }

  /**
   * prepare a message to send through the rtc connection,
   * using a closure to hold off calling the rtc object until after it is created
   */
  sendRtcMessage(type, msg) {
    return function () {
      const _this = this;
      // console.log('peer 2 sendRtcMessage', msg);
      _this.rtcSend(JSON.stringify({ type, data: msg }));
    }.bind(this);
  }

  /**
   * prepare a message to send through the rtc connection
   */
  sendRtcMessageResponse(type, msg) {
    console.log('peer 2 sendRtcMessage', msg);
    this.rtcSend(JSON.stringify({ type, data: msg }));
  }

  /**
   * Disconnect the current RTC connection
   */
  disconnectRTC() {
    return function () {
      const _this = this;
      this.uiCommunicator('RtcDisconnectEvent');
      _this.rtcDestroy();
    }.bind(this);
  }

  /**
   * send a message through the rtc connection
   */
  async rtcSend(arg) {
    let encryptedSend;
    if (typeof arg === 'string') {
      encryptedSend = await this.mewCrypto.encrypt(arg);
      // this.p.send(arg);
    } else {
      encryptedSend = await this.mewCrypto.encrypt(JSON.stringify(arg));
      // this.p.send(JSON.stringify(arg));
    }
    console.log('ENCRYPTED: ', encryptedSend); // todo remove dev item
    this.p.send(JSON.stringify(encryptedSend));
  }

  /**
   * Disconnect/Destroy the current RTC connection
   */
  rtcDestroy() {
    this.p.destroy();
  }

  // ////////////// WebRTC Communication TURN Fallback Initiator/Handler ///////////////////////////
  /**
   * Fallback Step if initial webRTC connection attempt fails.
   * Retries setting up the WebRTC connection using TURN
   */
  attemptTurnConnect() {
    this.triedTurn = true;
    console.log('TRY TURN CONNECTION');
    this.socketEmit(this.signals.tryTurn, { connId: this.connId, cont: true });
  }

  // TODO Check if this does anything or is used anywhere
  // eslint-disable-next-line no-unused-vars
  retryViaTurn(data) {
    console.log('TURN TOKEN RECIEVED');
    // this.receiverTurnRTC(data);
  }
}

module.exports = MewConnectReceiver;
