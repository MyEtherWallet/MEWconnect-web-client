'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var io = require('socket.io-client');
var SimplePeer = require('simple-peer');

var MewConnectCommon = require('./MewConnectCommon');
var MewConnectCrypto = require('./MewConnectCrypto');
var logger = (0, _logging2.default)('MewConnectInitiator');

/**
 *  Primary Web end of a MEW Connect communication channel
 *  Handles the initial actions to setup said connection
 */

var MewConnectInitiator = function (_MewConnectCommon) {
  _inherits(MewConnectInitiator, _MewConnectCommon);

  /**
   * @param uiCommunicatorFunc
   * @param loggingFunc
   * @param additionalLibs
   */
  function MewConnectInitiator() {
    var uiCommunicatorFunc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var loggingFunc = arguments[1];
    var additionalLibs = arguments[2];

    _classCallCheck(this, MewConnectInitiator);

    // eslint-disable-next-line no-param-reassign
    var _this2 = _possibleConstructorReturn(this, (MewConnectInitiator.__proto__ || Object.getPrototypeOf(MewConnectInitiator)).call(this, uiCommunicatorFunc, loggingFunc));

    additionalLibs = additionalLibs || {};
    // Check if a WebRTC connection exists before a window/tab is closed or refreshed
    // Destroy the connection if one exists
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
    _this2.qrCodeString = null;
    _this2.socketConnected = false;
    _this2.connected = false;
    console.log('latest'); // todo remove dev item
    _this2.io = additionalLibs.io || io;

    _this2.signals = _this2.jsonDetails.signals;
    _this2.rtcEvents = _this2.jsonDetails.rtc;
    _this2.version = _this2.jsonDetails.version;
    _this2.versions = _this2.jsonDetails.versions;
    _this2.lifeCycle = _this2.jsonDetails.lifeCycle;

    // Library used to facilitate the WebRTC connection and subsequent communications
    _this2.Peer = additionalLibs.wrtc || SimplePeer;

    // Initial (STUN) server set used to initiate a WebRTC connection
    _this2.stunServers = _this2.jsonDetails.stunSrvers;
    /* [
      { url: 'stun:global.stun.twilio.com:3478?transport=udp' }
    ] */
    // Initialization of the array to hold the TURN server
    // information if the initial connection attempt fails
    _this2.turnServers = [];

    // Object with specific methods used in relation to cryptographic operations
    _this2.mewCrypto = additionalLibs.cryptoImpl || MewConnectCrypto.create();
    return _this2;
  }

  /**
   * Factory function
   */


  _createClass(MewConnectInitiator, [{
    key: 'getSocketConnectionState',


    /**
     * Returns a boolean indicating whether the socket connection exists and is active
     */
    value: function getSocketConnectionState() {
      return this.socketConnected;
    }

    /**
     * Returns a boolean indicating whether the WebRTC connection exists and is active
     */

  }, {
    key: 'getConnectonState',
    value: function getConnectonState() {
      return this.connected;
    }

    /**
     * Emit/Provide the details used in creating the QR Code
     */

  }, {
    key: 'displayCode',
    value: function displayCode(data) {
      this.logger('handshake', data);
      this.socketKey = data;
      var separator = this.jsonDetails.connectionCodeSeparator;
      var qrCodeString = this.version + separator + data + separator + this.connId;
      this.qrCodeString = qrCodeString;
      // this.applyDatahandlers(JSON.stringify({
      //   type: this.lifeCycle.codeDisplay,
      //   data: qrCodeString
      // }))
      this.uiCommunicator(this.lifeCycle.codeDisplay, qrCodeString);
      this.uiCommunicator(this.lifeCycle.checkNumber, data);
      this.uiCommunicator(this.lifeCycle.ConnectionId, this.connId);
    }

    // ////////////// Initialize Communication Process //////////////////////////////

    /**
     * The initial method called to initiate the exchange that can create a WebRTC connection
     */

  }, {
    key: 'initiatorStart',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
        var toSign, options;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.keys = this.mewCrypto.prepareKey();
                toSign = this.mewCrypto.generateMessage();
                _context.next = 4;
                return this.mewCrypto.signMessage(this.keys.pvt.toString('hex'));

              case 4:
                this.signed = _context.sent;

                this.connId = this.mewCrypto.bufferToConnId(this.keys.pub);
                this.displayCode(this.keys.pvt.toString('hex'));
                this.uiCommunicator(this.lifeCycle.signatureCheck, this.signed);
                options = {
                  query: {
                    stage: 'initiator',
                    signed: this.signed,
                    message: toSign,
                    connId: this.connId
                  },
                  transports: ['websocket', 'polling', 'flashsocket'],
                  secure: true
                };

                this.socketManager = this.io(url, options);
                this.socket = this.socketManager.connect();
                this.initiatorConnect(this.socket);
                // this.signed.then(response => {
                //
                // })

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function initiatorStart(_x2) {
        return _ref.apply(this, arguments);
      }

      return initiatorStart;
    }()

    // ////////////// WebSocket Communication Methods and Handlers //////////////////////////////

    /**
     * Setup message handlers for communication with the signal server
     */

  }, {
    key: 'initiatorConnect',
    value: function initiatorConnect(socket) {
      var _this3 = this;

      this.logger('INITIATOR CONNECT'); // todo remove dev item
      this.uiCommunicator(this.lifeCycle.SocketConnectedEvent);

      this.socket.on(this.signals.connect, function () {
        _this3.logger('SOCKET CONNECTED'); // todo remove dev item
        _this3.socketConnected = true;
        _this3.applyDatahandlers(JSON.stringify({ type: 'socketConnected', data: null }));
      });
      // A connection pair exists, create and send WebRTC OFFER
      this.socketOn(this.signals.confirmation, this.sendOffer.bind(this)); // response
      // Handle the WebRTC ANSWER from the opposite (mobile) peer
      this.socketOn(this.signals.answer, this.recieveAnswer.bind(this));
      // Handle Failure due to an attempt to join a connection with two existing endpoints
      this.socketOn(this.signals.confirmationFailedBusy, function () {
        _this3.uiCommunicator(_this3.lifeCycle.confirmationFailedBusyEvent);
        _this3.logger('confirmation Failed: Busy');
      });
      // Handle Failure due to the handshake/ verify details being invalid for the connection ID
      this.socketOn(this.signals.confirmationFailed, function () {
        _this3.uiCommunicator(_this3.lifeCycle.confirmationFailedEvent);
        _this3.logger('confirmation Failed: invalid confirmation');
      });
      // Handle Failure due to no opposing peer existing
      this.socketOn(this.signals.invalidConnection, function () {
        _this3.uiCommunicator(_this3.lifeCycle.invalidConnectionEvent); // should be different error message
        _this3.logger('confirmation Failed: no opposite peer found');
      });
      // Handle Socket Disconnect Event
      this.socketOn(this.signals.disconnect, function (reason) {
        _this3.logger(reason);
        _this3.socketConnected = false;
      });
      // Provide Notice that initial WebRTC connection failed and the fallback method will be used
      this.socketOn(this.signals.attemptingTurn, function () {
        _this3.logger('TRY TURN CONNECTION'); // todo remove dev item
      });
      // Handle Receipt of TURN server details, and begin a WebRTC connection attempt using TURN
      this.socketOn(this.signals.turnToken, function (data) {
        _this3.retryViaTurn(data);
      });

      return socket;
    }

    // Wrapper around socket.emit method

  }, {
    key: 'socketEmit',
    value: function socketEmit(signal, data) {
      this.socket.binary(false).emit(signal, data);
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
      this.socket.on(signal, func);
    }

    // /////////////////////////////////////////////////////////////////////////////////////////////

    // //////////////////////// WebRTC Communication Related ///////////////////////////////////////

    // ////////////// WebRTC Communication Setup Methods ///////////////////////////////////////////

    /**
     *  Initial Step in beginning the webRTC setup
     */

  }, {
    key: 'sendOffer',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data) {
        var plainTextVersion, options;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.mewCrypto.decrypt(data.version);

              case 2:
                plainTextVersion = _context2.sent;

                // logger.debug('plainTextVersion', plainTextVersion) // todo remove dev item
                this.peerVersion = plainTextVersion;
                this.uiCommunicator(this.lifeCycle.receiverVersion, plainTextVersion);
                // logger.debug('RECEIVER VERSION:', plainTextVersion) // todo remove dev item

                this.logger('sendOffer', data);
                options = {
                  signalListener: this.initiatorSignalListener,
                  webRtcConfig: {
                    servers: this.stunServers
                  }
                };

                this.initiatorStartRTC(this.socket, options);

              case 8:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function sendOffer(_x3) {
        return _ref2.apply(this, arguments);
      }

      return sendOffer;
    }()

    /**
     * creates the WebRTC OFFER.  encrypts the OFFER, and
     * emits it along with the connection ID and STUN/TURN details to the signal server
     */
    // eslint-disable-next-line no-unused-vars

  }, {
    key: 'initiatorSignalListener',
    value: function initiatorSignalListener(socket, options) {
      // TODO encrypt the options object
      return function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data) {
          var _this, listenerSignal, encryptedSend;

          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.prev = 0;
                  _this = this;
                  listenerSignal = _this.signals.offerSignal;

                  _this.logger('SIGNAL', JSON.stringify(data));
                  _context3.next = 6;
                  return _this.mewCrypto.encrypt(JSON.stringify(data));

                case 6:
                  encryptedSend = _context3.sent;

                  // logger.debug('encryptedSend', encryptedSend)
                  // logger.debug('listenerSignal', listenerSignal)
                  _this.socketEmit(_this.signals.offerSignal, {
                    data: encryptedSend,
                    connId: _this.connId,
                    options: options.servers
                  });
                  _context3.next = 13;
                  break;

                case 10:
                  _context3.prev = 10;
                  _context3.t0 = _context3['catch'](0);

                  logger.error(_context3.t0);

                case 13:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, this, [[0, 10]]);
        }));

        function offerEmmiter(_x4) {
          return _ref3.apply(this, arguments);
        }

        return offerEmmiter;
      }();
    }
  }, {
    key: 'recieveAnswer',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(data) {
        var plainTextOffer;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;

                // logger.debug('recieveAnswer', data) // todo remove dev item
                plainTextOffer = void 0;
                _context4.next = 4;
                return this.mewCrypto.decrypt(data.data);

              case 4:
                plainTextOffer = _context4.sent;

                this.rtcRecieveAnswer({ data: plainTextOffer });
                _context4.next = 11;
                break;

              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4['catch'](0);

                logger.error(_context4.t0);

              case 11:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 8]]);
      }));

      function recieveAnswer(_x5) {
        return _ref4.apply(this, arguments);
      }

      return recieveAnswer;
    }()
  }, {
    key: 'rtcRecieveAnswer',
    value: function rtcRecieveAnswer(data) {
      this.p.signal(JSON.parse(data.data));
    }

    /**
     * Initiates one side (initial peer) of the WebRTC connection
     */

  }, {
    key: 'initiatorStartRTC',
    value: function initiatorStartRTC(socket, options) {
      var webRtcConfig = options.webRtcConfig || {};
      // eslint-disable-next-line max-len
      var signalListener = this.initiatorSignalListener(socket, webRtcConfig.servers);
      var webRtcServers = webRtcConfig.servers || this.stunServers;

      var simpleOptions = {
        initiator: true,
        trickle: false,
        reconnectTimer: 100,
        iceTransportPolicy: 'relay',
        config: {
          iceServers: webRtcServers
        }
      };

      this.uiCommunicator(this.lifeCycle.RtcInitiatedEvent);
      this.p = new this.Peer(simpleOptions);
      this.p.on(this.rtcEvents.error, this.onError.bind(this));
      this.p.on(this.rtcEvents.connect, this.onConnect.bind(this));
      this.p.on(this.rtcEvents.close, this.onClose.bind(this));
      this.p.on(this.rtcEvents.data, this.onData.bind(this));
      this.p.on(this.rtcEvents.signal, signalListener.bind(this));
    }

    // ////////////// WebRTC Communication Event Handlers //////////////////////////////

    /**
     * Emitted when the  webRTC connection is established
     */

  }, {
    key: 'onConnect',
    value: function onConnect() {
      var _this4 = this;

      this.logger('CONNECT', 'ok');
      this.connected = true;
      // this.rtcSend({ type: 'text', data: 'From Mobile' });
      this.socketEmit(this.signals.rtcConnected, this.socketKey);
      this.socketDisconnect();
      // set a small timeout before informing the ui that the connection occurred
      // avoid race condition (particularly in MewCore and other tests)
      setTimeout(function () {
        _this4.uiCommunicator(_this4.lifeCycle.RtcConnectedEvent);
        _this4.applyDatahandlers(JSON.stringify({ type: 'rtcConnected', data: null }));
      }, 100);
    }

    /**
     * Emitted when the data is received via the webRTC connection
     */

  }, {
    key: 'onData',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(data) {
        var decryptedData, parsed;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                // logger.debug(data) // todo remove dev item
                // logger.debug(data.toString()) // todo remove dev item
                this.logger('DATA RECEIVED', data.toString());
                _context5.prev = 1;
                decryptedData = void 0;

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
                  parsed = JSON.parse(decryptedData);

                  this.emit(parsed.type, parsed.data);
                  // this.applyDatahandlers(JSON.parse(decryptedData))
                } else {
                  this.emit(decryptedData.type, decryptedData.data);
                  // this.applyDatahandlers(decryptedData)
                }
                _context5.next = 20;
                break;

              case 15:
                _context5.prev = 15;
                _context5.t0 = _context5['catch'](1);

                logger.error(_context5.t0);
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

  }, {
    key: 'onClose',
    value: function onClose(data) {
      this.logger('WRTC CLOSE');
      this.connected = false;
      this.uiCommunicator(this.lifeCycle.RtcClosedEvent, data);
    }

    /**
     * Emitted when there is an error with the webRTC connection
     */

  }, {
    key: 'onError',
    value: function onError(err) {
      logger.error('WRTC ERROR');
      this.logger('error', err);
      this.uiCommunicator(this.lifeCycle.RtcErrorEvent, err);
    }

    // /////////////////////// WebRTC Communication Methods /////////////////////////////////////////
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
     * prepare a message to send through the rtc connection. using a closure to
     * hold off calling the rtc object until after it is created
     */

  }, {
    key: 'sendRtcMessageClosure',
    value: function sendRtcMessageClosure(type, msg) {
      return function () {
        var _this = this;
        // eslint-disable-next-line object-shorthand
        _this.rtcSend(JSON.stringify({ type: type, data: msg }));
      }.bind(this);
    }

    /**
     * prepare a message to send through the rtc connection
     */

  }, {
    key: 'sendRtcMessage',
    value: function sendRtcMessage(type, msg) {
      // eslint-disable-next-line object-shorthand
      this.rtcSend(JSON.stringify({ type: type, data: msg }));
    }

    /**
     * Disconnect the current RTC connection
     */

  }, {
    key: 'disconnectRTCClosure',
    value: function disconnectRTCClosure() {
      var _this = this;
      return function () {
        _this.uiCommunicator(_this.lifeCycle.RtcDisconnectEvent);
        _this.applyDatahandlers(JSON.stringify({ type: 'rtcDisconnect', data: null }));
        _this.rtcDestroy();
        this.instance = null;
      }.bind(this);
    }

    /**
     * Disconnect the current RTC connection, and call any clean up methods
     */

  }, {
    key: 'disconnectRTC',
    value: function disconnectRTC() {
      this.rtcDestroy();
      this.uiCommunicator(this.lifeCycle.RtcDisconnectEvent);
      this.applyDatahandlers(JSON.stringify({ type: 'rtcDisconnect', data: null }));
      this.instance = null;
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
                this.p.send(JSON.stringify(encryptedSend));

              case 11:
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
    key: 'retryViaTurn',
    value: function retryViaTurn(data) {
      var options = {
        signalListener: this.initiatorSignalListener,
        webRtcConfig: {
          servers: data.data
        }
      };
      this.initiatorStartRTC(this.socket, options);
    }
  }], [{
    key: 'init',
    value: function init(uiCommunicatorFunc, loggingFunc, additionalLibs) {
      return new MewConnectInitiator(uiCommunicatorFunc, loggingFunc, additionalLibs);
    }
  }]);

  return MewConnectInitiator;
}(MewConnectCommon);

module.exports = MewConnectInitiator;