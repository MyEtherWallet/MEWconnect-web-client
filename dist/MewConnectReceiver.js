'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _MewConnectCommon2 = require('./MewConnectCommon');

var _MewConnectCommon3 = _interopRequireDefault(_MewConnectCommon2);

var _MewConnectCrypto = require('./MewConnectCrypto');

var _MewConnectCrypto2 = _interopRequireDefault(_MewConnectCrypto);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _simplePeer = require('simple-peer');

var _simplePeer2 = _interopRequireDefault(_simplePeer);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _asyncToGenerator(fn) {
  return function() {
    var gen = fn.apply(this, arguments);
    return new Promise(function(resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            function(value) {
              step('next', value);
            },
            function(err) {
              step('throw', err);
            }
          );
        }
      }
      return step('next');
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

var logger = (0, _logging2.default)('MewConnectReceiver');
var debug = (0, _debug2.default)('MEWconnect:receiver');

var MewConnectReceiver = (function(_MewConnectCommon) {
  _inherits(MewConnectReceiver, _MewConnectCommon);

  function MewConnectReceiver() {
    var uiCommunicatorFunc =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var loggingFunc =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var additionalLibs =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, MewConnectReceiver);

    var _this2 = _possibleConstructorReturn(
      this,
      (
        MewConnectReceiver.__proto__ ||
        Object.getPrototypeOf(MewConnectReceiver)
      ).call(this, uiCommunicatorFunc, loggingFunc)
    );

    _this2.supportedBrowser = _MewConnectCommon3.default.checkBrowser();

    _this2.destroyOnUnload();
    _this2.p = null;
    _this2.qrCodeString = null;
    _this2.socketConnected = false;
    _this2.connected = false;
    _this2.signalUrl = null;
    _this2.turnServers = [];

    _this2.io = additionalLibs.io || _socket2.default;
    _this2.Peer = additionalLibs.wrtc || _simplePeer2.default;
    _this2.mewCrypto =
      additionalLibs.cryptoImpl || _MewConnectCrypto2.default.create();
    _this2.nodeWebRTC = additionalLibs.webRTC || null;

    _this2.signals = _this2.jsonDetails.signals;
    _this2.rtcEvents = _this2.jsonDetails.rtc;
    _this2.version = _this2.jsonDetails.version;
    _this2.versions = _this2.jsonDetails.versions;
    _this2.lifeCycle = _this2.jsonDetails.lifeCycle;
    _this2.stunServers = _this2.jsonDetails.stunSrvers;
    return _this2;
  }

  // Check if a WebRTC connection exists before a window/tab is closed or refreshed
  // Destroy the connection if one exists

  _createClass(MewConnectReceiver, [
    {
      key: 'destroyOnUnload',
      value: function destroyOnUnload() {
        if (this.isBrowser) {
          window.onunload = window.onbeforeunload = function() {
            var _this = this;
            if (!!this.Peer && !this.Peer.destroyed) {
              _this.rtcDestroy();
            }
          };
        }
      }

      // Helper method for parsing the connection details string (data in the QR Code)
    },
    {
      key: 'parseConnectionCodeString',
      value: function parseConnectionCodeString(str) {
        try {
          var connParts = str.split(this.jsonDetails.connectionCodeSeparator);
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
          logger.error(e);
        }
      }

      // ===================== [Start] WebSocket Communication Methods and Handlers ====================

      // ------------- WebSocket Communication Methods and Handlers ------------------------------

      // ----- Wrapper around Socket.IO methods
      // socket.emit wrapper
    },
    {
      key: 'socketEmit',
      value: function socketEmit(signal, data) {
        this.socket.emit(signal, data);
      }

      // socket.disconnect wrapper
    },
    {
      key: 'socketDisconnect',
      value: function socketDisconnect() {
        this.socket.disconnect();
      }

      // socket.on wrapper
    },
    {
      key: 'socketOn',
      value: function socketOn(signal, func) {
        if (typeof func !== 'function') logger.error('not a function?', signal); // one of the handlers is/was not initializing properly
        this.socket.on(signal, func);
      }

      // ----- Setup handlers for communication with the signal server
    },
    {
      key: 'receiverStart',
      value: (function() {
        var _ref = _asyncToGenerator(
          /*#__PURE__*/ regeneratorRuntime.mark(function _callee(url, params) {
            var signed, options;
            return regeneratorRuntime.wrap(
              function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      _context.prev = 0;

                      // Set the private key sent via a QR code scan
                      this.mewCrypto.setPrivate(params.key);
                      _context.next = 4;
                      return this.mewCrypto.signMessage(params.key);

                    case 4:
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

                      this.socketManager = this.io(url, options);
                      this.socket = this.socketManager.connect();

                      // identity and locate an opposing peer
                      this.socketOn(
                        this.signals.handshake,
                        this.socketHandshake.bind(this)
                      );
                      // Handle the WebRTC OFFER from the opposite (web) peer
                      this.socketOn(
                        this.signals.offer,
                        this.processOfferReceipt.bind(this)
                      );
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
                      this.socketOn(
                        this.signals.turnToken,
                        this.retryViaTurn.bind(this)
                      );
                      _context.next = 22;
                      break;

                    case 19:
                      _context.prev = 19;
                      _context.t0 = _context['catch'](0);

                      logger.error(_context.t0);

                    case 22:
                    case 'end':
                      return _context.stop();
                  }
                }
              },
              _callee,
              this,
              [[0, 19]]
            );
          })
        );

        function receiverStart(_x4, _x5) {
          return _ref.apply(this, arguments);
        }

        return receiverStart;
      })()
    },
    {
      key: 'socketHandshake',
      value: (function() {
        var _ref2 = _asyncToGenerator(
          /*#__PURE__*/ regeneratorRuntime.mark(function _callee2() {
            var encryptedVersion;
            return regeneratorRuntime.wrap(
              function _callee2$(_context2) {
                while (1) {
                  switch ((_context2.prev = _context2.next)) {
                    case 0:
                      _context2.next = 2;
                      return this.mewCrypto.signMessage(
                        this.mewCrypto.prvt.toString('hex')
                      );

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
              },
              _callee2,
              this
            );
          })
        );

        function socketHandshake() {
          return _ref2.apply(this, arguments);
        }

        return socketHandshake;
      })()

      // ----- Socket Event handlers

      // Handle Socket Disconnect Event
    },
    {
      key: 'socketDisconnectHandler',
      value: function socketDisconnectHandler(reason) {
        debug(reason);
        this.socketConnected = false;
      }

      // Handle Socket Attempting Turn informative signal
      // Provide Notice that initial WebRTC connection failed and the fallback method will be used
    },
    {
      key: 'willAttemptTurn',
      value: function willAttemptTurn() {
        debug('TRY TURN CONNECTION');
        this.uiCommunicator(this.lifeCycle.UsingFallback);
      }

      // Handle Socket event to initiate turn connection
      // Handle Receipt of TURN server details, and begin a WebRTC connection attempt using TURN
    },
    {
      key: 'attemptingTurn',
      value: function attemptingTurn(data) {
        this.retryViaTurn(data);
      }

      // ----- Failure Handlers

      // Handle Failure due to an attempt to join a connection with two existing endpoints
    },
    {
      key: 'busyFailure',
      value: function busyFailure() {
        this.uiCommunicator(
          this.lifeCycle.Failed,
          this.lifeCycle.confirmationFailedBusyEvent
        );
        debug('confirmation Failed: Busy');
      }

      // Handle Failure due to no opposing peer existing
    },
    {
      key: 'invalidFailure',
      value: function invalidFailure() {
        this.uiCommunicator(
          this.lifeCycle.Failed,
          this.lifeCycle.invalidConnectionEvent
        );
        debug('confirmation Failed: no opposite peer found');
      }

      // Handle Failure due to the handshake/ verify details being invalid for the connection ID
    },
    {
      key: 'confirmationFailure',
      value: function confirmationFailure() {
        this.uiCommunicator(
          this.lifeCycle.Failed,
          this.lifeCycle.confirmationFailedEvent
        );
        debug('confirmation Failed: invalid confirmation');
      }

      // =============== [End] WebSocket Communication Methods and Handlers ========================

      // ======================== [Start] WebRTC Communication Methods =============================

      // ----- WebRTC Setup Methods
    },
    {
      key: 'processOfferReceipt',
      value: (function() {
        var _ref3 = _asyncToGenerator(
          /*#__PURE__*/ regeneratorRuntime.mark(function _callee3(data) {
            var decryptedOffer, decryptedData;
            return regeneratorRuntime.wrap(
              function _callee3$(_context3) {
                while (1) {
                  switch ((_context3.prev = _context3.next)) {
                    case 0:
                      _context3.prev = 0;
                      _context3.next = 3;
                      return this.mewCrypto.decrypt(data.data);

                    case 3:
                      decryptedOffer = _context3.sent;
                      decryptedData = {
                        data: decryptedOffer
                      };

                      this.receiveOffer(decryptedData);
                      _context3.next = 11;
                      break;

                    case 8:
                      _context3.prev = 8;
                      _context3.t0 = _context3['catch'](0);

                      logger.error(_context3.t0);

                    case 11:
                    case 'end':
                      return _context3.stop();
                  }
                }
              },
              _callee3,
              this,
              [[0, 8]]
            );
          })
        );

        function processOfferReceipt(_x6) {
          return _ref3.apply(this, arguments);
        }

        return processOfferReceipt;
      })()
    },
    {
      key: 'onSignal',
      value: (function() {
        var _ref4 = _asyncToGenerator(
          /*#__PURE__*/ regeneratorRuntime.mark(function _callee4(data) {
            var encryptedSend;
            return regeneratorRuntime.wrap(
              function _callee4$(_context4) {
                while (1) {
                  switch ((_context4.prev = _context4.next)) {
                    case 0:
                      debug('SIGNAL: ', JSON.stringify(data));
                      _context4.next = 3;
                      return this.mewCrypto.encrypt(JSON.stringify(data));

                    case 3:
                      encryptedSend = _context4.sent;

                      this.socketEmit(this.signals.answerSignal, {
                        data: encryptedSend,
                        connId: this.connId
                      });
                      this.uiCommunicator('RtcSignalEvent');

                    case 6:
                    case 'end':
                      return _context4.stop();
                  }
                }
              },
              _callee4,
              this
            );
          })
        );

        function onSignal(_x7) {
          return _ref4.apply(this, arguments);
        }

        return onSignal;
      })()
    },
    {
      key: 'receiveOffer',
      value: function receiveOffer(data) {
        debug('Receive Offer');
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

        this.p = new this.Peer(simpleOptions);
        this.p.signal(JSON.parse(data.data));
        this.p.on(this.rtcEvents.error, this.onError.bind(this));
        this.p.on(this.rtcEvents.connect, this.onConnect.bind(this));
        this.p.on(this.rtcEvents.close, this.onClose.bind(this));
        this.p.on(this.rtcEvents.data, this.onData.bind(this));
        this.p.on('signal', this.onSignal.bind(this));
      }

      // ----- WebRTC Communication Event Handlers
    },
    {
      key: 'onConnect',
      value: function onConnect() {
        debug('CONNECTED');
        this.uiCommunicator('RtcConnectedEvent');
        this.socketEmit(this.signals.rtcConnected, this.connId);
        this.tryTurn = false;
        this.socketDisconnect();
      }
    },
    {
      key: 'onData',
      value: (function() {
        var _ref5 = _asyncToGenerator(
          /*#__PURE__*/ regeneratorRuntime.mark(function _callee5(data) {
            var decryptedData;
            return regeneratorRuntime.wrap(
              function _callee5$(_context5) {
                while (1) {
                  switch ((_context5.prev = _context5.next)) {
                    case 0:
                      debug('DATA RECEIVED', data.toString());
                      _context5.prev = 1;
                      decryptedData = void 0;

                      if (!this.isJSON(data)) {
                        _context5.next = 9;
                        break;
                      }

                      _context5.next = 6;
                      return this.mewCrypto.decrypt(
                        JSON.parse(data.toString())
                      );

                    case 6:
                      decryptedData = _context5.sent;
                      _context5.next = 12;
                      break;

                    case 9:
                      _context5.next = 11;
                      return this.mewCrypto.decrypt(
                        JSON.parse(data.toString())
                      );

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

                      logger.error(_context5.t0);
                      logger('onData ERROR: data=', data);
                      logger('onData ERROR: data.toString()=', data.toString());

                    case 20:
                    case 'end':
                      return _context5.stop();
                  }
                }
              },
              _callee5,
              this,
              [[1, 15]]
            );
          })
        );

        function onData(_x8) {
          return _ref5.apply(this, arguments);
        }

        return onData;
      })()
    },
    {
      key: 'onClose',
      value: function onClose() {
        debug('WRTC CLOSE');
        this.uiCommunicator('RtcClosedEvent');
        if (!this.triedTurn && this.tryTurn) {
          this.attemptTurnConnect();
        }
      }
    },
    {
      key: 'onError',
      value: function onError(err) {
        debug('WRTC ERROR');
        logger.error(err);
      }

      // ----- WebRTC Communication Methods
    },
    {
      key: 'sendRtcMessage',
      value: function sendRtcMessage(type, msg) {
        return function() {
          var _this = this;
          _this.rtcSend(JSON.stringify({ type: type, data: msg }));
        }.bind(this);
      }
    },
    {
      key: 'sendRtcMessageResponse',
      value: function sendRtcMessageResponse(type, msg) {
        this.rtcSend(JSON.stringify({ type: type, data: msg }));
      }
    },
    {
      key: 'disconnectRTC',
      value: function disconnectRTC() {
        return function() {
          var _this = this;
          this.uiCommunicator('RtcDisconnectEvent');
          _this.rtcDestroy();
        }.bind(this);
      }
    },
    {
      key: 'rtcSend',
      value: (function() {
        var _ref6 = _asyncToGenerator(
          /*#__PURE__*/ regeneratorRuntime.mark(function _callee6(arg) {
            var encryptedSend;
            return regeneratorRuntime.wrap(
              function _callee6$(_context6) {
                while (1) {
                  switch ((_context6.prev = _context6.next)) {
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
              },
              _callee6,
              this
            );
          })
        );

        function rtcSend(_x9) {
          return _ref6.apply(this, arguments);
        }

        return rtcSend;
      })()
    },
    {
      key: 'rtcDestroy',
      value: function rtcDestroy() {
        this.p.destroy();
      }

      // ----- WebRTC Communication TURN Fallback Initiator/Handler
      // Fallback Step if initial webRTC connection attempt fails.
      // Retries setting up the WebRTC connection using TURN
    },
    {
      key: 'attemptTurnConnect',
      value: function attemptTurnConnect() {
        this.triedTurn = true;
        this.socketEmit(this.signals.tryTurn, {
          connId: this.connId,
          cont: true
        });
      }
      // ======================== [End] WebRTC Communication Methods =============================
    }
  ]);

  return MewConnectReceiver;
})(_MewConnectCommon3.default);

exports.default = MewConnectReceiver;
module.exports = exports['default'];
