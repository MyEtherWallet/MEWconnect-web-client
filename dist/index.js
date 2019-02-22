'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var createLogger = _interopDefault(require('logging'));
var EventEmitter = _interopDefault(require('events'));
var browserOrNode = require('browser-or-node');
var detectBrowser = require('detect-browser');
var eccrypto = _interopDefault(require('eccrypto'));
var ethUtils = _interopDefault(require('ethereumjs-util'));
var crypto = _interopDefault(require('crypto'));
var secp256k1 = _interopDefault(require('secp256k1'));
var debugLogger = _interopDefault(require('debug'));
var uuid = _interopDefault(require('uuid/v4'));
var io = _interopDefault(require('socket.io-client'));
var SimplePeer = _interopDefault(require('simple-peer'));

var version = "1.0.14";

var version$1 = version;

var stunServers = [{ urls: 'stun:global.stun.twilio.com:3478?transport=udp' }];

var versions = ['0.0.1'];

var connectionCodeSchemas = {
  '0.0.1': ['version', 'key', 'connId']
};

var connectionCodeSeparator = '_';

var signal = {
  attemptingTurn: 'attemptingTurn',
  turnToken: 'turnToken',
  tryTurn: 'tryTurn',
  connection: 'connection',
  connect: 'connect',
  signature: 'signature',
  offerSignal: 'offerSignal',
  offer: 'offer',
  answerSignal: 'answerSignal',
  answer: 'answer',
  rtcConnected: 'rtcConnected',
  disconnect: 'disconnect',
  handshake: 'handshake',
  confirmation: 'confirmation',
  invalidConnection: 'InvalidConnection',
  confirmationFailedBusy: 'confirmationFailedBusy',
  confirmationFailed: 'confirmationFailed'
};

var rtc = {
  error: 'error',
  connect: 'connect',
  close: 'close',
  data: 'data',
  signal: 'signal'
};

var iceConnectionState = {
  new: 'new',
  connecting: 'connecting',
  connected: 'connected',
  disconnected: 'disconnected',
  failed: 'failed',
  closed: 'closed'
};

var stages = {
  initiator: 'initiator',
  receiver: 'receiver'
};

var lifeCycle = {
  RtcInitiatedEvent: 'RtcInitiatedEvent',
  signatureCheck: 'signatureCheck',
  SocketConnectedEvent: 'SocketConnectedEvent',
  confirmationFailedEvent: 'confirmationFailedEvent',
  confirmationFailedBusyEvent: 'confirmationFailedBusyEvent',
  invalidConnectionEvent: 'invalidConnectionEvent',
  codeDisplay: 'codeDisplay',
  checkNumber: 'checkNumber',
  ConnectionId: 'ConnectionId',
  receiverVersion: 'receiverVersion',
  offerCreated: 'offerCreated',
  sendOffer: 'sendOffer',
  answerReceived: 'answerReceived',
  RtcConnectedEvent: 'RtcConnectedEvent',
  RtcConnectedEmitted: 'RtcConnectedEmitted',
  RtcClosedEvent: 'RtcClosedEvent',
  RtcDisconnectEvent: 'RtcDisconnectEvent',
  RtcDestroyedEvent: 'RtcDestroyedEvent',
  RtcFailedEvent: 'RtcFailedEvent',
  RtcErrorEvent: 'RtcErrorEvent',
  UsingFallback: 'UsingFallback',
  Failed: 'failed',
  attemptedDisconnectedSend: 'attemptedDisconnectedSend'
};

var communicationTypes = {
  address: 'address',
  signMessage: 'signMessage',
  signTx: 'signTx'
};

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
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
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
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

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/* eslint-disable no-undef */

var logger = createLogger('MewConnectCommon');

