const debugLogger = require('debug');
const io = require('socket.io-client');
const EventEmitter = require('events').EventEmitter;
const MewConnectCrypto = require('../../dist/index.js').Crypto;
const SimplePeer = require('simple-peer');

const {
  versions,
  connectionCodeSchemas,
  connectionCodeSeparator,
  signal,
  rtc,
  stages,
  lifeCycle,
  communicationTypes
} = require('../../src/connectClient/constants/constants');
const { version, stunServers } = require('../../src/connectClient/config');

const debug = debugLogger('MEWconnect:receiver');
const debugState = debugLogger('MEWconnect:receiver-state');

export default class MewConnectReceiver extends EventEmitter {
  constructor(
    options = {}
  ) {
    super();

    this.onlyTurn = options.onlyTurn || false;
    debug('rec created'); // todo remove dev item
    this.simplePeerOptions = options.simplePeerOptions || false;
    this.onlyFallback = options.onlyFallback || false;
    this.jsonDetails = {
      stunSrvers: [...stunServers],
      signals: {
        ...signal
      },
      stages: {
        ...stages
      },
      lifeCycle: {
        ...lifeCycle
      },
      rtc: {
        ...rtc
      },
      communicationTypes: {
        ...communicationTypes
      },
      connectionCodeSeparator,
      version,
      versions,
      connectionCodeSchemas
    };

    this.p = null;
    this.qrCodeString = null;
    this.socketConnected = false;
    this.connected = false;
    this.iceState = null;
    this.closing = false;
    this.tryingTurn = false;
    this.triedTurn = false;
    this.waitForCredentials = false;
    this.signalUrl = null;
    this.turnServers = [];

    this.io = io;
    this.Peer = SimplePeer;
    this.mewCrypto = options.cryptoImpl || MewConnectCrypto.create();

    this.signals = this.jsonDetails.signals;
    this.rtcEvents = this.jsonDetails.rtc;
    this.version = this.jsonDetails.version;
    this.versions = this.jsonDetails.versions;
    this.lifeCycle = this.jsonDetails.lifeCycle;
    this.stunServers = this.jsonDetails.stunSrvers;

    // Socket is abandoned.  disconnect.
    setTimeout(() => {
      if (this.socket) {
        this.socketDisconnect();
      }
    }, 120000);

  }

