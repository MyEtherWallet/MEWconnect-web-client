const SimplePeer = require('simple-peer');

export default class MewConnectRtc {
  constructor(userSuppliedIO) {
    // Library used to facilitate the WebRTC connection and subsequent communications
    this.Peer = userSuppliedIO || SimplePeer;
    this.p = null;
    this.peerVersion = '-1';
  }

  setDebugLogger(logger) {
    this.logger = logger;
  }

  setStatusEmitter(emmiter) {
    this.statusEmitter = emmiter;
  }

  emitStatus(event) {
    this.statusEmitter.emit('status', event);
  }

  /**
   *  Initial Step in beginning the webRTC setup
   */
  async sendOffer(data) {
    const plainTextVersion = await this.mewCrypto.decrypt(data.version);
    this.peerVersion = plainTextVersion;
    this.emitStatus(this.lifeCycle.receiverVersion, plainTextVersion);
    this.logger('sendOffer', data);
    const options = {
      signalListener: this.initiatorSignalListener,
      webRtcConfig: {
        servers: this.stunServers
      }
    };
    this.initiatorStartRTC(this.socket, options);
  }

  /**
   * creates the WebRTC OFFER.  encrypts the OFFER, and
   * emits it along with the connection ID and STUN/TURN details to the signal server
   */
  // eslint-disable-next-line no-unused-vars
  initiatorSignalListener(socket, options) {
    // TODO encrypt the options object
    return async function offerEmmiter(data) {
      try {
        const _this = this;
        const listenerSignal = _this.signals.offerSignal;
        _this.logger('SIGNAL', JSON.stringify(data));
        const encryptedSend = await _this.mewCrypto.encrypt(
          JSON.stringify(data)
        );
        _this.socketEmit(_this.signals.offerSignal, {
          data: encryptedSend,
          connId: _this.connId,
          options: options.servers
        });
      } catch (e) {
        logger.error(e);
      }
    };
  }

  async recieveAnswer(data) {
    try {
      let plainTextOffer;
      plainTextOffer = await this.mewCrypto.decrypt(data.data);
      this.rtcRecieveAnswer({ data: plainTextOffer });
    } catch (e) {
      logger.error(e);
    }
  }

  rtcRecieveAnswer(data) {
    this.p.signal(JSON.parse(data.data));
  }

  /**
   * Initiates one side (initial peer) of the WebRTC connection
   */
  initiatorStartRTC(socket, options) {
    const webRtcConfig = options.webRtcConfig || {};
    const signalListener = this.initiatorSignalListener(
      socket,
      webRtcConfig.servers
    );
    const webRtcServers = webRtcConfig.servers || this.stunServers;

    const suppliedOptions = options.webRtcOptions || {};
    const defaultOptions = {
      initiator: true,
      trickle: false,
      reconnectTimer: 100,
      iceTransportPolicy: 'relay',
      config: {
        iceServers: webRtcServers
      }
    };

    const simpleOptions = {
      ...defaultOptions,
      suppliedOptions
    };

    this.emitStatus(this.lifeCycle.RtcInitiatedEvent);
    this.p = new this.Peer(simpleOptions);
    this.p.on(this.rtcEvents.error, this.onError.bind(this));
    this.p.on(this.rtcEvents.connect, this.onConnect.bind(this));
    this.p.on(this.rtcEvents.close, this.onClose.bind(this));
    this.p.on(this.rtcEvents.data, this.onData.bind(this));
    this.p.on(this.rtcEvents.signal, signalListener.bind(this));
    this.logger('simple peer', this.p);
  }

  // ////////////// WebRTC Communication Event Handlers //////////////////////////////

  /**
   * Emitted when the  webRTC connection is established
   */
  onConnect() {
    this.logger('CONNECT', 'ok');
    this.connected = true;
    // this.rtcSend({ type: 'text', data: 'From Mobile' });
    this.socketEmit(this.signals.rtcConnected, this.socketKey);
    this.socketDisconnect();
    // set a small timeout before informing the ui that the connection occurred
    // avoid race condition (particularly in MewCore and other tests)
    setTimeout(() => {
      this.emitStatus(this.lifeCycle.RtcConnectedEvent);
      this.applyDatahandlers(
        JSON.stringify({ type: 'rtcConnected', data: null })
      );
    }, 100);
  }