var MewConnectCommon = function (_EventEmitter) {
  inherits(MewConnectCommon, _EventEmitter);

  function MewConnectCommon() {
    classCallCheck(this, MewConnectCommon);

    var _this = possibleConstructorReturn(this, (MewConnectCommon.__proto__ || Object.getPrototypeOf(MewConnectCommon)).call(this));

    _this.isBrowser = browserOrNode.isBrowser;

    _this.jsonDetails = {
      stunSrvers: [].concat(toConsumableArray(stunServers)),
      signals: _extends({}, signal),
      stages: _extends({}, stages),
      lifeCycle: _extends({}, lifeCycle),
      rtc: _extends({}, rtc),
      communicationTypes: _extends({}, communicationTypes),
      iceConnectionState: _extends({}, iceConnectionState),
      connectionCodeSeparator: connectionCodeSeparator,
      version: version$1,
      versions: versions,
      connectionCodeSchemas: connectionCodeSchemas
    };
    return _this;
  }

  createClass(MewConnectCommon, [{
    key: 'isJSON',
    value: function isJSON(arg) {
      try {
        JSON.parse(arg);
        return true;
      } catch (e) {
        return false;
      }
    }
  }], [{
    key: 'getBrowserRTC',
    value: function getBrowserRTC() {
      if (typeof window === 'undefined') return null;
      var wrtc = {
        RTCPeerConnection:
        // eslint-disable-next-line no-undef
        window.RTCPeerConnection ||
        // eslint-disable-next-line no-undef
        window.mozRTCPeerConnection ||
        // eslint-disable-next-line no-undef
        window.webkitRTCPeerConnection,
        RTCSessionDescription:
        // eslint-disable-next-line no-undef
        window.RTCSessionDescription ||
        // eslint-disable-next-line no-undef
        window.mozRTCSessionDescription ||
        // eslint-disable-next-line no-undef
        window.webkitRTCSessionDescription,
        RTCIceCandidate:
        // eslint-disable-next-line no-undef
        window.RTCIceCandidate ||
        // eslint-disable-next-line no-undef
        window.mozRTCIceCandidate ||
        // eslint-disable-next-line no-undef
        window.webkitRTCIceCandidate
      };
      if (!wrtc.RTCPeerConnection) return null;
      return wrtc;
    }
  }, {
    key: 'checkWebRTCAvailable',
    value: function checkWebRTCAvailable() {
      var doesNotHaveWebRTC = MewConnectCommon.getBrowserRTC() == null;
      return !doesNotHaveWebRTC;
      // return false
    }
  }, {
    key: 'checkBrowser',
    value: function checkBrowser() {
      var browser = detectBrowser.detect();
      if (browser === null) {
        browser = { version: { split: function split() {
              return [1];
            } } };
      }
      var browserVersion = browser.version.split(0, 1)[0];
      /*
       * Chrome > 23
       * Firefox > 22
       * Opera > 18
       * Safari > 11 (caveats exist)
       * Edge - none (RTCDataChannel not supported)
       * IE - none
       * */
      if (typeof window !== 'undefined') {
        if (browser.name === 'safari') {
          // eslint-disable-next-line global-require
          require('webrtc-adapter');
          return MewConnectCommon.buildBrowserResult(true, 'Safari', 'version: ' + browser.version);
        }
        if (browser.name === 'ie') {
          return MewConnectCommon.buildBrowserResult(true, 'Internet Explorer', '', true);
        }
        if (browser.name === 'edge') {
          return MewConnectCommon.buildBrowserResult(true, 'Edge', 'version: ' + browser.version, true);
        }
        var name = '';
        var minVersion = 0;

        if (browser.name === 'opera') {
          name = 'Opera';
          minVersion = 18;
        } else if (browser.name === 'firefox') {
          name = 'Firefox';
          minVersion = 22;
        } else if (browser.name === 'chrome') {
          name = 'Chrome';
          minVersion = 23;
        } else {
          return MewConnectCommon.buildBrowserResult(false, '', '', true);
        }

        try {
          if (minVersion >= +browserVersion) {
            return MewConnectCommon.buildBrowserResult(true, name, 'version: ' + browserVersion);
          }
          return MewConnectCommon.buildBrowserResult(false, '', '');
        } catch (e) {
          logger.error(e);
        }
      }
    }
  }, {
    key: 'buildBrowserResult',
    value: function buildBrowserResult(status, browser, browserVersion, noSupport) {
      return {
        status: status,
        browser: browser,
        browserVersion: browserVersion,
        noSupport: noSupport || false
      };
    }
  }]);
  return MewConnectCommon;
}(EventEmitter);