  isJSON(arg) {
    try {
      JSON.parse(arg);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Helper method for parsing the connection details string (data in the QR Code)
  parseConnectionCodeString(str) {
    try {
      const connParts = str.split(this.jsonDetails.connectionCodeSeparator);
      this.version = connParts[0].trim();
      this.connId = connParts[2].trim();
      return {
        connId: connParts[2].trim(),
        key: connParts[1].trim(),
        version: connParts[0].trim()
      };
    } catch (e) {
      debug(e);
    }
  }

  // ===================== [Start] WebSocket Communication Methods and Handlers ====================

  // ------------- WebSocket Communication Methods and Handlers ------------------------------

  uiCommunicator(event, data) {
    this.emit(event, data);
  }

  // ----- Wrapper around Socket.IO methods
  // socket.emit wrapper
  socketEmit(signal, data) {
    this.socket.binary(false).emit(signal, data);
  }

  // socket.disconnect wrapper
  socketDisconnect() {
    this.socket.disconnect();
  }

  // socket.on wrapper
  socketOn(signal, func) {
    if (typeof func !== 'function') debug('not a function?', signal); // one of the handlers is/was not initializing properly
    this.socket.on(signal, func);
  }

  // ----- Setup handlers for communication with the signal server
  async receiverStart(url, params) {
    try {
      // Set the private key sent via a QR code scan
      this.mewCrypto.setPrivate(params.key);
      const signed = await this.mewCrypto.signMessage(params.key);
      this.connId = params.connId;
      const options = {
        query: {
          signed,
          connId: this.connId,
          stage: 'receiver'
        },
        secure: true
      };
      this.socketManager = this.io(url, options);
      this.socket = this.socketManager.connect();

      // identity and locate an opposing peer
      this.socketOn(this.signals.handshake, this.socketHandshake.bind(this));
      // Handle the WebRTC OFFER from the opposite (web) peer
      this.socketOn(this.signals.offer, this.processOfferReceipt.bind(this));
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
      // Handle Receipt of TURN server details, and begin a WebRTC connection attempt using TURN
      this.socketOn(this.signals.turnToken, this.attemptingTurn.bind(this));
    } catch (e) {
      debug(e);
    }
  }

  async socketHandshake() {
    debug('socketHandshake');
    this.signed = await this.mewCrypto.signMessage(
      this.mewCrypto.prvt.toString('hex')
    );
    this.uiCommunicator('signatureCheck', this.signed);
    const encryptedVersion = await this.mewCrypto.encrypt(this.version);
    this.socketEmit(this.signals.signature, {
      signed: this.signed,
      connId: this.connId,
      version: encryptedVersion
    });

  }

  // ----- Socket Event handlers

  // Handle Socket Disconnect Event
  socketDisconnectHandler(reason) {
    debug(reason);
    this.socketConnected = false;
  }

  // Handle Socket Attempting Turn informative signal
  // Provide Notice that initial WebRTC connection failed and the fallback method will be used
  willAttemptTurn() {
    debug('TRY TURN CONNECTION');
    this.uiCommunicator(this.lifeCycle.UsingFallback);
  }

  // Handle Socket event to initiate turn connection
  // Handle Receipt of TURN server details, and begin a WebRTC connection attempt using TURN
  attemptingTurn(data) {
    debug('ATTEMPTING TURN CONNECTION');
    this.tryingTurn = true;
    this.uiCommunicator(this.lifeCycle.UsingFallback);
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

  async processOfferReceipt(data) {
    try {
      const decryptedOffer = await this.mewCrypto.decrypt(data.data);

      const decryptedData = {
        data: decryptedOffer
      };
      this.receiveOffer(decryptedData);
    } catch (e) {
      debug(e);
    }
  }

  receiveOffer(data) {
    if (this.onlyTurn && this.tryingTurn) {
      debug('Receive Offer');
      let simpleOptions;

      if (this.simplePeerOptions && typeof this.simplePeerOptions === 'object') {
        this.simplePeerOptions.config = {
          iceServers: this.turnServers.length > 0 ? this.jsonDetails.stunSrvers.concat(this.turnServers) : this.jsonDetails.stunSrvers
        };
        simpleOptions = this.simplePeerOptions;
      } else {

        simpleOptions = {
          initiator: false,
          trickle: false,
          iceTransportPolicy: 'relay',
          config: {
            iceServers: this.turnServers.length > 0 ? this.turnServers : this.jsonDetails.stunSrvers
          }
        };
      }

      // if(servers) simpleOptions.config = {iceServers: servers};
      this.uiCommunicator('RtcInitiatedEvent');
      if (this.p && data) {
        if (this.p.destroyed) {
          debug('PEER Destroyed: ', this.p);
          this.p = null;
          this.createPeer(simpleOptions, JSON.parse(data.data));
        } else {
          debug(`recieveOffer data: ${JSON.stringify(data)}`);
          this.p.signal(JSON.parse(data.data));
        }
      } else if (data) {
        debug('receiveOffer', data);
        this.createPeer(simpleOptions, JSON.parse(data.data));
      } else {
        debug('receiveOffer', data);
        this.createPeer(simpleOptions);
      }

    } else if (!this.onlyTurn) {
      debug('Receive Offer');
      let simpleOptions;

      if (this.simplePeerOptions && typeof this.simplePeerOptions === 'object') {
        this.simplePeerOptions.config = {
          iceServers: this.turnServers.length > 0 ? this.jsonDetails.stunSrvers.concat(this.turnServers) : this.jsonDetails.stunSrvers
        };
        simpleOptions = this.simplePeerOptions;
      } else {

        simpleOptions = {
          initiator: false,
          trickle: false,
          iceTransportPolicy: 'all',
          config: {
            iceServers: this.turnServers.length > 0 ? this.turnServers : this.jsonDetails.stunSrvers
          }
        };
      }

      // if(servers) simpleOptions.config = {iceServers: servers};
      this.uiCommunicator('RtcInitiatedEvent');
      if (this.p && data) {
        if (this.p.destroyed) {
          debug('PEER Destroyed: ', this.p);
          this.p = null;
          this.createPeer(simpleOptions, JSON.parse(data.data));
        } else {
          debug(`recieveOffer data: ${JSON.stringify(data)}`);
          this.p.signal(JSON.parse(data.data));
        }
      } else if (data) {
        debug('receiveOffer', data);
        this.createPeer(simpleOptions, JSON.parse(data.data));
      } else {
        debug('receiveOffer', data);
        this.createPeer(simpleOptions);
      }

    }
  }

  createPeer(options, forSignal) {
    if (this.p === null || this.tryingTurn) {
      this.p = new this.Peer(options);
      if (forSignal) this.p.signal(forSignal);
      this.p.on(this.rtcEvents.error, this.onError.bind(this));
      this.p.on(this.rtcEvents.connect, this.onConnect.bind(this));
      this.p.on(this.rtcEvents.close, this.onClose.bind(this));
      this.p.on(this.rtcEvents.data, this.onData.bind(this));
      this.p.on(this.rtcEvents.signal, this.onSignal.bind(this));

      this.p._pc.addEventListener('iceconnectionstatechange', (evt) => {
        // eslint-disable-next-line no-undef
        if(typeof jest === 'undefined') { // included because target is not defined in jest
          debugState(' ---------- iceconnectionstatechange: Reciever ----------'); // todo remove dev item
          debugState(evt.target.signalingState); // todo remove dev item
          debugState(evt.target.iceGatheringState); // todo remove dev item
          debugState(evt.target.iceConnectionState); // todo remove dev item
          if (evt.target.iceConnectionState === 'closed') {
            this.iceState = 'closed';
          }
        }
      });

    } else {
      debug('RECIEVER: PEER RETURNED TRUE');
      debug(this.p);
    }
  }

  // ----- WebRTC Communication Event Handlers

  async onSignal(data) {
    debug('SIGNAL: ', JSON.stringify(data));
    const encryptedSend = await this.mewCrypto.encrypt(JSON.stringify(data));
    this.uiCommunicator('RtcSignalEvent');
    this.socketEmit(this.signals.answerSignal, {
      data: encryptedSend,
      connId: this.connId
    });
  }

  onConnect() {
    debug('CONNECTED');
    this.uiCommunicator('RtcConnectedEvent');
    this.socketEmit(this.signals.rtcConnected, this.connId);
    this.tryTurn = false;
    this.socketDisconnect();
  }

  async onData(data) {
    this.uiCommunicator('data');
    debug('DATA RECEIVED', data.toString());
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
        this.applyDatahandlers(JSON.parse(decryptedData));
      } else {
        this.applyDatahandlers(decryptedData);
      }
    } catch (e) {
      debug(e);
      logger('onData ERROR: data=', data);
      logger('onData ERROR: data.toString()=', data.toString());
    }
  }

  onClose() {
    debug('WRTC CLOSE');
    this.closing = true;
    if (this.connected) {
      this.closing = true;
      this.connected = false;
      this.uiCommunicator(this.lifeCycle.RtcClosedEvent);
    }
  }

  onError(err) {
    debug(err.code);
    debug('WRTC ERROR');
    debug(err);
    if (!this.connected && !this.closing && !this.tryingTurn && !this.closing) {
      this.tryingTurn = true;
      this.useFallback();
    } else {
      this.uiCommunicator(this.lifeCycle.RtcErrorEvent);
    }
  }

  // ----- WebRTC Communication Methods
  sendRtcMessage(type, msg) {
    return () => {
      this.rtcSend(JSON.stringify({ type, data: msg }));
    };
  }

  sendRtcMessageResponse(type, msg) {
    this.rtcSend(JSON.stringify({ type, data: msg }));
  }

  disconnectRTC() {
    return () => {
      this.uiCommunicator('RtcDisconnectEvent');
      this.rtcDestroy();
    };
  }

  async rtcSend(arg) {
    let encryptedSend;
    if (typeof arg === 'string') {
      encryptedSend = await this.mewCrypto.encrypt(arg);
    } else {
      encryptedSend = await this.mewCrypto.encrypt(JSON.stringify(arg));
    }
    this.p.send(JSON.stringify(encryptedSend));
  }

  rtcDestroy() {
    if (this.p !== null) {
      this.p.destroy();
    }
  }

  rtcDestroyError() {
    this.p.destroy('Intential Error');
  }

  attemptTurnConnect() {
    this.uiCommunicator(this.lifeCycle.UsingFallback);
    this.useFallback();
  }

  useFallback() {
    this.tryingTurn = true;
    debug('TO USE FALLBACK');
    this.socketEmit(this.signals.tryTurn, { connId: this.connId, data: null });
  }

  retryViaTurn(data) {
    if (!this.triedTurn) {
      this.uiCommunicator(this.lifeCycle.UsingFallback);
      this.triedTurn = true;
      debug(`turn servers: ${JSON.stringify(data)}`);
      debug('Retrying via TURN');
      this.turnServers = data.data;
      this.receiveOffer();
    }
  }

}