  /**
   * Emitted when the data is received via the webRTC connection
   */
  async onData(data) {
    // logger.debug(data) // todo remove dev item
    // logger.debug(data.toString()) // todo remove dev item
    this.logger('DATA RECEIVED', data.toString());
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
        this.logger('DECRYPTED DATA RECEIVED', parsed);
        this.emit(parsed.type, parsed.data);
      } else {
        this.logger('DECRYPTED DATA RECEIVED', decryptedData);
        this.emit(decryptedData.type, decryptedData.data);
      }
    } catch (e) {
      logger.error(e);
      this.logger('peer2 ERROR: data=', data);
      this.logger('peer2 ERROR: data.toString()=', data.toString());
    }
  }

  /**
   * Emitted when one end of the webRTC connection closes
   */
  onClose(data) {
    this.logger('WRTC CLOSE');
    this.connected = false;
    this.emitStatus(this.lifeCycle.RtcClosedEvent);
  }

  /**
   * Emitted when there is an error with the webRTC connection
   */
  onError(err) {
    logger.error('WRTC ERROR');
    this.logger('error', err);
    this.emitStatus(this.lifeCycle.RtcErrorEvent);
  }

  // /////////////////////// WebRTC Communication Methods /////////////////////////////////////////
  /**
   * sends a hardcoded message through the rtc connection
   */
  testRTC(msg) {
    return function() {
      const _this = this;
      _this.rtcSend(JSON.stringify({ type: 2, text: msg }));
    }.bind(this);
  }

  /**
   * prepare a message to send through the rtc connection. using a closure to
   * hold off calling the rtc object until after it is created
   */
  sendRtcMessageClosure(type, msg) {
    return function() {
      const _this = this;
      _this.logger('[SEND RTC MESSAGE] type: ', type, ' message: ', msg);
      _this.rtcSend(JSON.stringify({ type: type, data: msg }));
    }.bind(this);
  }

  /**
   * prepare a message to send through the rtc connection
   */
  sendRtcMessage(type, msg) {
    this.logger('[SEND RTC MESSAGE] type: ', type, ' message: ', msg);
    this.rtcSend(JSON.stringify({ type: type, data: msg }));
  }

  /**
   * Disconnect the current RTC connection
   */
  disconnectRTCClosure() {
    const _this = this;
    return function() {
      _this.emitStatus(_this.lifeCycle.RtcDisconnectEvent);
      _this.applyDatahandlers(
        JSON.stringify({ type: 'rtcDisconnect', data: null })
      );
      _this.rtcDestroy();
      this.instance = null;
    }.bind(this);
  }

  /**
   * Disconnect the current RTC connection, and call any clean up methods
   */
  disconnectRTC() {
    this.rtcDestroy();
    this.emitStatus(this.lifeCycle.RtcDisconnectEvent);
    this.applyDatahandlers(
      JSON.stringify({ type: 'rtcDisconnect', data: null })
    );
    this.instance = null;
  }

  /**
   * send a message through the rtc connection
   */
  async rtcSend(arg) {
    let encryptedSend;
    if (typeof arg === 'string') {
      encryptedSend = await this.mewCrypto.encrypt(arg);
    } else {
      encryptedSend = await this.mewCrypto.encrypt(JSON.stringify(arg));
    }
    this.p.send(JSON.stringify(encryptedSend));
  }

  /**
   * Disconnect/Destroy the current RTC connection
   */
  rtcDestroy() {
    if (this.p !== null) {
      this.p.destroy();
    }
  }

  // ////////////// WebRTC Communication TURN Fallback Initiator/Handler ///////////////////////////
  /**
   * Fallback Step if initial webRTC connection attempt fails.
   * Retries setting up the WebRTC connection using TURN
   */
  retryViaTurn(data) {
    const options = {
      signalListener: this.initiatorSignalListener,
      webRtcConfig: {
        servers: data.data
      }
    };
    this.initiatorStartRTC(this.socket, options);
  }
}
