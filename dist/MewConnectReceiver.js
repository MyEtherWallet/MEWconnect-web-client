'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// const eccrypto = require('eccrypto');
// const ethUtils = require('ethereumjs-util');
// const crypto = require('crypto');
// const secp256k1 = require('secp256k1');
// const buffer = require('buffer').Buffer;
var io = require('socket.io-client');
var SimplePeer = require('simple-peer');

var MewConnectCrypto = require('./MewConnectCrypto');
var MewConnectCommon = require('./MewConnectCommon');

var MewConnectReceiver = function (_MewConnectCommon) {
  _inherits(MewConnectReceiver, _MewConnectCommon);

  /**
   *
   * @param uiCommunicatorFunc
   * @param loggingFunc
   * @param additionalLibs
   */
  function MewConnectReceiver(uiCommunicatorFunc, loggingFunc, additionalLibs) {
    _classCallCheck(this, MewConnectReceiver);

    // eslint-disable-next-line no-param-reassign
    var _this2 = _possibleConstructorReturn(this, (MewConnectReceiver.__proto__ || Object.getPrototypeOf(MewConnectReceiver)).call(this, uiCommunicatorFunc, loggingFunc));

    additionalLibs = additionalLibs || {};
    if (_this2.isBrowser) {
      // eslint-disable-next-line no-undef,no-multi-assign,no-unused-vars
      window.onunload = window.onbeforeunload = function (e) {
        var _this = this;
        if (!!this.Peer && !this.Peer.destroyed) {
          _this.rtcDestroy();
        }
      };
    }

    _this2.p = null;
    _this2.tryTurn = true;
    _this2.triedTurn = false;

    _this2.io = additionalLibs.io || io;

    _this2.signals = _this2.jsonDetails.signals;
    _this2.rtcEvents = _this2.jsonDetails.rtc;
    _this2.version = _this2.jsonDetails.version;
    _this2.versions = _this2.jsonDetails.versions;

    console.log(_this2.versions); // todo remove dev item
    // Library used to facilitate the WebRTC connection and subsequent communications
    _this2.Peer = additionalLibs.wrtc || SimplePeer;
    _this2.nodeWebRTC = additionalLibs.webRTC || null;

    // Initial (STUN) server set used to initiate a WebRTC connection
    _this2.stunServers = [{ url: 'stun:global.stun.twilio.com:3478?transport=udp' }];
    // Initialization of the array to hold the TURN
    // server information if the initial connection attempt fails
    _this2.turnServers = [];

    // Object with specific methods used in relation to cryptographic operations
    _this2.mewCrypto = additionalLibs.cryptoImpl || MewConnectCrypto.create();
    // this.mewCrypto = additionalLibs.cryptoImpl || new MewConnect.Crypto({
    //     eccrypto,
    //     crypto,
    //     secp256k1,
    //     ethUtils,
    //     buffer
    //   });
    return _this2;
  }

  /**
   * Helper method for parsing the connection details string (data in the QR Code)
   */
  // eslint-disable-next-line consistent-return


  _createClass(MewConnectReceiver, [{
    key: 'parseConnectionCodeString',
    value: function parseConnectionCodeString(str) {
      try {
        var connParts = str.split(this.jsonDetails.connectionCodeSeparator);
        // console.log('connParts', connParts);
        if (this.versions.indexOf(connParts[0].trim()) > -1) {
          return {
            connId: connParts[2].trim(),
            key: connParts[1].trim(),
            version: connParts[0].trim()
          };
        }
        return {
          connId: connParts[1].trim(),
          key: connParts[0].trim()
        };
      } catch (e) {
        console.error(e);
      }
    }

    // ////////////// Initialize Communication Process //////////////////////////////

    /**
     * The reply method called to continue the exchange that can create a WebRTC connection
     */

  }, {
    key: 'receiverStart',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, params) {
        var _this3 = this;

        var _this, signed, options;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this = this;

                console.log(url, params); // todo remove dev item
                _context.prev = 2;

                console.log(params);
                // Set the private key sent via a QR code scan
                this.mewCrypto.setPrivate(params.key); // todo uncomment after dev
                _context.next = 7;
                return this.mewCrypto.signMessage(params.key);

              case 7:
                signed = _context.sent;

                this.connId = params.connId;
                options = {
                  query: {
                    signed: signed,
                    connId: this.connId,
                    stage: 'receiver'
                  },
                  secure: true
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
                this.socketOn(this.signals.invalidConnection, function () {
                  _this.uiCommunicator('InvalidConnection');
                });
                // Handle Receipt of TURN server details, and begin a WebRTC connection attempt using TURN
                this.socketOn(this.signals.turnToken, function (data) {
                  _this3.retryViaTurn(data);
                });
                _context.next = 22;
                break;

              case 19:
                _context.prev = 19;
                _context.t0 = _context['catch'](2);

                console.error(_context.t0);

              case 22:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 19]]);
      }));

      function receiverStart(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return receiverStart;
    }()

    // eslint-disable-next-line no-unused-vars

  }, {
    key: 'socketHandshake',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data) {
        var encryptedVersion;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.mewCrypto.signMessage(this.mewCrypto.prvt.toString('hex'));

              case 2:
                this.signed = _context2.sent;

                this.uiCommunicator('signatureCheck', this.signed);
                _context2.next = 6;
                return this.mewCrypto.encrypt(this.version);

              case 6:
                encryptedVersion = _context2.sent;

                this.socketEmit(this.signals.signature, {
                  signed: this.signed,
                  connId: this.connId,
                  version: encryptedVersion
                });

              case 8:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function socketHandshake(_x3) {
        return _ref2.apply(this, arguments);
      }

      return socketHandshake;
    }()

    // Wrapper around socket.emit method

  }, {
    key: 'socketEmit',
    value: function socketEmit(signal, data) {
      this.socket.emit(signal, data);
    }

    // Wrapper around socket.disconnect method

  }, {
    key: 'socketDisconnect',
    value: function socketDisconnect() {
      this.socket.disconnect();
    }

    // Wrapper around socket.on listener registration method

  }, {
    key: 'socketOn',
    value: function socketOn(signal, func) {
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

  }, {
    key: 'processOfferReceipt',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data) {
        var decryptedOffer, decryptedData;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;

                console.log('processOfferReceipt', data); // todo remove dev item
                _context3.next = 4;
                return this.mewCrypto.decrypt(data.data);

              case 4:
                decryptedOffer = _context3.sent;

                // let decryptedOptions = await this.mewCrypto.decrypt(data.options);

                decryptedData = {
                  data: decryptedOffer
                  // options: decryptedOptions //TODO should also encrypt this (decrypted here)
                };

                console.log(decryptedData); // todo remove dev item
                this.receiveOffer(decryptedData);
                _context3.next = 13;
                break;

              case 10:
                _context3.prev = 10;
                _context3.t0 = _context3['catch'](0);

                console.error(_context3.t0);

              case 13:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 10]]);
      }));

      function processOfferReceipt(_x4) {
        return _ref3.apply(this, arguments);
      }

      return processOfferReceipt;
    }()

    /**
     * creates the WebRTC ANSWER (Receives the answer created by the webrtc lib) and
     * emits it along with the connection ID to the signal server
     */

  }, {
    key: 'onSignal',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(data) {
        var encryptedSend;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.logger('SIGNAL: ', JSON.stringify(data));
                _context4.next = 3;
                return this.mewCrypto.encrypt(JSON.stringify(data));

              case 3:
                encryptedSend = _context4.sent;

                this.socketEmit(this.signals.answerSignal, { data: encryptedSend, connId: this.connId });
                this.uiCommunicator('RtcSignalEvent');

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function onSignal(_x5) {
        return _ref4.apply(this, arguments);
      }

      return onSignal;
    }()

    /**
     * Initiates one side (recipient peer) of the WebRTC connection
     */

  }, {
    key: 'receiveOffer',
    value: function receiveOffer(data) {
      this.logger(data);
      // let webRtcServers,
      //   webRtcConfig;
      var webRtcConfig = data.options || {};
      var webRtcServers = webRtcConfig.servers || this.stunServers;

      var simpleOptions = {
        initiator: false,
        trickle: false,
        reconnectTimer: 100,
        iceTransportPolicy: 'relay',
        config: {
          iceServers: webRtcServers
        }
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

  }, {
    key: 'onConnect',
    value: function onConnect() {
      this.logger('CONNECTED');
      // this.rtcSend({ type: 'text', data: 'From Web' });
      this.uiCommunicator('RtcConnectedEvent');
      this.socketEmit(this.signals.rtcConnected, this.connId);
      this.tryTurn = false;
      this.socketDisconnect();
    }

    /**
     * Emitted when the data is received via the webRTC connection
     */

  }, {
    key: 'onData',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(data) {
        var decryptedData;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                this.logger('DATA RECEIVED', data.toString());
                _context5.prev = 1;
                decryptedData = void 0; // = await this.handleIncommingData(data);

                if (!this.isJSON(data)) {
                  _context5.next = 9;
                  break;
                }

                _context5.next = 6;
                return this.mewCrypto.decrypt(JSON.parse(data.toString()));

              case 6:
                decryptedData = _context5.sent;
                _context5.next = 12;
                break;

              case 9:
                _context5.next = 11;
                return this.mewCrypto.decrypt(JSON.parse(data.toString()));

              case 11:
                decryptedData = _context5.sent;

              case 12:
                if (this.isJSON(decryptedData)) {
                  this.applyDatahandlers(JSON.parse(decryptedData));
                } else {
                  this.applyDatahandlers(decryptedData);
                }
                _context5.next = 20;
                break;

              case 15:
                _context5.prev = 15;
                _context5.t0 = _context5['catch'](1);

                console.error(_context5.t0);
                this.logger('peer2 ERROR: data=', data);
                this.logger('peer2 ERROR: data.toString()=', data.toString());
                // this.applyDatahandlers(data);

              case 20:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[1, 15]]);
      }));

      function onData(_x6) {
        return _ref5.apply(this, arguments);
      }

      return onData;
    }()

    /**
     * Emitted when one end of the webRTC connection closes
     */
    // eslint-disable-next-line no-unused-vars

  }, {
    key: 'onClose',
    value: function onClose(data) {
      this.logger('WRTC CLOSE');
      this.uiCommunicator('RtcClosedEvent');
      if (!this.triedTurn && this.tryTurn) {
        this.attemptTurnConnect();
      }
    }

    /**
     * Emitted when there is an error with the webRTC connection
     */

  }, {
    key: 'onError',
    value: function onError(err) {
      console.error('WRTC ERROR');
      console.error(err);
    }

    // /////////////////////////// WebRTC Communication Methods ///////////////////////////////////
    /**
     * sends a hardcoded message through the rtc connection
     */

  }, {
    key: 'testRTC',
    value: function testRTC(msg) {
      return function () {
        var _this = this;
        _this.rtcSend(JSON.stringify({ type: 2, text: msg }));
      }.bind(this);
    }

    /**
     * prepare a message to send through the rtc connection,
     * using a closure to hold off calling the rtc object until after it is created
     */

  }, {
    key: 'sendRtcMessage',
    value: function sendRtcMessage(type, msg) {
      return function () {
        var _this = this;
        // console.log('peer 2 sendRtcMessage', msg);
        // eslint-disable-next-line object-shorthand
        _this.rtcSend(JSON.stringify({ type: type, data: msg }));
      }.bind(this);
    }

    /**
     * prepare a message to send through the rtc connection
     */

  }, {
    key: 'sendRtcMessageResponse',
    value: function sendRtcMessageResponse(type, msg) {
      console.log('peer 2 sendRtcMessage', msg);
      console.log('peer 2 sendRtcMessage type', type);
      // eslint-disable-next-line object-shorthand
      this.rtcSend(JSON.stringify({ type: type, data: msg }));
    }

    /**
     * Disconnect the current RTC connection
     */

  }, {
    key: 'disconnectRTC',
    value: function disconnectRTC() {
      return function () {
        var _this = this;
        this.uiCommunicator('RtcDisconnectEvent');
        _this.rtcDestroy();
      }.bind(this);
    }

    /**
     * send a message through the rtc connection
     */

  }, {
    key: 'rtcSend',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(arg) {
        var encryptedSend;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                encryptedSend = void 0;

                if (!(typeof arg === 'string')) {
                  _context6.next = 7;
                  break;
                }

                _context6.next = 4;
                return this.mewCrypto.encrypt(arg);

              case 4:
                encryptedSend = _context6.sent;
                _context6.next = 10;
                break;

              case 7:
                _context6.next = 9;
                return this.mewCrypto.encrypt(JSON.stringify(arg));

              case 9:
                encryptedSend = _context6.sent;

              case 10:
                console.log('ENCRYPTED: ', encryptedSend); // todo remove dev item
                this.p.send(JSON.stringify(encryptedSend));

              case 12:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function rtcSend(_x7) {
        return _ref6.apply(this, arguments);
      }

      return rtcSend;
    }()

    /**
     * Disconnect/Destroy the current RTC connection
     */

  }, {
    key: 'rtcDestroy',
    value: function rtcDestroy() {
      this.p.destroy();
    }

    // ////////////// WebRTC Communication TURN Fallback Initiator/Handler ///////////////////////////
    /**
     * Fallback Step if initial webRTC connection attempt fails.
     * Retries setting up the WebRTC connection using TURN
     */

  }, {
    key: 'attemptTurnConnect',
    value: function attemptTurnConnect() {
      this.triedTurn = true;
      console.log('TRY TURN CONNECTION');
      this.socketEmit(this.signals.tryTurn, { connId: this.connId, cont: true });
    }

    // TODO Check if this does anything or is used anywhere
    // eslint-disable-next-line no-unused-vars

  }, {
    key: 'retryViaTurn',
    value: function retryViaTurn(data) {
      console.log('TURN TOKEN RECIEVED');
      // this.receiverTurnRTC(data);
    }
  }]);

  return MewConnectReceiver;
}(MewConnectCommon);

module.exports = MewConnectReceiver;