'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

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

var debug = require('debug')('MEWconnect:initiator');

var logger = (0, _logging2.default)('MewConnectInitiator');

var MewConnectInitiator = (function(_MewConnectCommon) {
  _inherits(MewConnectInitiator, _MewConnectCommon);

  function MewConnectInitiator() {
    var uiCommunicatorFunc =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var loggingFunc =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var userSuppliedLibs =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, MewConnectInitiator);

    var _this2 = _possibleConstructorReturn(
      this,
      (
        MewConnectInitiator.__proto__ ||
        Object.getPrototypeOf(MewConnectInitiator)
      ).call(this, uiCommunicatorFunc, loggingFunc)
    );

    var additionalLibs = userSuppliedLibs || {};

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

    _this2.signals = _this2.jsonDetails.signals;
    _this2.rtcEvents = _this2.jsonDetails.rtc;
    _this2.version = _this2.jsonDetails.version;
    _this2.versions = _this2.jsonDetails.versions;
    _this2.lifeCycle = _this2.jsonDetails.lifeCycle;
    _this2.stunServers = _this2.jsonDetails.stunSrvers;
    return _this2;
  }

  // Factory function to create instance using default supplied libraries

  _createClass(
    MewConnectInitiator,
    [
      {
        key: 'destroyOnUnload',

        // Check if a WebRTC connection exists before a window/tab is closed or refreshed
        // Destroy the connection if one exists
        value: function destroyOnUnload() {
          if (this.isBrowser) {
            window.onunload = window.onbeforeunload = function(e) {
              var _this = this;
              if (!!this.Peer && !this.Peer.destroyed) {
                _this.rtcDestroy();
              }
            };
          }
        }
      },
      {
        key: 'getSocketConnectionState',

        // Returns a boolean indicating whether the socket connection exists and is active
        value: function getSocketConnectionState() {
          return this.socketConnected;
        }

        // Returns a boolean indicating whether the WebRTC connection exists and is active
      },
      {
        key: 'getConnectonState',
        value: function getConnectonState() {
          return this.connected;
        }

        // can be used to listen to specific events, especially those that pass data
      },
      {
        key: 'uiCommunicator',
        value: function uiCommunicator(event, data) {
          this.emit(event, data);
          this.emitStatus(event);
        }

        // special status emitter to allow simple listening of various statuses in one listener
      },
      {
        key: 'emitStatus',
        value: function emitStatus(event) {
          this.emit('status', event);
        }

        // Emit/Provide the details used in creating the QR Code
      },
      {
        key: 'displayCode',
        value: function displayCode(data) {
          debug('handshake', data);
          this.socketKey = data;
          var separator = this.jsonDetails.connectionCodeSeparator;
          var qrCodeString =
            this.version + separator + data + separator + this.connId;
          this.qrCodeString = qrCodeString;

          this.uiCommunicator(this.lifeCycle.codeDisplay, qrCodeString);
          this.uiCommunicator(this.lifeCycle.checkNumber, data);
          this.uiCommunicator(this.lifeCycle.ConnectionId, this.connId);
        }

        // ===================== [Start] WebSocket Communication Methods and Handlers ========================

        // The initial method called to initiate the exchange that can create a WebRTC connection
      },
      {
        key: 'regenerateCode',
        value: (function() {
          var _ref = _asyncToGenerator(
            /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
              return regeneratorRuntime.wrap(
                function _callee$(_context) {
                  while (1) {
                    switch ((_context.prev = _context.next)) {
                      case 0:
                        if (!(this.signalUrl === null)) {
                          _context.next = 2;
                          break;
                        }

                        throw Error(
                          'regenerateCode called before initial code generation'
                        );

                      case 2:
                        this.initiatorStart(this.signalUrl);

                      case 3:
                      case 'end':
                        return _context.stop();
                    }
                  }
                },
                _callee,
                this
              );
            })
          );

          function regenerateCode() {
            return _ref.apply(this, arguments);
          }

          return regenerateCode;
        })()

        // Initalize a websocket connection with the signal server
      },
      {
        key: 'initiatorStart',
        value: (function() {
          var _ref2 = _asyncToGenerator(
            /*#__PURE__*/ regeneratorRuntime.mark(function _callee2(url) {
              var toSign, options;
              return regeneratorRuntime.wrap(
                function _callee2$(_context2) {
                  while (1) {
                    switch ((_context2.prev = _context2.next)) {
                      case 0:
                        if (this.signalUrl === null) {
                          this.signalUrl = url;
                        }
                        this.keys = this.mewCrypto.prepareKey();
                        toSign = this.mewCrypto.generateMessage();
                        _context2.next = 5;
                        return this.mewCrypto.signMessage(
                          this.keys.pvt.toString('hex')
                        );

                      case 5:
                        this.signed = _context2.sent;

                        this.connId = this.mewCrypto.bufferToConnId(
                          this.keys.pub
                        );
                        this.displayCode(this.keys.pvt.toString('hex'));
                        this.uiCommunicator(this.lifeCycle.signatureCheck);
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

                      case 13:
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

          function initiatorStart(_x4) {
            return _ref2.apply(this, arguments);
          }

          return initiatorStart;
        })()

        // ------------- WebSocket Communication Methods and Handlers ------------------------------

        // ----- Wrapper around Socket.IO methods
        // socket.emit wrapper
      },
      {
        key: 'socketEmit',
        value: function socketEmit(signal, data) {
          this.socket.binary(false).emit(signal, data);
        }

        // socket.disconnect wrapper
      },
      {
        key: 'socketDisconnect',
        value: function socketDisconnect() {
          this.socket.disconnect();
        }

        // socket.on listener registration wrapper
      },
      {
        key: 'socketOn',
        value: function socketOn(signal, func) {
          this.socket.on(signal, func);
        }

        // ----- Setup handlers for communication with the signal server
      },
      {
        key: 'initiatorConnect',
        value: function initiatorConnect(socket) {
          var _this3 = this;

          debug('INITIATOR CONNECT');
          this.uiCommunicator(this.lifeCycle.SocketConnectedEvent);

          this.socket.on(this.signals.connect, function() {
            debug('SOCKET CONNECTED');
            _this3.socketConnected = true;
          });

          this.socketOn(this.signals.confirmation, this.sendOffer.bind(this)); // response
          this.socketOn(this.signals.answer, this.recieveAnswer.bind(this));
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
          this.socketOn(this.signals.turnToken, this.attemptingTurn.bind(this));
          return socket;
        }

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
          this.uiCommunicator(this.lifeCycle.UsingFallback);
          debug('TRY TURN CONNECTION');
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

        // A connection pair exists, create and send WebRTC OFFER
      },
      {
        key: 'sendOffer',
        value: (function() {
          var _ref3 = _asyncToGenerator(
            /*#__PURE__*/ regeneratorRuntime.mark(function _callee3(data) {
              var plainTextVersion, options;
              return regeneratorRuntime.wrap(
                function _callee3$(_context3) {
                  while (1) {
                    switch ((_context3.prev = _context3.next)) {
                      case 0:
                        _context3.next = 2;
                        return this.mewCrypto.decrypt(data.version);

                      case 2:
                        plainTextVersion = _context3.sent;

                        this.peerVersion = plainTextVersion;
                        this.uiCommunicator(
                          this.lifeCycle.receiverVersion,
                          plainTextVersion
                        );
                        debug('sendOffer', data);
                        options = {
                          signalListener: this.initiatorSignalListener,
                          webRtcConfig: {
                            servers: this.stunServers
                          }
                        };

                        this.initiatorStartRTC(this.socket, options);

                      case 8:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                },
                _callee3,
                this
              );
            })
          );

          function sendOffer(_x5) {
            return _ref3.apply(this, arguments);
          }

          return sendOffer;
        })()
      },
      {
        key: 'initiatorSignalListener',
        value: function initiatorSignalListener(socket, options) {
          return (function() {
            var _ref4 = _asyncToGenerator(
              /*#__PURE__*/ regeneratorRuntime.mark(function _callee4(data) {
                var _this, encryptedSend;

                return regeneratorRuntime.wrap(
                  function _callee4$(_context4) {
                    while (1) {
                      switch ((_context4.prev = _context4.next)) {
                        case 0:
                          _context4.prev = 0;
                          _this = this;

                          debug('SIGNAL', JSON.stringify(data));
                          _context4.next = 5;
                          return _this.mewCrypto.encrypt(JSON.stringify(data));

                        case 5:
                          encryptedSend = _context4.sent;

                          _this.socketEmit(_this.signals.offerSignal, {
                            data: encryptedSend,
                            connId: _this.connId,
                            options: options.servers
                          });
                          _context4.next = 12;
                          break;

                        case 9:
                          _context4.prev = 9;
                          _context4.t0 = _context4['catch'](0);

                          logger.error(_context4.t0);

                        case 12:
                        case 'end':
                          return _context4.stop();
                      }
                    }
                  },
                  _callee4,
                  this,
                  [[0, 9]]
                );
              })
            );

            function offerEmmiter(_x6) {
              return _ref4.apply(this, arguments);
            }

            return offerEmmiter;
          })();
        }

        // Handle the WebRTC ANSWER from the opposite (mobile) peer
      },
      {
        key: 'recieveAnswer',
        value: (function() {
          var _ref5 = _asyncToGenerator(
            /*#__PURE__*/ regeneratorRuntime.mark(function _callee5(data) {
              var plainTextOffer;
              return regeneratorRuntime.wrap(
                function _callee5$(_context5) {
                  while (1) {
                    switch ((_context5.prev = _context5.next)) {
                      case 0:
                        _context5.prev = 0;
                        plainTextOffer = void 0;
                        _context5.next = 4;
                        return this.mewCrypto.decrypt(data.data);

                      case 4:
                        plainTextOffer = _context5.sent;

                        this.rtcRecieveAnswer({ data: plainTextOffer });
                        _context5.next = 11;
                        break;

                      case 8:
                        _context5.prev = 8;
                        _context5.t0 = _context5['catch'](0);

                        logger.error(_context5.t0);

                      case 11:
                      case 'end':
                        return _context5.stop();
                    }
                  }
                },
                _callee5,
                this,
                [[0, 8]]
              );
            })
          );

          function recieveAnswer(_x7) {
            return _ref5.apply(this, arguments);
          }

          return recieveAnswer;
        })()
      },
      {
        key: 'rtcRecieveAnswer',
        value: function rtcRecieveAnswer(data) {
          this.p.signal(JSON.parse(data.data));
        }
      },
      {
        key: 'initiatorStartRTC',
        value: function initiatorStartRTC(socket, options) {
          var webRtcConfig = options.webRtcConfig || {};
          var signalListener = this.initiatorSignalListener(
            socket,
            webRtcConfig.servers
          );
          var webRtcServers = webRtcConfig.servers || this.stunServers;

          var suppliedOptions = options.webRtcOptions || {};
          var defaultOptions = {
            initiator: true,
            trickle: false,
            iceTransportPolicy: 'relay',
            config: {
              iceServers: webRtcServers
            }
          };

          var simpleOptions = _extends({}, defaultOptions, {
            suppliedOptions: suppliedOptions
          });

          this.uiCommunicator(this.lifeCycle.RtcInitiatedEvent);
          this.p = new this.Peer(simpleOptions);
          this.p.on(this.rtcEvents.error, this.onError.bind(this));
          this.p.on(this.rtcEvents.connect, this.onConnect.bind(this));
          this.p.on(this.rtcEvents.close, this.onClose.bind(this));
          this.p.on(this.rtcEvents.data, this.onData.bind(this));
          this.p.on(this.rtcEvents.signal, signalListener.bind(this));
          debug('simple peer', this.p);
        }

        // ----- WebRTC Communication Event Handlers
      },
      {
        key: 'onConnect',
        value: function onConnect() {
          var _this4 = this;

          debug('CONNECT', 'ok');
          this.connected = true;
          this.socketEmit(this.signals.rtcConnected, this.socketKey);
          this.socketDisconnect();
          setTimeout(function() {
            _this4.uiCommunicator(_this4.lifeCycle.RtcConnectedEvent);
          }, 100);
        }
      },
      {
        key: 'onData',
        value: (function() {
          var _ref6 = _asyncToGenerator(
            /*#__PURE__*/ regeneratorRuntime.mark(function _callee6(data) {
              var decryptedData, parsed;
              return regeneratorRuntime.wrap(
                function _callee6$(_context6) {
                  while (1) {
                    switch ((_context6.prev = _context6.next)) {
                      case 0:
                        debug('DATA RECEIVED', data.toString());
                        _context6.prev = 1;
                        decryptedData = void 0;

                        if (!this.isJSON(data)) {
                          _context6.next = 9;
                          break;
                        }

                        _context6.next = 6;
                        return this.mewCrypto.decrypt(
                          JSON.parse(data.toString())
                        );

                      case 6:
                        decryptedData = _context6.sent;
                        _context6.next = 12;
                        break;

                      case 9:
                        _context6.next = 11;
                        return this.mewCrypto.decrypt(
                          JSON.parse(data.toString())
                        );

                      case 11:
                        decryptedData = _context6.sent;

                      case 12:
                        if (this.isJSON(decryptedData)) {
                          parsed = JSON.parse(decryptedData);

                          debug('DECRYPTED DATA RECEIVED', parsed);
                          this.emit(parsed.type, parsed.data);
                        } else {
                          debug('DECRYPTED DATA RECEIVED', decryptedData);
                          this.emit(decryptedData.type, decryptedData.data);
                        }
                        _context6.next = 20;
                        break;

                      case 15:
                        _context6.prev = 15;
                        _context6.t0 = _context6['catch'](1);

                        logger.error(_context6.t0);
                        debug('onData ERROR: data=', data);
                        debug(
                          'onData ERROR: data.toString()=',
                          data.toString()
                        );

                      case 20:
                      case 'end':
                        return _context6.stop();
                    }
                  }
                },
                _callee6,
                this,
                [[1, 15]]
              );
            })
          );

          function onData(_x8) {
            return _ref6.apply(this, arguments);
          }

          return onData;
        })()
      },
      {
        key: 'onClose',
        value: function onClose(data) {
          debug('WRTC CLOSE', data);
          this.connected = false;
          this.uiCommunicator(this.lifeCycle.RtcClosedEvent);
        }
      },
      {
        key: 'onError',
        value: function onError(err) {
          debug('WRTC ERROR');
          debug('error', err);
          this.uiCommunicator(this.lifeCycle.RtcErrorEvent);
        }

        // ----- WebRTC Communication Methods
      },
      {
        key: 'sendRtcMessageClosure',
        value: function sendRtcMessageClosure(type, msg) {
          return function() {
            var _this = this;
            debug(
              '[SEND RTC MESSAGE Closure] type:  ' +
                type +
                ',  message:  ' +
                msg
            );
            _this.rtcSend(JSON.stringify({ type: type, data: msg }));
          }.bind(this);
        }
      },
      {
        key: 'sendRtcMessage',
        value: function sendRtcMessage(type, msg) {
          debug('[SEND RTC MESSAGE] type:  ' + type + ',  message:  ' + msg);
          this.rtcSend(JSON.stringify({ type: type, data: msg }));
        }
      },
      {
        key: 'disconnectRTCClosure',
        value: function disconnectRTCClosure() {
          var _this = this;
          return function() {
            debug('DISCONNECT RTC Closure');
            _this.uiCommunicator(_this.lifeCycle.RtcDisconnectEvent);
            _this.rtcDestroy();
            _this.instance = null;
          };
        }
      },
      {
        key: 'disconnectRTC',
        value: function disconnectRTC() {
          debug('DISCONNECT RTC');
          this.rtcDestroy();
          this.uiCommunicator(this.lifeCycle.RtcDisconnectEvent);
          this.rtcDestroy();
          this.instance = null;
        }
      },
      {
        key: 'rtcSend',
        value: (function() {
          var _ref7 = _asyncToGenerator(
            /*#__PURE__*/ regeneratorRuntime.mark(function _callee7(arg) {
              var encryptedSend;
              return regeneratorRuntime.wrap(
                function _callee7$(_context7) {
                  while (1) {
                    switch ((_context7.prev = _context7.next)) {
                      case 0:
                        encryptedSend = void 0;

                        if (!(typeof arg === 'string')) {
                          _context7.next = 7;
                          break;
                        }

                        _context7.next = 4;
                        return this.mewCrypto.encrypt(arg);

                      case 4:
                        encryptedSend = _context7.sent;
                        _context7.next = 10;
                        break;

                      case 7:
                        _context7.next = 9;
                        return this.mewCrypto.encrypt(JSON.stringify(arg));

                      case 9:
                        encryptedSend = _context7.sent;

                      case 10:
                        debug('SENDING RTC');
                        debug(this.p); // todo remove dev item
                        this.p.send(JSON.stringify(encryptedSend));

                      case 13:
                      case 'end':
                        return _context7.stop();
                    }
                  }
                },
                _callee7,
                this
              );
            })
          );

          function rtcSend(_x9) {
            return _ref7.apply(this, arguments);
          }

          return rtcSend;
        })()
      },
      {
        key: 'rtcDestroy',
        value: function rtcDestroy() {
          if (this.p !== null) {
            this.p.destroy();
          }
        }

        // ----- WebRTC Communication TURN Fallback Initiator/Handler
        // Fallback Step if initial webRTC connection attempt fails.
        // Retries setting up the WebRTC connection using TURN
      },
      {
        key: 'retryViaTurn',
        value: function retryViaTurn(data) {
          debug('Retrying via TURN');
          var options = {
            signalListener: this.initiatorSignalListener,
            webRtcConfig: {
              servers: data.data
            }
          };
          this.initiatorStartRTC(this.socket, options);
        }

        // ======================== [End] WebRTC Communication Methods =============================
      }
    ],
    [
      {
        key: 'init',
        value: function init() {
          return new MewConnectInitiator();
        }
      },
      {
        key: 'checkBrowser',
        value: function checkBrowser() {
          return _MewConnectCommon3.default.checkBrowser();
        }
      },
      {
        key: 'checkWebRTCAvailable',
        value: function checkWebRTCAvailable() {
          return _MewConnectCommon3.default.checkWebRTCAvailable();
        }
      }
    ]
  );

  return MewConnectInitiator;
})(_MewConnectCommon3.default);

exports.default = MewConnectInitiator;
module.exports = exports['default'];