var logger$1 = createLogger('MewCrypto');

var MewConnectCrypto = function () {
  function MewConnectCrypto() {
    classCallCheck(this, MewConnectCrypto);
  }

  createClass(MewConnectCrypto, [{
    key: 'setPrivate',
    value: function setPrivate(pvtKey) {
      this.prvt = Buffer.from(pvtKey, 'hex');
    }
  }, {
    key: 'generateMessage',
    value: function generateMessage() {
      return crypto.randomBytes(32).toString('hex');
    }

    // Not for the Address, but generate them for the connection check

  }, {
    key: 'prepareKey',
    value: function prepareKey() {
      this.prvt = this.generatePrivate();
      this.pub = this.generatePublic(this.prvt);
      return { pub: this.pub, pvt: this.prvt };
    }
  }, {
    key: 'generatePrivate',
    value: function generatePrivate() {
      var privKey = void 0;
      do {
        privKey = crypto.randomBytes(32);
      } while (!secp256k1.privateKeyVerify(privKey));
      return privKey;
    }
  }, {
    key: 'generatePublic',
    value: function generatePublic(privKey) {
      var pvt = Buffer.from(privKey, 'hex');
      this.prvt = pvt;
      return secp256k1.publicKeyCreate(pvt);
    }
  }, {
    key: 'encrypt',
    value: function encrypt(dataToSend) {
      var publicKeyA = eccrypto.getPublic(this.prvt);
      return new Promise(function (resolve, reject) {
        eccrypto.encrypt(publicKeyA, Buffer.from(dataToSend)).then(function (_initial) {
          resolve(_initial);
        }).catch(function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: 'decrypt',
    value: function decrypt(dataToSee) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        eccrypto.decrypt(_this.prvt, {
          ciphertext: Buffer.from(dataToSee.ciphertext),
          ephemPublicKey: Buffer.from(dataToSee.ephemPublicKey),
          iv: Buffer.from(dataToSee.iv),
          mac: Buffer.from(dataToSee.mac)
        }).then(function (_initial) {
          var result = void 0;
          try {
            if (_this.isJSON(_initial)) {
              var humanRadable = JSON.parse(_initial);
              if (Array.isArray(humanRadable)) {
                result = humanRadable[0];
              } else {
                result = humanRadable;
              }
            } else {
              result = _initial.toString();
            }
          } catch (e) {
            logger$1.error(e);
          }
          resolve(JSON.stringify(result));
        }).catch(function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: 'signMessage',
    value: function signMessage(msgToSign) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        try {
          var msg = ethUtils.hashPersonalMessage(ethUtils.toBuffer(msgToSign));
          var signed = ethUtils.ecsign(Buffer.from(msg), Buffer.from(_this2.prvt, 'hex'));
          var combined = Buffer.concat([Buffer.from([signed.v]), Buffer.from(signed.r), Buffer.from(signed.s)]);
          var combinedHex = combined.toString('hex');
          resolve(combinedHex);
        } catch (e) {
          reject(e);
        }
      });
    }
  }, {
    key: 'bufferToConnId',
    value: function bufferToConnId(buf) {
      return buf.toString('hex').slice(32);
    }
  }, {
    key: 'isJSON',
    value: function isJSON(arg) {
      try {
        JSON.parse(arg);
        return true;
      } catch (e) {
        return false;
      }
    }
  }], [{
    key: 'create',
    value: function create() {
      return new MewConnectCrypto();
    }
  }]);
  return MewConnectCrypto;
}();

var debug = debugLogger('MEWconnect:initiator');
var debugPeer = debugLogger('MEWconnectVerbose:peer-instances');
var debugStages = debugLogger('MEWconnect:initiator-stages');
var logger$2 = createLogger('MewConnectInitiator');

var MewConnectInitiator = function (_MewConnectCommon) {
  inherits(MewConnectInitiator, _MewConnectCommon);

  function MewConnectInitiator() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, MewConnectInitiator);

    var _this = possibleConstructorReturn(this, (MewConnectInitiator.__proto__ || Object.getPrototypeOf(MewConnectInitiator)).call(this));

    _this.supportedBrowser = MewConnectCommon.checkBrowser();

    _this.activePeerId = '';
    _this.allPeerIds = [];
    _this.peersCreated = [];

    _this.destroyOnUnload();
    _this.p = null;
    _this.socketConnected = false;
    _this.connected = false;
    _this.tryingTurn = false;
    _this.turnDisabled = false;
    _this.signalUrl = null;
    _this.iceState = '';
    _this.turnServers = [];

    _this.io = options.io || io;
    _this.Peer = options.wrtc || SimplePeer;
    _this.mewCrypto = options.cryptoImpl || MewConnectCrypto.create();

    _this.signals = _this.jsonDetails.signals;
    _this.rtcEvents = _this.jsonDetails.rtc;
    _this.version = _this.jsonDetails.version;
    _this.versions = _this.jsonDetails.versions;
    _this.lifeCycle = _this.jsonDetails.lifeCycle;
    _this.stunServers = options.stunServers || _this.jsonDetails.stunSrvers;
    _this.iceStates = _this.jsonDetails.iceConnectionState;

    // Socket is abandoned.  disconnect.
    setTimeout(function () {
      if (_this.socket) {
        _this.socketDisconnect();
      }
    }, 120000);
    return _this;
  }

  createClass(MewConnectInitiator, [{
    key: 'isAlive',
    value: function isAlive() {
      if (this.p !== null) {
        return this.p.connected && !this.p.destroyed;
      }
      return false;
    }

    // Factory function to create instance using default supplied libraries

  }, {
    key: 'destroyOnUnload',


    // Check if a WebRTC connection exists before a window/tab is closed or refreshed
    // Destroy the connection if one exists
    value: function destroyOnUnload() {
      var _this2 = this;

      if (browserOrNode.isBrowser) {
        // eslint-disable-next-line no-undef
        window.onunload = window.onbeforeunload = function () {
          var iceStates = [_this2.iceStates.new, _this2.iceStates.connecting, _this2.iceStates.connected];
          if (!_this2.Peer.destroyed || iceStates.includes(_this2.iceState)) {
            _this2.rtcDestroy();
          }
        };
      }
    }
  }, {
    key: 'getSocketConnectionState',


    // Returns a boolean indicating whether the socket connection exists and is active
    value: function getSocketConnectionState() {
      return this.socketConnected;
    }

    // Returns a boolean indicating whether the WebRTC connection exists and is active

  }, {
    key: 'getConnectonState',
    value: function getConnectonState() {
      return this.connected;
    }

    // can be used to listen to specific events, especially those that pass data

  }, {
    key: 'uiCommunicator',
    value: function uiCommunicator(event, data) {
      this.emit(event, data);
      this.emitStatus(event);
    }

    // special status emitter to allow simple listening of various statuses in one listener

  }, {
    key: 'emitStatus',
    value: function emitStatus(event) {
      this.emit('status', event);
    }

    // Emit/Provide the details used in creating the QR Code

  }, {
    key: 'displayCode',
    value: function displayCode(data) {
      debug('handshake', data);
      this.socketKey = data;
      var separator = this.jsonDetails.connectionCodeSeparator;
      var qrCodeString = this.version + separator + data + separator + this.connId;

      this.uiCommunicator(this.lifeCycle.codeDisplay, qrCodeString);
      this.uiCommunicator(this.lifeCycle.checkNumber, data);
      this.uiCommunicator(this.lifeCycle.ConnectionId, this.connId);
    }

    // ===================== [Start] WebSocket Communication Methods and Handlers ========================

    // The initial method called to initiate the exchange that can create a WebRTC connection

  }, {
    key: 'regenerateCode',
    value: function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this.signalUrl === null)) {
                  _context.next = 2;
                  break;
                }

                throw Error('regenerateCode called before initial code generation');

              case 2:
                this.socketDisconnect();
                this.initiatorStart(this.signalUrl);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function regenerateCode() {
        return _ref.apply(this, arguments);
      }

      return regenerateCode;
    }()
  }, {
    key: 'useFallback',
    value: function () {
      var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.socketEmit(this.signals.tryTurn, { connId: this.connId });

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function useFallback() {
        return _ref2.apply(this, arguments);
      }

      return useFallback;
    }()

    // Initalize a websocket connection with the signal server

  }, {
    key: 'initiatorStart',
    value: function () {
      var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(url) {
        var toSign, options;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.signalUrl === null) {
                  this.signalUrl = url;
                }
                this.keys = this.mewCrypto.prepareKey();
                toSign = this.mewCrypto.generateMessage();
                _context3.next = 5;
                return this.mewCrypto.signMessage(this.keys.pvt.toString('hex'));

              case 5:
                this.signed = _context3.sent;

                this.connId = this.mewCrypto.bufferToConnId(this.keys.pub);
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
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function initiatorStart(_x2) {
        return _ref3.apply(this, arguments);
      }

      return initiatorStart;
    }()

    // ------------- WebSocket Communication Methods and Handlers ------------------------------

    // ----- Wrapper around Socket.IO methods
    // socket.emit wrapper

  }, {
    key: 'socketEmit',
    value: function socketEmit(signal, data) {
      this.socket.binary(false).emit(signal, data);
    }

    // socket.disconnect wrapper

  }, {
    key: 'socketDisconnect',
    value: function socketDisconnect() {
      this.socket.disconnect();
      this.socketConnected = false;
    }

    // socket.on listener registration wrapper

  }, {
    key: 'socketOn',
    value: function socketOn(signal, func) {
      this.socket.on(signal, func);
    }

    // ----- Setup handlers for communication with the signal server

  }, {
    key: 'initiatorConnect',
    value: function initiatorConnect(socket) {
      var _this3 = this;

      debugStages('INITIATOR CONNECT');
      this.uiCommunicator(this.lifeCycle.SocketConnectedEvent);

      this.socket.on(this.signals.connect, function () {
        debugStages('SOCKET CONNECTED');
        _this3.socketConnected = true;
      });

      this.socketOn(this.signals.confirmation, this.sendOffer.bind(this)); // response
      this.socketOn(this.signals.answer, this.recieveAnswer.bind(this));
      this.socketOn(this.signals.confirmationFailedBusy, this.busyFailure.bind(this));
      this.socketOn(this.signals.confirmationFailed, this.confirmationFailure.bind(this));
      this.socketOn(this.signals.invalidConnection, this.invalidFailure.bind(this));
      this.socketOn(this.signals.disconnect, this.socketDisconnectHandler.bind(this));
      this.socketOn(this.signals.attemptingTurn, this.willAttemptTurn.bind(this));
      this.socketOn(this.signals.turnToken, this.beginTurn.bind(this));
      return socket;
    }

    // ----- Socket Event handlers

    // Handle Socket Disconnect Event

  }, {
    key: 'socketDisconnectHandler',
    value: function socketDisconnectHandler(reason) {
      debug(reason);
      this.socketConnected = false;
    }

    // Handle Socket Attempting Turn informative signal
    // Provide Notice that initial WebRTC connection failed and the fallback method will be used

  }, {
    key: 'willAttemptTurn',
    value: function willAttemptTurn() {
      this.tryingTurn = true;
      debugStages('TRY TURN CONNECTION');
      this.uiCommunicator(this.lifeCycle.UsingFallback);
    }

    // Handle Socket event to initiate turn connection
    // Handle Receipt of TURN server details, and begin a WebRTC connection attempt using TURN

  }, {
    key: 'beginTurn',
    value: function beginTurn(data) {
      this.tryingTurn = true;
      this.retryViaTurn(data);
    }

    // ----- Failure Handlers

    // Handle Failure due to an attempt to join a connection with two existing endpoints

  }, {
    key: 'busyFailure',
    value: function busyFailure() {
      this.uiCommunicator(this.lifeCycle.Failed, this.lifeCycle.confirmationFailedBusyEvent);
      debug('confirmation Failed: Busy');
    }

    // Handle Failure due to no opposing peer existing

  }, {
    key: 'invalidFailure',
    value: function invalidFailure() {
      this.uiCommunicator(this.lifeCycle.Failed, this.lifeCycle.invalidConnectionEvent);
      debug('confirmation Failed: no opposite peer found');
    }

    // Handle Failure due to the handshake/ verify details being invalid for the connection ID

  }, {
    key: 'confirmationFailure',
    value: function confirmationFailure() {
      this.uiCommunicator(this.lifeCycle.Failed, this.lifeCycle.confirmationFailedEvent);
      debug('confirmation Failed: invalid confirmation');
    }

    // =============== [End] WebSocket Communication Methods and Handlers ========================

    // ======================== [Start] WebRTC Communication Methods =============================

    // ----- WebRTC Setup Methods

    // A connection pair exists, create and send WebRTC OFFER

  }, {
    key: 'sendOffer',
    value: function () {
      var _ref4 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(data) {
        var plainTextVersion, options;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.mewCrypto.decrypt(data.version);

              case 2:
                plainTextVersion = _context4.sent;

                this.peerVersion = plainTextVersion;
                this.uiCommunicator(this.lifeCycle.receiverVersion, plainTextVersion);
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
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function sendOffer(_x3) {
        return _ref4.apply(this, arguments);
      }

      return sendOffer;
    }()
  }, {
    key: 'initiatorSignalListener',
    value: function initiatorSignalListener(socket, options) {
      var _this4 = this;

      return function () {
        var _ref5 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(data) {
          var encryptedSend;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.prev = 0;

                  debug('SIGNAL', JSON.stringify(data));
                  _context5.next = 4;
                  return _this4.mewCrypto.encrypt(JSON.stringify(data));

                case 4:
                  encryptedSend = _context5.sent;

                  _this4.uiCommunicator(_this4.lifeCycle.sendOffer);
                  _this4.socketEmit(_this4.signals.offerSignal, {
                    data: encryptedSend,
                    connId: _this4.connId,
                    options: options.servers
                  });
                  _context5.next = 12;
                  break;

                case 9:
                  _context5.prev = 9;
                  _context5.t0 = _context5['catch'](0);

                  logger$2.error(_context5.t0);

                case 12:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, _this4, [[0, 9]]);
        }));

        return function (_x4) {
          return _ref5.apply(this, arguments);
        };
      }();
    }

    // Handle the WebRTC ANSWER from the opposite (mobile) peer

  }, {
    key: 'recieveAnswer',
    value: function () {
      var _ref6 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(data) {
        var plainTextOffer;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return this.mewCrypto.decrypt(data.data);

              case 3:
                plainTextOffer = _context6.sent;

                this.rtcRecieveAnswer({ data: plainTextOffer });
                _context6.next = 10;
                break;

              case 7:
                _context6.prev = 7;
                _context6.t0 = _context6['catch'](0);

                logger$2.error(_context6.t0);

              case 10:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 7]]);
      }));

      function recieveAnswer(_x5) {
        return _ref6.apply(this, arguments);
      }

      return recieveAnswer;
    }()
  }, {
    key: 'rtcRecieveAnswer',
    value: function rtcRecieveAnswer(data) {
      this.uiCommunicator(this.lifeCycle.answerReceived);
      this.p.signal(JSON.parse(data.data));
    }
  }, {
    key: 'setActivePeerId',
    value: function setActivePeerId() {
      this.activePeerId = uuid();
      this.allPeerIds.push(this.activePeerId);
    }
  }, {
    key: 'getActivePeerId',
    value: function getActivePeerId() {
      var split = this.activePeerId.split('-');
      return split.join('-');
    }
  }, {
    key: 'initiatorStartRTC',
    value: function initiatorStartRTC(socket, options) {
      this.setActivePeerId();
      var webRtcConfig = options.webRtcConfig || {};
      var signalListener = this.initiatorSignalListener(socket, webRtcConfig.servers);
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
      debug('initiatorStartRTC - options: ' + simpleOptions);
      this.uiCommunicator(this.lifeCycle.RtcInitiatedEvent);
      this.p = new this.Peer(simpleOptions);
      var peerID = this.getActivePeerId();
      this.p.peerInstanceId = peerID;
      this.peersCreated.push(this.p);
      this.p.on(this.rtcEvents.error, this.onError.bind(this, peerID));
      this.p.on(this.rtcEvents.connect, this.onConnect.bind(this, peerID));
      this.p.on(this.rtcEvents.close, this.onClose.bind(this, peerID));
      this.p.on(this.rtcEvents.data, this.onData.bind(this, peerID));
      this.p.on(this.rtcEvents.signal, signalListener.bind(this));
      this.p._pc.addEventListener('iceconnectionstatechange', this.stateChangeListener.bind(this, peerID));
    }

    // ----- WebRTC Communication Event Handlers

  }, {
    key: 'stateChangeListener',
    value: function stateChangeListener(peerID, evt) {
      // eslint-disable-next-line no-undef
      if (typeof jest === 'undefined') {
        // included because target is not defined in jest
        debug('iceConnectionState: ' + evt.target.iceConnectionState);
        debugPeer('this.allPeerIds', this.allPeerIds);
        debugPeer('peerID', peerID);
        if (evt.target.iceConnectionState === 'connected' || evt.target.iceConnectionState === 'completed') {
          if (!this.connected) {
            this.connected = true;
            this.uiCommunicator(this.lifeCycle.RtcConnectedEvent);
          }
        }
      }
    }
  }, {
    key: 'onConnect',
    value: function onConnect(peerID) {
      debugStages('RTC CONNECT', 'ok');
      debugPeer('peerID', peerID);
      this.connected = true;
      this.turnDisabled = true;
      this.socketEmit(this.signals.rtcConnected, this.socketKey);
      this.socketDisconnect();
      this.uiCommunicator(this.lifeCycle.RtcConnectedEvent);
    }
  }, {
    key: 'onData',
    value: function () {
      var _ref7 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(peerID, data) {
        var decryptedData, parsed;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                debug('DATA RECEIVED', data.toString());
                debugPeer('peerID', peerID);
                _context7.prev = 2;
                decryptedData = void 0;

                if (!this.isJSON(data)) {
                  _context7.next = 10;
                  break;
                }

                _context7.next = 7;
                return this.mewCrypto.decrypt(JSON.parse(data.toString()));

              case 7:
                decryptedData = _context7.sent;
                _context7.next = 13;
                break;

              case 10:
                _context7.next = 12;
                return this.mewCrypto.decrypt(JSON.parse(data.toString()));

              case 12:
                decryptedData = _context7.sent;

              case 13:
                if (this.isJSON(decryptedData)) {
                  parsed = JSON.parse(decryptedData);

                  debug('DECRYPTED DATA RECEIVED 1', parsed);
                  this.emit(parsed.type, parsed.data);
                } else {
                  debug('DECRYPTED DATA RECEIVED 2', decryptedData);
                  this.emit(decryptedData.type, decryptedData.data);
                }
                _context7.next = 21;
                break;

              case 16:
                _context7.prev = 16;
                _context7.t0 = _context7['catch'](2);

                logger$2.error(_context7.t0);
                debug('onData ERROR: data=', data);
                debug('onData ERROR: data.toString()=', data.toString());

              case 21:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this, [[2, 16]]);
      }));

      function onData(_x6, _x7) {
        return _ref7.apply(this, arguments);
      }

      return onData;
    }()
  }, {
    key: 'onClose',
    value: function onClose(peerID, data) {
      debugStages('WRTC MAYBE CLOSE');
      debugPeer('peerID', peerID);
      if (!this.isAlive()) {
        debugStages('WRTC CLOSE', data);
        if (this.connected) {
          this.uiCommunicator(this.lifeCycle.RtcClosedEvent);
          this.connected = false;
        } else {
          this.connected = false;
        }
      }
    }
  }, {
    key: 'onError',
    value: function onError(peerID, err) {
      debugStages('WRTC ERROR');
      debugPeer('peerID', peerID);
      debug(err.code);
      debug('error', err);
      if (!this.connected && !this.tryingTurn && !this.turnDisabled) {
        this.useFallback();
      } else {
        if (!this.isAlive()) {
          this.uiCommunicator(this.lifeCycle.RtcErrorEvent);
        }
      }
    }

    // ----- WebRTC Communication Methods

  }, {
    key: 'sendRtcMessageClosure',
    value: function sendRtcMessageClosure(type, msg) {
      var _this5 = this;

      return function () {
        debug('[SEND RTC MESSAGE Closure] type:  ' + type + ',  message:  ' + msg);
        _this5.rtcSend(JSON.stringify({ type: type, data: msg }));
      };
    }
  }, {
    key: 'sendRtcMessage',
    value: function sendRtcMessage(type, msg) {
      debug('[SEND RTC MESSAGE] type:  ' + type + ',  message:  ' + msg);
      this.rtcSend(JSON.stringify({ type: type, data: msg }));
    }
  }, {
    key: 'disconnectRTCClosure',
    value: function disconnectRTCClosure() {
      var _this6 = this;

      return function () {
        debugStages('DISCONNECT RTC Closure');
        _this6.connected = false;
        _this6.uiCommunicator(_this6.lifeCycle.RtcDisconnectEvent);
        _this6.rtcDestroy();
        _this6.instance = null;
      };
    }
  }, {
    key: 'disconnectRTC',
    value: function disconnectRTC() {
      debugStages('DISCONNECT RTC');
      this.connected = false;
      this.uiCommunicator(this.lifeCycle.RtcDisconnectEvent);
      this.rtcDestroy();
      this.instance = null;
    }
  }, {
    key: 'rtcSend',
    value: function () {
      var _ref8 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(arg) {
        var encryptedSend;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (!this.isAlive()) {
                  _context8.next = 15;
                  break;
                }

                encryptedSend = void 0;

                if (!(typeof arg === 'string')) {
                  _context8.next = 8;
                  break;
                }

                _context8.next = 5;
                return this.mewCrypto.encrypt(arg);

              case 5:
                encryptedSend = _context8.sent;
                _context8.next = 11;
                break;

              case 8:
                _context8.next = 10;
                return this.mewCrypto.encrypt(JSON.stringify(arg));

              case 10:
                encryptedSend = _context8.sent;

              case 11:
                debug('SENDING RTC');
                this.p.send(JSON.stringify(encryptedSend));
                _context8.next = 16;
                break;

              case 15:
                // eslint-disable-next-line
                this.uiCommunicator(this.lifeCycle.attemptedDisconnectedSend);

              case 16:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function rtcSend(_x8) {
        return _ref8.apply(this, arguments);
      }

      return rtcSend;
    }()
  }, {
    key: 'rtcDestroy',
    value: function rtcDestroy() {
      if (this.isAlive()) {
        this.p.destroy();
        this.connected = false;
        this.uiCommunicator(this.lifeCycle.RtcDestroyedEvent);
      }
    }

    // ----- WebRTC Communication TURN Fallback Initiator/Handler
    // Fallback Step if initial webRTC connection attempt fails.
    // Retries setting up the WebRTC connection using TURN

  }, {
    key: 'retryViaTurn',
    value: function retryViaTurn(data) {
      debugStages('Retrying via TURN');
      var options = {
        signalListener: this.initiatorSignalListener,
        webRtcConfig: {
          servers: data.data
        }
      };
      this.initiatorStartRTC(this.socket, options);
    }

    // ======================== [End] WebRTC Communication Methods =============================

  }], [{
    key: 'init',
    value: function init(opts) {
      var options = opts !== null ? opts : {};
      return new MewConnectInitiator(options);
    }
  }, {
    key: 'checkBrowser',
    value: function checkBrowser() {
      return MewConnectCommon.checkBrowser();
    }
  }, {
    key: 'checkWebRTCAvailable',
    value: function checkWebRTCAvailable() {
      return MewConnectCommon.checkWebRTCAvailable();
    }
  }]);
  return MewConnectInitiator;
}(MewConnectCommon);

// INITIATOR CLIENT

var index = {
  Crypto: MewConnectCrypto,
  Initiator: MewConnectInitiator
};

module.exports = index;
