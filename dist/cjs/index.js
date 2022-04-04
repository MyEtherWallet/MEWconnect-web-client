'use strict';

require('core-js/stable');
require('regenerator-runtime/runtime');
var debugLogger = require('debug');
var browserOrNode = require('browser-or-node');
var uuid = require('uuid/v4');
var EventEmitter = require('events');
var detectBrowser = require('detect-browser');
var eccrypto = require('eccrypto');
var ethUtils = require('ethereumjs-utils');
var crypto = require('crypto');
var secp256k1 = require('secp256k1');
var queryString = require('query-string');
require('isomorphic-ws');
var wrtc = require('wrtc');
var io = require('socket.io-client');
var QrCode = require('qrcode');
var web3 = require('web3');
var web3CoreRequestmanager = require('web3-core-requestmanager');
var uuid$1 = require('uuid');
var web3CoreHelpers = require('web3-core-helpers');
var BigNumber = require('bignumber.js');
var url$1 = require('url');
var utils = require('web3-utils');
var axios = require('axios');
var ethereumjsTx = require('ethereumjs-tx');
var Common = require('ethereumjs-common');
var SimplePeer = require('simple-peer');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var debugLogger__default = /*#__PURE__*/_interopDefaultLegacy(debugLogger);
var uuid__default = /*#__PURE__*/_interopDefaultLegacy(uuid);
var EventEmitter__default = /*#__PURE__*/_interopDefaultLegacy(EventEmitter);
var eccrypto__default = /*#__PURE__*/_interopDefaultLegacy(eccrypto);
var ethUtils__default = /*#__PURE__*/_interopDefaultLegacy(ethUtils);
var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);
var secp256k1__default = /*#__PURE__*/_interopDefaultLegacy(secp256k1);
var queryString__default = /*#__PURE__*/_interopDefaultLegacy(queryString);
var wrtc__default = /*#__PURE__*/_interopDefaultLegacy(wrtc);
var io__default = /*#__PURE__*/_interopDefaultLegacy(io);
var QrCode__default = /*#__PURE__*/_interopDefaultLegacy(QrCode);
var web3__default = /*#__PURE__*/_interopDefaultLegacy(web3);
var BigNumber__default = /*#__PURE__*/_interopDefaultLegacy(BigNumber);
var url__default = /*#__PURE__*/_interopDefaultLegacy(url$1);
var utils__default = /*#__PURE__*/_interopDefaultLegacy(utils);
var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var Common__default = /*#__PURE__*/_interopDefaultLegacy(Common);
var SimplePeer__default = /*#__PURE__*/_interopDefaultLegacy(SimplePeer);

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
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
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var packageJSON = require('../../package.json');
packageJSON.version;
var V1endpoint = 'https://connect.mewapi.io';
var V2endpoint = 'wss://connect2.mewapi.io/staging';
var stunServers = [{
  urls: 'stun:global.stun.twilio.com:3478?transport=udp'
}];

var versions = ['0.0.1'];
var connectionCodeSchemas = {
  '0.0.1': ['version', 'key', 'connId']
};
var connectionCodeSeparator = '_';
var rtc = {
  error: 'error',
  connect: 'connect',
  close: 'close',
  data: 'data',
  signal: 'signal'
};
var iceConnectionState = {
  "new": 'new',
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
  AuthRejected: 'AuthRejected',
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
  attemptedDisconnectedSend: 'attemptedDisconnectedSend',
  connected: 'connected',
  disconnected: 'disconnected',
  ShowReload: 'ShowReload',
  decryptError: 'decryptError',
  connectingStart: 'connectingStart'
};
var communicationTypes = {
  address: 'address',
  signMessage: 'signMessage',
  signTx: 'signTx'
};

var signalV1 = {
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
var signalV2 = {
  //V1 (ish)
  attemptingTurn: 'attemptingturn',
  turnToken: 'turntoken',
  tryTurn: 'tryturn',
  connect: 'connect',
  connection: 'connection',
  signature: 'signature',
  offerSignal: 'offersignal',
  offer: 'offer',
  answerSignal: 'answersignal',
  answer: 'answer',
  rtcConnected: 'rtcconnected',
  disconnect: 'disconnect',
  handshake: 'handshake',
  confirmation: 'confirmation',
  invalidConnection: 'InvalidConnection',
  confirmationFailedBusy: 'confirmationFailedBusy',
  confirmationFailed: 'confirmationFailed',
  // V2
  initiated: 'initiated',
  socketTimeout: 'socketTimeout',
  receivedSignal: 'receivedSignal',
  error: 'error',
  disconnected: 'disconnected'
};

var signalUrl = {
  V1: V1endpoint,
  V2: V2endpoint
};
var signals = {
  V1: signalV1,
  V2: signalV2
};

var versionIdentify = function versionIdentify(ver) {
  var parts = ver.toString().split('.');

  if (parts.length > 0) {
    ver = parts[0];
  }

  switch (ver) {
    case 1:
    case '1':
    case 'V1':
      return 'V1';

    case 2:
    case '2':
    case 'V2':
      return 'V2';

    default:
      return 'V2';
  }
};

var signalServer = function signalServer(ver) {
  return signalUrl[versionIdentify(ver)];
};

var signal = function signal(ver) {
  return signals[versionIdentify(ver)];
};

var MewConnectCommon = /*#__PURE__*/function (_EventEmitter) {
  _inherits(MewConnectCommon, _EventEmitter);

  var _super = _createSuper(MewConnectCommon);

  function MewConnectCommon() {
    var _this;

    var version = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;

    _classCallCheck(this, MewConnectCommon);

    _this = _super.call(this);
    _this.isBrowser = browserOrNode.isBrowser;
    _this.jsonDetails = {
      stunSrvers: _toConsumableArray(stunServers),
      signalServer: signalServer(version),
      signals: _objectSpread2({}, signal(version)),
      signalsV1: _objectSpread2({}, signals.V1),
      signalsV2: _objectSpread2({}, signals.V2),
      stages: _objectSpread2({}, stages),
      lifeCycle: _objectSpread2({}, lifeCycle),
      rtc: _objectSpread2({}, rtc),
      communicationTypes: _objectSpread2({}, communicationTypes),
      iceConnectionState: _objectSpread2({}, iceConnectionState),
      connectionCodeSeparator: connectionCodeSeparator,
      version: version,
      versions: versions,
      connectionCodeSchemas: connectionCodeSchemas
    };
    return _this;
  }

  _createClass(MewConnectCommon, [{
    key: "isJSON",
    value: function isJSON(arg) {
      try {
        JSON.parse(arg);
        return true;
      } catch (e) {
        return false;
      }
    }
  }], [{
    key: "getBrowserRTC",
    value: function getBrowserRTC() {
      if (typeof window === 'undefined') return null;
      var wrtc = {
        RTCPeerConnection: // eslint-disable-next-line no-undef
        window.RTCPeerConnection || // eslint-disable-next-line no-undef
        window.mozRTCPeerConnection || // eslint-disable-next-line no-undef
        window.webkitRTCPeerConnection,
        RTCSessionDescription: // eslint-disable-next-line no-undef
        window.RTCSessionDescription || // eslint-disable-next-line no-undef
        window.mozRTCSessionDescription || // eslint-disable-next-line no-undef
        window.webkitRTCSessionDescription,
        RTCIceCandidate: // eslint-disable-next-line no-undef
        window.RTCIceCandidate || // eslint-disable-next-line no-undef
        window.mozRTCIceCandidate || // eslint-disable-next-line no-undef
        window.webkitRTCIceCandidate
      };
      if (!wrtc.RTCPeerConnection) return null;
      return wrtc;
    }
  }, {
    key: "checkWebRTCAvailable",
    value: function checkWebRTCAvailable() {
      var doesNotHaveWebRTC = MewConnectCommon.getBrowserRTC() == null;
      return !doesNotHaveWebRTC; // return false
    }
  }, {
    key: "checkBrowser",
    value: function checkBrowser() {
      var browser = detectBrowser.detect();

      if (browser === null) {
        browser = {
          version: {
            split: function split() {
              return [1];
            }
          }
        };
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

          return MewConnectCommon.buildBrowserResult(true, 'Safari', "version: ".concat(browser.version));
        }

        if (browser.name === 'ie') {
          return MewConnectCommon.buildBrowserResult(true, 'Internet Explorer', '', true);
        }

        if (browser.name === 'edge') {
          return MewConnectCommon.buildBrowserResult(true, 'Edge', "version: ".concat(browser.version), true);
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
            return MewConnectCommon.buildBrowserResult(true, name, "version: ".concat(browserVersion));
          }

          return MewConnectCommon.buildBrowserResult(false, '', '');
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, {
    key: "buildBrowserResult",
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
}(EventEmitter__default['default']);

var MewConnectCrypto = /*#__PURE__*/function () {
  function MewConnectCrypto() {
    _classCallCheck(this, MewConnectCrypto);
  }

  _createClass(MewConnectCrypto, [{
    key: "setPrivate",
    value: function setPrivate(pvtKey) {
      this.prvt = Buffer.from(pvtKey, 'hex');
      this.pub = this.generatePublic(this.prvt);
      return {
        publicKey: this.pub,
        privateKey: this.prvt
      };
    }
  }, {
    key: "generateMessage",
    value: function generateMessage() {
      return crypto__default['default'].randomBytes(32).toString('hex');
    } // Not for the Address, but generate them for the connection check

  }, {
    key: "prepareKey",
    value: function prepareKey() {
      this.prvt = this.generatePrivate();
      this.pub = this.generatePublic(this.prvt);
      return {
        pub: this.pub,
        pvt: this.prvt
      };
    }
  }, {
    key: "generateKeys",
    value: function generateKeys() {
      this.prvt = this.generatePrivate();
      this.pub = this.generatePublic(this.prvt);
      return {
        publicKey: this.pub,
        privateKey: this.prvt
      };
    }
  }, {
    key: "generatePrivate",
    value: function generatePrivate() {
      var privKey;

      do {
        privKey = crypto__default['default'].randomBytes(32);
      } while (!secp256k1__default['default'].privateKeyVerify(privKey));

      return privKey;
    }
  }, {
    key: "generatePublic",
    value: function generatePublic(privKey) {
      var pvt = Buffer.from(privKey, 'hex');
      this.prvt = pvt;
      return secp256k1__default['default'].publicKeyCreate(pvt);
    }
  }, {
    key: "encrypt",
    value: function encrypt(dataToSend) {
      var publicKeyA = eccrypto__default['default'].getPublic(this.prvt);
      return new Promise(function (resolve, reject) {
        eccrypto__default['default'].encrypt(publicKeyA, Buffer.from(dataToSend)).then(function (_initial) {
          resolve(_initial);
        })["catch"](function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: "decrypt",
    value: function decrypt(dataToSee) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        eccrypto__default['default'].decrypt(_this.prvt, {
          ciphertext: Buffer.from(dataToSee.ciphertext),
          ephemPublicKey: Buffer.from(dataToSee.ephemPublicKey),
          iv: Buffer.from(dataToSee.iv),
          mac: Buffer.from(dataToSee.mac)
        }).then(function (_initial) {
          var result;

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
            console.error(e);
          }

          resolve(JSON.stringify(result));
        })["catch"](function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: "signMessage",
    value: function signMessage(msgToSign) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        try {
          var msg = ethUtils__default['default'].hashPersonalMessage(ethUtils__default['default'].toBuffer(msgToSign));
          var signed = ethUtils__default['default'].ecsign(Buffer.from(msg), Buffer.from(_this2.prvt, 'hex'));
          var combined = Buffer.concat([Buffer.from([signed.v]), Buffer.from(signed.r), Buffer.from(signed.s)]);
          var combinedHex = combined.toString('hex');
          resolve(combinedHex);
        } catch (e) {
          reject(e);
        }
      });
    }
  }, {
    key: "signMessageSync",
    value: function signMessageSync(msgToSign) {
      msgToSign = this.bufferToString(msgToSign);
      var msg = ethUtils__default['default'].hashPersonalMessage(ethUtils__default['default'].toBuffer(msgToSign));
      var signed = ethUtils__default['default'].ecsign(Buffer.from(msg), Buffer.from(this.prvt, 'hex'));
      var combined = Buffer.concat([Buffer.from([signed.v]), Buffer.from(signed.r), Buffer.from(signed.s)]);
      return combined.toString('hex');
    }
  }, {
    key: "bufferToConnId",
    value: function bufferToConnId(buf) {
      return buf.toString('hex').slice(0, 32);
    }
  }, {
    key: "generateConnId",
    value: function generateConnId(buf) {
      if (buf instanceof Buffer) {
        return buf.toString('hex').slice(0, 32);
      }

      return Buffer.from(buf).toString('hex').slice(0, 32);
    }
  }, {
    key: "isJSON",
    value: function isJSON(arg) {
      try {
        JSON.parse(arg);
        return true;
      } catch (e) {
        return false;
      }
    }
  }, {
    key: "toBuffer",
    value: function toBuffer(buf) {
      if (buf instanceof Buffer) {
        return buf;
      }

      return Buffer.from(buf, 'hex');
    }
  }, {
    key: "bufferToString",
    value: function bufferToString(buf) {
      if (buf instanceof Buffer) {
        return buf.toString('hex');
      }

      return buf;
    }
  }], [{
    key: "create",
    value: function create() {
      return new MewConnectCrypto();
    }
  }]);

  return MewConnectCrypto;
}();

var debugPeer$2 = debugLogger__default['default']('MEWconnectVerbose:websocketWrapper');
var debug$d = debugLogger__default['default']('MEWconnect:websocketWrapper');

var WebsocketConnection = /*#__PURE__*/function () {
  function WebsocketConnection() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, WebsocketConnection);

    this.options = options;
    this.socket = {};
    this.listeners = {};
    this.SOCKET_STATES = {
      0: 'CONNECTING',
      1: 'OPEN',
      2: 'CLOSING',
      3: 'CLOSED'
    };
    this.keepAlive = {
      ping: 'ping',
      pong: 'pong'
    };
  }
  /**
   * Connect to a given @websocketURL with given @options query params.
   * The client will connect and bind every on "message" event to the
   * onMessage() function.
   *
   * In order to handle a message, the on() member function must be used to add
   * an listener. This gives functionality similar to socket.io, in which
   * it is possible to so something like:
   *
   * socket.on('error', err => {})
   * as opposed to:
   * socket.on('message', message => { if (message.signal === 'error')... })
   *
   * @param  {String} websocketURL - WSS address of websocket API
   * @param  {Object} options - JSON-formatted connection query params
   * @param  {String} options.role - Either "initiator" or "receiver" accordingly
   * @param  {String} options.connId - Last 32 characters of the public key portion of the key-pair
   *                                  created for the particular paired connection
   * @param  {String} options.signed - Private key signed with the private key created for the connection
   */


  _createClass(WebsocketConnection, [{
    key: "connect",
    value: function () {
      var _connect = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(websocketUrl) {
        var options,
            url,
            _WebSocket,
            _args = arguments;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
                _context.prev = 1;
                url = "".concat(websocketUrl, "?").concat(queryString__default['default'].stringify(options));
                debug$d(url);

                if (!(typeof jest !== 'undefined' && typeof window === 'undefined')) {
                  _context.next = 12;
                  break;
                }

                _WebSocket = require('promise-ws')["default"];
                _context.next = 8;
                return _WebSocket.create(url);

              case 8:
                this.socket = _context.sent;
                this.socket.on('message', this.onMessage.bind(this));
                _context.next = 20;
                break;

              case 12:
                this.socket = new WebSocket(url);
                this.socket.onmessage = this.onMessage.bind(this);
                this.socket.onerror = this.onError.bind(this);
                this.socket.onopen = this.onOpen.bind(this);
                this.socket.onclose = this.onClose.bind(this);
                debug$d("extensions used: ".concat(this.socket.extensions, " or none"));
                debug$d("protocol used: ".concat(this.socket.protocol, " or default"));
                debug$d("binary type used: ".concat(this.socket.binaryType, " [either blob or arraybuffer]"));

              case 20:
                _context.next = 25;
                break;

              case 22:
                _context.prev = 22;
                _context.t0 = _context["catch"](1);
                debug$d('connect error:', _context.t0);

              case 25:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 22]]);
      }));

      function connect(_x) {
        return _connect.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: "disconnect",
    value: function () {
      var _disconnect = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                try {
                  debug$d('ADD DISCONNECT FUNCTIONALITY');
                  this.socket.close();
                } catch (e) {
                  debug$d('disconnect error:', e);
                }

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function disconnect() {
        return _disconnect.apply(this, arguments);
      }

      return disconnect;
    }()
  }, {
    key: "getSocketState",
    value: function getSocketState() {
      return this.SOCKET_STATES[this.socket.readyState];
    }
  }, {
    key: "onOpen",
    value: function onOpen() {
      debug$d("websocket onopen = ".concat(this.getSocketState())); // this.pinger = setInterval(() => {
      //   this.send(this.keepAlive.ping)
      // }, 5000)
    }
    /**
     * On 'message' event, parse the message and if possible,
     * call the event listener with the message's particular signal.
     *
     * Messages are received as stringified JSON objects, that when parsed,
     * take the following format:
     *
     * {
     *   signal, // This is the signal that the member function on() can bind to
     *   data, // The actual data payload
     *   message // Accompanying server message
     * }
     *
     * @param  {String} message - Stringified JSON payload sent by the server
     * @return {[type]}         [description]
     */

  }, {
    key: "onMessage",
    value: function onMessage(message) {
      try {
        debugPeer$2('message', message);
        debugPeer$2('message data', message.data);
        var parsedMessage;

        if (typeof jest === 'undefined') {
          var parsedMessageRaw = typeof message === 'string' ? JSON.parse(message) : message;
          parsedMessage = typeof parsedMessageRaw.data === 'string' ? JSON.parse(parsedMessageRaw.data) : parsedMessageRaw.data;
          debugPeer$2('parsedMessage', parsedMessage);
        } else {
          parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;
          debugPeer$2('parsedMessage: message', parsedMessage);
          debugPeer$2('parsedMessage: message data', parsedMessage.data);
        }

        if (parsedMessage.signal === 'ping' || parsedMessage.signal === 'pong') {
          return;
        }

        var signal = parsedMessage.signal;
        var data = parsedMessage.data;
        debug$d("onMessage Signal: ".concat(signal));

        try {
          this.listeners[signal].call(this, data);
        } catch (e) {
          debug$d(e); // Unhandled message signal
        }
      } catch (e) {
        debug$d('ERROR in onMessage', e);
      }
    }
  }, {
    key: "onError",
    value: function onError(errorEvent) {
      debug$d('Websocket ERROR');
      debug$d('websocket error event', errorEvent);
    }
  }, {
    key: "onClose",
    value: function onClose() {
      debug$d("websocket onClose = ".concat(this.getSocketState()));

      if (this.listeners['onClose']) {
        this.listeners['onClose'].call(this);
      }
    }
    /**
     * Bind an function to a particular message signal event.
     * E.G.
     * socket.on('error', err => {})
     *
     * @param  {String} signal - The signal to listen for
     * @param  {Function} fn - Function to perform on message signal
     */

  }, {
    key: "on",
    value: function on(signal, fn) {
      this.listeners[signal] = fn;
    }
    /**
     * Unbind a particular message signal event listener.
     *
     * @param  {String} signal - The signal to unbind
     */

  }, {
    key: "off",
    value: function off(signal) {
      delete this.listeners[signal];
    }
    /**
     * Send a data payload to a particular signal.
     *
     * @param  {String} signal - Particular action/signal such as "offersignal"
     * @param  {[type]} data - Data payload
     */

  }, {
    key: "send",
    value: function send(signal) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      try {
        debug$d("socket connection state: ".concat(this.getSocketState()));
        debug$d("send signal: ".concat(signal));
        debug$d('send data:', data);
        var message = JSON.stringify({
          action: signal,
          data: data
        });
        this.socket.send(message);
      } catch (e) {
        debug$d('ERROR in send', e);
      }
    }
  }]);

  return WebsocketConnection;
}();

var debug$c = debugLogger__default['default']('MEWconnect:initiator-V2');
var debugTurn = debugLogger__default['default']('MEWconnect:turn-V2');
var debugStages$3 = debugLogger__default['default']('MEWconnect:initiator-stages-V2');

var MewConnectInitiatorV2 = /*#__PURE__*/function (_MewConnectCommon) {
  _inherits(MewConnectInitiatorV2, _MewConnectCommon);

  var _super = _createSuper(MewConnectInitiatorV2);

  function MewConnectInitiatorV2() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, MewConnectInitiatorV2);

    _this = _super.call(this, 'V2');

    try {
      _this.uiCommunicator = _this.emit; //options.uiCommunicator;

      _this.supportedBrowser = MewConnectCommon.checkBrowser();
      _this.activePeerId = '';
      _this.allPeerIds = [];
      _this.peersCreated = [];
      _this.Url = options.url || 'wss://connect2.mewapi.io/staging';
      _this.active = true;
      _this.turnTest = options.turnTest;
      _this.socketConnected = false;
      _this.socketV1Connected = false;
      _this.connected = false;
      _this.tryingTurn = false;
      _this.turnDisabled = false;
      _this.signalUrl = null;
      _this.iceState = '';
      _this.turnServers = [];
      _this.states = _this.setResetStates();
      _this.offersSent = [];
      _this.webRtcCommunication = options.webRtcCommunication;
      _this.socket = new WebsocketConnection();
      _this.signals = _this.jsonDetails.signals;
      _this.signals = _this.jsonDetails.signalsV2;
      _this.rtcEvents = _this.jsonDetails.rtc;
      _this.version = _this.jsonDetails.version;
      _this.versions = _this.jsonDetails.versions;
      _this.lifeCycle = _this.jsonDetails.lifeCycle;
      _this.stunServers = options.stunServers || _this.jsonDetails.stunSrvers;
      _this.iceStates = _this.jsonDetails.iceConnectionState;
      _this.initiatorId = uuid__default['default']();
      _this.isActiveInstance = true;
      _this.timer = null;
      _this.retryCount = 0; // WebRTC options

      _this.trickle = false;
    } catch (e) {
      debug$c('constructor error:', e);
    }

    _this.webRtcCommunication.on(_this.lifeCycle.UsingFallback, function (id) {
      debug$c('USING TURN FALLBACK', id, _this.initiatorId);

      if (_this.initiatorId === id) {
        _this.useFallback();
      } else {
        _this.socketDisconnect();

        _this.isActiveInstance = false;
      }
    });

    return _this;
  }

  _createClass(MewConnectInitiatorV2, [{
    key: "setResetStates",
    value: function setResetStates() {
      return {
        offerSent: false,
        answerReceived: false
      };
    }
  }, {
    key: "isAlive",
    value: function isAlive() {
      return this.webRtcCommunication.isAlive();
    }
  }, {
    key: "setWebRtc",
    value: function setWebRtc(webRtcCommunication) {
      this.webRtcCommunication = webRtcCommunication;
    }
  }, {
    key: "getSocketConnectionState",
    // Returns a boolean indicating whether the socket connection exists and is active
    value: function getSocketConnectionState() {
      return this.socketV1Connected || this.socketConnected;
    } // Returns a boolean indicating whether the WebRTC connection exists and is active

  }, {
    key: "getConnectonState",
    value: function getConnectonState() {
      return this.connected;
    } // can be used to listen to specific events, especially those that pass data

  }, {
    key: "uiCommunicator",
    value: function uiCommunicator(event, data) {
      this.emit(event, data);
      this.emitStatus(event);
    } // special status emitter to allow simple listening of various statuses in one listener

  }, {
    key: "emitStatus",
    value: function emitStatus(event) {
      this.emit('status', event);
    } // Emit/Provide the details used in creating the QR Code

  }, {
    key: "displayCode",
    value: function displayCode(privateKey) {
      try {
        if (privateKey instanceof Buffer) {
          privateKey = privateKey.toString('hex');
        }

        debug$c('handshake', privateKey);
        this.socketKey = privateKey;
        var separator = this.jsonDetails.connectionCodeSeparator;
        var qrCodeString = this.version + separator + privateKey + separator + this.connId;
        debug$c(qrCodeString);
        this.uiCommunicator(this.lifeCycle.codeDisplay, qrCodeString);
        this.uiCommunicator(this.lifeCycle.checkNumber, privateKey);
        this.uiCommunicator(this.lifeCycle.ConnectionId, this.connId);
      } catch (e) {
        debug$c('displayCode error:', e);
      }
    }
  }, {
    key: "initiatorStart",
    value: function () {
      var _initiatorStart = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var url,
            cryptoInstance,
            details,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = _args.length > 0 && _args[0] !== undefined ? _args[0] : this.Url;
                cryptoInstance = _args.length > 1 ? _args[1] : undefined;
                details = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
                this.connId = details.connId;
                this.signed = details.signed;
                _context.prev = 5;
                debug$c('initiatorStart V2');
                this.mewCrypto = cryptoInstance;
                this.uiCommunicator(this.lifeCycle.signatureCheck);
                _context.next = 11;
                return this.connect(url);

              case 11:
                this.setupListeners();
                _context.next = 17;
                break;

              case 14:
                _context.prev = 14;
                _context.t0 = _context["catch"](5);
                debug$c('initiatorStart error:', _context.t0);

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[5, 14]]);
      }));

      function initiatorStart() {
        return _initiatorStart.apply(this, arguments);
      }

      return initiatorStart;
    }()
  }, {
    key: "connect",
    value: function () {
      var _connect = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(websocketURL) {
        var options,
            queryOptions,
            _args2 = arguments;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : null;
                _context2.prev = 1;

                if (typeof jest !== 'undefined' && this.connId === null) ;

                queryOptions = options ? options : {
                  role: this.jsonDetails.stages.initiator,
                  connId: this.connId,
                  signed: this.signed
                };
                debug$c(websocketURL, queryOptions);
                _context2.next = 7;
                return this.socket.connect(this.Url, queryOptions);

              case 7:
                _context2.next = 12;
                break;

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](1);
                debug$c('connect error:', _context2.t0);

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 9]]);
      }));

      function connect(_x) {
        return _connect.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: "regenerateCode",
    value: function () {
      var _regenerateCode = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(this.signalUrl === null)) {
                  _context3.next = 2;
                  break;
                }

                throw Error('regenerateCode called before initial code generation');

              case 2:
                this.socketDisconnect();
                this.initiatorStart(this.signalUrl);

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function regenerateCode() {
        return _regenerateCode.apply(this, arguments);
      }

      return regenerateCode;
    }()
  }, {
    key: "useFallback",
    value: function () {
      var _useFallback = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.retryCount++;

                if (!(this.retryCount >= 4)) {
                  _context4.next = 4;
                  break;
                }

                this.emit('showRefresh');
                return _context4.abrupt("return");

              case 4:
                if (!this.credentialsRequested) {
                  this.credentialsRequested = true;
                  this.socketEmit(this.signals.tryTurn, {
                    connId: this.connId
                  });
                }

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function useFallback() {
        return _useFallback.apply(this, arguments);
      }

      return useFallback;
    }()
  }, {
    key: "socketEmit",
    value: function socketEmit(signal, data) {
      try {
        if (this.socket) this.socket.send(signal, data);
      } catch (e) {
        debug$c('socketEmit error:', e);
      }
    }
  }, {
    key: "socketDisconnect",
    value: function socketDisconnect() {
      debug$c("Socket already disconnected: ".concat(this.active));
      this.active = false;
      if (this.socket) this.socket.disconnect()["catch"](function (err) {
        debug$c('socketDisconnect', err);
      });
      debug$c('webSocket Disconnected');
      this.socket = null;
      this.socketConnected = false;
    }
  }, {
    key: "socketOn",
    value: function socketOn(signal, func) {
      try {
        this.socket.on(signal, func);
      } catch (e) {
        debug$c('socketOn error:', e);
      }
    }
  }, {
    key: "setupListeners",
    value: function setupListeners() {
      var _this2 = this;

      try {
        debugStages$3('INITIATOR CONNECT');
        this.uiCommunicator(this.lifeCycle.SocketConnectedEvent);
        this.socket.on(this.signals.connect, function () {
          debugStages$3('SOCKET CONNECTED');
          _this2.socketConnected = true;

          _this2.emit('SOCKET_CONNECTED');
        });
        this.socket.on('onClose', function () {
          debugStages$3('SOCKET DISCONNECTED');
          _this2.socketConnected = false;

          if (!_this2.connected) {
            _this2.emit('socketDisconnected');
          }
        });
        this.socketOn(this.signals.disconnected, function () {
          _this2.emit('socketDisconnected');
        });
        this.socketOn(this.signals.initiated, this.initiated.bind(this));
        this.socketOn(this.signals.confirmation, function (data) {
          if (data !== '' && data) {
            data.iceServers.map(function (obj) {
              var newObject = {};
              delete Object.assign(newObject, obj, _defineProperty({}, 'urls', obj['url']))['url'];
              return newObject;
            });

            _this2.beginRtcSequence(data.iceServers);
          } else {
            _this2.beginRtcSequence(stunServers);
          }
        }); // this.signals.answer

        this.socketOn('answer', this.recieveAnswer.bind(this)); // TODO: check if these failure signals are even being used in V2

        this.socketOn(this.signals.confirmationFailedBusy, this.busyFailure.bind(this));
        this.socketOn(this.signals.confirmationFailed, this.confirmationFailure.bind(this));
        this.socketOn(this.signals.invalidConnection, this.invalidFailure.bind(this));
        this.socketOn(this.signals.disconnect, this.socketDisconnectHandler.bind(this));
        this.socketOn(this.signals.attemptingTurn, this.willAttemptTurn.bind(this));
        this.socketOn(this.signals.turnToken, this.beginTurn.bind(this));
      } catch (e) {
        debug$c('setupListeners error:', e);
      }
    } // Handle Socket Disconnect Event

  }, {
    key: "socketDisconnectHandler",
    value: function socketDisconnectHandler(reason) {
      debug$c(reason);
      this.socketConnected = false;
    } // ----- Failure Handlers
    // Handle Socket Attempting Turn informative signal
    // Provide Notice that initial WebRTC connection failed and the fallback method will be used

  }, {
    key: "willAttemptTurn",
    value: function willAttemptTurn() {
      this.tryingTurn = true;
      debugTurn('TRY TURN CONNECTION');
      this.uiCommunicator(this.lifeCycle.UsingFallback);
    } // Handle Socket event to initiate turn connection
    // Handle Receipt of TURN server details, and begin a WebRTC connection attempt using TURN

  }, {
    key: "beginTurn",
    value: function beginTurn(data) {
      this.tryingTurn = true;
      this.credentialsRequested = false;
      this.webRtcCommunication.turnReset(this.activePeerId);
      this.retryViaTurn(data);
    } // Handle Failure due to an attempt to join a connection with two existing endpoints

  }, {
    key: "busyFailure",
    value: function busyFailure() {
      this.uiCommunicator(this.lifeCycle.Failed, this.lifeCycle.confirmationFailedBusyEvent);
      debug$c('confirmation Failed: Busy');
    } // Handle Failure due to no opposing peer existing

  }, {
    key: "invalidFailure",
    value: function invalidFailure() {
      this.uiCommunicator(this.lifeCycle.Failed, this.lifeCycle.invalidConnectionEvent);
      debug$c('confirmation Failed: no opposite peer found');
    } // Handle Failure due to the handshake/ verify details being invalid for the connection ID

  }, {
    key: "confirmationFailure",
    value: function confirmationFailure() {
      this.uiCommunicator(this.lifeCycle.Failed, this.lifeCycle.confirmationFailedEvent);
      debug$c('confirmation Failed: invalid confirmation');
    }
  }, {
    key: "initiated",
    value: function initiated(data) {
      this.uiCommunicator(this.signals.initiated, data);
      debug$c('initiator', this.signals.initiated, data);
    }
  }, {
    key: "beginRtcSequence",
    value: function beginRtcSequence(stunServers) {
      this.emit('socketPaired');
      this.emit('beginRtcSequence', 'V2');

      try {
        debug$c('beginRtcSequence ');
        debug$c('sendOffer', stunServers);
        this.iceServers = null;
        this.stunServers = stunServers !== '' ? this.stunServers : stunServers;
        var options = {
          servers: this.stunServers,
          webRtcConfig: {
            initiator: true,
            trickle: this.trickle,
            config: {
              iceServers: this.stunServers
            },
            wrtc: wrtc__default['default']
          }
        };
        this.initiatorStartRTC(options);
      } catch (e) {
        debug$c('beginRtcSequence error:', e);
      }
    }
  }, {
    key: "sendOffer",
    value: function () {
      var _sendOffer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(data) {
        var _this3 = this;

        var encryptedSend;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (this.isActiveInstance) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt("return");

              case 2:
                if (!this.offersSent.includes(data.sdp)) {
                  _context5.next = 4;
                  break;
                }

                return _context5.abrupt("return");

              case 4:
                this.offersSent.push(data.sdp); // App was waiting for turn data and not sending back an answer

                this.offerTimer = setTimeout(function () {
                  _this3.useFallback();
                }, 5000);
                debug$c('sendOffer', this.initiatorId);
                _context5.prev = 7;
                this.emit('sendingOffer');
                debug$c('SIGNAL', JSON.stringify(data));
                _context5.next = 12;
                return this.mewCrypto.encrypt(JSON.stringify(data));

              case 12:
                encryptedSend = _context5.sent;
                this.states.offer = true;
                this.socketEmit(this.signals.offerSignal, {
                  data: encryptedSend,
                  connId: this.connId
                });
                _context5.next = 21;
                break;

              case 17:
                _context5.prev = 17;
                _context5.t0 = _context5["catch"](7);
                console.error(_context5.t0);
                debug$c('sendOffer error:', _context5.t0);

              case 21:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[7, 17]]);
      }));

      function sendOffer(_x2) {
        return _sendOffer.apply(this, arguments);
      }

      return sendOffer;
    }() // Handle the WebRTC ANSWER from the opposite (mobile) peer

  }, {
    key: "recieveAnswer",
    value: function () {
      var _recieveAnswer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(data) {
        var plainTextOffer;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (this.isActiveInstance) {
                  _context6.next = 2;
                  break;
                }

                return _context6.abrupt("return");

              case 2:
                if (this.offerTimer) {
                  clearTimeout(this.offerTimer);
                }

                debug$c('received answer');
                _context6.prev = 4;
                _context6.next = 7;
                return this.mewCrypto.decrypt(data.data);

              case 7:
                plainTextOffer = _context6.sent;
                this.uiCommunicator(this.lifeCycle.answerReceived);
                debug$c(plainTextOffer);
                this.webRtcCommunication.receiveAnswer(JSON.parse(plainTextOffer), this.activePeerId);
                debug$c('answer relayed to webRTC instance');
                _context6.next = 18;
                break;

              case 14:
                _context6.prev = 14;
                _context6.t0 = _context6["catch"](4);
                console.error(_context6.t0);
                debug$c('recieveAnswer error:', _context6.t0);

              case 18:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[4, 14]]);
      }));

      function recieveAnswer(_x3) {
        return _recieveAnswer.apply(this, arguments);
      }

      return recieveAnswer;
    }()
  }, {
    key: "setActivePeerId",
    value: function setActivePeerId(peerId) {
      this.activePeerId = peerId; // this.allPeerIds.push(this.activePeerId);
    }
  }, {
    key: "getActivePeerId",
    value: function getActivePeerId() {
      var split = this.activePeerId.split('-');
      return split.join('-');
    }
  }, {
    key: "initiatorStartRTC",
    value: function initiatorStartRTC(options) {
      try {
        debug$c('initiatorStartRTC');
        var webRtcConfig = options.webRtcConfig || {};
        var webRtcServers = webRtcConfig.servers || this.stunServers;
        this.iceServers = null;
        var defaultOptions = {
          initiator: true,
          trickle: this.trickle,
          config: {
            iceServers: webRtcServers
          },
          wrtc: wrtc__default['default']
        };

        var simpleOptions = _objectSpread2(_objectSpread2({}, defaultOptions), webRtcConfig);

        this.webRtcCommunication.setConnectionVersion('V2');
        this.webRtcCommunication.start(simpleOptions);
        debug$c("initiatorStartRTC - options: ".concat(simpleOptions));
        this.uiCommunicator(this.lifeCycle.RtcInitiatedEvent);
        var peerID = this.webRtcCommunication.getActivePeerId();
        this.setActivePeerId(peerID);
        this.webRtcCommunication.once(this.jsonDetails.lifeCycle.RtcConnectedEvent, this.onConnect.bind(this, peerID));
        this.webRtcCommunication.once('signal', this.sendOffer.bind(this));
        this.webRtcCommunication.once('data', this.onData.bind(this, peerID));
      } catch (e) {
        debug$c('initiatorStartRTC error:', e);
      }
    }
  }, {
    key: "onConnect",
    value: function onConnect(peerID) {
      if (!this.isActiveInstance) return;

      try {
        debugStages$3('RTC CONNECT', 'ok');
        debug$c('peerID', peerID);
        this.connected = true;
        this.turnDisabled = true;
        this.socketEmit(this.signals.rtcConnected, this.socketKey);
        this.socketDisconnect();
      } catch (e) {
        debug$c('onConnect error:', e);
      }
    }
  }, {
    key: "decryptIncomming",
    value: function () {
      var _decryptIncomming = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(data) {
        var parsedJson;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!this.isJSON(data)) {
                  _context7.next = 7;
                  break;
                }

                parsedJson = JSON.parse(data);

                if (!(parsedJson.type && parsedJson.data)) {
                  _context7.next = 4;
                  break;
                }

                return _context7.abrupt("return", parsedJson);

              case 4:
                _context7.next = 6;
                return this.mewCrypto.decrypt(JSON.parse(data));

              case 6:
                return _context7.abrupt("return", _context7.sent);

              case 7:
                if (!(data.type && data.data)) {
                  _context7.next = 9;
                  break;
                }

                return _context7.abrupt("return", data);

              case 9:
                _context7.next = 11;
                return this.mewCrypto.decrypt(JSON.parse(JSON.stringify(data)));

              case 11:
                return _context7.abrupt("return", _context7.sent);

              case 12:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function decryptIncomming(_x4) {
        return _decryptIncomming.apply(this, arguments);
      }

      return decryptIncomming;
    }()
  }, {
    key: "onData",
    value: function () {
      var _onData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(peerID, data) {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                debug$c(data); // todo remove dev item

                debug$c('DATA RECEIVED', data.toString());
                debug$c('peerID', peerID);

              case 3:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function onData(_x5, _x6) {
        return _onData.apply(this, arguments);
      }

      return onData;
    }()
  }, {
    key: "onClose",
    value: function onClose(peerID, data) {
      debugStages$3('WRTC MAYBE CLOSE');
      debug$c('peerID', peerID);

      if (!this.isAlive()) {
        debugStages$3('WRTC CLOSE', data);

        if (this.connected) {
          this.connected = false;
        } else {
          this.connected = false;
        }
      }
    }
  }, {
    key: "onError",
    value: function onError(peerID, err) {
      debugStages$3('WRTC ERROR');
      debug$c('peerID', peerID);
      debug$c(err.code);
      debug$c('error', err);

      if (!this.connected && !this.tryingTurn && !this.turnDisabled) {
        this.useFallback();
      } else if (!this.connected && this.tryingTurn && !this.turnDisabled) {
        this.emit('ShowReload');
      } else {
        if (!this.isAlive()) {
          this.uiCommunicator(this.lifeCycle.RtcErrorEvent);
        }
      }
    } // ----- WebRTC Communication Methods

  }, {
    key: "sendRtcMessageClosure",
    value: function sendRtcMessageClosure(type, msg) {
      var _this4 = this;

      return function () {
        debug$c("[SEND RTC MESSAGE Closure] type:  ".concat(type, ",  message:  ").concat(msg));

        _this4.rtcSend(JSON.stringify({
          type: type,
          data: msg
        }));
      };
    }
  }, {
    key: "sendRtcMessage",
    value: function sendRtcMessage(type, msg) {
      debug$c("[SEND RTC MESSAGE] type:  ".concat(type, ",  message:  ").concat(msg));
      this.rtcSend(JSON.stringify({
        type: type,
        data: msg
      }));
    }
  }, {
    key: "rtcDestroy",
    value: function rtcDestroy() {
      if (this.active) {
        this.webRtcCommunication.rtcDestroy();
        this.connected = false;
        this.uiCommunicator(this.lifeCycle.RtcDestroyedEvent);
      }
    }
  }, {
    key: "disconnectRTCClosure",
    value: function disconnectRTCClosure() {
      var _this5 = this;

      return function () {
        debugStages$3('DISCONNECT RTC Closure');
        _this5.connected = false;

        _this5.uiCommunicator(_this5.lifeCycle.RtcDisconnectEvent);

        _this5.rtcDestroy();

        _this5.instance = null;
      };
    }
  }, {
    key: "disconnectRTC",
    value: function disconnectRTC() {
      debugStages$3('V2 DISCONNECT RTC');

      if (this.connected) {
        this.connected = false;
        this.uiCommunicator(this.lifeCycle.RtcDisconnectEvent);
        this.rtcDestroy();
        this.instance = null;
      }
    }
  }, {
    key: "retryViaTurn",
    value: function retryViaTurn(data) {
      try {
        this.emit('retryingViaTurn');
        this.states = this.setResetStates();
        debugTurn('Retrying via TURN v2');
        this.iceServers = null;
        var options = {
          servers: data.iceServers.map(function (obj) {
            var newObject = {};
            delete Object.assign(newObject, obj, _defineProperty({}, 'urls', obj['url']))['url'];
            return newObject;
          }),
          webRtcConfig: {
            initiator: true,
            trickle: this.trickle,
            config: {
              iceServers: data.iceServers.map(function (obj) {
                var newObject = {};
                delete Object.assign(newObject, obj, _defineProperty({}, 'urls', obj['url']))['url'];
                return newObject;
              })
            },
            wrtc: wrtc__default['default']
          }
        };
        debug$c('turn info arrived and begin turn'); // todo remove dev item

        this.initiatorStartRTC(options);
      } catch (e) {
        debugTurn('retryViaTurn error:', e);
      }
    }
  }], [{
    key: "checkBrowser",
    value: function checkBrowser() {
      return MewConnectCommon.checkBrowser();
    }
  }, {
    key: "checkWebRTCAvailable",
    value: function checkWebRTCAvailable() {
      return MewConnectCommon.checkWebRTCAvailable();
    }
  }]);

  return MewConnectInitiatorV2;
}(MewConnectCommon);

var debug$b = debugLogger__default['default']('MEWconnect:initiator-V1');
var debugPeer$1 = debugLogger__default['default']('MEWconnectVerbose:peer-instances-V1');
var debugStages$2 = debugLogger__default['default']('MEWconnect:initiator-stages-V1');

var MewConnectInitiatorV1 = /*#__PURE__*/function (_MewConnectCommon) {
  _inherits(MewConnectInitiatorV1, _MewConnectCommon);

  var _super = _createSuper(MewConnectInitiatorV1);

  function MewConnectInitiatorV1() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, MewConnectInitiatorV1);

    _this = _super.call(this, 'V1');

    try {
      _this.supportedBrowser = MewConnectCommon.checkBrowser();
      _this.uiCommunicator = options.uiCommunicator;
      _this.active = true;
      _this.activePeerId = '';
      _this.allPeerIds = [];
      _this.peersCreated = [];
      _this.Url = options.url || V1endpoint;
      _this.v2Url = options.v2Url || V2endpoint;
      _this.turnTest = options.turnTest;
      _this.p = null;
      _this.socketConnected = false;
      _this.connected = false;
      _this.tryingTurn = false;
      _this.turnDisabled = false;
      _this.signalUrl = null;
      _this.iceState = '';
      _this.turnServers = [];
      _this.webRtcCommunication = options.webRtcCommunication;
      _this.io = io__default['default'];
      _this.signals = _this.jsonDetails.signals;
      _this.rtcEvents = _this.jsonDetails.rtc;
      _this.version = _this.jsonDetails.version;
      _this.versions = _this.jsonDetails.versions;
      _this.lifeCycle = _this.jsonDetails.lifeCycle;
      _this.stunServers = options.stunServers || _this.jsonDetails.stunSrvers;
      _this.iceStates = _this.jsonDetails.iceConnectionState;
      _this.timer = null;
      debug$b(_this.signals);
    } catch (e) {
      debug$b('constructor error:', e);
    }

    return _this;
  }

  _createClass(MewConnectInitiatorV1, [{
    key: "setWebRtc",
    value: function setWebRtc(webRtcCommunication) {
      this.webRtcCommunication = webRtcCommunication;
    } // Initalize a websocket connection with the signal server

  }, {
    key: "initiatorStart",
    value: function () {
      var _initiatorStart = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var url,
            cryptoInstance,
            details,
            toSign,
            options,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = _args.length > 0 && _args[0] !== undefined ? _args[0] : this.Url;
                cryptoInstance = _args.length > 1 ? _args[1] : undefined;
                details = _args.length > 2 ? _args[2] : undefined;

                try {
                  this.mewCrypto = cryptoInstance;
                  toSign = this.mewCrypto.generateMessage();
                  this.connId = details.connId;
                  this.uiCommunicator(this.lifeCycle.signatureCheck);
                  options = {
                    query: {
                      stage: 'initiator',
                      signed: details.signed,
                      message: toSign,
                      connId: this.connId
                    },
                    transports: ['websocket', 'polling', 'flashsocket'],
                    secure: true
                  };
                  this.socketManager = this.io(url, options);
                  this.socket = this.socketManager.connect();
                  this.initiatorConnect(this.socket);
                } catch (e) {
                  debug$b(e);
                }

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function initiatorStart() {
        return _initiatorStart.apply(this, arguments);
      }

      return initiatorStart;
    }() // ------------- WebSocket Communication Methods and Handlers ------------------------------
    // ----- Setup handlers for communication with the signal server

  }, {
    key: "initiatorConnect",
    value: function initiatorConnect(socket) {
      var _this2 = this;

      debugStages$2('INITIATOR CONNECT');
      this.uiCommunicator(this.lifeCycle.SocketConnectedEvent);
      this.socket.on(this.signals.connect, function () {
        debug$b(': SOCKET CONNECTED');
        _this2.socketConnected = true;

        _this2.emit('SOCKET_CONNECTED');
      });
      this.socketOn(this.signals.confirmation, this.beginRtcSequence.bind(this)); // response

      this.socketOn(this.signals.answer, this.recieveAnswer.bind(this));
      this.socketOn(this.signals.confirmationFailedBusy, this.busyFailure.bind(this));
      this.socketOn(this.signals.confirmationFailed, this.confirmationFailure.bind(this));
      this.socketOn(this.signals.invalidConnection, this.invalidFailure.bind(this));
      this.socketOn(this.signals.disconnect, this.socketDisconnectHandler.bind(this));
      this.socketOn(this.signals.attemptingTurn, this.willAttemptTurn.bind(this));
      this.socketOn(this.signals.turnToken, this.beginTurn.bind(this));
      return socket;
    } // ----- Wrapper around Socket.IO methods
    // socket.emit wrapper

  }, {
    key: "socketEmit",
    value: function socketEmit(signal, data) {
      this.socket.binary(false).emit(signal, data);
    } // socket.disconnect wrapper

  }, {
    key: "socketDisconnect",
    value: function socketDisconnect() {
      this.active = false;
      this.socket.disconnect();
      this.socketConnected = false;
      debug$b('webSocket Disconnected');
    } // socket.on listener registration wrapper

  }, {
    key: "socketOn",
    value: function socketOn(signal, func) {
      this.socket.on(signal, func);
    } // ----- Socket Event handlers
    // Handle Socket Disconnect Event

  }, {
    key: "socketDisconnectHandler",
    value: function socketDisconnectHandler(reason) {
      debug$b(reason);
      this.socketConnected = false;
    } // Handle Socket Attempting Turn informative signal
    // Provide Notice that initial WebRTC connection failed and the fallback method will be used

  }, {
    key: "willAttemptTurn",
    value: function willAttemptTurn() {
      this.tryingTurn = true;
      debugStages$2('TRY TURN CONNECTION');
      this.uiCommunicator(this.lifeCycle.UsingFallback);
    } // Handle Socket event to initiate turn connection
    // Handle Receipt of TURN server details, and begin a WebRTC connection attempt using TURN

  }, {
    key: "beginTurn",
    value: function beginTurn(data) {
      this.tryingTurn = true;
      this.webRtcCommunication.turnReset(this.activePeerId);
      this.retryViaTurn(data);
    } // ----- Failure Handlers
    // Handle Failure due to an attempt to join a connection with two existing endpoints

  }, {
    key: "busyFailure",
    value: function busyFailure() {
      this.uiCommunicator(this.lifeCycle.Failed, this.lifeCycle.confirmationFailedBusyEvent);
      debug$b('confirmation Failed: Busy');
    } // Handle Failure due to no opposing peer existing

  }, {
    key: "invalidFailure",
    value: function invalidFailure() {
      this.uiCommunicator(this.lifeCycle.Failed, this.lifeCycle.invalidConnectionEvent);
      debug$b('confirmation Failed: no opposite peer found');
    } // Handle Failure due to the handshake/ verify details being invalid for the connection ID

  }, {
    key: "confirmationFailure",
    value: function confirmationFailure() {
      this.uiCommunicator(this.lifeCycle.Failed, this.lifeCycle.confirmationFailedEvent);
      debug$b('confirmation Failed: invalid confirmation');
    } // =============== [End] WebSocket Communication Methods and Handlers ========================
    // ======================== [Start] WebRTC Communication Methods =============================
    // ----- WebRTC Setup Methods
    // A connection pair exists, create and send WebRTC OFFER

  }, {
    key: "beginRtcSequence",
    value: function () {
      var _beginRtcSequence = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data) {
        var options;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.emit('socketPaired');
                debug$b(data);
                debug$b('sendOffer: SOCKET CONFIRMATION');
                this.emit('beginRtcSequence', 'V1'); // this.connPath = source;
                // const plainTextVersion = await this.mewCrypto.decrypt(data.version);
                // this.peerVersion = plainTextVersion;
                // this.uiCommunicator(this.lifeCycle.receiverVersion, plainTextVersion);

                debug$b('sendOffer', data);
                options = {
                  webRtcConfig: {
                    servers: this.stunServers
                  }
                };
                this.initiatorStartRTC(this.socket, options);

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function beginRtcSequence(_x) {
        return _beginRtcSequence.apply(this, arguments);
      }

      return beginRtcSequence;
    }()
  }, {
    key: "initiatorStartRTC",
    value: function initiatorStartRTC(socket, options) {
      debug$b('initiatorStartRTC');
      var webRtcConfig = options.webRtcConfig || {};
      var webRtcServers = webRtcConfig.servers || this.stunServers;
      var suppliedOptions = options.webRtcOptions || {};
      var defaultOptions = {
        initiator: true,
        trickle: false,
        iceTransportPolicy: 'relay',
        config: {
          iceServers: webRtcServers
        },
        wrtc: wrtc__default['default']
      };

      var simpleOptions = _objectSpread2(_objectSpread2({}, defaultOptions), {}, {
        suppliedOptions: suppliedOptions
      });

      debug$b("initiatorStartRTC - options: ".concat(simpleOptions));
      debug$b('START V1'); // todo remove dev item

      this.webRtcCommunication.setConnectionVersion('V1');
      this.webRtcCommunication.start(simpleOptions);
      this.uiCommunicator(this.lifeCycle.RtcInitiatedEvent);
      var peerID = this.webRtcCommunication.getActivePeerId();
      this.webRtcCommunication.once('connect', this.onConnect.bind(this, peerID));
      this.webRtcCommunication.once('signal', this.onSignal.bind(this));
      this.webRtcCommunication.once('data', this.onData.bind(this, peerID));
    }
  }, {
    key: "onConnect",
    value: function onConnect(peerID) {
      debugStages$2('RTC CONNECT', 'ok');
      debugPeer$1('peerID', peerID);
      this.connected = true;
      this.turnDisabled = true;
      this.socketEmit(this.signals.rtcConnected, this.socketKey);
      this.socketDisconnect();
      this.uiCommunicator(this.lifeCycle.RtcConnectedEvent);
    }
  }, {
    key: "onSignal",
    value: function () {
      var _onSignal = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data) {
        var encryptedSend;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                debug$b('onSignal');
                debug$b(data);
                _context3.next = 4;
                return this.mewCrypto.encrypt(JSON.stringify(data));

              case 4:
                encryptedSend = _context3.sent;
                this.uiCommunicator(this.lifeCycle.sendOffer);
                this.socketEmit(this.signals.offerSignal, {
                  data: encryptedSend,
                  connId: this.connId,
                  options: this.stunServers
                });

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function onSignal(_x2) {
        return _onSignal.apply(this, arguments);
      }

      return onSignal;
    }() // Handle the WebRTC ANSWER from the opposite (mobile) peer

  }, {
    key: "recieveAnswer",
    value: function () {
      var _recieveAnswer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(data) {
        var plainTextOffer;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                debug$b('recieveAnswer', data);
                _context4.prev = 1;
                _context4.next = 4;
                return this.mewCrypto.decrypt(data.data);

              case 4:
                plainTextOffer = _context4.sent;
                this.webRtcCommunication.receiveAnswer(JSON.parse(plainTextOffer));
                _context4.next = 11;
                break;

              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4["catch"](1);
                console.error(_context4.t0);

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[1, 8]]);
      }));

      function recieveAnswer(_x3) {
        return _recieveAnswer.apply(this, arguments);
      }

      return recieveAnswer;
    }()
  }, {
    key: "rtcRecieveAnswer",
    value: function rtcRecieveAnswer(data) {
      this.uiCommunicator(this.lifeCycle.answerReceived);
      this.p.signal(JSON.parse(data.data));
    }
  }, {
    key: "rtcDestroy",
    value: function rtcDestroy() {
      if (this.active) {
        this.webRtcCommunication.rtcDestroy();
        this.connected = false;
        this.uiCommunicator(this.lifeCycle.RtcDestroyedEvent);
      }
    }
  }, {
    key: "disconnectRTCClosure",
    value: function disconnectRTCClosure() {
      var _this3 = this;

      return function () {
        debugStages$2('DISCONNECT RTC Closure');
        _this3.connected = false;

        _this3.uiCommunicator(_this3.lifeCycle.RtcDisconnectEvent);

        _this3.rtcDestroy();

        _this3.instance = null;
      };
    }
  }, {
    key: "disconnectRTC",
    value: function disconnectRTC() {
      debugStages$2('DISCONNECT RTC');
      this.connected = false;
      this.uiCommunicator(this.lifeCycle.RtcDisconnectEvent);
      this.rtcDestroy();
      this.instance = null;
    }
  }, {
    key: "useFallback",
    value: function () {
      var _useFallback = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                this.socketEmit(this.signals.tryTurn, {
                  connId: this.connId
                });

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function useFallback() {
        return _useFallback.apply(this, arguments);
      }

      return useFallback;
    }() // ----- WebRTC Communication Event Handlers

  }, {
    key: "onData",
    value: function onData(data) {
      this.emit(data.type, data.data);
    }
  }, {
    key: "retryViaTurn",
    value: function retryViaTurn(data) {
      debugStages$2('Retrying via TURN v1');
      debug$b(data);
      var options = {
        signalListener: this.initiatorSignalListener,
        webRtcConfig: {
          servers: data.data
        }
      };
      this.beginRtcSequence(options);
    }
  }]);

  return MewConnectInitiatorV1;
}(MewConnectCommon);

var image$4 = "data:image/png;base64, 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";

var image$3 = "data:image/png;base64,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";

var refreshIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxN3B4IiB2aWV3Qm94PSIwIDAgMTggMTciIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ5LjIgKDUxMTYwKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5leGNoYW5nZSAoMSk8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iU3ltYm9scyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9ImFkZHJlc3MtYm94IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTkwLjAwMDAwMCwgLTEwNy4wMDAwMDApIiBmaWxsPSIjMDAwMDAwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwLjIiPgogICAgICAgICAgICA8ZyBpZD0iZXhjaGFuZ2UtKDEpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOTEuMDAwMDAwLCAxMDguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTUuMDY2OTg5OCw5LjMwNTY0NTY4IEMxNS4wNjY5ODk4LDEwLjY2ODM5NzEgMTQuMjIzMjYxMiwxMC43NjU3MzY1IDE0LjA2MjU1MSwxMC43NjU3MzY1IEwxLjcxMjk3NjE4LDEwLjc2NTczNjUgTDQuMzY5NzE2NzYsOC4xOTExMDk2NyBMMy42NjE1ODc0Miw3LjUgTDAuMTQ2MDUxNjc3LDEwLjkwNjg3ODcgQy0wLjA0ODY4Mzg5MjIsMTEuMDk2NzIwOSAtMC4wNDg2ODM4OTIyLDExLjQwMzI3OTEgMC4xNDYwNTE2NzcsMTEuNTkzMTIxMyBMMy42NjE1ODc0MiwxNSBMNC4zNjk3MTY3NiwxNC4zMTM3NTczIEwxLjcxMjk3NjE4LDExLjczOTEzMDQgTDE0LjA2MjU1MSwxMS43MzkxMzA0IEMxNC43NTU2MTM4LDExLjczOTEzMDQgMTYuMDcxNDI4NiwxMS4yNTI0MzM1IDE2LjA3MTQyODYsOS4zMDU2NDU2OCBMMTYuMDcxNDI4Niw3Ljg0NTU1NDgzIEwxNS4wNjY5ODk4LDcuODQ1NTU0ODMgTDE1LjA2Njk4OTgsOS4zMDU2NDU2OCBaIiBpZD0iU2hhcGUiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xLjAwNDQzODc4LDUuNjk5MjIxMjggQzEuMDA0NDM4NzgsNC4zMzY0Njk4MiAxLjg0ODE2NzM2LDQuMjM5MTMwNDMgMi4wMDg4Nzc1Niw0LjIzOTEzMDQzIEwxNC4zNTg0NTI0LDQuMjM5MTMwNDMgTDExLjcwMTcxMTgsNi44MTM3NTczIEwxMi40MDk4NDEyLDcuNSBMMTUuOTI1Mzc2OSw0LjA5MzEyMTM1IEMxNi4xMjAxMTI1LDMuOTAzMjc5MTIgMTYuMTIwMTEyNSwzLjU5NjcyMDg4IDE1LjkyNTM3NjksMy40MDY4Nzg2NSBMMTIuNDA5ODQxMiwwIEwxMS42OTY2ODk2LDAuNjkxMTA5NjY5IEwxNC4zNTg0NTI0LDMuMjY1NzM2NTMgTDIuMDA4ODc3NTYsMy4yNjU3MzY1MyBDMS4zMTU4MTQ4LDMuMjY1NzM2NTMgMCwzLjc1MjQzMzQ4IDAsNS42OTkyMjEyOCBMMCw3LjE1OTMxMjEzIEwxLjAwNDQzODc4LDcuMTU5MzEyMTMgTDEuMDA0NDM4NzgsNS42OTkyMjEyOCBaIiBpZD0iU2hhcGUiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+';

var image$2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQ4AAABQCAYAAADoQpuWAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAABDqADAAQAAAABAAAAUAAAAADVgf6xAAAiZElEQVR4Ae2dB4BVNdbHz8AMSBG7KDYs2BEFVNRd14aIoCB2V111raurYHd3Xdvaxd4LoH6sYlld29poIlYUKxZU7AUVG0obyHd+eS93cu+7b94buDPMQA5kkpvkJrnn3fzvyclJUiHl0aqabXt1PdR1VLeGuuXVtVXXUl2lukCBA4EDjZ8DRptYrW62uunqpqn7Ut376p5X95S6r9XVShW1por00fRB6nYskS8kBw4EDiw6HBilj3KJuieKPVIx4ECSuFHdH4vdGOIDBwIHFnkODNcnPFodkkmM0oBjM80xQl2nWM5wETgQOLA4cmCyPvS+6ib6D58EDkDjOXVL+JlCOHAgcGCx5sBMffqt1UXg4QMHw5NX1QVJQ5kQKHAgcCDGASSPrurssKWZl4ROI4CGx5AQDBwIHIg4ADaAEZacxNFLrx7PxwUvcCBwIHCgGAf6asKjTuI4tViuEB84EDgQOOBxYCBhJI6V1H3FRaDAgcCBwIESHMCAbHUkjp4lMobkwIHAgcABxwGEje0ADqZZAgUOBA4EDpTLga0BjjCTUi67Qr7AgcABOLAui9M6BF5kz4GWLVtKly5dpGfPntKqVSt5/vnn5YknnpDqatYX1RD5Nt5445qIROj999+Xdu3ayUoroYoqTm+88YbMmTMnlmHppZeWtddeW7777jv55JNPZMMNN7RtiWXyLn777Td55513vJjCYOvWraV79+6yww472HJ5pg8++ECMYehbQ82aNZPNNsOeUGyZlO3TMsssI2uttZZ8++238umnn/pJIdz4ObAyTWQlHL96Zq5Z+yVNy34bmRY7djIVrVtkVm6WbazPsv7617+ad99918yePVv7U460U5vXXnvNHHHEETF+rLvuumbGjBkuW4Hfp08fM2TIkIJ4P+Knn34yq666aqxcnu+oo46y2e677z6bNnHiRP+2gvDLL79cUIbjU0VFhfnnP/9pPvroI6PgF907ffp088ILL5htttkmdm/btm2NgoLNN2zYsFgaZR5//PE2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";

var image$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANgAAABKCAYAAADZjpqlAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAA2KADAAQAAAABAAAASgAAAABHLEcaAAAZCElEQVR4Ae2dBdgcNROA0w93d3enuEsp7g4PVtzdnUJxd7cCxd1dirtLcXd3Z/9552eWbG537+7r3vVrm3meu7VkksxmImPbLRFwBfD777+7u+66yz3wwAPu9ddfd59//rn+vvrqK/fHH3+4v//+uyBnvB0pMGRQYJhhhnEjjjiiG3/88d0EE0ygv9lnn9317NnTLbbYYq6jo6O8oTBYCL/88kvSu3fvZLzxxoP54i/SIPaBnD4w9dRTJ6effnoiE03IQum1S8/+PXn88ceTqaaaKhI0h6BxsImDbV4fmGeeeZJ33303ZCW9zjDYTTfdlIw00kiRuSJzxT7QZB+QJWTy3HPP1TBZymBPPPFEZK4miZo3msV7Q+8sN/HEEycffvhhhsmUwX799deE9WTsHENv54jvvpp3v+SSS9YyWJ8+fSJzxdkr9oGK+sA111yTMhni9mTCCSeMxK2IuHEmqGYmGJzpuPDCC//HYLfddltkrshcsQ9U3Afee+89ZbIOlMgRIgUiBaqlQP/+/RVhx2uvvVYt5ogtUiBSwBlfdWD+FCFSIFKgWgp89tlnijAyWLV0jdgiBZQCKYN9+eWXkSSRApECFVPA+KoDi/kIkQKRAtVS4M8//1SEHV3d5WTUUUd1k046abWt97AtuOCCbpFFFkl/8803nxtjjDG8FF3jVOxE3RFHHNG2yuCmdOCBB7atvEYKmmaaadzDDz/sVllllUaSD9I0IqNPy++SOpA11lgjuf/++9UV4LjjjmtZHX/++edUKWgnf/31V3LiiSd2KdtMWdMnN9xwQ8voIL0hg/unn35K+vXrl7kXpmnl9c4775yE73222WbTV7T11lsPsno12uZZZplF61rHW0zQtRnGHXdcd/vtt7trr73W9ejRQx3afvzxx5bW4qmnnnIrrLCCW2mlldz222/vHnnkEbfLLrvoaDnssMO2tOyIPJ8CyyyzjFt33XUzD7t165a57soXwl1avS7FYHiMPvjgg2655ZbL0O7ZZ5/NXFd5wUv74osvlKlvvfVWd8YZZyhjn3XWWW6uueZShvPLY7l69NFHO7GAceeff75baKGF0sfdu3d3Z555ppt11lnTextvvLHeEzeg9N4hhxzidtppJ72eY4459Ln44Lk99tjD3XHHHe7iiy923K8HeNmKHamj3hdddJETQ9OaLNT3yCOPdLfccou7/PLL3aabburw0vUBurP8vPrqq93ee++tHrz+86Jz8GyyySZObO/c9ddf73bYYQc3wggjZJJDT1mNKE1lBtZ05CkDmbnczDPP7MYcc0x3wgknuA022KAm+aqrrupYNl9xxRVuxRVXrHk+2WSTaZtIc+qpp7o555yzJk0rbxiDUUaXmG6loyey7tdp1f/74YcfktFGG61ldcR7WzpfDX7K/PbbbxMJlZA+k5eUfP3118n333+f3H333cn777+f/PPPP8k222yjaSaaaCKt+n777ZfmEYWj3lt22WX13uijj56wBD300EP1evXVV9fn1AGnvUcffVSf//bbb4nsOVI8oq/MLBGnm2665OOPP05Y4t57773JW2+9VVM27hMsLWmHMGHyxhtvaJpjjjkmxYsf00cffaTteOaZZzQN5nN4WJQtEcVVPsF/EJAVQCKzvi7nH3vssczSGvqw1P/kk0+Shx56SOlHHhlg0jqEffDJJ59UGmMn+/TTTydmjC6u+mTVcsEn+7FEVjd6TxguxTf//PNrOaS56qqrknfeeScRYV5i7yAsrxXXM800k9ZLcHcNBltnnXW0QuEfe6FW1rGIwSiTl0sHtvLpgN99910yxRRT6D0ZrbXz8PJkptB7L774YmL2ndwD8BE69thj9bksffTeoosuqtfGYNddd10iy1G9t/7662uaAw44QK8pP9yD3XnnnQlMyFqf5zKbKAPivm735p13Xi1XZoMUD20Cl7UJZgN69eqV3jv55JP1XhmDbb755prGH0w22mgjvUe4CcMPg8kKIZlkkkn0HgwNDZ9//vk0jaX1jwwI0M2/ZwwmK5pEhF/6bMYZZ0xEYpcOkgzUtPHNN99MRFilaSSmRkKel19+OYPPx131eZdjMEajEJghGPGrbryPr4zBmE0Y3UlPBwHOO++8TH0QxgB0ONLBSHQgRnhZCumstM8++6QdSpaHCbOyMZMx2GqrrZbiHWeccRSnv8n3GWzkkUfW2UKWZWkeyl588cU1nyzzMvdl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";

var image = "data:image/png;base64, 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";

var icon$1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWAAAAIACAMAAACLo0a5AAACAVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9n7yP8AAAAqnRSTlMAAQIDBAUGBwgLDA0ODxESExQVFxgZGhscHR4fICEiIyQlJicoKS0wMTIzNTc4OTs8PT5AQUJDREVGR0hJS15fYGRlZmhpam1ub3BxcnN0d3l6fICGh4iJiouMlpeYmZqbnJ6foKGipKqtrq+wsbKztLW2t7i5uru8vb6/xcbHyMnM0dLT1NfY2drb3N3f4OHi4+Tl5ufo6err7O3u8PHy8/T19vf4+fr7/H3oGy4AAAABYktHRKq+Ble+AAALB0lEQVR42u3de2NUxRnH8WcbNggWJRVvLW2kSlsvaZR201I0xaqtIWAvFKiVBmktVglgaTXB2lWLqFDl0hSCija7ZIk+r7J/hEsSk+zZc2bOPJff9w3MzIeHyWU3Z4kQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCnonq3PHjwxcYmbH506NrKjv9vDmbv7d4y8fuqjJl+aOHHwd1t7oy204icvTPD8Lo8/uda2bs9Txy4vOPR//rS5K8JKd+yZ5MWaObTJLu8PDs8seugLu28PvNLX97d4yeqP2uR97K2lz9zad3fAlapDU7xsYxsNfrk5svyZmztvCrXUA+9zu1rbK7Z4K8+02h76vfvDLDXUfilmHltn6mvbK1nOPLPzKwGuhxc5W6fvs+O78UzGQx+oFl1q1VHO2if9VnwfvJj50OM3F1tqTZ2z16jZ8K01Ojh0fU1pvszNAQu+j0x1dOi3bynN14Zwh75FhDv2tSDcsW9+4Ry++oVz+OYVzuWrXTiXbz7hnL66hXP65hHO7atZOLdv58IFfPUKF/DtVLiQr1bhQr6dCRf01Slc0LcT4cK+GoUL+2YXDuCrTziAb1bhIL7ahIP4ZhMO5KtLOJBvFuFgvpqEg/m2Fw7oq0c4oG874aC+WoSD+i4vHNhXh3Bg3+WEg/tqEA7uu7RwBF/5whF8lxKO4itdOIrv4sKr4/gyNwW/1lxrRjp0ffXCpap/41jJneFI88vMPL5y/lKVFzleUmc42vwyMx+Y/2a9YY6ZzBmOOL/MzE/PXeuBFrsTjuzLrTnvvbzpfY6cvFsi6v0w++7WG9fwbzh60mY49vwyM//q2mJ3N9ibcBm+3PzG1dX2cxlJuiXi3w/MzDwyu9q6aS5HeMDV/DJz6w4iItrDJSVlhkuaX2beRUS04gKXJjzgaX6ZeXIFEW1hdiVcoi/zj4joBS5TuObnfmBm3k9EE8yOZrjU+WU+S7SB2ZFwyb7M62krly1c83I/MDMP0u+Z3cxw6fPLvJsOsRvhBL78Mp3gBMI1H/cDMx+n/zL7mOEU88t8jj5jH8JpfPlT+oLTCNcc3A/M/DldZnYww4nml7lJF9mBcDJfvkD/5mTCNev3AzOfpNeZrc9wuvllHqMRti6c0pefo+2cUrhm+n5g5m3Uz2x6hpPOL/ND1N00LZzYd6pKNM5s95ZIez8w/52InmQ2O8OJ55f5cSK69YpZ4eS+M2uJiEaZbd4Sqe8H5oNERLSJ2eQMJ59f5odnd/KGSWEBvm9e3cqjzPZuifT3A/Pma5s5wuZmWMD88uj13fROWxOW4NvacGM/29mWsARf3jZnQ5VDpoRF+B6d93dcPaclCNfsfH3jD3vmb+qeSTMzLGJ+P/7SA9f7GkZmWMT8Nh4S+g9ffIYFH8OEsOhDGBAWfgT1wuIPoFxYwfZVC6vYvGJhJVtXK6xm40qFFW1bpbCqTSsUVrZldcLYMAYCVxq+aODbHnxbiR+M8KOnox/t8csp/PoPv8COfAC8BBP3CHgRMe4h8DJ43GMY8RV7EDO+Qo9iyFfkYUz5CjyOMV9xBzLnK+xIBn1FHcqkr6BjGfUVczCzvkLeOt4UsYlIf1wtYnjMzi+E4/tCOLYvhM0/ZMi8r3fhMh6l51nYwaMKHfj6FS7vgbw+hX088NiHr0fhsh/r703YzccmuPH1JZzmw4H8CHv68CVPvl6EU37EoAdhZx/h6MzXvnD6Dyq2Lezug6Ad+loWluFrV1iKr1VhOb42hSX5WhSW5WtPWJqvNWF5vraEJfpaEpbpa0dYqq8VYbm+NoQl+1oQlu2rX1i6r3Zh+b66hTX4ahbW4atXWIuvVmE9vjqFNflqFNblq09Ym682YX2+uoQ1+moS1umrR1irrxZhvb46hDX7ahDW7StfWLuvdGH9vrKFLfhKFrbhK1fYiq9UYTu+MoUt+UoUtuUrT9iarzRhe76yhC36ShK26StH2KqvFGG7vgDGFQFfCOPbNPjiBzkI45c98MWvgyGMl4zgC2HCy/aeffHGHghr98WbKyGs3RdvcIewdl/8kRGEtfviDz0hrN0Xf2wPYe2+eOAJhLX74qFTENbuiwf/QRgPB4WvZmE8oBm+moXxkHz4ahbGB5XAV7MwPiwKvpqF8YF98NUsjA9Nha9mYXxwNXw1C1v3TS1s3zetsAfflMI+fNMJe/FNJezHN42wJ98Uwr58yxf25lu2sD/fcoU9+pYp7NO3PGGvvmUJ+/UtR9izbxnCvn3jC3v3jS0M37jC8I0rDN+4wrWmhMOJ2ETN7Pw2B4Rsw6yvoI0Y9TUqLOpQBoWFHcmcsLgDGRMWeBxTwiIPY0hY6FHMCIs9iBFhwccwISz6EAaEhR9BvbD4AygXVrB91cIqNq9YWMnW1Qqr2bhSYUXbVimsatMKhZVtWZ0wNoyBwJWGLxr4tgffVuIHI/zo6ehHe/xyCr/+wy+wIx8AL8HEPQJeRIx7CLwMHvcYfQ0JGwvw1nERb8Rv9C3c1oZJE/MrZoY/3jh/U187Y2R+xczw6Z65W6ocNjO/Ymb4aGXOjp4x5StEePjGfnqnbfnKEL7y7evbecWarwzhw9c285idr2+yvtJtubqXurn5FTLDb83u5IcmfUUIbyIiokP27gcpt8QoEVHPjMn5FTHDM2uJ6OdmfQUIP0FEx2zeDzJuiVeJuptm51fADDe76WHTvsmF+2iH3ftBwi0xTPtMz2/yGX6O/mHdN63wOH1g+n5IfkucoovW5zftDF+gyw58Ewo36Qvr90PaW+Jz+szB/Cac4U9pwodvKuFz9I6D+yHhLfEvGvUxv6lm+CV61o1vEuHd9FMf90OqW2KQet3Mb5IZXk901pFv6cJnieiPXu6HFLfE80S02dH8lj7DNSLqOu/Kt1Th811ERLv83A9l3xK/JSKi26Y9zW+ZM9y6fXa9fa7mt8QZ3nt1ubumXM1vaTM8dee15X7tzbcc4V9eX23le57uh7JuiXe7b6z2nWlf81vGDLe+N3e1IXe+0YV/MW+xygFX90MJt8SfK/MXqx51Nr+RZ3i8e+Fiq+vO5jfqDNdXfXmxr9adzW/EGX77lsUWiyIs2zeS8OK+UYSl+0YRXso3grB83wjCS/sGF9bgG1x4Od/Awjp8Awsv7xtUWItvUOF2vgGF9fgGFG7vG0xYk28w4Sy+gYR1+QYSzuYbRFibbxDhrL4BhPX5BhDO7ltYWKNvYeFOfAsK6/QtKNyZbyFhrb6FhDv1LSCs17eAcOe+uYU1++YWzuObU1i3b07hfL65hLX75hLO65tDWL9vDuH8vh0LW/DtWLiIL9GaToQbNTJRrZOHgdfXFFts1V8zL/VJPxnpwezPeBi7uehi1azv+fnwXjLTfaezvn+nGmC1wUyPlHjtNjJUz5FM7+8bqgRZ7f72726d3lYhU1WG27/h9N3vhlqtOvS/5Zc68i0yV+9f2nzLtHNlwNXuGmktvdQbm8lkW/65zH/ZP9wZeLV1uxf/e7oro4+Q2TaNLv5o2vO71kVYrevH+xf+XXPj1Z/dSqZb+8RrC78rPvP8QFe09b45uOfl4+cucWPy5NjebX0ryEHV7w/vHT852eBL546/tGdwPSGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQUtD/AU3DG9nVZ5KhAAAAAElFTkSuQmCC';

var icon = 'data:image/png;base64,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';

var cssStyles = "\n      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500;700&display=swap');\n      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');\n\n      .outer-container-mew-modal {\n        font-family: 'Roboto', sans-serif;\n        box-sizing: border-box;\n        bottom: 0;\n        color: #050f19;\n        display: flex;\n        flex-direction: column;\n        justify-content: space-between;\n        left: 0;\n        position: absolute;\n        right: 0;\n        text-align: center;\n        top: 0;\n        min-width: 450px;\n        max-width: 450px;\n        max-height: 558px;\n      }\n      \n      .container-mew-modal {\n        font-family: 'Roboto', sans-serif;\n        color: #050f19;\n        text-align: center;\n        box-sizing: border-box;\n        display: flex;\n        flex-direction: column;\n        flex-grow: 1;\n        flex-shrink: 0;\n        justify-content: center;\n        margin-left: auto;\n        margin-right: auto;\n        padding-bottom: 16px;\n        padding-top: 16px;\n        position: relative;\n        max-width: 450px;\n        max-height: 404px;\n        width: 100%;\n        top: 0;\n      }\n      \n      .upper-text {\n        position: relative;\n        left: 0;\n        bottom: 15px;\n      }\n      \n     .close-mew-modal{\n        position: absolute;\n        padding-top: 10px;\n        right: 10px !important;\n        top: 0;\n        width: 20px;\n        cursor: pointer;\n        z-index: 10;\n      }\n      \n      .mew-qr-code {\n        font-family: 'Roboto', sans-serif;\n        color: #050f19;\n        height: 210px;\n        width: 210px;\n        margin-left: auto;\n        margin-right: auto;\n        text-align: center;\n        box-sizing: border-box;\n        background-color: white;\n        border-radius: 8px;\n        display: inline-block;\n      }\n      .mew-text-one {\n        min-width: 380px;\n        height: 30px;\n        color: rgba(0, 0, 0);\n        font-size: 24px;\n        font-family: 'Roboto', sans-serif;\n        font-weight: 500;\n        text-align: center;\n        letter-spacing: 0.3px;\n        line-height: 30px;\n        box-sizing: border-box;\n        padding-bottom: 8px;\n      }\n      .mew-text-two {\n        font-family: 'Roboto', sans-serif;\n        font-size: 14px;\n        color: rgba(0, 0, 0, 0.55);\n        font-weight: normal;\n        height: 16px;\n        letter-spacing: 0.17px;\n        text-align: center;\n        min-width: 265px;\n        padding-top: 8px;\n      }\n      .mew-list-style {\n        width: 278px;\n        height: 48px;\n        color: rgba(0, 0, 0, 0.55);\n        font-size: 12px;\n        font-family: 'Roboto', sans-serif;\n        font-weight: normal;\n        letter-spacing: 0.15px;\n        line-height: 16px;\n        margin-left: 20px;\n        list-style-position: outside;\n        text-align: left;\n        position: relative;\n        left: 30px\n      }\n      .mew-list-style li {\n        margin-left: 0;\n        padding-left: 10px;\n      }\n      .mew-bottom-background {\n        position: absolute;\n        bottom: 0;\n        right: 64px;\n        border-radius: 0 0 16px 16px;\n        background: rgb(249, 250, 251);\n        text-align: center;\n        padding-top: 25px;\n        padding-bottom: 15px;\n        max-width: 450px;\n        margin-left: auto;\n        margin-right: auto;\n      }\n      .bottom-container-mew-modal {\n        position: relative;\n        font-family: 'Roboto', sans-serif;\n        color: #050f19;\n        text-align: center;\n        box-sizing: border-box;\n        margin-bottom: 16px;\n        display: flex;\n        flex-direction: row;\n        flex-flow: row wrap;\n        justify-content: center;\n        left: -15px;\n        \n      }\n\n      .bottom-container-mew-modal > .left {\n        margin-right: 15px;\n      }\n\n      .bottom-container-mew-modal > .center {\n        margin-right: 15px;\n      }\n\n      .bottom-container-mew-modal > .right {\n        align-items: flex-start;\n        text-align: left;\n      }\n\n      .bottom-container-mew-modal > .left-img {\n        padding-right: 10px;\n      }\n\n      .bottom-container-mew-modal-text {\n        font-family: 'Roboto', sans-serif;\n        color: #050f19;\n        box-sizing: border-box;\n        font-size: 13px;\n        margin: 0;\n        opacity: 0.5;\n        text-align: left;\n      }\n      .bottom-container-mew-modal-text-old {\n        font-family: 'Roboto', sans-serif;\n        color: #050f19;\n        box-sizing: border-box;\n        font-size: 13px;\n        margin: 0;\n        opacity: 0.5;\n        padding: 16px;\n        text-align: center;\n      }\n\n      .spaceman-background {\n        background-color: white;\n        border-radius: 10px;\n      }\n\n      p {\n        margin: 0;\n        padding-bottom: 5px;\n      }\n\n      .mew-bottom {\n        color: rgba(0, 0, 0, 0.55);\n        font-size: 12px;\n        font-family: 'Roboto', sans-serif;\n        font-weight: lighter;\n        letter-spacing: 0.15px;\n      }\n      \n      .bottom-link {\n      text-decoration: none;\n       color: rgba(5, 192, 165);\n       cursor: pointer;\n      }\n      \n      #refresh-container-mew-modal {\n      background: #33c7b0;\n      border-radius: 5px;\n      padding: 5px;\n      }\n      \n      #refresh-container-mew-modal:hover {\n      background: #238677;\n      }\n\n      .refreshIcon {\n        padding-top: 5px;\n        justify-content: center;\n        margin-left: auto;\n        margin-right: auto;\n        cursor: pointer;\n        color: #fffff;\n      }\n\n      .mew-hidden {\n        display: none;\n      }\n      \n      .mew-get-text {\n        width: 265px;\n        height: 16px;\n        color: rgb(0, 0, 0);\n        font-size: 14px;\n        font-family: 'Roboto', sans-serif;\n        font-weight: normal;\n        letter-spacing: 0.17px;\n      }\n      \n      .mew-camera-icon {\n          opacity: 0.54;\n          position: relative;\n          bottom: -2px;\n          height: 14px;\n          width: 14px;\n        }\n        \n        #mew-google-link:hover {\n        cursor: pointer;\n        }\n        \n        #mew-apple-link:hover {\n        cursor: pointer;\n        }\n        \n        .mew-warn-color {\n        color: orange;\n        }\n        \n        .loader-mew,\n        .loader-mew:after {\n          border-radius: 50%;\n          width: 10em;\n          height: 10em;\n        }\n        .loader-mew {\n          margin: 20px auto;\n          font-size: 10px;\n          position: relative;\n          text-indent: -9999em;\n          border-top: 1em solid rgba(166,183,183, 0.2);\n          border-right: 1em solid rgba(166,183,183, 0.2);\n          border-bottom: 1em solid rgba(166,183,183, 0.2);\n          border-left: 1em solid rgba(8, 165, 178, 1);\n          -webkit-transform: translateZ(0);\n          -ms-transform: translateZ(0);\n          transform: translateZ(0);\n          -webkit-animation: load8 1.1s infinite linear;\n          animation: load8 1.1s infinite linear;\n        }\n        @-webkit-keyframes load8 {\n          0% {\n            -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n          }\n          100% {\n            -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n          }\n        }\n        @keyframes load8 {\n          0% {\n            -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n          }\n          100% {\n            -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n          }\n        }\n    ";

var htmlDesign = function htmlDesign(refresh, image, playStore, appStore, camera, iconImage, iosLink, androidLink) {
  return "\n    <div class=\"outer-container-mew-modal\">\n      <div class=\"container-mew-modal\">\n              <div class=\"close-mew-modal\" id=\"close-mew-modal\" aria-label=\"close modal\" data-close>\n          <img src=\"".concat(iconImage, "\" height=\"17\" width=\"11\"/>\n        </div>\n      <div class=\"upper-text\">\n\n        <p class=\"mew-text-one\">Connect to MEW&nbsp;wallet app</p>\n        <p class=\"mew-text-two\">Scan this code to connect</p>\n       </div>\n        <div id=\"qr-failure\"></div>\n        <div id=\"qr-code-connecting-mew\" class=\"mew-hidden\"><div class=\"loader-mew\"></div><h4>Connecting...</h4> Creating encrypted peer-to-peer connection </div>\n        <div id=\"qr-code-display-container-mew\" class=\"mew-qr-code\">\n          <canvas id=\"canvas-for-mewconnect-qr-code\"></canvas>\n        </div>\n        <div id=\"refresh-container\" class=\"refreshIcon mew-hidden\">\n          Try Again <img id=\"refresh\" src=\"").concat(refresh, "\" />\n        </div>\n\n        <ol class=\"mew-list-style\">\n          <li>Open MEW wallet app on your mobile device</li>\n          <li class=\"with-image\">Click <img class=\"mew-camera-icon\" src=\"").concat(camera, "\"> icon in the top right corner</li>\n          <li>Scan this code to connect</li>\n        </ol>\n      </div>\n      <div class=\"mew-bottom-background\">\n        <div class=\"bottom-container-mew-modal\">\n          <div class=\"left\">\n            <img\n              class=\"spaceman-background\"\n              src=\"").concat(image, "\"\n              height=\"58\"\n              width=\"58\"\n            />\n          </div>\n          <div class=\"center\">\n            <div class=\"right\">\n              <p class=\"mew-get-text\">Don't have MEW&nbsp;wallet app?</p>\n              <p id=\"popupsBlocked\" class=\"mew-warn-color\"></p>\n                      <a href=\"").concat(iosLink, "\" target=\"_blank\" id=\"appStore\">               <img\n                  id=\"mew-apple-link\"\n                  class=\"left-img\"\n                  src=\"").concat(appStore, "\"\n                  height=\"40\"\n                  width=\"120\"\n                /></a>\n\n                      <a href=\"").concat(androidLink, "\" target=\"_blank\" id=\"playStore\">                <img\n                  id=\"mew-google-link\"\n                  src=\"").concat(playStore, "\"\n                  height=\"40\"\n                  width=\"135\"\n                /></a>\n\n\n\n            </div>\n          </div>\n\n        </div>\n        <div class=\"mew-bottom\">\n          Powered by <a href=\"https://myetherwallet.github.io/MEWconnect-Protocol-Documentation/\" target=\"_blank\" id=\"proto-link\" class=\"bottom-link\">MEWconnect protocol</a> <br />\n          brought to you by <a href=\"https://www.myetherwallet.com/\" target=\"_blank\" id=\"mew-link\" class=\"bottom-link\">MyEtherWallet</a>\n        </div>\n      </div>\n    </div>\n\n");
};

var noticetext = "\n\n      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500;700&display=swap');\n      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');\n\n\n      div#Notifications.mew-hidden {\n        visibility: hidden;\n      }\n      \n      div#Notifications.mew-hidden {\n        visibility: hidden;\n      }\n\n      div#qrcodeError.shown {\n        visibility: visible;\n      }\n      \n      div#qrcodeError.mew-hidden {\n        visibility: hidden;\n      }\n      div#retry-button-mew.mew-hidden {\n        display: none;\n      }\n\n      #Notifications,\n      #Notifications * {\n\n        animation: none;\n        animation-delay: 0;\n        animation-direction: normal;\n        animation-duration: 0;\n        animation-fill-mode: none;\n        animation-iteration-count: 1;\n        animation-name: none;\n        animation-play-state: running;\n        animation-timing-function: ease;\n        backface-visibility: visible;\n        background: 0;\n        background-attachment: scroll;\n        background-clip: border-box;\n        background-color: transparent;\n        background-image: none;\n        background-origin: padding-box;\n        background-position: 0 0;\n        background-position-x: 0;\n        background-position-y: 0;\n        background-repeat: repeat;\n        background-size: auto auto;\n        border-collapse: separate;\n        border-image: none;\n        border-spacing: 0;\n        border-radius: 0;\n        border: medium none inherit;\n        bottom: auto;\n        box-shadow: none;\n        box-sizing: border-box;\n        caption-side: top;\n        clear: none;\n        clip: auto;\n        color: inherit;\n        columns: auto;\n        column-count: auto;\n        column-fill: balance;\n        column-gap: normal;\n        column-rule: medium none currentColor;\n        column-rule-color: currentColor;\n        column-rule-style: none;\n        column-span: 1;\n        column-width: auto;\n        content: normal;\n        counter-increment: none;\n        counter-reset: none;\n        cursor: auto;\n        direction: ltr;\n        display: inline;\n        empty-cells: show;\n        float: none;\n        font-family: 'Roboto', sans-serif;\n        font-size: medium;\n        font-style: normal;\n        font-variant: normal;\n        font-weight: normal;\n        height: auto;\n        hyphens: none;\n        left: auto;\n        letter-spacing: normal;\n        line-height: normal;\n        list-style: disc outside none;\n        margin: 0;\n        max-height: none;\n        max-width: none;\n        min-height: 0;\n        min-width: 0;\n        opacity: 1;\n        orphans: 0;\n        outline: invert none medium;\n        overflow: visible;\n        overflow-x: visible;\n        overflow-y: visible;\n        padding: 0;\n        page-break-after: auto;\n        page-break-before: auto;\n        page-break-inside: auto;\n        perspective: none;\n        perspective-origin: 50% 50%;\n        pointer-events: auto;\n        position: static;\n        quotes: \"\\201C\" \"\\201D\" \"\\2018\" \"\\2019\";\n        right: auto;\n        tab-size: 8;\n        table-layout: auto;\n        text-align: inherit;\n        text-align-last: auto;\n        text-decoration: none;\n        text-decoration-color: inherit;\n        text-decoration-line: none;\n        text-decoration-style: solid;\n        text-indent: 0;\n        text-shadow: none;\n        text-transform: none;\n        top: auto;\n        transform: none;\n        transform-style: flat;\n        transition: none;\n        transition-delay: 0s;\n        transition-duration: 0s;\n        transition-property: none;\n        transition-timing-function: ease;\n        unicode-bidi: normal;\n        vertical-align: baseline;\n        white-space: normal;\n        widows: 0;\n        width: auto;\n        word-spacing: normal;\n        z-index: 9999999999;\n        all: initial;\n        all: unset;\n\n      }\n\n      #Notifications * {\n        font-family: 'Roboto', sans-serif;\n        font-weight: 500;\n        box-sizing: border-box;\n      }\n\n      #Notifications {\n        position: fixed;\n        top: 0;\n        right: 0;\n        text-align: right;\n        z-index: 2147483647;\n      }\n\n      #Notifications style {\n        display: none;\n      }\n\n      #Notifications .Notification {\n        display: block;\n        margin: 8px 16px 0 16px;\n      }\n\n      #Notifications .NotificationBox {\n        display: flex;\n        flex-direction: column;\n        background-color: #fff;\n        color: black;\n        margin: 0;\n        font-size: 14px;\n        box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.06),\n        0px 0px 8px rgba(0, 0, 0, 0.04);\n        border-radius: 16px;\n        transition: opacity 0.25s, transform 0.25s;\n        opacity: 0;\n        transform: translateX(25%);\n        text-align: left;\n        overflow: hidden;\n      }\n\n      #Notifications\n      .Notificationshow\n      .NotificationBox {\n        opacity: 1;\n        transform: translateX(0);\n      }\n\n      #Notifications .NotificationContent {\n        background-color: rgb(249, 250, 251);\n        display: flex;\n        flex-direction: row;\n        padding: 8px 8px 8px 16px;\n        align-items: center;\n        user-select: none;\n        cursor: pointer;\n      }\n\n      #Notifications .NotificationMessage {\n        display: block;\n        color: black;\n        line-height: 1.5;\n      }\n\n      #Notifications .NotificationChevron {\n        display: block;\n        margin-left: 8px;\n        transition: transform 0.05s;\n      }\n\n      #Notifications .NotificationProgressBar {\n        display: block;\n        height: 2px;\n        position: relative;\n      }\n\n      #Notifications .NotificationProgressBar::before {\n        display: block;\n        position: absolute;\n        content: \"\";\n        left: -100%;\n        width: 100%;\n        height: 100%;\n        background-image: linear-gradient(\n          to right,\n          rgba(22, 82, 240, 0) 0%,\n          rgba(51, 199, 176, 1) 100%\n        );\n        animation: MewNotificationProgressBar 2s linear infinite;\n      }\n\n      @keyframes MewNotificationProgressBar {\n        0% {\n          left: 0;\n          width: 0%;\n          background-image: linear-gradient(\n            to right,\n            rgba(22, 82, 240, 0) 0%,\n            rgba(51, 199, 176, 1) 100%\n          );\n        }\n        25% {\n          left: 0;\n          width: 100%;\n        }\n        50% {\n          left: 100%;\n          width: 0%;\n          background-image: linear-gradient(\n            to right,\n            rgba(22, 82, 240, 0) 0%,\n            rgba(51, 199, 176, 1) 100%\n          );\n        }\n        50.01% {\n          background-image: linear-gradient(\n            to left,\n            rgba(22, 82, 240, 0) 0%,\n            rgba(51, 199, 176, 1) 100%\n          );\n        }\n        75% {\n          left: 0;\n          width: 100%;\n        }\n        100% {\n          left: 0;\n          width: 0%;\n          background-image: linear-gradient(\n            to left,\n            rgba(22, 82, 240, 0) 0%,\n            rgba(51, 199, 176, 1) 100%\n          );\n        }\n      }\n\n      #Notifications\n      .NotificationExpand\n      .NotificationProgressBar {\n        margin-bottom: -1px;\n      }\n\n      #Notifications\n      .NotificationExpand\n      .NotificationChevron {\n        transform: rotateZ(180deg);\n      }\n\n      #Notifications .NotificationActions {\n        display: none;\n        flex-direction: column;\n        border-top: 1px solid #f5f7f8;\n        padding: 8px 16px;\n      }\n\n      #Notifications\n      .NotificationExpand\n      .NotificationActions {\n        display: flex;\n      }\n\n      #Notifications .NotificationAction {\n        color: #888;\n        margin: 8px 0;\n      }\n\n      #Notifications .NotificationButtonInfo {\n        margin: 0 8px 0 0;\n      }\n\n      #Notifications .NotificationButton {\n        color: #33c7b0;\n        -webkit-text-fill-color: #33c7b0;\n        cursor: pointer;\n        display: inline;\n        margin: 0;\n        padding: 0;\n        -webkit-appearance: none;\n        transition: opacity 0.25s;\n      }\n\n      #Notifications .NotificationButton:active {\n        opacity: 0.6;\n      }\n\n      #Notifications .NotificationContent .spaceman-background {\n        background-color: rgb(249, 250, 251);\n        border-radius: 10px;\n        height: 50px;\n        width: 50px;\n      }\n      ";

var windowInformer = function windowInformer(spaceman) {
  return "\n      <div class=\"Notification Notificationshow NotificationExpand\">\n        <div class=\"NotificationBox\">\n          <div class=\"NotificationContent\">\n            <img\n              class=\"spaceman-background\"\n              src=\"".concat(spaceman, "\"\n            />\n            <div class=\"NotificationMessage\">Requesting to connect using MEW wallet</div>\n          </div>\n          <div class=\"NotificationProgressBar\"></div>\n          <div class=\"NotificationActions\">\n            <div class=\"NotificationAction\"><span\n              class=\"NotificationButtonInfo NotificationButtonInfo1\">Don\u2019t see the popup?</span>\n              <button id=\"NotificationButton1\" class=\"NotificationButton NotificationButton1\">Show\n                                                                                              window\n              </button>\n            </div>\n            <div class=\"NotificationAction\"><span\n              class=\"NotificationButtonInfo NotificationButtonInfo2\">Made a mistake?</span>\n              <button id=\"NotificationButton2\" class=\"NotificationButton NotificationButton2\">Cancel\n              </button>\n            </div>\n            <div id=\"retry-button-mew\" class=\"NotificationAction mew-hidden\"><span\n              class=\"NotificationButtonInfo NotificationButtonInfo2\">Refresh QRcode and </span>\n              <button id=\"NotificationButton3\" class=\"NotificationButton NotificationButton2\">Try Again\n              </button>\n            </div>\n              <div id=\"qrcodeError\" class=\"NotificationError mew-hidden\"><span\n              class=\"NotificationButtonInfo NotificationButtonInfo2\">Failed to generate QR code. Please cancel and retry.</span>\n            </div>\n          </div>\n        </div>\n      </div>\n");
};

var modalFrame = function modalFrame(innerContent) {
  return "\n    <div class=\"mew-wallet-modal is-visible\" id=\"mew-wallet-modal\"></div>\n    <div class=\"mew-wallet-modal-container-mew-modal is-visible\" id=\"mew-wallet-modal-container\">\n      <div class=\"mew-wallet-modal-dialog is-visible\" id=\"mew-mobile-modal-dialog\">\n        <section class=\"mew-wallet-modal-content\">\n        ".concat(innerContent, "\n        </section>\n      </div>\n    </div>\n");
};

var modalCSS = function modalCSS() {
  var additionalCss = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return "\n".concat(additionalCss, "\n\n      #mew-mobile-modal-dialog section.mew-wallet-modal-content{\n        position: fixed;\n        min-width: 448px;\n        max-width: 448px;\n        min-height: 558px;\n        max-height: 558px;\n        width: 100%;\n        height: 100%;\n        border-radius: 16px;\n      }\n            \n      .mew-wallet-modal {\n        position: fixed;\n        top: 0;\n        left: 0;\n        right: 0;\n        bottom: 0;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        padding: 1rem;\n        background: black;\n        cursor: default;\n        visibility: hidden;\n        opacity: 0;\n        transition: all 0.35s ease-in;\n      }\n\n      .mew-wallet-modal.is-visible {\n        visibility: visible;\n        opacity: 0.25;\n        z-index: 999999;\n      }\n\n      div.mew-wallet-modal-dialog {\n        position: fixed;\n        background: rgb(255, 255, 255);\n        border-radius: 16px;\n        box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05),\n        0px 3px 6px 0px rgba(0, 0, 0, 0.05),\n        0px 8px 16px 0px rgba(0, 0, 0, 0.05);\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        position: relative;\n        min-width: 448px;\n        max-width: 448px;\n        min-height: 558px;\n        max-height: 558px;\n        overflow: auto;\n        opacity: 0;\n        visibility: hidden;\n        z-index: 999999;\n      }\n\n      .mew-wallet-modal-container-mew-modal {\n        position: fixed;\n        top: 0;\n        left: 0;\n        right: 0;\n        bottom: 0;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        padding: 1rem;\n        background-color: transparent;\n        cursor: default;\n        visibility: hidden;\n        opacity: 0;\n        transition: all 0.35s ease-in;\n        z-index: 999999;\n      }\n\n      div.mew-wallet-modal-container-mew-modal.is-visible {\n        visibility: visible;\n        opacity: 1;\n        background-color: transparent;\n      }\n\n      div.mew-wallet-modal-dialog.is-visible {\n        visibility: visible;\n        opacity: 1;\n        z-index: 99999999999999;\n      }\n\n      .mew-wallet-modal-dialog > * {\n       /* padding: 1rem; */\n      }\n\n      .modal-header {\n        display: flex;\n        align-items: center;\n        justify-content: space-between;\n      }\n\n      .modal-header .close-modal {\n        font-size: 1.5rem;\n      }\n\n");
};

var IOS_LINK = 'https://apps.apple.com/app/apple-store/id1464614025?pt=118781877&ct=mc&mt=8';
var ANDROID_LINK = 'https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet&referrer=utm_source%3Dmc';
var DISCONNECTED = 'disconnected';
var CONNECTING = 'connecting';
var CONNECTED = 'connected';

var PopUpCreator = /*#__PURE__*/function (_EventEmitter) {
  _inherits(PopUpCreator, _EventEmitter);

  var _super = _createSuper(PopUpCreator);

  function PopUpCreator() {
    var _this;

    _classCallCheck(this, PopUpCreator);

    _this = _super.call(this);
    _this.sessionId = '';
    _this.sessionId = false;
    _this.logo = image$4;
    _this.spaceman = image$3;
    _this.refreshIcon = refreshIcon;
    _this.playStoreButton = image$2;
    _this.appStoreButton = image$1;
    _this.camera = image;
    _this.closeIconBlack = icon;
    _this.popupWindowOpen = null;

    _this.windowClosedListener = function () {};

    if (!document.getElementById('Attach-Mew-Wallet-Modal')) {
      _this.container = window.document.createElement('div');
      _this.container.id = 'Attach-Mew-Wallet-Modal';
      window.document.body.appendChild(_this.container);
    } else {
      _this.container = document.getElementById('Attach-Mew-Wallet-Modal');
    }

    window.addEventListener('beforeunload', function () {
      _this.closePopupWindow();
    });
    return _this;
  }

  _createClass(PopUpCreator, [{
    key: "openPopupWindow",
    value: function openPopupWindow(text) {
      this.showPopupWindow(text);
    }
  }, {
    key: "setWindowClosedListener",
    value: function setWindowClosedListener(func) {
      this.windowClosedListener = func;
    }
  }, {
    key: "removeWindowClosedListener",
    value: function removeWindowClosedListener() {
      this.windowClosedListener = function () {};
    }
  }, {
    key: "hideNotifier",
    value: function hideNotifier() {
      var notify = document.getElementById('Notifications');
      notify.className = 'hidden';
    }
  }, {
    key: "createWindowInformer",
    value: function createWindowInformer() {
      var css = document.createElement('style');
      css.type = 'text/css';
      if ('textContent' in css) css.textContent = noticetext;else css.innerText = noticetext;
      this.container.appendChild(css);
      var div = window.document.createElement('div');
      div.id = 'Notifications';
      div.className = 'hidden';
      div.innerHTML = windowInformer(image$3);
      this.container.appendChild(div);
    }
  }, {
    key: "showWindowInformer",
    value: function showWindowInformer() {
      var _this2 = this;

      var notify = document.getElementById('Notifications');
      notify.className = 'shown';
      var showButton = document.getElementById('NotificationButton1');
      showButton.addEventListener('click', function () {
        _this2.showDialog();
      });
      var cancelButton = document.getElementById('NotificationButton2');
      cancelButton.addEventListener('click', function () {
        _this2.cancelConnectionSetup();
      });
    }
  }, {
    key: "cancelConnectionSetup",
    value: function cancelConnectionSetup() {
      try {
        this.popupWindowOpen = null;
        this.hideNotifier();
        this.closePopupWindow();
        this.windowClosedListener();
      } catch (e) {
        console.error(e);
      }
    }
  }, {
    key: "showQrError",
    value: function showQrError() {
      var notify = document.getElementById('qr-failure');
      document.querySelector('#qrcodeError').classList.remove('is-visible');
      notify.className = 'hidden';
    }
  }, {
    key: "showConnecting",
    value: function showConnecting() {
      // todo: add existance checks because these are destroyed on a good connection
      document.querySelector('#qr-code-display-container-mew').classList.add('hidden');
      document.querySelector('#qr-code-connecting-mew').classList.remove('hidden');
    }
  }, {
    key: "hideConnecting",
    value: function hideConnecting() {
      document.querySelector('#qr-code-display-container-mew').classList.remove('hidden');
      document.querySelector('#qr-code-connecting-mew').classList.add('hidden');
    }
  }, {
    key: "showRetry",
    value: function showRetry(callback) {
      var retry = document.getElementById('retry-button-mew');
      var retryOnModal = document.getElementById('refresh-container');
      if (document.querySelector('#refresh-container')) document.querySelector('#refresh-container').classList.remove('hidden');
      if (document.querySelector('#retry-button-mew')) document.querySelector('#retry-button-mew').classList.remove('hidden');

      var eventHandler = function eventHandler() {
        if (document.querySelector('#qr-code-display-container-mew')) document.querySelector('#qr-code-display-container-mew').classList.remove('hidden');
        if (document.querySelector('#qr-code-connecting-mew')) document.querySelector('#qr-code-connecting-mew').classList.add('hidden');
        if (document.querySelector('#retry-button-mew')) document.querySelector('#retry-button-mew').classList.add('hidden');
        if (document.querySelector('#refresh-container')) document.querySelector('#refresh-container').classList.add('hidden');
        if (retry) retry.removeEventListener('click', eventHandler, {
          passive: false,
          once: true
        });
        if (retryOnModal) retryOnModal.removeEventListener('click', eventHandler, {
          passive: false,
          once: true
        });
        callback();
      };

      if (retry) retry.addEventListener('click', eventHandler, {
        passive: false,
        once: true
      });
      if (retryOnModal) retryOnModal.addEventListener('click', eventHandler, {
        passive: false,
        once: true
      });
    }
  }, {
    key: "createQrCodeModal",
    value: function createQrCodeModal() {
      var modalId = 'Mew-Wallet-Modal';

      if (document.getElementById(modalId)) {
        return;
      }

      var css = document.createElement('style');
      css.type = 'text/css';
      if ('textContent' in css) css.textContent = modalCSS(cssStyles);else css.innerText = modalCSS(cssStyles);
      this.container.appendChild(css);
      var div = window.document.createElement('div');
      div.id = modalId; // div.className = 'hidden';

      div.innerHTML = modalFrame(htmlDesign(this.refreshIcon, this.spaceman, this.playStoreButton, this.appStoreButton, this.camera, this.closeIconBlack, IOS_LINK, ANDROID_LINK)); // div.innerHTML = windowInformer(spaceman);

      this.container.appendChild(div);
    }
  }, {
    key: "hideDialog",
    value: function hideDialog() {
      if (document.querySelector('.mew-wallet-modal') && document.querySelector('.mew-wallet-modal-container-mew-modal')) {
        document.querySelector('.mew-wallet-modal').classList.remove('is-visible');
        document.querySelector('.mew-wallet-modal-container-mew-modal').classList.remove('is-visible');
        document.querySelector('.mew-wallet-modal-dialog').classList.remove('is-visible');
      }
    }
  }, {
    key: "showDialog",
    value: function showDialog() {
      if (typeof this.popupWindowOpen !== 'boolean') return;
      this.popupWindowOpen = true;

      if (document.querySelector('.mew-wallet-modal') && document.querySelector('.mew-wallet-modal-container-mew-modal')) {
        document.querySelector('.mew-wallet-modal').classList.add('is-visible');
        document.querySelector('.mew-wallet-modal-container-mew-modal').classList.add('is-visible');
        document.querySelector('.mew-wallet-modal-dialog').classList.add('is-visible');
      }
    }
  }, {
    key: "showPopupWindow",
    value: function showPopupWindow(qrcode) {
      var _this3 = this;

      try {
        if (typeof this.popupWindowOpen === 'boolean') {
          this.showDialog();
          return this.container;
        }

        if (!qrcode) {
          var QRfailedMessage = document.getElementById('qr-failure');
          QRfailedMessage.innerText = 'Error: Please start connection again.'; // todo Instead of not showing. present a notice and ask the user to retry.
          // this.emit('fatalError');
          // window.alert('Failed to create MEW wallet QRcode. Please retry.');
          // throw Error('No connection string supplied to popup window');
        }

        this.createQrCodeModal();
        this.createWindowInformer();
        var element = document.getElementById('canvas-for-mewconnect-qr-code');
        QrCode__default['default'].toCanvas(element, qrcode, {
          errorCorrectionLevel: 'H',
          width: 200
        });
        var background = document.getElementById('mew-wallet-modal');
        var background2 = document.getElementById('mew-wallet-modal-container');
        var dialog = document.getElementById('mew-mobile-modal-dialog');
        document.getElementById('close-mew-modal').addEventListener('click', function () {
          _this3.cancelConnectionSetup();
        });
        background.addEventListener('click', function () {
          _this3.hideDialog();
        });
        background2.addEventListener('click', function (evt) {
          _this3.hideDialog(evt);
        });
        dialog.addEventListener('click', function (evt) {
          if (_this3.popupWindowOpen) {
            evt.stopPropagation();
          }
        }, false);
        this.showWindowInformer();
        this.popupWindow = this.container;
        this.popupWindowOpen = true;

        if (qrcode === '') {
          this.showQrError();
        }

        if (!qrcode) {
          var _QRfailedMessage = document.getElementById('qr-failure');

          _QRfailedMessage.innerText = 'Error: Please start connection again.'; // todo Instead of not showing. present a notice and ask the user to retry.

          this.emit('fatalError');
          window.alert('Failed to create MEW wallet QRcode. Please retry.');
          throw Error('No connection string supplied to popup window');
        }

        return this.container;
      } catch (e) {
        // todo Instead of not showing. present a notice and ask the user to retry.
        throw Error(e);
      }
    }
  }, {
    key: "updateQrCode",
    value: function updateQrCode(qrcode) {
      var element = document.getElementById('canvas-for-mewconnect-qr-code');
      QrCode__default['default'].toCanvas(element, qrcode, {
        errorCorrectionLevel: 'H',
        width: 200
      });
    }
  }, {
    key: "closePopupWindow",
    value: function closePopupWindow() {
      try {
        this.popupWindowOpen = null;
        document.querySelector('#Attach-Mew-Wallet-Modal').dispatchEvent(new Event('mewModalClosed'));
        document.querySelector('#Attach-Mew-Wallet-Modal').replaceChildren();
      } catch (e) {
        this.popupWindowOpen = null;
        document.querySelector('#Attach-Mew-Wallet-Modal').innerHTML = '';
      }
    }
  }, {
    key: "handleBeforeUnload",
    value: function handleBeforeUnload() {}
  }, {
    key: "resetSetup",
    value: function resetSetup() {
      this.popupWindowOpen = null;
      this.hideNotifier();
      this.closePopupWindow();
    }
  }, {
    key: "window",
    get: function get() {
      return this.popupWindow;
    }
  }]);

  return PopUpCreator;
}(EventEmitter__default['default']);

var getBufferFromHex = function getBufferFromHex(hex) {
  hex = sanitizeHex$1(hex);

  var _hex = hex.toLowerCase().replace('0x', '');

  return new Buffer(_hex, 'hex');
};

var padLeftEven$1 = function padLeftEven(hex) {
  hex = hex.length % 2 != 0 ? '0' + hex : hex;
  return hex;
};

var sanitizeHex$1 = function sanitizeHex(hex) {
  hex = hex.substring(0, 2) == '0x' ? hex.substring(2) : hex;
  if (hex == '') return '';
  return '0x' + padLeftEven$1(hex);
};

var bufferToHex = function bufferToHex(buffer) {
  return '0x' + buffer.toString('hex');
};

var getSignTransactionObject = function getSignTransactionObject(tx) {
  return {
    rawTransaction: bufferToHex(tx.serialize()),
    tx: {
      nonce: bufferToHex(tx.nonce),
      gasPrice: bufferToHex(tx.gasPrice),
      gas: tx.gasLimit ? bufferToHex(tx.gasLimit) : bufferToHex(tx.gas),
      to: bufferToHex(tx.to),
      value: bufferToHex(tx.value),
      input: bufferToHex(tx.data),
      v: bufferToHex(tx.v),
      r: bufferToHex(tx.r),
      s: bufferToHex(tx.s),
      hash: bufferToHex(tx.hash())
    }
  };
};

var calculateChainIdFromV = function calculateChainIdFromV(v) {
  var sigV = ethUtils.bufferToInt(v);
  var chainId = Math.floor((sigV - 35) / 2);
  if (chainId < 0) chainId = 0;
  return chainId;
};

var isAddress = function isAddress(address) {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    return false;
  } else if (/^(0x|0X)?[0-9a-f]{40}$/.test(address) || /^(0x|0X)?[0-9A-F]{40}$/.test(address)) {
    return true;
  }

  return web3__default['default'].utils.checkAddressChecksum(address);
};

var toChecksumAddress = function toChecksumAddress(address) {
  return web3__default['default'].utils.toChecksumAddress(address);
};

var toBuffer$1 = function toBuffer(v) {
  if (ethUtils.isHexString(v)) {
    return ethUtils.toBuffer(v);
  }

  return Buffer.from(v);
};

var WalletInterface = /*#__PURE__*/function () {
  function WalletInterface(key) {
    var isPub = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var identifier = arguments.length > 2 ? arguments[2] : undefined;
    var nick = arguments.length > 3 ? arguments[3] : undefined;
    var keystore = arguments.length > 4 ? arguments[4] : undefined;

    _classCallCheck(this, WalletInterface);

    this.nickname = nick !== null && nick !== '' ? nick : '';
    this.keystore = keystore !== null && keystore !== '' ? keystore : '';
    this.identifier = identifier;

    if (!isPub) {
      var _privKey = Buffer.isBuffer(key) ? key : getBufferFromHex(sanitizeHex$1(key));

      if (!ethUtils.isValidPrivate(_privKey)) throw new Error('Private key does not satisfy the curve requirements (ie. it is invalid)');
      this.privateKey = _privKey;
      this.publicKey = ethUtils.privateToPublic(_privKey);
      this.isPubOnly = false;
    } else {
      var _pubKey = Buffer.isBuffer(key) ? key : getBufferFromHex(key);

      if (_pubKey.length !== 20 && !ethUtils.isValidPublic(_pubKey, true)) throw new Error('Invalid public key');
      if (_pubKey.length === 20) this.isAddress = true;
      this.publicKey = _pubKey;
      this.isPubOnly = true;
    }
  }

  _createClass(WalletInterface, [{
    key: "getPrivateKey",
    value: function getPrivateKey() {
      if (this.isPubOnly) throw new Error('public key only wallet');
      return this.privateKey;
    }
  }, {
    key: "getPrivateKeyString",
    value: function getPrivateKeyString() {
      if (this.isPubOnly) throw new Error('public key only wallet');
      return ethUtils.bufferToHex(this.getPrivateKey());
    }
  }, {
    key: "getNickname",
    value: function getNickname() {
      if (this.nickname === '') return '';
      return this.nickname;
    }
  }, {
    key: "getKeystore",
    value: function getKeystore() {
      if (this.keystore === '') return '';
      return this.keystore;
    }
  }, {
    key: "getPublicKey",
    value: function getPublicKey() {
      if (this.isAddress) throw new Error('Address only wallet');
      return this.publicKey;
    }
  }, {
    key: "getPublicKeyString",
    value: function getPublicKeyString() {
      return ethUtils.bufferToHex(this.getPublicKey());
    }
  }, {
    key: "getAddress",
    value: function getAddress() {
      if (this.isAddress) return this.publicKey;
      return ethUtils.publicToAddress(this.publicKey, true);
    }
  }, {
    key: "getAddressString",
    value: function getAddressString() {
      return ethUtils.bufferToHex(this.getAddress());
    }
  }, {
    key: "getChecksumAddressString",
    value: function getChecksumAddressString() {
      return toChecksumAddress(this.getAddressString());
    }
  }, {
    key: "signTransaction",
    value: function signTransaction(txParams, signer) {
      if (this.isPubOnly && typeof signer !== 'function') throw new Error('public key only wallets needs a signer');
      return new Promise(function (resolve, reject) {
        signer(txParams).then(resolve)["catch"](reject); // }
      });
    }
  }, {
    key: "signMessage",
    value: function signMessage(msg, signer) {
      var _this = this;

      if (this.isPubOnly && typeof signer !== 'function') throw new Error('public key only wallets needs a signer');
      return new Promise(function (resolve, reject) {
        if (!_this.isPubOnly) {
          var msgHash = ethUtils.hashPersonalMessage(toBuffer$1(msg));
          var signed = ethUtils.ecsign(msgHash, _this.privateKey);
          resolve(Buffer.concat([Buffer.from(signed.r), Buffer.from(signed.s), Buffer.from([signed.v])]));
        } else {
          signer(msg).then(resolve)["catch"](reject);
        }
      });
    }
  }]);

  return WalletInterface;
}();

/* eslint-disable */
var errorHandler = (function (popUpHandler) {
  return function (err) {
    if (err.reject) {
      popUpHandler.showNotice('decline');
    } else {
      popUpHandler.showNotice('error');
      console.error(err);
    }
  };
});

var commonGenerator = function commonGenerator(network) {
  var customCommon = Common__default['default'].forCustomChain('mainnet', {
    name: network.name_long,
    chainId: network.chainID
  });
  return new Common__default['default'](customCommon._chainParams, 'petersburg', ['petersburg']);
};

var uint = 'uint';
var address = 'address';
var string = 'string';
var bytes = 'bytes';
var bool = 'bool';

var toBuffer = function toBuffer(v) {
  if (ethUtils.isHexString(v)) {
    return ethUtils.toBuffer(v);
  }

  return Buffer.from(v);
};

var capitalize = function capitalize(value) {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
};
/* Accepts string, returns boolean */


var isJson = function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
};

var getService = function getService(parsableUrl) {
  var parsedUrl = url__default['default'].parse(parsableUrl).hostname;
  var splitUrl = parsedUrl.split('.');
  if (splitUrl.length > 2) // eslint-disable-next-line
    return capitalize("".concat(splitUrl[1], ".").concat(splitUrl[2]));
  return capitalize(splitUrl.join('.'));
};

var doesExist = function doesExist(val) {
  return val !== undefined && val !== null;
};

var padLeftEven = function padLeftEven(hex) {
  hex = hex.length % 2 !== 0 ? '0' + hex : hex;
  return hex;
};

var isInt = function isInt(num) {
  return num % 1 === 0;
};

var formatDate = function formatDate(date) {
  var days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
  var day = days[new Date(date).getDay()];
  var dateString = new Date(date).toLocaleDateString();
  var regExp = /\(([^)]+)\)/;
  var timeString = new Date(date).toTimeString();
  var lengthMinus1 = timeString.length - 1;
  var stripTimezone = timeString.slice(timeString.indexOf('(') + 1, lengthMinus1).split(' ').map(function (item) {
    return item[0];
  }).join('');
  var removedTimezone = timeString.replace(regExp, '');
  var removeEndNumber = removedTimezone.slice(0, 12);
  var GMTtime = removeEndNumber.replace(removeEndNumber.slice(5, 8), '');
  var localTime = new Date(date).toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit'
  });
  return "".concat(day, ". ").concat(dateString, " ").concat(GMTtime, " - ").concat(localTime, " ").concat(stripTimezone);
};

var isValidETHAddress = function isValidETHAddress(address) {
  return isAddress(address);
};

var isValidENSorEtherAddress = function isValidENSorEtherAddress(address) {
  return isValidETHAddress(address);
};

var sanitizeHex = function sanitizeHex(hex) {
  hex = hex.substring(0, 2) == '0x' ? hex.substring(2) : hex;
  if (hex == '') return '0x';
  return '0x' + padLeftEven(hex);
};

var scrollToTop = function scrollToTop(scrollDuration) {
  var scrollHeight = window.scrollY,
      scrollStep = Math.PI / (scrollDuration / 15),
      cosParameter = scrollHeight / 2;
  var scrollCount = 0;
  var scrollMargin;
  var scrollInterval = setInterval(function () {
    if (window.scrollY != 0) {
      scrollCount = scrollCount + 1;
      scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
      window.scrollTo(0, scrollHeight - scrollMargin);
    } else clearInterval(scrollInterval);
  }, 15);
};

var validateHexString = function validateHexString(str) {
  if (str === '') return true;
  str = str.substring(0, 2) === '0x' ? str.substring(2).toUpperCase() : str.toUpperCase();
  return utils__default['default'].isHex(str);
};

var solidityType = function solidityType(inputType) {
  if (!inputType) inputType = '';

  if (inputType.includes('[') && inputType.includes(']')) {
    if (inputType.includes(uint)) return {
      type: 'string',
      solidityType: "".concat(uint, "[]")
    };
    if (inputType.includes(address)) return {
      type: 'text',
      solidityType: "".concat(address, "[]")
    };
    if (inputType.includes(string)) return {
      type: 'text',
      solidityType: "".concat(string, "[]")
    };
    if (inputType.includes(bytes)) return {
      type: 'text',
      solidityType: "".concat(bytes, "[]")
    };
    if (inputType.includes(bool)) return {
      type: 'string',
      solidityType: "".concat(bool, "[]")
    };
    return {
      type: 'text',
      solidityType: "".concat(string, "[]")
    };
  }

  if (inputType.includes(uint)) return {
    type: 'number',
    solidityType: uint
  };
  if (inputType.includes(address)) return {
    type: 'text',
    solidityType: address
  };
  if (inputType.includes(string)) return {
    type: 'text',
    solidityType: string
  };
  if (inputType.includes(bytes)) return {
    type: 'text',
    solidityType: bytes
  };
  if (inputType.includes(bool)) return {
    type: 'radio',
    solidityType: bool
  };
  return {
    type: 'text',
    solidityType: string
  };
};

var stringToArray = function stringToArray(str) {
  return str.replace(/[^a-zA-Z0-9_,]+/g, '').split(',');
};

var isContractArgValid = function isContractArgValid(value, solidityType) {
  if (!value) value = '';

  if (solidityType.includes('[') && solidityType.includes(']')) {
    var parsedValue = Array.isArray(value) ? value : stringToArray(value);
    var values = [];
    parsedValue.forEach(function (item) {
      if (solidityType.includes(uint)) {
        values.push(item !== '' && !isNaN(item) && isInt(item));
      } else if (solidityType.includes(address)) {
        values.push(isAddress(item));
      } else if (solidityType.includes(string)) {
        values.push(item !== '');
      } else if (solidityType.includes(bool)) {
        values.push(_typeof(item) === _typeof(true) || item === '');
      } else if (solidityType.includes(bytes)) {
        values.push(validateHexString(item));
      }
    });
    return !values.includes(false);
  }

  if (solidityType === 'uint') return value !== '' && !isNaN(value) && isInt(value);
  if (solidityType === 'address') return isAddress(value);
  if (solidityType === 'string') return true;
  if (solidityType === 'bytes') return value.substr(0, 2) === '0x' && validateHexString(value);
  if (solidityType === 'bool') return _typeof(value) === _typeof(true) || value === '';
  return false;
};

var misc = {
  isJson: isJson,
  doesExist: doesExist,
  padLeftEven: padLeftEven,
  formatDate: formatDate,
  isValidENSorEtherAddress: isValidENSorEtherAddress,
  isValidETHAddress: isValidETHAddress,
  sanitizeHex: sanitizeHex,
  validateHexString: validateHexString,
  scrollToTop: scrollToTop,
  solidityType: solidityType,
  isInt: isInt,
  capitalize: capitalize,
  getService: getService,
  stringToArray: stringToArray,
  isContractArgValid: isContractArgValid,
  toBuffer: toBuffer
};

var debug$a = debugLogger__default['default']('MEWconnect:wallet'); // const debugConnectionState = debugLogger('MEWconnect:connection-state');

var V1_SIGNAL_URL = 'https://connect.mewapi.io';
var V2_SIGNAL_URL = 'wss://connect2.mewapi.io/staging';
var IS_HARDWARE = true;

var MEWconnectWalletInterface = /*#__PURE__*/function (_WalletInterface) {
  _inherits(MEWconnectWalletInterface, _WalletInterface);

  var _super = _createSuper(MEWconnectWalletInterface);

  function MEWconnectWalletInterface(pubkey, isHardware, identifier, txSigner, msgSigner, mewConnect, popUpHandler) {
    var _this;

    _classCallCheck(this, MEWconnectWalletInterface);

    _this = _super.call(this, pubkey, true, identifier);
    _this.errorHandler = errorHandler(popUpHandler);
    _this.txSigner = txSigner;
    _this.msgSigner = msgSigner;
    _this.isHardware = isHardware;
    _this.mewConnect = mewConnect();
    return _this;
  }

  _createClass(MEWconnectWalletInterface, [{
    key: "getConnection",
    value: function getConnection() {
      return this.mewConnect;
    }
  }, {
    key: "signTransaction",
    value: function signTransaction(txParams) {
      return _get(_getPrototypeOf(MEWconnectWalletInterface.prototype), "signTransaction", this).call(this, txParams, this.txSigner);
    }
  }, {
    key: "signMessage",
    value: function signMessage(msg) {
      return _get(_getPrototypeOf(MEWconnectWalletInterface.prototype), "signMessage", this).call(this, msg, this.msgSigner);
    }
  }]);

  return MEWconnectWalletInterface;
}(WalletInterface);

var MEWconnectWallet = /*#__PURE__*/function () {
  function MEWconnectWallet(state, popupCreator, popUpHandler) {
    _classCallCheck(this, MEWconnectWallet);

    this.identifier = 'mew_connect';
    this.isHardware = IS_HARDWARE;
    this.mewConnect = new MEWconnect.Initiator({
      v1Url: V1_SIGNAL_URL,
      v2Url: V2_SIGNAL_URL,
      showPopup: true,
      popupCreator: popupCreator
    });
    this.state = state || {};
    this.popUpHandler = popUpHandler;
    this.txIds = [];
  }

  _createClass(MEWconnectWallet, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _this2 = this;

        var qrcodeListener,
            txSigner,
            msgSigner,
            mewConnect,
            address,
            _args3 = arguments;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                qrcodeListener = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : function () {};
                this.mewConnect.on('codeDisplay', qrcodeListener);

                txSigner = /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(tx) {
                    var tokenInfo, networkId;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            if (tx.data.slice(0, 10) === '0xa9059cbb' || tx.data.slice(0, 10) === '0x095ea7b3') {
                              tokenInfo = _this2.state.network.tokens.find(function (entry) {
                                return entry.address.toLowerCase() === tx.to.toLowerCase();
                              });

                              if (tokenInfo) {
                                tx.currency = {
                                  symbol: tokenInfo.symbol,
                                  decimals: tokenInfo.decimals,
                                  address: tokenInfo.address
                                };
                              }
                            }

                            networkId = tx.chainId;
                            return _context.abrupt("return", new Promise(function (resolve, reject) {
                              if (!tx.gasLimit) {
                                tx.gasLimit = tx.gas;
                              }

                              _this2.mewConnect.sendRtcMessage('signTx', JSON.stringify(tx));

                              _this2.mewConnect.once('signTx', function (result) {
                                _this2.mewConnect.removeAllListeners('reject');

                                tx = new ethereumjsTx.Transaction(sanitizeHex$1(result), {
                                  common: commonGenerator(_this2.state.network)
                                });
                                var signedChainId = calculateChainIdFromV(tx.v);
                                if (signedChainId !== networkId) throw new Error('Invalid networkId signature returned. Expected: ' + networkId + ', Got: ' + signedChainId, 'InvalidNetworkId');
                                resolve(getSignTransactionObject(tx));
                              });

                              _this2.mewConnect.once('reject', function () {
                                debug$a('signTx rejected');

                                _this2.mewConnect.removeAllListeners('signTx');

                                reject({
                                  reject: true
                                });
                              });
                            }));

                          case 3:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function txSigner(_x) {
                    return _ref.apply(this, arguments);
                  };
                }();

                msgSigner = /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(msg) {
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            return _context2.abrupt("return", new Promise(function (resolve, reject) {
                              var msgHash = ethUtils.hashPersonalMessage(misc.toBuffer(msg));

                              _this2.mewConnect.sendRtcMessage('signMessage', {
                                hash: msgHash.toString('hex'),
                                text: msg
                              });

                              _this2.mewConnect.once('signMessage', function (data) {
                                _this2.mewConnect.removeAllListeners('reject');

                                resolve(getBufferFromHex(sanitizeHex$1(data.sig)));
                              });

                              _this2.mewConnect.once('reject', function () {
                                debug$a('signMessage rejected');

                                _this2.mewConnect.removeAllListeners('signMessage');

                                reject({
                                  reject: true
                                });
                              });
                            }));

                          case 1:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function msgSigner(_x2) {
                    return _ref2.apply(this, arguments);
                  };
                }();

                mewConnect = function mewConnect() {
                  return _this2.mewConnect;
                };

                _context3.next = 7;
                return signalerConnect(V1_SIGNAL_URL, this.mewConnect);

              case 7:
                address = _context3.sent;
                return _context3.abrupt("return", new MEWconnectWalletInterface(sanitizeHex$1(address), this.isHardware, this.identifier, txSigner, msgSigner, mewConnect, this.popUpHandler));

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }], [{
    key: "setConnectionState",
    value: function setConnectionState(connectionState) {
      if (!connectionState) MEWconnect.Initiator.setConnectionState('disconnected');else MEWconnect.Initiator.setConnectionState(connectionState);
      debug$a('setConnectionState', MEWconnect.Initiator.connectionState);
    }
  }, {
    key: "getConnectionState",
    value: function getConnectionState() {
      debug$a('getConnectionState', MEWconnect.Initiator.connectionState);
      if (!MEWconnect.Initiator.connectionState) return 'disconnected';
      return MEWconnect.Initiator.connectionState;
    }
  }, {
    key: "getPopupWindowRef",
    value: function getPopupWindowRef() {
      if (!MEWconnect.Initiator.connectionState) return 'disconnected';
      return MEWconnect.Initiator.connectionState;
    }
  }]);

  return MEWconnectWallet;
}();

var createWallet = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(state, popupCreator, popUpHandler) {
    var _MEWconnectWallet, _tWallet;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _MEWconnectWallet = new MEWconnectWallet(state, popupCreator, popUpHandler);
            createWallet.connectionState = _MEWconnectWallet.connectionState;
            _context4.next = 4;
            return _MEWconnectWallet.init();

          case 4:
            _tWallet = _context4.sent;
            return _context4.abrupt("return", _tWallet);

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function createWallet(_x3, _x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

createWallet.errorHandler = errorHandler;

var signalerConnect = function signalerConnect(url, mewConnect) {
  return new Promise(function (resolve) {
    mewConnect.initiatorStart(url);
    mewConnect.on('RtcConnectedEvent', function () {
      mewConnect.sendRtcMessage('address', '');
      mewConnect.once('address', function (data) {
        resolve(data.address);
      });
    });
    mewConnect.on('RtcDisconnectEvent', function () {
      MEWconnectWallet.setConnectionState('disconnected');
    });
  });
};

createWallet.getConnectionState = MEWconnectWallet.getConnectionState;
createWallet.setConnectionState = MEWconnectWallet.setConnectionState;

var notifierCSS = function notifierCSS(elementId) {
  return "\n    /* The snackbar - position it at the bottom and in the middle of the screen */\n      #".concat(elementId, "-img {\n        position: relative;\n        top: 10px;\n        left: 5px;\n        width: 23.2px;\n        height: 23.2px;\n      }\n\n      .hidden {\n        visibility: hidden;\n      }\n\n      .shown {\n        visibility: visible;\n      }\n\n      #").concat(elementId, " {\n        visibility: hidden; /* Hidden by default. Visible on click */\n        min-width: 250px; /* Set a default minimum width */\n        min-height: 110px;\n        /*margin-left: -125px; !* Divide value of min-width by 2 *!*/\n        background-color: white;\n        color: #000000; /* White text color */\n        text-align: center; /* Centered text */\n        border-radius: 15px; /* Rounded borders */\n        border: rgba(0, 0, 0, 0.1) solid 1px;\n        /*margin: 15px; !* Padding *!*/\n        position: fixed; /* Sit on top of the screen */\n        z-index: 999999999999999; /* Add a z-index if needed */\n        right: 30px; /* Center the snackbar */\n        top: 30px; /* 30px from the bottom */\n        box-shadow: 0px 16px 12px rgba(0, 0, 0, 0.1);\n      }\n\n      #").concat(elementId, "-label-text {\n        width: 78px;\n        height: 16px;\n        color: rgb(95, 99, 104);\n        font-size: 14px;\n        font-family: 'Roboto', sans-serif;\n        font-weight: 500;\n        letter-spacing: 0.37px;\n        line-height: 14px;\n        padding-top: 15px;\n        padding-left: 12px;\n      }\n      \n       #").concat(elementId, "-text{\n        width:200px;\n        text-align: left;\n        padding: 10px 20px;\n        font-family: 'Roboto', sans-serif;\n        font-size: 16px;\n        font-weight: normal;\n        height: 38px;\n        letter-spacing: 0.43px;\n      }\n      \n      .mew-connect-notifier-created-tx-link{\n        font-family: 'Roboto', sans-serif;\n        font-size: 14px;\n        font-weight: normal;\n        height: 38px;\n        color: rgb(95, 99, 104);\n      }\n\n      #").concat(elementId, "-close {\n        position: absolute;\n        top: 10px;\n        right: 10px;\n        color: rgb(95, 99, 104);;\n        cursor: pointer;\n      }\n\n      #").concat(elementId, "-label-container {\n        position: relative;\n        font-family: 'Roboto', sans-serif;\n        color: rgb(95, 99, 104);;\n        background: rgb(249, 250, 251);\n        /*background: orange;*/\n        border-top-left-radius: 15px;\n        border-top-right-radius: 15px;\n        text-align: left;\n        box-sizing: border-box;\n        /*margin-bottom: 16px;*/\n        display: flex;\n        flex-direction: row;\n        flex-flow: row wrap;\n        justify-content: left;\n        padding-bottom: 10px;\n      }\n\n      /* Show the snackbar when clicking on a button (class added with JavaScript) */\n      #").concat(elementId, ".show {\n        visibility: visible; /* Show the snackbar */\n        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.\n        However, delay the fade out process for 2.5 seconds */\n        -webkit-animation: fadein-").concat(elementId, " 0.5s,\n          fadeout-").concat(elementId, " 0.5s 3.5s;\n        animation: fadein-").concat(elementId, " 0.5s,\n          fadeout-").concat(elementId, " 0.5s 3.5s;\n      }\n\n      #").concat(elementId, ".show-persistent {\n        visibility: visible; /* Show the snackbar */\n        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.\n        However, delay the fade out process for 2.5 seconds */\n        -webkit-animation: fadein-").concat(elementId, " 0.5s,\n          fadeout-").concat(elementId, " 0.5s 5.5s;\n        animation: fadein-").concat(elementId, " 0.5s,\n          fadeout-").concat(elementId, " 0.5s 5.5s;\n      }\n\n      #").concat(elementId, ".show-persistent-leave {\n        visibility: visible; /* Show the snackbar */\n        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.\n        However, delay the fade out process for 2.5 seconds */\n        -webkit-animation: fadeout-").concat(elementId, " 0.5s 1.5s;\n        animation: fadeout-").concat(elementId, " 0.5s 1.5s;\n      }\n\n      #").concat(elementId, ".show-in {\n        visibility: visible; /* Show the snackbar */\n        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.\n        However, delay the fade out process for 2.5 seconds */\n        -webkit-animation: fadein-").concat(elementId, " 0.5s;\n        animation: fadein-").concat(elementId, " 0.5s;\n      }\n\n      #").concat(elementId, ".show-out {\n        visibility: visible; /* Show the snackbar */\n        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.\n        However, delay the fade out process for 2.5 seconds */\n        -webkit-animation: fadeout-").concat(elementId, " 0.5s;\n        animation: fadeout-").concat(elementId, " 0.5s;\n      }\n\n      /* Animations to fade the snackbar in and out */\n      @-webkit-keyframes fadein-").concat(elementId, " {\n        from {\n          top: 0;\n          opacity: 0;\n        }\n        to {\n          top: 30px;\n          opacity: 1;\n        }\n      }\n\n      @keyframes fadein-").concat(elementId, " {\n        from {\n          top: 0;\n          opacity: 0;\n        }\n        to {\n          top: 30px;\n          opacity: 1;\n        }\n      }\n\n      @-webkit-keyframes fadeout-").concat(elementId, " {\n        from {\n          top: 30px;\n          opacity: 1;\n        }\n        to {\n          top: 0;\n          opacity: 0;\n        }\n      }\n\n      @keyframes fadeout-").concat(elementId, " {\n        from {\n          top: 30px;\n          opacity: 1;\n        }\n        to {\n          top: 0;\n          opacity: 0;\n        }\n      }\n\n      @keyframes WalletLinkNotificationProgressBar {\n        0% {\n          left: 0;\n          width: 0%;\n          background-image: linear-gradient(\n            to right,\n            rgba(22, 82, 240, 0) 0%,\n            rgba(22, 82, 240, 1) 100%\n          );\n        }\n        25% {\n          left: 0;\n          width: 100%;\n        }\n        50% {\n          left: 100%;\n          width: 0%;\n          background-image: linear-gradient(\n            to right,\n            rgba(22, 82, 240, 0) 0%,\n            rgba(22, 82, 240, 1) 100%\n          );\n        }\n        50.01% {\n          background-image: linear-gradient(\n            to left,\n            rgba(22, 82, 240, 0) 0%,\n            rgba(22, 82, 240, 1) 100%\n          );\n        }\n        75% {\n          left: 0;\n          width: 100%;\n        }\n        100% {\n          left: 0;\n          width: 0%;\n          background-image: linear-gradient(\n            to left,\n            rgba(22, 82, 240, 0) 0%,\n            rgba(22, 82, 240, 1) 100%\n          );\n        }\n      }\n    ");
};

var connectedNotifierCSS = function connectedNotifierCSS(elementId) {
  return "      \n  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500;700&display=swap');\n      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');\n\n      /*  ---------------------------------------*/\n      #".concat(elementId, "-img {\n        width: 43.5px;\n        height: 43.5px;\n        background-color: white;\n        border-radius: 10px;\n        grid-column-start: 1;\n        grid-column-end: 1;\n        margin-top: 16px;\n        justify-self: center;\n      }\n\n      .hidden {\n        visibility: hidden;\n      }\n\n      .shown {\n        visibility: visible;\n      }\n\n      .").concat(elementId, "-big{\n        color: white;\n        font-size: 14px;\n        font-family: 'Roboto', sans-serif;\n        font-weight: 700;\n        letter-spacing: 0.37px;\n        line-height: 14px;\n        padding-bottom: 4px;\n      }\n\n      .").concat(elementId, "-label-text{\n        color: white;\n        font-size: 12px;\n        font-family: 'Roboto', sans-serif;\n        font-weight: 500;\n        letter-spacing: 0.37px;\n        line-height: 12px;\n        padding-bottom: 4px;\n      }\n\n      .").concat(elementId, "-vertical-flex{\n        padding-top: 15px;\n        align-content: start;\n        display: flex;\n        flex-flow: column wrap;\n        justify-content: flex-start\n      }\n\n      #").concat(elementId, " {\n        display: grid;\n        grid-template-columns:  30% auto;\n        background: rgb(5, 192, 165);\n        border-radius: 10px;\n        border: 1px solid rgba(0, 0, 0, 0.05);\n        box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.05),\n          0px 4px 8px 0px rgba(0, 0, 0, 0.09);\n        visibility: hidden; /* Hidden by default. Visible on click */\n        min-width: 240px; /* Set a default minimum width */\n        min-height: 77px;\n        color: #000000; /* White text color */\n        text-align: center; /* Centered text */\n        position: fixed; /* Sit on top of the screen */\n       /* z-index: 9999999999999;  Add a z-index if needed */\n        right: 30px; /* Center the snackbar */\n        top: 30px; /* 30px from the bottom */\n      }\n\n      #").concat(elementId, "-close {\n        position: absolute;\n        top: 10px;\n        right: 10px;\n        color: white;\n        cursor: pointer;\n      }\n\n      #").concat(elementId, "-label-container {\n        position: relative;\n        grid-column-start: 2;\n        grid-column-end: 2;\n        font-family: 'Roboto', sans-serif;\n        color: #050f19;\n        text-align: left;\n        box-sizing: border-box;\n        /*margin-bottom: 16px;*/\n        display: flex;\n        flex-direction: row;\n        flex-flow: row wrap;\n        justify-content: left;\n        padding-bottom: 10px;\n      }\n\n      /* Show the snackbar when clicking on a button (class added with JavaScript) */\n      #").concat(elementId, ".show {\n        visibility: visible; /* Show the snackbar */\n        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.\n        However, delay the fade out process for 2.5 seconds */\n        -webkit-animation: fadein-").concat(elementId, " 0.5s,\n          fadeout-").concat(elementId, " 0.5s 3.5s;\n        animation: fadein-").concat(elementId, " 0.5s,\n          fadeout-").concat(elementId, " 0.5s 3.5s;\n      }\n\n      #").concat(elementId, ".show-persistent {\n        visibility: visible; /* Show the snackbar */\n        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.\n        However, delay the fade out process for 2.5 seconds */\n        -webkit-animation: fadein-").concat(elementId, " 0.5s,\n          fadeout-").concat(elementId, " 0.5s 5.5s;\n        animation: fadein-").concat(elementId, " 0.5s,\n          fadeout-").concat(elementId, " 0.5s 5.5s;\n      }\n\n      #").concat(elementId, ".show-persistent-leave {\n        visibility: visible; /* Show the snackbar */\n        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.\n        However, delay the fade out process for 2.5 seconds */\n        -webkit-animation: fadeout-").concat(elementId, " 0.5s 1.5s;\n        animation: fadeout-").concat(elementId, " 0.5s 1.5s;\n      }\n\n      #").concat(elementId, ".show-in {\n        visibility: visible; /* Show the snackbar */\n        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.\n        However, delay the fade out process for 2.5 seconds */\n        -webkit-animation: fadein-").concat(elementId, " 0.5s;\n        animation: fadein-").concat(elementId, " 0.5s;\n      }\n\n      #").concat(elementId, ".show-out {\n        visibility: visible; /* Show the snackbar */\n        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.\n        However, delay the fade out process for 2.5 seconds */\n        -webkit-animation: fadeout-").concat(elementId, " 0.5s;\n        animation: fadeout-").concat(elementId, " 0.5s;\n      }\n\n      /* Animations to fade the snackbar in and out */\n      @-webkit-keyframes fadein-").concat(elementId, " {\n        from {\n          top: 0;\n          opacity: 0;\n        }\n        to {\n          top: 30px;\n          opacity: 1;\n        }\n      }\n\n      @keyframes fadein-").concat(elementId, " {\n        from {\n          top: 0;\n          opacity: 0;\n        }\n        to {\n          top: 30px;\n          opacity: 1;\n        }\n      }\n\n      @-webkit-keyframes fadeout-").concat(elementId, " {\n        from {\n          top: 30px;\n          opacity: 1;\n        }\n        to {\n          top: 0;\n          opacity: 0;\n        }\n      }\n\n      @keyframes fadeout-").concat(elementId, " {\n        from {\n          top: 30px;\n          opacity: 1;\n        }\n        to {\n          top: 0;\n          opacity: 0;\n        }\n      }\n\n");
};

var noticeHtml = function noticeHtml(elementId, imageSrc, iconImage) {
  return "\n  <div id=\"".concat(elementId, "-label-container\">\n    <div id=\"").concat(elementId + '-close', "\">\n      <img src=\"").concat(iconImage, "\" height=\"15\" width=\"11\" />\n    </div>\n    <img id=\"").concat(elementId + '-img', "\" src=\"").concat(imageSrc, "\"/>\n    <span id=\"").concat(elementId + '-label-text', "\">MEW&nbsp;wallet</span>\n  </div>\n  \n  <div id=\"").concat(elementId + '-text', "\">\n  \n  </div>\n  ");
};

var connectedNoticeHtml = function connectedNoticeHtml(elementId, imageSrc, iconImage) {
  return "\n  <img id=\"".concat(elementId, "-img\" src=\"").concat(imageSrc, "\" />\n  <div id=\"").concat(elementId, "-label-container\">\n    <div id=\"").concat(elementId, "-close\">\n      <img src=\"").concat(iconImage, "\" height=\"15\" width=\"11\"/>\n    </div>\n    \n    <div class=\"").concat(elementId, "-vertical-flex\">\n      <span class=\"").concat(elementId, "-label-text\">Connected to</span>\n      <span class=\"").concat(elementId, "-big\">MEW&nbsp;wallet</span>\n      <span class=\"").concat(elementId, "-label-text\">Powered by MyEtherWallet</span>\n    </div>\n  </div>\n  ");
};

var messages = {
  decline: 'User declined action in MEW wallet app',
  approveTx: 'Check your phone to approve transaction ',
  disconnect: 'Disconnected from MEW wallet',
  complete: 'Transaction completed',
  sent: 'Transaction sent',
  failed: 'Transaction failed',
  signMessage: 'Check your phone to sign the message',
  declineSignMessage: 'User declined message signing',
  notConnected: 'Phone not connected.  Please connect your phone and try again',
  defaultMessage: 'Check your phone to continue',
  error: 'An error occurred while preparing the last action',
  communicationError: 'Could not complete last response from MEW wallet. Nothing was sent. Please try to send or sign again.',
  disconnectError: ''
};
var messageConstants = {
  decline: 'decline',
  approveTx: 'approveTx',
  disconnect: 'disconnect',
  complete: 'complete',
  sent: 'sent',
  failed: 'failed',
  signMessage: 'signMessage',
  error: 'error',
  notConnected: 'notConnected',
  declineMessage: 'declineSignMessage',
  communicationError: 'communicationError',
  disconnectError: 'disconnectError'
};

function getMessage(text, extra) {
  if (extra) {
    switch (extra.type) {
      case 'sent':
        return "".concat(messages[extra.type], " <br/><a class=\"mew-connect-notifier-created-tx-link\" href=\"").concat(extra.explorerPath.replace('[[txHash]]', extra.hash), "\" target=\"_blank\">View details</a>");

      case 'failed':
        return "".concat(messages[extra.type], " <br/><a class=\"mew-connect-notifier-created-tx-link\" href=\"").concat(extra.explorerPath.replace('[[txHash]]', extra.hash), "\" target=\"_blank\">View details</a>");

      case 'nonStandardMessage':
        return extra.message;
    }
  }

  var regEx = new RegExp(/^Returned error:/);

  if (regEx.test(text)) {
    return text;
  }

  if (!text) {
    return messages.defaultMessage;
  }

  return messages[text];
}

var PopUpHandler = /*#__PURE__*/function () {
  function PopUpHandler() {
    _classCallCheck(this, PopUpHandler);

    this.index = 0;
    this.checkCount = 0;
    this.elementId = 'mew-connect-notice-corner';
    this.connectedElementId = this.elementId + '-connected';
    this.initialcheckIfIdExists();
    this.createNotice();
    this.timeoutTracker = null;
    this.lastActiveElement = '';
    this.connectNoticeVisible = false;
  }

  _createClass(PopUpHandler, [{
    key: "initialcheckIfIdExists",
    value: function initialcheckIfIdExists() {
      var element = window.document.getElementById(this.elementId);

      if (element) {
        this.checkCount++;
        this.elementId = this.elementId + "-".concat(this.checkCount);
        this.connectedElementId = this.elementId + '-connected';
        this.initialcheckIfIdExists();
      }
    }
  }, {
    key: "showNotice",
    value: function showNotice(text) {
      var overrides = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var timeoutTime = 3800;
      var timeoutOverride = false;

      if (_typeof(text) === 'object') {
        text = getMessage(null, text);
      } else {
        text = getMessage(text);
      }

      if (!text) {
        text = 'Check your phone to continue';
      }

      if (typeof overrides === 'number') {
        timeoutTime = overrides;
        timeoutOverride = true;
      }

      var element = window.document.getElementById(this.elementId);
      this.lastActiveElement = element;

      if (!timeoutOverride) {
        element.className = 'show';
        var elementText = window.document.getElementById("".concat(this.elementId, "-text"));
        elementText.innerHTML = text;
        setTimeout(function () {
          element.className = element.className.replace('show', '');
        }, timeoutTime);
      } else {
        element.className = 'show-in';

        var _elementText = window.document.getElementById("".concat(this.elementId, "-text"));

        _elementText.innerHTML = text;
        setTimeout(function () {
          element.className = element.className.replace('show-in', 'show-out');
        }, timeoutTime - 500);
        this.timeoutTracker = setTimeout(function () {
          element.className = element.className.replace('show-out', '');
        }, timeoutTime);
      }
    }
  }, {
    key: "showConnectedNotice",
    value: function showConnectedNotice(text, overrides) {
      var timeoutTime = 3800;
      var timeoutOverride = false;

      if (typeof overrides === 'number') {
        timeoutTime = overrides;
        timeoutOverride = true;
      }

      var element = window.document.getElementById(this.connectedElementId);
      this.lastActiveElement = element;

      if (!timeoutOverride) {
        element.className = 'show';
        setTimeout(function () {
          element.className = element.className.replace('show', '');
          this.connectNoticeVisible = true;
        }, timeoutTime);
      } else {
        element.className = 'show-in';
        setTimeout(function () {
          element.className = element.className.replace('show-in', 'show-out');
          this.connectNoticeVisible = true;
        }, timeoutTime - 500);
        this.timeoutTracker = setTimeout(function () {
          element.className = element.className.replace('show-out', '');
          this.connectNoticeVisible = false;
          this.lastActiveElement = null;
        }, timeoutTime);
      }
    }
  }, {
    key: "showNoticePersistentEnter",
    value: function showNoticePersistentEnter(text) {
      if (_typeof(text) === 'object') {
        text = getMessage(null, text);
      } else {
        text = getMessage(text);
      }

      var element = window.document.getElementById(this.elementId);
      element.className = 'show-persistent';
      var elementText = window.document.getElementById("".concat(this.elementId, "-text"));
      elementText.innerHTML = text;
      this.timeoutTracker = setTimeout(function () {
        element.className = element.className.replace('show-persistent', '');
      }, 10800);
    }
  }, {
    key: "showNoticePersistentExit",
    value: function showNoticePersistentExit() {
      if (this.timeoutTracker) {
        clearTimeout(this.timeoutTracker);
        var element = window.document.getElementById(this.elementId);
        element.className = element.className.replace('show-persistent', 'show-persistent-leave');
        this.timeoutTracker = setTimeout(function () {
          element.className = element.className.replace('show-persistent-leave', '');
        }, 1800);
      }
    }
  }, {
    key: "noShow",
    value: function noShow() {
      if (this.timeoutTracker) {
        clearTimeout(this.timeoutTracker);
      }

      var element = window.document.getElementById(this.elementId);
      element.className = '';
    }
  }, {
    key: "createNotice",
    value: function createNotice() {
      var _this = this;

      this.index++;
      var div = window.document.createElement('div');
      div.id = this.elementId;
      div.innerHTML = noticeHtml(this.elementId, image$3, icon);
      window.document.body.appendChild(div);
      var css = document.createElement('style');
      css.type = 'text/css';
      if ('textContent' in css) css.textContent = notifierCSS(this.elementId);else css.innerText = notifierCSS(this.elementId);
      document.body.appendChild(css);
      var closeEl = document.getElementById(this.elementId + '-close');
      closeEl.addEventListener('click', function () {
        var el = document.getElementById(_this.elementId);

        if (_this.timeoutTracker) {
          clearTimeout(_this.timeoutTracker);
        }

        el.className = el.className.replace('show', '');
      }); // create connected notice

      var divConn = window.document.createElement('div');
      divConn.id = this.connectedElementId;
      divConn.innerHTML = connectedNoticeHtml(this.connectedElementId, image$3, icon$1);
      window.document.body.appendChild(divConn);
      var cssConn = document.createElement('style');
      cssConn.type = 'text/css';
      if ('textContent' in cssConn) cssConn.textContent = connectedNotifierCSS(this.connectedElementId);else cssConn.innerText = connectedNotifierCSS(this.connectedElementId);
      document.body.appendChild(cssConn);
      var closeElConn = document.getElementById(this.connectedElementId + '-close');
      closeElConn.addEventListener('click', function () {
        var el = document.getElementById(_this.connectedElementId);

        if (_this.timeoutTracker) {
          clearTimeout(_this.timeoutTracker);
        }

        el.className = el.className.replace('show', '');
      });
    }
  }, {
    key: "hideNotifier",
    value: function hideNotifier() {
      var notify = document.getElementById('Notifications');

      if (notify) {
        notify.className = 'hidden';
      }
    }
  }]);

  return PopUpHandler;
}();

var debug$9 = debugLogger__default['default']('MEWconnect:webRTC-communication');
var debugPeer = debugLogger__default['default']('MEWconnectVerbose:peer-instances');
var debugStages$1 = debugLogger__default['default']('MEWconnect:peer-stages');

var WebRtcCommunication = /*#__PURE__*/function (_MewConnectCommon) {
  _inherits(WebRtcCommunication, _MewConnectCommon);

  var _super = _createSuper(WebRtcCommunication);

  function WebRtcCommunication(mewCrypto) {
    var _this;

    _classCallCheck(this, WebRtcCommunication);

    _this = _super.call(this);
    _this.Peer = SimplePeer__default['default'];
    _this.mewCrypto = mewCrypto;
    _this.peersCreated = {};
    _this.allPeerIds = [];
    _this.iceState = '';
    _this.answerReceived = {};
    _this.answersReceived = [];
    _this.offersSent = -1;
    _this.turnTimer = null;
    _this.turnWaitTime = 2000;
    _this.enableTimer = true;
    _this.tryingTurn = false;
    _this.connected = false;
    _this.refreshEnabled = false;
    _this.sentMessageIds = [];
    _this.signals = _this.jsonDetails.signals;
    _this.rtcEvents = _this.jsonDetails.rtc;
    _this.version = _this.jsonDetails.version;
    _this.versions = _this.jsonDetails.versions;
    _this.lifeCycle = _this.jsonDetails.lifeCycle;
    _this.iceStates = _this.jsonDetails.iceConnectionState;
    _this.activeInitiatorId = null;
    _this.usingVersion = '';
    _this.p = null;
    _this.canSignal = false;
    _this.outstandingMobileMessage = false;
    _this.channelTest = false;
    _this.channelTestTimer = null;
    return _this;
  }

  _createClass(WebRtcCommunication, [{
    key: "closeDataChannelForDemo",
    value: function closeDataChannelForDemo() {
      if (this.isAlive()) {
        this.p._channel.close();
      }
    }
  }, {
    key: "clearExtraOnConnection",
    value: function clearExtraOnConnection() {
      this.peersCreated = {};
      this.allPeerIds = [];
      this.answerReceived = {};
      this.answersReceived = [];
    }
  }, {
    key: "isAlive",
    value: function isAlive() {
      if (this.p !== null) {
        if (this.p._connected && !this.p.destroyed) {
          return true;
        }

        return;
      }

      return false;
    }
  }, {
    key: "setConnectionVersion",
    value: function setConnectionVersion(version) {
      this.usingVersion = version;
    }
  }, {
    key: "setActiveInitiatorId",
    value: function setActiveInitiatorId(id) {
      this.activeInitiatorId = id;
    } // can be used to listen to specific events, especially those that pass data

  }, {
    key: "uiCommunicator",
    value: function uiCommunicator(event, data) {
      debug$9(event, data);
      this.emit(event, data);
      this.emitStatus(event);
    } // special status emitter to allow simple listening of various statuses in one listener

  }, {
    key: "emitStatus",
    value: function emitStatus(event) {
      this.emit('status', event);
    } // Check if a WebRTC connection exists before a window/tab is closed or refreshed
    // Destroy the connection if one exists

  }, {
    key: "destroyOnUnload",
    value: function destroyOnUnload() {
      var _this2 = this;

      if (browserOrNode.isBrowser) {
        // eslint-disable-next-line no-undef
        window.onunload = window.onbeforeunload = function () {
          var iceStates = [_this2.iceStates["new"], _this2.iceStates.connecting, _this2.iceStates.connected];

          if (!_this2.Peer.destroyed || iceStates.includes(_this2.iceState)) {
            _this2.rtcDestroy();
          }
        };
      }
    }
  }, {
    key: "setActivePeerId",
    value: function setActivePeerId() {
      this.activePeerId = uuid__default['default']();
      this.allPeerIds.push(this.activePeerId);
    }
  }, {
    key: "getActivePeerId",
    value: function getActivePeerId() {
      var split = this.activePeerId.split('-');
      return split.join('-');
    }
  }, {
    key: "fallbackTimer",
    value: function fallbackTimer(clear) {
      var _this3 = this;

      if (this.connected && this.turnTimer !== null) {
        clearTimeout(this.turnTimer);
        this.turnTimer = null;
      } else if (this.connected) {
        return;
      }

      if (this.usingVersion === 'V2') {
        if (clear) {
          clearTimeout(this.turnTimer);
        } else if (this.enableTimer) {
          clearTimeout(this.turnTimer);
          this.turnTimer = setTimeout(function () {
            _this3.willAttemptTurn();
          }, this.turnWaitTime);
        }
      }
    }
  }, {
    key: "start",
    value: function start(simpleOptions) {
      this.canSignal = !this.canSignal;
      this.fallbackTimer();
      this.setActivePeerId();

      if (this.p !== null) {
        this.p.destroy();
      }

      this.p = new this.Peer(simpleOptions);
      var peerID = this.getActivePeerId();
      this.answerReceived[peerID] = false;
      this.p.peerInstanceId = peerID;
      this.peersCreated[peerID] = this.p;
      this.p.on(this.rtcEvents.error, this.onError.bind(this, peerID));
      this.p.on(this.rtcEvents.connect, this.onConnect.bind(this, peerID));
      this.p.on(this.rtcEvents.close, this.onClose.bind(this, peerID));
      this.p.on(this.rtcEvents.data, this.onData.bind(this, peerID));
      this.p.on(this.rtcEvents.signal, this.signalListener.bind(this));
      debug$9("active PEER_ID: ".concat(this.p.peerInstanceId));

      this.p._pc.addEventListener('iceconnectionstatechange', this.stateChangeListener.bind(this, peerID));

      this.p._pc.addEventListener('icecandidateerror', function (event) {
        debug$9('ICE CANIDATE ERROR', event);
      });
    }
  }, {
    key: "onConnect",
    value: function onConnect(peerID) {
      debug$9('onConnect', peerID);
      this.connected = true;
      this.emit(this.jsonDetails.lifeCycle.RtcConnectedEvent, peerID);
      this.clearExtraOnConnection();
    }
  }, {
    key: "signalListener",
    value: function signalListener(data) {
      if (this.canSignal) {
        this.canSignal = !this.canSignal;
        ++this.offersSent;
        debug$9('webRTC setup signal received');
        this.emit('signal', data);
      }
    }
  }, {
    key: "receiveAnswer",
    value: function receiveAnswer(plainTextOffer) {
      debug$9('receiveAnswer for version: ', this.usingVersion);
      this.fallbackTimer();

      if (this.tryingTurn && this.usingVersion === 'V1') {
        this.answersReceived.push(plainTextOffer);

        if (this.turnTimer === null) {
          var _self = this;

          this.turnTimer = setTimeout(this.receiveTurnAnswer.bind(_self), 1000);
        }
      } else if (this.tryingTurn && this.usingVersion === 'V2') {
        this.enableTimer = false;

        if (this.turnTimer !== null) {
          clearTimeout(this.turnTimer);
        }

        debug$9('webRtc receiveAnswer');
        debug$9("active PEER_ID: ".concat(this.p.peerInstanceId));

        try {
          this.p.signal(plainTextOffer);
          debug$9('webRTC answer received and processed');
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        }
      } else {
        debug$9('webRtc receiveAnswer', this.answerReceived);
        debug$9("active PEER_ID: ".concat(this.p.peerInstanceId));

        try {
          this.answerReceived[this.p.peerInstanceId] = true;
          this.p.signal(plainTextOffer);
          debug$9('webRTC answer received and processed');
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        }
      }
    }
  }, {
    key: "receiveTurnAnswer",
    value: function receiveTurnAnswer() {
      var plainTextOffer = this.answersReceived[this.answersReceived.length - 1];
      debug$9('webRtc receiveTurnAnswer', this.answerReceived);
      debug$9("active PEER_ID: ".concat(this.p.peerInstanceId));

      try {
        this.answerReceived[this.p.peerInstanceId] = true;
        this.p.signal(plainTextOffer);
        debug$9('webRTC answer received and processed');
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
    } // ----- Socket Event handlers
    // Handle Socket Disconnect Event

  }, {
    key: "socketDisconnectHandler",
    value: function socketDisconnectHandler(reason) {
      debug$9(reason);
      this.socketV1Connected = false;
    } // Handle Socket Attempting Turn informative signal
    // Provide Notice that initial WebRTC connection failed and the fallback method will be used

  }, {
    key: "willAttemptTurn",
    value: function willAttemptTurn() {
      if (!this.connected && this.tryingTurn && this.usingVersion === 'V2') {
        this.refreshQrTimer();
        this.refreshEnabled = false;
      }

      if (!this.tryingTurn && this.usingVersion === 'V2') {
        debugStages$1('[webRTC Comm.] TRY TURN CONNECTION');
        debugStages$1(' TRY TURN V2');
        this.tryingTurn = true;

        try {
          this.useFallback();
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        }
      }

      this.tryingTurn = true;
    }
  }, {
    key: "refreshQrTimer",
    value: function refreshQrTimer() {
      var _this4 = this;

      setTimeout(function () {
        if (!_this4.connected && !_this4.refreshEnabled) {
          _this4.tryingTurn = false;
          _this4.refreshEnabled = true;

          _this4.emit('showRefresh'); // this.uiCommunicator('showRefresh');

        }
      }, 10000);
    }
  }, {
    key: "turnReset",
    value: function turnReset(peerId) {
      debug$9('TURN_RESET');
      this.tryingTurn = true;
      this.answerReceived[peerId] = false;
    }
  }, {
    key: "useFallback",
    value: function useFallback() {
      if (!this.connected) {
        this.emit(this.lifeCycle.UsingFallback, this.activeInitiatorId);
      }
    } // ----- Failure Handlers

  }, {
    key: "stateChangeListener",
    value: function stateChangeListener(peerID, evt) {
      // eslint-disable-next-line no-undef
      if (typeof jest === 'undefined') {
        // included because target is not defined in jest
        debug$9("iceConnectionState: ".concat(evt.target.iceConnectionState));
        debugPeer('this.allPeerIds', this.allPeerIds);
        debugPeer('peerID', peerID);

        if (evt.target.iceConnectionState === 'connected' || evt.target.iceConnectionState === 'completed') {
          if (this.timer) {
            clearTimeout(this.timer);
          }

          if (!this.connected) {
            this.connected = true; // this.emit(this.lifeCycle.RtcConnectedEvent, this.p.peerInstanceId);
          }
        }

        if ((evt.target.iceConnectionState === 'failed' || evt.target.iceConnectionState === 'disconnected') && !this.turnDisabled) {
          this.turnDisabled = true;
          this.useFallback();
        }
      }
    } // =========================================================
    // =========================================================
    // =========================================================

  }, {
    key: "onData",
    value: function () {
      var _onData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(peerID, data) {
        var decryptedData, parsed;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                debug$9('DATA RECEIVED');
                debugPeer('peerID', peerID);

                if (!this.connected) {
                  this.fallbackTimer();
                }

                this.outstandingMobileMessage = false; // this.emit('appData', data);

                _context.prev = 4;

                if (!this.isJSON(data)) {
                  _context.next = 11;
                  break;
                }

                _context.next = 8;
                return this.mewCrypto.decrypt(JSON.parse(data.toString()));

              case 8:
                decryptedData = _context.sent;
                _context.next = 14;
                break;

              case 11:
                _context.next = 13;
                return this.mewCrypto.decrypt(JSON.parse(data.toString()));

              case 13:
                decryptedData = _context.sent;

              case 14:
                if (!this.isJSON(decryptedData)) {
                  _context.next = 23;
                  break;
                }

                parsed = JSON.parse(decryptedData);

                if (!(this.channelTest && parsed.type === 'address')) {
                  _context.next = 20;
                  break;
                }

                this.channelTest = false;
                debug$9('new channel connected');
                return _context.abrupt("return");

              case 20:
                this.emit('appData', {
                  type: parsed.type,
                  data: parsed.data,
                  id: parsed.id
                });
                _context.next = 28;
                break;

              case 23:
                if (!(this.channelTest && decryptedData.type === 'address')) {
                  _context.next = 27;
                  break;
                }

                this.channelTest = false;
                debug$9('new channel connected');
                return _context.abrupt("return");

              case 27:
                this.emit('appData', {
                  type: decryptedData.type,
                  data: decryptedData.data,
                  id: decryptedData.id
                });

              case 28:
                this.initialAddressRequest = 'complete';
                _context.next = 37;
                break;

              case 31:
                _context.prev = 31;
                _context.t0 = _context["catch"](4);
                this.uiCommunicator(this.lifeCycle.decryptError);
                console.error(_context.t0);
                debug$9('onData ERROR: data=', data);
                debug$9('onData ERROR: data.toString()=', data.toString());

              case 37:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[4, 31]]);
      }));

      function onData(_x, _x2) {
        return _onData.apply(this, arguments);
      }

      return onData;
    }()
  }, {
    key: "onClose",
    value: function onClose(peerID, data) {
      debugStages$1('WRTC onClose event');
      debug$9('peerID', peerID);

      if (!this.isAlive()) {
        debugStages$1('WRTC CLOSE', data);

        if (this.connected) {
          this.connected = false;
          this.uiCommunicator(this.lifeCycle.RtcClosedEvent);
          this.uiCommunicator(this.lifeCycle.disconnected);
        } else {
          this.connected = false;
        }
      }
    }
  }, {
    key: "onError",
    value: function onError(peerID, err) {
      var _this5 = this;

      debugStages$1('WRTC onError event');
      debug$9('peerID', peerID);
      debug$9(err.code);
      debug$9('error', err);

      if (err.code && this.connected) {
        if (err.code.includes('ERR_DATA_CHANNEL')) {
          if (this.isAlive() && this.p.createNewDataChannel) {
            try {
              debug$9('re-create dataChannel');
              this.p.createNewDataChannel(uuid__default['default']());

              if (!this.channelTest && !this.outstandingMobileMessage) {
                this.channelTest = true; // this.sendRtcMessage('address', '', '123')

                this.channelTestTimer = setTimeout(function () {
                  if (_this5.channelTest) {
                    debug$9('new data channel failed to respond');

                    _this5.disconnectRTC();
                  }
                }, 5000);
                return;
              }
            } catch (e) {
              // eslint-disable-next-line
              debug$9(e);
              this.disconnectRTC();
            }
          }
        }
      }

      if (!this.connected && !this.tryingTurn && !this.turnDisabled) {
        this.useFallback();
      } else {
        if (!this.isAlive()) {
          this.uiCommunicator(this.lifeCycle.RtcErrorEvent);
        }
      }
    } // ----- WebRTC Communication Methods

  }, {
    key: "sendRtcMessageClosure",
    value: function sendRtcMessageClosure(type, msg, id) {
      var _this6 = this;

      return function () {
        debug$9("[WebRTC Comm - SEND RTC MESSAGE Closure] type:  ".concat(type, ",  message:  ").concat(msg));

        _this6.rtcSend(JSON.stringify({
          type: type,
          data: msg,
          id: id
        }));
      };
    }
  }, {
    key: "sendRtcMessage",
    value: function sendRtcMessage(type, msg, id) {
      var _this7 = this;

      debug$9(msg);

      if (type === 'address' && !this.initialAddressRequest) {
        this.initialAddressRequest = 'sent';
      } // TODO: could break on batch transactions
      // Doesn't when using mew V5 swap


      if (this.lastSentType !== type) {
        this.lastSentType = type;
        setTimeout(function () {
          _this7.lastSentType = '';
        }, 100);
      } else {
        return;
      }

      debug$9("[WebRTC Comm - SEND RTC MESSAGE] type:  ".concat(type, ",  message:  ").concat(msg, ", id: ").concat(id));
      this.rtcSend(JSON.stringify({
        type: type,
        data: msg,
        id: id
      }))["catch"](function (err) {
        console.error(err);
        debug$9(err);
      });
    }
  }, {
    key: "disconnectRTCClosure",
    value: function disconnectRTCClosure() {
      var _this8 = this;

      return function () {
        debugStages$1('DISCONNECT RTC Closure');
        _this8.connected = false;

        _this8.uiCommunicator(_this8.lifeCycle.RtcDisconnectEvent);

        _this8.rtcDestroy();

        _this8.instance = null;
      };
    }
  }, {
    key: "disconnectRTC",
    value: function disconnectRTC() {
      try {
        if (this.connected) {
          debugStages$1('DISCONNECT RTC');
          this.connected = false;
          this.uiCommunicator(this.lifeCycle.RtcDisconnectEvent);
          this.rtcDestroy();
          this.instance = null;
        }
      } catch (e) {
        console.error(e);
        debug$9(e);
      }
    }
  }, {
    key: "rtcSend",
    value: function () {
      var _rtcSend = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(arg) {
        var encryptedSend;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                debug$9(this.isAlive());

                if (!this.isAlive()) {
                  _context2.next = 17;
                  break;
                }

                if (!(typeof arg === 'string')) {
                  _context2.next = 9;
                  break;
                }

                _context2.next = 6;
                return this.mewCrypto.encrypt(arg);

              case 6:
                encryptedSend = _context2.sent;
                _context2.next = 12;
                break;

              case 9:
                _context2.next = 11;
                return this.mewCrypto.encrypt(JSON.stringify(arg));

              case 11:
                encryptedSend = _context2.sent;

              case 12:
                this.outstandingMobileMessage = true;
                this.p.send(JSON.stringify(encryptedSend));
                debug$9('SENDING RTC');
                _context2.next = 20;
                break;

              case 17:
                // eslint-disable-next-line
                this.uiCommunicator(this.lifeCycle.attemptedDisconnectedSend);
                console.error(Error('No connection present to send'));
                return _context2.abrupt("return", false);

              case 20:
                _context2.next = 26;
                break;

              case 22:
                _context2.prev = 22;
                _context2.t0 = _context2["catch"](0);
                console.error(_context2.t0);
                debug$9(_context2.t0);

              case 26:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 22]]);
      }));

      function rtcSend(_x3) {
        return _rtcSend.apply(this, arguments);
      }

      return rtcSend;
    }()
  }, {
    key: "rtcDestroy",
    value: function rtcDestroy() {
      debug$9('rtcDestroy');

      if (this.isAlive()) {
        this.p.destroy();
        debug$9('DESTROYED');
        this.connected = false;
        this.uiCommunicator(this.lifeCycle.RtcDestroyedEvent);
      } else if (!this.p.destroyed) {
        try {
          this.p.destroy();
        } catch (e) {
          console.error(e);
        }
      }
    }
  }]);

  return WebRtcCommunication;
}(MewConnectCommon);

var name = "@myetherwallet/mewconnect-web-client";
var homepage = "https://github.com/myetherwallet/MEWconnect-web-client";
var version = "2.2.0-beta.15";
var main = "dist/cjs/index.js";
var module$1 = "dist/esm/index.js";
var scripts = {
	start: "./node_modules/.bin/vue-cli-service serve  --https example/app/src/main.js",
	"test:jest": "npx jest --detectOpenHandles --forceExit --runInBand",
	"test:browser": "npx opn ./tests/browser/browser_test.html",
	"test:old": "npm run buildBrowserTest && npm run test:jest && npm run test:browser",
	test: "npm run test:jest",
	buildBrowserTest: "webpack --config tests/browser/webpack.config.js",
	"buildBrowserTest:watch": "webpack --config tests/browser/webpack.config.js -w",
	build: "npx npm-force-resolutions && npm install && npm run lint && rimraf dist/ && npx rollup -c",
	"build:dev": "rimraf dist/ && npx rollup -c",
	lint: "npx eslint --fix 'src/**.js'",
	"update:mainlist": "node src/connectProvider/fetchLists/fetchMainLists.js",
	"update:lists": "npm run update:mainlist && node src/connectProvider/fetchLists/index.js",
	prepublishOnly: "npm install && npm run update:lists && npm run build",
	prepack: "npm run build",
	ci: "npm install && npm run update:lists && npm run build"
};
var gitHooks = {
	"pre-commit": "npm run lint"
};
var dependencies = {
	"@rollup/plugin-babel": "^5.3.0",
	"@rollup/plugin-commonjs": "^20.0.0",
	"@rollup/plugin-json": "^4.1.0",
	"bignumber.js": "^9.0.0",
	"browser-or-node": "^1.2.1",
	"core-js": "^3.4.4",
	debug: "^4.0.1",
	"detect-browser": "^3.0.1",
	eccrypto: "^1.1.6",
	"eth-sig-util": "^3.0.1",
	"ethereumjs-common": "^1.5.0",
	"ethereumjs-tx": "^2.1.2",
	"ethereumjs-utils": "^5.2.5",
	"ethjs-unit": "^0.1.6",
	events: "^3.1.0",
	"isomorphic-ws": "^4.0.1",
	logging: "^3.2.0",
	mocha: "^5.2.0",
	"node-fetch": "^2.6.0",
	platform: "^1.3.5",
	"promise-ws": "^1.0.0-1",
	qrcode: "^1.5.0",
	"query-string": "^6.10.1",
	secp256k1: "^3.8.0",
	"simple-peer": "^9.6.2",
	"socket.io-client": "^2.3.0",
	store: "^2.0.12",
	underscore: "^1.13.2",
	uuid: "^3.4.0",
	vue: "^2.6.10",
	web3: "1.5.0",
	"web3-core-helpers": "1.5.0",
	"web3-core-method": "1.5.0",
	"web3-core-requestmanager": "1.5.0",
	"web3-utils": "1.5.0",
	"webrtc-adapter": "^6.4.3",
	wrtc: "^0.4.6",
	ws: "^7.5.3"
};
var devDependencies = {
	"@babel/core": "^7.8.4",
	"@babel/plugin-external-helpers": "^7.8.3",
	"@babel/plugin-transform-async-to-generator": "^7.8.3",
	"@babel/plugin-transform-regenerator": "^7.8.3",
	"@babel/plugin-transform-runtime": "^7.8.3",
	"@babel/plugin-transform-spread": "^7.8.3",
	"@babel/preset-env": "^7.8.4",
	"@rollup/plugin-image": "^2.1.0",
	"@vue/cli-plugin-babel": "^4.1.0",
	"@vue/cli-plugin-eslint": "^4.2.3",
	"@vue/cli-service": "^4.1.0",
	"@vue/eslint-config-prettier": "^4.0.1",
	axios: "^0.21.4",
	"babel-core": "^7.0.0-bridge.0",
	"babel-eslint": "^10.0.3",
	"babel-jest": "^25.1.0",
	"babel-preset-es2015-rollup": "^3.0.0",
	chai: "^4.2.0",
	"clean-webpack-plugin": "^3.0.0",
	eslint: "^6.8.0",
	"eslint-config-airbnb-base": "^13.2.0",
	"eslint-config-prettier": "^3.0.1",
	"eslint-plugin-import": "^2.20.1",
	"eslint-plugin-security": "^1.4.0",
	"eslint-plugin-vue": "^6.2.1",
	jest: "^25.2.3",
	"node-sass": "^4.12.0",
	nyc: "^15.0.0",
	opn: "^5.5.0",
	"opn-cli": "^3.1.0",
	"regenerator-runtime": "^0.13.3",
	rimraf: "^2.7.1",
	rollup: "^2.56.2",
	"rollup-plugin-json": "^3.1.0",
	"sass-loader": "^8.0.0",
	"style-loader": "^1.1.3",
	"svg-inline-loader": "^0.8.0",
	"url-loader": "^3.0.0",
	"vue-template-compiler": "^2.6.10",
	yorkie: "^2.0.0"
};
var resolutions = {
	"xmlhttprequest-ssl": "1.6.1"
};
var packageJson = {
	name: name,
	homepage: homepage,
	version: version,
	main: main,
	module: module$1,
	scripts: scripts,
	gitHooks: gitHooks,
	dependencies: dependencies,
	devDependencies: devDependencies,
	resolutions: resolutions
};

var debug$8 = debugLogger__default['default']('MEWconnect:initiator-base');
var debugStages = debugLogger__default['default']('MEWconnect:initiator-stages');
var debugConnectionState$1 = debugLogger__default['default']('MEWconnect:connection-state');
var qrString;

var MewConnectInitiator = /*#__PURE__*/function (_MewConnectCommon) {
  _inherits(MewConnectInitiator, _MewConnectCommon);

  var _super = _createSuper(MewConnectInitiator);

  function MewConnectInitiator() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, MewConnectInitiator);

    _this = _super.call(this, options.version);
    _this.optionVersion = options.version || 2.0;
    _this.showPopup = options.showPopup || false;

    try {
      _this.supportedBrowser = MewConnectCommon.checkBrowser();
      _this.requestIds = [];
      _this.V1 = {};
      _this.V2 = {};
      _this.activePeerId = '';
      _this.allPeerIds = [];
      _this.peersCreated = [];
      _this.v1Url = options.v1Url || V1endpoint;
      _this.v2Url = options.v2Url || V2endpoint;
      _this.turnTest = options.turnTest;

      _this.destroyOnUnload(typeof window !== 'undefined');

      _this.p = null;
      _this.socketV2Connected = false;
      _this.socketV1Connected = false;
      _this.showingQR = false;
      _this.connected = false;
      _this.tryingTurn = false;
      _this.turnDisabled = false;
      _this.signalUrl = null;
      _this.iceState = '';
      _this.turnServers = [];
      _this.refreshDelay = 20000;
      _this.socketsCreated = false;
      _this.refreshCount = 0;
      _this.abandonedTimeout = 300000;
      _this.showingRefresh = false;
      _this.mewCrypto = options.cryptoImpl || MewConnectCrypto.create();
      _this.webRtcCommunication = new WebRtcCommunication(_this.mewCrypto);
      _this.popupCreator = options.popupCreator ? options.popupCreator : options.newPopupCreator ? new PopUpCreator() : undefined;
      debugConnectionState$1('Initial Connection State:', MewConnectInitiator.getConnectionState());
      _this.version = _this.jsonDetails.version;
      _this.lifeCycle = _this.jsonDetails.lifeCycle;
      _this.iceStates = _this.jsonDetails.iceConnectionState;
      _this.stunServers = options.stunServers || _this.jsonDetails.stunSrvers; // Socket is abandoned.  disconnect.

      _this.timer = null;
      setTimeout(function () {
        if (_this.socket) {
          _this.socketDisconnect();
        }
      }, _this.abandonedTimeout);
      console.log("Using MEWconnect v".concat(packageJson.version));
    } catch (e) {
      debug$8('constructor error:', e);
    }

    return _this;
  }

  _createClass(MewConnectInitiator, [{
    key: "createWalletOnly",
    value: function () {
      var _createWalletOnly = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(network) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.popUpHandler = new PopUpHandler();
                return _context.abrupt("return", createWallet({
                  network: network
                }, this.popupCreator, this.popUpHandler));

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function createWalletOnly(_x) {
        return _createWalletOnly.apply(this, arguments);
      }

      return createWalletOnly;
    }()
  }, {
    key: "isAlive",
    value: function isAlive() {
      if (this.p !== null) {
        return this.p.connected && !this.p.destroyed;
      }

      return false;
    }
  }, {
    key: "focusPopupWindow",
    value: function focusPopupWindow() {
      if (!this.popupCreator) return;

      if (this.popupCreator.popupWindowOpen) {
        this.popupCreator.popupWindow.focus();
      }
    } // Check if a WebRTC connection exists before a window/tab is closed or refreshed
    // Destroy the connection if one exists

  }, {
    key: "destroyOnUnload",
    value: function destroyOnUnload() {
      var _this2 = this;

      if (browserOrNode.isBrowser) {
        try {
          // eslint-disable-next-line no-undef
          if (!window) return; // eslint-disable-next-line no-undef

          window.onunload = window.onbeforeunload = function () {
            var iceStates = [_this2.iceStates["new"], _this2.iceStates.connecting, _this2.iceStates.connected];

            if (_this2.Peer) {
              if (!_this2.Peer.destroyed || iceStates.includes(_this2.iceState)) {
                _this2.rtcDestroy();
              }
            }

            if (_this2.popupCreator) {
              _this2.popupCreator.removeWindowClosedListener();

              _this2.popupCreator.closePopupWindow();
            }
          };
        } catch (e) {
          debug$8(e);
        }
      }
    }
  }, {
    key: "getSocketConnectionState",
    // Returns a boolean indicating whether the socket connection exists and is active
    value: function getSocketConnectionState() {
      return this.socketV1Connected || this.socketV2Connected;
    } // Returns a boolean indicating whether the WebRTC connection exists and is active

  }, {
    key: "getConnectonState",
    value: function getConnectonState() {
      return this.connected;
    } // can be used to listen to specific events, especially those that pass data

  }, {
    key: "uiCommunicator",
    value: function uiCommunicator(event, data) {
      debug$8('MewConnectInitiator event emitted', event);
      this.emit(event, data);
      this.emitStatus(event);
    } // special status emitter to allow simple listening of various statuses in one listener

  }, {
    key: "emitStatus",
    value: function emitStatus(event) {
      this.emit('status', event);
    } // Emit/Provide the details used in creating the QR Code

  }, {
    key: "displayCode",
    value: function displayCode(privateKey) {
      try {
        if (privateKey instanceof Buffer) {
          privateKey = privateKey.toString('hex');
        }

        var dapp = 'example';

        if (typeof window !== 'undefined') {
          dapp = window.location.hostname;
        }

        debug$8('handshake', privateKey);
        this.socketKey = privateKey;
        var separator = this.jsonDetails.connectionCodeSeparator;
        var qrCodeString = this.version + separator + privateKey + separator + this.connId + ':name=' + dapp.replace(/^www\./, '');

        if (dapp.includes('myetherwallet.com')) {
          qrCodeString = this.version + separator + privateKey + separator + this.connId;
        } else if (dapp.includes('mewbuilds.com')) {
          qrCodeString = this.version + separator + privateKey + separator + this.connId;
        } else if (dapp.includes('localhost')) {
          qrCodeString = this.version + separator + privateKey + separator + this.connId;
        }

        qrString = qrCodeString;
        debug$8(qrCodeString);
      } catch (e) {
        debug$8('displayCode error:', e);
      }
    }
  }, {
    key: "ShowQr",
    value: function ShowQr(qrCodeString) {
      var _this3 = this;

      var unloadOrClosed = function unloadOrClosed() {
        if (!_this3.connected) {
          // eslint-disable-next-line no-console
          debug$8('popup window closed');

          _this3.uiCommunicator('popup_window_closed');

          MewConnectInitiator.setConnectionState();

          _this3.socketDisconnect();

          _this3.emit(_this3.lifeCycle.AuthRejected);
        }
      };

      debug$8(qrCodeString);

      if (this.showPopup) {
        if (this.popupCreator.popupWindowOpen) {
          if (this.popupCreator) this.popupCreator.updateQrCode(qrCodeString);
        } else {
          if (this.popupCreator) this.popupCreator.refreshQrcode = this.initiatorStart.bind(this);
          this.popupCreator.openPopupWindow(qrCodeString);
          if (this.popupCreator) this.popupCreator.container.addEventListener('mewModalClosed', unloadOrClosed, {
            once: true
          });
        }
      } else {
        this.uiCommunicator(this.lifeCycle.codeDisplay, qrCodeString); // this.uiCommunicator(this.lifeCycle.checkNumber, privateKey);

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

  }, {
    key: "generateKeys",
    value: function generateKeys(testPrivate) {
      if (!this.mewCrypto) this.mewCrypto = MewConnectCrypto.create();
      var keys = {};

      if (testPrivate) {
        keys = this.mewCrypto.setPrivate(testPrivate);
      } else {
        keys = this.mewCrypto.generateKeys();
      }

      this.publicKey = keys.publicKey;
      this.privateKey = keys.privateKey;
      this.connId = this.mewCrypto.generateConnId(this.publicKey);
      this.signed = this.mewCrypto.signMessageSync(this.privateKey, this.privateKey);
      debug$8('this.signed', this.signed);
    }
  }, {
    key: "refreshCode",
    value: function () {
      var _refreshCode = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _this4 = this;

        var v2Events, webRtcCommEvents;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // this.showingRefresh = false;
                v2Events = ['sendingOffer', 'retryingViaTurn', 'socketDisconnected', 'socketPaired'];
                webRtcCommEvents = ['disconnected', 'data', 'UsingFallback', 'showRefresh', 'decryptError', 'RtcConnectedEvent', 'signal']; // "sendingOffer", "retryingViaTurn", "socketDisconnected", "socketPaired"
                // "disconnected", "data", "UsingFallback", "showRefresh", "decryptError", "RtcConnectedEvent", "signal"

                webRtcCommEvents.forEach(function (event) {
                  return _this4.webRtcCommunication.removeAllListeners(event);
                });
                v2Events.forEach(function (event) {
                  return _this4.V2.removeAllListeners(event);
                });
                this.V2.socketDisconnect();
                if (this.popupCreator) this.popupCreator.popupWindowOpen = true;
                this.webRtcCommunication = new WebRtcCommunication(this.mewCrypto);
                this.initiatorStart();

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function refreshCode() {
        return _refreshCode.apply(this, arguments);
      }

      return refreshCode;
    }() // TODO change this to use supplied urls at time point

  }, {
    key: "initiatorStart",
    value: function () {
      var _initiatorStart = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(url, testPrivate) {
        var _this5 = this;

        var options, regenerateQRcodeOnClick, showRefresh, connectionErrorTimeOut;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.socketV1Connected) {
                  this.V1.socketDisconnect();
                }

                if (this.socketV2Connected) {
                  this.V2.socketDisconnect();
                }

                this.generateKeys(testPrivate);
                this.displayCode(this.privateKey);
                this.webRtcCommunication.once(this.lifeCycle.disconnected, this.uiCommunicator.bind(this, this.lifeCycle.RtcClosedEvent));
                options = {
                  stunServers: this.stunServers,
                  turnTest: this.turnTest,
                  version: this.optionVersion,
                  uiCommunicator: this.uiCommunicator.bind(this),
                  webRtcCommunication: this.webRtcCommunication,
                  crypto: this.mewCrypto
                };
                this.webRtcCommunication.on('data', this.dataReceived.bind(this));
                _context3.prev = 7;
                this.V2 = new MewConnectInitiatorV2(_objectSpread2({
                  url: V2endpoint
                }, options));
                _context3.next = 11;
                return this.V2.initiatorStart(V2endpoint, this.mewCrypto, {
                  signed: this.signed,
                  connId: this.connId
                });

              case 11:
                this.V2.on('sendingOffer', function () {
                  if (_this5.popupCreator) _this5.popupCreator.showConnecting();
                });
                this.V2.on('retryingViaTurn', function () {
                  _this5.showingRefresh = false; // reset refresh
                });

                regenerateQRcodeOnClick = function regenerateQRcodeOnClick() {
                  debug$8('REGENERATE');

                  _this5.refreshCode();
                };

                showRefresh = function showRefresh() {
                  if (!_this5.connected) {
                    if (!_this5.showingRefresh) {
                      _this5.showingRefresh = true; // only process one refresh event

                      if (_this5.popupCreator) _this5.popupCreator.showRetry(regenerateQRcodeOnClick);
                    }
                  }
                };

                this.V2.on('socketDisconnected', showRefresh.bind(this));
                this.V2.on('showRefresh', showRefresh.bind(this));
                this.webRtcCommunication.on('showRefresh', showRefresh.bind(this));
                this.webRtcCommunication.on(this.lifeCycle.decryptError, function () {
                  if (_this5.webRtcCommunication.initialAddressRequest !== 'complete') {
                    MewConnectInitiator.setConnectionState(DISCONNECTED);

                    _this5.webRtcCommunication.rtcDestroy();
                  }
                });
                _context3.next = 25;
                break;

              case 21:
                _context3.prev = 21;
                _context3.t0 = _context3["catch"](7);
                // eslint-disable-next-line
                console.error(_context3.t0);
                this.V2 = null;

              case 25:
                _context3.prev = 25;
                this.V1 = new MewConnectInitiatorV1(_objectSpread2({
                  url: V1endpoint
                }, options));
                _context3.next = 29;
                return this.V1.initiatorStart(V1endpoint, this.mewCrypto, {
                  signed: this.signed,
                  connId: this.connId
                });

              case 29:
                _context3.next = 35;
                break;

              case 31:
                _context3.prev = 31;
                _context3.t1 = _context3["catch"](25);
                console.error(_context3.t1);
                this.V1 = {};

              case 35:
                this.webRtcCommunication.setActiveInitiatorId(this.V2.initiatorId);
                connectionErrorTimeOut = setTimeout(function () {
                  window.alert('Failed to start MEWconnect. Please try again.');
                }, 60000);

                if (this.V1.on) {
                  this.V1.on('socketPaired', function () {
                    if (_this5.V2.socketDisconnect) _this5.V2.socketDisconnect();
                    _this5.socketV1Connected = true;
                  });
                  this.V1.once('SOCKET_CONNECTED', function () {
                    if (!_this5.showingQR) {
                      clearTimeout(connectionErrorTimeOut);
                      _this5.showingQR = true;

                      _this5.ShowQr(qrString);
                    }
                  });
                }

                if (this.V2.on) {
                  this.V2.on('socketPaired', function () {
                    if (_this5.V1.socketDisconnect) _this5.V1.socketDisconnect();
                    _this5.socketV2Connected = true;
                  });
                  this.V2.once('SOCKET_CONNECTED', function () {
                    if (!_this5.showingQR) {
                      clearTimeout(connectionErrorTimeOut);
                      _this5.showingQR = true;

                      _this5.ShowQr(qrString);
                    }
                  });
                }

                this.webRtcCommunication.once(this.jsonDetails.lifeCycle.RtcConnectedEvent, function () {
                  _this5.webRtcCommunication.removeAllListeners(_this5.jsonDetails.lifeCycle.RtcConnectedEvent);

                  debug$8('RTC CONNECTED ENVIRONMENT SETUP');

                  _this5.emit(_this5.lifeCycle.RtcConnectedEvent);

                  _this5.webRtcCommunication.on('appData', _this5.dataReceived.bind(_this5));

                  _this5.connected = true;
                  if (_this5.popupCreator) _this5.popupCreator.removeWindowClosedListener();
                  if (_this5.popupCreator) _this5.popupCreator.closePopupWindow();
                  MewConnectInitiator.setConnectionState(CONNECTED);
                });

              case 40:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[7, 21], [25, 31]]);
      }));

      function initiatorStart(_x2, _x3) {
        return _initiatorStart.apply(this, arguments);
      }

      return initiatorStart;
    }()
  }, {
    key: "socketDisconnect",
    value: function socketDisconnect() {
      this.V2.socketDisconnect();
      this.V1.socketDisconnect();
    }
  }, {
    key: "disconnectRTC",
    value: function disconnectRTC() {
      if (this.connected) {
        debugStages('DISCONNECT RTC');
        this.uiCommunicator(this.lifeCycle.RtcDisconnectEvent);
        this.webRtcCommunication.disconnectRTC();
        this.connected = false;
        this.instance = null;
      }
    }
  }, {
    key: "rtcSend",
    value: function () {
      var _rtcSend = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(arg) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.webRtcCommunication.rtcSend(arg);

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function rtcSend(_x4) {
        return _rtcSend.apply(this, arguments);
      }

      return rtcSend;
    }()
  }, {
    key: "sendRtcMessage",
    value: function sendRtcMessage(type, data) {
      var id = uuid__default['default']();
      this.requestIds.push(id);
      debug$8('MESSAGE IDS KNOWN', this.requestIds);
      this.webRtcCommunication.sendRtcMessage(type, data, id);
    }
  }, {
    key: "dataReceived",
    value: function dataReceived(data) {
      debug$8('dataReceived', data);

      if (data.id) {
        debug$8('MESSAGE ID RECEIVED', data.id);

        if (this.requestIds.includes(data.id)) {
          this.uiCommunicator(data.type, data.data);
          var idx = this.requestIds.findIndex(function (item) {
            return item === data.id;
          });
          this.requestIds.splice(idx, 1);
          debug$8('MESSAGE IDS KNOWN', this.requestIds);
        } else {
          debug$8('**NO MESSAGE ID RECEIVED : field present**');
          this.uiCommunicator(data.type, data.data);
        }
      } else {
        debug$8('**NO MESSAGE ID RECEIVED : field absent**');
        this.uiCommunicator(data.type, data.data);
      }
    }
  }, {
    key: "testV1Turn",
    value: function testV1Turn() {
      this.V1.disconnectRTC();
    }
  }, {
    key: "testV2Turn",
    value: function testV2Turn() {
      this.V2.disconnectRTC();
      this.V2.emit(this.lifeCycle);
    }
  }], [{
    key: "setConnectionState",
    value: function setConnectionState(connectionState) {
      if (!connectionState) MewConnectInitiator.connectionState = DISCONNECTED;else MewConnectInitiator.connectionState = connectionState;
    }
  }, {
    key: "getConnectionState",
    value: function getConnectionState() {
      if (!MewConnectInitiator.connectionState) return DISCONNECTED;
      return MewConnectInitiator.connectionState;
    }
  }, {
    key: "checkBrowser",
    value: function checkBrowser() {
      return MewConnectCommon.checkBrowser();
    }
  }, {
    key: "checkWebRTCAvailable",
    value: function checkWebRTCAvailable() {
      return MewConnectCommon.checkWebRTCAvailable();
    }
  }]);

  return MewConnectInitiator;
}(MewConnectCommon);

// INITIATOR CLIENT
var MewConnectClient = {
  Crypto: MewConnectCrypto,
  Initiator: MewConnectInitiator
};

var _ = require('underscore');

var errors = require('web3-core-helpers').errors;

var isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
var isRN = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
var Ws = null;
var _btoa = null;
var parseURL = null;

Ws = function Ws(url, protocols) {
  if (protocols) return new window.WebSocket(url, protocols);
  return new window.WebSocket(url);
};

if (isNode || isRN) {
  _btoa = function _btoa(str) {
    return Buffer.from(str).toString('base64');
  };

  var url = require('url');

  if (url.URL) {
    var newURL = url.URL;

    parseURL = function parseURL(url) {
      return new newURL(url);
    };
  } else {
    parseURL = require('url').parse;
  }
} else {
  _btoa = btoa.bind(window);

  parseURL = function parseURL(url) {
    return new URL(url);
  };
}

var WebsocketProvider = function WebsocketProvider(url, options) {
  var _this = this;

  this.responseCallbacks = {};
  this.notificationCallbacks = [];
  this.closeCallbacks = [];
  this.disconnectCallbacks = [];
  this.accountsChangedCallbacks = [];
  options = options || {};
  this._customTimeout = options.timeout;
  var parsedURL = parseURL(url);
  var headers = options.headers || {};
  var protocol = options.protocol || undefined;

  if (parsedURL.username && parsedURL.password) {
    headers.authorization = 'Basic ' + _btoa(parsedURL.username + ':' + parsedURL.password);
  }

  var clientConfig = options.clientConfig || undefined;

  if (parsedURL.auth) {
    headers.authorization = 'Basic ' + _btoa(parsedURL.auth);
  }

  this.connection = new Ws(url, protocol, undefined, headers, undefined, clientConfig);
  this.addDefaultEvents();

  this.connection.onmessage = function (e) {
    var data = typeof e.data === 'string' ? e.data : '';

    _this._parseResponse(data).forEach(function (result) {
      var id = null;

      if (_.isArray(result)) {
        result.forEach(function (load) {
          if (_this.responseCallbacks[load.id]) id = load.id;
        });
      } else {
        id = result.id;
      }

      if (!id && result && result.method && result.method.indexOf('_subscription') !== -1) {
        _this.notificationCallbacks.forEach(function (callback) {
          if (_.isFunction(callback)) callback(result);
        });
      } else if (_this.responseCallbacks[id]) {
        if (!result.error) {
          _this.responseCallbacks[id](null, result);
        } else {
          if (result.error.message === 'subscription not found' && options.subscriptionNotFoundNoThrow) {
            // eslint-disable-next-line
            console.warn('subscription not found');

            if (!result.result) {
              result.result = 'subscription not found';
            }

            _this.responseCallbacks[id](null, result);
          } else {
            _this.responseCallbacks[id](result);
          }
        }

        delete _this.responseCallbacks[id];
      }
    });
  };

  Object.defineProperty(this, 'connected', {
    get: function get() {
      return this.connection && this.connection.readyState === this.connection.OPEN;
    },
    enumerable: true
  });
};

WebsocketProvider.prototype.addDefaultEvents = function () {
  var _this = this;

  this.connection.onerror = function () {
    _this._timeout();
  };

  this.connection.onclose = function () {
    _this._timeout();

    _this.reset();
  };
};

WebsocketProvider.prototype._parseResponse = function (data) {
  var _this = this,
      returnValues = [];

  var dechunkedData = data.replace(/\}[\n\r]?\{/g, '}|--|{') // }{
  .replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
  .replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
  .replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
  .split('|--|');
  dechunkedData.forEach(function (data) {
    if (_this.lastChunk) data = _this.lastChunk + data;
    var result = null;

    try {
      result = JSON.parse(data);
    } catch (e) {
      _this.lastChunk = data;
      clearTimeout(_this.lastChunkTimeout);
      _this.lastChunkTimeout = setTimeout(function () {
        _this._timeout();

        throw errors.InvalidResponse(data);
      }, 1000 * 15);
      return;
    }

    clearTimeout(_this.lastChunkTimeout);
    _this.lastChunk = null;
    if (result) returnValues.push(result);
  });
  return returnValues;
};

WebsocketProvider.prototype._addResponseCallback = function (payload, callback) {
  var id = payload.id || payload[0].id;
  var method = payload.method || payload[0].method;
  this.responseCallbacks[id] = callback;
  this.responseCallbacks[id].method = method;

  var _this = this;

  if (this._customTimeout) {
    setTimeout(function () {
      if (_this.responseCallbacks[id]) {
        _this.responseCallbacks[id](errors.ConnectionTimeout(_this._customTimeout));

        delete _this.responseCallbacks[id];
      }
    }, this._customTimeout);
  }
};

WebsocketProvider.prototype._timeout = function () {
  for (var key in this.responseCallbacks) {
    // eslint-disable-next-line
    if (this.responseCallbacks.hasOwnProperty(key)) {
      this.responseCallbacks[key](errors.InvalidConnection('on WS'));
      delete this.responseCallbacks[key];
    }
  }
};

WebsocketProvider.prototype.send = function (payload, callback) {
  var _this = this;

  if (this.connection.readyState === this.connection.CONNECTING) {
    setTimeout(function () {
      _this.send(payload, callback);
    }, 10);
    return;
  }

  if (this.connection.readyState !== this.connection.OPEN) {
    if (typeof this.connection.onerror === 'function') {
      this.connection.onerror(new Error('connection not open'));
    }

    callback(new Error('connection not open'));
    return;
  }

  this.connection.send(JSON.stringify(payload));

  this._addResponseCallback(payload, callback);
};

WebsocketProvider.prototype.on = function (type, callback) {
  if (typeof callback !== 'function') throw new Error('The second parameter callback must be a function.');

  switch (type) {
    case 'data':
      this.notificationCallbacks.push(callback);
      break;

    case 'connect':
      this.connection.onopen = callback;
      break;

    case 'end':
      this.connection.onclose = callback;
      break;

    case 'error':
      this.connection.onerror = callback;
      break;

    case 'accountsChanged':
      this.accountsChangedCallbacks.push(callback);
      this.accountsChanged = callback;
      break;

    case 'disconnected':
      this.disconnectedCallback = callback;
      break;

    case 'disconnect':
      this.disconnectCallbacks.push(callback); // this.disconnectCallback = callback;

      break;

    case 'close':
      this.closeCallbacks.push(callback); // this.closeCallback = callback;

      break;
  }
};

WebsocketProvider.prototype.emit = function (type, data) {
  if (typeof type !== 'string') throw new Error('The first parameter type must be a function.');

  switch (type) {
    case 'accountsChanged':
      this.accountsChangedCallbacks.forEach(function (callback) {
        if (_.isFunction(callback)) callback(data);
      });
      break;

    case 'disconnect':
      this.disconnectCallbacks.forEach(function (callback) {
        if (_.isFunction(callback)) callback(data);
      });
      break;

    case 'close':
      this.closeCallbacks.forEach(function (callback) {
        if (_.isFunction(callback)) callback(data);
      });
      break;
  }
};

WebsocketProvider.prototype.removeListener = function (type, callback) {
  var _this = this;

  switch (type) {
    case 'data':
      this.notificationCallbacks.forEach(function (cb, index) {
        if (cb === callback) _this.notificationCallbacks.splice(index, 1);
      });
      break;

    case 'accountsChanged':
      this.accountsChangedCallbacks.forEach(function (cb, index) {
        if (cb === callback) _this.accountsChangedCallbacks.splice(index, 1);
      });
      break;

    case 'disconnect':
      this.disconnectCallbacks.forEach(function (cb, index) {
        if (cb === callback) _this.disconnectCallbacks.splice(index, 1);
      });
      break;

    case 'close':
      this.closeCallbacks.forEach(function (cb, index) {
        if (cb === callback) _this.closeCallbacks.splice(index, 1);
      });
      break;
  }
};

WebsocketProvider.prototype.removeAllListeners = function (type) {
  switch (type) {
    case 'data':
      this.notificationCallbacks = [];
      break;

    case 'connect':
      this.connection.onopen = null;
      break;

    case 'end':
      this.connection.onclose = null;
      break;

    case 'error':
      this.connection.onerror = null;
      break;
  }
};

WebsocketProvider.prototype.reset = function () {
  this._timeout();

  this.notificationCallbacks = [];
  this.addDefaultEvents();
};

WebsocketProvider.prototype.disconnect = function () {
  if (this.connection) {
    this.connection.close();
  }
};

var Middleware = /*#__PURE__*/function () {
  function Middleware() {
    _classCallCheck(this, Middleware);

    this.middlewares = [];
  }

  _createClass(Middleware, [{
    key: "use",
    value: function use(fn) {
      this.middlewares.push(fn);
    }
  }, {
    key: "executeMiddleware",
    value: function executeMiddleware(req, res, done) {
      this.middlewares.reduceRight(function (done, next) {
        return function () {
          return next(req, res, done);
        };
      }, done)(req, res);
    }
  }, {
    key: "run",
    value: function run(req, res) {
      var _this = this;

      return new Promise(function (resolve) {
        _this.executeMiddleware(req, res, resolve);
      });
    }
  }]);

  return Middleware;
}();

var createTimerObject = function createTimerObject() {
  var Timer = /*#__PURE__*/function () {
    function Timer() {
      _classCallCheck(this, Timer);
    }

    _createClass(Timer, null, [{
      key: "setTimeout",
      value: function (_setTimeout) {
        function setTimeout(_x, _x2) {
          return _setTimeout.apply(this, arguments);
        }

        setTimeout.toString = function () {
          return _setTimeout.toString();
        };

        return setTimeout;
      }(function (cb, ms) {
        return setTimeout(cb, ms);
      })
    }, {
      key: "clearTimeout",
      value: function (_clearTimeout) {
        function clearTimeout(_x3) {
          return _clearTimeout.apply(this, arguments);
        }

        clearTimeout.toString = function () {
          return _clearTimeout.toString();
        };

        return clearTimeout;
      }(function (id) {
        return clearTimeout(id);
      })
    }, {
      key: "setInterval",
      value: function (_setInterval) {
        function setInterval(_x4, _x5) {
          return _setInterval.apply(this, arguments);
        }

        setInterval.toString = function () {
          return _setInterval.toString();
        };

        return setInterval;
      }(function (cb, ms) {
        return setInterval(cb, ms);
      })
    }, {
      key: "clearInterval",
      value: function (_clearInterval) {
        function clearInterval(_x6) {
          return _clearInterval.apply(this, arguments);
        }

        clearInterval.toString = function () {
          return _clearInterval.toString();
        };

        return clearInterval;
      }(function (id) {
        return clearInterval(id);
      })
    }, {
      key: "setImmediate",
      value: function (_setImmediate) {
        function setImmediate(_x7) {
          return _setImmediate.apply(this, arguments);
        }

        setImmediate.toString = function () {
          return _setImmediate.toString();
        };

        return setImmediate;
      }(function (cb) {
        if (typeof setImmediate == 'function') {
          return setImmediate(cb);
        }

        return setTimeout(cb);
      })
    }]);

    return Timer;
  }();

  return Timer;
};

var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

var _timers = new Map();

var _SetTimeoutType = 0;
var _SetIntervalType = 1;
var _SetImmediateType = 2;
var _ClearTimeoutType = 3;
var _ClearIntervalType = 4;
var worker;
var _nextId = 0;

var nextId = function nextId() {
  if (_nextId == MAX_SAFE_INTEGER) {
    _nextId = 0;
  }

  return _nextId++;
};

var Timer = /*#__PURE__*/function () {
  function Timer() {
    _classCallCheck(this, Timer);
  }

  _createClass(Timer, null, [{
    key: "setTimeout",
    value: function setTimeout(cb, ms) {
      var id = nextId();

      _timers.set(id, cb);

      worker.postMessage({
        type: _SetTimeoutType,
        id: id,
        ms: ms
      });
      return id;
    }
  }, {
    key: "clearTimeout",
    value: function clearTimeout(id) {
      _timers["delete"](id);

      worker.postMessage({
        type: _ClearTimeoutType,
        id: id
      });
    }
  }, {
    key: "setInterval",
    value: function setInterval(cb, ms) {
      var id = nextId();

      _timers.set(id, cb);

      worker.postMessage({
        type: _SetIntervalType,
        id: id,
        ms: ms
      });
      return id;
    }
  }, {
    key: "clearInterval",
    value: function clearInterval(id) {
      _timers["delete"](id);

      worker.postMessage({
        type: _ClearIntervalType,
        id: id
      });
    }
  }, {
    key: "setImmediate",
    value: function setImmediate(cb) {
      var id = nextId();

      _timers.set(id, cb);

      worker.postMessage({
        type: _SetImmediateType,
        id: id
      });
      return id;
    }
  }, {
    key: "onmessage",
    value: function onmessage(e) {
      var cb = _timers.get(e.data.id);

      if (cb !== undefined) {
        cb.call();

        if (e.data.type !== _SetIntervalType) {
          _timers["delete"](e.data.id);
        }
      }
    }
  }]);

  return Timer;
}();

var workerCode = function workerCode() {
  return '(' + function () {
    var _wSetTimeoutType = 0;
    var _wSetIntervalType = 1;
    var _wSetImmediateType = 2;
    var _wClearTimeoutType = 3;
    var _wClearIntervalType = 4;
    var timers = {};

    self.onmessage = function (e) {
      if (e.data.type == _wSetTimeoutType) {
        timers[e.data.id] = setTimeout(function () {
          return self.postMessage(e.data);
        }, e.data.ms);
      } else if (e.data.type == _wSetIntervalType) {
        timers[e.data.id] = setInterval(function () {
          return self.postMessage(e.data);
        }, e.data.ms);
      } else if (e.data.type == _wSetImmediateType) {
        self.postMessage(e.data);
      } else if (e.data.type == _wClearTimeoutType) {
        clearTimeout(timers[e.data.id]);
        delete timers[e.data.id];
      } else if (e.data.type == _wClearIntervalType) {
        clearInterval(timers[e.data.id]);
        delete timers[e.data.id];
      }
    };
  }.toString() + '());';
};

var getTimer = function getTimer() {
  if (typeof navigator !== 'undefined' && (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.match(/Trident.*rv:11\./))) {
    return createTimerObject();
  } else if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope // eslint-disable-line
  ) {
      return createTimerObject();
    } else if (worker === undefined) {
    var url = URL.createObjectURL(new Blob([workerCode()], {
      type: 'text/javascript'
    }));
    worker = new Worker(url);
    worker.onmessage = Timer.onmessage;
    return Timer;
  }
};

var workerTimer = getTimer();

var EventNames = {
  SHOW_WEB3_CONFIRM_MODAL: 'showWeb3Wallet',
  SHOW_TX_CONFIRM_MODAL: 'showTxConfirmModal',
  SHOW_MSG_CONFIRM_MODAL: 'showMessageConfirmModal',
  SHOW_TX_SIGN_MODAL: 'showTxSignModal',
  GET_ENCRYPTED_PUBLIC_KEY: 'eth_getEncryptionPublicKey',
  DECRYPT: 'eth_decrypt',
  SIGN_TYPE_DATA_V3: 'eth_signTypedData_v3',
  SIGN_TYPE_DATA_V4: 'eth_signTypedData_v4',
  SIGN_TYPE_DATA: 'eth_signTypedData',
  WALLET_NOT_CONNECTED: 'walletNotConnected',
  ERROR_NOTIFY: 'errorNotify'
};

var toPayload = function toPayload(id, result) {
  return {
    jsonrpc: '2.0',
    id: id,
    result: result
  };
};

var toError = function toError(id, msg, code) {
  return {
    jsonrpc: '2.0',
    id: id,
    error: {
      code: code ? code : -32603,
      message: msg
    }
  };
};

var getSanitizedTx = function getSanitizedTx(tx) {
  return new Promise(function (resolve, reject) {
    if (!tx.gas && !tx.gasLimit && !tx.chainId) return reject(new Error('"gas" or "chainId" is missing'));
    if (tx.nonce < 0 || tx.gas < 0 || tx.gasPrice < 0 || !tx.gasPrice || tx.chainId < 0) return reject(new Error('Gas, gasPrice, nonce or chainId is lower than 0 or "gasPrice" is missing '));

    try {
      tx = web3CoreHelpers.formatters.inputCallFormatter(tx);
      var transaction = tx;
      if (tx.to) transaction.to = tx.to;
      transaction.data = tx.data || '0x';
      transaction.value = tx.value || '0x';
      transaction.chainId = tx.chainId;
      resolve(transaction);
    } catch (e) {
      reject(e);
    }
  });
};

var debug$7 = debugLogger__default['default']('MEWconnectWeb3');
var debugErrors$6 = debugLogger__default['default']('MEWconnectError');

var setEvents = function setEvents(promiObj, tx, eventHub) {
  promiObj.once('transactionHash', function (hash) {
    eventHub.emit('Hash', hash);
  }).once('receipt', function (res) {
    eventHub.emit('Receipt', res);
  }).on('error', function (err) {
    eventHub.emit('Error', err);
  });
};

var ethSendTransaction = /*#__PURE__*/(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, res, next) {
    var payload, store, eventHub, tx, localTx;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            payload = _ref.payload, store = _ref.store, eventHub = _ref.eventHub;

            if (!(payload.method !== 'eth_sendTransaction')) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", next());

          case 3:
            tx = Object.assign({}, payload.params[0]);
            localTx = Object.assign({}, tx);
            delete localTx['gas'];
            delete localTx['nonce'];
            _context.prev = 7;

            if (store.state.wallet) {
              _context.next = 13;
              break;
            }

            eventHub.emit(EventNames.WALLET_NOT_CONNECTED);
            debug$7('NOT ACTIVE WALLET IDENTIFIED');
            res(toError(payload.id, 'No active wallet: eth_sendTransaction', 4002));
            return _context.abrupt("return");

          case 13:
            if (tx.nonce) {
              _context.next = 19;
              break;
            }

            _context.next = 16;
            return store.state.web3.eth.getTransactionCount(store.state.wallet.getAddressString());

          case 16:
            _context.t0 = _context.sent;
            _context.next = 20;
            break;

          case 19:
            _context.t0 = tx.nonce;

          case 20:
            tx.nonce = _context.t0;

            if (tx.gasLimit && !tx.gas) {
              tx.gas = tx.gasLimit;
            } else if (!tx.gasLimit && tx.gas) {
              tx.gasLimit = tx.gas;
            }

            if (tx.gas) {
              _context.next = 28;
              break;
            }

            _context.next = 25;
            return store.state.web3.eth.estimateGas(localTx);

          case 25:
            _context.t1 = _context.sent;
            _context.next = 29;
            break;

          case 28:
            _context.t1 = tx.gas;

          case 29:
            tx.gas = _context.t1;

            if (tx.gasPrice) {
              _context.next = 36;
              break;
            }

            _context.next = 33;
            return store.state.web3.eth.getGasPrice();

          case 33:
            _context.t2 = _context.sent;
            _context.next = 37;
            break;

          case 36:
            _context.t2 = tx.gasPrice;

          case 37:
            tx.gasPrice = _context.t2;
            tx.chainId = !tx.chainId ? store.state.network.chainID : tx.chainId;
            _context.next = 47;
            break;

          case 41:
            _context.prev = 41;
            _context.t3 = _context["catch"](7);
            eventHub.emit(EventNames.ERROR_NOTIFY, _context.t3);
            debugErrors$6(_context.t3);
            res(_context.t3);
            return _context.abrupt("return");

          case 47:
            debug$7('RAW TX', tx);
            getSanitizedTx(tx).then(function (_tx) {
              debug$7('TX', _tx);
              eventHub.emit(EventNames.SHOW_TX_CONFIRM_MODAL, _tx, function (_response) {
                if (_response.reject) {
                  debug$7('USER DECLINED SIGN TRANSACTION & SEND');
                  res(toError(payload.id, 'User Rejected Request', 4001));
                  return;
                }

                debug$7('broadcasting', payload.method, _response.rawTransaction);

                var _promiObj = store.state.web3.eth.sendSignedTransaction(_response.rawTransaction);

                _promiObj.once('transactionHash', function (hash) {
                  if (store.state.wallet !== null) {
                    if (store.noSubs) {
                      var txHash = hash;
                      var start = Date.now();
                      var interval = setInterval(function () {
                        store.state.web3.eth.getTransactionReceipt(txHash).then(function (result) {
                          if (result !== null) {
                            clearInterval(interval);

                            _promiObj.emit('receipt', result);

                            return;
                          }

                          var cancelInterval = (Date.now() - start) / 1000 > 60 * 60;

                          if (cancelInterval) {
                            clearInterval(interval);
                          }
                        })["catch"](function (err) {
                          eventHub.emit(EventNames.ERROR_NOTIFY, err);

                          _promiObj.emit('error', err);
                        });
                      }, 5000);
                    }
                  }

                  res(null, toPayload(payload.id, hash));
                }).on('error', function (err) {
                  eventHub.emit(EventNames.ERROR_NOTIFY, err);
                  debugErrors$6('Error: eth_sendTransaction', err);
                  res(err);
                });

                setEvents(_promiObj, _tx, eventHub);
              });
            })["catch"](function (e) {
              res(e);
            });

          case 49:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[7, 41]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

var debug$6 = debugLogger__default['default']('MEWconnectWeb3');
var ethSign = /*#__PURE__*/(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, res, next) {
    var payload, eventHub, msg;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            payload = _ref.payload, eventHub = _ref.eventHub;

            if (!(payload.method !== 'eth_sign')) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", next());

          case 3:
            msg = payload.params[1];
            eventHub.emit(EventNames.SHOW_MSG_CONFIRM_MODAL, msg, function (_response) {
              if (_response.reject) {
                debug$6('USER DECLINED SIGN MESSAGE');
                res(toError(payload.id, 'User Rejected Request', 4001));
                return;
              }

              _response = misc.sanitizeHex(_response.toString('hex'));
              debug$6('sign result', _response);
              res(null, toPayload(payload.id, _response));
            });

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

var ethAccounts = /*#__PURE__*/(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, res, next) {
    var payload, store;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            payload = _ref.payload, store = _ref.store;

            if (!(payload.method !== 'eth_accounts')) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", next());

          case 3:
            if (store.state.wallet) {
              res(null, toPayload(payload.id, [store.state.wallet.getAddressString()]));
            } else {
              try {
                store.state.enable().then(function (accounts) {
                  res(null, toPayload(payload.id, accounts));
                });
              } catch (e) {
                res(null, toPayload(payload.id, []));
              }
            }

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

var ethCoinbase = /*#__PURE__*/(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, res, next) {
    var payload, store;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            payload = _ref.payload, store = _ref.store;

            if (!(payload.method !== 'eth_coinbase')) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", next());

          case 3:
            if (store.state.wallet) {
              res(null, toPayload(payload.id, store.state.wallet.getAddressString()));
            } else {
              res(toError(payload.id, 'No active wallet', 4002));
            }

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

var debug$5 = debugLogger__default['default']('MEWconnectWeb3');
var debugErrors$5 = debugLogger__default['default']('MEWconnectError');
var ethSignTransaction = /*#__PURE__*/(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, res, next) {
    var payload, store, eventHub, tx, localTx;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            payload = _ref.payload, store = _ref.store, eventHub = _ref.eventHub;

            if (!(payload.method !== 'eth_signTransaction')) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", next());

          case 3:
            tx = payload.params[0];
            localTx = Object.assign({}, tx);
            delete localTx['gas'];
            delete localTx['nonce'];
            _context.prev = 7;

            if (store.state.wallet) {
              _context.next = 13;
              break;
            }

            eventHub.emit(EventNames.WALLET_NOT_CONNECTED);
            debug$5('NOT ACTIVE WALLET IDENTIFIED');
            res(toError(payload.id, 'No active wallet: eth_signTransaction', 4002));
            return _context.abrupt("return");

          case 13:
            if (tx.nonce) {
              _context.next = 19;
              break;
            }

            _context.next = 16;
            return store.state.web3.eth.getTransactionCount(store.state.wallet.getAddressString());

          case 16:
            _context.t0 = _context.sent;
            _context.next = 20;
            break;

          case 19:
            _context.t0 = tx.nonce;

          case 20:
            tx.nonce = _context.t0;

            if (tx.gasLimit && !tx.gas) {
              tx.gas = tx.gasLimit;
            } else if (!tx.gasLimit && tx.gas) {
              tx.gasLimit = tx.gas;
            }

            if (!(!tx.gas || new BigNumber__default['default'](tx.gas).lte(0))) {
              _context.next = 28;
              break;
            }

            _context.next = 25;
            return store.state.web3.eth.estimateGas(localTx);

          case 25:
            _context.t1 = _context.sent;
            _context.next = 29;
            break;

          case 28:
            _context.t1 = tx.gas;

          case 29:
            tx.gas = _context.t1;
            tx.chainId = !tx.chainId ? store.state.network.chainID : tx.chainId;

            if (!(!tx.gasPrice || new BigNumber__default['default'](tx.gasPrice).lte(0))) {
              _context.next = 37;
              break;
            }

            _context.next = 34;
            return store.state.web3.eth.getGasPrice();

          case 34:
            _context.t2 = _context.sent;
            _context.next = 38;
            break;

          case 37:
            _context.t2 = tx.gasPrice;

          case 38:
            tx.gasPrice = _context.t2;
            getSanitizedTx(tx).then(function (_tx) {
              eventHub.emit(EventNames.SHOW_TX_SIGN_MODAL, _tx, function (_response) {
                if (_response.reject) {
                  debug$5('USER DECLINED SIGN TRANSACTION');
                  res(toError(payload.id, 'User Rejected Request', 4001));
                  return;
                }

                debug$5('return signed transaction', payload.method, _response);
                res(null, toPayload(payload.id, _response.rawTransaction));
              });
            })["catch"](function (e) {
              eventHub.emit(EventNames.ERROR_NOTIFY, e);
              debugErrors$5('Error: eth_signTransaction', e);
              res(e);
            });
            _context.next = 47;
            break;

          case 42:
            _context.prev = 42;
            _context.t3 = _context["catch"](7);
            debugErrors$5(_context.t3);
            debugErrors$5('Error: eth_signTransaction', _context.t3);
            res(_context.t3);

          case 47:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[7, 42]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

var netVersion = /*#__PURE__*/(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, res, next) {
    var payload, store;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            payload = _ref.payload, store = _ref.store;

            if (!(payload.method !== 'net_version')) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", next());

          case 3:
            res(null, toPayload(payload.id, store.state.network.chainID));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

var debug$4 = debugLogger__default['default']('MEWconnectWeb3');
var personalSign = /*#__PURE__*/(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, res, next) {
    var payload, eventHub, msg;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            payload = _ref.payload, eventHub = _ref.eventHub;

            if (!(payload.method !== 'personal_sign')) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", next());

          case 3:
            msg = payload.params[0];
            eventHub.emit(EventNames.SHOW_MSG_CONFIRM_MODAL, msg, function (_response) {
              if (_response.reject) {
                debug$4('USER DECLINED PERSONAL SIGN');
                res(toError(payload.id, 'User Rejected Request', 4001));
                return;
              }

              _response = misc.sanitizeHex(_response.toString('hex'));
              res(null, toPayload(payload.id, _response));
            });

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

var ecRecover = /*#__PURE__*/(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, res, next) {
    var payload, parts, recovered, addressBuffer;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            payload = _ref.payload;

            if (!(payload.method !== 'personal_ecRecover')) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", next());

          case 3:
            if (payload.params.length < 2) {
              res(toError(payload.id, "personal_ecRecover expects 2 parameters.  Received ".concat(payload.params.length, " ")));
            }

            parts = ethUtils__default['default'].fromRpcSig(payload.params[1]);

            if (!parts) {
              res(toError(payload.id, 'Invalid signature supplied to personal_ecRecover'));
            }

            recovered = ethUtils__default['default'].ecrecover(ethUtils__default['default'].hashPersonalMessage(misc.toBuffer(payload.params[0])), parts.v, parts.r, parts.s);
            addressBuffer = ethUtils__default['default'].pubToAddress(recovered);
            res(null, toPayload(payload.id, '0x' + addressBuffer.toString('hex')));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

var debug$3 = debugLogger__default['default']('MEWconnectWeb3');
var debugErrors$4 = debugLogger__default['default']('MEWconnectError');
var getEncryptionPublicKey = /*#__PURE__*/(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, res, next) {
    var payload, eventHub;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            payload = _ref.payload, eventHub = _ref.eventHub;

            if (!(payload.method !== 'eth_getEncryptionPublicKey')) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", next());

          case 3:
            try {
              eventHub.emit(EventNames.GET_ENCRYPTED_PUBLIC_KEY, payload.params, function (_response) {
                if (_response.reject) {
                  debug$3('USER DECLINED SIGN TRANSACTION');
                  res(toError(payload.id, 'User Rejected Request', 4001));
                  return;
                }

                debug$3('eth_getEncryptionPublicKey response', payload.method, _response);
                res(null, toPayload(payload.id, _response));
              });
            } catch (e) {
              debugErrors$4(e);
              debugErrors$4('Error: eth_getEncryptionPublicKey', e);
              res(e);
            }

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

var debug$2 = debugLogger__default['default']('MEWconnectWeb3');
var debugErrors$3 = debugLogger__default['default']('MEWconnectError');
var decrypt = /*#__PURE__*/(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, res, next) {
    var payload, eventHub, jsonObj;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            payload = _ref.payload, eventHub = _ref.eventHub;

            if (!(payload.method !== 'eth_decrypt')) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", next());

          case 3:
            try {
              debug$2(payload.params[0]); // todo remove dev item

              jsonObj = payload.params[0];

              if (!utils.isHexStrict(jsonObj)) {
                jsonObj = JSON.parse(jsonObj);
                jsonObj = ethUtils.bufferToHex(Buffer.from(JSON.stringify(jsonObj), 'utf8'));
              }

              eventHub.emit(EventNames.DECRYPT, [jsonObj, payload.params[1]], function (_response) {
                if (_response.reject) {
                  debug$2('USER DECLINED SIGN TRANSACTION');
                  res(toError(payload.id, 'User Rejected Request', 4001));
                  return;
                }

                debug$2('decrypt response', payload.method, _response);
                res(null, toPayload(payload.id, _response));
              });
            } catch (e) {
              debugErrors$3(e);
              debugErrors$3('Error: eth_decrypt', e);
              res(e);
            }

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

var debug$1 = debugLogger__default['default']('MEWconnectWeb3');
var debugErrors$2 = debugLogger__default['default']('MEWconnectError');
var signTypedData_v3 = /*#__PURE__*/(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, res, next) {
    var payload, eventHub;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            payload = _ref.payload, eventHub = _ref.eventHub;

            if (!(payload.method !== 'eth_signTypedData_v3')) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", next());

          case 3:
            try {
              eventHub.emit(EventNames.SIGN_TYPE_DATA_V3, payload.params[1], function (_response) {
                if (_response.reject) {
                  debug$1('USER DECLINED SIGN TYPED DATA');
                  res(toError(payload.id, 'User Rejected Request', 4001));
                  return;
                }

                debug$1('eth_signTypedData_v3 response', payload.method, _response);
                res(null, toPayload(payload.id, _response));
              });
            } catch (e) {
              debugErrors$2(e);
              debugErrors$2('Error: eth_signTypedData_v3', e);
              res(e);
            }

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

var debug = debugLogger__default['default']('MEWconnectWeb3');
var debugErrors$1 = debugLogger__default['default']('MEWconnectError');
var signTypedData_v4 = /*#__PURE__*/(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, res, next) {
    var payload, eventHub;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            payload = _ref.payload, eventHub = _ref.eventHub;

            if (!(payload.method !== 'eth_signTypedData_v4' && payload.method !== 'eth_signTypedData')) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", next());

          case 3:
            try {
              eventHub.emit(EventNames.SIGN_TYPE_DATA_V4, payload.params[1], function (_response) {
                if (_response.reject) {
                  debug('USER DECLINED SIGN TYPED DATA');
                  res(toError(payload.id, 'User Rejected Request', 4001));
                  return;
                }

                debug('eth_signTypedData_v4 response', payload.method, _response);
                res(null, toPayload(payload.id, _response));
              });
            } catch (e) {
              debugErrors$1(e);
              debugErrors$1('Error: eth_signTypedData_v3', e);
              res(e);
            }

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

var ethRequestAccounts = /*#__PURE__*/(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, res, next) {
    var payload, store;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            payload = _ref.payload, store = _ref.store;

            if (!(payload.method !== 'eth_requestAccounts')) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", next());

          case 3:
            if (store.state.wallet) {
              res(null, toPayload(payload.id, [store.state.wallet.getAddressString()]));
            } else {
              try {
                store.state.enable().then(function (accounts) {
                  res(null, toPayload(payload.id, accounts));
                });
              } catch (e) {
                res(null, toPayload(payload.id, []));
              }
            }

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

var WSProvider = function WSProvider(host, options, store, eventHub) {
  var _this2 = this;

  _classCallCheck(this, WSProvider);

  this.wsProvider = new WebsocketProvider(host, options);
  this.lastMessage = new Date().getTime();

  var keepAlive = function keepAlive() {
    if (_this2.wsProvider.connection.readyState === _this2.wsProvider.connection.OPEN) _this2.wsProvider.connection.send('');

    if (!Object.is(_this2.wsProvider, store.state.web3.currentProvider) && _this2.lastMessage + 10 * 60 * 1000 < new Date().getTime() //wait extra 10 minutes
    ) {
        _this2.wsProvider.disconnect();

        workerTimer.clearInterval(_this2.keepAliveTimer);
      }
  };

  this.keepAliveTimer = workerTimer.setInterval(keepAlive, 5000);
  var _this = this.wsProvider;
  delete this.wsProvider['send'];

  this.wsProvider.send = function (payload, callback) {
    _this2.lastMessage = new Date().getTime();

    if (_this.connection.readyState === _this.connection.CONNECTING) {
      setTimeout(function () {
        _this2.wsProvider.send(payload, callback);
      }, 100);
      return;
    }

    if (_this.connection.readyState !== _this.connection.OPEN) {
      if (typeof _this.connection.onerror === 'function') {
        _this.connection.onerror(new Error('connection not open'));
      }

      callback(new Error('connection not open'));
      return;
    }

    var req = {
      payload: payload,
      store: store,
      eventHub: eventHub
    };
    var middleware = new Middleware();
    middleware.use(ethSendTransaction);
    middleware.use(ethSignTransaction);
    middleware.use(ethSign);
    middleware.use(personalSign);
    middleware.use(ecRecover);
    middleware.use(ethAccounts);
    middleware.use(ethCoinbase);
    middleware.use(ethRequestAccounts);
    middleware.use(netVersion);
    middleware.use(decrypt);
    middleware.use(signTypedData_v3);
    middleware.use(signTypedData_v4);
    middleware.use(getEncryptionPublicKey);
    middleware.run(req, callback).then(function () {
      _this.connection.send(JSON.stringify(payload));

      _this._addResponseCallback(payload, callback);
    });
  };

  this.wsProvider.request = function (payload) {
    return new Promise(function (resolve, reject) {
      _this2.wsProvider.send({
        jsonrpc: '2.0',
        id: uuid$1.v4(),
        method: payload.method,
        params: payload.params
      }, function (err, res) {
        if (err) return reject(err);else if (res.error) return reject(res.error);
        resolve(res.result);
      });
    });
  };

  return this.wsProvider;
};

var HttpRequestManager = /*#__PURE__*/function () {
  function HttpRequestManager(host, options) {
    _classCallCheck(this, HttpRequestManager);

    options = options || {};
    this.host = host;
    var config = {
      timeout: options.timeout || 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (options.headers) {
      options.headers.forEach(function (header) {
        config.headers[header.name] = header.value;
      });
    }

    this.request = axios__default['default'].create(config);
    return new web3CoreRequestmanager.Manager(this);
  }

  _createClass(HttpRequestManager, [{
    key: "send",
    value: function send(payload, callback) {
      this.request.post(this.host, payload).then(function (result) {
        callback(null, result.data);
      })["catch"](function (err) {
        callback(err);
      });
    }
  }, {
    key: "disconnect",
    value: function disconnect() {}
  }]);

  return HttpRequestManager;
}();

var HttpProvider = function HttpProvider(host, options, store, eventHub) {
  var _this = this;

  _classCallCheck(this, HttpProvider);

  var requestManager = new HttpRequestManager(host, options);
  this.httpProvider = {
    send: function send(payload, callback) {
      var req = {
        payload: payload,
        store: store,
        eventHub: eventHub
      };
      var middleware = new Middleware();
      middleware.use(ethSendTransaction);
      middleware.use(ethSignTransaction);
      middleware.use(ethSign);
      middleware.use(personalSign);
      middleware.use(ecRecover);
      middleware.use(ethAccounts);
      middleware.use(ethCoinbase);
      middleware.use(ethRequestAccounts);
      middleware.use(netVersion);
      middleware.use(decrypt);
      middleware.use(signTypedData_v3);
      middleware.use(signTypedData_v4);
      middleware.use(getEncryptionPublicKey);
      middleware.run(req, callback).then(function () {
        requestManager.provider.send(payload, callback);
      });
    },
    notificationCallbacks: [],
    disconnectCallbacks: [],
    closeCallbacks: [],
    accountsChangedCallbacks: [],
    createSubscriptions: function createSubscriptions(subscription) {
      requestManager.addSubscription();
    },
    on: function on(type, callback) {
      if (typeof callback !== 'function') throw new Error('The second parameter callback must be a function.');

      switch (type) {
        case 'data':
          _this.httpProvider.notificationCallbacks.push(callback);

          _this.httpProvider.dataCallback = callback;
          break;

        case 'accountsChanged':
          _this.httpProvider.accountsChangedCallbacks.push(callback);

          _this.accountsChanged = callback;
          break;

        case 'disconnected':
          _this.httpProvider.disconnectedCallback = callback;
          break;

        case 'disconnect':
          _this.httpProvider.disconnectCallbacks.push(callback);

          _this.httpProvider.disconnectCallback = callback;
          break;

        case 'close':
          _this.httpProvider.closeCallbacks.push(callback);

          _this.httpProvider.closeCallback = callback;
          break;
      }
    },
    emit: function emit(type, data) {
      if (typeof type !== 'string') throw new Error('The first parameter type must be a string.');

      switch (type) {
        case 'accountsChanged':
          _this.httpProvider.accountsChangedCallbacks.forEach(function (callback) {
            if (typeof callback === 'function') callback(data);
          });

          break;

        case 'disconnect':
          _this.httpProvider.disconnectCallbacks.forEach(function (callback) {
            if (typeof callback === 'function') callback(data);
          });

          break;

        case 'close':
          _this.httpProvider.closeCallbacks.forEach(function (callback) {
            if (typeof callback === 'function') callback(data);
          });

          break;
      }
    }
  };

  this.httpProvider.request = function (payload) {
    return new Promise(function (resolve, reject) {
      _this.httpProvider.send({
        jsonrpc: '2.0',
        id: uuid$1.v4(),
        method: payload.method,
        params: payload.params
      }, function (err, res) {
        if (err) return reject(err);else if (res.error) return reject(res.error);
        resolve(res.result);
      });
    });
  };

  return this.httpProvider;
};

var MEWProvider = function MEWProvider(host, options, store, eventHub) {
  _classCallCheck(this, MEWProvider);

  if (host && typeof host === 'string') {
    if (/^http(s)?:\/\//i.test(host)) {
      store.noSubs = true;
      return new HttpProvider(host, options, store, eventHub);
    } else if (/^ws(s)?:\/\//i.test(host)) {
      return new WSProvider(host, options, store, eventHub);
    } else if (host) {
      throw new Error('Can\'t autodetect provider for "' + host + '"');
    }
  }
};

var tokens$5 = [
	{
		symbol: "$AAPL",
		address: "0x41eFc0253ee7Ea44400abB5F907FDbfdEbc82bec",
		decimals: 18
	},
	{
		symbol: "$ANRX",
		address: "0xCae72A7A0Fd9046cf6b165CA54c9e3a3872109E0",
		decimals: 18
	},
	{
		symbol: "$BASED",
		address: "0x29428639d889fa989405ee9baF3Ba088E6994eDC",
		decimals: 18
	},
	{
		symbol: "$BASED",
		address: "0x6AfdE9E8732EB8fe6376aE98347e64E2895299D4",
		decimals: 18
	},
	{
		symbol: "$BASED",
		address: "0x68A118Ef45063051Eac49c7e647CE5Ace48a68a5",
		decimals: 18
	},
	{
		symbol: "$ROPE",
		address: "0x9D47894f8BECB68B9cF3428d256311Affe8B068B",
		decimals: 18
	},
	{
		symbol: "$TEAK",
		address: "0x7DD7F56D697Cc0f2b52bD55C057f378F1fE6Ab4b",
		decimals: 18
	},
	{
		symbol: "0241.CX",
		address: "0x8837AD911818D61def3c65c199C06b5706F95364",
		decimals: 8
	},
	{
		symbol: "0522.CX",
		address: "0xEF7379179a9a85e1244bfC25FaE3292eE09Af8B8",
		decimals: 8
	},
	{
		symbol: "0XBTC",
		address: "0xB6eD7644C69416d67B522e20bC294A9a9B405B31",
		decimals: 8
	},
	{
		symbol: "0XESV",
		address: "0x8E9c3D1F30904E91764B7b8bBFDa3a429b886874",
		decimals: 8
	},
	{
		symbol: "0XMR",
		address: "0x035dF12E0F3ac6671126525f1015E47D79dFEDDF",
		decimals: 18
	},
	{
		symbol: "100WETH",
		address: "0x54355Ae0485F9420e6cE4c00C10172dc8E5728A3",
		decimals: 18
	},
	{
		symbol: "10SET",
		address: "0x7FF4169a6B5122b664c51c95727d87750eC07c84",
		decimals: 18
	},
	{
		symbol: "1211.CX",
		address: "0xC4CE6cb000d1C435C6D0c28814A2d61120F32B84",
		decimals: 8
	},
	{
		symbol: "1810.CX",
		address: "0xe142beF1c919C243B5c9d59B5e7bad3635C7AE78",
		decimals: 8
	},
	{
		symbol: "18C",
		address: "0x5A9bF6bADCd24Fe0d58E1087290c2FE2c728736a",
		decimals: 18
	},
	{
		symbol: "1AI",
		address: "0x208bbb6bCEA22ef2011789331405347394EbAa51",
		decimals: 18
	},
	{
		symbol: "1COV.CX",
		address: "0xe6Ca8989544337Da2283232Feb36F442b1aA3cAb",
		decimals: 8
	},
	{
		symbol: "1INCH",
		address: "0x111111111117dC0aa78b770fA6A738034120C302",
		decimals: 18
	},
	{
		symbol: "1MT",
		address: "0xf0Bc1ae4eF7ffb126A8347D06Ac6f8AdD770e1CE",
		decimals: 7
	},
	{
		symbol: "1SG",
		address: "0x0F72714B35a366285Df85886A2eE174601292A17",
		decimals: 18
	},
	{
		symbol: "1ST",
		address: "0xAf30D2a7E90d7DC361c8C4585e9BB7D2F6f15bc7",
		decimals: 18
	},
	{
		symbol: "1UP",
		address: "0x07597255910a51509CA469568B048F2597E72504",
		decimals: 18
	},
	{
		symbol: "1WO",
		address: "0xfDBc1aDc26F0F8f8606a5d63b7D3a3CD21c22B23",
		decimals: 8
	},
	{
		symbol: "2248",
		address: "0x8832E23B1135f78aD08a044c2550489eEA1E1098",
		decimals: 8
	},
	{
		symbol: "22X",
		address: "0x0073e5E52E2B4fE218D75d994eE2B3c82f9C87EA",
		decimals: 8
	},
	{
		symbol: "2DC",
		address: "0x9fC0583220eB44fAeE9e2dc1E63F39204DDD9090",
		decimals: 18
	},
	{
		symbol: "2KEY",
		address: "0xE48972fCd82a274411c01834e2f031D4377Fa2c0",
		decimals: 18
	},
	{
		symbol: "300",
		address: "0xaEc98A708810414878c3BCDF46Aad31dEd4a4557",
		decimals: 18
	},
	{
		symbol: "3CRV",
		address: "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490",
		decimals: 18
	},
	{
		symbol: "3LT",
		address: "0x430241368c1D293fdA21DBa8Bb7aF32007c59109",
		decimals: 8
	},
	{
		symbol: "4ART",
		address: "0xFF44b5719f0B77A9951636fc5e69d3a1fc9E7d73",
		decimals: 18
	},
	{
		symbol: "520",
		address: "0x62d75A2a10f755104bd1024d997141ce793Cf585",
		decimals: 18
	},
	{
		symbol: "599GTO1",
		address: "0x5D9776472483eE2c2B204775547BFf6db5A30Fed",
		decimals: 8
	},
	{
		symbol: "69C",
		address: "0x02FdD6866333D8Cd8B1ca022d382080698060BC2",
		decimals: 18
	},
	{
		symbol: "7E",
		address: "0x186a33d4dBcd700086A26188DcB74E69bE463665",
		decimals: 8
	},
	{
		symbol: "9988.CX",
		address: "0xc2c4D4094f521A6905D46cB8aA3d1765ABEA89Cf",
		decimals: 8
	},
	{
		symbol: "A",
		address: "0xFFc63b9146967A1ba33066fB057EE3722221aCf0",
		decimals: 18
	},
	{
		symbol: "A1",
		address: "0xBaC6874fFf7aC02C06907D0e340AF9f1832E7908",
		decimals: 18
	},
	{
		symbol: "A18",
		address: "0xBa7DCBa2Ade319Bc772DB4df75A76BA00dFb31b0",
		decimals: 18
	},
	{
		symbol: "AA.CX",
		address: "0x27d0E0Da86dA893053704DAd1C9cC6E6b1Ee37b0",
		decimals: 8
	},
	{
		symbol: "AAA",
		address: "0x6AbA1623ea906D1164Cbb007E764eBde2514A2Ba",
		decimals: 10
	},
	{
		symbol: "AAA",
		address: "0xD938137E6d96c72E4a6085412aDa2daD78ff89c4",
		decimals: 8
	},
	{
		symbol: "AAC",
		address: "0xe75ad3aAB14E4B0dF8c5da4286608DaBb21Bd864",
		decimals: 5
	},
	{
		symbol: "AAP.CX",
		address: "0xec2DA10f32Aa3844a981108887d7e50Efb7e2425",
		decimals: 8
	},
	{
		symbol: "AAPL",
		address: "0xd059c8a4c7f53C4352d933b059349Ba492294ac9",
		decimals: 18
	},
	{
		symbol: "AAPL.CX",
		address: "0x7EDc9e8A1196259b7C6aBA632037A9443D4E14f7",
		decimals: 8
	},
	{
		symbol: "AAT",
		address: "0x9f31fAb2405DfBa05a487EBce88F3ABd26F1cBa6",
		decimals: 18
	},
	{
		symbol: "AAVE",
		address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
		decimals: 18
	},
	{
		symbol: "ABA",
		address: "0x7C2AF3a86B4bf47E6Ee63AD9bde7B3B0ba7F95da",
		decimals: 18
	},
	{
		symbol: "ABA",
		address: "0xDAf76716996052aff7edb66Ef0Edb301BF001B6F",
		decimals: 18
	},
	{
		symbol: "ABAO",
		address: "0xE130d59c0D7f84260b776aA5F93DE5031C5A0BF6",
		decimals: 18
	},
	{
		symbol: "ABAT",
		address: "0xE1BA0FB44CCb0D11b80F92f4f8Ed94CA3fF51D00",
		decimals: 18
	},
	{
		symbol: "ABB",
		address: "0xc1C7883eA017B083B6167040dbB9c156A8E6B9e9",
		decimals: 18
	},
	{
		symbol: "ABBV.CX",
		address: "0xF573303B74968CBF2045Eb8C8f945B48954D711e",
		decimals: 8
	},
	{
		symbol: "ABC",
		address: "0x036407F23D5E1C1486F7488332CF54bf06E5F09F",
		decimals: 18
	},
	{
		symbol: "ABCH",
		address: "0xcc7d26D8eA6281BB363C8448515F2C61F7BC19F0",
		decimals: 18
	},
	{
		symbol: "ABDX",
		address: "0xB348cB0638b2399aE598b5575D5c12e0F15d3690",
		decimals: 18
	},
	{
		symbol: "ABGS",
		address: "0x36aba3dDD8B17c01E73Ee174Ca5d308703A203A5",
		decimals: 8
	},
	{
		symbol: "ABL",
		address: "0xf8b358b3397a8ea5464f8cc753645d42e14b79EA",
		decimals: 18
	},
	{
		symbol: "ABLOCK",
		address: "0xE692c8D72bd4aC7764090d54842a305546dd1dE5",
		decimals: 8
	},
	{
		symbol: "ABLX",
		address: "0x865bfD8232778F00CAe81315bf75ef1Fe6E30CDD",
		decimals: 18
	},
	{
		symbol: "ABPT",
		address: "0xcb03bec536843D338ac138205a6689d4cDc11046",
		decimals: 18
	},
	{
		symbol: "ABST",
		address: "0xa0B207103F764A920b4AF9e691F5bd956DE14DED",
		decimals: 8
	},
	{
		symbol: "ABT",
		address: "0xB98d4C97425d9908E66E53A6fDf673ACcA0BE986",
		decimals: 18
	},
	{
		symbol: "ABUSD",
		address: "0x6Ee0f7BB50a54AB5253dA0667B0Dc2ee526C30a8",
		decimals: 18
	},
	{
		symbol: "ABX",
		address: "0x9a794Dc1939F1d78fa48613b89B8f9d0A20dA00E",
		decimals: 18
	},
	{
		symbol: "ABYSS",
		address: "0x0E8d6b471e332F140e7d9dbB99E5E3822F728DA6",
		decimals: 18
	},
	{
		symbol: "AC",
		address: "0x9A0aBA393aac4dFbFf4333B06c407458002C6183",
		decimals: 18
	},
	{
		symbol: "AC3",
		address: "0x6561a9519581E98C8e0FcEd50DDD419Fc0e3028a",
		decimals: 18
	},
	{
		symbol: "ACA",
		address: "0x63d958D765F5bd88efDbD8Afd32445393b24907f",
		decimals: 8
	},
	{
		symbol: "ACAD",
		address: "0x1EFc4dfd580Df95426a0F04848870bd8cB5a338E",
		decimals: 18
	},
	{
		symbol: "ACAR",
		address: "0x30e5ceD3aA9148036116Baf816fEC8363691A5e8",
		decimals: 18
	},
	{
		symbol: "ACC",
		address: "0x13F1b7FDFbE1fc66676D56483e21B1ecb40b58E2",
		decimals: 18
	},
	{
		symbol: "ACC",
		address: "0xA842844D1A0e2A7bf17C55a3Ead3a144A1d51ed7",
		decimals: 18
	},
	{
		symbol: "ACD",
		address: "0xe45Fc4290fd3159588f532058592Ea327d2e97D4",
		decimals: 18
	},
	{
		symbol: "ACDC",
		address: "0xFc44EC51C80e35A87Bc2140299B1636eC83DFb04",
		decimals: 18
	},
	{
		symbol: "ACE",
		address: "0x06147110022B768BA8F99A8f385df11a151A9cc8",
		decimals: 0
	},
	{
		symbol: "ACE",
		address: "0xe17e41ACD4caa3CeC048837bfd1918b3c4141767",
		decimals: 6
	},
	{
		symbol: "AceD",
		address: "0x885e127abA09Bf8FAE058a2895c221B37697c9bE",
		decimals: 18
	},
	{
		symbol: "AceD",
		address: "0x4B3a0c6d668B43F3f07904E124328659b90Bb4Ca",
		decimals: 18
	},
	{
		symbol: "ACG",
		address: "0x984C134A8809571993Fd1573fB99F06Dc61E216f",
		decimals: 8
	},
	{
		symbol: "ACH",
		address: "0xEd04915c23f00A313a544955524EB7DBD823143d",
		decimals: 8
	},
	{
		symbol: "ACH",
		address: "0x13526D323373F4ebFCC71ffb4177EfeAd651C051",
		decimals: 18
	},
	{
		symbol: "ACO",
		address: "0xBFD16E47a1B6AD4adBE7AB2A1Cb624C6c8B1bC3d",
		decimals: 18
	},
	{
		symbol: "ACOIN",
		address: "0x9741Eaa28c446e87EC859AD871F85AC9b62a983c",
		decimals: 18
	},
	{
		symbol: "ACOIN",
		address: "0xFD25676Fc2c4421778B18Ec7Ab86E7C5701DF187",
		decimals: 18
	},
	{
		symbol: "ACPT",
		address: "0xcAd2d4C4469fF09aB24d02A63BCeDfCD44bE0645",
		decimals: 18
	},
	{
		symbol: "ACR",
		address: "0x76306F029f8F99EFFE509534037Ba7030999E3CF",
		decimals: 18
	},
	{
		symbol: "ACTP",
		address: "0x7b2dF125567815ac9b57DA04B620F50bc93B320C",
		decimals: 8
	},
	{
		symbol: "ACU",
		address: "0xD536bBd5414A8C2beEd82a63737B9327D2FA35a6",
		decimals: 18
	},
	{
		symbol: "ACW",
		address: "0xD29FA4B8Cc936a68BB560b19eED969EbfDBaA565",
		decimals: 10
	},
	{
		symbol: "ACXT",
		address: "0x7bE00ed6796B21656732E8f739Fc1b8F1C53DA0D",
		decimals: 18
	},
	{
		symbol: "AD",
		address: "0xF6dBE88bA55f1793Ff0773c9B1275300f830914F",
		decimals: 8
	},
	{
		symbol: "ADA",
		address: "0x43110D4f2113D50574412E852EBD96F1593179e4",
		decimals: 4
	},
	{
		symbol: "ADAB",
		address: "0x034B0dd380b5f6f8123b8d0d0E42329b67772792",
		decimals: 18
	},
	{
		symbol: "ADABEAR",
		address: "0xb3299d4BaB93Bf04d5b11bc49CD6DFAD1f77d23f",
		decimals: 18
	},
	{
		symbol: "ADABULL",
		address: "0x43dE1145Cd22f0a9Cc99e51c205e6e81161Df6B9",
		decimals: 18
	},
	{
		symbol: "ADAI",
		address: "0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d",
		decimals: 18
	},
	{
		symbol: "ADAI",
		address: "0x028171bCA77440897B824Ca71D1c56caC55b68A3",
		decimals: 18
	},
	{
		symbol: "ADB",
		address: "0x2baac9330Cf9aC479D819195794d79AD0c7616e3",
		decimals: 18
	},
	{
		symbol: "ADBE.CX",
		address: "0xcA52A83d53F3a0beED391657c0e83B915489FD1C",
		decimals: 8
	},
	{
		symbol: "ADC",
		address: "0x1e41a55030E0d0794AbfB6dCEd22e6C7d18d8247",
		decimals: 18
	},
	{
		symbol: "ADC$",
		address: "0x827Fe1736CEe36F7737Be6cF502434aF294Cf137",
		decimals: 18
	},
	{
		symbol: "ADCO",
		address: "0xB6c3DC857845a713d3531cea5ac546F6767992F4",
		decimals: 6
	},
	{
		symbol: "ADDC",
		address: "0x1AF97824a7ccd3963b9385E37ECbF44EcE0C73E4",
		decimals: 18
	},
	{
		symbol: "ADDR",
		address: "0x4363e1485764d206b01dDc9Ca121030585259f6F",
		decimals: 18
	},
	{
		symbol: "ADEL",
		address: "0x94d863173EE77439E4292284fF13fAD54b3BA182",
		decimals: 18
	},
	{
		symbol: "ADF",
		address: "0x7220e92D418E2EB59D0C25d195FA004bfD3aFC42",
		decimals: 18
	},
	{
		symbol: "ADH",
		address: "0xE69a353b3152Dd7b706ff7dD40fe1d18b7802d31",
		decimals: 18
	},
	{
		symbol: "ADI",
		address: "0x8810C63470d38639954c6B41AaC545848C46484a",
		decimals: 18
	},
	{
		symbol: "ADL",
		address: "0x660e71483785f66133548B10f6926dC332b06e61",
		decimals: 18
	},
	{
		symbol: "ADNT.CX",
		address: "0x4daE3Ed84d32f015cA6E5c94bEaF56203C7E46bA",
		decimals: 8
	},
	{
		symbol: "ADPT.CX",
		address: "0x3611BC1a02E79bD50124eDC138389f1F72BAE143",
		decimals: 8
	},
	{
		symbol: "ADS.CX",
		address: "0x68CBC28321666cF93d933c495631e81051fE656E",
		decimals: 8
	},
	{
		symbol: "ADST",
		address: "0x422866a8F0b032c5cf1DfBDEf31A20F4509562b0",
		decimals: 0
	},
	{
		symbol: "ADT",
		address: "0xD0D6D6C5Fe4a677D343cC433536BB717bAe167dD",
		decimals: 9
	},
	{
		symbol: "ADVC",
		address: "0xf8D1254FC324d2E75A5A37F5bD4CA34A20Ef460d",
		decimals: 8
	},
	{
		symbol: "ADX",
		address: "0xADE00C28244d5CE17D72E40330B1c318cD12B7c3",
		decimals: 18
	},
	{
		symbol: "ADX",
		address: "0x4470BB87d77b963A013DB939BE332f927f2b992e",
		decimals: 4
	},
	{
		symbol: "AE",
		address: "0x5CA9a71B1d01849C0a95490Cc00559717fCF0D1d",
		decimals: 18
	},
	{
		symbol: "AEM.CX",
		address: "0x8178851Bb47227811F8d24Bc2671ec2a63d4B70E",
		decimals: 8
	},
	{
		symbol: "AEN",
		address: "0x0BEf619cF38cF0c22967289b8419720fBd1Db9f7",
		decimals: 8
	},
	{
		symbol: "AENJ",
		address: "0x712DB54daA836B53Ef1EcBb9c6ba3b9Efb073F40",
		decimals: 18
	},
	{
		symbol: "AEP",
		address: "0x9e4Db6014A598fa1365E7c3f0F013477c961134a",
		decimals: 18
	},
	{
		symbol: "AER",
		address: "0xac4D22e40bf0B8eF4750a99ED4E935B99A42685E",
		decimals: 18
	},
	{
		symbol: "AERGO",
		address: "0xAE31b85Bfe62747d0836B82608B4830361a3d37a",
		decimals: 18
	},
	{
		symbol: "AERGO",
		address: "0x91Af0fBB28ABA7E31403Cb457106Ce79397FD4E6",
		decimals: 18
	},
	{
		symbol: "AET",
		address: "0x8c9E4CF756b9d01D791b95bc2D0913EF2Bf03784",
		decimals: 18
	},
	{
		symbol: "AETH",
		address: "0xE95A203B1a91a908F9B9CE46459d101078c2c3cb",
		decimals: 18
	},
	{
		symbol: "AETH",
		address: "0x658bBe318260AB879af701043B18F7e8c4dAf448",
		decimals: 18
	},
	{
		symbol: "AETH",
		address: "0x3a3A65aAb0dd2A17E3F1947bA16138cd37d08c04",
		decimals: 18
	},
	{
		symbol: "AF.CX",
		address: "0xD5CCDdc71353Ca810AE577CCAFBc6FD53161944b",
		decimals: 8
	},
	{
		symbol: "AFC",
		address: "0xF576ff0d7e4C1e8F27DbD50321E95E36a965985F",
		decimals: 18
	},
	{
		symbol: "AFC",
		address: "0x14dfFD4F515d4c43493C6c512c78fbC59a8aF254",
		decimals: 18
	},
	{
		symbol: "AFCASH",
		address: "0xb8a5dBa52FE8A0Dd737Bf15ea5043CEA30c7e30B",
		decimals: 18
	},
	{
		symbol: "AFDLT",
		address: "0xD8a8843b0a5aba6B030E92B3F4d669FaD8A5BE50",
		decimals: 4
	},
	{
		symbol: "AFIN",
		address: "0xEe9E5eFF401ee921b138490d00CA8D1F13f67A72",
		decimals: 8
	},
	{
		symbol: "AGA",
		address: "0x2D80f5F5328FdcB6ECeb7Cacf5DD8AEDaEC94e20",
		decimals: 4
	},
	{
		symbol: "AGBC",
		address: "0xAe679636776E1f9e3d02dAf2c4023aE0Cedd93a4",
		decimals: 18
	},
	{
		symbol: "AGI",
		address: "0x8eB24319393716668D768dCEC29356ae9CfFe285",
		decimals: 8
	},
	{
		symbol: "AGN",
		address: "0x25d9Bef26b6F7018D24d18144fe3C8bFD0d48a53",
		decimals: 18
	},
	{
		symbol: "AGOV",
		address: "0xc1AD269f10bF36D6972eE30827051b59d0d2456b",
		decimals: 18
	},
	{
		symbol: "AGRI",
		address: "0xa704fCe7b309Ec09DF16e2F5Ab8cAf6Fe8A4BAA9",
		decimals: 18
	},
	{
		symbol: "AGS",
		address: "0xdB2F2bCCe3efa95EDA95a233aF45F3e0d4f00e2A",
		decimals: 8
	},
	{
		symbol: "AGS",
		address: "0x7db5454F3500f28171d1f9c7a38527C9cF94e6b2",
		decimals: 4
	},
	{
		symbol: "AGS",
		address: "0x843C9AF34F698618F90C898E3967278a260c8d9A",
		decimals: 4
	},
	{
		symbol: "AGVC",
		address: "0x8b79656FC38a04044E495e22fAD747126ca305C4",
		decimals: 18
	},
	{
		symbol: "AHT",
		address: "0x4cEf5a02C36253CFB06825acE2a356E78000145f",
		decimals: 18
	},
	{
		symbol: "AI",
		address: "0x5121E348e897dAEf1Eef23959Ab290e5557CF274",
		decimals: 18
	},
	{
		symbol: "AID",
		address: "0x37E8789bB9996CaC9156cD5F5Fd32599E6b91289",
		decimals: 18
	},
	{
		symbol: "AIDOC",
		address: "0x584B44853680ee34a0F337B712a8f66d816dF151",
		decimals: 18
	},
	{
		symbol: "AIM",
		address: "0x53352e7d6620cc931c0C9318166ae2a92c1A4666",
		decimals: 18
	},
	{
		symbol: "AION",
		address: "0x4CEdA7906a5Ed2179785Cd3A40A69ee8bc99C466",
		decimals: 8
	},
	{
		symbol: "AIOZ",
		address: "0x626E8036dEB333b408Be468F951bdB42433cBF18",
		decimals: 18
	},
	{
		symbol: "AIPE",
		address: "0x44E4963f9012e7a7aEEe05b7f2caAe3419557AEA",
		decimals: 18
	},
	{
		symbol: "AIR",
		address: "0x27Dce1eC4d3f72C3E457Cc50354f1F975dDEf488",
		decimals: 8
	},
	{
		symbol: "AIR.CX",
		address: "0x5559BbAfAB7Fbec1Fd0f5DB5b71f042520fDE9a3",
		decimals: 8
	},
	{
		symbol: "AIRDROP",
		address: "0xba7435A4b4C747E0101780073eedA872a69Bdcd4",
		decimals: 18
	},
	{
		symbol: "AIT",
		address: "0x79650799e7899A802cB96C0Bc33a6a8d4CE4936C",
		decimals: 18
	},
	{
		symbol: "AIU",
		address: "0x0d268c105E1C5BDA54adfD811F8010EB11525Fa0",
		decimals: 8
	},
	{
		symbol: "AIV",
		address: "0xc35aAea6dD561A9976E1745A22F8CC5A762354BB",
		decimals: 18
	},
	{
		symbol: "AIX",
		address: "0x1063ce524265d5a3A624f4914acd573dD89ce988",
		decimals: 18
	},
	{
		symbol: "AKC",
		address: "0x1Ca43a170BaD619322e6f54d46b57e504dB663aA",
		decimals: 18
	},
	{
		symbol: "AKM",
		address: "0x5f02cf3c7ada49DFC4A3645Fc85C8aE86808Dd9b",
		decimals: 18
	},
	{
		symbol: "AKNC",
		address: "0x9D91BE44C06d373a8a226E1f3b146956083803eB",
		decimals: 18
	},
	{
		symbol: "AKRO",
		address: "0x8Ab7404063Ec4DBcfd4598215992DC3F8EC853d7",
		decimals: 18
	},
	{
		symbol: "ALBT",
		address: "0x00a8b738E453fFd858a7edf03bcCfe20412f0Eb0",
		decimals: 18
	},
	{
		symbol: "ALCO",
		address: "0x181a63746d3Adcf356CBc73aCE22832FFBB1EE5A",
		decimals: 8
	},
	{
		symbol: "ALCX",
		address: "0xdBdb4d16EdA451D0503b854CF79D55697F90c8DF",
		decimals: 18
	},
	{
		symbol: "ALEND",
		address: "0x7D2D3688Df45Ce7C552E19c27e007673da9204B8",
		decimals: 18
	},
	{
		symbol: "ALEPH",
		address: "0xC0134b5B924c2FCA106eFB33C45446c466FBe03e",
		decimals: 18
	},
	{
		symbol: "ALEPH",
		address: "0x27702a26126e0B3702af63Ee09aC4d1A084EF628",
		decimals: 18
	},
	{
		symbol: "ALEX",
		address: "0x8BA6DcC667d3FF64C1A2123cE72FF5F0199E5315",
		decimals: 4
	},
	{
		symbol: "ALG",
		address: "0x16B0a1a87ae8aF5C792faBC429C4FE248834842B",
		decimals: 18
	},
	{
		symbol: "ALGOBEAR",
		address: "0x057FB10e3fec001a40e6B75D3a30B99e23e54107",
		decimals: 18
	},
	{
		symbol: "ALGOBULL",
		address: "0x584936357D68f5143F12e2e64F0089dB93814dAd",
		decimals: 18
	},
	{
		symbol: "ALGODOOM",
		address: "0x9281c548C6d107aEA807B87a776da045F71fA193",
		decimals: 18
	},
	{
		symbol: "ALGOHEDGE",
		address: "0xfdc3D57eB7839ca68A2fAD7A93799c8e8aFA61B7",
		decimals: 18
	},
	{
		symbol: "ALGOMOON",
		address: "0xA386e04F0fb641869ACcD582C1B76eaa7d7087Fe",
		decimals: 18
	},
	{
		symbol: "ALH",
		address: "0x4c6719bF85903d18C295dA44216f862b01b36f43",
		decimals: 18
	},
	{
		symbol: "ALI",
		address: "0x4289c043A12392F1027307fB58272D8EBd853912",
		decimals: 18
	},
	{
		symbol: "ALICE",
		address: "0xAC51066d7bEC65Dc4589368da368b212745d63E8",
		decimals: 6
	},
	{
		symbol: "ALINK",
		address: "0xA64BD6C70Cb9051F6A9ba1F163Fdc07E0DfB5F84",
		decimals: 18
	},
	{
		symbol: "ALIS",
		address: "0xEA610B1153477720748DC13ED378003941d84fAB",
		decimals: 18
	},
	{
		symbol: "ALLBI",
		address: "0xA22525AAD7a794d5b923EcB036cEd9eB66D7D5ed",
		decimals: 18
	},
	{
		symbol: "ALLBIH",
		address: "0xb09Fb1961D5A222e934f97E1F6d0F003Ac7f883a",
		decimals: 18
	},
	{
		symbol: "ALLY.CX",
		address: "0x6A5A44f3c814B064dec0465ad97500AB255922c2",
		decimals: 8
	},
	{
		symbol: "ALMX",
		address: "0xeB85A7b3FED933eC3B4599F1B4F8F3F838d0BEDf",
		decimals: 18
	},
	{
		symbol: "ALMX",
		address: "0x25a3DcABbf0070cb8E5BaAa62D576cF6643afb5b",
		decimals: 18
	},
	{
		symbol: "ALNY.CX",
		address: "0x199911cBA391C79BD10D7aE9892B090eB6510B98",
		decimals: 8
	},
	{
		symbol: "ALP",
		address: "0x37D6E7F287200C740012747d2A79295cAeD2DB35",
		decimals: 8
	},
	{
		symbol: "ALP",
		address: "0x454B9f249bC1492eE995793Bbc3e57b830F1A5e9",
		decimals: 18
	},
	{
		symbol: "ALPA",
		address: "0x7cA4408137eb639570F8E647d9bD7B7E8717514A",
		decimals: 18
	},
	{
		symbol: "ALPHA",
		address: "0xa1faa113cbE53436Df28FF0aEe54275c13B40975",
		decimals: 18
	},
	{
		symbol: "ALT",
		address: "0x419B8ED155180A8c9C64145e76DaD49c0A4Efb97",
		decimals: 18
	},
	{
		symbol: "ALTBEAR",
		address: "0x90B417Ab462440Cf59767BCf72D0d91CA42F21ED",
		decimals: 18
	},
	{
		symbol: "ALTBULL",
		address: "0xd829664CDbF3195b2cE76047A65de29e7ED0a9A8",
		decimals: 18
	},
	{
		symbol: "ALTDOOM",
		address: "0xc1915A97Fd75818D3e10570B7613EdA8636720bB",
		decimals: 18
	},
	{
		symbol: "ALTHEDGE",
		address: "0x258FEc90B7788E60dA3bc6f81d5839Dc5B36a110",
		decimals: 18
	},
	{
		symbol: "ALTMOON",
		address: "0x7574C09a26e781dF694755cEc8aC04AF9d1e1Cc0",
		decimals: 18
	},
	{
		symbol: "ALTS",
		address: "0x638AC149eA8EF9a1286C41B977017AA7359E6Cfa",
		decimals: 18
	},
	{
		symbol: "ALTT",
		address: "0x485C540b5a299eAeb7307f21F5Bc3DEF6A920b5C",
		decimals: 1
	},
	{
		symbol: "ALUSD",
		address: "0xBC6DA0FE9aD5f3b0d58160288917AA56653660E9",
		decimals: 18
	},
	{
		symbol: "ALX",
		address: "0x49b127Bc33ce7E1586EC28CEC6a65b112596C822",
		decimals: 18
	},
	{
		symbol: "ALXN.CX",
		address: "0x044B5b891FE27ec8C155C4De189B90420B4F960E",
		decimals: 8
	},
	{
		symbol: "AMA",
		address: "0x1dd0Df760eB950083c1925da19fC7ac1356a190B",
		decimals: 18
	},
	{
		symbol: "AMA",
		address: "0xd7E1e4530D95717506633E58437f056A49c1FABB",
		decimals: 18
	},
	{
		symbol: "AMANA",
		address: "0x6FCE4A401B6B80ACe52baAefE4421Bd188e76F6f",
		decimals: 18
	},
	{
		symbol: "AMB",
		address: "0x4DC3643DbC642b72C158E7F3d2ff232df61cb6CE",
		decimals: 18
	},
	{
		symbol: "AMC",
		address: "0x9e5A64943f9F48463f07cC0578bBF9E2e67F0F61",
		decimals: 18
	},
	{
		symbol: "AMD.CX",
		address: "0xf728007AdA0bFA496f4A90C53F978452433f07F5",
		decimals: 8
	},
	{
		symbol: "AMGO",
		address: "0xf1aC7A375429719DE0dde33528e2639B9a206ebA",
		decimals: 18
	},
	{
		symbol: "AMIO",
		address: "0x2E68dfB3f50Ea302c88F8dB74096D57565D9970a",
		decimals: 18
	},
	{
		symbol: "AMIS",
		address: "0x949bEd886c739f1A3273629b3320db0C5024c719",
		decimals: 9
	},
	{
		symbol: "AMKR",
		address: "0x7deB5e830be29F91E298ba5FF1356BB7f8146998",
		decimals: 18
	},
	{
		symbol: "AMLT",
		address: "0xCA0e7269600d353F70b14Ad118A49575455C0f2f",
		decimals: 18
	},
	{
		symbol: "AMM",
		address: "0x8B1F49491477e0fB46a29fef53F1EA320D13c349",
		decimals: 6
	},
	{
		symbol: "AMN",
		address: "0x737F98AC8cA59f2C68aD658E3C3d8C8963E40a4c",
		decimals: 18
	},
	{
		symbol: "AMO",
		address: "0x38c87AA89B2B8cD9B95b736e1Fa7b612EA972169",
		decimals: 18
	},
	{
		symbol: "AMP",
		address: "0xfF20817765cB7f73d4bde2e66e067E58D11095C2",
		decimals: 18
	},
	{
		symbol: "AMPL",
		address: "0xD46bA6D942050d489DBd938a2C909A5d5039A161",
		decimals: 9
	},
	{
		symbol: "AMR",
		address: "0xd3Fb5cAbd07c85395667f83D20b080642BdE66C7",
		decimals: 16
	},
	{
		symbol: "AMTC",
		address: "0x84936cF7630AA3e27Dd9AfF968b140d5AEE49F5a",
		decimals: 8
	},
	{
		symbol: "AMU",
		address: "0x1E9421331F19E6c4Ba79BCE22582e3F34c4CF506",
		decimals: 18
	},
	{
		symbol: "AMUN.CX",
		address: "0x79dE7ab8aED2CF7187Cafcc9bC5a8101364a3a9E",
		decimals: 8
	},
	{
		symbol: "AMZN.CX",
		address: "0xd6a073D973F95B7Ce2eCf2B19224fa12103CF460",
		decimals: 8
	},
	{
		symbol: "ANC",
		address: "0x0F3ADC247E91c3c50bC08721355A41037E89Bc20",
		decimals: 18
	},
	{
		symbol: "ANCT",
		address: "0x5456BC77Dd275c45c3C15f0cF936b763cF57c3B5",
		decimals: 8
	},
	{
		symbol: "ANG",
		address: "0x130914E1B240a7F4c5D460B7d3a2Fd3846b576fa",
		decimals: 18
	},
	{
		symbol: "ANGEL",
		address: "0xf150b9054013552A6288320Dc4AFe1beeBb79D8E",
		decimals: 18
	},
	{
		symbol: "ANIME",
		address: "0xc36e2C02e64585c15794B8e25E826d50b15fd878",
		decimals: 8
	},
	{
		symbol: "ANJ",
		address: "0xcD62b1C403fa761BAadFC74C525ce2B51780b184",
		decimals: 18
	},
	{
		symbol: "ANK",
		address: "0x3C45B24359fB0E107a4eAA56Bd0F2cE66C99A0E5",
		decimals: 18
	},
	{
		symbol: "ANK",
		address: "0xaa4AB1C817e4dF7d25Ce4D42352649d592a3bBA0",
		decimals: 18
	},
	{
		symbol: "ANKR",
		address: "0x8290333ceF9e6D528dD5618Fb97a76f268f3EDD4",
		decimals: 18
	},
	{
		symbol: "ANT",
		address: "0xa117000000f279D81A1D3cc75430fAA017FA5A2e",
		decimals: 18
	},
	{
		symbol: "ANT",
		address: "0x960b236A07cf122663c4303350609A66A7B288C0",
		decimals: 18
	},
	{
		symbol: "ANTS",
		address: "0xa9fBB83a2689F4fF86339a4b96874d718673b627",
		decimals: 18
	},
	{
		symbol: "ANU",
		address: "0xED141928B4a5184603105BD9A5AEA5eB63182F7b",
		decimals: 18
	},
	{
		symbol: "ANW",
		address: "0x7DbDD9DaFdC4c1c03D67925a4f85daA398aF32B0",
		decimals: 18
	},
	{
		symbol: "ANY",
		address: "0xf99d58e463A2E07e5692127302C20A191861b4D6",
		decimals: 18
	},
	{
		symbol: "AO",
		address: "0xD2299b3098Cf5E13144caebFDAD61EBE505233Dc",
		decimals: 18
	},
	{
		symbol: "AOA",
		address: "0x9ab165D795019b6d8B3e971DdA91071421305e5a",
		decimals: 18
	},
	{
		symbol: "AOG",
		address: "0x8578530205CEcbe5DB83F7F29EcfEEC860C297C2",
		decimals: 18
	},
	{
		symbol: "APA.CX",
		address: "0x94837e5a3D1A3957b8782e8A303f226B29e38A34",
		decimals: 8
	},
	{
		symbol: "APC",
		address: "0x15bdA08c3afbf5955D6e9B235Fd55a1FD0DbC829",
		decimals: 6
	},
	{
		symbol: "APEUSD-AAVE-DEC21",
		address: "0xEC6a5D88bF56Fd3F96957AE65916C69F29DB35c5",
		decimals: 18
	},
	{
		symbol: "APEUSD-LINK-DEC21",
		address: "0x0f775aD69e3c93D599D3315A130Bd82A0cDda397",
		decimals: 18
	},
	{
		symbol: "APEUSD-SNX-DEC21",
		address: "0x5C6Af72cBd740b90528C8Fe226125413b6bd7E5A",
		decimals: 18
	},
	{
		symbol: "APEUSD-UMA-DEC21",
		address: "0xfA5e27893aee4805283D86e4283Da64F8c72dd56",
		decimals: 18
	},
	{
		symbol: "APEUSD-UNI-DEC21",
		address: "0xFbB6B34DD77274a06EA2E5462a5e0B9E23ce478e",
		decimals: 18
	},
	{
		symbol: "API3",
		address: "0x0b38210ea11411557c13457D4dA7dC6ea731B88a",
		decimals: 18
	},
	{
		symbol: "APIS",
		address: "0x4C0fBE1BB46612915E7967d2C3213cd4d87257AD",
		decimals: 18
	},
	{
		symbol: "APIX",
		address: "0xf51EBf9a26DbC02B13F8B3a9110dac47a4d62D78",
		decimals: 18
	},
	{
		symbol: "APM",
		address: "0xC8C424B91D8ce0137bAB4B832B7F7D154156BA6c",
		decimals: 18
	},
	{
		symbol: "APOD",
		address: "0x99bC08DB67F52010f2D6017b7aD968808113dB10",
		decimals: 18
	},
	{
		symbol: "APOT",
		address: "0x16c1E5BAF21b9Fa4BC9f2C374E4dC19fAB5Ac5Dc",
		decimals: 18
	},
	{
		symbol: "APPC",
		address: "0x1a7a8BD9106F2B8D977E08582DC7d24c723ab0DB",
		decimals: 18
	},
	{
		symbol: "APT",
		address: "0x23aE3C5B39B12f0693e05435EeaA1e51d8c61530",
		decimals: 18
	},
	{
		symbol: "APT",
		address: "0x3d207d98e762fB64E163abDdCb25A913EeB741Cd",
		decimals: 18
	},
	{
		symbol: "APX",
		address: "0x1239562AbE89Ff62016AE23d4E6Eef12b915295c",
		decimals: 18
	},
	{
		symbol: "APY",
		address: "0x95a4492F028aa1fd432Ea71146b433E7B4446611",
		decimals: 18
	},
	{
		symbol: "AQT",
		address: "0x2a9bDCFF37aB68B95A53435ADFd8892e86084F93",
		decimals: 18
	},
	{
		symbol: "AR.CX",
		address: "0x24bBaC3A6148320Cf9eE20D9ABeb8dD5A4800b52",
		decimals: 8
	},
	{
		symbol: "ARA",
		address: "0xa92E7c82B11d10716aB534051B271D2f6aEf7Df5",
		decimals: 18
	},
	{
		symbol: "ARAW",
		address: "0x30680AC0a8A993088223925265fD7a76bEb87E7F",
		decimals: 18
	},
	{
		symbol: "ARB",
		address: "0xaFBeC4D65BC7b116d85107FD05d912491029Bf46",
		decimals: 18
	},
	{
		symbol: "ARC",
		address: "0xfEE2Fa52DE307316d9D47fFE3781D4CBA2C4f6fD",
		decimals: 18
	},
	{
		symbol: "ARC",
		address: "0xAc709FcB44a43c35F0DA4e3163b117A17F3770f5",
		decimals: 18
	},
	{
		symbol: "ARCG",
		address: "0xf5774f42b28F35429AAC35f8Eb57541c511fDd49",
		decimals: 18
	},
	{
		symbol: "ARCH",
		address: "0x1F3f9D3068568F8040775be2e8C03C103C61f3aF",
		decimals: 18
	},
	{
		symbol: "ARCONA",
		address: "0x0f71B8De197A1C84d31de0F1fA7926c365F052B3",
		decimals: 18
	},
	{
		symbol: "ARCT",
		address: "0x1245ef80F4d9e02ED9425375e8F649B9221b31D8",
		decimals: 8
	},
	{
		symbol: "ARD",
		address: "0x75Aa7B0d02532f3833b66c7f0Ad35376d373ddF8",
		decimals: 18
	},
	{
		symbol: "AREN",
		address: "0x69948cC03f478B95283F7dbf1CE764d0fc7EC54C",
		decimals: 18
	},
	{
		symbol: "AREP",
		address: "0x71010A9D003445aC60C4e6A7017c1E89A477B438",
		decimals: 18
	},
	{
		symbol: "ARIA20",
		address: "0xeDF6568618A00C6F0908Bf7758A16F76B6E04aF9",
		decimals: 18
	},
	{
		symbol: "ARM",
		address: "0xa9Ff725189fe00da9C5F27a580DC67FEA61E3Fb2",
		decimals: 18
	},
	{
		symbol: "ARMOR",
		address: "0x1337DEF16F9B486fAEd0293eb623Dc8395dFE46a",
		decimals: 18
	},
	{
		symbol: "ARN",
		address: "0xBA5F11b16B155792Cf3B2E6880E8706859A8AEB6",
		decimals: 8
	},
	{
		symbol: "ARNC.CX",
		address: "0xbA68D28ddA9708bc6100Ec403CBaCBFfA1f9b283",
		decimals: 8
	},
	{
		symbol: "ARNX",
		address: "0x0C37Bcf456bC661C14D596683325623076D7e283",
		decimals: 18
	},
	{
		symbol: "ARNXM",
		address: "0x1337DEF18C680aF1f9f45cBcab6309562975b1dD",
		decimals: 18
	},
	{
		symbol: "ARPA",
		address: "0xBA50933C268F567BDC86E1aC131BE072C6B0b71a",
		decimals: 18
	},
	{
		symbol: "ART",
		address: "0xfec0cF7fE078a500abf15F1284958F22049c2C7e",
		decimals: 18
	},
	{
		symbol: "ARTE",
		address: "0x34612903Db071e888a4dADcaA416d3EE263a87b9",
		decimals: 18
	},
	{
		symbol: "ARTE",
		address: "0x5f6E7fb7Fe92EA7822472bB0E8f1BE60D6A4EA50",
		decimals: 18
	},
	{
		symbol: "ARTE",
		address: "0x44b6e3e85561ce054aB13Affa0773358D795D36D",
		decimals: 18
	},
	{
		symbol: "ARTIS",
		address: "0x082E13494f12EBB7206FBf67E22A6E1975A1A669",
		decimals: 8
	},
	{
		symbol: "ARTS",
		address: "0xF013e0ea26Cb386B3021783a3201BF2652778f93",
		decimals: 18
	},
	{
		symbol: "ARX",
		address: "0x7705FaA34B16EB6d77Dfc7812be2367ba6B0248e",
		decimals: 8
	},
	{
		symbol: "ARX",
		address: "0xb0D926c1BC3d78064F3e1075D5bD9A24F35Ae6C5",
		decimals: 18
	},
	{
		symbol: "ARY",
		address: "0xa5F8fC0921880Cb7342368BD128eb8050442B1a1",
		decimals: 18
	},
	{
		symbol: "ASAC",
		address: "0x6913cCabBC337F0ea7b4109dd8200D61c704D332",
		decimals: 8
	},
	{
		symbol: "ASCC",
		address: "0x5580894F975fF049857147C8410D9b0dB00D9c5e",
		decimals: 18
	},
	{
		symbol: "ASD",
		address: "0xcca0c9c383076649604eE31b20248BC04FdF61cA",
		decimals: 18
	},
	{
		symbol: "ASETH",
		address: "0x0BF54992649C19bd8Db4080078a32383827352f3",
		decimals: 18
	},
	{
		symbol: "ASKO",
		address: "0xeEEE2a622330E6d2036691e983DEe87330588603",
		decimals: 18
	},
	{
		symbol: "ASM",
		address: "0x2565ae0385659badCada1031DB704442E1b69982",
		decimals: 18
	},
	{
		symbol: "ASNX",
		address: "0x328C4c80BC7aCa0834Db37e6600A6c49E12Da4DE",
		decimals: 18
	},
	{
		symbol: "ASNX",
		address: "0x35f6B052C598d933D69A4EEC4D04c73A191fE6c2",
		decimals: 18
	},
	{
		symbol: "ASPENCOIN",
		address: "0x95e6737Ef3d4A65535cdFAB02F4DE54d904BeA0b",
		decimals: 0
	},
	{
		symbol: "AST",
		address: "0x27054b13b1B798B345b591a4d22e6562d47eA75a",
		decimals: 4
	},
	{
		symbol: "ASTRO",
		address: "0x7B22938ca841aA392C93dBB7f4c42178E3d65E88",
		decimals: 4
	},
	{
		symbol: "ASTRO",
		address: "0xcbd55D4fFc43467142761A764763652b48b969ff",
		decimals: 18
	},
	{
		symbol: "ASUSD",
		address: "0x625aE63000f46200499120B906716420bd059240",
		decimals: 18
	},
	{
		symbol: "ASY",
		address: "0x017B584AcFD16D767541aE9e80cdc702F4527B0b",
		decimals: 18
	},
	{
		symbol: "AT",
		address: "0xE54B3458C47E44C37a267E7C633AFEF88287C294",
		decimals: 5
	},
	{
		symbol: "AT",
		address: "0xbf8fB919A8bbF28e590852AeF2D284494eBC0657",
		decimals: 18
	},
	{
		symbol: "ATCC",
		address: "0xdDAaf4A0702a03A4505F2352a1abA001fFc344be",
		decimals: 18
	},
	{
		symbol: "ATF",
		address: "0xa55ffAeA5c8cf32B550F663bf17d4F7b739534ff",
		decimals: 18
	},
	{
		symbol: "ATG",
		address: "0x98d0cDe5c3d79531613e18f0912127BF172bd7AA",
		decimals: 18
	},
	{
		symbol: "ATH",
		address: "0x17052d51E954592C1046320c2371AbaB6C73Ef10",
		decimals: 18
	},
	{
		symbol: "ATH",
		address: "0x1543d0F83489e82A1344DF6827B23d541F235A50",
		decimals: 18
	},
	{
		symbol: "ATIC",
		address: "0x81Ea14E770101E2dFA61dF3f38b663084Bb0b7e8",
		decimals: 18
	},
	{
		symbol: "ATIS",
		address: "0x821144518dfE9e7b44fCF4d0824e15e8390d4637",
		decimals: 18
	},
	{
		symbol: "ATL",
		address: "0x78B7FADA55A64dD895D8c8c35779DD8b67fA8a05",
		decimals: 18
	},
	{
		symbol: "ATM",
		address: "0x9B11EFcAAA1890f6eE52C6bB7CF8153aC5d74139",
		decimals: 8
	},
	{
		symbol: "ATMI",
		address: "0x97AEB5066E1A590e868b511457BEb6FE99d329F5",
		decimals: 18
	},
	{
		symbol: "ATN",
		address: "0x461733c17b0755CA5649B6DB08B3E213FCf22546",
		decimals: 18
	},
	{
		symbol: "ATOMBEAR",
		address: "0x3B834A620751A811f65D8f599b3b72617A4418d0",
		decimals: 18
	},
	{
		symbol: "ATOMBULL",
		address: "0x75F0038B8fbfCCAFe2aB9a51431658871bA5182C",
		decimals: 18
	},
	{
		symbol: "ATRI",
		address: "0xdacD69347dE42baBfAEcD09dC88958378780FB62",
		decimals: 0
	},
	{
		symbol: "ATS",
		address: "0x2dAEE1AA61D60A252DC80564499A69802853583A",
		decimals: 4
	},
	{
		symbol: "ATT",
		address: "0x887834D3b8D450B6bAB109c252Df3DA286d73CE4",
		decimals: 18
	},
	{
		symbol: "ATTN",
		address: "0x6339784d9478dA43106A429196772A029C2f177d",
		decimals: 18
	},
	{
		symbol: "ATUSD",
		address: "0x4DA9b813057D04BAef4e5800E36083717b4a0341",
		decimals: 18
	},
	{
		symbol: "ATVI.CX",
		address: "0x02aD2f3c1F761DB2374626aBd8C59ED4E710a13c",
		decimals: 8
	},
	{
		symbol: "ATX",
		address: "0x1A0F2aB46EC630F9FD638029027b552aFA64b94c",
		decimals: 18
	},
	{
		symbol: "AUC",
		address: "0xbeea2890775889c7723E5c0B80527976803b5A99",
		decimals: 18
	},
	{
		symbol: "AUC",
		address: "0xc12d099be31567add4e4e4d0D45691C3F58f5663",
		decimals: 18
	},
	{
		symbol: "AUCTION",
		address: "0xA9B1Eb5908CfC3cdf91F9B8B3a74108598009096",
		decimals: 18
	},
	{
		symbol: "AUDF",
		address: "0xe470a51d750cFf9e74252441b89b625121475049",
		decimals: 6
	},
	{
		symbol: "AUDIO",
		address: "0x18aAA7115705e8be94bfFEBDE57Af9BFc265B998",
		decimals: 18
	},
	{
		symbol: "AUDX",
		address: "0xdf1E9E1a218CFf9888fAEf311d6fBB472E4175Ce",
		decimals: 18
	},
	{
		symbol: "AUPC",
		address: "0x500Df47E1dF0ef06039218dCF0960253D89D6658",
		decimals: 18
	},
	{
		symbol: "AURA",
		address: "0xCdCFc0f66c522Fd086A1b725ea3c0Eeb9F9e8814",
		decimals: 18
	},
	{
		symbol: "AURA",
		address: "0x8b4F0e7dF51A49F18e77132B010a75Ab191B9C97",
		decimals: 2
	},
	{
		symbol: "AUS",
		address: "0x171f9cFc136f2B2aaA148fcC6b660a2029baB048",
		decimals: 4
	},
	{
		symbol: "AUS",
		address: "0x5FB9E9C359CC7191b0293d2FAF1cC41cE3688D75",
		decimals: 4
	},
	{
		symbol: "AUSCM",
		address: "0x1c7BBADc81E18F7177A95eb1593e5f5f35861B10",
		decimals: 18
	},
	{
		symbol: "AUSDC",
		address: "0xBcca60bB61934080951369a648Fb03DF4F96263C",
		decimals: 6
	},
	{
		symbol: "AUSDC",
		address: "0x9bA00D6856a4eDF4665BcA2C2309936572473B7E",
		decimals: 6
	},
	{
		symbol: "AUSDT",
		address: "0x71fc860F7D3A592A4a98740e39dB31d25db65ae8",
		decimals: 6
	},
	{
		symbol: "AUSDT",
		address: "0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811",
		decimals: 6
	},
	{
		symbol: "AUTO",
		address: "0x622dFfCc4e83C64ba959530A5a5580687a57581b",
		decimals: 18
	},
	{
		symbol: "AVA",
		address: "0xeD247980396B10169BB1d36f6e278eD16700a60f",
		decimals: 4
	},
	{
		symbol: "AVH",
		address: "0xd7CDdD45629934c2f6ED3B63217bD8085D7C14A8",
		decimals: 18
	},
	{
		symbol: "AVINOC",
		address: "0xF1cA9cb74685755965c7458528A36934Df52A3EF",
		decimals: 18
	},
	{
		symbol: "AVT",
		address: "0x0d88eD6E74bbFD96B831231638b66C05571e824F",
		decimals: 18
	},
	{
		symbol: "AVT",
		address: "0x3b16fB80Ab6Ac8562203F3913f58ee0c4DFc08B8",
		decimals: 2
	},
	{
		symbol: "AVVP",
		address: "0x783Ba0062326861eE76E0e15429594922e9FE2F5",
		decimals: 18
	},
	{
		symbol: "AVY",
		address: "0x289925d08b07e73DD0dd02D1407C877942215082",
		decimals: 18
	},
	{
		symbol: "AWBTC",
		address: "0xFC4B8ED459e00e5400be803A9BB3954234FD50e3",
		decimals: 8
	},
	{
		symbol: "AWC",
		address: "0xf649c39E7EFdBAC6c9aDb65c43e87894fC14aEDd",
		decimals: 8
	},
	{
		symbol: "AWC",
		address: "0xaD22f63404f7305e4713CcBd4F296f34770513f4",
		decimals: 8
	},
	{
		symbol: "AX1",
		address: "0xCd4b4b0F3284a33AC49C67961EC6e111708318Cf",
		decimals: 5
	},
	{
		symbol: "AXA",
		address: "0xF8Ed6c51762208FF26F8f3E4EFd4e06AF2da649C",
		decimals: 18
	},
	{
		symbol: "AXI",
		address: "0x73EE6D7e6b203125aDd89320E9F343d65ec7c39a",
		decimals: 18
	},
	{
		symbol: "AXIAV3",
		address: "0x793786e2dd4Cc492ed366a94B88a3Ff9ba5E7546",
		decimals: 18
	},
	{
		symbol: "AXIS",
		address: "0xecC0F1F860a82aB3b442382D93853C02d6384389",
		decimals: 18
	},
	{
		symbol: "AXL",
		address: "0x4fAC0ccD9e2ed9fD462D42B66Fb81bA9A1f6F25E",
		decimals: 18
	},
	{
		symbol: "AXN",
		address: "0x304281F3d1023A2039ea930C65F8F721d7C746c8",
		decimals: 18
	},
	{
		symbol: "AXN",
		address: "0xda4C5AEA122260e70616E979592735F12FE20499",
		decimals: 18
	},
	{
		symbol: "AXN",
		address: "0x71F85B2E46976bD21302B64329868fd15eb0D127",
		decimals: 18
	},
	{
		symbol: "AXN",
		address: "0x7D85e23014F84E6E21d5663aCD8751bEF3562352",
		decimals: 18
	},
	{
		symbol: "AXPR",
		address: "0xC39E626A04C5971D770e319760D7926502975e47",
		decimals: 18
	},
	{
		symbol: "AXPR",
		address: "0xdD0020B1D5Ba47A54E2EB16800D73Beb6546f91A",
		decimals: 18
	},
	{
		symbol: "AXS",
		address: "0xF5D669627376EBd411E34b98F19C868c8ABA5ADA",
		decimals: 18
	},
	{
		symbol: "AYFI",
		address: "0x12e51E77DAAA58aA0E9247db7510Ea4B46F9bEAd",
		decimals: 18
	},
	{
		symbol: "AZ",
		address: "0xAAAaaaaBA2ea3daAB0A6c05F1b962c78c9836d99",
		decimals: 18
	},
	{
		symbol: "AZBI",
		address: "0x82f39cD08A942f344CA7E7034461Cc88c2009199",
		decimals: 18
	},
	{
		symbol: "AZBI",
		address: "0x21Efe20be784aC5dA569f72070e64525f95CCAb6",
		decimals: 18
	},
	{
		symbol: "AZRX",
		address: "0x6Fb0855c404E09c47C3fBCA25f08d4E41f9F062f",
		decimals: 18
	},
	{
		symbol: "AZT",
		address: "0xef7f1AAe6f60dE9f353dc170a35B8f7c7814e32B",
		decimals: 18
	},
	{
		symbol: "AZUKI",
		address: "0x910524678C0B1B23FFB9285a81f99C29C11CBaEd",
		decimals: 18
	},
	{
		symbol: "AZUM",
		address: "0xd26a9C3437f7D121098c8C05C7413F5Cc70BB070",
		decimals: 18
	},
	{
		symbol: "B1P",
		address: "0x4B742b5bdb1D252907AE7F399a891d4a178DBC24",
		decimals: 18
	},
	{
		symbol: "B20",
		address: "0xc4De189Abf94c57f396bD4c52ab13b954FebEfD8",
		decimals: 18
	},
	{
		symbol: "B21",
		address: "0x6Faa826aF0568d1866Fca570dA79B318ef114dAb",
		decimals: 18
	},
	{
		symbol: "B2B",
		address: "0x5d51FCceD3114A8bb5E90cDD0f9d682bCbCC5393",
		decimals: 18
	},
	{
		symbol: "BA.CX",
		address: "0x709e68Ccea223A774F7144c1b04B71c8dAD71138",
		decimals: 8
	},
	{
		symbol: "BAAS",
		address: "0x3e65E1eeFdE5Ea7ccfC9a9a1634AbE90f32262f8",
		decimals: 18
	},
	{
		symbol: "BABA",
		address: "0x8EAb2c9fCB31Ad9CD7eCcb48634b849dC9C81af2",
		decimals: 8
	},
	{
		symbol: "BABA.CX",
		address: "0x0fFe606F8a0F13C815Ac5686241ab2bf3C9e5Cff",
		decimals: 8
	},
	{
		symbol: "BAC",
		address: "0x7Dc59729B0adf4ae34721a1e06ef82a19E690b04",
		decimals: 8
	},
	{
		symbol: "BAC",
		address: "0x062e3Be6a7C56A395b1881A0cD69A4923Ade4fa2",
		decimals: 18
	},
	{
		symbol: "BAC",
		address: "0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a",
		decimals: 18
	},
	{
		symbol: "BACON",
		address: "0x175Ab41E2CEDF3919B2e4426C19851223CF51046",
		decimals: 18
	},
	{
		symbol: "BADGER",
		address: "0x3472A5A71965499acd81997a54BBA8D852C6E53d",
		decimals: 18
	},
	{
		symbol: "BAK",
		address: "0x3b5F11dBaC1476af17957C6e5991F21c826743dd",
		decimals: 8
	},
	{
		symbol: "BAL",
		address: "0xba100000625a3754423978a60c9317c58a424e3D",
		decimals: 18
	},
	{
		symbol: "BALO",
		address: "0x6523203BD28d399068AcC14Db6B7f31D9bF43f1a",
		decimals: 18
	},
	{
		symbol: "BALPHA",
		address: "0x7a5ce6abD131EA6B148a022CB76fc180ae3315A6",
		decimals: 18
	},
	{
		symbol: "BAMBOO",
		address: "0xf56842Af3B56Fd72d17cB103f92d027bBa912e89",
		decimals: 18
	},
	{
		symbol: "BANANA",
		address: "0x21F54372c07B930B79c5c2d9bb0EAACa86c3b298",
		decimals: 18
	},
	{
		symbol: "BANCA",
		address: "0x998b3B82bC9dBA173990Be7afb772788B5aCB8Bd",
		decimals: 18
	},
	{
		symbol: "BAND",
		address: "0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55",
		decimals: 18
	},
	{
		symbol: "BANG",
		address: "0x1C9e21A437B9e98a6Bb66c0fF862864523513135",
		decimals: 18
	},
	{
		symbol: "BANK",
		address: "0x24A6A37576377F63f194Caa5F518a60f45b42921",
		decimals: 18
	},
	{
		symbol: "BANK",
		address: "0xfF19A86c938ACDF34F4FC6F5a8567106647c7A8F",
		decimals: 0
	},
	{
		symbol: "BANX",
		address: "0xF87F0D9153fea549c728Ad61cb801595a68b73de",
		decimals: 18
	},
	{
		symbol: "BAO",
		address: "0x374CB8C27130E2c9E04F44303f3c8351B9De61C1",
		decimals: 18
	},
	{
		symbol: "BAR",
		address: "0xc73f2474001aD1D6aEd615aF53631148CF98dE6b",
		decimals: 18
	},
	{
		symbol: "BARIN",
		address: "0x9c2D9bE4bB7352D2eCA65675067F9E6194E597B5",
		decimals: 18
	},
	{
		symbol: "BART",
		address: "0x54C9EA2E9C9E8eD865Db4A4ce6711C2a0d5063Ba",
		decimals: 18
	},
	{
		symbol: "BAS",
		address: "0xa7ED29B253D8B4E3109ce07c80fc570f81B63696",
		decimals: 18
	},
	{
		symbol: "BAS",
		address: "0x2A05d22DB079BC40C2f77a1d1fF703a56E631cc1",
		decimals: 8
	},
	{
		symbol: "BAS",
		address: "0x106538CC16F938776c7c180186975BCA23875287",
		decimals: 18
	},
	{
		symbol: "BASE",
		address: "0x07150e919B4De5fD6a63DE1F9384828396f25fDC",
		decimals: 9
	},
	{
		symbol: "BASIC",
		address: "0xF25c91C87e0B1fd9B4064Af0F427157AaB0193A7",
		decimals: 18
	},
	{
		symbol: "BAST",
		address: "0x47eB79217f42f92dbd741ADd1B1a6783A2c873cf",
		decimals: 18
	},
	{
		symbol: "BAT",
		address: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF",
		decimals: 18
	},
	{
		symbol: "BAX",
		address: "0x9a0242b7a33DAcbe40eDb927834F96eB39f8fBCB",
		decimals: 18
	},
	{
		symbol: "BAXS",
		address: "0xACf3D402e5E2C3eDD5b8129e966017D293F12a4C",
		decimals: 18
	},
	{
		symbol: "BAZT",
		address: "0xB020eD54651831878E5C967e0953A900786178f9",
		decimals: 18
	},
	{
		symbol: "BBA",
		address: "0x73621534d00D80f675B7e868860f97eDb3C03935",
		decimals: 18
	},
	{
		symbol: "BBBY.CX",
		address: "0x29BeD564a9B1361C413a032fCb7Bc196DF8b213E",
		decimals: 8
	},
	{
		symbol: "BBC",
		address: "0xe7D3e4413E29ae35B0893140F4500965c74365e5",
		decimals: 18
	},
	{
		symbol: "BBCH",
		address: "0x85c4EdC43724e954e5849cAAab61A26a9CB65F1B",
		decimals: 8
	},
	{
		symbol: "BBGC",
		address: "0x4FBb0B4cD8f960aC3428194F1c94c805D5b35836",
		decimals: 8
	},
	{
		symbol: "BBI",
		address: "0x37D40510a2F5Bc98AA7a0f7BF4b3453Bcfb90Ac1",
		decimals: 18
	},
	{
		symbol: "BBK",
		address: "0x4a6058666cf1057eaC3CD3A5a614620547559fc9",
		decimals: 18
	},
	{
		symbol: "BBN",
		address: "0x35a69642857083BA2F30bfaB735dacC7F0bac969",
		decimals: 18
	},
	{
		symbol: "BBO",
		address: "0x84F7c44B6Fed1080f647E354D552595be2Cc602F",
		decimals: 18
	},
	{
		symbol: "BBOMB",
		address: "0x252F830448d8890CA06a3FF78823DB8D23587037",
		decimals: 18
	},
	{
		symbol: "BBR",
		address: "0x7671904eed7f10808B664fc30BB8693FD7237abF",
		decimals: 18
	},
	{
		symbol: "BBRA",
		address: "0x70460c3Bb9AbcC0aA51f922c00d37816d6EDe4D7",
		decimals: 18
	},
	{
		symbol: "BBRT",
		address: "0xA897303e3F1Ec585aA0816d1527f9025a37a5905",
		decimals: 2
	},
	{
		symbol: "BBTC",
		address: "0x9BE89D2a4cd102D8Fecc6BF9dA793be995C22541",
		decimals: 8
	},
	{
		symbol: "BBY",
		address: "0xaf5e6afA14a5DE9a48395869F4f887a63F7f755F",
		decimals: 18
	},
	{
		symbol: "BBY.CX",
		address: "0x9C13833483885455bd8767B20f8bD39Fa76fBb9c",
		decimals: 8
	},
	{
		symbol: "BC",
		address: "0x07aF1F10d749e432fed9c5901Dd7D7821267a846",
		decimals: 0
	},
	{
		symbol: "BC",
		address: "0xD73bE539d6B2076BaB83CA6Ba62DfE189aBC6Bbe",
		decimals: 0
	},
	{
		symbol: "BC",
		address: "0x2ecB13A8c458c379c4d9a7259e202De03c8F3D19",
		decimals: 18
	},
	{
		symbol: "BCA",
		address: "0xC222e5B89309FAB5FAf55a3b3bd9082be834916C",
		decimals: 6
	},
	{
		symbol: "BCAP",
		address: "0x1f41E42D0a9e3c0Dd3BA15B527342783B43200A9",
		decimals: 0
	},
	{
		symbol: "BCASH",
		address: "0xb5BB48567BfD0bFE9e4B08EF8b7f91556CC2a112",
		decimals: 18
	},
	{
		symbol: "BCAT",
		address: "0xfDEAA4ab9fea519aFD74df2257A21e5BcA0DFd3f",
		decimals: 18
	},
	{
		symbol: "BCC",
		address: "0xaE17f4F5CA32F77ea8e3786db7C0b2FE877aC176",
		decimals: 18
	},
	{
		symbol: "BCDN",
		address: "0x1e797Ce986C3CFF4472F7D38d5C4aba55DfEFE40",
		decimals: 15
	},
	{
		symbol: "BCDT",
		address: "0xAcfa209Fb73bF3Dd5bBfb1101B9Bc999C49062a5",
		decimals: 18
	},
	{
		symbol: "BCEO",
		address: "0x19cA83a13b4C4BE43FA82c5E415E16f1D86f57F7",
		decimals: 18
	},
	{
		symbol: "BCG",
		address: "0xd24e56f02Ee723a443575836b9668587ffd6204F",
		decimals: 18
	},
	{
		symbol: "BCHBEAR",
		address: "0xa9fC65Da36064cE545e87690e06f5de10C52C690",
		decimals: 18
	},
	{
		symbol: "BCHBULL",
		address: "0x4C133E081dFB5858e39ccA74E69bf603d409e57A",
		decimals: 18
	},
	{
		symbol: "BCHC",
		address: "0x2ab05B915C30093679165bcdba9C26D8Cd8BeE99",
		decimals: 18
	},
	{
		symbol: "BCHDOOM",
		address: "0x2E185eF6684d2D0fE9D311782E0ef738d63861E0",
		decimals: 18
	},
	{
		symbol: "BCHHEDGE",
		address: "0x02E88a689fdfB920e7Aa6174Fb7AB72add3C5694",
		decimals: 18
	},
	{
		symbol: "BCHIP",
		address: "0x5eF227F7cE4e96c9Ce90E32D4850545a6C5D099B",
		decimals: 8
	},
	{
		symbol: "BCHMOON",
		address: "0x9003ce9E92e1105f235CA59e2BF65ABD36dFdC01",
		decimals: 18
	},
	{
		symbol: "BCHNRBTC-JAN-2021",
		address: "0x506De580eCDBa535EB0a7E61d3fA3Dd8F7c8B6b9",
		decimals: 18
	},
	{
		symbol: "BCL",
		address: "0xbc1234552EBea32B5121190356bBa6D3Bb225bb5",
		decimals: 18
	},
	{
		symbol: "BCMC1",
		address: "0xD5e2A54Fef5f9E4A6b21EC646Bbed7A160a00F18",
		decimals: 18
	},
	{
		symbol: "BCNT",
		address: "0x9669890e48f330ACD88b78D63E1A6b3482652CD9",
		decimals: 18
	},
	{
		symbol: "BCO",
		address: "0x865D176351f287fE1B0010805b110d08699C200A",
		decimals: 8
	},
	{
		symbol: "BCP",
		address: "0xd26fb114401Ec86887CD09F62eccd95fCf20B571",
		decimals: 8
	},
	{
		symbol: "BCP",
		address: "0x72e203a17adD19A3099137c9d7015fD3e2b7DBa9",
		decimals: 18
	},
	{
		symbol: "BCP",
		address: "0xE4f726Adc8e89C6a6017F01eadA77865dB22dA14",
		decimals: 18
	},
	{
		symbol: "BCPT",
		address: "0x1c4481750daa5Ff521A2a7490d9981eD46465Dbd",
		decimals: 18
	},
	{
		symbol: "BCS",
		address: "0x03066dA434e5264ef0B32f787923f974A5726fDc",
		decimals: 18
	},
	{
		symbol: "BCS",
		address: "0x31274db8b609Df99E5988ee527071643b5160Fc3",
		decimals: 18
	},
	{
		symbol: "BCST",
		address: "0xeFCAfD4A1e76d392d683d4A79cD0E4a751d0BE75",
		decimals: 8
	},
	{
		symbol: "BCT",
		address: "0xf5839F46Ed000d70cbab1FCD03E29E85F3aecD82",
		decimals: 18
	},
	{
		symbol: "BCT",
		address: "0x9eC251401eAfB7e98f37A1D911c0AEA02CB63A80",
		decimals: 18
	},
	{
		symbol: "BCT",
		address: "0xf0667d12278A5f0519aAa01d91E94D94f7AB0f4d",
		decimals: 18
	},
	{
		symbol: "BCTR",
		address: "0x579353231F3540B218239774422962C64a3693e7",
		decimals: 18
	},
	{
		symbol: "BCURVE",
		address: "0x3B3Ac5386837Dc563660FB6a0937DFAa5924333B",
		decimals: 18
	},
	{
		symbol: "BCV",
		address: "0x1014613E2B3CBc4d575054D4982E580d9b99d7B1",
		decimals: 8
	},
	{
		symbol: "BCZ",
		address: "0x08399ab5eBBE96870B289754A7bD21E7EC8c6FCb",
		decimals: 18
	},
	{
		symbol: "BCZERO",
		address: "0xD45247c07379d94904E0A87b4481F0a1DDfa0C64",
		decimals: 18
	},
	{
		symbol: "BDB",
		address: "0xb693364be3576eC59a1867D23F32362382f762AC",
		decimals: 5
	},
	{
		symbol: "BDC",
		address: "0x83Dc1a0f90bbc5c90d5cCc9c254bF164De4d9DDE",
		decimals: 18
	},
	{
		symbol: "BDCC",
		address: "0xC87F95aA269DD300D9F1cE49d8E1FD8119A10456",
		decimals: 18
	},
	{
		symbol: "BDG",
		address: "0x1961B3331969eD52770751fC718ef530838b6dEE",
		decimals: 18
	},
	{
		symbol: "BDI",
		address: "0x0309c98B1bffA350bcb3F9fB9780970CA32a5060",
		decimals: 18
	},
	{
		symbol: "BDK",
		address: "0xBFc1502EBC37475B940CED8F036B91018a73C8F6",
		decimals: 18
	},
	{
		symbol: "BDOT",
		address: "0x7884F51dC1410387371ce61747CB6264E1dAeE0B",
		decimals: 10
	},
	{
		symbol: "BDP",
		address: "0x593114f03A0A575aece9ED675e52Ed68D2172B8c",
		decimals: 18
	},
	{
		symbol: "BDP",
		address: "0xf3dcbc6D72a4E1892f7917b7C43b74131Df8480e",
		decimals: 18
	},
	{
		symbol: "BDT",
		address: "0x4Efe8665e564bF454cCF5C90Ee16817F7485d5Cf",
		decimals: 18
	},
	{
		symbol: "BDX",
		address: "0xC87412535beC14FE79497914Dc5886fb0a163123",
		decimals: 18
	},
	{
		symbol: "BEAR",
		address: "0x016ee7373248a80BDe1fD6bAA001311d233b3CFa",
		decimals: 18
	},
	{
		symbol: "BEARSHIT",
		address: "0x48dEE19C81B89A9aB473361bAE7a19210f2DEaA4",
		decimals: 18
	},
	{
		symbol: "BEAST",
		address: "0xdBB2F12CB89Af05516768C2c69A771D92A25D17c",
		decimals: 18
	},
	{
		symbol: "BEAT",
		address: "0x2Fb12bccF6f5Dd338b76Be784A93ade072425690",
		decimals: 18
	},
	{
		symbol: "BEC",
		address: "0xC5d105E63711398aF9bbff092d4B6769C82F793D",
		decimals: 18
	},
	{
		symbol: "BEE",
		address: "0x4D8fc1453a0F359e99c9675954e656D80d996FbF",
		decimals: 18
	},
	{
		symbol: "BeerCoin",
		address: "0x74C1E4b8caE59269ec1D85D3D4F324396048F4ac",
		decimals: 0
	},
	{
		symbol: "BEFX",
		address: "0xB91C2a2b953D72f3EF890490669a0A41B0ADD5f7",
		decimals: 8
	},
	{
		symbol: "BEFX",
		address: "0xFBcECb002177e530695B8976638fBd18d2038C3C",
		decimals: 8
	},
	{
		symbol: "BEL",
		address: "0xA91ac63D040dEB1b7A5E4d4134aD23eb0ba07e14",
		decimals: 18
	},
	{
		symbol: "BEL",
		address: "0xE79A9BC076523660C7393D5576700D922f7dceA5",
		decimals: 8
	},
	{
		symbol: "BELA",
		address: "0x2e98A6804E4b6c832ED0ca876a943abD3400b224",
		decimals: 18
	},
	{
		symbol: "BENZI",
		address: "0x5B202F04786E6e9c0a689b1506aF229f095d2d0E",
		decimals: 18
	},
	{
		symbol: "BEP",
		address: "0xd8ef149B4E1e8F050d52925F9C68D3a296E77227",
		decimals: 18
	},
	{
		symbol: "BEPRO",
		address: "0xCF3C8Be2e2C42331Da80EF210e9B1b307C03d36A",
		decimals: 18
	},
	{
		symbol: "BEPRO",
		address: "0x786001c9c5CA6E502dEB8a8a72480d2147891f32",
		decimals: 18
	},
	{
		symbol: "BERRY",
		address: "0x6aEB95F06CDA84cA345c2dE0F3B7f96923a44f4c",
		decimals: 14
	},
	{
		symbol: "BEST",
		address: "0x1B073382E63411E3BcfFE90aC1B9A43feFa1Ec6F",
		decimals: 8
	},
	{
		symbol: "BET",
		address: "0x8aA33A7899FCC8eA5fBe6A608A109c3893A1B8b2",
		decimals: 18
	},
	{
		symbol: "BETHER",
		address: "0x14C926F2290044B647e1Bf2072e67B495eff1905",
		decimals: 18
	},
	{
		symbol: "BETR",
		address: "0x763186eB8d4856D536eD4478302971214FEbc6A9",
		decimals: 18
	},
	{
		symbol: "BEZ",
		address: "0x3839d8ba312751Aa0248fEd6a8bACB84308E20Ed",
		decimals: 18
	},
	{
		symbol: "BF",
		address: "0x5b71BEE9D961b1B848f8485EEC8d8787f80217F5",
		decimals: 18
	},
	{
		symbol: "BFC",
		address: "0x0c7D5ae016f806603CB1782bEa29AC69471CAb9c",
		decimals: 18
	},
	{
		symbol: "BFC",
		address: "0x4d31200e6D7854C2F664aF7Fc38a21600960F74D",
		decimals: 18
	},
	{
		symbol: "BFFI",
		address: "0x479a315BdafDa5e7e66C7AeEF228477A0535A2Ef",
		decimals: 18
	},
	{
		symbol: "BFI",
		address: "0xC980be019F2ac10A1C96F964b971A5F44551D318",
		decimals: 18
	},
	{
		symbol: "BFI",
		address: "0x2b2b0559081c41e962777B5049632fdb30f7E652",
		decimals: 8
	},
	{
		symbol: "BFIL",
		address: "0x8E16bf47065Fe843A82f4399bAF5aBac4E0822B7",
		decimals: 18
	},
	{
		symbol: "BFT",
		address: "0x3779D960261f882750B39C622527822C88c98e13",
		decimals: 18
	},
	{
		symbol: "BFT",
		address: "0x01fF50f8b7f74E4f00580d9596cd3D0d6d6E326f",
		decimals: 18
	},
	{
		symbol: "BGBP",
		address: "0xC9a2C4868F0f96fAaa739b59934Dc9cB304112ec",
		decimals: 8
	},
	{
		symbol: "BGC",
		address: "0x0a5248fF74842600175c3Edd7c84cD45257fF0d0",
		decimals: 18
	},
	{
		symbol: "BGF",
		address: "0xA8DaA52DEd91F7C82b4BB02B4b87c6a841Db1fD5",
		decimals: 8
	},
	{
		symbol: "BGG",
		address: "0xEA54C81fe0f72DE8e86B6dC78a9271AA3925E3B5",
		decimals: 18
	},
	{
		symbol: "BGT",
		address: "0x5cBb89B03534D82692b183882c2A2a9Ff7FDeB44",
		decimals: 18
	},
	{
		symbol: "BGTT",
		address: "0x7a545Ed3863221A974F327199Ac22F7f12535F11",
		decimals: 18
	},
	{
		symbol: "BHG",
		address: "0x856E19b3ce92dde6892290c48204aAdE2f9C3eA0",
		decimals: 8
	},
	{
		symbol: "BHI",
		address: "0xd52a7503051DeAAd31A7A8B49b4685e3058EED91",
		decimals: 18
	},
	{
		symbol: "BHIG",
		address: "0x996229D0c6a485c7F4B52E092EAa907cB2def5C6",
		decimals: 18
	},
	{
		symbol: "BHOT",
		address: "0x318D4410D824dbFdCAc8c49D21e1EDAF4E4931DC",
		decimals: 8
	},
	{
		symbol: "BHPC",
		address: "0xEE74110fB5A1007b06282e0DE5d73A61bf41d9Cd",
		decimals: 18
	},
	{
		symbol: "BHR",
		address: "0xfe5D908c9Ad85f651185dAa6a4770726E2b27d09",
		decimals: 18
	},
	{
		symbol: "BHSC",
		address: "0x35101c731b1548B5e48bb23F99eDBc2f5c341935",
		decimals: 18
	},
	{
		symbol: "BHT",
		address: "0xa4FB385820A9eEF842a419e08F8540Fd7D1BF6e8",
		decimals: 5
	},
	{
		symbol: "BHT",
		address: "0xFC29B6e626B67776675FfF55d5BC0452d042F434",
		decimals: 18
	},
	{
		symbol: "BHTX",
		address: "0xb0ca787F8cF38F077e8201B05378DA230A8b462F",
		decimals: 18
	},
	{
		symbol: "BHY",
		address: "0x48ac44f4E29e602f851B84C271c22B85B9447251",
		decimals: 18
	},
	{
		symbol: "BI",
		address: "0x5b5bB9765eff8D26c24B9FF0DAa09838a3Cd78E9",
		decimals: 4
	},
	{
		symbol: "BIA",
		address: "0x40d52577830E01aAEfa80659aA90ee8B34685F4e",
		decimals: 18
	},
	{
		symbol: "BICAS",
		address: "0xa7d10fF962edA41F3b037e3AF1D8B4037EbA4b86",
		decimals: 18
	},
	{
		symbol: "BID",
		address: "0x811817A87f9b9C00621d6A1A9A3cF8cCf10f4e7f",
		decimals: 18
	},
	{
		symbol: "BID",
		address: "0x1dA01e84F3d4e6716F274c987Ae4bEE5DC3C8288",
		decimals: 18
	},
	{
		symbol: "BID",
		address: "0x25e1474170c4c0aA64fa98123bdc8dB49D7802fa",
		decimals: 18
	},
	{
		symbol: "BID",
		address: "0xf5E7f08C91b5d8579746EaAd70ac509E94e2f1d3",
		decimals: 18
	},
	{
		symbol: "BIDS",
		address: "0x912B38134F395D1BFAb4C6F9db632C31667ACF98",
		decimals: 18
	},
	{
		symbol: "BIDU.CX",
		address: "0xafc21be9E4d9303D51a61CC5a236619e65E873d9",
		decimals: 8
	},
	{
		symbol: "BIG.CX",
		address: "0xF46490AAf79daD46682468cC3e6ECa0372EED8dc",
		decimals: 8
	},
	{
		symbol: "BIGB",
		address: "0x91Bd140BF6656228583CE1Bb7c04f32609625644",
		decimals: 18
	},
	{
		symbol: "BIGO",
		address: "0xa6E7dc135Bdf4b3FEe7183EAB2E87C0BB9684783",
		decimals: 8
	},
	{
		symbol: "BIIB.CX",
		address: "0x50C77402380cCe836CF5515eaB44ECAD1a5E0d0A",
		decimals: 8
	},
	{
		symbol: "BIIDR",
		address: "0xF647902282cd054a74d036d986EFD8bB4ac36C9C",
		decimals: 18
	},
	{
		symbol: "BIKI",
		address: "0x70debcDAB2Ef20bE3d1dBFf6a845E9cCb6E46930",
		decimals: 8
	},
	{
		symbol: "BILI.CX",
		address: "0x52aB3e06a566aECb7559aBA03a0228F416bD7B26",
		decimals: 8
	},
	{
		symbol: "BILL.CX",
		address: "0xE60573EEe9dAFf7A1AB1540B81B08cF2a3D51611",
		decimals: 8
	},
	{
		symbol: "BIM",
		address: "0x9e7Ce36dbD1A9A6c6e80D08E38077745855eDd3A",
		decimals: 18
	},
	{
		symbol: "BINS",
		address: "0x1C9DB47EE8Abad20D28f9bBE2363Ca0C8c9ab9B8",
		decimals: 8
	},
	{
		symbol: "BIO",
		address: "0xf18432Ef894Ef4b2a5726F933718F5A8cf9fF831",
		decimals: 8
	},
	{
		symbol: "BION",
		address: "0x9b1b1e109fF130b298CF1d47389C47569F5C2932",
		decimals: 18
	},
	{
		symbol: "BIRD",
		address: "0x026e62dDEd1a6aD07D93D39f96b9eabd59665e0d",
		decimals: 18
	},
	{
		symbol: "BIT",
		address: "0x089B85FA15f72c1088CBbef23a49DB80B91DD521",
		decimals: 8
	},
	{
		symbol: "BIT",
		address: "0x47da42696A866CDC61A4C809A515500a242909C1",
		decimals: 18
	},
	{
		symbol: "BITB",
		address: "0x0A2a86bb0BeE386a11291d5D01E89cDFB565df5D",
		decimals: 0
	},
	{
		symbol: "BITC",
		address: "0x60b4B0C6a1c518be1f7F68a8ceD6af510Fd21b4B",
		decimals: 18
	},
	{
		symbol: "BITCAR",
		address: "0x08b4c866aE9D1bE56a06e0C302054B4FFe067b43",
		decimals: 8
	},
	{
		symbol: "BITH",
		address: "0x8811e4Dd5EC5Eb8764b97CC814B1339089717adA",
		decimals: 8
	},
	{
		symbol: "BITN",
		address: "0x41ad4093349C8A60DE591A3C37dcd184558EaAe3",
		decimals: 18
	},
	{
		symbol: "BITO",
		address: "0x93b1E78a3e652cd2e71C4a767595B77282344932",
		decimals: 18
	},
	{
		symbol: "BITOX",
		address: "0xbDda280Ee7bcCC68F3be60a369b6B1eAee02493C",
		decimals: 18
	},
	{
		symbol: "BITS",
		address: "0xC38f1fb49acDf2f1213CAf3319F6Eb3ea2cB7527",
		decimals: 18
	},
	{
		symbol: "BITTO",
		address: "0x55a290f08Bb4CAe8DcF1Ea5635A3FCfd4Da60456",
		decimals: 18
	},
	{
		symbol: "BITTO",
		address: "0xa101E27f06A97985B925E244111b61560Ecd97DB",
		decimals: 18
	},
	{
		symbol: "BITW",
		address: "0x148FaBFE726359fA8eB5D72EB270773E3F5c507d",
		decimals: 18
	},
	{
		symbol: "BITX",
		address: "0xff2b3353c3015E9f1FBF95B9Bda23F58Aa7cE007",
		decimals: 18
	},
	{
		symbol: "BITX",
		address: "0xA0eD4C4AcbF07C03365d6bbE28150a819AFf700F",
		decimals: 18
	},
	{
		symbol: "BIX",
		address: "0xb3104b4B9Da82025E8b9F8Fb28b3553ce2f67069",
		decimals: 18
	},
	{
		symbol: "BIX1901",
		address: "0xcb1FC914CF9b7ce568aB289ea126707C15e36047",
		decimals: 18
	},
	{
		symbol: "BIXCPRO",
		address: "0x3E9e371f8d2E9fCA315fB0A747533cEd8A3FCbCb",
		decimals: 4
	},
	{
		symbol: "BIZ",
		address: "0x399f9A95305114efAcB91d1d6C02CBe234dD36aF",
		decimals: 18
	},
	{
		symbol: "BIZZ",
		address: "0x7A8Ca2f815A260660158a38C34ca321A3605eCFE",
		decimals: 8
	},
	{
		symbol: "BKB",
		address: "0x5c39bC68e58a242A624E4FC96be77A383C52002D",
		decimals: 18
	},
	{
		symbol: "BKB",
		address: "0x7F373d989dF0709273E18769300Ef1177D333799",
		decimals: 18
	},
	{
		symbol: "BKB",
		address: "0xB2Bfeb70B903F1BAaC7f2ba2c62934C7e5B974C4",
		decimals: 8
	},
	{
		symbol: "BKBT",
		address: "0x6A27348483D59150aE76eF4C0f3622A78B0cA698",
		decimals: 18
	},
	{
		symbol: "BKC",
		address: "0x09cB097356fD053F8544aBfa2C8A9D4fb2200d62",
		decimals: 18
	},
	{
		symbol: "BKC",
		address: "0xc88Be04c809856B75E3DfE19eB4dCf0a3B15317a",
		decimals: 8
	},
	{
		symbol: "BKC",
		address: "0x34bdf48A8F753de4822a6CFB1FEE275F9b4D662e",
		decimals: 18
	},
	{
		symbol: "BKF",
		address: "0x2255dD4Df9b6692fdff39f2924AaA679717b168c",
		decimals: 18
	},
	{
		symbol: "BKKG",
		address: "0x8AF22fBDeFe01b4dC7960EC04Ec73e8502F4a6B0",
		decimals: 8
	},
	{
		symbol: "BKN",
		address: "0xBeE6EDF5fa7e862ed2eA9b9f42cb0849184aAE85",
		decimals: 0
	},
	{
		symbol: "BKRX",
		address: "0x3cf9E0c385a5ABEC9FD2a71790AA344C4e8E3570",
		decimals: 18
	},
	{
		symbol: "BKU",
		address: "0x60b5aA3334185D72EEd79aC5ffC9870e98F502eb",
		decimals: 18
	},
	{
		symbol: "BKX",
		address: "0x45245bc59219eeaAF6cD3f382e078A461FF9De7B",
		decimals: 18
	},
	{
		symbol: "BLANK",
		address: "0xAec7e1f531Bb09115103C53ba76829910Ec48966",
		decimals: 18
	},
	{
		symbol: "BLCC",
		address: "0x3F2d8861e8Ca9A7649d211dbaA3f3d998C6a254a",
		decimals: 18
	},
	{
		symbol: "BLCT",
		address: "0x6d2C508fc4a588A41713Ff59212F85489291d244",
		decimals: 18
	},
	{
		symbol: "BLES",
		address: "0xE796d6ca1ceb1b022EcE5296226BF784110031Cd",
		decimals: 18
	},
	{
		symbol: "BLINK",
		address: "0x42BEdD647E387daBeC65A7dc3A3bAbCc68BB664d",
		decimals: 18
	},
	{
		symbol: "BLL",
		address: "0xc7088fAc73c55bfaE5c2A963C3029B072c7dfF25",
		decimals: 18
	},
	{
		symbol: "BLM",
		address: "0x7CcA27E4Ec9e448350db3F7671759d668737d906",
		decimals: 0
	},
	{
		symbol: "BLN",
		address: "0xCA29db4221c111888a7e80b12eAc8a266Da3Ee0d",
		decimals: 18
	},
	{
		symbol: "BLO",
		address: "0x1C3BB10dE15C31D5DBE48fbB7B87735d1B7d8c32",
		decimals: 18
	},
	{
		symbol: "BLOAP",
		address: "0xe6404a4472E5222b440F8faFb795553046000841",
		decimals: 18
	},
	{
		symbol: "BLOC",
		address: "0x6F919D67967a97EA36195A2346d9244E60FE0dDB",
		decimals: 18
	},
	{
		symbol: "BLT",
		address: "0x107c4504cd79C5d2696Ea0030a8dD4e92601B82e",
		decimals: 18
	},
	{
		symbol: "BLT1",
		address: "0x28317D822b6AC5A9f5B374536Eb157E3f424c8D0",
		decimals: 18
	},
	{
		symbol: "BLTV",
		address: "0xe08854b668958657064fa20f309F6BA7a19D5Af2",
		decimals: 18
	},
	{
		symbol: "BLUE",
		address: "0x539EfE69bCDd21a83eFD9122571a64CC25e0282b",
		decimals: 8
	},
	{
		symbol: "BLUE.CX",
		address: "0x16D1B0C11A2eD71Ea430c3dc1201f66444531536",
		decimals: 8
	},
	{
		symbol: "BLV",
		address: "0x8DA25B8eD753a5910013167945A676921e864436",
		decimals: 18
	},
	{
		symbol: "BLVD",
		address: "0x3afe25a2739B5C2E08CFec439F9621D91Ff7FBFb",
		decimals: 18
	},
	{
		symbol: "BLVR",
		address: "0xD1ef9a7310D0806855C672288EF5a1BAB62ceF33",
		decimals: 18
	},
	{
		symbol: "BLX",
		address: "0xE5a7c12972f3bbFe70ed29521C8949b8Af6a0970",
		decimals: 18
	},
	{
		symbol: "BLX",
		address: "0xcE59d29b09aAE565fEEEf8E52f47c3CD5368C663",
		decimals: 18
	},
	{
		symbol: "BLY",
		address: "0xf8aD7dFe656188A23e89da09506Adf7ad9290D5d",
		decimals: 18
	},
	{
		symbol: "BLZ",
		address: "0x5732046A883704404F284Ce41FfADd5b007FD668",
		decimals: 18
	},
	{
		symbol: "BM",
		address: "0xE2fe5E7E206e7B46CAd6A5146320e5b4b9A18E97",
		decimals: 2
	},
	{
		symbol: "BMAX",
		address: "0x135BACD9261b9b5D2aAe6645168fEE45d8E57547",
		decimals: 18
	},
	{
		symbol: "BMC",
		address: "0xd945d2031b4C63C0E363304FB771F709b502DC0a",
		decimals: 18
	},
	{
		symbol: "BMC",
		address: "0xDf6Ef343350780BF8C3410BF062e0C015B1DD671",
		decimals: 8
	},
	{
		symbol: "BMH",
		address: "0xF03045a4C8077e38f3B8e2Ed33b8aEE69edF869F",
		decimals: 18
	},
	{
		symbol: "BMI",
		address: "0x725C263e32c72dDC3A19bEa12C5a0479a81eE688",
		decimals: 18
	},
	{
		symbol: "BMJ",
		address: "0x25ce333B325F02C9720Da526A01b5F5be889b4e3",
		decimals: 18
	},
	{
		symbol: "BMJ",
		address: "0x5913D0F34615923552ee913DBe809F9F348e706E",
		decimals: 18
	},
	{
		symbol: "BMP",
		address: "0x01b23286FF60a543ec29366aE8D6B6274cA20541",
		decimals: 18
	},
	{
		symbol: "BMRN.CX",
		address: "0x8BD18C6FBE72Ada40f54d5921DfD5454a6d548a9",
		decimals: 8
	},
	{
		symbol: "BMT",
		address: "0x86c2752F8fe2C6679A942C8Ee6C785C28F42cd55",
		decimals: 18
	},
	{
		symbol: "BMT",
		address: "0xf028ADEe51533b1B47BEaa890fEb54a457f51E89",
		decimals: 18
	},
	{
		symbol: "BMT",
		address: "0xc6363C1a05f840bE2d185d7084b28Af84C543d40",
		decimals: 18
	},
	{
		symbol: "BMT",
		address: "0xf205D2D65205711B6f6AAe3FCb7EbdBC8573f192",
		decimals: 18
	},
	{
		symbol: "BMW.CX",
		address: "0xE8E29fa0E8B21f6791ad9F65347d806D4f47D063",
		decimals: 8
	},
	{
		symbol: "BMX",
		address: "0x986EE2B944c42D017F52Af21c4c69B84DBeA35d8",
		decimals: 18
	},
	{
		symbol: "BMX",
		address: "0x138D02c0C59C6d6ac480218e5585cD97f54E3516",
		decimals: 18
	},
	{
		symbol: "BNA",
		address: "0x20910e5b5f087f6439DFcB0ddA4e27d1014Ac2b8",
		decimals: 18
	},
	{
		symbol: "BNANA",
		address: "0x07eF9E82721AC16809D24DAfBE1792Ce01654DB4",
		decimals: 18
	},
	{
		symbol: "BNB",
		address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
		decimals: 18
	},
	{
		symbol: "BNBBEAR",
		address: "0x6FeBdFC0A9d9502C45343fCE0dF08828dEF44795",
		decimals: 18
	},
	{
		symbol: "BNBBULL",
		address: "0x9D1a62c2AD99019768b9126fdA004a9952853F6E",
		decimals: 18
	},
	{
		symbol: "BNBDOOM",
		address: "0xc8e69913c0ea5d45bF67E52412eb8Bcab5b9875E",
		decimals: 18
	},
	{
		symbol: "BNBHEDGE",
		address: "0x2840aD41cf25Ad58303Ba24C416E79dCe4161b4F",
		decimals: 18
	},
	{
		symbol: "BNBMOON",
		address: "0x7a5Ce2B56dC00Cb7b369Ad2e1b3309ABdc145Bef",
		decimals: 18
	},
	{
		symbol: "BNC",
		address: "0xbe5b336eF62D1626940363Cf34bE079e0AB89F20",
		decimals: 18
	},
	{
		symbol: "BNC",
		address: "0xdD6Bf56CA2ada24c683FAC50E37783e55B57AF9F",
		decimals: 12
	},
	{
		symbol: "BNC",
		address: "0xEf51c9377FeB29856E61625cAf9390bD0B67eA18",
		decimals: 8
	},
	{
		symbol: "BNF",
		address: "0x1DE5e000C41C8d35b9f1f4985C23988f05831057",
		decimals: 18
	},
	{
		symbol: "BNFI",
		address: "0x68e0A48d3BfF6633a31d1D100b70F93C3859218B",
		decimals: 18
	},
	{
		symbol: "BNFT",
		address: "0xdA2C424Fc98c741c2d4ef2f42897CEfed897CA75",
		decimals: 9
	},
	{
		symbol: "BNK",
		address: "0xC80c5E40220172B36aDee2c951f26F2a577810C5",
		decimals: 8
	},
	{
		symbol: "BNN",
		address: "0xDA80B20038BDF968C7307BB5907A469482CF6251",
		decimals: 8
	},
	{
		symbol: "BNP",
		address: "0xD27D76A1bA55ce5C0291CCd04feBBe793D22ebF4",
		decimals: 18
	},
	{
		symbol: "BNSD",
		address: "0x668DbF100635f593A3847c0bDaF21f0a09380188",
		decimals: 18
	},
	{
		symbol: "BNT",
		address: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
		decimals: 18
	},
	{
		symbol: "BNT",
		address: "0x4c09Ba2A7e6C0acbda559E60B8Cd5d651B56436c",
		decimals: 18
	},
	{
		symbol: "BNTE",
		address: "0x3ccb1FE6d628444fb1C823A3eE3573Ed0a21F338",
		decimals: 18
	},
	{
		symbol: "BNTX",
		address: "0x499f434458F62a1e76974fCe5eFcE9DD6B31D4f2",
		decimals: 8
	},
	{
		symbol: "BNTX.CX",
		address: "0xc9ffA1FA580Ac40525DbF1DdF06b9B6E5c3c9657",
		decimals: 8
	},
	{
		symbol: "BNTY",
		address: "0xd2d6158683aeE4Cc838067727209a0aAF4359de3",
		decimals: 18
	},
	{
		symbol: "BNW",
		address: "0xF52B2237418f59e4AE3184D8cD7780c9B2f11B36",
		decimals: 8
	},
	{
		symbol: "BNX",
		address: "0x40C836982788dca47D11024b1fa3e01FD4661766",
		decimals: 18
	},
	{
		symbol: "BNZ",
		address: "0x014A543f767B3B06E31A811b0A75483Ee8dFd72D",
		decimals: 18
	},
	{
		symbol: "BOA",
		address: "0x746DdA2ea243400D5a63e0700F190aB79f06489e",
		decimals: 7
	},
	{
		symbol: "BOA",
		address: "0xfb6bEcd99282d7CA14D0890F3e4F073D9Dd522e9",
		decimals: 8
	},
	{
		symbol: "BOA",
		address: "0xF9c36C7aD7FA0f0862589c919830268d1A2581A1",
		decimals: 18
	},
	{
		symbol: "BOB",
		address: "0xDF347911910b6c9A4286bA8E2EE5ea4a39eB2134",
		decimals: 18
	},
	{
		symbol: "BOC",
		address: "0x4b317864a05c91225ab8f401EC7be0AeB87e9c12",
		decimals: 18
	},
	{
		symbol: "BOCBP",
		address: "0xc39835d32428728cbDe6903f84c76750976C0323",
		decimals: 18
	},
	{
		symbol: "BOE",
		address: "0x970E035E2a013cf4bECD67E300d65BC32A56D826",
		decimals: 8
	},
	{
		symbol: "BOK",
		address: "0x27C743954bCe1Bfaef8bcbD685527531001D88D7",
		decimals: 18
	},
	{
		symbol: "BOL",
		address: "0xEfE98765Da3824eF4a5358bA798cec87c13D8C62",
		decimals: 18
	},
	{
		symbol: "BOLD",
		address: "0x2d4de3C744D43CF77CB12399921FAF0D78b7415b",
		decimals: 18
	},
	{
		symbol: "BOLT",
		address: "0x9F235D23354857EfE6c541dB92a9eF1877689BCB",
		decimals: 18
	},
	{
		symbol: "BOLT",
		address: "0xD5930C307d7395Ff807F2921F12C5EB82131a789",
		decimals: 18
	},
	{
		symbol: "BOLTT",
		address: "0xbB340A2eaF55C5e67a5A05FE5cEed9B9702d76f4",
		decimals: 8
	},
	{
		symbol: "BOMB",
		address: "0x1C95b093d6C236d3EF7c796fE33f9CC6b8606714",
		decimals: 0
	},
	{
		symbol: "BON",
		address: "0xCc34366E3842cA1BD36c1f324d15257960fCC801",
		decimals: 18
	},
	{
		symbol: "BOND",
		address: "0x5Dc02Ea99285E17656b8350722694c35154DB1E8",
		decimals: 8
	},
	{
		symbol: "BOND",
		address: "0x0391D2021f89DC339F60Fff84546EA23E337750f",
		decimals: 18
	},
	{
		symbol: "BONDLY",
		address: "0xD2dDa223b2617cB616c1580db421e4cFAe6a8a85",
		decimals: 18
	},
	{
		symbol: "BONE",
		address: "0x5C84bc60a796534bfeC3439Af0E6dB616A966335",
		decimals: 18
	},
	{
		symbol: "BONK",
		address: "0x6D6506E6F438edE269877a0A720026559110B7d5",
		decimals: 18
	},
	{
		symbol: "BOOB",
		address: "0xa9C44135B3a87E0688c41CF8C27939A22dD437c9",
		decimals: 18
	},
	{
		symbol: "BOOL",
		address: "0x6C929cdE908481F3d1D775008791F42B1B89DBB0",
		decimals: 18
	},
	{
		symbol: "BOOM",
		address: "0xDB7Eab9bA6be88B869F738f6DEeBa96d49Fe13fd",
		decimals: 18
	},
	{
		symbol: "BOOM",
		address: "0x973b569b1d025C41cD9c19cbf8f931175e874DD0",
		decimals: 8
	},
	{
		symbol: "BOON",
		address: "0xe83E098eedb43B33d340d4757529E5A2c4eE3230",
		decimals: 18
	},
	{
		symbol: "BOOST",
		address: "0x3e780920601D61cEdb860fe9c4a90c9EA6A35E78",
		decimals: 18
	},
	{
		symbol: "BOP",
		address: "0x7F1E2C7d6A69bf34824D72C53B4550E895C0D8C2",
		decimals: 8
	},
	{
		symbol: "BOR",
		address: "0x3c9d6c1C73b31c837832c72E04D3152f051fc1A9",
		decimals: 18
	},
	{
		symbol: "BORA",
		address: "0x26fb86579e371c7AEdc461b2DdEF0A8628c93d3B",
		decimals: 18
	},
	{
		symbol: "BOST",
		address: "0xDfB903f323CCcD364B3491D9e45b92854beA29d5",
		decimals: 18
	},
	{
		symbol: "BOT",
		address: "0x5bEaBAEBB3146685Dd74176f68a0721F91297D37",
		decimals: 18
	},
	{
		symbol: "BOTX",
		address: "0xEF19F4E48830093Ce5bC8b3Ff7f903A0AE3E9Fa1",
		decimals: 18
	},
	{
		symbol: "BOU",
		address: "0xC2C63F23ec5E97efbD7565dF9Ec764FDc7d4e91d",
		decimals: 18
	},
	{
		symbol: "BOUTS",
		address: "0x139d9397274bb9E2C29A9aa8Aa0b5874d30D62E3",
		decimals: 18
	},
	{
		symbol: "BOX",
		address: "0xe1A178B681BD05964d3e3Ed33AE731577d9d96dD",
		decimals: 18
	},
	{
		symbol: "BOX",
		address: "0x63f584FA56E60e4D0fE8802b27C7e6E3b33E007f",
		decimals: 18
	},
	{
		symbol: "BOXX",
		address: "0x780116D91E5592E58a3b3c76A351571b39abCEc6",
		decimals: 15
	},
	{
		symbol: "BP",
		address: "0x01db18F6a474840DB3480a6a35227D4D0DfccA37",
		decimals: 18
	},
	{
		symbol: "BPAK9",
		address: "0x202507992E29F29bb417b0281C067e91061b07D3",
		decimals: 8
	},
	{
		symbol: "BPAKC",
		address: "0xdf22Da9a8C1D80095175Ae601d182A734923F01A",
		decimals: 8
	},
	{
		symbol: "BPAY",
		address: "0x903B76F361298169535b2b0Ef065C4ADb0623aAA",
		decimals: 18
	},
	{
		symbol: "BPC",
		address: "0x239836e951DD75Fea01beF8ba039119dc8D5352f",
		decimals: 18
	},
	{
		symbol: "BPC",
		address: "0xF3d29Fb98D2DC5E78c87198DEEF99377345fD6F1",
		decimals: 8
	},
	{
		symbol: "BPK",
		address: "0xB1A219E35ac1aaB0ea8F7dAE92B06142C1bff542",
		decimals: 18
	},
	{
		symbol: "BPLC",
		address: "0x426FC8BE95573230f6e6bc4af91873F0c67b21b4",
		decimals: 18
	},
	{
		symbol: "BPT",
		address: "0x327682779bAB2BF4d1337e8974ab9dE8275A7Ca8",
		decimals: 18
	},
	{
		symbol: "BPTN",
		address: "0x6c22B815904165F3599F0A4a092D458966bD8024",
		decimals: 18
	},
	{
		symbol: "BQ",
		address: "0xF0f8B0B8DBB1124261FC8d778E2287e3Fd2Cf4f5",
		decimals: 3
	},
	{
		symbol: "BQQQ",
		address: "0x1B80eeeaDcC590f305945BCc258cFa770Bbe1890",
		decimals: 18
	},
	{
		symbol: "BQT",
		address: "0x5EB87cAA0105a63aa87A36C7Bd2573Bd13E84faE",
		decimals: 18
	},
	{
		symbol: "BRAT",
		address: "0x9E77D5a1251b6F7D456722A6eaC6D2d5980bd891",
		decimals: 8
	},
	{
		symbol: "BRB",
		address: "0x61D24Aabb3e5E800D8f3d3D43dcBD66AE6caB51E",
		decimals: 18
	},
	{
		symbol: "BRC",
		address: "0x21aB6c9fAC80C59D401b37cB43F81ea9DDe7Fe34",
		decimals: 8
	},
	{
		symbol: "BRC",
		address: "0x5347BfBeC9803C6850dFd55d797E9ecf8689b688",
		decimals: 18
	},
	{
		symbol: "BRC",
		address: "0x8f7a9B503Aa7f9255368bD34D01AEa2b502164c2",
		decimals: 18
	},
	{
		symbol: "BRD",
		address: "0x558EC3152e2eb2174905cd19AeA4e34A23DE9aD6",
		decimals: 18
	},
	{
		symbol: "BREE",
		address: "0x4639cd8cd52EC1CF2E496a606ce28D8AfB1C792F",
		decimals: 18
	},
	{
		symbol: "BRN",
		address: "0x4a7BabFAfE46456bC4e965D6FBeaff7F01c8B330",
		decimals: 8
	},
	{
		symbol: "BRN",
		address: "0xE23665542FDD22dE602eAB11Bb4d1DDBfB07e53b",
		decimals: 18
	},
	{
		symbol: "BRP",
		address: "0xB22c2786a549B008517B67625f5296E8fAf9589e",
		decimals: 18
	},
	{
		symbol: "BRX",
		address: "0x1138d8B876bb048b72EC7Cd222f6a282384b505A",
		decimals: 18
	},
	{
		symbol: "BRX",
		address: "0x3A4A0D5b8dfAcd651EE28ed4fFEBf91500345489",
		decimals: 18
	},
	{
		symbol: "BRZE",
		address: "0x77C07555aF5ffdC946Fb47ce15EA68620E4e7170",
		decimals: 18
	},
	{
		symbol: "BRZX",
		address: "0xdA5180086461Ff6eEb09580181ac160522DcDcd4",
		decimals: 8
	},
	{
		symbol: "BSC",
		address: "0xcfAD57a67689809CdA997f655802a119838c9ceC",
		decimals: 7
	},
	{
		symbol: "BSD",
		address: "0x003e0af2916e598Fa5eA5Cb2Da4EDfdA9aEd9Fde",
		decimals: 18
	},
	{
		symbol: "BSDC",
		address: "0xF26ef5E0545384b7Dcc0f297F2674189586830DF",
		decimals: 18
	},
	{
		symbol: "BSDS",
		address: "0xE7C9C188138f7D70945D420d75F8Ca7d8ab9c700",
		decimals: 18
	},
	{
		symbol: "BSHORT",
		address: "0x316E7D7F3D9584B276Fb68028b74fcdbAeC56481",
		decimals: 18
	},
	{
		symbol: "BSN",
		address: "0xed5A55797CAEcCA39811ac3cc0EE085caFc05953",
		decimals: 18
	},
	{
		symbol: "BSOV",
		address: "0x26946adA5eCb57f3A1F91605050Ce45c482C9Eb1",
		decimals: 8
	},
	{
		symbol: "BSP",
		address: "0x5d551fA77ec2C7dd1387B626c4f33235c3885199",
		decimals: 18
	},
	{
		symbol: "BST",
		address: "0xDf0041891BdA1f911C4243f328F7Cf61b37F965b",
		decimals: 18
	},
	{
		symbol: "BST",
		address: "0xD4f6f9Ae14399fD5Eb8DFc7725F0094a1A7F5d80",
		decimals: 18
	},
	{
		symbol: "BST",
		address: "0x509A38b7a1cC0dcd83Aa9d06214663D9eC7c7F4a",
		decimals: 18
	},
	{
		symbol: "BST",
		address: "0x09463194e7890D226a5FDb226D19ab600b92ee9f",
		decimals: 4
	},
	{
		symbol: "BST1",
		address: "0x336492A0601CC85e08C14D390BF07d960328aaf4",
		decimals: 18
	},
	{
		symbol: "BSTC",
		address: "0x77EDd08fa155bCE573a6a8C015dB188152584572",
		decimals: 10
	},
	{
		symbol: "BSTN",
		address: "0x2f8472dd7ecf7cA760c8f6b45dB20Ca7cf52F8d7",
		decimals: 18
	},
	{
		symbol: "BSVBEAR",
		address: "0xCe49c3c92b33a1653F34811a9d7e34502bF12B89",
		decimals: 18
	},
	{
		symbol: "BSVBULL",
		address: "0x6e13A9e4AE3d0678E511Fb6d2ad531fcF0e247bf",
		decimals: 18
	},
	{
		symbol: "BSVDOOM",
		address: "0x91371b9bc6E90f6dB3C4f4d630Cf5F7700AB917c",
		decimals: 18
	},
	{
		symbol: "BSVG",
		address: "0x8013D06A86F341afAB95F82f6487e44c4Dc0C655",
		decimals: 18
	},
	{
		symbol: "BSVMOON",
		address: "0x875Ef445e0873B6c2D5e58f68113e0937Ba8A441",
		decimals: 18
	},
	{
		symbol: "BSX.CX",
		address: "0x8aeFc499A2B69d1a4FF77A3e7903792f4c3E80D8",
		decimals: 8
	},
	{
		symbol: "BT",
		address: "0x6628606c321FaF52b7230A57b26c01B19aA68e82",
		decimals: 18
	},
	{
		symbol: "BTB",
		address: "0x06e0feB0D74106c7adA8497754074D222Ec6BCDf",
		decimals: 18
	},
	{
		symbol: "BTC++",
		address: "0x0327112423F3A68efdF1fcF402F6c5CB9f7C33fd",
		decimals: 18
	},
	{
		symbol: "BTC2X",
		address: "0x15ef5b9447710Eab904e63e6233Ff540400d603f",
		decimals: 8
	},
	{
		symbol: "BTC3L",
		address: "0x7e5F9F248e84EF0B1f63586323e92a0d91B15568",
		decimals: 18
	},
	{
		symbol: "BTC3S",
		address: "0x1148661869D30e095FF4AA48Aa8b5EadedC75f2A",
		decimals: 18
	},
	{
		symbol: "BTCA",
		address: "0x02725836ebF3eCDb1cDf1c7b02FcbBfaa2736AF8",
		decimals: 8
	},
	{
		symbol: "BTCB",
		address: "0xf2cee90309418353a57717ECa26C4f8754F0d84e",
		decimals: 18
	},
	{
		symbol: "BTCD",
		address: "0x30E00B4af68acD6B779f9C0Ac82fa07F05bA94d0",
		decimals: 4
	},
	{
		symbol: "BTCDai",
		address: "0xEE388f0527907339254f31254faEafFc4072a7ed",
		decimals: 18
	},
	{
		symbol: "BTCE",
		address: "0x0886949c1b8C412860c4264Ceb8083d1365e86CF",
		decimals: 8
	},
	{
		symbol: "BTCETH5050",
		address: "0xc06aEc5191bE16b94FfC97B6Fc01393527367365",
		decimals: 18
	},
	{
		symbol: "BTCETH7525",
		address: "0xA35Fc5019C4dc509394Bd4d74591a0bF8852c195",
		decimals: 18
	},
	{
		symbol: "BTCF",
		address: "0x225927F8fa71d16EE07968B8746364D1d9F839bD",
		decimals: 8
	},
	{
		symbol: "BTCFUND",
		address: "0x2409D6059e2A8130c099e49F3cb418fd6C3d9AFf",
		decimals: 18
	},
	{
		symbol: "BTCG",
		address: "0xcDe3Ef6CACF84Ad36d8A6eCcc964f25351296D36",
		decimals: 8
	},
	{
		symbol: "BTCG",
		address: "0xb9961EE048ff6e5f14c56cf4057078403759FBB4",
		decimals: 8
	},
	{
		symbol: "BTCGW",
		address: "0x305F8157C1f841fBD378f636aBF390c5b4C0e330",
		decimals: 8
	},
	{
		symbol: "BTCHG",
		address: "0x5547136b913b68881596275ACe01e9A589c5b16B",
		decimals: 18
	},
	{
		symbol: "BTCHIVOL",
		address: "0x6123A0CBC95Cb157995A0795187A60995B85e0A9",
		decimals: 18
	},
	{
		symbol: "BTCL",
		address: "0x5acD19b9c91e596b1f062f18e3D02da7eD8D1e50",
		decimals: 8
	},
	{
		symbol: "BTCLOVOL",
		address: "0x20649d97b1393105cf92a5083fd2afF7C99eBe56",
		decimals: 18
	},
	{
		symbol: "BTCM",
		address: "0x04C7Cd246330288a84D2788e8a323cC41206C2eB",
		decimals: 18
	},
	{
		symbol: "BTCM",
		address: "0xA9Aad2dC3a8315caeee5F458B1d8EDc31D8467BD",
		decimals: 18
	},
	{
		symbol: "BTCMINVOL",
		address: "0x81c55017F7Ce6E72451cEd49FF7bAB1e3DF64d0C",
		decimals: 18
	},
	{
		symbol: "BTCMOON",
		address: "0x09aE0c4c34A09875660E681FE1890F3b35175151",
		decimals: 18
	},
	{
		symbol: "BTCMOONX",
		address: "0x90f49083ff588ec5a5459F4D2A64B8D409C03122",
		decimals: 18
	},
	{
		symbol: "BTCN",
		address: "0x2976AC3D0bB67C6307A73Df852C61c14cDDa9863",
		decimals: 18
	},
	{
		symbol: "BTCONE",
		address: "0x87f5E8c3425218837f3CB67dB941aF0C01323E56",
		decimals: 18
	},
	{
		symbol: "BTCP",
		address: "0x723CbfC05e2cfcc71d3d89e770D32801A5eEf5Ab",
		decimals: 8
	},
	{
		symbol: "BTCR",
		address: "0x0371f7b219fff864b437bcfb564810F323FfFccA",
		decimals: 4
	},
	{
		symbol: "BTCRED",
		address: "0x6Aac8CB9861E42bf8259F5AbDC6aE3Ae89909E11",
		decimals: 8
	},
	{
		symbol: "BTCRSIAPY",
		address: "0x924E26fEe8E10c20726006CC2Bd307A538B0eBE5",
		decimals: 18
	},
	{
		symbol: "BTCS",
		address: "0xd96b9fd7586d9Ea24C950d24399be4fB65372FDD",
		decimals: 18
	},
	{
		symbol: "BTCSHORT",
		address: "0xcBe79cEca09092648995B2CCdf91cA5ECD1EdEc9",
		decimals: 18
	},
	{
		symbol: "BTCT",
		address: "0x820A8481451e893Bc66DCe50C84d45617CaC3705",
		decimals: 18
	},
	{
		symbol: "BTCUI",
		address: "0x5f2eC9cF1EC1c0e2c880B6584921E812a4225395",
		decimals: 8
	},
	{
		symbol: "BTCUSDCRSI",
		address: "0xe0a84699a583d467001fcfE1d52930cF6f3b0BFa",
		decimals: 18
	},
	{
		symbol: "BTCUSDCTA",
		address: "0xd218D75BA0fC45858a4E9EF57A257Ed9977dB5f4",
		decimals: 18
	},
	{
		symbol: "BTCWH",
		address: "0x4588C3c165a5C66C020997d89C2162814Aec9cD6",
		decimals: 8
	},
	{
		symbol: "BTCX",
		address: "0x9388F54FA978Aa9e24395a8b69033304ECcea4df",
		decimals: 4
	},
	{
		symbol: "BTE",
		address: "0xB5ceAb8559742713c9E3306e72B69A429eBf166B",
		decimals: 18
	},
	{
		symbol: "BTE",
		address: "0x73dD069c299A5d691E9836243BcaeC9c8C1D8734",
		decimals: 8
	},
	{
		symbol: "BTE",
		address: "0x267Ba09FE3a8a16c7dc8A9B07b5F2C4AC0aDf1c0",
		decimals: 8
	},
	{
		symbol: "BTE",
		address: "0xfD62247943F94C3910A4922af2C62C2D3fAC2a8f",
		decimals: 18
	},
	{
		symbol: "BTE",
		address: "0x6733D909e10DDedB8d6181b213dE32A30cEac7ed",
		decimals: 18
	},
	{
		symbol: "BTGN",
		address: "0x956cDAc781389D259dE92e427ECD86E1cc273f7F",
		decimals: 8
	},
	{
		symbol: "BTGS",
		address: "0xa8A695e805E0e1b7f5D97d0F8a0B5A298896e508",
		decimals: 18
	},
	{
		symbol: "BTH",
		address: "0xFAd572db566E5234AC9Fc3d570c4EdC0050eAA92",
		decimals: 18
	},
	{
		symbol: "BTHT",
		address: "0xf70e431c0E077e794e202b7E2A3Da03A394Fa0FB",
		decimals: 0
	},
	{
		symbol: "BTK",
		address: "0xdb8646F5b487B5Dd979FAC618350e85018F557d4",
		decimals: 18
	},
	{
		symbol: "BTKC",
		address: "0x6682195E2a0048CE38B727A3711802d58244606E",
		decimals: 18
	},
	{
		symbol: "BTL",
		address: "0x5EcD84482176db90bb741dDC8C2F9CcC290e29Ce",
		decimals: 6
	},
	{
		symbol: "BTL",
		address: "0x2accaB9cb7a48c3E82286F0b2f8798D201F4eC3f",
		decimals: 18
	},
	{
		symbol: "BTL",
		address: "0x92685E93956537c25Bb75D5d47fca4266dd628B8",
		decimals: 4
	},
	{
		symbol: "BTM",
		address: "0xcB97e65F07DA24D46BcDD078EBebd7C6E6E3d750",
		decimals: 8
	},
	{
		symbol: "BTM",
		address: "0xF82D62d65f0c670Ac4D88AbDf1afEFaC11522A16",
		decimals: 18
	},
	{
		symbol: "BTMC",
		address: "0x4A8F44BE523580a11cdB20e2C7C470Adf44Ec9BB",
		decimals: 18
	},
	{
		symbol: "BTMX",
		address: "0xF45F0E16B5e096286E1fb463d34BE9F3df5e3602",
		decimals: 18
	},
	{
		symbol: "BTMXBEAR",
		address: "0xdBF637f78624F896B92F801E81f6031b7865eD20",
		decimals: 18
	},
	{
		symbol: "BTMXBULL",
		address: "0x9885cA101DFd8f23D364874F799554C52BFee820",
		decimals: 18
	},
	{
		symbol: "BTNG",
		address: "0xD6b107D3E45B959B6d13FAF1bb2a2CF8fC7025e6",
		decimals: 18
	},
	{
		symbol: "BTNT",
		address: "0xD9964E1306dda055F5284c52048712c35DdB61Fd",
		decimals: 18
	},
	{
		symbol: "BTO",
		address: "0x36905Fc93280f52362A1CBAB151F25DC46742Fb5",
		decimals: 18
	},
	{
		symbol: "BTP",
		address: "0x20900587e569E3D0B2609BCa6Fb3469765ed0920",
		decimals: 18
	},
	{
		symbol: "BTP",
		address: "0x5f038e82bB69b6A52FeC7A4A38163340b98fb1e4",
		decimals: 18
	},
	{
		symbol: "BTQ",
		address: "0x16B0E62aC13a2fAeD36D18bce2356d25Ab3CfAD3",
		decimals: 18
	},
	{
		symbol: "BTR",
		address: "0x499A6B77bc25C26bCf8265E2102B1B3dd1617024",
		decimals: 18
	},
	{
		symbol: "BTR",
		address: "0xcbf15FB8246F679F9Df0135881CB29a3746f734b",
		decimals: 18
	},
	{
		symbol: "BTR",
		address: "0x8040d35ED6c82f75b1078Cf5Eb93A2cFd34b2Bd8",
		decimals: 18
	},
	{
		symbol: "BTR",
		address: "0x31FD1a50C467Ae7986e26c72e8650a28940E11DE",
		decimals: 18
	},
	{
		symbol: "BTR",
		address: "0xd433138d12beB9929FF6fd583DC83663eea6Aaa5",
		decimals: 18
	},
	{
		symbol: "BTRD",
		address: "0x0E2b2855e7674d61286E105B57Fe280fBb67137b",
		decimals: 18
	},
	{
		symbol: "BTRL",
		address: "0x388Fd8A5145D6EF85aAE14D494F93Df9D1c7c00C",
		decimals: 8
	},
	{
		symbol: "BTRN",
		address: "0x03C780cD554598592B97b7256dDAad759945b125",
		decimals: 18
	},
	{
		symbol: "BTRS",
		address: "0x73C9275c3a2Dd84b5741fD59AEbF102C91Eb033F",
		decimals: 18
	},
	{
		symbol: "BTSE",
		address: "0x666d875C600AA06AC1cf15641361dEC3b00432Ef",
		decimals: 8
	},
	{
		symbol: "BTT",
		address: "0x080aa07E2C7185150d7e4DA98838A8d2feac3dfC",
		decimals: 0
	},
	{
		symbol: "BTT",
		address: "0xFA456Cf55250A839088b27EE32A424d7DAcB54Ff",
		decimals: 18
	},
	{
		symbol: "BTU",
		address: "0xb683D83a532e2Cb7DFa5275eED3698436371cc9f",
		decimals: 18
	},
	{
		symbol: "BTV",
		address: "0x3917E933bd430C08304cae2AA6d9746b806406c2",
		decimals: 8
	},
	{
		symbol: "BTY",
		address: "0x9eecec130fb665d03a37289ee34C818Ee7F79926",
		decimals: 18
	},
	{
		symbol: "BTZ",
		address: "0xE5f867dE1EA81346df5181b8b48DD6B0BB3357B0",
		decimals: 18
	},
	{
		symbol: "BUC",
		address: "0xCa3c18a65b802eC267f8f4802545e7F53D24C75e",
		decimals: 18
	},
	{
		symbol: "BUD",
		address: "0x57652Fc91f522f9EFF0b38CDF1D51f5FB5764215",
		decimals: 18
	},
	{
		symbol: "BUGS",
		address: "0xBc3EC4E491b835Dce394A53E9A9A10Ac19564839",
		decimals: 18
	},
	{
		symbol: "BUIDL",
		address: "0xD6F0Bb2A45110f819e908a915237D652Ac7c5AA8",
		decimals: 18
	},
	{
		symbol: "BUIDL",
		address: "0x7b123f53421b1bF8533339BFBdc7C98aA94163db",
		decimals: 18
	},
	{
		symbol: "BUILD",
		address: "0x6e36556B3ee5Aa28Def2a8EC3DAe30eC2B208739",
		decimals: 18
	},
	{
		symbol: "BUL",
		address: "0x0775C81A273B355e6a5b76e240BF708701F00279",
		decimals: 18
	},
	{
		symbol: "BULL",
		address: "0x68eb95Dc9934E19B86687A10DF8e364423240E94",
		decimals: 18
	},
	{
		symbol: "BULLSHIT",
		address: "0xd06b25F67A17f12b41F615b34D87ECd716fF55a0",
		decimals: 18
	},
	{
		symbol: "BUNNY",
		address: "0x755eb14D2fefF2939EB3026f5CaD9D03775b9fF4",
		decimals: 18
	},
	{
		symbol: "BURN",
		address: "0x8515cD0f00aD81996d24b9A9C35121a3b759D6Cd",
		decimals: 18
	},
	{
		symbol: "BURN",
		address: "0x4F7c5BD3F7D62a9C984e265D73A86F5515F3e92B",
		decimals: 0
	},
	{
		symbol: "BUSD",
		address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
		decimals: 18
	},
	{
		symbol: "BUT",
		address: "0xB2E260F12406c401874EcC960893C0f74Cd6aFcd",
		decimals: 18
	},
	{
		symbol: "BUZ",
		address: "0xaE8488e75493B89A0E1488BF91542208C416f486",
		decimals: 18
	},
	{
		symbol: "BVA",
		address: "0x10d88D7495cA381df1391229Bdb82D015b9Ad17D",
		decimals: 18
	},
	{
		symbol: "BVES",
		address: "0xff8998b32a2b3DA59De78518086eA4431b30A2c6",
		decimals: 8
	},
	{
		symbol: "BVL",
		address: "0xe7d324B2677440608fb871981B220ECa062c3FbF",
		decimals: 18
	},
	{
		symbol: "BVOL",
		address: "0x81824663353A9d29b01B2DE9dd9a2Bb271d298cD",
		decimals: 18
	},
	{
		symbol: "BVS",
		address: "0x61242546eA93d851A2e606f03A2593645E92734B",
		decimals: 18
	},
	{
		symbol: "BVT",
		address: "0x9fe173573B3f3cf4AEBce5Fd5Bef957B9a6686e8",
		decimals: 6
	},
	{
		symbol: "BWF",
		address: "0xF7E04D8a32229B4cA63aA51eEA9979C7287FEa48",
		decimals: 5
	},
	{
		symbol: "BWN",
		address: "0x51a4F65463597CA4609C9a90eA3D5ab219Fbc85D",
		decimals: 18
	},
	{
		symbol: "BWT",
		address: "0xf53C580bC4065405bC649cC077fF4f2F28528f4B",
		decimals: 18
	},
	{
		symbol: "BWX",
		address: "0xbD168CbF9d3a375B38dC51A202B5E8a4E52069Ed",
		decimals: 18
	},
	{
		symbol: "BWX",
		address: "0xce5114d7fa8361F0c088EE26FA3A5446C4a1f50b",
		decimals: 18
	},
	{
		symbol: "BXA",
		address: "0x98d8d146e644171Cd47fF8588987B7bdeEF72A87",
		decimals: 18
	},
	{
		symbol: "BXC",
		address: "0xdeCF7Be29F8832E9C2Ddf0388c9778B8Ba76af43",
		decimals: 18
	},
	{
		symbol: "BXC",
		address: "0xf6F364fe92A87225CaEAF3840700917416427e00",
		decimals: 18
	},
	{
		symbol: "BXIOT",
		address: "0x5c4ac68aAc56eBe098D621Cd8CE9F43270Aaa355",
		decimals: 6
	},
	{
		symbol: "BXK",
		address: "0xEb6985ACD6d0cbff60B88032b0B29Ac1d9D66A1B",
		decimals: 18
	},
	{
		symbol: "BXT",
		address: "0x24D77c210a014b1E123a0878F6C903Df74A2317B",
		decimals: 8
	},
	{
		symbol: "BXY",
		address: "0x827D53c8170aF52625f414bde00326Fc8A085E86",
		decimals: 18
	},
	{
		symbol: "BYND.CX",
		address: "0x0a0e3a2973E19d5305A43faFB50935F34F01A55C",
		decimals: 8
	},
	{
		symbol: "BYT",
		address: "0x8B6C0DBC499EAf97F54B54fe0019a4c676DB534a",
		decimals: 8
	},
	{
		symbol: "BYTE",
		address: "0xAC8Ea871e2d5F4Be618905F36f73c760f8cFDC8E",
		decimals: 18
	},
	{
		symbol: "BYTS",
		address: "0x87F14E9460ceCb789F1B125b2E3e353Ff8ed6fcd",
		decimals: 3
	},
	{
		symbol: "BZ",
		address: "0x4375E7aD8A01B8eC3Ed041399f62D9Cd120e0063",
		decimals: 18
	},
	{
		symbol: "BZH",
		address: "0x3685ee91777e3eD4Ba4122C429C504dF833C3b26",
		decimals: 8
	},
	{
		symbol: "BZKY",
		address: "0xd28cFec79dB8d0A225767D06140aee280718AB7E",
		decimals: 16
	},
	{
		symbol: "BZNT",
		address: "0xE1Aee98495365fc179699C1bB3E761FA716beE62",
		decimals: 18
	},
	{
		symbol: "BZRX",
		address: "0x56d811088235F11C8920698a204A5010a788f4b3",
		decimals: 18
	},
	{
		symbol: "BZUN.CX",
		address: "0xC292B91277066B644F53352bE19a734f20fa0F0d",
		decimals: 8
	},
	{
		symbol: "C.CX",
		address: "0x6AbD8652564093de6f28e13cDFBF976300fA0c72",
		decimals: 8
	},
	{
		symbol: "C20",
		address: "0x26E75307Fc0C021472fEb8F727839531F112f317",
		decimals: 18
	},
	{
		symbol: "C2O",
		address: "0x13Ca8eb6405cFbE2eaE5D00207651002083fbc9d",
		decimals: 2
	},
	{
		symbol: "C3W",
		address: "0x19055B944806fba2717dc694CF0173a1EB2D1604",
		decimals: 8
	},
	{
		symbol: "C4C",
		address: "0xC230cE24B527ED4caf97310753330A2965F3A4bD",
		decimals: 10
	},
	{
		symbol: "C8",
		address: "0xd42debE4eDc92Bd5a3FBb4243e1ecCf6d63A4A5d",
		decimals: 18
	},
	{
		symbol: "CACHE",
		address: "0x8b9a25dFAE16173403A21894eb9046084F717eC0",
		decimals: 18
	},
	{
		symbol: "CACXT",
		address: "0xe2b8C4938A3103C1Ab5c19a6B93d07AB6f9dA2ba",
		decimals: 18
	},
	{
		symbol: "CADG",
		address: "0xB3E210B3982AE8f48Defa3d440f6c92aFA104209",
		decimals: 18
	},
	{
		symbol: "CADX",
		address: "0x8Ed876E408959643479534A21970EC023D0fB51e",
		decimals: 18
	},
	{
		symbol: "CAG",
		address: "0x7d4b8Cce0591C9044a22ee543533b72E976E36C3",
		decimals: 18
	},
	{
		symbol: "CAG.CX",
		address: "0x68C5e456F4156E8500ea7Ea0218B84b1749Fb2D8",
		decimals: 8
	},
	{
		symbol: "CAI",
		address: "0x4FE9f52Ec23f6805F2Fd0332a34Da4F1c135b024",
		decimals: 18
	},
	{
		symbol: "CALL",
		address: "0xBbe761EA1447A20b75aA485b7BCad4837415d7D7",
		decimals: 18
	},
	{
		symbol: "CAN",
		address: "0x1d462414fe14cf489c7A21CaC78509f4bF8CD7c0",
		decimals: 6
	},
	{
		symbol: "CAN",
		address: "0x46EE7D0E5080B0FE3D16701c0dbBC6916E3C77C5",
		decimals: 10
	},
	{
		symbol: "CAN",
		address: "0x917FD2f7378FF479419dCB56C5cbB445fBbF902A",
		decimals: 10
	},
	{
		symbol: "CANDY",
		address: "0xf2EAb3A2034D3f6B63734D2E08262040E3fF7B48",
		decimals: 18
	},
	{
		symbol: "CANDY",
		address: "0x50eb346Fc29a80d97563a50146c3FcF9423B5538",
		decimals: 18
	},
	{
		symbol: "CANDY",
		address: "0xcD3673aF09e76C74d889aaBab68cA0645566A3a1",
		decimals: 18
	},
	{
		symbol: "CANDYBOX",
		address: "0x8BB95734f5011088Fd228c8060b3E02CA53e3C0d",
		decimals: 18
	},
	{
		symbol: "CAP",
		address: "0x43044f861ec040DB59A7e324c40507adDb673142",
		decimals: 18
	},
	{
		symbol: "CAP",
		address: "0xEDA6eFE5556e134Ef52f2F858aa1e81c84CDA84b",
		decimals: 18
	},
	{
		symbol: "CAPP",
		address: "0x04F2E7221fdb1B52A68169B25793E51478fF0329",
		decimals: 2
	},
	{
		symbol: "CAR",
		address: "0x4D9e23a3842fE7Eb7682B9725cF6c507C424A41B",
		decimals: 18
	},
	{
		symbol: "CARAT",
		address: "0x19ea630bCBc1a511a16e65b6ECd447c92E1C087c",
		decimals: 18
	},
	{
		symbol: "CARB",
		address: "0xA517a46Baad6B054A76bD19c46844f717fe69fea",
		decimals: 8
	},
	{
		symbol: "CARD",
		address: "0x954b890704693af242613edEf1B603825afcD708",
		decimals: 18
	},
	{
		symbol: "CARD (OLD)",
		address: "0xB07ec2c28834B889b1CE527Ca0F19364cD38935c",
		decimals: 18
	},
	{
		symbol: "CARDS",
		address: "0x3d6F0DEa3AC3C607B3998e6Ce14b6350721752d9",
		decimals: 18
	},
	{
		symbol: "CARE",
		address: "0xbF18F246B9301F231e9561B35A3879769BB46375",
		decimals: 18
	},
	{
		symbol: "CARM",
		address: "0x2E0c40bEB655a988E087AD71Ca191A2806Ac55ef",
		decimals: 18
	},
	{
		symbol: "CARS",
		address: "0x423e4322CDDa29156b49a17dfbd2aCC4b280600D",
		decimals: 9
	},
	{
		symbol: "CAS",
		address: "0xe8780B48bdb05F928697A5e8155f672ED91462F7",
		decimals: 18
	},
	{
		symbol: "CAS",
		address: "0x779492d3644dDF4495Aa2d80C468E1B7be6AF1d2",
		decimals: 2
	},
	{
		symbol: "CASH",
		address: "0xA8F93FAee440644F89059a2c88bdC9BF3Be5e2ea",
		decimals: 18
	},
	{
		symbol: "CAT",
		address: "0x1234567461d3f8Db7496581774Bd869C83D51c93",
		decimals: 18
	},
	{
		symbol: "CAT",
		address: "0x56015BBE3C01fE05bc30A8a9a9Fd9A88917e7dB3",
		decimals: 18
	},
	{
		symbol: "CAT",
		address: "0x68e14bb5A45B9681327E16E528084B9d962C1a39",
		decimals: 18
	},
	{
		symbol: "CAT",
		address: "0x56ba2Ee7890461f463F7be02aAC3099f6d5811A8",
		decimals: 18
	},
	{
		symbol: "CATS",
		address: "0x8293bBd92C42608B20af588620a76128A33e4De9",
		decimals: 6
	},
	{
		symbol: "CATT",
		address: "0x6E605c269E0C92e70BEeB85486f1fC550f9380BD",
		decimals: 18
	},
	{
		symbol: "CATX",
		address: "0xC7743bf0B300Ec041E704Cc34d4f43050942099E",
		decimals: 18
	},
	{
		symbol: "CBANK",
		address: "0xA5E412ba6FcA1e07b15dEFcaA4236Ff7B5A7f086",
		decimals: 18
	},
	{
		symbol: "CBAT",
		address: "0x6C8c6b02E7b2BE14d4fA6022Dfd6d75921D90E4E",
		decimals: 8
	},
	{
		symbol: "CBC",
		address: "0x26DB5439F651CAF491A87d48799dA81F191bDB6b",
		decimals: 8
	},
	{
		symbol: "CBI",
		address: "0x43E5F59247b235449E16eC84c46BA43991Ef6093",
		decimals: 18
	},
	{
		symbol: "CBIX",
		address: "0x05C3617cBf1304b9260AA61ec960F115D67beCEA",
		decimals: 18
	},
	{
		symbol: "CBIX7",
		address: "0xCf8f9555D55CE45a3A33a81D6eF99a2a2E71Dee2",
		decimals: 18
	},
	{
		symbol: "CBK",
		address: "0xD85a6Ae55a7f33B0ee113C234d2EE308EdeAF7fD",
		decimals: 18
	},
	{
		symbol: "CBK.CX",
		address: "0x9A5Ff62FD25B5fEC3409Cca1d5762B976293dd89",
		decimals: 8
	},
	{
		symbol: "CBM",
		address: "0x95eFD1Fe6099F65a7ED524DEF487483221094947",
		decimals: 18
	},
	{
		symbol: "CBSN",
		address: "0x7d4B1d793239707445305D8d2456D2c735F6B25B",
		decimals: 18
	},
	{
		symbol: "CBT",
		address: "0x076C97e1c869072eE22f8c91978C99B4bcB02591",
		decimals: 18
	},
	{
		symbol: "CBU",
		address: "0xcEf46305D096fa876Dd23048bf80F9345282e3fc",
		decimals: 0
	},
	{
		symbol: "CBUCKS",
		address: "0x0d2BB9D68dD4451A09ec94C05E20Bd395022bd8e",
		decimals: 2
	},
	{
		symbol: "CC.CX",
		address: "0x8D4A15C9355b70A2558c99299C6990917758B76e",
		decimals: 8
	},
	{
		symbol: "CC10",
		address: "0x17aC188e09A7890a1844E5E65471fE8b0CcFadF3",
		decimals: 18
	},
	{
		symbol: "CC3",
		address: "0xc166038705FFBAb3794185b3a9D925632A1DF37D",
		decimals: 18
	},
	{
		symbol: "CCC",
		address: "0x94Cb815F4b601B00b363B3177B4D8ed8e0EB7cF2",
		decimals: 18
	},
	{
		symbol: "CCC",
		address: "0x0Bc2149d073f62510c99d908F52D0D703dA1F135",
		decimals: 18
	},
	{
		symbol: "CCC",
		address: "0x378903a03FB2C3AC76BB52773e3CE11340377A32",
		decimals: 18
	},
	{
		symbol: "CCC",
		address: "0x28577A6d31559bd265Ce3ADB62d0458550F7b8a7",
		decimals: 18
	},
	{
		symbol: "CCC",
		address: "0xBE11eEb186e624b8f26A5045575a1340E4054552",
		decimals: 18
	},
	{
		symbol: "CCLC",
		address: "0xd348e07A2806505B856123045d27aeeD90924b50",
		decimals: 8
	},
	{
		symbol: "CCN",
		address: "0x17B26400621695c2D8C2D8869f6259E82D7544c4",
		decimals: 18
	},
	{
		symbol: "CCO",
		address: "0x679BADc551626e01B23CeecEFBc9B877EA18fc46",
		decimals: 18
	},
	{
		symbol: "CCOMP",
		address: "0x70e36f6BF80a52b3B46b3aF8e106CC0ed743E8e4",
		decimals: 8
	},
	{
		symbol: "CCRB",
		address: "0xE4c94d45f7Aef7018a5D66f44aF780ec6023378e",
		decimals: 6
	},
	{
		symbol: "CCS",
		address: "0x2B85CEa4E0eE23468B54e0bFE8284f4c308cfE37",
		decimals: 18
	},
	{
		symbol: "CCS",
		address: "0x315cE59FAFd3A8d562b7Ec1C8542382d2710b06c",
		decimals: 18
	},
	{
		symbol: "CCT",
		address: "0xfc4b9e2d71a7795102Eb0C0e8b5DA992946a62De",
		decimals: 18
	},
	{
		symbol: "CCT",
		address: "0x336F646F87D9f6bC6Ed42Dd46E8b3fD9DbD15C22",
		decimals: 18
	},
	{
		symbol: "CCURVE",
		address: "0x845838DF265Dcd2c412A1Dc9e959c7d08537f8a2",
		decimals: 18
	},
	{
		symbol: "CDAI",
		address: "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
		decimals: 8
	},
	{
		symbol: "CDB",
		address: "0xFd3305E1c7cB5D269fb6CeD8eB8240255a50E7a4",
		decimals: 8
	},
	{
		symbol: "CDC",
		address: "0x87026F792D09960232CA406E80C89BD35BAfE566",
		decimals: 18
	},
	{
		symbol: "CDL",
		address: "0xcb17cD357c7acD594717D899ecb9df540F633F27",
		decimals: 18
	},
	{
		symbol: "CDL",
		address: "0x8a95ca448A52C0ADf0054bB3402dC5e09CD6B232",
		decimals: 18
	},
	{
		symbol: "CDR",
		address: "0x5A9F5992085E8a25A45716Cb6F8fF5b57a05d332",
		decimals: 8
	},
	{
		symbol: "CDT",
		address: "0x177d39AC676ED1C67A2b268AD7F1E58826E5B0af",
		decimals: 18
	},
	{
		symbol: "CDX",
		address: "0x6fFF3806Bbac52A20e0d79BC538d527f6a22c96b",
		decimals: 18
	},
	{
		symbol: "CDX",
		address: "0x2cb101d7dA0ebaA57D3F2fEf46D7FFB7BB64592B",
		decimals: 0
	},
	{
		symbol: "CEEK",
		address: "0xb056c38f6b7Dc4064367403E26424CD2c60655e1",
		decimals: 18
	},
	{
		symbol: "CEL",
		address: "0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d",
		decimals: 4
	},
	{
		symbol: "CELR",
		address: "0x4F9254C83EB525f9FCf346490bbb3ed28a81C667",
		decimals: 18
	},
	{
		symbol: "CEN",
		address: "0x0bC61DdED5F6710c637cf8288Eb6058766ce1921",
		decimals: 18
	},
	{
		symbol: "CENNZ",
		address: "0x1122B6a0E00DCe0563082b6e2953f3A943855c1F",
		decimals: 18
	},
	{
		symbol: "Centra",
		address: "0x96A65609a7B84E8842732DEB08f56C3E21aC6f8a",
		decimals: 18
	},
	{
		symbol: "CERT",
		address: "0x85954C0aDdE80c73b019a92C08e0D22f16Ac4067",
		decimals: 18
	},
	{
		symbol: "CET",
		address: "0x081F67aFA0cCF8c7B17540767BBe95DF2bA8D97F",
		decimals: 18
	},
	{
		symbol: "CET",
		address: "0xF660cA1e228e7BE1fA8B4f5583145E31147FB577",
		decimals: 18
	},
	{
		symbol: "CETH",
		address: "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5",
		decimals: 8
	},
	{
		symbol: "CFC",
		address: "0x5Dff89a2caa4D76bc286F74D67Bd718eb834da61",
		decimals: 18
	},
	{
		symbol: "CFC",
		address: "0x7f288Ff5A8055F5f6103A80Dd806cf8415e035C7",
		decimals: 18
	},
	{
		symbol: "CFI",
		address: "0x63b4f3e3fa4e438698CE330e365E831F7cCD1eF4",
		decimals: 18
	},
	{
		symbol: "CFI",
		address: "0x12FEF5e57bF45873Cd9B62E9DBd7BFb99e32D73e",
		decimals: 18
	},
	{
		symbol: "CFT",
		address: "0xc5d350B854A6cff0fC5A38A115a90C774dcae1b9",
		decimals: 18
	},
	{
		symbol: "CFTY",
		address: "0x6956983F8B3Ce173B4AB84361AA0ad52f38D936f",
		decimals: 8
	},
	{
		symbol: "CFX",
		address: "0x226F15CDBAa36814ce3cB287563069c32cC1A293",
		decimals: 2
	},
	{
		symbol: "CGC",
		address: "0x2d9765a94FF22e0CA3AfC3E3F4B116dE2b67582a",
		decimals: 16
	},
	{
		symbol: "CGG",
		address: "0x1fE24F25b1Cf609B9c4e7E12D802e3640dFA5e43",
		decimals: 18
	},
	{
		symbol: "CGMT",
		address: "0x84f43821C73da781A7C440c3cA1A50E1013F7219",
		decimals: 8
	},
	{
		symbol: "CGN",
		address: "0x254bCa53A17A1C6E1AdA05C06aff042684E846c2",
		decimals: 8
	},
	{
		symbol: "CGT",
		address: "0xF5238462E7235c7B62811567E63Dd17d12C2EAA0",
		decimals: 8
	},
	{
		symbol: "CH50.CX",
		address: "0xE1f28D7d34FAecDDF912B717434E3C3373F0D1D6",
		decimals: 8
	},
	{
		symbol: "CHADLINK",
		address: "0x19F4a2f8E21915376F1429C26a3A9B9b1db5FF5A",
		decimals: 18
	},
	{
		symbol: "CHADS",
		address: "0x69692D3345010a207b759a7D1af6fc7F38b35c5E",
		decimals: 18
	},
	{
		symbol: "CHAI",
		address: "0x06AF07097C9Eeb7fD685c692751D5C66dB49c215",
		decimals: 18
	},
	{
		symbol: "CHAIN",
		address: "0xC4C2614E694cF534D407Ee49F8E44D125E4681c4",
		decimals: 18
	},
	{
		symbol: "CHART",
		address: "0x1d37986F252d0e349522EA6C3B98Cb935495E63E",
		decimals: 18
	},
	{
		symbol: "CHAT",
		address: "0x442Bc47357919446eAbC18C7211E57a13d983469",
		decimals: 18
	},
	{
		symbol: "CHERRY",
		address: "0x4eCB692B0fEDeCD7B486b4c99044392784877E8C",
		decimals: 4
	},
	{
		symbol: "CHESS",
		address: "0x5f75112bBB4E1aF516fBE3e21528C63DA2B6a1A5",
		decimals: 18
	},
	{
		symbol: "CHG",
		address: "0xC4A86561cb0b7EA1214904f26E6D50FD357C7986",
		decimals: 18
	},
	{
		symbol: "CHI",
		address: "0x0000000000004946c0e9F43F4Dee607b0eF1fA1c",
		decimals: 0
	},
	{
		symbol: "CHIP",
		address: "0x86AA993FdB0A60C2d548256a862258aB5d352faB",
		decimals: 18
	},
	{
		symbol: "CHK.CX",
		address: "0x11bF1d3B4d4700Ae43b3839aB0d8a218Dd15C707",
		decimals: 8
	},
	{
		symbol: "CHOP",
		address: "0x646707246D7d5C2a86d7206f41CA8199ea9CED69",
		decimals: 18
	},
	{
		symbol: "CHP",
		address: "0xf3db7560E820834658B590C96234c333Cd3D5E5e",
		decimals: 18
	},
	{
		symbol: "CHR",
		address: "0x915044526758533dfB918ecEb6e44bc21632060D",
		decimals: 6
	},
	{
		symbol: "CHR",
		address: "0x8A2279d4A90B6fe1C4B30fa660cC9f926797bAA2",
		decimals: 6
	},
	{
		symbol: "CHS",
		address: "0xDCDe110057F01D1516B2FA308587C6A30Bdc85Ba",
		decimals: 18
	},
	{
		symbol: "CHSB",
		address: "0xba9d4199faB4f26eFE3551D490E3821486f135Ba",
		decimals: 8
	},
	{
		symbol: "CHT",
		address: "0x792E0FC822Ac6ff5531E46425f13540f1F68A7A8",
		decimals: 8
	},
	{
		symbol: "CHT",
		address: "0x3277dd536471a3cBEB0c9486aCad494C95A31E73",
		decimals: 18
	},
	{
		symbol: "CHT",
		address: "0x799d214d7143B766cDd4979cd0280939288ba931",
		decimals: 2
	},
	{
		symbol: "CHT",
		address: "0x3A68B8FF75723134F8E59BDdF7a7e17bDB46DA91",
		decimals: 18
	},
	{
		symbol: "CHX",
		address: "0x1460a58096d80a50a2F1f956DDA497611Fa4f165",
		decimals: 18
	},
	{
		symbol: "CHZ",
		address: "0x3506424F91fD33084466F402d5D97f05F8e3b4AF",
		decimals: 18
	},
	{
		symbol: "CIC",
		address: "0xAD640689e6950b7453729A4686edB3FdfD754616",
		decimals: 18
	},
	{
		symbol: "CIEN.CX",
		address: "0x6872CDCBAeD6EdD4f319842917173E0ab8617fef",
		decimals: 8
	},
	{
		symbol: "CIPHC",
		address: "0x83eB94cB563146a42Fe0a8b3D051F2387A7FB81f",
		decimals: 8
	},
	{
		symbol: "CIT",
		address: "0xc54083e77F913a4f99E1232Ae80c318ff03c9D17",
		decimals: 18
	},
	{
		symbol: "CITA",
		address: "0xB15a0BEcFb3b7DA042F969A8e401C2Ce8B8679d0",
		decimals: 8
	},
	{
		symbol: "CJT",
		address: "0x3abdfF32F76b42E7635bdb7e425f0231A5F3aB17",
		decimals: 18
	},
	{
		symbol: "CK",
		address: "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d",
		decimals: 18
	},
	{
		symbol: "CL",
		address: "0xe81D72D14B1516e68ac3190a46C93302Cc8eD60f",
		decimals: 18
	},
	{
		symbol: "CLA",
		address: "0xF7269a10E85d4aa8282529516cf86847748Da2Bf",
		decimals: 18
	},
	{
		symbol: "CLB",
		address: "0xb1c1Cb8C7c1992dba24e628bF7d38E71daD46aeB",
		decimals: 18
	},
	{
		symbol: "CLIQ",
		address: "0x0Def8d8addE14c9eF7c2a986dF3eA4Bd65826767",
		decimals: 18
	},
	{
		symbol: "CLL",
		address: "0x3dC9a42fa7Afe57BE03c58fD7F4411b1E466C508",
		decimals: 18
	},
	{
		symbol: "CLM",
		address: "0x0ED8343dfdEE32E38b4c4cE15a3b00A59E90F3dB",
		decimals: 18
	},
	{
		symbol: "CLM",
		address: "0x0B4C2708F052dca413600e237675e4d6778A9375",
		decimals: 16
	},
	{
		symbol: "CLN",
		address: "0x4162178B78D6985480A308B2190EE5517460406D",
		decimals: 18
	},
	{
		symbol: "CLOUT",
		address: "0xa10ae543dB5D967a73E9Abcc69c81a18A7Fc0A78",
		decimals: 18
	},
	{
		symbol: "CLPC",
		address: "0x7FCE2856899a6806eeEf70807985fc7554C66340",
		decimals: 9
	},
	{
		symbol: "CLR",
		address: "0x2396FBC0e2E3AE4B7206EbDb5706e2a5920349CB",
		decimals: 18
	},
	{
		symbol: "CLT",
		address: "0x2001f2A0Cf801EcFda622f6C28fb6E10d803D969",
		decimals: 8
	},
	{
		symbol: "CLVS.CX",
		address: "0x097A43Eb652A4D718D18BEA66452b94fABB4944f",
		decimals: 8
	},
	{
		symbol: "CMA",
		address: "0xC6C2A8f2c957806AC0580b46d84d2717291B9Df1",
		decimals: 18
	},
	{
		symbol: "CMB",
		address: "0xe541b34f73a4789a033A962ad43655221B4E516e",
		decimals: 18
	},
	{
		symbol: "CMBT",
		address: "0x3EDD235C3E840C1F29286B2e39370a255C7B6fdb",
		decimals: 8
	},
	{
		symbol: "CMC",
		address: "0x7e667525521cF61352e2E01b50FaaaE7Df39749a",
		decimals: 18
	},
	{
		symbol: "CMCT",
		address: "0x47bc01597798DCD7506DCCA36ac4302fc93a8cFb",
		decimals: 8
	},
	{
		symbol: "CMCT",
		address: "0x7aBc60B3290F68c85f495fD2e0c3Bd278837a313",
		decimals: 8
	},
	{
		symbol: "CMDX",
		address: "0xb2c19bA4D5246D4c587a62F0dfE9f78083568455",
		decimals: 18
	},
	{
		symbol: "CMID",
		address: "0xacB53386B1c8015AE9352c8482d10C0d4A03C38A",
		decimals: 18
	},
	{
		symbol: "CMT",
		address: "0xf85fEea2FdD81d51177F6b8F35F0e6734Ce45F5F",
		decimals: 18
	},
	{
		symbol: "CMT",
		address: "0xeDF12Cd1CeF3C09f599962D1f15A79DE19Df8ebD",
		decimals: 8
	},
	{
		symbol: "CNAB",
		address: "0x44E9AB4A3AF1ccc8C1cFCE6FC7D3e650373fC507",
		decimals: 18
	},
	{
		symbol: "CNB",
		address: "0xC538143202f3b11382D8606aae90a96b042a19DB",
		decimals: 18
	},
	{
		symbol: "CNB",
		address: "0xEBf2F9E8De960f64ec0fDCDa6Cb282423133347B",
		decimals: 8
	},
	{
		symbol: "CNCC",
		address: "0xB3a1770c1cD53947c3fF8809BD1150ea4c45aC1d",
		decimals: 18
	},
	{
		symbol: "CNCT",
		address: "0x54A9ed327F2614316914c3F3a782a77d0AA47AEe",
		decimals: 18
	},
	{
		symbol: "CND",
		address: "0xd4c435F5B09F855C3317c8524Cb1F586E42795fa",
		decimals: 18
	},
	{
		symbol: "CND",
		address: "0x91E84EC6101547C1FA39Dd565dd8b020E3c20CF2",
		decimals: 18
	},
	{
		symbol: "CNFI",
		address: "0xEABB8996eA1662cAd2f7fB715127852cd3262Ae9",
		decimals: 18
	},
	{
		symbol: "CNG",
		address: "0x883a158c9b28f8d626ACFCFbE1028f49E70c9D75",
		decimals: 18
	},
	{
		symbol: "CNMC",
		address: "0x8A3e08353E3c64d9Fa5683Bb5E2fBBF8AeF7e7E9",
		decimals: 18
	},
	{
		symbol: "CNN",
		address: "0x8713d26637CF49e1b6B4a7Ce57106AaBc9325343",
		decimals: 18
	},
	{
		symbol: "CNNS",
		address: "0x6c3BE406174349cfa4501654313d97e6a31072e1",
		decimals: 18
	},
	{
		symbol: "CNP",
		address: "0x0809bD190C94F4408e691C410E67BFf0DF5d225d",
		decimals: 2
	},
	{
		symbol: "CNR",
		address: "0xcE27A2388D2ba7a9995fa0960FB168568e2a7923",
		decimals: 18
	},
	{
		symbol: "CNRG",
		address: "0xc21dBEE65D62770953035f0434C532d578a666c9",
		decimals: 18
	},
	{
		symbol: "CNTM",
		address: "0x9a1bf361798Ef6538cCB8137EA900C4D4B48CA3D",
		decimals: 18
	},
	{
		symbol: "CNUS",
		address: "0x722F2f3EaC7e9597C73a593f7CF3de33Fbfc3308",
		decimals: 18
	},
	{
		symbol: "CNV",
		address: "0x02Cc786304ec4D6758cB16a962139870B4d960Ce",
		decimals: 18
	},
	{
		symbol: "CNX",
		address: "0xE0b7e882C194881C690924cb46154B8241F9145E",
		decimals: 18
	},
	{
		symbol: "CNX.CX",
		address: "0xB68DB6B3e0DD4213F17cb2bf1039f08f69437B99",
		decimals: 8
	},
	{
		symbol: "CNYQ",
		address: "0xc541b907478d5CD334C0cbfcB9603b6dac6e9ee3",
		decimals: 18
	},
	{
		symbol: "CNYT",
		address: "0x91b7ED3B352aa3502F94E58Eac930ae1F5B5EbcD",
		decimals: 0
	},
	{
		symbol: "CNYX",
		address: "0x319AD3fF82beddDB3bc85fD7943002D25CDB3cb9",
		decimals: 18
	},
	{
		symbol: "CNZ",
		address: "0xC1965d7D18f37062b18ab3d5D1fE7f69873b30Dd",
		decimals: 18
	},
	{
		symbol: "CNZ",
		address: "0x6368A6bcebe2dB1A850f87650dABd29cC642e2dA",
		decimals: 18
	},
	{
		symbol: "CO2",
		address: "0x574B36BceD443338875d171CC377E691f7d4F887",
		decimals: 18
	},
	{
		symbol: "CO2",
		address: "0xB4b1D2C217EC0776584CE08D3DD98F90EDedA44b",
		decimals: 18
	},
	{
		symbol: "COB",
		address: "0xb2F7EB1f2c37645bE61d73953035360e768D81E6",
		decimals: 18
	},
	{
		symbol: "COBR",
		address: "0x933DFC5622792b41245aB8313416cAF0ba885aE7",
		decimals: 18
	},
	{
		symbol: "COCOS",
		address: "0xc4c7Ea4FAB34BD9fb9a5e1B1a98Df76E26E6407c",
		decimals: 18
	},
	{
		symbol: "COCOS",
		address: "0x0C6f5F7D555E7518f6841a79436BD2b1Eef03381",
		decimals: 18
	},
	{
		symbol: "CODO",
		address: "0x8301B6220eed034BC18e8406241E98fd306322f1",
		decimals: 8
	},
	{
		symbol: "COFI",
		address: "0x1a23a6BfBAdB59fa563008c0fB7cf96dfCF34Ea1",
		decimals: 18
	},
	{
		symbol: "COFI",
		address: "0x3136eF851592aCf49CA4C825131E364170FA32b3",
		decimals: 18
	},
	{
		symbol: "COI",
		address: "0x8a1a9477a710D470575b1Da335e524b27e8091ab",
		decimals: 18
	},
	{
		symbol: "COIL",
		address: "0x0C91B015AbA6f7B4738dcD36E7410138b29ADC29",
		decimals: 8
	},
	{
		symbol: "COIL",
		address: "0x3936Ad01cf109a36489d93cabdA11cF062fd3d48",
		decimals: 9
	},
	{
		symbol: "COIN",
		address: "0xeb547ed1D8A3Ff1461aBAa7F0022FED4836E00A4",
		decimals: 18
	},
	{
		symbol: "COIN",
		address: "0x87b008E57F640D94Ee44Fd893F0323AF933F9195",
		decimals: 18
	},
	{
		symbol: "COIN",
		address: "0xE61fDAF474Fac07063f2234Fb9e60C1163Cfa850",
		decimals: 18
	},
	{
		symbol: "COK",
		address: "0x48C589F9734289d8862a245Cf9884631a315696f",
		decimals: 8
	},
	{
		symbol: "COKE",
		address: "0xA3a3F076413A362bB0D69EeA1dC5b0E79C831edC",
		decimals: 18
	},
	{
		symbol: "COL",
		address: "0xC76FB75950536d98FA62ea968E1D6B45ffea2A55",
		decimals: 18
	},
	{
		symbol: "COM",
		address: "0x1B4052d98fb1888C2Bf3B8d3b930e0aFf8A910dF",
		decimals: 18
	},
	{
		symbol: "COMB",
		address: "0x7C81542ED859A2061538FEE22B6544a235B9557D",
		decimals: 18
	},
	{
		symbol: "COMBO",
		address: "0xfFffFffF2ba8F66D4e51811C5190992176930278",
		decimals: 18
	},
	{
		symbol: "COMC",
		address: "0xA5e99ad202bDd71D3518306Cf4dD163261981af1",
		decimals: 18
	},
	{
		symbol: "COMM.CX",
		address: "0x0673e08528f4fAfa727779C32eEa83493B6d3CD5",
		decimals: 8
	},
	{
		symbol: "COMP",
		address: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
		decimals: 18
	},
	{
		symbol: "CONI",
		address: "0x2c949199cFF14AEAF1B33D64Db01F48FB57f592f",
		decimals: 8
	},
	{
		symbol: "CONV",
		address: "0xc834Fa996fA3BeC7aAD3693af486ae53D8aA8B50",
		decimals: 18
	},
	{
		symbol: "COR",
		address: "0x9C2dc0c3CC2BADdE84B0025Cf4df1c5aF288D835",
		decimals: 18
	},
	{
		symbol: "CORE",
		address: "0x62359Ed7505Efc61FF1D56fEF82158CcaffA23D7",
		decimals: 18
	},
	{
		symbol: "CORN",
		address: "0xa456b515303B2Ce344E9d2601f91270f8c2Fea5E",
		decimals: 18
	},
	{
		symbol: "CORN",
		address: "0x3080ec2A6960432F179c66D388099A48E82e2047",
		decimals: 18
	},
	{
		symbol: "CORX",
		address: "0x26a604DFFE3ddaB3BEE816097F81d3C4a2A4CF97",
		decimals: 8
	},
	{
		symbol: "COS",
		address: "0x589891a198195061Cb8ad1a75357A3b7DbaDD7Bc",
		decimals: 18
	},
	{
		symbol: "COSM",
		address: "0xC4Bcd64CB216D49fD3C643A32762F34626b45a1a",
		decimals: 18
	},
	{
		symbol: "COSM",
		address: "0xD1E10C37A27d95D95720291b1Dc6f12F74C71443",
		decimals: 18
	},
	{
		symbol: "COSS",
		address: "0x9e96604445Ec19fFed9a5e8dd7B50a29C899A10C",
		decimals: 18
	},
	{
		symbol: "COSS",
		address: "0x65292EeadF1426Cd2dF1C4793a3d7519f253913b",
		decimals: 18
	},
	{
		symbol: "COT",
		address: "0x5c872500c00565505F3624AB435c222E558E9ff8",
		decimals: 18
	},
	{
		symbol: "COT",
		address: "0xed64142f7D0a4d94cE0e7Fe45D12f712fe360BD0",
		decimals: 18
	},
	{
		symbol: "COTI",
		address: "0xDDB3422497E61e13543BeA06989C0789117555c5",
		decimals: 18
	},
	{
		symbol: "COU",
		address: "0xf091Cf09c51811819DB705710e9634B8bf18F164",
		decimals: 18
	},
	{
		symbol: "COV",
		address: "0xADA86b1b313D1D5267E3FC0bB303f0A2b66D0Ea7",
		decimals: 18
	},
	{
		symbol: "COV",
		address: "0xE2FB6529EF566a080e6d23dE0bd351311087D567",
		decimals: 18
	},
	{
		symbol: "COVA",
		address: "0xB37a769B37224449d92AAc57dE379E1267Cd3B00",
		decimals: 18
	},
	{
		symbol: "COVAL",
		address: "0x3D658390460295FB963f54dC0899cfb1c30776Df",
		decimals: 8
	},
	{
		symbol: "COVC",
		address: "0x9947A675Cb4D4A19e020E1DD035955c0150b1e5e",
		decimals: 18
	},
	{
		symbol: "COVER",
		address: "0x5D8d9F5b96f4438195BE9b99eee6118Ed4304286",
		decimals: 18
	},
	{
		symbol: "COVER",
		address: "0x4688a8b1F292FDaB17E9a90c8Bc379dC1DBd8713",
		decimals: 18
	},
	{
		symbol: "COVID",
		address: "0x0c2c5E2b677dEa43025B5DA5061fEcE445f0295B",
		decimals: 18
	},
	{
		symbol: "COW",
		address: "0xC3d6dda603FC15Fd4Bf9303150fe11c7cd6059dc",
		decimals: 18
	},
	{
		symbol: "COW",
		address: "0xf0be50ED0620E0Ba60CA7FC968eD14762e0A5Dd3",
		decimals: 9
	},
	{
		symbol: "COY",
		address: "0xa2c1e04acA801dA92FA95aF161040d37f103d69D",
		decimals: 18
	},
	{
		symbol: "COZOM",
		address: "0x41523a22144f3D129DDdF1E9A549333148D0C37D",
		decimals: 18
	},
	{
		symbol: "CP",
		address: "0xFd45e61E085b3E7a1990A47828d757755b206eeE",
		decimals: 18
	},
	{
		symbol: "CPAL",
		address: "0x31910AFF5545784755970aE1fBE7fE65d5F0eEa2",
		decimals: 8
	},
	{
		symbol: "CPAY",
		address: "0x0Ebb614204E47c09B6C3FeB9AAeCad8EE060E23E",
		decimals: 0
	},
	{
		symbol: "CPB.CX",
		address: "0x3B1eE4E6DF767434Fa576a2E9B62E071fB169e83",
		decimals: 8
	},
	{
		symbol: "CPC",
		address: "0xfAE4Ee59CDd86e3Be9e8b90b53AA866327D7c090",
		decimals: 18
	},
	{
		symbol: "CPEX",
		address: "0xb787d4eAc8899730bb8C57fc3c998c49c5244ec0",
		decimals: 8
	},
	{
		symbol: "CPI",
		address: "0x2b67D1a87A8D8B280A23e97bC55095215eE0ec53",
		decimals: 18
	},
	{
		symbol: "CPL",
		address: "0x248C27F814EF2c9C51c26398d09715Cd35142fC4",
		decimals: 18
	},
	{
		symbol: "CPL",
		address: "0x4B3C89E986b12f83eED896F02410429a7289526e",
		decimals: 9
	},
	{
		symbol: "CPP",
		address: "0x021C9c28970E25623Ab426e76a1Ff14ae6b8C6E6",
		decimals: 18
	},
	{
		symbol: "CPR",
		address: "0x20AE0cA9D42e6Ffeb1188F341A7D63450452dEF6",
		decimals: 18
	},
	{
		symbol: "CPRT.CX",
		address: "0x17b0c6658944B11325E1Fe2A723f0349EfF6550A",
		decimals: 8
	},
	{
		symbol: "CPS",
		address: "0xb5a52519426EC6D88784cC80E621062498306734",
		decimals: 18
	},
	{
		symbol: "CPT",
		address: "0x9B62513c8a27290CF6A7A9e29386e600245EA819",
		decimals: 18
	},
	{
		symbol: "CPT",
		address: "0xC173af61aa4bAB0A5296DEFF512973b8540D9d1B",
		decimals: 18
	},
	{
		symbol: "CPT",
		address: "0x88d50B466BE55222019D71F9E8fAe17f5f45FCA1",
		decimals: 8
	},
	{
		symbol: "CPY",
		address: "0xf44745fBd41F6A1ba151df190db0564c5fCc4410",
		decimals: 18
	},
	{
		symbol: "CR",
		address: "0x1F2910b0d423bbC4271af083b17fb2837F215c36",
		decimals: 18
	},
	{
		symbol: "CR1",
		address: "0x0D9a10a0466B7E9AD693e24993f5105bfDb240e3",
		decimals: 18
	},
	{
		symbol: "CR7",
		address: "0x7F585B9130c64e9e9F470b618A7badD03D79cA7E",
		decimals: 18
	},
	{
		symbol: "CRAD",
		address: "0x608f006B6813f97097372d0d31Fb0F11d1CA3E4e",
		decimals: 18
	},
	{
		symbol: "CRB",
		address: "0xAef38fBFBF932D1AeF3B808Bc8fBd8Cd8E1f8BC5",
		decimals: 8
	},
	{
		symbol: "CRBN",
		address: "0xCdeee767beD58c5325f68500115d4B722b3724EE",
		decimals: 18
	},
	{
		symbol: "CRBT",
		address: "0x2cF618c19041D9Db330d8222B860A624021F30fb",
		decimals: 18
	},
	{
		symbol: "CRC",
		address: "0xF41e5Fbc2F6Aac200Dd8619E121CE1f05D150077",
		decimals: 18
	},
	{
		symbol: "CRC",
		address: "0x223B6e268Eea352572c3D081039DAf00c822A4c5",
		decimals: 18
	},
	{
		symbol: "crCREAM",
		address: "0x892B14321a4FCba80669aE30Bd0cd99a7ECF6aC0",
		decimals: 8
	},
	{
		symbol: "CRD",
		address: "0xcAaa93712BDAc37f736C323C93D4D5fDEFCc31CC",
		decimals: 18
	},
	{
		symbol: "CRD",
		address: "0x4760e7A401558AA59639161454bb2A41a3c5A90b",
		decimals: 18
	},
	{
		symbol: "CRDR",
		address: "0x6EBCCea09F6Bb1a0DC550dCD66F15A7cb170ede1",
		decimals: 18
	},
	{
		symbol: "CRDT",
		address: "0xDaab5E695bb0E8Ce8384ee56BA38fA8290618e52",
		decimals: 18
	},
	{
		symbol: "CRE",
		address: "0x115eC79F1de567eC68B7AE7eDA501b406626478e",
		decimals: 18
	},
	{
		symbol: "CREAM",
		address: "0x2ba592F78dB6436527729929AAf6c908497cB200",
		decimals: 18
	},
	{
		symbol: "CRED",
		address: "0xED7Fa212E100DFb3b13B834233E4B680332a3420",
		decimals: 18
	},
	{
		symbol: "CRED",
		address: "0x672a1AD4f667FB18A333Af13667aa0Af1F5b5bDD",
		decimals: 18
	},
	{
		symbol: "CREDIT",
		address: "0xC4cB5793BD58BaD06bF51FB37717b86B02CBe8A4",
		decimals: 18
	},
	{
		symbol: "CREDO",
		address: "0x4E0603e2A27A30480E5e3a4Fe548e29EF12F64bE",
		decimals: 18
	},
	{
		symbol: "CREED",
		address: "0x675E7d927Af7e6D0082e0153dc3485B687a6F0ad",
		decimals: 18
	},
	{
		symbol: "CREP",
		address: "0x158079Ee67Fce2f58472A96584A73C7Ab9AC95c1",
		decimals: 8
	},
	{
		symbol: "CRETH2",
		address: "0xcBc1065255cBc3aB41a6868c22d1f1C573AB89fd",
		decimals: 18
	},
	{
		symbol: "CRGO",
		address: "0xf49CDD50aD408d387d611F88A647179C3de3492b",
		decimals: 18
	},
	{
		symbol: "CRMT",
		address: "0x9238bfB781A55eACC3Cf05F7DF94038c198CD9B9",
		decimals: 8
	},
	{
		symbol: "CRO",
		address: "0xDdF993BEbbd397f2a42de7c39F09F9C8e34Ef322",
		decimals: 18
	},
	{
		symbol: "CRO",
		address: "0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b",
		decimals: 8
	},
	{
		symbol: "CRON.CX",
		address: "0x66AD96678A8f9f2e91DFf81457Ddf2654aE22183",
		decimals: 8
	},
	{
		symbol: "CROWD",
		address: "0x26C0E6F69B18125F68AC55f439b1E10C2A2e5c03",
		decimals: 8
	},
	{
		symbol: "CRPT",
		address: "0x08389495D7456E1951ddF7c3a1314A4bfb646d8B",
		decimals: 18
	},
	{
		symbol: "CRPT",
		address: "0x80A7E048F37A50500351C204Cb407766fA3baE7f",
		decimals: 18
	},
	{
		symbol: "CRS",
		address: "0x91264366d679Ff09Bbc07A2B58e3E2d9C002eEff",
		decimals: 18
	},
	{
		symbol: "CRS",
		address: "0xEc7D3E835dA3F6118079fA9a236b267D044FD7cA",
		decimals: 18
	},
	{
		symbol: "CRT",
		address: "0xF0da1186a4977226b9135d0613ee72e229EC3F4d",
		decimals: 18
	},
	{
		symbol: "CRT",
		address: "0x2E6C1C08eF1173d2bE02165f91CC8e604eC5A1C3",
		decimals: 18
	},
	{
		symbol: "CRTM",
		address: "0xA119F0F5FD06ebaDfF8883c0f3C40b2d22e7A44f",
		decimals: 8
	},
	{
		symbol: "CRTS",
		address: "0x825a64810e3EE35bD64c940140eA91a609608ABE",
		decimals: 18
	},
	{
		symbol: "CRU",
		address: "0x32a7C02e79c4ea1008dD6564b35F131428673c41",
		decimals: 18
	},
	{
		symbol: "CRU",
		address: "0xFbC1473E245b8AfBbA3b46116e0B01f91A026633",
		decimals: 0
	},
	{
		symbol: "CRV",
		address: "0x69F64d814Aa278825997e71738120392993973A4",
		decimals: 8
	},
	{
		symbol: "CRV",
		address: "0xD533a949740bb3306d119CC777fa900bA034cd52",
		decimals: 18
	},
	{
		symbol: "CRVT",
		address: "0x0Eb6E56aAcae6A21BdE99c826ac798D225488C3D",
		decimals: 18
	},
	{
		symbol: "crYETH",
		address: "0x01da76DEa59703578040012357b81ffE62015C2d",
		decimals: 8
	},
	{
		symbol: "CRYPTO",
		address: "0x7875bAfc5d63Fa035DeA0809c2a57A382d772903",
		decimals: 18
	},
	{
		symbol: "crYYCRV",
		address: "0x4EE15f44c6F0d8d1136c83EfD2e8E4AC768954c6",
		decimals: 8
	},
	{
		symbol: "CS",
		address: "0x46b9Ad944d1059450Da1163511069C718F699D31",
		decimals: 6
	},
	{
		symbol: "CSAC",
		address: "0x93c564D4cC593867DAaE181Eb3B494A2362b1ec5",
		decimals: 8
	},
	{
		symbol: "CSAI",
		address: "0xF5DCe57282A584D2746FaF1593d3121Fcac444dC",
		decimals: 8
	},
	{
		symbol: "CSCC",
		address: "0xa1DdA546100Ec31f8Ac5c37eECE894CA863e9596",
		decimals: 8
	},
	{
		symbol: "CSCJ",
		address: "0xD375EeD3549CbC8243358EF3Bd6026e2c2DC8e53",
		decimals: 9
	},
	{
		symbol: "CSCO.CX",
		address: "0x4Cb925EC5E2c52269c1A4F91Cc3CB4bF5671b71f",
		decimals: 8
	},
	{
		symbol: "CSM",
		address: "0xD8698a985B89650d0A70f99AD2909bD0c0b4b51c",
		decimals: 18
	},
	{
		symbol: "CSNO",
		address: "0x29D75277aC7F0335b2165D0895E8725cbF658d73",
		decimals: 8
	},
	{
		symbol: "CSNP",
		address: "0x96Ee9B27f822D71aE9cbF06773A878b41308C396",
		decimals: 18
	},
	{
		symbol: "CSP",
		address: "0xA6446D655a0c34bC4F05042EE88170D056CBAf45",
		decimals: 18
	},
	{
		symbol: "CST",
		address: "0xBB49A51Ee5a66ca3a8CbE529379bA44Ba67E6771",
		decimals: 18
	},
	{
		symbol: "CTA",
		address: "0x2564C4dF85bbCCEf04B870d42f96bcc627B24957",
		decimals: 18
	},
	{
		symbol: "CTAG",
		address: "0xB0F14f66caE71164D89E8a0cf0875eF2c32Fb660",
		decimals: 8
	},
	{
		symbol: "CTASK",
		address: "0x196c81385Bc536467433014042788Eb707703934",
		decimals: 18
	},
	{
		symbol: "CTAT",
		address: "0xF7461C8D8E469e9c41a9013dC09Ba8AbED66ef65",
		decimals: 8
	},
	{
		symbol: "CTC",
		address: "0xa3EE21C306A700E682AbCdfe9BaA6A08F3820419",
		decimals: 18
	},
	{
		symbol: "CTC",
		address: "0xE3Fa177AcecfB86721Cf6f9f4206bd3Bd672D7d5",
		decimals: 18
	},
	{
		symbol: "CTE",
		address: "0x3E083D08aDa591fe5356c52fBb89FE725fd9D670",
		decimals: 0
	},
	{
		symbol: "CTF",
		address: "0x4545750F39aF6Be4F237B6869D4EccA928Fd5A85",
		decimals: 18
	},
	{
		symbol: "CTG",
		address: "0xC87c5dD86A3d567fF28701886fB0745aaa898da4",
		decimals: 18
	},
	{
		symbol: "CTGBP",
		address: "0x9e7Cf1898EA701eaB2BFa04Ff47BDB09dC6a7D78",
		decimals: 6
	},
	{
		symbol: "CTGC",
		address: "0x9E7D29bd499B6c7da2a5B2EaFCF4A39d3BD845D1",
		decimals: 18
	},
	{
		symbol: "CTI",
		address: "0x8c18D6a985Ef69744b9d57248a45c0861874f244",
		decimals: 18
	},
	{
		symbol: "CTIC3",
		address: "0x430fEE8eA3DF2a9a34Fa6621dac5A9D5cCaC355a",
		decimals: 18
	},
	{
		symbol: "CTL",
		address: "0xBf4cFD7d1eDeeEA5f6600827411B41A21eB08abd",
		decimals: 2
	},
	{
		symbol: "CTLT.CX",
		address: "0x2Af65D46fdECBBa6F49209ff3Ace031080da0bEE",
		decimals: 8
	},
	{
		symbol: "CTO",
		address: "0x2f4eFc52b8aA56F18df95b1472c664D3762CD4B6",
		decimals: 18
	},
	{
		symbol: "CTRT",
		address: "0x8606a8F28e1e2FD50B9074d65C01548B1F040B32",
		decimals: 8
	},
	{
		symbol: "CTS",
		address: "0x57e83505827788c9F92bCfd398A51A7b0C83DD8e",
		decimals: 18
	},
	{
		symbol: "CTSI",
		address: "0x491604c0FDF08347Dd1fa4Ee062a822A5DD06B5D",
		decimals: 18
	},
	{
		symbol: "CTT",
		address: "0x1A4743Cf1af4C289351390A2B3fe7c13D2F7C235",
		decimals: 18
	},
	{
		symbol: "CTX",
		address: "0x662aBcAd0b7f345AB7FfB1b1fbb9Df7894f18e66",
		decimals: 18
	},
	{
		symbol: "CTXC",
		address: "0xEa11755Ae41D889CeEc39A63E6FF75a02Bc1C00d",
		decimals: 18
	},
	{
		symbol: "CTZ",
		address: "0x07a80063d0A47d958A000593c1EB6bDC9C2ebf86",
		decimals: 18
	},
	{
		symbol: "CUAN",
		address: "0xEdF44412B47A76e452FD133794e45d9485E4cd4b",
		decimals: 18
	},
	{
		symbol: "CUB",
		address: "0xa8892bfc33FA44053a9E402B1839966f4FEc74A4",
		decimals: 18
	},
	{
		symbol: "CUDOS",
		address: "0x817bbDbC3e8A1204f3691d14bB44992841e3dB35",
		decimals: 18
	},
	{
		symbol: "CUNI",
		address: "0x35A18000230DA775CAc24873d00Ff85BccdeD550",
		decimals: 8
	},
	{
		symbol: "CUR",
		address: "0x13339fD07934CD674269726EdF3B5ccEE9DD93de",
		decimals: 18
	},
	{
		symbol: "CUR",
		address: "0x347A29EA126A746c70E1eAd570fdDf438E66231a",
		decimals: 18
	},
	{
		symbol: "CUR8",
		address: "0x490DBf7884B8e13c2161448b83Dd2d8909dB48eD",
		decimals: 8
	},
	{
		symbol: "CURA",
		address: "0x1dABF6Ab0eB8E4208E7E9302CeC7A014068952e4",
		decimals: 8
	},
	{
		symbol: "CURA",
		address: "0x0a4b2d4B48a63088e0897a3F147Ba37f81a27722",
		decimals: 18
	},
	{
		symbol: "CUSD",
		address: "0x5C406D99E04B8494dc253FCc52943Ef82bcA7D75",
		decimals: 6
	},
	{
		symbol: "CUSDC",
		address: "0x39AA39c021dfbaE8faC545936693aC917d5E7563",
		decimals: 8
	},
	{
		symbol: "CUSDT",
		address: "0x39AB32006Afe65A0B4D6A9A89877c2c33ad19EB5",
		decimals: 6
	},
	{
		symbol: "CUSDT",
		address: "0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9",
		decimals: 8
	},
	{
		symbol: "CUTE",
		address: "0x047686fB287e7263A23873dEa66b4501015a2226",
		decimals: 18
	},
	{
		symbol: "cV",
		address: "0xdA6cb58A0D0C01610a29c5A65c303e13e885887C",
		decimals: 18
	},
	{
		symbol: "CV",
		address: "0x50bC2Ecc0bfDf5666640048038C1ABA7B7525683",
		decimals: 18
	},
	{
		symbol: "CVA",
		address: "0x78A52E12c7b63d05c12F9608307587CF654EC3d0",
		decimals: 18
	},
	{
		symbol: "CVC",
		address: "0x41e5560054824eA6B0732E656E3Ad64E20e94E45",
		decimals: 8
	},
	{
		symbol: "CVD",
		address: "0x6B466B0232640382950c45440Ea5b630744eCa99",
		decimals: 0
	},
	{
		symbol: "CVDA",
		address: "0x5269ED15EdD821DF35b5434ECBebF7460F4e917b",
		decimals: 18
	},
	{
		symbol: "CVH",
		address: "0x52DB8ebF894036ec997Da693C5fa237A4fb69d10",
		decimals: 18
	},
	{
		symbol: "CVL",
		address: "0x01FA555c97D7958Fa6f771f3BbD5CCD508f81e22",
		decimals: 18
	},
	{
		symbol: "CVNT",
		address: "0x6400B5522f8D448C0803e6245436DD1c81dF09ce",
		decimals: 8
	},
	{
		symbol: "CVP",
		address: "0x19fd4C760A7d4a38aeE9F226035cbC9Fdf434FFe",
		decimals: 18
	},
	{
		symbol: "CVP",
		address: "0x38e4adB44ef08F22F5B5b76A8f0c2d0dCbE7DcA1",
		decimals: 18
	},
	{
		symbol: "CVR",
		address: "0x2578A20A07E8761d91D0961D3Ea92e14510885aa",
		decimals: 18
	},
	{
		symbol: "CVR",
		address: "0x3C03b4EC9477809072FF9CC9292C9B25d4A8e6c6",
		decimals: 18
	},
	{
		symbol: "CVS",
		address: "0xdB56448fE2635f7912287cd619E7eD3d93180f25",
		decimals: 18
	},
	{
		symbol: "CVS.CX",
		address: "0x90a1Ef62b5f71be34C68eF0a5F593CF21034158c",
		decimals: 8
	},
	{
		symbol: "CVT",
		address: "0xBe428c3867F05deA2A89Fc76a102b544eaC7f772",
		decimals: 18
	},
	{
		symbol: "CVX",
		address: "0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B",
		decimals: 18
	},
	{
		symbol: "CVXCRV",
		address: "0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7",
		decimals: 18
	},
	{
		symbol: "CWBTC",
		address: "0xC11b1268C1A384e55C48c2391d8d480264A3A7F4",
		decimals: 8
	},
	{
		symbol: "CWS",
		address: "0xaC0104Cca91D167873B8601d2e71EB3D4D8c33e0",
		decimals: 18
	},
	{
		symbol: "CWV",
		address: "0xED494c9e2F8E34e53BDD0EA9B4d80305cb15C5c2",
		decimals: 18
	},
	{
		symbol: "CXC",
		address: "0x2134057C0b461F898D375Cead652Acae62b59541",
		decimals: 18
	},
	{
		symbol: "CXGC",
		address: "0xdd6eEf0507f10d21F716e36D8B1Aae76A4FA3F62",
		decimals: 18
	},
	{
		symbol: "CXN",
		address: "0xb48E0F69e6A3064f5498D495F77AD83e0874ab28",
		decimals: 18
	},
	{
		symbol: "CXO",
		address: "0xD776291eC1ae42D57642b9C512832d880edc668B",
		decimals: 18
	},
	{
		symbol: "CXO",
		address: "0xb6EE9668771a79be7967ee29a63D4184F8097143",
		decimals: 18
	},
	{
		symbol: "CYBG",
		address: "0x00b8B059F132009E5a812F27cc42733d135915df",
		decimals: 18
	},
	{
		symbol: "CYCLE",
		address: "0xfE831929098B5FF5d736105bD68BA9460EF07207",
		decimals: 18
	},
	{
		symbol: "CYF",
		address: "0xdB33d49b5a41A97D296B7242a96ebd8AC77B3Bb8",
		decimals: 18
	},
	{
		symbol: "CYFM",
		address: "0x3f06B5D78406cD97bdf10f5C420B241D32759c80",
		decimals: 18
	},
	{
		symbol: "CYL",
		address: "0x26CB3641aaA43911f1D4cB2ce544eb652AAc7c47",
		decimals: 18
	},
	{
		symbol: "CYMT",
		address: "0x78c292D1445E6b9558bf42e8BC369271DeD062eA",
		decimals: 8
	},
	{
		symbol: "cyUSD",
		address: "0x1D09144F3479bb805CB7c92346987420BcbDC10C",
		decimals: 18
	},
	{
		symbol: "cyUSD",
		address: "0x867072D6245467EdFdBd0FC8E9f2bF0701F40F94",
		decimals: 18
	},
	{
		symbol: "CZR",
		address: "0x0223fc70574214F65813fE336D870Ac47E147fAe",
		decimals: 18
	},
	{
		symbol: "CZRX",
		address: "0xB3319f5D18Bc0D84dD1b4825Dcde5d5f7266d407",
		decimals: 8
	},
	{
		symbol: "DAB",
		address: "0xdab0C31BF34C897Fb0Fe90D12EC9401caf5c36Ec",
		decimals: 0
	},
	{
		symbol: "DACC",
		address: "0xF8C595D070d104377f58715ce2E6C93E49a87f3c",
		decimals: 6
	},
	{
		symbol: "DACS",
		address: "0xA31108E5BAB5494560Db34c95492658AF239357C",
		decimals: 18
	},
	{
		symbol: "DAFI",
		address: "0xFc979087305A826c2B2a0056cFAbA50aad3E6439",
		decimals: 18
	},
	{
		symbol: "DAG",
		address: "0xA8258AbC8f2811dd48EccD209db68F25E3E34667",
		decimals: 8
	},
	{
		symbol: "DAGT",
		address: "0x56D1aE30c97288DA4B58BC39F026091778e4E316",
		decimals: 18
	},
	{
		symbol: "DAI",
		address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
		decimals: 18
	},
	{
		symbol: "DAI.CX",
		address: "0x60d9564303c70d3f040Ea9393D98D94f767D020C",
		decimals: 8
	},
	{
		symbol: "DAIX",
		address: "0x719cA90842a9F4D4FB52251db88703e4Bc4a07cA",
		decimals: 18
	},
	{
		symbol: "DAKU",
		address: "0xA353d00fa6D940Cb625045d74FEF8406854dd0DA",
		decimals: 18
	},
	{
		symbol: "DALC",
		address: "0x07D9e49Ea402194bf48A8276dAfB16E4eD633317",
		decimals: 8
	},
	{
		symbol: "DAM",
		address: "0xF80D589b3Dbe130c270a69F1a69D050f268786Df",
		decimals: 18
	},
	{
		symbol: "DAN",
		address: "0x9B70740e708a083C6fF38Df52297020f5DfAa5EE",
		decimals: 10
	},
	{
		symbol: "DANDY",
		address: "0x9Dfc4B433D359024Eb3E810d77d60fbE8B0d9B82",
		decimals: 18
	},
	{
		symbol: "DANT",
		address: "0xbE3c393Fb670f0A29C3F3E660FFB113200e36676",
		decimals: 18
	},
	{
		symbol: "DAO",
		address: "0x0f51bb10119727a7e5eA3538074fb341F56B09Ad",
		decimals: 18
	},
	{
		symbol: "DAOFI",
		address: "0xD82BB924a1707950903e2C0a619824024e254cD1",
		decimals: 18
	},
	{
		symbol: "DAPPT",
		address: "0x386cABc0b14A507A4e024DEA15554342865B20DE",
		decimals: 18
	},
	{
		symbol: "DAPPT",
		address: "0x96184d9C811Ea0624fC30C80233B1d749B9E485B",
		decimals: 18
	},
	{
		symbol: "DART",
		address: "0x5a4623F305A8d7904ED68638AF3B4328678edDBF",
		decimals: 18
	},
	{
		symbol: "DAT",
		address: "0x81c9151de0C8bafCd325a57E3dB5a5dF1CEBf79c",
		decimals: 18
	},
	{
		symbol: "DATA",
		address: "0x0Cf0Ee63788A0849fE5297F3407f701E122cC023",
		decimals: 18
	},
	{
		symbol: "DATA",
		address: "0x1B5f21ee98eed48d292e8e2d3Ed82b40a9728A22",
		decimals: 18
	},
	{
		symbol: "DATP",
		address: "0x813b428aF3920226E059B68A62e4c04933D4eA7a",
		decimals: 8
	},
	{
		symbol: "DATX",
		address: "0xaBbBB6447B68ffD6141DA77C18c7B5876eD6c5ab",
		decimals: 18
	},
	{
		symbol: "DAV",
		address: "0xd82Df0ABD3f51425Eb15ef7580fDA55727875f14",
		decimals: 18
	},
	{
		symbol: "DAWN",
		address: "0x580c8520dEDA0a441522AEAe0f9F7A5f29629aFa",
		decimals: 18
	},
	{
		symbol: "DAX",
		address: "0x0B4BdC478791897274652DC15eF5C135cae61E60",
		decimals: 18
	},
	{
		symbol: "DAXT",
		address: "0x61725f3db4004AFE014745B21DAb1E1677CC328b",
		decimals: 18
	},
	{
		symbol: "DAY",
		address: "0xE814aeE960a85208C3dB542C53E7D4a6C8D5f60F",
		decimals: 18
	},
	{
		symbol: "DAY",
		address: "0xe26668cC7Ce5239304B5af8F54B4bd57D11084D2",
		decimals: 18
	},
	{
		symbol: "DBB",
		address: "0x976010DB5538f0c1Daf9f3855b8504721a23e5D4",
		decimals: 18
	},
	{
		symbol: "DBET",
		address: "0x9b68bFaE21DF5A510931A262CECf63f41338F264",
		decimals: 18
	},
	{
		symbol: "DBK.CX",
		address: "0xf99Af7443Fefa14E9d42CE935A575B8d1aac06B3",
		decimals: 8
	},
	{
		symbol: "DBLK",
		address: "0x526Ccc90191A9472299323816bD2c784C0A1BCDE",
		decimals: 18
	},
	{
		symbol: "DBT",
		address: "0xeC79E0eFA4ae3d8B3C9fbCEe21683c7f2e507b66",
		decimals: 18
	},
	{
		symbol: "DBT",
		address: "0xC28D4341Ad8224E1a424558074eF0B4515f424d5",
		decimals: 0
	},
	{
		symbol: "DBX.CX",
		address: "0xDaba2cdC53fbFc7EF00ce427dE493c679A6DB151",
		decimals: 8
	},
	{
		symbol: "DBY",
		address: "0x7c82a76DB0166b0e153A66B1A4c331970B2b0EE2",
		decimals: 18
	},
	{
		symbol: "DCA",
		address: "0x18aa7c90d3ae4C5BB219d0a2813F441704084625",
		decimals: 18
	},
	{
		symbol: "DCA",
		address: "0xA6281838f4A9c5736b2aa1cba9260D3F879623cA",
		decimals: 18
	},
	{
		symbol: "DCA",
		address: "0x386Faa4703a34a7Fdb19Bec2e14Fd427C9638416",
		decimals: 18
	},
	{
		symbol: "DCB",
		address: "0x2D8e1dd483008c6843b9CF644Bad7fB25bF52b84",
		decimals: 18
	},
	{
		symbol: "DCC",
		address: "0xFFa93Aacf49297D51E211817452839052FDFB961",
		decimals: 18
	},
	{
		symbol: "DCL",
		address: "0x399A0e6FbEb3d74c85357439f4c8AeD9678a5cbF",
		decimals: 3
	},
	{
		symbol: "DCN",
		address: "0x08d32b0da63e2C3bcF8019c9c5d849d7a9d791e6",
		decimals: 0
	},
	{
		symbol: "DCNT",
		address: "0x0Ce6d5a093d4166237C7A9ff8E0553B0293214a1",
		decimals: 18
	},
	{
		symbol: "DCS",
		address: "0xbdeD3f7537E75D6c38C036a3A788A549AfdE12B1",
		decimals: 8
	},
	{
		symbol: "DCX",
		address: "0x199c3DdedB0e91dB3897039AF27c23286269F088",
		decimals: 8
	},
	{
		symbol: "DDAI",
		address: "0x02285AcaafEB533e03A7306C55EC031297df9224",
		decimals: 18
	},
	{
		symbol: "DDAM",
		address: "0xd5dC8921A5c58FB0ebA6db6b40Eab40283Dc3C01",
		decimals: 9
	},
	{
		symbol: "DDD",
		address: "0x9F5F3CFD7a32700C93F971637407ff17b91c7342",
		decimals: 18
	},
	{
		symbol: "DDF",
		address: "0xcC4eF9EEAF656aC1a2Ab886743E98e97E090ed38",
		decimals: 18
	},
	{
		symbol: "DDIM",
		address: "0xFbEEa1C75E4c4465CB2FCCc9c6d6afe984558E20",
		decimals: 18
	},
	{
		symbol: "DDOG.CX",
		address: "0xC8dfB3BBa61c150e6a0f8B6c85A5207EC92adEa7",
		decimals: 8
	},
	{
		symbol: "DDX",
		address: "0x3A880652F47bFaa771908C07Dd8673A787dAEd3A",
		decimals: 18
	},
	{
		symbol: "DE.CX",
		address: "0xc94537De4B1DEf7C6664c3d9aA7Cb5549953DC4f",
		decimals: 8
	},
	{
		symbol: "DEA",
		address: "0x80aB141F324C3d6F2b18b030f1C4E95d4d658778",
		decimals: 18
	},
	{
		symbol: "DEB",
		address: "0x151202C9c18e495656f372281F493EB7698961D5",
		decimals: 18
	},
	{
		symbol: "DEBASE",
		address: "0x9248c485b0B80f76DA451f167A8db30F33C70907",
		decimals: 18
	},
	{
		symbol: "DEC",
		address: "0x30f271C9E86D2B7d00a6376Cd96A1cFBD5F0b9b3",
		decimals: 18
	},
	{
		symbol: "DEC2",
		address: "0x89c6c856a6db3e46107163D0cDa7A7FF211BD655",
		decimals: 18
	},
	{
		symbol: "DECH",
		address: "0xA740684C9022dc07540031b10dD57984640bAbef",
		decimals: 18
	},
	{
		symbol: "DED",
		address: "0xF3Dd98c8716Fe4C8A559Eeef84C5fE1fE697cdcE",
		decimals: 18
	},
	{
		symbol: "DEEP",
		address: "0x6CbEDEc4F1ac9D874987D2769596544E0d9161ab",
		decimals: 18
	},
	{
		symbol: "DEFI",
		address: "0x98b2dE885E916b598f65DeD2fDbb63187EAEf184",
		decimals: 18
	},
	{
		symbol: "DEFI++",
		address: "0x8D1ce361eb68e9E05573443C407D4A3Bed23B033",
		decimals: 18
	},
	{
		symbol: "DEFI+L",
		address: "0x78F225869c08d478c34e5f645d07A87d3fe8eb78",
		decimals: 18
	},
	{
		symbol: "DEFI+S",
		address: "0xaD6A626aE2B43DCb1B39430Ce496d2FA0365BA9C",
		decimals: 18
	},
	{
		symbol: "DEFI5",
		address: "0xfa6de2697D59E88Ed7Fc4dFE5A33daC43565ea41",
		decimals: 18
	},
	{
		symbol: "DEFL",
		address: "0x4eC2eFb9cBd374786A03261E46ffce1a67756f3B",
		decimals: 18
	},
	{
		symbol: "DEFLCT",
		address: "0x3Aa5f749d4a6BCf67daC1091Ceb69d1F5D86fA53",
		decimals: 9
	},
	{
		symbol: "DEGEN",
		address: "0x126c121f99e1E211dF2e5f8De2d96Fa36647c855",
		decimals: 18
	},
	{
		symbol: "DEGO",
		address: "0x88EF27e69108B2633F8E1C184CC37940A075cC02",
		decimals: 18
	},
	{
		symbol: "DEGOV",
		address: "0x469E66e06fEc34839E5eB1273ba85A119B8D702F",
		decimals: 18
	},
	{
		symbol: "DELTA",
		address: "0xDE1E0AE6101b46520cF66fDC0B1059c5cC3d106c",
		decimals: 8
	},
	{
		symbol: "DEMA",
		address: "0x229d1eD07310A9Aaaf7bDa570825B0c4089b88ad",
		decimals: 18
	},
	{
		symbol: "DENCH",
		address: "0x4b7265D153886a7Dc717e815862AcDE6FF7B5bc8",
		decimals: 18
	},
	{
		symbol: "DENT",
		address: "0x3597bfD533a99c9aa083587B074434E61Eb0A258",
		decimals: 8
	},
	{
		symbol: "DEON",
		address: "0x830aae63669205Ec1aB738fCC159f4977b06dCd6",
		decimals: 8
	},
	{
		symbol: "DEP",
		address: "0x1A3496C18d558bd9C6C8f609E1B129f67AB08163",
		decimals: 18
	},
	{
		symbol: "DEPO",
		address: "0x7cF271966F36343Bf0150F25E5364f7961c58201",
		decimals: 0
	},
	{
		symbol: "DEPO",
		address: "0x89cbeAC5E8A13F0Ebb4C74fAdFC69bE81A501106",
		decimals: 18
	},
	{
		symbol: "DESC",
		address: "0x05D072CBD90C132E2c4CfDDd2aD2cbe018Ec62fc",
		decimals: 18
	},
	{
		symbol: "DESH",
		address: "0x95bA34760ac3D7fBE98ee8b2AB33b4F1a6D18878",
		decimals: 18
	},
	{
		symbol: "DET",
		address: "0x1e3fE98D1C89865b6b819bbfD532dAdab3b34d2D",
		decimals: 18
	},
	{
		symbol: "DET",
		address: "0xF4e4F9E5BA2B0892c289ef2de60ca44e1f6B2527",
		decimals: 8
	},
	{
		symbol: "DET",
		address: "0xa4C9D058a462936a1FAAdAC012DF99D9bDD71F41",
		decimals: 8
	},
	{
		symbol: "DETS",
		address: "0xd379700999F4805Ce80aa32DB46A94dF64561108",
		decimals: 18
	},
	{
		symbol: "DEUS",
		address: "0x3b62F3820e0B035cc4aD602dECe6d796BC325325",
		decimals: 18
	},
	{
		symbol: "DEV",
		address: "0x98626E2C9231f03504273d55f397409deFD4a093",
		decimals: 18
	},
	{
		symbol: "DEV",
		address: "0x5cAf454Ba92e6F2c929DF14667Ee360eD9fD5b26",
		decimals: 18
	},
	{
		symbol: "Devcon2",
		address: "0xdd94De9cFE063577051A5eb7465D08317d8808B6",
		decimals: 0
	},
	{
		symbol: "DEW",
		address: "0x20E94867794dBA030Ee287F1406E100d03C84Cd3",
		decimals: 18
	},
	{
		symbol: "DEX",
		address: "0x3516415161C478DF10ADBb8bb884Cc83FbD5F11a",
		decimals: 18
	},
	{
		symbol: "DEX",
		address: "0x497bAEF294c11a5f0f5Bea3f2AdB3073DB448B56",
		decimals: 18
	},
	{
		symbol: "DEXE",
		address: "0xde4EE8057785A7e8e800Db58F9784845A5C2Cbd6",
		decimals: 18
	},
	{
		symbol: "DEXG",
		address: "0xB81D70802a816B5DacBA06D708B5acF19DcD436D",
		decimals: 18
	},
	{
		symbol: "DEXM",
		address: "0x0020d80229877b495D2bf3269a4c13f6f1e1B9D3",
		decimals: 18
	},
	{
		symbol: "DEXT",
		address: "0x26CE25148832C04f3d7F26F32478a9fe55197166",
		decimals: 18
	},
	{
		symbol: "DEXT",
		address: "0x72D530016E9E0fc23DE6C1f7f487992c879518Dc",
		decimals: 1
	},
	{
		symbol: "DEXTF",
		address: "0x5F64Ab1544D28732F0A24F4713c2C8ec0dA089f0",
		decimals: 18
	},
	{
		symbol: "DF",
		address: "0x431ad2ff6a9C365805eBaD47Ee021148d6f7DBe0",
		decimals: 18
	},
	{
		symbol: "DF",
		address: "0xA73862C5A66CF3BE4BF86f60ACF085Bd927F83F8",
		decimals: 8
	},
	{
		symbol: "DFC",
		address: "0xFf362c6A335E373633f1677540aAC6917208Dc0D",
		decimals: 8
	},
	{
		symbol: "DFD",
		address: "0x20c36f062a31865bED8a5B1e512D9a1A20AA333A",
		decimals: 18
	},
	{
		symbol: "DFGL",
		address: "0xE3a64A3c4216B83255b53Ec7eA078B13f21a7daD",
		decimals: 18
	},
	{
		symbol: "DFINE",
		address: "0xe666bCf60BdCFDC66fEa10F27Eab84E3f255Ef72",
		decimals: 18
	},
	{
		symbol: "DFIO",
		address: "0xeE3b9B531F4C564c70e14B7b3BB7D516f33513ff",
		decimals: 18
	},
	{
		symbol: "DFK",
		address: "0xA17De0ab0a97Bc5e56fa8b39eBFc81CC3F1f349E",
		decimals: 18
	},
	{
		symbol: "DFL",
		address: "0x8F32CBcC9cAB6A748829f8DE41a46d02D995dAbC",
		decimals: 8
	},
	{
		symbol: "DFLY",
		address: "0x70A6D0D1561Ba98711e935a76B1C167C612978a2",
		decimals: 9
	},
	{
		symbol: "DFM",
		address: "0x0ccD5DD52Dee42B171a623478e5261C1eaaE092A",
		decimals: 18
	},
	{
		symbol: "DFO",
		address: "0x1640BD2898Eee4C36F369836a067deA8725ac0Cc",
		decimals: 8
	},
	{
		symbol: "DFP",
		address: "0xF9520516c8e16Fd500DFF0c27916c81FaDb67341",
		decimals: 8
	},
	{
		symbol: "DFS",
		address: "0xcec38306558a31cdbb2a9d6285947C5b44A24f3e",
		decimals: 18
	},
	{
		symbol: "DFSOCIAL",
		address: "0x54ee01beB60E745329E6a8711Ad2D6cb213e38d7",
		decimals: 18
	},
	{
		symbol: "DFT",
		address: "0xA2A54f1Ec1f09316eF12c1770D32ed8F21B1Fb6A",
		decimals: 8
	},
	{
		symbol: "DFT",
		address: "0xB6eE603933E024d8d53dDE3faa0bf98fE2a3d6f1",
		decimals: 18
	},
	{
		symbol: "DFX",
		address: "0xf1f5De69C9C8D9BE8a7B01773Cc1166D4Ec6Ede2",
		decimals: 18
	},
	{
		symbol: "DG",
		address: "0xEE06A81a695750E71a662B51066F2c74CF4478a0",
		decimals: 18
	},
	{
		symbol: "DG.CX",
		address: "0x5ad616A2dde10dAf9A4dFEeeb2CbBA59661f1390",
		decimals: 8
	},
	{
		symbol: "DGC",
		address: "0x2FB3D7f7DD7027F7E7ef32fe09e4C94CA3CC6E9C",
		decimals: 0
	},
	{
		symbol: "DGCL",
		address: "0x63B8b7d4A3EFD0735c4BFFBD95B332a55e4eB851",
		decimals: 18
	},
	{
		symbol: "DGD",
		address: "0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A",
		decimals: 9
	},
	{
		symbol: "DGMT",
		address: "0x0d4b4DA5fb1a7d55E85f8e22f728701cEB6E44C9",
		decimals: 18
	},
	{
		symbol: "DGN",
		address: "0xa063341D10054188e3Cb715Bfb663b37C0c1515e",
		decimals: 6
	},
	{
		symbol: "DGN",
		address: "0x7461C43bb1E96863233D72A09191008ee9217Ee8",
		decimals: 18
	},
	{
		symbol: "DGNN",
		address: "0xEe87b220d9b0e762f0643C501fADeFd6d9cc5B7E",
		decimals: 18
	},
	{
		symbol: "DGP",
		address: "0x927159670C50042109d7C0f4aEd0Cee89452433E",
		decimals: 18
	},
	{
		symbol: "DGPT",
		address: "0xf6cFe53d6FEbaEEA051f400ff5fc14F0cBBDacA1",
		decimals: 18
	},
	{
		symbol: "DGS",
		address: "0x6aEDbF8dFF31437220dF351950Ba2a3362168d1b",
		decimals: 8
	},
	{
		symbol: "DGT",
		address: "0x6380EBE960aa587164B07E58eD04077CE64279c0",
		decimals: 18
	},
	{
		symbol: "DGTX",
		address: "0x1C83501478f1320977047008496DACBD60Bb15ef",
		decimals: 18
	},
	{
		symbol: "DGTX",
		address: "0xc666081073E8DfF8D3d1c2292A29aE1A2153eC09",
		decimals: 18
	},
	{
		symbol: "DGVC",
		address: "0x26E43759551333e57F073bb0772F50329A957b30",
		decimals: 18
	},
	{
		symbol: "DGW",
		address: "0x87B87A7583D8d8F15b58Bdd290318386Ac8eE174",
		decimals: 18
	},
	{
		symbol: "DGX",
		address: "0x4f3AfEC4E5a3F2A6a1A411DEF7D7dFe50eE057bF",
		decimals: 9
	},
	{
		symbol: "DHC",
		address: "0x152687Bc4A7FCC89049cF119F9ac3e5aCF2eE7ef",
		decimals: 18
	},
	{
		symbol: "DHG.CX",
		address: "0x03b10BE8aca24879C5D7196163cb0e4cE22C2503",
		decimals: 8
	},
	{
		symbol: "DHR.CX",
		address: "0xa2060391990368CD595496FF0145F425333c1291",
		decimals: 8
	},
	{
		symbol: "DHT",
		address: "0xca1207647Ff814039530D7d35df0e1Dd2e91Fa84",
		decimals: 18
	},
	{
		symbol: "DHT",
		address: "0xcC771a11d368A76E6FA34B3AaB8227297F48fE41",
		decimals: 18
	},
	{
		symbol: "DIA",
		address: "0x84cA8bc7997272c7CfB4D0Cd3D55cd942B3c9419",
		decimals: 18
	},
	{
		symbol: "DICE",
		address: "0x2e071D2966Aa7D8dECB1005885bA1977D6038A65",
		decimals: 16
	},
	{
		symbol: "DICO",
		address: "0xA89FD5459C67AfC8727C07333ED830643Cf898B6",
		decimals: 8
	},
	{
		symbol: "DIGG",
		address: "0x798D1bE841a82a273720CE31c822C61a67a601C3",
		decimals: 9
	},
	{
		symbol: "DIGI",
		address: "0xE03B4386b75E121e04D580D6b8376CEeE0615ca8",
		decimals: 18
	},
	{
		symbol: "DIGIX",
		address: "0x55b9a11c2e8351b4Ffc7b11561148bfaC9977855",
		decimals: 0
	},
	{
		symbol: "DIP",
		address: "0xc719d010B63E5bbF2C0551872CD5316ED26AcD83",
		decimals: 18
	},
	{
		symbol: "DIP",
		address: "0x97af10D3fc7C70F67711Bf715d8397C6Da79C1Ab",
		decimals: 12
	},
	{
		symbol: "DIRTY",
		address: "0x4faB740779C73aA3945a5CF6025bF1b0e7F6349C",
		decimals: 18
	},
	{
		symbol: "DIS.CX",
		address: "0x9D8a4a7eb39EcE343f99eF25b1Df38A08311d371",
		decimals: 8
	},
	{
		symbol: "DISTX",
		address: "0x4B4701f3f827E1331fb22FF8e2BEaC24b17Eb055",
		decimals: 18
	},
	{
		symbol: "DIT",
		address: "0xf14922001A2FB8541a433905437ae954419C2439",
		decimals: 8
	},
	{
		symbol: "DIVM",
		address: "0x2449224f42cE230c5b67e1d48BDcEB224B0F72D7",
		decimals: 18
	},
	{
		symbol: "DIVX",
		address: "0x13f11C9905A08ca76e3e853bE63D4f0944326C72",
		decimals: 18
	},
	{
		symbol: "DIW",
		address: "0xa253be28580Ae23548a4182D95bf8201c28369a8",
		decimals: 18
	},
	{
		symbol: "DKA",
		address: "0x5dc60C4D5e75D22588FA17fFEB90A63E535efCE0",
		decimals: 18
	},
	{
		symbol: "DKYC",
		address: "0x38d1B0D157529Bd5D936719A8a5F8379aFB24fAA",
		decimals: 18
	},
	{
		symbol: "DLPH.CX",
		address: "0xC5Ef726e7f244522876Fee3292dB6557b6b854C9",
		decimals: 8
	},
	{
		symbol: "DLT",
		address: "0x07e3c70653548B04f0A75970C1F81B4CBbFB606f",
		decimals: 18
	},
	{
		symbol: "DLT",
		address: "0xAeea2ebC48178af826986314280dA3D6743E6766",
		decimals: 6
	},
	{
		symbol: "DLTR.CX",
		address: "0x8B47b1698625D0734022de17afC2457d35205E87",
		decimals: 8
	},
	{
		symbol: "DMG",
		address: "0xEd91879919B71bB6905f23af0A68d231EcF87b14",
		decimals: 18
	},
	{
		symbol: "DMHCO",
		address: "0x5C679a0a79D495aFFe049c02483519D51e37F32b",
		decimals: 18
	},
	{
		symbol: "DML",
		address: "0xbCdfE338D55c061C084D81fD793Ded00A27F226D",
		decimals: 18
	},
	{
		symbol: "DMST",
		address: "0xF29992D7b589A0A6bD2de7Be29a97A6EB73EaF85",
		decimals: 18
	},
	{
		symbol: "DMT",
		address: "0x79126d32a86e6663F3aAac4527732d0701c1AE6c",
		decimals: 18
	},
	{
		symbol: "DMT",
		address: "0x2ccbFF3A042c68716Ed2a2Cb0c544A9f1d1935E1",
		decimals: 8
	},
	{
		symbol: "DMTC",
		address: "0x3be6e7bF2cD8E1a0A95597E72ca6D3709bBeFF76",
		decimals: 18
	},
	{
		symbol: "DNA",
		address: "0xef6344de1fcfC5F48c30234C16c1389e8CdC572C",
		decimals: 18
	},
	{
		symbol: "DNA",
		address: "0x82b0E50478eeaFde392D45D1259Ed1071B6fDa81",
		decimals: 18
	},
	{
		symbol: "DNT",
		address: "0x0AbdAce70D3790235af448C88547603b945604ea",
		decimals: 18
	},
	{
		symbol: "DNX",
		address: "0x16f22EEd5DCCed8bF57D28834A75A76Ff5520206",
		decimals: 18
	},
	{
		symbol: "DNX",
		address: "0xE43E2041dc3786e166961eD9484a5539033d10fB",
		decimals: 18
	},
	{
		symbol: "DOB",
		address: "0xC9aFDea326c109D441519d355756f4e88465f94d",
		decimals: 8
	},
	{
		symbol: "DOCK",
		address: "0xE5Dada80Aa6477e85d09747f2842f7993D0Df71C",
		decimals: 18
	},
	{
		symbol: "DODO",
		address: "0x43Dfc4159D86F3A37A5A4B3D4580b888ad7d4DDd",
		decimals: 18
	},
	{
		symbol: "DOGEBULL",
		address: "0x7AA6b33fB7F395DDBca7b7A33264A3c799Fa626f",
		decimals: 18
	},
	{
		symbol: "DOGEFI",
		address: "0x9B9087756eCa997C5D595C840263001c9a26646D",
		decimals: 18
	},
	{
		symbol: "DOGES",
		address: "0xb4FBed161bEbcb37afB1Cb4a6F7cA18b977cCB25",
		decimals: 18
	},
	{
		symbol: "DOGETHER",
		address: "0xB0d761755efC1A7C45391815E0057B9598DdaE18",
		decimals: 18
	},
	{
		symbol: "DOGY",
		address: "0x9c405acf8688AfB61B3197421cDeeC1A266c6839",
		decimals: 18
	},
	{
		symbol: "DOKI",
		address: "0x9cEB84f92A0561fa3Cc4132aB9c0b76A59787544",
		decimals: 18
	},
	{
		symbol: "DOLA",
		address: "0x865377367054516e17014CcdED1e7d814EDC9ce4",
		decimals: 18
	},
	{
		symbol: "DONUT",
		address: "0xC0F9bD5Fa5698B6505F643900FFA515Ea5dF54A9",
		decimals: 18
	},
	{
		symbol: "DOOH",
		address: "0x18C525cce3ad9A48D82F91B874754be78E9d0F85",
		decimals: 18
	},
	{
		symbol: "DOOM",
		address: "0xE1403e2972145D86F66299380ADe23169580beca",
		decimals: 18
	},
	{
		symbol: "DOOMSHIT",
		address: "0x7350383F6367DE8b2E042209AD1ae7e66c863A2C",
		decimals: 18
	},
	{
		symbol: "DOR",
		address: "0x906b3f8b7845840188Eab53c3f5AD348A787752f",
		decimals: 15
	},
	{
		symbol: "DORA",
		address: "0xbc4171f45EF0EF66E76F979dF021a34B46DCc81d",
		decimals: 18
	},
	{
		symbol: "DOS",
		address: "0x70861e862E1Ac0C96f853C8231826e469eAd37B1",
		decimals: 18
	},
	{
		symbol: "DOS",
		address: "0x0A913beaD80F321E7Ac35285Ee10d9d922659cB7",
		decimals: 18
	},
	{
		symbol: "DOTX",
		address: "0xFAb5a05C933f1A2463E334E011992E897D56eF0a",
		decimals: 18
	},
	{
		symbol: "DOUGH",
		address: "0xad32A8e6220741182940c5aBF610bDE99E737b2D",
		decimals: 18
	},
	{
		symbol: "DOV",
		address: "0xac3211a5025414Af2866FF09c23FC18bc97e79b1",
		decimals: 18
	},
	{
		symbol: "DOW",
		address: "0x76974C7B79dC8a6a109Fd71fd7cEb9E40eff5382",
		decimals: 18
	},
	{
		symbol: "DPI",
		address: "0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b",
		decimals: 18
	},
	{
		symbol: "DPN",
		address: "0xFb8Bf095eBcdAd57D2e37573a505E7d3bAFDD3CC",
		decimals: 8
	},
	{
		symbol: "DPP",
		address: "0x01b3Ec4aAe1B8729529BEB4965F27d008788B0EB",
		decimals: 18
	},
	{
		symbol: "DPST",
		address: "0x59EbB83b72d735Ac1ECb824Cb3f8253fA5d49D00",
		decimals: 0
	},
	{
		symbol: "DPT",
		address: "0x10c71515602429C19d53011EA7040B87a4894838",
		decimals: 18
	},
	{
		symbol: "DPY",
		address: "0x6C2adC2073994fb2CCC5032cC2906Fa221e9B391",
		decimals: 18
	},
	{
		symbol: "DRC",
		address: "0xC2e3ED7F61D338755BF7b6fB4bAA0ffFadA4AC28",
		decimals: 18
	},
	{
		symbol: "DRC",
		address: "0xd7f5CABdF696D7d1bf384D7688926A4bdB092c67",
		decimals: 18
	},
	{
		symbol: "DRC",
		address: "0xb78B3320493a4EFaa1028130C5Ba26f0B6085Ef8",
		decimals: 18
	},
	{
		symbol: "DRC",
		address: "0xa150Db9b1Fa65b44799d4dD949D922c0a33Ee606",
		decimals: 0
	},
	{
		symbol: "DRCT",
		address: "0x91CDB5bB5969BFeD2373e97378354052BbC606F2",
		decimals: 18
	},
	{
		symbol: "DREAM",
		address: "0x82f4dED9Cec9B5750FBFf5C2185AEe35AfC16587",
		decimals: 6
	},
	{
		symbol: "DREP",
		address: "0x3aCA71C508e06Dc6B2758DaB6eb20f7654572fb7",
		decimals: 18
	},
	{
		symbol: "DRG",
		address: "0x814F67fA286f7572B041D041b1D99b432c9155Ee",
		decimals: 8
	},
	{
		symbol: "DRGB",
		address: "0x9d3e0892D11f19f5181d4a4C5d04187a9e0d7032",
		decimals: 18
	},
	{
		symbol: "DRGN",
		address: "0x419c4dB4B9e25d6Db2AD9691ccb832C8D9fDA05E",
		decimals: 18
	},
	{
		symbol: "DRGNBEAR",
		address: "0x223FB5c14C00Cfb70cF56BB63c2EeF2d74fE1A78",
		decimals: 18
	},
	{
		symbol: "DRGNBULL",
		address: "0x3335f16AF9008bFd32f1eE6C2Be5d4f84FA0b9da",
		decimals: 18
	},
	{
		symbol: "DRINK",
		address: "0x0089659F609933d16A5Cd6C2be1a5dCA1AbE24aD",
		decimals: 18
	},
	{
		symbol: "DROP",
		address: "0x4672bAD527107471cB5067a887f4656D585a8A31",
		decimals: 18
	},
	{
		symbol: "DROP",
		address: "0x3c75226555FC496168d48B88DF83B95F16771F37",
		decimals: 0
	},
	{
		symbol: "DRP",
		address: "0x621d78f2EF2fd937BFca696CabaF9A779F59B3Ed",
		decimals: 2
	},
	{
		symbol: "DRP",
		address: "0x2799D90C6d44Cb9Aa5fBC377177F16C33E056b82",
		decimals: 0
	},
	{
		symbol: "DRPU",
		address: "0xe30e02f049957e2A5907589e06Ba646fB2c321bA",
		decimals: 8
	},
	{
		symbol: "DRT",
		address: "0x9AF4f26941677C706cfEcf6D3379FF01bB85D5Ab",
		decimals: 8
	},
	{
		symbol: "DRVH",
		address: "0x62D4c04644314F35868Ba4c65cc27a77681dE7a9",
		decimals: 18
	},
	{
		symbol: "DSCOIN",
		address: "0xee395235Ac363725C6B895d8994706cB7050482F",
		decimals: 8
	},
	{
		symbol: "DSCP",
		address: "0x03e3f0c25965f13DbbC58246738C183E27b26a56",
		decimals: 18
	},
	{
		symbol: "DSD",
		address: "0xBD2F0Cd039E0BFcf88901C98c0bFAc5ab27566e3",
		decimals: 18
	},
	{
		symbol: "DSD",
		address: "0x1e3a2446C729D34373B87FD2C9CBb39A93198658",
		decimals: 18
	},
	{
		symbol: "DSLA",
		address: "0x3aFfCCa64c2A6f4e3B6Bd9c64CD2C969EFd1ECBe",
		decimals: 18
	},
	{
		symbol: "DSPC",
		address: "0x1736FaE428eb944A4F0c22016fb60b7EC3A93D41",
		decimals: 18
	},
	{
		symbol: "DSS",
		address: "0x213C53C96A01a89E6Dcc5683cF16473203E17513",
		decimals: 18
	},
	{
		symbol: "DST",
		address: "0x68d53441c0e253f76c500e551bdeA3D102206C9a",
		decimals: 18
	},
	{
		symbol: "DSWAP",
		address: "0x3f344C88d823F180Fb8b44A3C7Cfc4edc92dFa35",
		decimals: 6
	},
	{
		symbol: "DSYS",
		address: "0x10a34bbE9B3C5AD536cA23D5EefA81CA448e92fF",
		decimals: 18
	},
	{
		symbol: "DTA",
		address: "0x69b148395Ce0015C13e36BFfBAd63f49EF874E03",
		decimals: 18
	},
	{
		symbol: "DTC",
		address: "0xb0a181A1154D622DDec62524aB6469E62f84031a",
		decimals: 8
	},
	{
		symbol: "DTE",
		address: "0x605Ec235C045915f7E18051697c9530659Df8757",
		decimals: 8
	},
	{
		symbol: "DTH",
		address: "0xF4b6664bb81bD7314aE65eAB2eE675505e3E9cB6",
		decimals: 2
	},
	{
		symbol: "DTH",
		address: "0x5adc961D6AC3f7062D2eA45FEFB8D8167d44b190",
		decimals: 18
	},
	{
		symbol: "DTOP",
		address: "0x54Ad74EdeAB48e09ccC43eE324f2603071dAD72b",
		decimals: 18
	},
	{
		symbol: "DTOX",
		address: "0x39550DC5919A990a5786fcDc1d5b7C392d362ddE",
		decimals: 8
	},
	{
		symbol: "DTR",
		address: "0xd234BF2410a0009dF9c3C63b610c09738f18ccD7",
		decimals: 8
	},
	{
		symbol: "DTRC",
		address: "0xc20464e0C373486d2B3335576e83a218b1618A5E",
		decimals: 18
	},
	{
		symbol: "DTT",
		address: "0xf9F7c29CFdf19FCf1f2AA6B84aA367Bcf1bD1676",
		decimals: 18
	},
	{
		symbol: "DTX",
		address: "0x765f0C16D1Ddc279295c1a7C24B0883F62d33F75",
		decimals: 18
	},
	{
		symbol: "DTX",
		address: "0x82fdedfB7635441aA5A92791D001fA7388da8025",
		decimals: 18
	},
	{
		symbol: "DUBI",
		address: "0xF3D6Af45C6dFeC43216CC3347Ea91fEfBa0849D1",
		decimals: 18
	},
	{
		symbol: "DUCATO",
		address: "0xa117ea1c0c85CEf648df2b6f40e50bb5475C228d",
		decimals: 18
	},
	{
		symbol: "DUCK",
		address: "0x92E187a03B6CD19CB6AF293ba17F2745Fd2357D5",
		decimals: 18
	},
	{
		symbol: "DUCK",
		address: "0xC0bA369c8Db6eB3924965e5c4FD0b4C1B91e305F",
		decimals: 18
	},
	{
		symbol: "DUO",
		address: "0x56e0B2C7694E6e10391E870774daA45cf6583486",
		decimals: 18
	},
	{
		symbol: "DUSD",
		address: "0x5BC25f649fc4e26069dDF4cF4010F9f706c23831",
		decimals: 18
	},
	{
		symbol: "DUSD",
		address: "0x556eA1fE7Cb0964e7De8Dfe6CdE63F1E40908541",
		decimals: 18
	},
	{
		symbol: "DUSDC",
		address: "0x16c9cF62d8daC4a38FB50Ae5fa5d51E9170F3179",
		decimals: 6
	},
	{
		symbol: "DUSDT",
		address: "0x868277d475E0e475E38EC5CdA2d9C83B5E1D9fc8",
		decimals: 6
	},
	{
		symbol: "DUSK",
		address: "0x940a2dB1B7008B6C776d4faaCa729d6d4A4AA551",
		decimals: 18
	},
	{
		symbol: "DUST",
		address: "0xbCa3C97837A39099eC3082DF97e28CE91BE14472",
		decimals: 8
	},
	{
		symbol: "DVP",
		address: "0x8E30ea2329D95802Fd804f4291220b0e2F579812",
		decimals: 18
	},
	{
		symbol: "DVPN",
		address: "0xa44E5137293E855B1b7bC7E2C6f8cD796fFCB037",
		decimals: 8
	},
	{
		symbol: "DWDP.CX",
		address: "0x09a981CFDBb37852C7F1d7f3F1Ff0CA1ee999080",
		decimals: 8
	},
	{
		symbol: "DWS",
		address: "0xF4B54874cD8a6C863e3A904c18fDa964661Ec363",
		decimals: 18
	},
	{
		symbol: "DX",
		address: "0x973e52691176d36453868D9d86572788d27041A9",
		decimals: 18
	},
	{
		symbol: "DXC",
		address: "0xb0E99627bC29adEf1178f16117BF495351E81997",
		decimals: 18
	},
	{
		symbol: "DXD",
		address: "0xa1d65E8fB6e87b60FECCBc582F7f97804B725521",
		decimals: 18
	},
	{
		symbol: "DXF",
		address: "0x15Eabb7500E44B7Fdb6e4051cA8DecA430cF9FB8",
		decimals: 18
	},
	{
		symbol: "DXG",
		address: "0xb22Be3C9feF880eE58155Cd402b67ce6d7b45504",
		decimals: 18
	},
	{
		symbol: "DXR",
		address: "0xffF3ada5A2555a2B59BfF4F44DFad90146CcE8CB",
		decimals: 18
	},
	{
		symbol: "DXT",
		address: "0x8dB54ca569D3019A2ba126D03C37c44b5eF81EF6",
		decimals: 8
	},
	{
		symbol: "DYP",
		address: "0x961C8c0B1aaD0c0b10a51FeF6a867E3091BCef17",
		decimals: 18
	},
	{
		symbol: "DYT",
		address: "0x740623d2c797b7D8D1EcB98e9b4Afcf99Ec31E14",
		decimals: 18
	},
	{
		symbol: "DYX",
		address: "0x042f972AC93404f0fcBe4E3A0729F0B395232106",
		decimals: 8
	},
	{
		symbol: "DZAR",
		address: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c",
		decimals: 6
	},
	{
		symbol: "DZC",
		address: "0x14903AD104dA65729B99bbD64c47FB7d75f8548A",
		decimals: 8
	},
	{
		symbol: "E01",
		address: "0x8430Acfd193271D004aC0F0825b95e6A382EEB22",
		decimals: 18
	},
	{
		symbol: "E4ROW",
		address: "0xCe5c603C78d047Ef43032E96b5B785324f753a4F",
		decimals: 2
	},
	{
		symbol: "EAGLE",
		address: "0x994f0DffdbaE0BbF09b652D6f11A493fd33F42B9",
		decimals: 18
	},
	{
		symbol: "EAI",
		address: "0x2f102963f61acF1ca4baDfe82057B440F2FC722C",
		decimals: 6
	},
	{
		symbol: "EARN",
		address: "0x63a18BC38D1101DB7F0efCbCBdCbe927A5879039",
		decimals: 18
	},
	{
		symbol: "EARTH",
		address: "0x900b4449236a7bb26b286601dD14d2bDe7a6aC6c",
		decimals: 8
	},
	{
		symbol: "EASY",
		address: "0x913D8ADf7CE6986a8CbFee5A54725D9Eea4F0729",
		decimals: 18
	},
	{
		symbol: "EAUD",
		address: "0x0953b746B099B98D59940Bd80e94649Dc88514bA",
		decimals: 7
	},
	{
		symbol: "EBAY.CX",
		address: "0x55cd673c21F0C5d8244ACeD99F874614A0a83dE9",
		decimals: 8
	},
	{
		symbol: "EBC",
		address: "0x31f3D9D1BeCE0c033fF78fA6DA60a6048F3E13c5",
		decimals: 18
	},
	{
		symbol: "EBCH",
		address: "0xaFC39788c51f0c1Ff7B55317f3e70299e521Fff6",
		decimals: 8
	},
	{
		symbol: "EBET",
		address: "0x7D5Edcd23dAa3fB94317D32aE253eE1Af08Ba14d",
		decimals: 2
	},
	{
		symbol: "EBIRD",
		address: "0x5a40724dCC5ac476F189Cdf1B45bDB166287df5F",
		decimals: 8
	},
	{
		symbol: "EBLOAP",
		address: "0x253444bd9ECf11E5516d6D00974e91c9F0857CCB",
		decimals: 18
	},
	{
		symbol: "EBLX",
		address: "0x84e8a50CA43e8f26094799bA60705475cF2B9832",
		decimals: 8
	},
	{
		symbol: "EBTC",
		address: "0xeB7C20027172E5d143fB030d50f91Cece2D1485D",
		decimals: 8
	},
	{
		symbol: "ECASH",
		address: "0x5D21eF5f25a985380B65c8e943A0082fEDa0Db84",
		decimals: 18
	},
	{
		symbol: "ECDF",
		address: "0x406ab55C0bAB2D4a3361f87F251211c3090d80Bc",
		decimals: 18
	},
	{
		symbol: "ECHT",
		address: "0x1a2277C83930b7a64C3e3D5544Eaa8C4f946B1B7",
		decimals: 18
	},
	{
		symbol: "ECN",
		address: "0xa578aCc0cB7875781b7880903F4594D13cFa8B98",
		decimals: 2
	},
	{
		symbol: "ECO",
		address: "0x191557728e4d8CAa4Ac94f86af842148c0FA8F7E",
		decimals: 8
	},
	{
		symbol: "ECO2",
		address: "0x17F93475d2A978f527c3f7c44aBf44AdfBa60D5C",
		decimals: 2
	},
	{
		symbol: "ECOIN",
		address: "0x320e2231d13F58Be6fd1bb71cCf460bE61Aaa80B",
		decimals: 18
	},
	{
		symbol: "ECOM",
		address: "0x171D750d42d661B62C277a6B486ADb82348c3Eca",
		decimals: 18
	},
	{
		symbol: "ECOREAL",
		address: "0xb052F8A33D8bb068414EaDE06AF6955199f9f010",
		decimals: 18
	},
	{
		symbol: "ECP",
		address: "0x8869b1F9bC8B246a4D7220F834E56ddfdd8255E7",
		decimals: 18
	},
	{
		symbol: "ECT",
		address: "0x4CcC3759eB48fAF1c6cfadaD2619E7038db6b212",
		decimals: 8
	},
	{
		symbol: "ECTE",
		address: "0xe9fa21E671BcfB04E6868784b89C19d5aa2424Ea",
		decimals: 18
	},
	{
		symbol: "ECU",
		address: "0x8fc9b6354E839AB1c8B31F4afa53607092B8C2e5",
		decimals: 18
	},
	{
		symbol: "ECU",
		address: "0xd3CDc4e75750DC1e59F8342200742B6B29490e70",
		decimals: 3
	},
	{
		symbol: "EDBT",
		address: "0xFE16A9e3904f928CC6A34507d6d667F731C66Bb0",
		decimals: 8
	},
	{
		symbol: "EDC",
		address: "0x53f32fe62E432A43a61dfd0E23f4991d0F4bBa0a",
		decimals: 18
	},
	{
		symbol: "EDC",
		address: "0xFA1DE2Ee97e4c10C94C91Cb2b5062b89Fb140b82",
		decimals: 6
	},
	{
		symbol: "EDDA",
		address: "0xFbbE9b1142C699512545f47937Ee6fae0e4B0aA9",
		decimals: 18
	},
	{
		symbol: "EDF.CX",
		address: "0xcfCd67348E28D202bD01B94214a1b366a35cE27b",
		decimals: 8
	},
	{
		symbol: "EDG",
		address: "0x08711D3B02C8758F2FB3ab4e80228418a7F8e39c",
		decimals: 0
	},
	{
		symbol: "EDGE",
		address: "0xFb2f26F266Fb2805a387230f2aa0a331b4d96Fba",
		decimals: 18
	},
	{
		symbol: "EDI",
		address: "0x79C5a1Ae586322A07BfB60be36E1b31CE8C84A1e",
		decimals: 18
	},
	{
		symbol: "EDN",
		address: "0x89020f0D5C5AF4f3407Eb5Fe185416c457B0e93e",
		decimals: 18
	},
	{
		symbol: "EDN",
		address: "0x05860d453C7974CbF46508c06CBA14e211c629Ce",
		decimals: 18
	},
	{
		symbol: "EDO",
		address: "0xCeD4E93198734dDaFf8492d525Bd258D49eb388E",
		decimals: 18
	},
	{
		symbol: "EDOGE",
		address: "0x8a7b7B9B2f7d0c63F66171721339705A6188a7D5",
		decimals: 18
	},
	{
		symbol: "EDP",
		address: "0x7eAFF6b30F225475061FA49AaE97333666E258Ff",
		decimals: 2
	},
	{
		symbol: "EDR",
		address: "0xc528c28FEC0A90C083328BC45f587eE215760A0F",
		decimals: 18
	},
	{
		symbol: "EDRA",
		address: "0xA62f436fAaA942a518a9543F5EF3174Ad4112a9e",
		decimals: 18
	},
	{
		symbol: "EDS",
		address: "0x1D4ABD5e28eF311ea114FD4756fBCF9b7d568E1f",
		decimals: 6
	},
	{
		symbol: "EDS",
		address: "0x3bd88A550D5953431Cf3fD933BCE574758046e3a",
		decimals: 0
	},
	{
		symbol: "EDU",
		address: "0xf263292e14d9D8ECd55B58dAD1F1dF825a874b7c",
		decimals: 18
	},
	{
		symbol: "EDU",
		address: "0x2A22e5cCA00a3D63308fa39f29202eB1b39eEf52",
		decimals: 18
	},
	{
		symbol: "EDX",
		address: "0xBF8d8F1242b95dfBAe532aF6B0F4463905415CC1",
		decimals: 18
	},
	{
		symbol: "EEE",
		address: "0x4C567C3363Cc42c5a42c6d8bf01503fd1d0b91cd",
		decimals: 18
	},
	{
		symbol: "EER",
		address: "0x3cC5EB07E0e1227613F1DF58f38b549823d11cB9",
		decimals: 18
	},
	{
		symbol: "EFK",
		address: "0x6653C0d21507573Cc39EAD1E609D74d5E0cA16e2",
		decimals: 18
	},
	{
		symbol: "EFT",
		address: "0x3Ee2fd8E38A16F06AB85D684E062c0cf7D0e9a8b",
		decimals: 18
	},
	{
		symbol: "eGAS",
		address: "0xb53A96bcBdD9CF78dfF20BAB6C2be7bAec8f00f8",
		decimals: 8
	},
	{
		symbol: "EGAS",
		address: "0x8BBf4dD0f11B3a535660fD7fCB7158DaEBd3a17E",
		decimals: 8
	},
	{
		symbol: "EGC",
		address: "0xc0EC8CaEC55F37D47fBfA595727418868A21fd48",
		decimals: 8
	},
	{
		symbol: "EGCC",
		address: "0xAf8A215e81FAea7C180CE22b72483525121813BD",
		decimals: 18
	},
	{
		symbol: "EGG",
		address: "0x999Aa6488f076e6765448f090Aba83FbB470fC99",
		decimals: 18
	},
	{
		symbol: "eGLD",
		address: "0xe3fb646fC31Ca12657B17070bC31a52E323b8543",
		decimals: 18
	},
	{
		symbol: "EGR",
		address: "0x73Cee8348b9bDd48c64E13452b8a6fbc81630573",
		decimals: 18
	},
	{
		symbol: "EGT",
		address: "0x8e1b448EC7aDFc7Fa35FC2e885678bD323176E34",
		decimals: 18
	},
	{
		symbol: "EGX",
		address: "0xa19bbEf64eFF0D060a653e4DF10a57B6d8006d3E",
		decimals: 18
	},
	{
		symbol: "EHC",
		address: "0x9108e027384506c528bD3d3603a46986c065b8fa",
		decimals: 18
	},
	{
		symbol: "EHT",
		address: "0xf9F0FC7167c311Dd2F1e21E9204F87EBA9012fB2",
		decimals: 8
	},
	{
		symbol: "EHY",
		address: "0x78481fB80CAabb252909218164266Ac83F815000",
		decimals: 18
	},
	{
		symbol: "EKO",
		address: "0xa6a840E50bCaa50dA017b91A0D86B8b2d41156EE",
		decimals: 18
	},
	{
		symbol: "EKT",
		address: "0xBAb165dF9455AA0F2AeD1f2565520B91DDadB4c8",
		decimals: 8
	},
	{
		symbol: "EL",
		address: "0x2781246fe707bB15CeE3e5ea354e2154a2877B16",
		decimals: 18
	},
	{
		symbol: "ELAMA",
		address: "0xFb444c1f2B718dDfC385cB8Fd9f2D1D776b24668",
		decimals: 18
	},
	{
		symbol: "ELC",
		address: "0xBf8be431AA8d8b2F58b6F0727c25A67b41BeaaF8",
		decimals: 4
	},
	{
		symbol: "ELD",
		address: "0xf0C6521b1F8ad9C33a99Aaf056F6C6247A3862BA",
		decimals: 18
	},
	{
		symbol: "ELD",
		address: "0x796E47B85A0d759F300f1de96A3583004235D4D8",
		decimals: 18
	},
	{
		symbol: "ELE",
		address: "0x07aD33ba649bb17aCD67ad93a79417Fa0039cF1f",
		decimals: 18
	},
	{
		symbol: "ELEC",
		address: "0xD49ff13661451313cA1553fd6954BD1d9b6E02b9",
		decimals: 18
	},
	{
		symbol: "ELET",
		address: "0x6c37Bf4f042712C978A73e3fd56D1F5738dD7C43",
		decimals: 18
	},
	{
		symbol: "ELET",
		address: "0x0568025c55c21BDa4BC488F3107ebfc8B3D3Ef2D",
		decimals: 8
	},
	{
		symbol: "ELF",
		address: "0xbf2179859fc6D5BEE9Bf9158632Dc51678a4100e",
		decimals: 18
	},
	{
		symbol: "ELG",
		address: "0xA2085073878152aC3090eA13D1e41bD69e60Dc99",
		decimals: 18
	},
	{
		symbol: "ELI",
		address: "0xc7C03B8a3FC5719066E185ea616e87B88eba44a3",
		decimals: 18
	},
	{
		symbol: "ELITE",
		address: "0x0A76aad21948eA1ef447D26DEe91a54370E151e0",
		decimals: 18
	},
	{
		symbol: "ELIX",
		address: "0xc8C6A31A4A806d3710A7B38b7B296D2fABCCDBA8",
		decimals: 18
	},
	{
		symbol: "ELL",
		address: "0x7E4d1Cd8927Ce41bcbfa4f32cADa1a6998cb5a51",
		decimals: 18
	},
	{
		symbol: "ELOAP",
		address: "0xC19216eea17b2f4DD677f1024CdA59C7D142F189",
		decimals: 18
	},
	{
		symbol: "ELT",
		address: "0x45d0bdfDFBfD62E14b64b0Ea67dC6eaC75f95D4d",
		decimals: 8
	},
	{
		symbol: "ELTC2",
		address: "0x7e9d62E1FF4e34096F91Ee0153222Ab81F7184F0",
		decimals: 8
	},
	{
		symbol: "ELTCOIN",
		address: "0x44197A4c44D6A059297cAf6be4F7e172BD56Caaf",
		decimals: 8
	},
	{
		symbol: "ELY",
		address: "0xa95592DCFfA3C080B4B40E459c5f5692F67DB7F8",
		decimals: 18
	},
	{
		symbol: "ELYX",
		address: "0x881a7E25D44591C467a37Da96adf3c3705E7251b",
		decimals: 18
	},
	{
		symbol: "EM",
		address: "0x35b08722AA26bE119c1608029CcbC976ac5C1082",
		decimals: 8
	},
	{
		symbol: "EMB",
		address: "0x498D99de4268cebCa264887f591C4bA8Fac042E4",
		decimals: 18
	},
	{
		symbol: "EMB",
		address: "0x28B94F58B11aC945341329dBf2e5EF7F8Bd44225",
		decimals: 8
	},
	{
		symbol: "EMB",
		address: "0xdb0aCC14396D108b3C5574483aCB817855C9dc8d",
		decimals: 8
	},
	{
		symbol: "EMC",
		address: "0x0a425122852ED351946A828b348bfdCdA51EffD8",
		decimals: 18
	},
	{
		symbol: "EMCO",
		address: "0xD97E471695f73d8186dEABc1AB5B8765e667Cd96",
		decimals: 18
	},
	{
		symbol: "EMET",
		address: "0x597cd1b89f4114Dc8d59B0598D15D023d873A006",
		decimals: 8
	},
	{
		symbol: "EMN",
		address: "0x5ade7aE8660293F2ebfcEfaba91d141d72d221e8",
		decimals: 18
	},
	{
		symbol: "EMN.CX",
		address: "0xcFEe207A9A4E2Ed5027c5830B2611f1944899130",
		decimals: 8
	},
	{
		symbol: "EMOJI",
		address: "0xe70Be6622D2316003D07a659dbbDB47241A68fF7",
		decimals: 18
	},
	{
		symbol: "EMON",
		address: "0xb67b88a25708a35AE7c2d736D398D268CE4f7F83",
		decimals: 8
	},
	{
		symbol: "EMONT",
		address: "0x95dAaaB98046846bF4B2853e23cba236fa394A31",
		decimals: 8
	},
	{
		symbol: "EMP",
		address: "0x9B639486f4A40c1A7a6728114F2413973f5Fa4c6",
		decimals: 18
	},
	{
		symbol: "EMPR",
		address: "0xe7D7b37e72510309Db27C460378f957B1B04Bd5d",
		decimals: 18
	},
	{
		symbol: "EMPRO",
		address: "0x029606e5ec44caD1346d6a1273a53b971fa93AD6",
		decimals: 18
	},
	{
		symbol: "EMRX",
		address: "0xbdbC2a5B32F3a5141ACd18C39883066E4daB9774",
		decimals: 8
	},
	{
		symbol: "EMS",
		address: "0x17E6616c45d267bC20A9892b58A01621c592B72d",
		decimals: 18
	},
	{
		symbol: "EMT",
		address: "0x8F2c72056b3FEf90d07aa7DB86dCcfc0aF3270a8",
		decimals: 18
	},
	{
		symbol: "EMT",
		address: "0x9501BFc48897DCEEadf73113EF635d2fF7ee4B97",
		decimals: 18
	},
	{
		symbol: "EMTR",
		address: "0x29E9fDF5933824ad21Bc6dbb8BF156EFA3735e32",
		decimals: 18
	},
	{
		symbol: "EMTRG",
		address: "0xBd2949F67DcdC549c6Ebe98696449Fa79D988A9F",
		decimals: 18
	},
	{
		symbol: "EMV",
		address: "0xB802b24E0637c2B87D2E8b7784C055BBE921011a",
		decimals: 2
	},
	{
		symbol: "ENB",
		address: "0xa6FB1DF483b24EEAB569e19447E0e107003B9E15",
		decimals: 18
	},
	{
		symbol: "ENC",
		address: "0x039F5050dE4908f9b5ddF40A4F3Aa3f329086387",
		decimals: 18
	},
	{
		symbol: "ENG",
		address: "0xf0Ee6b27b759C9893Ce4f094b49ad28fd15A23e4",
		decimals: 8
	},
	{
		symbol: "ENGT",
		address: "0x5DBAC24e98E2a4f43ADC0DC82Af403fca063Ce2c",
		decimals: 18
	},
	{
		symbol: "ENJ",
		address: "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c",
		decimals: 18
	},
	{
		symbol: "ENQ",
		address: "0x16EA01aCB4b0Bca2000ee5473348B6937ee6f72F",
		decimals: 10
	},
	{
		symbol: "ENTONE",
		address: "0xEc1a718D1A6F8F8d94eCEc6fe91465697bb2b88C",
		decimals: 8
	},
	{
		symbol: "ENTRP",
		address: "0x5BC7e5f0Ab8b2E10D2D0a3F21739FCe62459aeF3",
		decimals: 18
	},
	{
		symbol: "ENTS",
		address: "0x0F612a09eAd55Bb81b6534e80ed5A21Bf0a27B16",
		decimals: 8
	},
	{
		symbol: "EOC",
		address: "0xA8006e3Ac1bD94e54E3136B8e5dD75db0163e6f4",
		decimals: 18
	},
	{
		symbol: "EON",
		address: "0x4CB10F4df4BF4F64D4797d00D468181EF731Be9A",
		decimals: 8
	},
	{
		symbol: "EOS",
		address: "0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0",
		decimals: 18
	},
	{
		symbol: "EOSBULL",
		address: "0xeaD7F3ae4e0Bb0D8785852Cc37CC9d0B5e75c06a",
		decimals: 18
	},
	{
		symbol: "EOSDAC",
		address: "0x7e9e431a0B8c4D532C745B1043c7FA29a48D4fBa",
		decimals: 18
	},
	{
		symbol: "EOSHEDGE",
		address: "0xb38f206615325306DddEB0794A6482486B6B78b8",
		decimals: 18
	},
	{
		symbol: "EOSMOON",
		address: "0x4AaFf81cfe81523b1C4f6B6C075eBF9bBDb094C9",
		decimals: 18
	},
	{
		symbol: "EOST",
		address: "0x87210f1D3422BA75B6C40C63C78d79324daBcd55",
		decimals: 18
	},
	{
		symbol: "EOTO",
		address: "0xd3e7e71d20403A6d0bEaD558c0Bf19452A3fD002",
		decimals: 18
	},
	{
		symbol: "EPAM.CX",
		address: "0xF5e5421057606c4C629CAEc0D726976d9D4d7C51",
		decimals: 8
	},
	{
		symbol: "EPAN",
		address: "0x72630B1e3B42874bf335020Ba0249e3E9e47Bafc",
		decimals: 18
	},
	{
		symbol: "EPH",
		address: "0x875089A734213cA39f0d93c2BbB8209827ec5e9f",
		decimals: 8
	},
	{
		symbol: "EPS",
		address: "0x50eC35d1E18D439F02Fa895746FC3e1BEF311780",
		decimals: 18
	},
	{
		symbol: "EPS",
		address: "0x7db711FBE4bAcE5052F4CA19f700413A06e1f732",
		decimals: 18
	},
	{
		symbol: "EPS",
		address: "0x31a217b8065b376B192388b877D26e682044B82b",
		decimals: 8
	},
	{
		symbol: "EPT",
		address: "0x8eCb1cA966b6804B129D3c0F9771e079cbF48EFe",
		decimals: 18
	},
	{
		symbol: "EPWR",
		address: "0x1ABC429A9e0A6Bb21cAc418E876f2bA608556836",
		decimals: 18
	},
	{
		symbol: "EPX",
		address: "0x35BAA72038F127f9f8C8f9B491049f64f377914d",
		decimals: 4
	},
	{
		symbol: "EPY",
		address: "0x50Ee674689d75C0f88E8f83cfE8c4B69E8fd590D",
		decimals: 8
	},
	{
		symbol: "EQC",
		address: "0xC438B4c0Dfbb1593be6DEE03Bbd1A84BB3aa6213",
		decimals: 8
	},
	{
		symbol: "EQL",
		address: "0x47dD62D4D075DeAd71d0e00299fc56a2d747beBb",
		decimals: 18
	},
	{
		symbol: "EQMT",
		address: "0xa462d0E6Bb788c7807B1B1C96992CE1f7069E195",
		decimals: 18
	},
	{
		symbol: "EQUAD",
		address: "0xC28e931814725BbEB9e670676FaBBCb694Fe7DF2",
		decimals: 18
	},
	{
		symbol: "EQZ",
		address: "0x1Da87b114f35E1DC91F72bF57fc07A768Ad40Bb0",
		decimals: 18
	},
	{
		symbol: "ERA",
		address: "0x7F1CDbaB1e03882Da7742E09611f3298aDd9f890",
		decimals: 18
	},
	{
		symbol: "ERAZ",
		address: "0x6b048D884188895EbA104645Ee6fFa093fe80a07",
		decimals: 18
	},
	{
		symbol: "ERC20",
		address: "0xc3761EB917CD790B30dAD99f6Cc5b4Ff93C4F9eA",
		decimals: 18
	},
	{
		symbol: "ERC223",
		address: "0xF8F237D074F637D777bcD2A4712bde793f94272B",
		decimals: 10
	},
	{
		symbol: "ERD",
		address: "0x12DC767728105aA415Dd720DFBD0ea1d85841172",
		decimals: 2
	},
	{
		symbol: "ERD",
		address: "0xF9986D445ceD31882377b5D6a5F58EaEa72288c3",
		decimals: 18
	},
	{
		symbol: "ERN",
		address: "0xBBc2AE13b23d715c30720F079fcd9B4a74093505",
		decimals: 18
	},
	{
		symbol: "ERO",
		address: "0x74CEDa77281b339142A36817Fa5F9E29412bAb85",
		decimals: 8
	},
	{
		symbol: "EROWAN",
		address: "0x07baC35846e5eD502aA91AdF6A9e7aA210F2DcbE",
		decimals: 18
	},
	{
		symbol: "ERSDL",
		address: "0x5218E472cFCFE0b64A064F055B43b4cdC9EfD3A6",
		decimals: 18
	},
	{
		symbol: "ERT",
		address: "0x92A5B04D0ED5D94D7a193d1d334D3D16996f4E13",
		decimals: 18
	},
	{
		symbol: "ES",
		address: "0xeF1344bDf80BEf3Ff4428d8bECEC3eea4A2cF574",
		decimals: 18
	},
	{
		symbol: "ESB",
		address: "0x369760eBf89d577a734d927a9599C1921397A152",
		decimals: 8
	},
	{
		symbol: "ESCE",
		address: "0x49614661737EfBFC6a102efaeefDc8E197f7CC0e",
		decimals: 8
	},
	{
		symbol: "ESD",
		address: "0x36F3FD68E7325a35EB768F1AedaAe9EA0689d723",
		decimals: 18
	},
	{
		symbol: "ESH",
		address: "0xD6a55C63865AffD67E2FB9f284F87b7a9E5FF3bD",
		decimals: 18
	},
	{
		symbol: "ESHIP",
		address: "0x06BEAD2EAD661B51307B646F7419d5284330c135",
		decimals: 8
	},
	{
		symbol: "ESPI",
		address: "0x35a79FCEb867EE3392ED0C8DEdd8Dc2f6124c9Cd",
		decimals: 18
	},
	{
		symbol: "ESR",
		address: "0x69A57832540c00b7647a9643B8014930CfabD4CC",
		decimals: 6
	},
	{
		symbol: "ESS",
		address: "0xfc05987bd2be489ACCF0f509E44B0145d68240f7",
		decimals: 18
	},
	{
		symbol: "EST",
		address: "0x18f5B4908e8861e3114Ba9a0a9a4E84c5F180Cc0",
		decimals: 9
	},
	{
		symbol: "ESTATE",
		address: "0x6671c24DD5B8e4CED34033991418E4BC0CcA05aF",
		decimals: 8
	},
	{
		symbol: "ESTN",
		address: "0x997080B8EE7d75FBA23F3EC794dF99Da646c87EC",
		decimals: 18
	},
	{
		symbol: "ESWA",
		address: "0xA0471cdd5c0dc2614535fD7505b17A651a8F0DAB",
		decimals: 8
	},
	{
		symbol: "ESZ",
		address: "0xe8A1Df958bE379045E2B46a31A98B93A2eCDfDeD",
		decimals: 18
	},
	{
		symbol: "ETA",
		address: "0x1003eC54F51565fF86Ac611184Ea23d6310CaE71",
		decimals: 18
	},
	{
		symbol: "ETAS",
		address: "0x856c4388C56c2a613c60507a4701af627157Fed6",
		decimals: 18
	},
	{
		symbol: "ETBS",
		address: "0x1B9743f556D65e757c4c650B4555bAF354cB8bd3",
		decimals: 12
	},
	{
		symbol: "ETC8",
		address: "0x9e923c70D090c5FA57DC4Cf377bDD826C5cED550",
		decimals: 4
	},
	{
		symbol: "ETCBEAR",
		address: "0xA340f0937a8c00DB11C83Cc16CEC12310160F0b6",
		decimals: 18
	},
	{
		symbol: "ETCBULL",
		address: "0x974c98Bc2e82FA18de92B7e697A1D9BD25682e80",
		decimals: 18
	},
	{
		symbol: "ETCDOOM",
		address: "0x7D1234E0b45ACB7dADC321325Ba113A6f7CaA7EE",
		decimals: 18
	},
	{
		symbol: "ETCH",
		address: "0xDd74a7A3769fA72561B3A69e65968F49748c690c",
		decimals: 18
	},
	{
		symbol: "ETCHEDGE",
		address: "0x57e2B08E74B2B2C041e8B7bbB48bf1CDc6b8AfB6",
		decimals: 18
	},
	{
		symbol: "ETCMOON",
		address: "0x827E75a2C5F3cC0B2fEF9273f6AE4518551ECafB",
		decimals: 18
	},
	{
		symbol: "ETCR",
		address: "0x6265bCD2ca8E8Ee077CB9A9C66a851F18216022E",
		decimals: 6
	},
	{
		symbol: "ETD",
		address: "0x221c64c978D98bC34E49219e921E2eC8f318b05A",
		decimals: 8
	},
	{
		symbol: "ETE",
		address: "0x55A34e043fe779A2db61400A5ec72131D372aFcb",
		decimals: 18
	},
	{
		symbol: "ETF",
		address: "0xc2b58812c24020EA924c3d7C241C441605F12E75",
		decimals: 8
	},
	{
		symbol: "ETG",
		address: "0x28c8d01FF633eA9Cd8fc6a451D7457889E698de6",
		decimals: 0
	},
	{
		symbol: "ETGF",
		address: "0x74603e780545d02C4257E7D2BE19c74dE7BE1952",
		decimals: 18
	},
	{
		symbol: "ETGP",
		address: "0xa96F31F1C187c28980176C3A27ba7069f48abDE4",
		decimals: 8
	},
	{
		symbol: "ETH10K",
		address: "0xAbC754aC2161B557D28062F41DcC0fc18440ac7E",
		decimals: 18
	},
	{
		symbol: "ETH12EMACO",
		address: "0x2c5a9980B41861D91D30d0E0271d1c093452DcA5",
		decimals: 18
	},
	{
		symbol: "ETH20MACOAPY",
		address: "0xB647a1D7633c6C4d434e22eE9756b36F2b219525",
		decimals: 18
	},
	{
		symbol: "ETH20SMACO",
		address: "0x9ea463Ec4cE9E9E5bc9cFd0187C4Ac3a70DD951D",
		decimals: 18
	},
	{
		symbol: "ETH26EMACO",
		address: "0x614857C755739354d68AE0abD53849cf45d6A41D",
		decimals: 18
	},
	{
		symbol: "ETH2X-FLI",
		address: "0xAa6E8127831c9DE45ae56bB1b0d4D4Da6e5665BD",
		decimals: 18
	},
	{
		symbol: "ETH3L",
		address: "0x239B0Fa917d85c21cf6435464C2c6aa3D45f6720",
		decimals: 18
	},
	{
		symbol: "ETH3S",
		address: "0xEF9c8a1b3cE9055266E1CE20b98a4c882F0e5c78",
		decimals: 18
	},
	{
		symbol: "ETH50SMACO",
		address: "0xa360F2aF3F957906468c0FD7526391AeD08aE3DB",
		decimals: 18
	},
	{
		symbol: "ETHB",
		address: "0x3a26746Ddb79B1B8e4450e3F4FFE3285A307387E",
		decimals: 8
	},
	{
		symbol: "ETHBN",
		address: "0x96b52B5BF8D902252D0714A1BD2651A785Fd2660",
		decimals: 18
	},
	{
		symbol: "ETHBTC26EMACO",
		address: "0x6649BcD43767A6fd7B7A10dfc98AbEAa40f9141d",
		decimals: 18
	},
	{
		symbol: "ETHBTC7525",
		address: "0xA6c040045d962e4B8eFa00954c7d23CCd0a2b8AD",
		decimals: 18
	},
	{
		symbol: "ETHBTCEMACO",
		address: "0xB9FfE0b8Ee2d1Af94202FFED366520300748A4d8",
		decimals: 18
	},
	{
		symbol: "ETHBTCPA",
		address: "0x1bcCA39aE82e53dede8eC5500c3BCd76Cd1e0072",
		decimals: 18
	},
	{
		symbol: "ETHBTCRSI",
		address: "0xbf70A33A13fBe8D0106Df321Da0Cf654d2E9Ab50",
		decimals: 18
	},
	{
		symbol: "ETHBULL",
		address: "0x871baeD4088b863fd6407159f3672D70CD34837d",
		decimals: 18
	},
	{
		symbol: "ETHD",
		address: "0xdbFb423E9bBF16294388e07696A5120E4CeBA0C5",
		decimals: 18
	},
	{
		symbol: "ETHEMAAPY",
		address: "0x316b13B951Efe25AAd1Cb565385B23869A7D4c48",
		decimals: 18
	},
	{
		symbol: "ETHEMAAPY",
		address: "0x54e8371C1EC43e58fB53D4ef4eD463C17Ba8a6bE",
		decimals: 18
	},
	{
		symbol: "ETHHIVOL",
		address: "0x8Ddc86DbA7ad728012eFc460b8A168Aba60B403B",
		decimals: 18
	},
	{
		symbol: "ETHLOVOL",
		address: "0x585C2cF94c41b528ec7329CBc3cdE3C4f8d268dB",
		decimals: 18
	},
	{
		symbol: "ETHM",
		address: "0x340eF83Ec8560892168D4062720F030460468656",
		decimals: 18
	},
	{
		symbol: "ETHM",
		address: "0x56b6431F45d08eED55f34371386326c739eACbcC",
		decimals: 18
	},
	{
		symbol: "ETHMACOAPY",
		address: "0xeF0fDA1d4bd73DDC2f93A4e46E2E5aDBC2D668f4",
		decimals: 18
	},
	{
		symbol: "ETHMINVOL",
		address: "0xF1E5F03086e1c0Ce55E54cd8146BC9c28435346F",
		decimals: 18
	},
	{
		symbol: "ETHMNY",
		address: "0xbF4a2DdaA16148a9D0fA2093FfAC450ADb7cd4aa",
		decimals: 2
	},
	{
		symbol: "ETHMOON",
		address: "0x5DCFA62F81B43ce7A3632454d327DeE1f1d93b28",
		decimals: 18
	},
	{
		symbol: "ETHMOONX",
		address: "0xB1CA7E6714263a64659A3a89E1C313af30fD660A",
		decimals: 18
	},
	{
		symbol: "ETHMOONX",
		address: "0x73104e9d3Da91e410A6c211068f7BFfabBbD3e26",
		decimals: 18
	},
	{
		symbol: "ETHMOONX2",
		address: "0x2Bf417FdA6E73B8Ea605DF0F33aD029F8d4b795A",
		decimals: 18
	},
	{
		symbol: "ETHP",
		address: "0xEED736b2b809550D89A941C2005dE93588c628e2",
		decimals: 18
	},
	{
		symbol: "ETHPA",
		address: "0x09E4BDFb273245063eF5E800D891eFF7d04f9B83",
		decimals: 18
	},
	{
		symbol: "ETHPAY",
		address: "0xE52e75e8a97546f40991b489E92c68eBb386dc97",
		decimals: 18
	},
	{
		symbol: "ETHPLO",
		address: "0xe0c6CE3e73029F201e5C0Bedb97F67572A93711C",
		decimals: 6
	},
	{
		symbol: "ETHRSIAPY",
		address: "0x9f49ed43C90A540d1cF12f6170aCE8d0B88a14E6",
		decimals: 18
	},
	{
		symbol: "ETHRSIAPY",
		address: "0x136faE4333EA36A24bb751E2d505D6ca4Fd9f00b",
		decimals: 18
	},
	{
		symbol: "ETHS",
		address: "0xA2dcA1505b07e39F96Ce41E875b447F46D50C6fc",
		decimals: 18
	},
	{
		symbol: "ETHSB",
		address: "0x8DDF05C42C698329053c4F39B5bb05A350fd8132",
		decimals: 18
	},
	{
		symbol: "ETHV",
		address: "0xEeEeeeeEe2aF8D0e1940679860398308e0eF24d6",
		decimals: 18
	},
	{
		symbol: "ETHW",
		address: "0xfBd86312F156B0Cc976E558B62dA068bbAfCAf9C",
		decimals: 12
	},
	{
		symbol: "ETK",
		address: "0x3c4a3ffd813a107febd57B2f01BC344264D90FdE",
		decimals: 2
	},
	{
		symbol: "ETL.CX",
		address: "0x6A36a309ACB68d7fB3605BC627C3Ae68dE3D2961",
		decimals: 8
	},
	{
		symbol: "ETM",
		address: "0x8C576b67e1cAa070fc2cC00B615C1F530796dA3e",
		decimals: 18
	},
	{
		symbol: "ETM",
		address: "0x6020Da0F7c1857dBE4431Ec92A15cC318D933eAa",
		decimals: 18
	},
	{
		symbol: "ETR",
		address: "0x71E5fB8793b5a2fb0C4918930180f8B36500cBB8",
		decimals: 8
	},
	{
		symbol: "ETR",
		address: "0x6927C69fb4daf2043fbB1Cb7b86c5661416bea29",
		decimals: 18
	},
	{
		symbol: "ETY",
		address: "0x5aCD07353106306a6530ac4D49233271Ec372963",
		decimals: 18
	},
	{
		symbol: "ETY",
		address: "0x37DB56E0FbA0BE2cbf96e3de3BFF8096b6D59179",
		decimals: 18
	},
	{
		symbol: "EU50.CX",
		address: "0x2098253aa66Ec0510816cA5e5de9e2657bF01224",
		decimals: 8
	},
	{
		symbol: "EUBC",
		address: "0xc37E8a31BA2d110c12f09f0239954A68b00bC599",
		decimals: 8
	},
	{
		symbol: "EUCX",
		address: "0xd99298985902C9A69bf4C8a0895fA10721204ECC",
		decimals: 18
	},
	{
		symbol: "EUM",
		address: "0x6aB4A7d75B0A42B6Bc83E852daB9E121F9C610Aa",
		decimals: 18
	},
	{
		symbol: "EUM",
		address: "0x3071a55A0F7916d796B54A2d095Db85Df693d956",
		decimals: 13
	},
	{
		symbol: "EUP",
		address: "0xe532a2A37b0707b4306B21B412D2E8C22f9824Ec",
		decimals: 18
	},
	{
		symbol: "EURS",
		address: "0xdB25f211AB05b1c97D595516F45794528a807ad8",
		decimals: 2
	},
	{
		symbol: "EURT",
		address: "0xAbdf147870235FcFC34153828c769A70B3FAe01F",
		decimals: 6
	},
	{
		symbol: "EURU",
		address: "0x6c139349ee94eBAaff55eD52d382673C263B22d6",
		decimals: 18
	},
	{
		symbol: "EUSD",
		address: "0xa90C43e0d6c92b8e6171a829beB38Be28a0Ad073",
		decimals: 18
	},
	{
		symbol: "EVC",
		address: "0xBA14b245d449965BdBeB630ebe135B569474F5b1",
		decimals: 6
	},
	{
		symbol: "EVC",
		address: "0xAa843f65872a25D6E9552eA0B360Fb1d5E333124",
		decimals: 18
	},
	{
		symbol: "EVC",
		address: "0xA8B9cd2577d20224Af856C19aF20040290705932",
		decimals: 8
	},
	{
		symbol: "EVC",
		address: "0xb62d18DeA74045E822352CE4B3EE77319DC5ff2F",
		decimals: 18
	},
	{
		symbol: "EVCO",
		address: "0xAa5C28be0F1173612eA3fCC9e461cCB7b9390213",
		decimals: 18
	},
	{
		symbol: "EVE",
		address: "0xEC193241dc1cA3BBe3165de6D37A793585b4504E",
		decimals: 18
	},
	{
		symbol: "EVE",
		address: "0x923108a439C4e8C2315c4f6521E5cE95B44e9B4c",
		decimals: 18
	},
	{
		symbol: "EVED",
		address: "0x5aaEFe84E0fB3DD1f0fCfF6fA7468124986B91bd",
		decimals: 18
	},
	{
		symbol: "EVEO",
		address: "0x6b40D317BC1de4b0938519AC707AE36464f49171",
		decimals: 18
	},
	{
		symbol: "EVF",
		address: "0xA26C4caaaEa8b88ef49Bf8c380488f66C2d807Ae",
		decimals: 18
	},
	{
		symbol: "EVI",
		address: "0x920DB6C38cF5a2A12554e812D4b3ac2DaA8ebA4D",
		decimals: 18
	},
	{
		symbol: "EVN",
		address: "0x68909e586eeAC8F47315e84B4c9788DD54Ef65Bb",
		decimals: 18
	},
	{
		symbol: "EVN",
		address: "0x9aF15D7B8776fa296019979E70a5BE53c714A7ec",
		decimals: 18
	},
	{
		symbol: "EVN",
		address: "0xd780Ae2Bf04cD96E577D3D014762f831d97129d0",
		decimals: 18
	},
	{
		symbol: "EVNY",
		address: "0x9A24B8E8A6D4563c575A707b1275381119298E60",
		decimals: 18
	},
	{
		symbol: "EVO",
		address: "0xefBd6D7deF37ffae990503EcdB1291B2f7E38788",
		decimals: 18
	},
	{
		symbol: "EVO",
		address: "0x442d985EFeBC633b8Bfd14fF99E860A5609a6484",
		decimals: 18
	},
	{
		symbol: "EVOL",
		address: "0xaC6560DF686F3ac7039B0DD6867C874c99D9dA06",
		decimals: 18
	},
	{
		symbol: "EVR",
		address: "0x3137619705b5fc22a3048989F983905e456b59Ab",
		decimals: 8
	},
	{
		symbol: "EVS",
		address: "0xA14516FF788338f34DB1a591497a616E3a759E23",
		decimals: 8
	},
	{
		symbol: "EVS",
		address: "0xAe73e05847461DCe0D113Cd2f09c7069B85B6E3e",
		decimals: 18
	},
	{
		symbol: "EVT",
		address: "0x5aaa2182459377b6cA18b10712F9F602140764af",
		decimals: 8
	},
	{
		symbol: "EVX",
		address: "0xf3Db5Fa2C66B7aF3Eb0C0b782510816cbe4813b8",
		decimals: 4
	},
	{
		symbol: "EVY",
		address: "0xEEd3aE7b0F8b5B9BB8C035A9941382B1822671CD",
		decimals: 12
	},
	{
		symbol: "EVZ",
		address: "0x7A939Bb714fd2A48EbeB1E495AA9aaa74BA9fA68",
		decimals: 18
	},
	{
		symbol: "EWO",
		address: "0x444997b7e7fC830E20089afea3078cd518fCF2A2",
		decimals: 18
	},
	{
		symbol: "EWTB",
		address: "0x178c820f862B14f316509ec36b13123DA19A6054",
		decimals: 18
	},
	{
		symbol: "EXAS.CX",
		address: "0x9D8268E4ad1A617F4386EE384d90BB4c3A86d0c9",
		decimals: 8
	},
	{
		symbol: "EXC",
		address: "0x00c4B398500645eb5dA00a1a379a88B11683ba01",
		decimals: 18
	},
	{
		symbol: "EXC",
		address: "0x9e4C143Bfe35f855624B3F84465AB7401A17A120",
		decimals: 18
	},
	{
		symbol: "EXC",
		address: "0x2c594E1cB006E86C3879b1d8191a8B059AF52bE7",
		decimals: 8
	},
	{
		symbol: "EXCHBEAR",
		address: "0x6baA91cd8AA07431760EF2eedFedCEF662A6B8B3",
		decimals: 18
	},
	{
		symbol: "EXCHBULL",
		address: "0x592ef68C18F05A22C5890263DEa5D952dd140d2A",
		decimals: 18
	},
	{
		symbol: "EXCHDOOM",
		address: "0xC3f206E06b33C3F5dF9b95B8294a5E71F09480ab",
		decimals: 18
	},
	{
		symbol: "EXCHHEDGE",
		address: "0xf8CC67e304f8e1A351ED83b4DBBe6B4076d51376",
		decimals: 18
	},
	{
		symbol: "EXCHMOON",
		address: "0x456bD836910b3853dC22529DBc2cbe072d967141",
		decimals: 18
	},
	{
		symbol: "EXE",
		address: "0x0D9A653f681168f410d14D19B7743C041EafC58a",
		decimals: 8
	},
	{
		symbol: "EXEL.CX",
		address: "0x2745822D171CC9dE5717C2B9d3313A2BfAF1b149",
		decimals: 8
	},
	{
		symbol: "EXMR",
		address: "0xc98e0639c6d2EC037A615341c369666B110e80E5",
		decimals: 8
	},
	{
		symbol: "EXMR",
		address: "0x331fA6C97c64e47475164b9fC8143b533c5eF529",
		decimals: 18
	},
	{
		symbol: "EXN",
		address: "0x0766e79A6fD74469733e8330b3b461C0320fF059",
		decimals: 18
	},
	{
		symbol: "EXNT",
		address: "0xD6c67B93a7b248dF608a653d82a100556144c5DA",
		decimals: 16
	},
	{
		symbol: "EXNX",
		address: "0x60e7f0518102A4E70431960F88c1EBC98f994159",
		decimals: 6
	},
	{
		symbol: "EXP",
		address: "0x5330A5805b9Db68EbCF5247BbC9097163c1c2442",
		decimals: 18
	},
	{
		symbol: "EXPE.CX",
		address: "0x3b4c65F1e16cb0e50552c08a495035b97ab00D07",
		decimals: 8
	},
	{
		symbol: "EXPO",
		address: "0x7aCB51E690301b114a2A65B2E557cC1B7e644ba8",
		decimals: 8
	},
	{
		symbol: "EXRD",
		address: "0x6468e79A80C0eaB0F9A2B574c8d5bC374Af59414",
		decimals: 18
	},
	{
		symbol: "EXRN",
		address: "0xe469c4473af82217B30CF17b10BcDb6C8c796e75",
		decimals: 0
	},
	{
		symbol: "EXRT",
		address: "0xb20043F149817bff5322F1b928e89aBFC65A9925",
		decimals: 8
	},
	{
		symbol: "EXU",
		address: "0xe06Af951086EC3c488b50E31BE29c07F8a260cA3",
		decimals: 16
	},
	{
		symbol: "EXY",
		address: "0x5c743a35E903F6c584514ec617ACEe0611Cf44f3",
		decimals: 18
	},
	{
		symbol: "EYES",
		address: "0x2DCA19E944453e46d9130950Ca135461b3Bc0c30",
		decimals: 18
	},
	{
		symbol: "EZT",
		address: "0x5e6016Ae7d7C49d347dcF834860B9f3Ee282812b",
		decimals: 8
	},
	{
		symbol: "EZW",
		address: "0x78a2a1029E3168b49d3A276C787050fF5106dCF2",
		decimals: 18
	},
	{
		symbol: "e₹",
		address: "0xb67734521eAbBE9C773729dB73E16CC2dfb20A58",
		decimals: 2
	},
	{
		symbol: "F.CX",
		address: "0x6F0C544CfD52885CFF69577f1B9fcc1c284e80aE",
		decimals: 8
	},
	{
		symbol: "FAB",
		address: "0x12683Dc9eEc95a5F742D40206e73319E6b9d8A91",
		decimals: 18
	},
	{
		symbol: "FACE",
		address: "0x1CCAA0F2a7210d76E1fDec740d5F323E2E1b1672",
		decimals: 18
	},
	{
		symbol: "FACT",
		address: "0x23aEfF664c1B2bbA98422a0399586e96cc8a1C92",
		decimals: 18
	},
	{
		symbol: "FAIR",
		address: "0x9B20DaBcec77f6289113E61893F7BEeFAEB1990a",
		decimals: 18
	},
	{
		symbol: "FAITH",
		address: "0xE531642e9bb5d027E9C20E03284287B97919a9a5",
		decimals: 8
	},
	{
		symbol: "FAM",
		address: "0x190e569bE071F40c704e15825F285481CB74B6cC",
		decimals: 12
	},
	{
		symbol: "FAM",
		address: "0x9D24364b97270961b2948734aFe8d58832Efd43a",
		decimals: 18
	},
	{
		symbol: "FAME",
		address: "0xF2da15Ae6eF94988534BaD4b9e646f5911CBd487",
		decimals: 8
	},
	{
		symbol: "FAME",
		address: "0x06f65b8CfCb13a9FE37d836fE9708dA38Ecb29B2",
		decimals: 18
	},
	{
		symbol: "FAN",
		address: "0x90162f41886c0946D09999736f1C15c8a105A421",
		decimals: 18
	},
	{
		symbol: "FANX",
		address: "0x7dCB3B2356C822d3577D4d060D0D5D78C860488C",
		decimals: 18
	},
	{
		symbol: "FAR",
		address: "0x7cf6dC769482AbEe2FF75795d000F381A8062DEC",
		decimals: 18
	},
	{
		symbol: "FARM",
		address: "0x41f723448433367BE140D528D35EFECd3e023DB6",
		decimals: 18
	},
	{
		symbol: "FARM",
		address: "0xa0246c9032bC3A600820415aE600c6388619A14D",
		decimals: 18
	},
	{
		symbol: "FAU",
		address: "0xFab46E002BbF0b4509813474841E0716E6730136",
		decimals: 18
	},
	{
		symbol: "FB.CX",
		address: "0x6103c7873CDe5f0F63Dba9fAc33A2049cd8A2680",
		decimals: 8
	},
	{
		symbol: "FBC",
		address: "0xaC9749c854b31bBa3B3e71B30FDd7AEa4fCC0db9",
		decimals: 18
	},
	{
		symbol: "FBEE",
		address: "0x3395167319297A0806260E87A329885F20E13da2",
		decimals: 18
	},
	{
		symbol: "FC",
		address: "0xe6923E9b56Db1EeD1c9f430Ea761DA7565e260Fe",
		decimals: 2
	},
	{
		symbol: "FC007",
		address: "0x35F82CAa11C2459E179Bc8102cCE439D77C8Ef25",
		decimals: 18
	},
	{
		symbol: "FCBTC",
		address: "0x4c6e796Bbfe5EB37F9E3E0f66C009C8Bf2A5f428",
		decimals: 8
	},
	{
		symbol: "FCC",
		address: "0xb33ad2acEdea7D698b987E0D8195C4DF3F6629e8",
		decimals: 18
	},
	{
		symbol: "FCHI.CX",
		address: "0x2a543F929E9d5afDa0324889873afb513ff2811c",
		decimals: 8
	},
	{
		symbol: "FCL",
		address: "0xeC1cad815B5e8F0f86bb8fB2ADd2774886e79CF0",
		decimals: 18
	},
	{
		symbol: "FCT",
		address: "0x394594B06aDb8f54E393BFaf13cA5786BCd3f9bB",
		decimals: 18
	},
	{
		symbol: "FCT",
		address: "0xE1bAD922F84b198A08292FB600319300ae32471b",
		decimals: 18
	},
	{
		symbol: "FDO",
		address: "0x361887C1D1B73557018c47c8001711168128cf69",
		decimals: 18
	},
	{
		symbol: "FDT",
		address: "0xb2A01Ad9738450f082e5238e43b17fE80781FaAE",
		decimals: 18
	},
	{
		symbol: "FDT",
		address: "0x0f86b24dA64e16d9B21585a8734B8b0c94a43C18",
		decimals: 8
	},
	{
		symbol: "FDX",
		address: "0x52A7cB918c11A16958bE40CBA7E31e32a499a465",
		decimals: 18
	},
	{
		symbol: "FDX.CX",
		address: "0x761c9DDe671191dF36Ec5fC374BCF21394879737",
		decimals: 8
	},
	{
		symbol: "FDZ",
		address: "0x23352036E911A22Cfc692B5E2E196692658ADED9",
		decimals: 18
	},
	{
		symbol: "FEG",
		address: "0x389999216860AB8E0175387A0c90E5c52522C945",
		decimals: 9
	},
	{
		symbol: "FER",
		address: "0x4E594479Fa417a1e9C5790a413575802D393010F",
		decimals: 8
	},
	{
		symbol: "FERA",
		address: "0x539F3615C1dBAfa0D008d87504667458acBd16Fa",
		decimals: 18
	},
	{
		symbol: "FESS",
		address: "0xE09394F8BA642430eD448CA20f342EC7aa1Ba2E1",
		decimals: 18
	},
	{
		symbol: "FET",
		address: "0x296b3Fc8e3CC768F834152586e5Ad708BFE8F163",
		decimals: 18
	},
	{
		symbol: "FET",
		address: "0x1D287CC25dAD7cCaF76a26bc660c5F7C8E2a05BD",
		decimals: 18
	},
	{
		symbol: "FET",
		address: "0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85",
		decimals: 18
	},
	{
		symbol: "FETISH",
		address: "0xeFCec6d87e3ce625c90865a49f2b7482963D73fE",
		decimals: 6
	},
	{
		symbol: "FEX",
		address: "0x002f2264AEec71041Ae5739ecf0a2C80c5EA30FA",
		decimals: 18
	},
	{
		symbol: "FEX",
		address: "0x271220FbEFD584A6b0A6ad457721C076321646a1",
		decimals: 18
	},
	{
		symbol: "FEX",
		address: "0x1C1C14A6B5074905Ce5d367B0A7E098b58EbFD47",
		decimals: 8
	},
	{
		symbol: "FF",
		address: "0x7E9D8f07A64e363e97A648904a89fb4cd5fB94CD",
		decimals: 18
	},
	{
		symbol: "FF1",
		address: "0x59aF0356cdeBd1fa23Ae5dADfF9170BbFC31278c",
		decimals: 18
	},
	{
		symbol: "FFC",
		address: "0x4E84E9e5fb0A972628Cf4568c403167EF1D40431",
		decimals: 18
	},
	{
		symbol: "FFF",
		address: "0x22f098F08c4eda4bE4ad6B4ba59866F3E98CEF92",
		decimals: 18
	},
	{
		symbol: "FFYI",
		address: "0xca76BAa777d749De63Ca044853D22D56bC70bb47",
		decimals: 18
	},
	{
		symbol: "FGP",
		address: "0xd9A8cfe21C232D485065cb62a96866799d4645f7",
		decimals: 18
	},
	{
		symbol: "FHT",
		address: "0xEBd01Df7e1E56e89A52c5DE185377d3A2eEf9a2b",
		decimals: 8
	},
	{
		symbol: "FIC",
		address: "0x2f01D47c239B7EaCCd746604fDba49A84367d2DA",
		decimals: 8
	},
	{
		symbol: "FIC",
		address: "0x0DD83B5013b2ad7094b1A7783d96ae0168f82621",
		decimals: 18
	},
	{
		symbol: "FICO",
		address: "0x7e442206dA059905050bA02BE63CBB85c559EB04",
		decimals: 18
	},
	{
		symbol: "FID",
		address: "0x52fb36C83ad33C1824912FC81071cA5eEB8AB390",
		decimals: 18
	},
	{
		symbol: "FIDE",
		address: "0x40b5cCF92F9C980FbC6F2F0c0af7A4AffF0F7c48",
		decimals: 18
	},
	{
		symbol: "FIG",
		address: "0x2A73CB91ED8983398F83082c093ac306cac209FF",
		decimals: 18
	},
	{
		symbol: "FIH",
		address: "0xdfC3e857c8cCEA7657E0ed98AB92e048e38deE0f",
		decimals: 18
	},
	{
		symbol: "FIIC",
		address: "0xe463d1EE18BcbCe681215d15738018EAdAa82260",
		decimals: 0
	},
	{
		symbol: "FIN",
		address: "0x054f76beED60AB6dBEb23502178C52d6C5dEbE40",
		decimals: 18
	},
	{
		symbol: "FIN",
		address: "0xAA3F8E382cB01cae98A7f37A170F3D218c38E3EC",
		decimals: 18
	},
	{
		symbol: "FIN",
		address: "0x1Dd7B2878B6d5671Ed602e60818b0D9A0CD1CDF7",
		decimals: 18
	},
	{
		symbol: "FIND",
		address: "0xDF859C9878Ef5e742d7BbE3C22a496c088C89Fa9",
		decimals: 18
	},
	{
		symbol: "FIRE",
		address: "0x3F8A2f7bcD70e7F7Bdd3FbB079c11d073588DEA2",
		decimals: 18
	},
	{
		symbol: "FIRE",
		address: "0xF921ae2DAC5fa128DC0F6168Bf153ea0943d2D43",
		decimals: 8
	},
	{
		symbol: "FIRE",
		address: "0x125F9d5daa039bDB79D36bAff667e9E0bbcEA998",
		decimals: 18
	},
	{
		symbol: "FIRST",
		address: "0x9903A4Cd589DA8e434f264deAFc406836418578E",
		decimals: 4
	},
	{
		symbol: "FIT",
		address: "0x9BFEDc30A3930b709c0FCB01c5c59733b64aC827",
		decimals: 18
	},
	{
		symbol: "FIV1.CX",
		address: "0x01409455883E2c1c4F7e32e2aF85e547B14903C1",
		decimals: 8
	},
	{
		symbol: "FKX",
		address: "0x009e864923b49263c7F10D19B7f8Ab7a9A5AAd33",
		decimals: 18
	},
	{
		symbol: "FKX",
		address: "0x16484d73Ac08d2355F466d448D2b79D2039F6EBB",
		decimals: 18
	},
	{
		symbol: "FLA",
		address: "0x7bE5901F679BDE8202a123c84C19BBCE2CF3449B",
		decimals: 18
	},
	{
		symbol: "FLC",
		address: "0x32C4ADB9cF57f972bc375129de91C897b4F364F1",
		decimals: 18
	},
	{
		symbol: "FLETA",
		address: "0x7788D759F21F53533051A9AE657fA05A1E068fc6",
		decimals: 18
	},
	{
		symbol: "FLEX",
		address: "0x6D45640F5D0B75280647f2F37CCD19c1167f833c",
		decimals: 4
	},
	{
		symbol: "FLIK",
		address: "0x17fD666fa0784885fa1AFEc8AC624d9b7e72B752",
		decimals: 14
	},
	{
		symbol: "FLINT",
		address: "0xdAd59FD8B366a5536C014DA9Eb81D19EC9953920",
		decimals: 18
	},
	{
		symbol: "FLIXX",
		address: "0xf04a8ac553FceDB5BA99A64799155826C136b0Be",
		decimals: 18
	},
	{
		symbol: "FLMC",
		address: "0x04cC783b450b8D11F3C7d00DD03fDF7FB51fE9F2",
		decimals: 18
	},
	{
		symbol: "FLOT",
		address: "0x049399a6B048D52971F7D122aE21A1532722285F",
		decimals: 18
	},
	{
		symbol: "FLOW",
		address: "0xC6e64729931f60D2c8Bc70A27D66D9E0c28D1BF9",
		decimals: 9
	},
	{
		symbol: "FLP",
		address: "0x3a1Bda28AdB5B0a812a7CF10A1950c920F79BcD3",
		decimals: 18
	},
	{
		symbol: "FLR",
		address: "0x9aeFBE0b3C3ba9Eab262CB9856E8157AB7648e09",
		decimals: 18
	},
	{
		symbol: "FLUX",
		address: "0x469eDA64aEd3A3Ad6f868c44564291aA415cB1d9",
		decimals: 18
	},
	{
		symbol: "FLUZ",
		address: "0x954b5De09A55e59755aCBda29e1Eb74A45D30175",
		decimals: 18
	},
	{
		symbol: "FLX",
		address: "0x70b147E01E9285E7cE68B9BA437Fe3a9190E756a",
		decimals: 18
	},
	{
		symbol: "FLX",
		address: "0x6243d8CEA23066d098a15582d81a598b4e8391F4",
		decimals: 18
	},
	{
		symbol: "FLXC",
		address: "0xA50e0620233e87bfac560aAD39505C79e1F9092B",
		decimals: 18
	},
	{
		symbol: "FLY",
		address: "0x85f6eB2BD5a062f5F8560BE93FB7147e16c81472",
		decimals: 4
	},
	{
		symbol: "FMA",
		address: "0x0f8794f66C7170c4f9163a8498371A747114f6C4",
		decimals: 18
	},
	{
		symbol: "FMF",
		address: "0xb4d0FDFC8497AEF97d3c2892AE682eE06064A2BC",
		decimals: 18
	},
	{
		symbol: "FML",
		address: "0xdE522a2778E4554707E6a8Df36a4871ce9967BB5",
		decimals: 18
	},
	{
		symbol: "FMT",
		address: "0x4bcee5d00528dd367594E44A743A4C8Ccf92B3f5",
		decimals: 18
	},
	{
		symbol: "FNB",
		address: "0x47b28F365Bf4CB38DB4B6356864BDE7bc4B35129",
		decimals: 18
	},
	{
		symbol: "FNB",
		address: "0xE6D2c3cB986db66818c14C7032DB05D1d2A6ee74",
		decimals: 8
	},
	{
		symbol: "FND",
		address: "0x4DF47B4969B2911C966506E3592c41389493953b",
		decimals: 18
	},
	{
		symbol: "FNK",
		address: "0x06404399e748CD83F25AB163711F9F4D61cfd0e6",
		decimals: 18
	},
	{
		symbol: "FNKOS",
		address: "0x0707681F344dEB24184037fC0228856F2137B02E",
		decimals: 18
	},
	{
		symbol: "FNL",
		address: "0xe5869a1Ade66F0174C0FaE6cD6cc303C54D7c738",
		decimals: 18
	},
	{
		symbol: "FNL",
		address: "0x4c5601164e2048a4154DE91Fa5e0B07E626CaB7F",
		decimals: 3
	},
	{
		symbol: "FNSP",
		address: "0x3B78dc5736a49BD297Dd2E4d62daA83D35A22749",
		decimals: 18
	},
	{
		symbol: "FNT",
		address: "0xDc5864eDe28BD4405aa04d93E05A0531797D9D59",
		decimals: 6
	},
	{
		symbol: "FNTB",
		address: "0xbD4B60a138b3fce3584EA01f50c0908c18f9677A",
		decimals: 8
	},
	{
		symbol: "FNX",
		address: "0x5515950F7bF8D6aCDF4aE98c33bf996BD0eD6F6f",
		decimals: 18
	},
	{
		symbol: "FNX",
		address: "0xeF9Cd7882c067686691B6fF49e650b43AFBBCC6B",
		decimals: 18
	},
	{
		symbol: "FNXS",
		address: "0x05919A3915462abbDf2Cd3C5b42213cc8f596102",
		decimals: 8
	},
	{
		symbol: "FOAM",
		address: "0x4946Fcea7C692606e8908002e55A582af44AC121",
		decimals: 18
	},
	{
		symbol: "FOOD",
		address: "0x2a093BcF0C98Ef744Bb6F69D74f2F85605324290",
		decimals: 8
	},
	{
		symbol: "FOR",
		address: "0x1FCdcE58959f536621d76f5b7FfB955baa5A672F",
		decimals: 18
	},
	{
		symbol: "FORCE",
		address: "0x2C31b10ca416b82Cec4c5E93c615ca851213d48D",
		decimals: 18
	},
	{
		symbol: "FORCER",
		address: "0xC1fB6C015fC535aBD331D3029De76a62e412Fb23",
		decimals: 4
	},
	{
		symbol: "FOREX",
		address: "0xa4E9584DAa093Cb1205E17bA737c3fd015748087",
		decimals: 18
	},
	{
		symbol: "FORK",
		address: "0x5bB1632fA0023e1AA76a1AE92B4635C8DBa49Fa2",
		decimals: 18
	},
	{
		symbol: "FORS",
		address: "0xb1EC548F296270BC96B8A1b3b3C8F3f04b494215",
		decimals: 18
	},
	{
		symbol: "FORTH",
		address: "0x77FbA179C79De5B7653F68b5039Af940AdA60ce0",
		decimals: 18
	},
	{
		symbol: "FOTA",
		address: "0x4270bb238f6DD8B1c3ca01f96CA65b2647c06D3C",
		decimals: 18
	},
	{
		symbol: "FOUR",
		address: "0x4730fB1463A6F1F44AEB45F6c5c422427f37F4D0",
		decimals: 18
	},
	{
		symbol: "FOX",
		address: "0xc770EEfAd204B5180dF6a14Ee197D99d808ee52d",
		decimals: 18
	},
	{
		symbol: "FOXT",
		address: "0xFbe878CED08132bd8396988671b450793C44bC12",
		decimals: 18
	},
	{
		symbol: "FP.CX",
		address: "0x3D193bd867D00439EdCBd2B8F7684e5151bdAd5a",
		decimals: 8
	},
	{
		symbol: "FPT",
		address: "0x084Da5a9C0e3f086532b98d8568432349b89d9DF",
		decimals: 18
	},
	{
		symbol: "FPT",
		address: "0x9d5e6b92Ba3f75589943372DF82DbD3A8A802e80",
		decimals: 18
	},
	{
		symbol: "FR",
		address: "0xC626e0619aC79AFEa9281c8eB9b1a9f9D3Fab532",
		decimals: 18
	},
	{
		symbol: "FRAX",
		address: "0x853d955aCEf822Db058eb8505911ED77F175b99e",
		decimals: 18
	},
	{
		symbol: "FRD",
		address: "0x0ABeFb7611Cb3A01EA3FaD85f33C3C934F8e2cF4",
		decimals: 18
	},
	{
		symbol: "FREC",
		address: "0x17e67d1CB4e349B9CA4Bc3e17C7DF2a397A7BB64",
		decimals: 18
	},
	{
		symbol: "FRECNX",
		address: "0xd8B8E1Eca89dA014E67fDbc2014eaA8E171079bF",
		decimals: 18
	},
	{
		symbol: "FREE",
		address: "0x2F141Ce366a2462f02cEA3D12CF93E4DCa49e4Fd",
		decimals: 18
	},
	{
		symbol: "FRM",
		address: "0xE5CAeF4Af8780E59Df925470b050Fb23C43CA68C",
		decimals: 6
	},
	{
		symbol: "FRONT",
		address: "0xf8C3527CC04340b208C854E985240c02F7B7793f",
		decimals: 18
	},
	{
		symbol: "FRV",
		address: "0x48DF4E0296f908CEAb0428A5182D19B31fC037d6",
		decimals: 8
	},
	{
		symbol: "FRX",
		address: "0x36a73557f5BDE5195EC39eCA82d28b8A36D21141",
		decimals: 18
	},
	{
		symbol: "FRY",
		address: "0x6c972b70c533E2E045F333Ee28b9fFb8D717bE69",
		decimals: 18
	},
	{
		symbol: "FSBT",
		address: "0x1ed7AE1F0E2Fa4276DD7ddC786334a3dF81D50c0",
		decimals: 18
	},
	{
		symbol: "FSCP",
		address: "0x2c31C747e0D1eb1f662b619461DcED4ce5ca22Ea",
		decimals: 8
	},
	{
		symbol: "FSLR.CX",
		address: "0xf346298C09Ea6726308d9cE82eDdcb93cFCCab6E",
		decimals: 8
	},
	{
		symbol: "FSN",
		address: "0xD0352a019e9AB9d757776F532377aAEbd36Fd541",
		decimals: 18
	},
	{
		symbol: "FSP",
		address: "0x0128E4FcCf5EF86b030b28f0a8A029A3c5397a94",
		decimals: 18
	},
	{
		symbol: "FST",
		address: "0x310c93dfc1C5E34CDF51678103f63C41762089CD",
		decimals: 6
	},
	{
		symbol: "FSW",
		address: "0xfffffffFf15AbF397dA76f1dcc1A1604F45126DB",
		decimals: 18
	},
	{
		symbol: "FSXA",
		address: "0xf0B0A13d908253D954BA031a425dFd54f94a2e3D",
		decimals: 8
	},
	{
		symbol: "FT",
		address: "0x78a73B6CBc5D183CE56e786f6e905CaDEC63547B",
		decimals: 18
	},
	{
		symbol: "FTB",
		address: "0x71c25Dd74A8bF4fb393Cb06623aA43a5376D1431",
		decimals: 18
	},
	{
		symbol: "FTB",
		address: "0x1E71034C89dD191ACcB27dC35f18a3d8b6f91311",
		decimals: 18
	},
	{
		symbol: "FTBC",
		address: "0xD688bAC17e2d58dB5B5a61A6fA658C24bC7d45C0",
		decimals: 18
	},
	{
		symbol: "FTC",
		address: "0xe6f74dcfa0E20883008d8C16b6d9a329189D0C30",
		decimals: 2
	},
	{
		symbol: "ftc",
		address: "0x26aC29dC25806199373cb4884AA9E077a0587c5b",
		decimals: 18
	},
	{
		symbol: "FTCH.CX",
		address: "0xfb1534a824075C1e2Aa4e914384D3E0A89f67D14",
		decimals: 8
	},
	{
		symbol: "FTCOIN",
		address: "0x2B7922FdF76Fb3466902C7B702A20EA6A450A0A0",
		decimals: 18
	},
	{
		symbol: "FTEC",
		address: "0x6BeC54E4fEa5d541fB14de96993b8E11d81159b2",
		decimals: 18
	},
	{
		symbol: "FTH",
		address: "0xB414F8Ec2D14c64f37B1559CBE43746284514596",
		decimals: 18
	},
	{
		symbol: "FTI",
		address: "0x943ED852DadB5C3938ECdC6883718df8142DE4C8",
		decimals: 18
	},
	{
		symbol: "FTM",
		address: "0x4E15361FD6b4BB609Fa63C81A2be19d873717870",
		decimals: 18
	},
	{
		symbol: "FTN",
		address: "0x66d9c4D19b4C8e23a54C6dc4CeEd141f66b8111C",
		decimals: 18
	},
	{
		symbol: "FTO",
		address: "0x21839a7f7e88c19a6089AdBFB3fB52606Ac6f0Dd",
		decimals: 18
	},
	{
		symbol: "FTR",
		address: "0x2023DCf7c438c8C8C0B0F28dBaE15520B4f3Ee20",
		decimals: 18
	},
	{
		symbol: "FTT",
		address: "0x174bea2cb8b20646681E855196cF34FcEcEc2489",
		decimals: 18
	},
	{
		symbol: "FTT",
		address: "0x2AEC18c5500f21359CE1BEA5Dc1777344dF4C0Dc",
		decimals: 18
	},
	{
		symbol: "FTT",
		address: "0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9",
		decimals: 18
	},
	{
		symbol: "FTX",
		address: "0xd559f20296FF4895da39b5bd9ADd54b442596a61",
		decimals: 18
	},
	{
		symbol: "FTXR.CX",
		address: "0xb8155B9F5676D26a8E90e830E4Fea103A3D340fc",
		decimals: 8
	},
	{
		symbol: "FTXT",
		address: "0x41875C2332B0877cDFAA699B641402b7D4642c32",
		decimals: 8
	},
	{
		symbol: "FUCK",
		address: "0x65Be44C747988fBF606207698c944Df4442efE19",
		decimals: 4
	},
	{
		symbol: "FUEL",
		address: "0xEA38eAa3C86c8F9B751533Ba2E562deb9acDED40",
		decimals: 18
	},
	{
		symbol: "FUN",
		address: "0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b",
		decimals: 8
	},
	{
		symbol: "FUND",
		address: "0xd20bcBD56d9D551CAc10a6bC2a83635BFb72F3F4",
		decimals: 6
	},
	{
		symbol: "FUNDZ",
		address: "0xbF5496122CF1bB778E0cBE5eaB936f2BE5fC0940",
		decimals: 18
	},
	{
		symbol: "FURT",
		address: "0xDDe45247Da97491efD04E96518Ae71288F11e0e6",
		decimals: 18
	},
	{
		symbol: "FUSD",
		address: "0x7F20f6E68BD14DbDB95244DbEE6C316999a2D4c1",
		decimals: 8
	},
	{
		symbol: "FUSE",
		address: "0x970B9bB2C0444F5E81e9d0eFb84C8ccdcdcAf84d",
		decimals: 18
	},
	{
		symbol: "FVRR.CX",
		address: "0xea8dF5308e7463C555047FCd612DECfae7d71058",
		decimals: 8
	},
	{
		symbol: "FWB",
		address: "0x7d91e637589EC3Bb54D8213a9e92Dc6E8D12da91",
		decimals: 4
	},
	{
		symbol: "FWC",
		address: "0x442bE638C626A77eB5D86C0fA2b441bA1cC97F3A",
		decimals: 18
	},
	{
		symbol: "FWT",
		address: "0xf151980E7A781481709e8195744bF2399FB3Cba4",
		decimals: 18
	},
	{
		symbol: "FWY",
		address: "0x6C6Ab7fC6f906298D54fEd3606a39b5e5ee5f782",
		decimals: 18
	},
	{
		symbol: "FX",
		address: "0x8c15Ef5b4B21951d50E53E4fbdA8298FFAD25057",
		decimals: 18
	},
	{
		symbol: "FX1",
		address: "0xED0e2041BFb5a426e5ED426A73765624E08BbB75",
		decimals: 18
	},
	{
		symbol: "FXBK",
		address: "0xcb554Bfb068B54A474A184aCD1f743CCd27aFE5B",
		decimals: 2
	},
	{
		symbol: "FXC",
		address: "0x1E6063B7B3A1c1952eD2c4087fd528998dB69Ec7",
		decimals: 18
	},
	{
		symbol: "FXC",
		address: "0x4a57E687b9126435a9B19E4A802113e266AdeBde",
		decimals: 18
	},
	{
		symbol: "FXE",
		address: "0x9653cFd0865ad8313BEA2f0C2EC0584BFd05115B",
		decimals: 8
	},
	{
		symbol: "FXF",
		address: "0x8a40c222996f9F3431f63Bf80244C36822060f12",
		decimals: 18
	},
	{
		symbol: "FXP",
		address: "0x14dDda446688b73161AA1382F4E4343353aF6FC8",
		decimals: 8
	},
	{
		symbol: "FXS",
		address: "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0",
		decimals: 18
	},
	{
		symbol: "FXT",
		address: "0x1829aA045E21E0D59580024A951DB48096e01782",
		decimals: 18
	},
	{
		symbol: "FXY",
		address: "0xA024E8057EEC474a9b2356833707Dd0579E26eF3",
		decimals: 18
	},
	{
		symbol: "FYP",
		address: "0x8F0921f30555624143d427b340b1156914882C10",
		decimals: 18
	},
	{
		symbol: "FYY",
		address: "0x6F39297BC0C386355C77DA3A0275C867B21b2454",
		decimals: 8
	},
	{
		symbol: "FZ",
		address: "0xE5aeE163513119F4F750376C718766B40fA37A5F",
		decimals: 18
	},
	{
		symbol: "G4B",
		address: "0x54672394026d16F223FdCD912973218AdB4b0E6d",
		decimals: 2
	},
	{
		symbol: "g9tro",
		address: "0xfC64C0adF4a08008E3fA2bf9c03540032B1C8288",
		decimals: 10
	},
	{
		symbol: "GALA",
		address: "0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA",
		decimals: 8
	},
	{
		symbol: "GAM",
		address: "0xF67451Dc8421F0e0afEB52faa8101034ed081Ed9",
		decimals: 8
	},
	{
		symbol: "GAME",
		address: "0x63f88A2298a5c4AEE3c216Aa6D926B184a4b2437",
		decimals: 18
	},
	{
		symbol: "GANA",
		address: "0x8b342D2De85cD4f6e206e7b8D777029c13EC213F",
		decimals: 18
	},
	{
		symbol: "GAP",
		address: "0x9570eC7ab05D61877ff7Eb180F837c7c079c4844",
		decimals: 18
	},
	{
		symbol: "GARD",
		address: "0x5c64031C62061865E5FD0F53d3CDaeF80f72E99D",
		decimals: 18
	},
	{
		symbol: "GAT",
		address: "0x687174f8C49ceb7729D925C3A961507ea4Ac7b28",
		decimals: 18
	},
	{
		symbol: "GATE",
		address: "0x9d7630aDF7ab0b0CB00Af747Db76864df0EC82E4",
		decimals: 18
	},
	{
		symbol: "GATOR",
		address: "0xF5c0E24ACA5217BcBAe662871caE1A86873F02db",
		decimals: 18
	},
	{
		symbol: "GAVEL",
		address: "0x708876f486e448Ee89eB332bFbC8E593553058b9",
		decimals: 18
	},
	{
		symbol: "GBK",
		address: "0x3e522D144814BD6149C1F3e0c6cD19d0941372AC",
		decimals: 18
	},
	{
		symbol: "GBO",
		address: "0xCc2a74b28E786Fac86bE3CA354B1941c25aB3EaB",
		decimals: 18
	},
	{
		symbol: "GBP",
		address: "0x0cf58006B2400ebec3eB8C05b73170138a340563",
		decimals: 18
	},
	{
		symbol: "GBPU",
		address: "0x27ed129C298c5Df130364083F491e2920E5A2f29",
		decimals: 18
	},
	{
		symbol: "GBPX",
		address: "0xf85EF57fCDB36D628D063Fa663e61e44D35AE661",
		decimals: 18
	},
	{
		symbol: "GBT",
		address: "0xD8Bd3958725F216Eb236E9DC65B169DE48101C6A",
		decimals: 8
	},
	{
		symbol: "GBT",
		address: "0x7585F835ae2d522722d2684323a0ba83401f32f5",
		decimals: 18
	},
	{
		symbol: "GBX",
		address: "0x8A2A3F3ffb78880838f9d7603601f837F72C2Ec9",
		decimals: 18
	},
	{
		symbol: "GBX",
		address: "0x12fCd6463E66974cF7bBC24FFC4d40d6bE458283",
		decimals: 8
	},
	{
		symbol: "GC",
		address: "0x8Eb38715604b938812DEC25A0A1bc05B4becB9ca",
		decimals: 18
	},
	{
		symbol: "GC",
		address: "0x486A72811ae65C4C814Ba929d6da35497d21296f",
		decimals: 18
	},
	{
		symbol: "GCBN",
		address: "0x15c303B84045f67156AcF6963954e4247B526717",
		decimals: 18
	},
	{
		symbol: "GCC",
		address: "0x8277Bf16E448942c257D7ad51e4Cac0004Eb30A0",
		decimals: 18
	},
	{
		symbol: "GCC",
		address: "0xB627D12F7024C78B1139CbB31348393b3D37774D",
		decimals: 8
	},
	{
		symbol: "GCD",
		address: "0x54325E3946c3f558162F8A7E79A5DC89e3Fbb2f4",
		decimals: 2
	},
	{
		symbol: "GCG",
		address: "0x1778fFfBD431be2AC3D69e64d1d819C786B2BEe0",
		decimals: 8
	},
	{
		symbol: "GCM",
		address: "0x9bd4f0B2c73B5E2bef9F1aB0841E5C460Cf8CEdC",
		decimals: 0
	},
	{
		symbol: "GCP",
		address: "0xdb0F69306FF8F949f258E83f6b87ee5D052d0b23",
		decimals: 18
	},
	{
		symbol: "GCPH",
		address: "0x1eC52a7A6048c1Ca8b8aFd8ef97051acFe755E35",
		decimals: 18
	},
	{
		symbol: "GCR",
		address: "0x37F6F8eb409DEB9fEAf032c109A72319F665C79D",
		decimals: 18
	},
	{
		symbol: "GCS",
		address: "0x86949Dc8043A5fD7619A1289d65964aD5ec3D25c",
		decimals: 8
	},
	{
		symbol: "GCU",
		address: "0xa4ec83c8907888d006A37debF755ee39766f38ae",
		decimals: 18
	},
	{
		symbol: "GCX",
		address: "0x44A67C8570a61A28bAfd0035042f2F0A73a64428",
		decimals: 6
	},
	{
		symbol: "GD.CX",
		address: "0x1dcDeBa9522072F8AC5B7F2E8CCacb40b864D739",
		decimals: 8
	},
	{
		symbol: "GDAO",
		address: "0x515d7E9D75E2b76DB60F8a051Cd890eBa23286Bc",
		decimals: 18
	},
	{
		symbol: "GDAX.CX",
		address: "0xEF50d71a8019508217EC4cc662D63158C1F8E617",
		decimals: 8
	},
	{
		symbol: "GDC",
		address: "0x301C755bA0fcA00B1923768Fffb3Df7f4E63aF31",
		decimals: 18
	},
	{
		symbol: "GDCT",
		address: "0xb9c6782f875f92670342Dd5e1Ff1a57B41588Ce2",
		decimals: 8
	},
	{
		symbol: "GDP",
		address: "0xca224dfA3c3B2e44F31B5F4bB2B69be70a0e474E",
		decimals: 18
	},
	{
		symbol: "GDR",
		address: "0x874D4C9B980f1a13dD44CBcDB912e24Ef0671eD0",
		decimals: 18
	},
	{
		symbol: "GE.CX",
		address: "0x4FECc0F0630dC13B6986420d623A017dF7Ac8916",
		decimals: 8
	},
	{
		symbol: "GEAR",
		address: "0x1b980e05943dE3dB3a459C72325338d327B6F5a9",
		decimals: 18
	},
	{
		symbol: "GEE",
		address: "0x4F4f0Db4de903B88f2B1a2847971E231D54F8fd3",
		decimals: 8
	},
	{
		symbol: "GEEQ",
		address: "0x6B9f031D718dDed0d681c20cB754F97b3BB81b78",
		decimals: 18
	},
	{
		symbol: "GELD",
		address: "0x24083Bb30072643C3bB90B44B7285860a755e687",
		decimals: 18
	},
	{
		symbol: "GEM",
		address: "0xc7BbA5b765581eFb2Cdd2679DB5Bea9eE79b201f",
		decimals: 18
	},
	{
		symbol: "GEN",
		address: "0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf",
		decimals: 18
	},
	{
		symbol: "GENE",
		address: "0x884181554dfA9e578d36379919C05C25dC4a15bB",
		decimals: 18
	},
	{
		symbol: "GENE",
		address: "0x6DD4e4Aad29A40eDd6A409b9c1625186C9855b4D",
		decimals: 8
	},
	{
		symbol: "GENES",
		address: "0x1673A63aA0047294d75954226f3F2F98De77b16f",
		decimals: 18
	},
	{
		symbol: "GEO",
		address: "0x147faF8De9d8D8DAAE129B187F0D02D819126750",
		decimals: 18
	},
	{
		symbol: "GERC",
		address: "0x4f7D5a7588771e7889b599dBcb67c63A28129732",
		decimals: 3
	},
	{
		symbol: "GERO",
		address: "0x3431F91b3a388115F00C5Ba9FdB899851D005Fb5",
		decimals: 18
	},
	{
		symbol: "GES",
		address: "0xFB1e5F5e984C28Ad7E228CDaA1F8A0919BB6a09B",
		decimals: 18
	},
	{
		symbol: "GET",
		address: "0x8a854288a5976036A725879164Ca3e91d30c6A1B",
		decimals: 18
	},
	{
		symbol: "GETX",
		address: "0x07a58629AAF3e1A0d07D8f43114B76BD5EEe3B91",
		decimals: 18
	},
	{
		symbol: "GEX",
		address: "0x03282f2D7834a97369Cad58f888aDa19EeC46ab6",
		decimals: 8
	},
	{
		symbol: "GEX",
		address: "0x66142B81db17d7c0bd91f502D00382e326a24c2a",
		decimals: 8
	},
	{
		symbol: "GFC",
		address: "0x6667A56d8fCB35448eE8514936e6D6c4CcC86E97",
		decimals: 8
	},
	{
		symbol: "GFCS",
		address: "0x4F34adfff48CEB4Af2f3b2253CdFdcC99c9053F4",
		decimals: 0
	},
	{
		symbol: "GFN",
		address: "0x3930E4dDb4d24ef2F4CB54C1f009a3694b708428",
		decimals: 8
	},
	{
		symbol: "GFUN",
		address: "0x919D3a363776B1ceec9352610c82dfaf80Edc32d",
		decimals: 18
	},
	{
		symbol: "GGC",
		address: "0x7F969C4D388Ca0AE39A4FdDB1A6f89878CA2fBf8",
		decimals: 18
	},
	{
		symbol: "GGC",
		address: "0x1BE7cFD61aA8dAaa9FF2F3b8820888f09462d037",
		decimals: 8
	},
	{
		symbol: "GHC",
		address: "0xaD584f8B2d721aDbd28F587274aa4EBE488b3Ba8",
		decimals: 18
	},
	{
		symbol: "GHC",
		address: "0x415f07C7C57b1A213767eD8E3EB4B321Fa04Bb7c",
		decimals: 6
	},
	{
		symbol: "GHD",
		address: "0x3b544e6fcf6C8dCE9D8B45A4FdF21C9B02f9fDa9",
		decimals: 18
	},
	{
		symbol: "GHOST",
		address: "0x4c327471C44B2dacD6E90525f9D629bd2e4f662C",
		decimals: 18
	},
	{
		symbol: "GHST",
		address: "0x3F382DbD960E3a9bbCeaE22651E88158d2791550",
		decimals: 18
	},
	{
		symbol: "GHST",
		address: "0x5c248Af2FaFDFFA820A3F54Bfc35beF9b5879b5C",
		decimals: 18
	},
	{
		symbol: "GHT",
		address: "0xbe30F684d62C9F7883a75A29c162c332c0d98f23",
		decimals: 18
	},
	{
		symbol: "GHT",
		address: "0x50625b636dAB619BF6AF75f693Dc486E56C2a694",
		decimals: 10
	},
	{
		symbol: "gif",
		address: "0xFcD862985628b254061F7A918035B80340D045d3",
		decimals: 18
	},
	{
		symbol: "GIG",
		address: "0x838d8e11B160deC88Fe62BF0f743FB7000941e13",
		decimals: 18
	},
	{
		symbol: "GILD.CX",
		address: "0xC305787aCdC859B36f64D72Cb0e00519D20731Ad",
		decimals: 8
	},
	{
		symbol: "GIM",
		address: "0xaE4f56F072c34C0a65B3ae3E4DB797D831439D93",
		decimals: 8
	},
	{
		symbol: "GIRL",
		address: "0x9Aa7d119bdf77F65A7284581A211D8c44ffb04b4",
		decimals: 18
	},
	{
		symbol: "GIVES",
		address: "0x5feeE18D8BA20bE1fbfad89B2b793E03c8bB3b95",
		decimals: 8
	},
	{
		symbol: "GL",
		address: "0xA5B399a76bbAbEf93D70255525C1d2BCC3701d0b",
		decimals: 18
	},
	{
		symbol: "GLA",
		address: "0x71D01dB8d6a2fBEa7f8d434599C237980C234e4C",
		decimals: 8
	},
	{
		symbol: "GLCH",
		address: "0x038a68FF68c393373eC894015816e33Ad41BD564",
		decimals: 18
	},
	{
		symbol: "GLEX",
		address: "0x0A0DB74Ef8b4480cc29b7D68647727fEeB1ea4eC",
		decimals: 18
	},
	{
		symbol: "GLM",
		address: "0x7DD9c5Cba05E151C895FDe1CF355C9A1D5DA6429",
		decimals: 18
	},
	{
		symbol: "GLOB",
		address: "0x45F2aB0ca2116b2e1a70BF5e13293947b25d0272",
		decimals: 18
	},
	{
		symbol: "GLPG.CX",
		address: "0x7C0382583Bc52d677d17E205665979cA75AA724A",
		decimals: 8
	},
	{
		symbol: "GLQ",
		address: "0x9F9c8ec3534c3cE16F928381372BfbFBFb9F4D24",
		decimals: 18
	},
	{
		symbol: "GMAT",
		address: "0xA110eeebc0751407bDCAeA4CD230F04A2b82a33a",
		decimals: 18
	},
	{
		symbol: "GMAT",
		address: "0xB13dE094Cc5CEe6C4cC0A3737bf0290166D9Ca5D",
		decimals: 18
	},
	{
		symbol: "GMB",
		address: "0x1d464Ac5e046e5fE280c9588eDF8eB681b07008F",
		decimals: 18
	},
	{
		symbol: "GMC",
		address: "0xa311856B777Df090D2D3D8C306CaAf6e4DfD9AE9",
		decimals: 18
	},
	{
		symbol: "GMC",
		address: "0xcC3693C52d4e4fFC1910d90cDd8C52F66Bc83262",
		decimals: 4
	},
	{
		symbol: "GMC",
		address: "0x2e9EF342F50A10e87DdaD06d0FC6D3f0223726c9",
		decimals: 18
	},
	{
		symbol: "GMC",
		address: "0x68FeC0bcc61727dDec5CeCE2683027A383492710",
		decimals: 18
	},
	{
		symbol: "GMC",
		address: "0xa6272359bc37f61AF398071B65C8934ACA744d53",
		decimals: 18
	},
	{
		symbol: "GMCI",
		address: "0x5Dc74029509752F4ed9A609C2bb52216275E4c1D",
		decimals: 8
	},
	{
		symbol: "GMD",
		address: "0x2509B1A5FF82AB94172cFc527676AcF45C2A0D08",
		decimals: 16
	},
	{
		symbol: "GME.CX",
		address: "0x79f9ef8429B24E3cB0929eAaa5FABfCC3B15F86D",
		decimals: 8
	},
	{
		symbol: "GMM",
		address: "0x7aF89c8A06719271A96e62E290Ea9Ed192E73FC1",
		decimals: 18
	},
	{
		symbol: "GMR",
		address: "0x9B8D5f3402F74C7a61d9f09c32D3cA07b45c1466",
		decimals: 18
	},
	{
		symbol: "GMT",
		address: "0xb3Bd49E28f8F832b8d1E246106991e546c323502",
		decimals: 18
	},
	{
		symbol: "GMX",
		address: "0xD28807D7eF028AF6728d12Ccd621b2242Da2a64f",
		decimals: 18
	},
	{
		symbol: "GNG",
		address: "0xF1a355cc5953a5C04130F221b6CCAd13c3f82990",
		decimals: 18
	},
	{
		symbol: "GNO",
		address: "0x6810e776880C02933D47DB1b9fc05908e5386b96",
		decimals: 18
	},
	{
		symbol: "GNT",
		address: "0xa74476443119A942dE498590Fe1f2454d7D4aC0d",
		decimals: 18
	},
	{
		symbol: "GNTO",
		address: "0x7b3296198F8A548Edf89BDB16864Da8F37b7D9cB",
		decimals: 18
	},
	{
		symbol: "GNX",
		address: "0x6EC8a24CaBdc339A06a172F8223ea557055aDAa5",
		decimals: 9
	},
	{
		symbol: "GNY",
		address: "0x247551F2EB3362E222c742E9c788B8957D9BC87e",
		decimals: 18
	},
	{
		symbol: "GNY",
		address: "0xb1f871Ae9462F1b2C6826E88A7827e76f86751d4",
		decimals: 18
	},
	{
		symbol: "GOAT",
		address: "0x9F452E458B024e82d6e3fF50A07b8DE74c988523",
		decimals: 18
	},
	{
		symbol: "GOCO",
		address: "0xE5A9f7D738A839E93E611b9BfA19251542C72427",
		decimals: 18
	},
	{
		symbol: "GOF",
		address: "0x488E0369f9BC5C40C002eA7c1fe4fd01A198801c",
		decimals: 18
	},
	{
		symbol: "GOI",
		address: "0x2f34dD3d46855277Eee79a1d724c2249f770054b",
		decimals: 18
	},
	{
		symbol: "GOLD",
		address: "0x150b0b96933B75Ce27af8b92441F8fB683bF9739",
		decimals: 18
	},
	{
		symbol: "GOLDR",
		address: "0xcfE4F03C3AFbB9857b29fC706180Bf0044900D59",
		decimals: 8
	},
	{
		symbol: "GOLDX",
		address: "0xeAb43193CF0623073Ca89DB9B712796356FA7414",
		decimals: 18
	},
	{
		symbol: "GOLDX",
		address: "0x355C665e101B9DA58704A8fDDb5FeeF210eF20c0",
		decimals: 18
	},
	{
		symbol: "GOLF",
		address: "0x020C710646e23AB868dbE5B88004892797fE4eFb",
		decimals: 18
	},
	{
		symbol: "GOM2",
		address: "0x48783486ddD7fa85ECa6B0C4AE8920Bc25DfbcD7",
		decimals: 0
	},
	{
		symbol: "GOO",
		address: "0xDF0960778C6E6597f197Ed9a25F12F5d971da86c",
		decimals: 12
	},
	{
		symbol: "GOOG.CX",
		address: "0x368e5B38Ec4B605F3607C09F3952cb996aD50f34",
		decimals: 8
	},
	{
		symbol: "GOT",
		address: "0x8678b5FB41d87F4BEC43B3142Bce852366100336",
		decimals: 18
	},
	{
		symbol: "GOT",
		address: "0x613Fa2A6e6DAA70c659060E86bA1443D2679c9D7",
		decimals: 18
	},
	{
		symbol: "GOT",
		address: "0x423b5F62b328D0D6D44870F4Eee316befA0b2dF5",
		decimals: 18
	},
	{
		symbol: "GOVI",
		address: "0xeEAA40B28A2d1b0B08f6f97bB1DD4B75316c6107",
		decimals: 18
	},
	{
		symbol: "GPC",
		address: "0x6076361202cd4d4aBAAF95f48823fE0ab7763eB0",
		decimals: 18
	},
	{
		symbol: "GPN",
		address: "0xE2b407160AAd5540eAc0e80338b9a5085C60F25B",
		decimals: 18
	},
	{
		symbol: "GPO",
		address: "0x5CF501E64786444E025C5b24025f98399538ea5d",
		decimals: 18
	},
	{
		symbol: "GPRO.CX",
		address: "0x07Bcbb61F3F499715185210715c544eaD22AA1b2",
		decimals: 8
	},
	{
		symbol: "GPS",
		address: "0xeF1483eF1Bc192f1C8201dF89f9356fe80652089",
		decimals: 8
	},
	{
		symbol: "GPS.CX",
		address: "0xBD5b192Fa5AF70f1F871e4A155A3Be1A43a1D583",
		decimals: 8
	},
	{
		symbol: "GQC",
		address: "0xCb4787bF505a751ec37678E33d2b4fdF491aF9d2",
		decimals: 18
	},
	{
		symbol: "GR",
		address: "0xcE593a29905951E8Fc579bC092ecA72577dA575c",
		decimals: 6
	},
	{
		symbol: "GRAP",
		address: "0xC8D2AB2a6FdEbC25432E54941cb85b55b9f152dB",
		decimals: 18
	},
	{
		symbol: "GRAPH",
		address: "0x165440036Ce972C5F8EBef667086707e48B2623e",
		decimals: 18
	},
	{
		symbol: "GRG",
		address: "0x4FbB350052Bca5417566f188eB2EBCE5b19BC964",
		decimals: 18
	},
	{
		symbol: "GRID",
		address: "0x12B19D3e2ccc14Da04FAe33e63652ce469b3F2FD",
		decimals: 12
	},
	{
		symbol: "GRM",
		address: "0xC8c6FC3c4f6342c5291e747268625f979A888EBF",
		decimals: 18
	},
	{
		symbol: "GRMD",
		address: "0xb444208cB0516C150178fCf9a52604BC04A1aCEa",
		decimals: 18
	},
	{
		symbol: "GRMN.CX",
		address: "0xEAA088CCC8254795cb372000Bda9B11e075e1dD0",
		decimals: 8
	},
	{
		symbol: "GRO",
		address: "0x09e64c2B61a5f1690Ee6fbeD9baf5D6990F8dFd0",
		decimals: 18
	},
	{
		symbol: "GROO",
		address: "0xC17195bde49D70CefCF8A9F2ee1759FFC27BF0B1",
		decimals: 18
	},
	{
		symbol: "GROW",
		address: "0x0a9A9ce600D08BF9b76F49FA4e7b38A67EBEB1E6",
		decimals: 8
	},
	{
		symbol: "GRT",
		address: "0x620fA2993046A53dF1f365fa3fDC9e6c7763AF96",
		decimals: 8
	},
	{
		symbol: "GRT",
		address: "0xc944E90C64B2c07662A292be6244BDf05Cda44a7",
		decimals: 18
	},
	{
		symbol: "GRT",
		address: "0x1fB6bccc7Da51aa32e96118B8A33226d2Ae16517",
		decimals: 8
	},
	{
		symbol: "GRT",
		address: "0xb83Cd8d39462B761bb0092437d38b37812dd80A2",
		decimals: 18
	},
	{
		symbol: "GRVC",
		address: "0xDfE0eC369Ea08EA65c486Ac5c20BB7a2EEbCABea",
		decimals: 0
	},
	{
		symbol: "GRX",
		address: "0x219218f117DC9348b358b8471c55A073E5e0dA0b",
		decimals: 18
	},
	{
		symbol: "GSC",
		address: "0x228ba514309FFDF03A81a205a6D040E429d6E80C",
		decimals: 18
	},
	{
		symbol: "GSE",
		address: "0xe530441f4f73bDB6DC2fA5aF7c3fC5fD551Ec838",
		decimals: 4
	},
	{
		symbol: "GST",
		address: "0x3AFA1902b1f8a802aBC18e5aD982D1bCd34AfE22",
		decimals: 18
	},
	{
		symbol: "GST",
		address: "0x67a9099f0008C35C61c00042cd9Fb03684451097",
		decimals: 18
	},
	{
		symbol: "GST2",
		address: "0x0000000000b3F879cb30FE243b4Dfee438691c04",
		decimals: 2
	},
	{
		symbol: "GSWAP",
		address: "0xaac41EC512808d64625576EDdd580e7Ea40ef8B2",
		decimals: 18
	},
	{
		symbol: "GT",
		address: "0xE66747a101bFF2dBA3697199DCcE5b743b454759",
		decimals: 18
	},
	{
		symbol: "GT.CX",
		address: "0xD0943fF6A36b421189d2AF4a03Bd53D31f55a624",
		decimals: 8
	},
	{
		symbol: "GTC",
		address: "0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F",
		decimals: 18
	},
	{
		symbol: "GTC",
		address: "0xB70835D7822eBB9426B56543E391846C107bd32C",
		decimals: 18
	},
	{
		symbol: "GTC",
		address: "0xe138FDa441fC31B36171122397a8A11d6cd2c479",
		decimals: 0
	},
	{
		symbol: "GTEC",
		address: "0x30E193bd3F52713D5562cf316f35115034525f44",
		decimals: 18
	},
	{
		symbol: "GTF",
		address: "0x6EFc2e6C913ad5B7d91072Bd1419b1f9D1080fC8",
		decimals: 8
	},
	{
		symbol: "GTH",
		address: "0xc3771d47E2Ab5A519E2917E61e23078d0C05Ed7f",
		decimals: 18
	},
	{
		symbol: "GTKT",
		address: "0x025abAD9e518516fdaAFBDcdB9701b37fb7eF0FA",
		decimals: 0
	},
	{
		symbol: "GTO",
		address: "0xC5bBaE50781Be1669306b9e001EFF57a2957b09d",
		decimals: 5
	},
	{
		symbol: "GTR",
		address: "0xb95d3Bdf3f2b6b5dD380693aCbdeCcaA291506d8",
		decimals: 18
	},
	{
		symbol: "GTS",
		address: "0x951A1070AC39851dCc07b302230A68F81929a5F1",
		decimals: 8
	},
	{
		symbol: "GTSE",
		address: "0xc5516Ab4614F33328131dA27ECba516a396178B4",
		decimals: 18
	},
	{
		symbol: "GUBI",
		address: "0x12b2B2331A72d375c453c160B2c8A7010EeA510A",
		decimals: 18
	},
	{
		symbol: "GUESS",
		address: "0xBDCFbf5C4D91Abc0bC9709C7286d00063c0e6F22",
		decimals: 2
	},
	{
		symbol: "GULD",
		address: "0x9847345de8b614c956146bbea549336d9C8d26b6",
		decimals: 8
	},
	{
		symbol: "GUM",
		address: "0x4f5fa8f2d12e5eB780f6082Dd656C565C48E0f24",
		decimals: 18
	},
	{
		symbol: "GUP",
		address: "0xf7B098298f7C69Fc14610bf71d5e02c60792894C",
		decimals: 3
	},
	{
		symbol: "GUS",
		address: "0x228E009Ab91491880aDB0edA6eD1BCD640FFD020",
		decimals: 5
	},
	{
		symbol: "GUSD",
		address: "0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd",
		decimals: 2
	},
	{
		symbol: "GVE",
		address: "0x81705082eF9f0D660f07BE80093D46d826d48b25",
		decimals: 18
	},
	{
		symbol: "GVT",
		address: "0x103c3A209da59d3E7C4A89307e66521e081CFDF0",
		decimals: 18
	},
	{
		symbol: "GW",
		address: "0x97C4025aAe58B8530ec86368101fdece17433b33",
		decimals: 8
	},
	{
		symbol: "GWIT",
		address: "0x55D0Bb8D7e7fBf5B863C7923c4645FF83c3D0033",
		decimals: 18
	},
	{
		symbol: "GWP",
		address: "0x4fFe33e525042Cc84C503Db5842Ecda280F4a805",
		decimals: 18
	},
	{
		symbol: "GWPH.CX",
		address: "0xb17BFA6da55cdAFCd1dBC2023cDd0bc821b0677d",
		decimals: 8
	},
	{
		symbol: "GXC",
		address: "0x58ca3065C0F24C7c96Aee8d6056b5B5deCf9c2f8",
		decimals: 10
	},
	{
		symbol: "GXC",
		address: "0x2e93FE8d550a7B7E7b2e561cd45ceBccbAa79358",
		decimals: 5
	},
	{
		symbol: "GXC",
		address: "0x953e22945b416730bAD05009aF05B420e598E412",
		decimals: 18
	},
	{
		symbol: "GXT",
		address: "0x28d3E409bb9bC58F1ca6E009f8fC78A1db85e6b7",
		decimals: 18
	},
	{
		symbol: "GXVC",
		address: "0x22F0AF8D78851b72EE799e05F54A77001586B18A",
		decimals: 10
	},
	{
		symbol: "GZB",
		address: "0x9DAe8b7F6D37ea8e5d32C6c3E856a6d8a1d3B363",
		decimals: 18
	},
	{
		symbol: "GZB",
		address: "0xD265f1AB53bE1eEBDF55A0A6E6f2cA3Af86b1778",
		decimals: 6
	},
	{
		symbol: "GZE",
		address: "0x4AC00f287f36A6Aad655281fE1cA6798C9cb727b",
		decimals: 18
	},
	{
		symbol: "GZE",
		address: "0x8C65e992297d5f092A756dEf24F4781a280198Ff",
		decimals: 18
	},
	{
		symbol: "GZM",
		address: "0x0A680E503fd9ae14B62444C75ffB4BEf1F105666",
		decimals: 8
	},
	{
		symbol: "GZR",
		address: "0xE638dc39b6aDBEE8526b5C22380b4b45dAf46d8e",
		decimals: 6
	},
	{
		symbol: "HABS",
		address: "0x5bfc1FF7f9e087C64fEfb34F2e7cF24e5570919F",
		decimals: 18
	},
	{
		symbol: "HAC",
		address: "0x43567eb78638A55bbE51E9f9FB5B2D7AD1F125aa",
		decimals: 4
	},
	{
		symbol: "HAI",
		address: "0x136723300aef2aAB4b7cF52c3Eaac6F997e12a68",
		decimals: 8
	},
	{
		symbol: "HAK",
		address: "0x93a7174dafd31d13400cD9fa01f4e5B5BAa00D39",
		decimals: 18
	},
	{
		symbol: "HAKKA",
		address: "0x0E29e5AbbB5FD88e28b2d355774e73BD47dE3bcd",
		decimals: 18
	},
	{
		symbol: "HAND",
		address: "0x48C1B2f3eFA85fbafb2ab951bF4Ba860a08cdBB7",
		decimals: 0
	},
	{
		symbol: "HAPPY",
		address: "0x5A567e28dbFa2bBD3ef13C0a01be114745349657",
		decimals: 2
	},
	{
		symbol: "HARP",
		address: "0x0e536b7831c7A7527FaD55da433986853d21A0c7",
		decimals: 8
	},
	{
		symbol: "HAT",
		address: "0x9002D4485b7594e3E850F0a206713B305113f69e",
		decimals: 12
	},
	{
		symbol: "HATCH",
		address: "0x6F3009663470475F0749A6b76195375f95495fcB",
		decimals: 18
	},
	{
		symbol: "HAUT",
		address: "0x3142daD33B1c6e1371D8627365f2ee2095eb6b37",
		decimals: 18
	},
	{
		symbol: "HAVY",
		address: "0x7C2E5b7ec572199D3841f6a38F7D4868BD0798f1",
		decimals: 8
	},
	{
		symbol: "HB",
		address: "0xE2492F8D2A2618d8709Ca99b1d8d75713Bd84089",
		decimals: 18
	},
	{
		symbol: "HB",
		address: "0x877C7dEb5eB1fc5faAd30C71E3a6E39DC8b1519F",
		decimals: 18
	},
	{
		symbol: "HBC",
		address: "0xFb9553aFa2B5c19c5F8e5b8eE175Fc01abD1555F",
		decimals: 18
	},
	{
		symbol: "HBIT",
		address: "0x8A5aD873A1A615001aCc1757214F67E1Ba145cC9",
		decimals: 18
	},
	{
		symbol: "HBT",
		address: "0xDd6C68bb32462e01705011a4e2Ad1a60740f217F",
		decimals: 15
	},
	{
		symbol: "HBTC",
		address: "0x0316EB71485b0Ab14103307bf65a021042c6d380",
		decimals: 18
	},
	{
		symbol: "HBX",
		address: "0x6fE355c62C6faf6946cE888fFABa9fD12355ae27",
		decimals: 18
	},
	{
		symbol: "HBX",
		address: "0x2793A23341012e0970Cf478bAB08606B56504C3E",
		decimals: 18
	},
	{
		symbol: "HBZ",
		address: "0xE34e1944E776f39B9252790a0527eBDa647aE668",
		decimals: 18
	},
	{
		symbol: "HCA.CX",
		address: "0x3Ea8A7425Eeb8c768489c91941b2aB1720A34515",
		decimals: 8
	},
	{
		symbol: "HCUT",
		address: "0xd31A9D28d66A1f7e62b5565416ea14607690f788",
		decimals: 18
	},
	{
		symbol: "HD",
		address: "0xD4Cdd5e54CcEddA7e9408B31759c9F9CEECbB3eC",
		decimals: 2
	},
	{
		symbol: "HD",
		address: "0x6ce654aC973D326F89f0685E7459542641410eD9",
		decimals: 18
	},
	{
		symbol: "HDAO",
		address: "0x74faaB6986560fD1140508e4266D8a7b87274Ffd",
		decimals: 18
	},
	{
		symbol: "HDCC",
		address: "0x7A6910B15d929F20F85ecbfCBd89862062147D78",
		decimals: 18
	},
	{
		symbol: "HDG",
		address: "0xfFe8196bc259E8dEDc544d935786Aa4709eC3E64",
		decimals: 18
	},
	{
		symbol: "HDI",
		address: "0x58A3520D738B268c2353ECeE518A1AD8e28E4AE5",
		decimals: 2
	},
	{
		symbol: "HDL",
		address: "0x95C4be8534d69C248C0623c4C9a7A2a001c17337",
		decimals: 18
	},
	{
		symbol: "HDLB",
		address: "0xaD6714bd97CBBd29788f8838Bc865ee71b843Eb8",
		decimals: 8
	},
	{
		symbol: "HDLRE",
		address: "0x86a63063b3a60652FB070F23Cbb4A9833FDBBFF8",
		decimals: 18
	},
	{
		symbol: "Hdp.ф",
		address: "0x84543F868eC1b1FAC510d49d13C069f64cD2d5f9",
		decimals: 18
	},
	{
		symbol: "Hdp.ф",
		address: "0xE9fF07809CCff05daE74990e25831d0Bc5cbe575",
		decimals: 18
	},
	{
		symbol: "HDP.Ф",
		address: "0xc4d5545392f5Fc57EBa3AF8981815669bb7E2A48",
		decimals: 4
	},
	{
		symbol: "HDR",
		address: "0x52494FBFFE10F8c29411521040ae8618c334981E",
		decimals: 18
	},
	{
		symbol: "HDS",
		address: "0xcAFE27178308351a12ffFffDeb161d9d730DA082",
		decimals: 18
	},
	{
		symbol: "HDT",
		address: "0xD0Cb75298d5C1E3B277e3CD95c56B3CAa81a99D3",
		decimals: 8
	},
	{
		symbol: "HDW",
		address: "0xcA176a8AC234446b2561293dB7543e0cdadC6627",
		decimals: 4
	},
	{
		symbol: "HE",
		address: "0x398656D0bdb435D1032DECFC2d2D87852262BB19",
		decimals: 5
	},
	{
		symbol: "HEDG",
		address: "0xF1290473E210b2108A85237fbCd7b6eb42Cc654F",
		decimals: 18
	},
	{
		symbol: "HEDGE",
		address: "0x1FA3bc860bF823d792f04F662f3AA3a500a68814",
		decimals: 18
	},
	{
		symbol: "HEDGESHIT",
		address: "0x1d9cd2180Fd4E9771fCA28681034D02390B14e4c",
		decimals: 18
	},
	{
		symbol: "HEGIC",
		address: "0x584bC13c7D411c00c01A62e8019472dE68768430",
		decimals: 18
	},
	{
		symbol: "HELP",
		address: "0xbBc2045D335Cb224228f1850b29173d9d7D7b989",
		decimals: 18
	},
	{
		symbol: "HENA",
		address: "0x8d97C127236D3aEf539171394212F2e43ad701C4",
		decimals: 18
	},
	{
		symbol: "HER",
		address: "0x491C9A23DB85623EEd455a8EfDd6AbA9b911C5dF",
		decimals: 18
	},
	{
		symbol: "HERB",
		address: "0x04A020325024F130988782bd5276e53595e8d16E",
		decimals: 8
	},
	{
		symbol: "HET",
		address: "0xf0998FAeBc12188172310403814E0399f7AF3F73",
		decimals: 18
	},
	{
		symbol: "HETH",
		address: "0x90F08Cc8ddc43f5C01224F67fDf4640995139e8F",
		decimals: 8
	},
	{
		symbol: "HETM",
		address: "0x7A5E6ca9d335e343D1Ed12239F67248E056AFE2f",
		decimals: 6
	},
	{
		symbol: "HEX",
		address: "0x96006F60B452526481a26eab55265ECdf82E7361",
		decimals: 18
	},
	{
		symbol: "HEX",
		address: "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39",
		decimals: 8
	},
	{
		symbol: "HEX",
		address: "0x3be90F3aC213a730d9091BdDa45a2F69AD98892B",
		decimals: 18
	},
	{
		symbol: "HEX2T",
		address: "0xEd1199093b1aBd07a368Dd1C0Cdc77D8517BA2A0",
		decimals: 18
	},
	{
		symbol: "HEY",
		address: "0xe9C9e7E1DaBea830C958C39D6b25964a6F52143A",
		decimals: 18
	},
	{
		symbol: "HEY",
		address: "0xC3884E677E0A3953072a7Fc63e158e98313bF97b",
		decimals: 18
	},
	{
		symbol: "HEZ",
		address: "0xEEF9f339514298C6A857EfCfC1A762aF84438dEE",
		decimals: 18
	},
	{
		symbol: "HG",
		address: "0x1BC9F31c327Ce04b6fA9D56FD84c14Cc0B0A4f47",
		decimals: 18
	},
	{
		symbol: "HGC",
		address: "0x5b5A353Fc217EBEf77bC7686ea05A003eBdb7d1a",
		decimals: 18
	},
	{
		symbol: "HGET",
		address: "0x7968bc6a03017eA2de509AAA816F163Db0f35148",
		decimals: 6
	},
	{
		symbol: "HGH",
		address: "0x40c6f861A08F97dfBC3C0931485bFf4921975a56",
		decimals: 18
	},
	{
		symbol: "HGS",
		address: "0x6Fa63f9B452A97d2Df921378197570f9C04ea286",
		decimals: 18
	},
	{
		symbol: "HGT",
		address: "0xba2184520A1cC49a6159c57e61E1844E085615B6",
		decimals: 8
	},
	{
		symbol: "HI",
		address: "0x66E247De1f61dA1Cc3E2c6E74aC15d1ba741B76f",
		decimals: 18
	},
	{
		symbol: "HIBT",
		address: "0x9bb1Db1445b83213a56d90d331894b3f26218e4e",
		decimals: 18
	},
	{
		symbol: "HIG",
		address: "0xa9240fBCAC1F0b9A6aDfB04a53c8E3B0cC1D1444",
		decimals: 18
	},
	{
		symbol: "HIN",
		address: "0x7FCcaDee21660425FDEc86029b6362845ffC052C",
		decimals: 8
	},
	{
		symbol: "HIPPO",
		address: "0x81313f7c5c9C824236c9E4cba3AC4B049986E756",
		decimals: 18
	},
	{
		symbol: "HIRE",
		address: "0x865e3707a580F9db89304005CddD050Ade8873eB",
		decimals: 18
	},
	{
		symbol: "HIT",
		address: "0x7995ab36bB307Afa6A683C24a25d90Dc1Ea83566",
		decimals: 6
	},
	{
		symbol: "HIZ",
		address: "0xc761D1ccb38a94703675d2cDb15F7F1B3dcFF7B7",
		decimals: 18
	},
	{
		symbol: "HKDT",
		address: "0x508325285114821151a18e148F4299ea09A9Ca05",
		decimals: 18
	},
	{
		symbol: "HKDX",
		address: "0x1Af20b8D1eDe928F437B3A86801796B167840d2b",
		decimals: 18
	},
	{
		symbol: "HKG",
		address: "0x14F37B574242D366558dB61f3335289a5035c506",
		decimals: 3
	},
	{
		symbol: "HKN",
		address: "0x9e6B2B11542f2BC52f3029077acE37E8fD838D7F",
		decimals: 8
	},
	{
		symbol: "HKY",
		address: "0x88aC94D5d175130347Fc95E109d77AC09dbF5ab7",
		decimals: 18
	},
	{
		symbol: "HLAND",
		address: "0xba7b2C094C1A4757f9534a37d296a3BeD7f544DC",
		decimals: 18
	},
	{
		symbol: "HLC",
		address: "0x58c69ed6cd6887c0225D1FcCEcC055127843c69b",
		decimals: 9
	},
	{
		symbol: "HLI",
		address: "0x6baf7FcEA90B0968dc5eD7B8dCB76C986637Ff55",
		decimals: 18
	},
	{
		symbol: "HLOB",
		address: "0x2a4246C318b5eCDC3eaD2D61eA0839bf88f7727B",
		decimals: 8
	},
	{
		symbol: "HLP",
		address: "0x308564DC5217c39386F5eaE96545159e1D396661",
		decimals: 18
	},
	{
		symbol: "HLS",
		address: "0xF5D714D9cd577b7dAF83f84aea37A1Eb0787e7aD",
		decimals: 18
	},
	{
		symbol: "HLT",
		address: "0xA809d363A66c576A2a814CDBfEFC107C600A55f0",
		decimals: 18
	},
	{
		symbol: "HLTC",
		address: "0xCF5a08AF322E52BEe93861341f7bD90eb3d65aa3",
		decimals: 18
	},
	{
		symbol: "HLX",
		address: "0x66eb65D7Ab8e9567ba0fa6E37c305956c5341574",
		decimals: 5
	},
	{
		symbol: "HLX",
		address: "0x8F8e787989BC652eeA01A6C88a19f0f379BDF4FD",
		decimals: 5
	},
	{
		symbol: "HMC",
		address: "0xAa0bb10CEc1fa372eb3Abc17C933FC6ba863DD9E",
		decimals: 18
	},
	{
		symbol: "HMI.CX",
		address: "0xF9eD2f109a39EB0aC54e1Cf5FeE0216a2Ae09183",
		decimals: 8
	},
	{
		symbol: "HMK",
		address: "0xA0a6b8F5f8d41B88A4306C6A9E85028CbEfaD8e1",
		decimals: 18
	},
	{
		symbol: "HMQ",
		address: "0xcbCC0F036ED4788F63FC0fEE32873d6A7487b908",
		decimals: 8
	},
	{
		symbol: "HNB",
		address: "0x9c197c4b58527fAAAb67CB35E3145166B23D242e",
		decimals: 18
	},
	{
		symbol: "HNI",
		address: "0xD6Cb175719365a2ea630f266C53dDfBe4e468e25",
		decimals: 18
	},
	{
		symbol: "HNST",
		address: "0x9C9Fe3bD60b22A9735908B9589011E78F2025C11",
		decimals: 18
	},
	{
		symbol: "HNT",
		address: "0x24FB4C36a83cbDbCd670856406f622E09A643d4d",
		decimals: 5
	},
	{
		symbol: "HNTC",
		address: "0x135093731F61dd5cbfD7744751Bf3cED3aAA69B1",
		decimals: 18
	},
	{
		symbol: "HNY",
		address: "0xc3589F56B6869824804A5EA29F2c9886Af1B0FcE",
		decimals: 18
	},
	{
		symbol: "HODL",
		address: "0xb45d7Bc4cEBcAB98aD09BABDF8C818B2292B672c",
		decimals: 18
	},
	{
		symbol: "HOLD",
		address: "0xD6e1401a079922469e9b965Cb090ea6fF64C6839",
		decimals: 18
	},
	{
		symbol: "HOLE",
		address: "0x03fB52D4eE633ab0D06C833E32EFdd8D388f3E6a",
		decimals: 18
	},
	{
		symbol: "HOLY",
		address: "0x39eAE99E685906fF1C11A962a743440d0a1A6e09",
		decimals: 18
	},
	{
		symbol: "HOMI",
		address: "0xCa208BfD69ae6D2667f1FCbE681BAe12767c0078",
		decimals: 0
	},
	{
		symbol: "HOMT",
		address: "0xeF7A985E4FF9B5DcCD6eDdF58577486887288711",
		decimals: 15
	},
	{
		symbol: "HOPR",
		address: "0xF5581dFeFD8Fb0e4aeC526bE659CFaB1f8c781dA",
		decimals: 18
	},
	{
		symbol: "HOPS",
		address: "0x471dAEE6E481b2ab7d2f2f64B8F9B083daAe29da",
		decimals: 18
	},
	{
		symbol: "HOR",
		address: "0xd9dAC7b72472376b60b6aee9cfa2498ccCdCB2A7",
		decimals: 18
	},
	{
		symbol: "HORD",
		address: "0x43A96962254855F16b925556f9e97BE436A43448",
		decimals: 18
	},
	{
		symbol: "HOROR",
		address: "0x82Ef11f04Bc3cb863373aDdf5558dbc01d8F9b9b",
		decimals: 18
	},
	{
		symbol: "HORSE",
		address: "0x5B0751713b2527d7f002c0c4e2a37e1219610A6B",
		decimals: 18
	},
	{
		symbol: "HOST",
		address: "0x1D2662EFae81ADF192A9f8Cd5286BeD3d3987bbF",
		decimals: 8
	},
	{
		symbol: "HOT",
		address: "0x9AF839687F6C94542ac5ece2e317dAAE355493A1",
		decimals: 18
	},
	{
		symbol: "HOT",
		address: "0x6c6EE5e31d828De241282B9606C8e98Ea48526E2",
		decimals: 18
	},
	{
		symbol: "HOTC",
		address: "0x4D09C5e758CA68bE27240f29fb681E5a5341Ca98",
		decimals: 18
	},
	{
		symbol: "HOUSE",
		address: "0x19810559dF63f19cfE88923313250550eDADB743",
		decimals: 0
	},
	{
		symbol: "HOX",
		address: "0x956eaAaACb521558cD4485115df412aa01f1057E",
		decimals: 18
	},
	{
		symbol: "HP",
		address: "0xab55bDEF7057B76482914e79f037999f4eBb6bF1",
		decimals: 8
	},
	{
		symbol: "HP",
		address: "0x5a4B14aea23A605aBc463f04a6B8Aaf52Dd3e7C6",
		decimals: 18
	},
	{
		symbol: "HPAY",
		address: "0x0854dcbdcd026C0b534B09608ADb3f2bf6baaCd0",
		decimals: 18
	},
	{
		symbol: "HPAY",
		address: "0xF83d7fF2e4B43ebAd2fa534e621E31076f4d254C",
		decimals: 18
	},
	{
		symbol: "HPB",
		address: "0x38c6A68304cdEfb9BEc48BbFaABA5C5B47818bb2",
		decimals: 18
	},
	{
		symbol: "HPC",
		address: "0x1A0c31837EdB132a9312841B9527E6307db13509",
		decimals: 18
	},
	{
		symbol: "HPOT",
		address: "0x8CD024Cc8F73f5CD132005d1584403877B318C9d",
		decimals: 18
	},
	{
		symbol: "HPT",
		address: "0xa66Daa57432024023DB65477BA87D4E7F5f95213",
		decimals: 18
	},
	{
		symbol: "HQT",
		address: "0x3E1d5A855aD9D948373aE68e4fe1f094612b1322",
		decimals: 18
	},
	{
		symbol: "HQX",
		address: "0x1B957Dc4aEfeed3b4A2351a6A6d5cbfbbA0CeCFa",
		decimals: 18
	},
	{
		symbol: "HROI",
		address: "0x8b73f7Ac6B831Dbc7dEd283554d1D39EBbaaD28C",
		decimals: 18
	},
	{
		symbol: "HSC",
		address: "0x2bBA3CF6DE6058cc1B4457Ce00deb359E2703d7F",
		decimals: 18
	},
	{
		symbol: "HSN",
		address: "0x567300e14f8d67e1F6720a95291Dce2511a86723",
		decimals: 18
	},
	{
		symbol: "HST",
		address: "0x554C20B7c486beeE439277b4540A434566dC4C02",
		decimals: 18
	},
	{
		symbol: "HT",
		address: "0x6f259637dcD74C767781E37Bc6133cd6A68aa161",
		decimals: 18
	},
	{
		symbol: "HTB",
		address: "0x6be61833FC4381990e82D7D4a9F4c9B3F67eA941",
		decimals: 18
	},
	{
		symbol: "HTBEAR",
		address: "0x86EB791495bE777db763142a2C547D1112554Fb8",
		decimals: 18
	},
	{
		symbol: "HTBULL",
		address: "0x0D5E2681D2AaDC91F7DA4146740180A2190f0c79",
		decimals: 18
	},
	{
		symbol: "HTDOOM",
		address: "0xEEf85c9D7486748AaE4a26Aa55eeb82a62e631c3",
		decimals: 18
	},
	{
		symbol: "HTH",
		address: "0xA7211022b34A84905dbc54bcF11D9d395ca4155f",
		decimals: 8
	},
	{
		symbol: "HTHEDGE",
		address: "0x3008186FE6e3bCA6D1362105A48ec618672ce5b3",
		decimals: 18
	},
	{
		symbol: "HTL",
		address: "0x6247C86B016Bc4d9aE141849C0a9Eb38C004B742",
		decimals: 18
	},
	{
		symbol: "HTMOON",
		address: "0xb621bB8064A1B2b2d6c2fD4330293F3E7ACbC15f",
		decimals: 18
	},
	{
		symbol: "HTN",
		address: "0x4B4b1d389d4f4E082B30F75c6319c0CE5ACBd619",
		decimals: 18
	},
	{
		symbol: "HTP",
		address: "0x0469B5BE3D08413DE884Bae18AfB886Ee4521c25",
		decimals: 8
	},
	{
		symbol: "HTRE",
		address: "0xDea67845A51E24461D5fED8084E69B426AF3D5Db",
		decimals: 18
	},
	{
		symbol: "HTT",
		address: "0xE2Bdd39a86a711A167967D04f39AC75E3ca14a08",
		decimals: 18
	},
	{
		symbol: "HTX",
		address: "0xeDbcC06B603ea1f512720A4073a62CC4fdefCb86",
		decimals: 0
	},
	{
		symbol: "HTX",
		address: "0x46ae264Bf6d9Dc6Dd84c31064551f961c67a755c",
		decimals: 18
	},
	{
		symbol: "HTX",
		address: "0x38A0df9a08d18dc06CD91Fc7Ec94a0AcdF28D994",
		decimals: 2
	},
	{
		symbol: "HUB",
		address: "0x8e9A29e7Ed21DB7c5B2E1cd75e676dA0236dfB45",
		decimals: 18
	},
	{
		symbol: "HUB",
		address: "0xba358B6f5b4c0215650444B8C30D870B55050D2D",
		decimals: 18
	},
	{
		symbol: "HUBBS",
		address: "0x1E999EE452EaFbCfd6B8f038Bb6cabbB533dC1b9",
		decimals: 8
	},
	{
		symbol: "HUBS",
		address: "0x001Fc4a7f2f586596308091c7B296D4535A25a90",
		decimals: 18
	},
	{
		symbol: "HUDDL",
		address: "0x5137A403Dd25e48DE528912a4aF62881e625D801",
		decimals: 18
	},
	{
		symbol: "HUE",
		address: "0xDcfE18bc46f5A0Cd0d3Af0c2155d2bCB5AdE2fc5",
		decimals: 4
	},
	{
		symbol: "HUG",
		address: "0x1D35C42e9dCB5C5343Fbd70fE73b2284D042d082",
		decimals: 18
	},
	{
		symbol: "HUG",
		address: "0x79D617768C70936F097Cf6E82d1FDCa15dC4417C",
		decimals: 8
	},
	{
		symbol: "HUM",
		address: "0xB0514a5b4Aa58aC6E954f537598dD42a71916581",
		decimals: 18
	},
	{
		symbol: "HUNT",
		address: "0x9AAb071B4129B083B01cB5A0Cb513Ce7ecA26fa5",
		decimals: 18
	},
	{
		symbol: "HUR",
		address: "0xCDB7eCFd3403Eef3882c65B761ef9B5054890a47",
		decimals: 18
	},
	{
		symbol: "HUSD",
		address: "0xdF574c24545E5FfEcb9a659c229253D4111d87e1",
		decimals: 8
	},
	{
		symbol: "HUSL",
		address: "0x56BE94D29e1125D2D61D06629c1b251d72c1b3B3",
		decimals: 18
	},
	{
		symbol: "HUSWP",
		address: "0x33Cf48dEBdcf255B689A7B1d6be5661EC832CC30",
		decimals: 2
	},
	{
		symbol: "HV",
		address: "0x141ABB03F001dEDED9A0223d4ff26d929117B72e",
		decimals: 18
	},
	{
		symbol: "HVN",
		address: "0xC0Eb85285d83217CD7c891702bcbC0FC401E2D9D",
		decimals: 8
	},
	{
		symbol: "HXRO",
		address: "0x4bD70556ae3F8a6eC6C4080A0C327B24325438f3",
		decimals: 18
	},
	{
		symbol: "HXY",
		address: "0xf3A2ace8e48751c965eA0A1D064303AcA53842b9",
		decimals: 8
	},
	{
		symbol: "HXY",
		address: "0x44F00918A540774b422a1A340B75e055fF816d83",
		decimals: 8
	},
	{
		symbol: "HXY",
		address: "0x0FFF95D5ab18c763c42C209F137C47354af104a8",
		decimals: 8
	},
	{
		symbol: "HY",
		address: "0x9b53E429B0baDd98ef7F01F03702986c516a5715",
		decimals: 18
	},
	{
		symbol: "HYBN",
		address: "0x20Bcae16A8bA95d8E8363E265de4eCFc36eC5cd9",
		decimals: 18
	},
	{
		symbol: "HYDRO",
		address: "0xEBBdf302c940c6bfd49C6b165f457fdb324649bc",
		decimals: 18
	},
	{
		symbol: "HYDRO",
		address: "0x946112efaB61C3636CBD52DE2E1392D7A75A6f01",
		decimals: 18
	},
	{
		symbol: "HYN",
		address: "0xE99A894a69d7c2e3C92E61B64C505A6a57d2bC07",
		decimals: 18
	},
	{
		symbol: "HYPX",
		address: "0xd35833f9255FB28cC6b91aCB8A66Ba6429D6Ef5A",
		decimals: 18
	},
	{
		symbol: "HYVE",
		address: "0xd794DD1CAda4cf79C9EebaAb8327a1B0507ef7d4",
		decimals: 18
	},
	{
		symbol: "HZM",
		address: "0xeC1b7eB3D3cfAC7027fa60b5376e5EADeF4F1300",
		decimals: 8
	},
	{
		symbol: "HZT",
		address: "0x78A5B382B9A83Fe042A4F7eB2399d563FDa931C3",
		decimals: 2
	},
	{
		symbol: "IADA",
		address: "0x8A8079c7149B8A1611e5C5d978DCA3bE16545F83",
		decimals: 18
	},
	{
		symbol: "IAG",
		address: "0x96e322f2a4F151cD898F86eA5626cc6E10090c76",
		decimals: 18
	},
	{
		symbol: "IAT",
		address: "0x64944C83481Ed0228E7500c013E4C23aB825bB6D",
		decimals: 18
	},
	{
		symbol: "IBCH",
		address: "0xf6E9b246319ea30e8C2fA2d1540AAEBF6f9E1B89",
		decimals: 18
	},
	{
		symbol: "IBM.CX",
		address: "0x3B7ac088c0D56D1fcb890a510A4a911ce4fe363a",
		decimals: 8
	},
	{
		symbol: "IBNB",
		address: "0xAFD870F32CE54EfdBF677466B612bf8ad164454B",
		decimals: 18
	},
	{
		symbol: "IBP",
		address: "0x7D14b842630cbc2530cB288109E5719e0C4d67d7",
		decimals: 18
	},
	{
		symbol: "IBT",
		address: "0x791425156956E39F2ab8AB06B79DE189C18e95e5",
		decimals: 18
	},
	{
		symbol: "IBTC",
		address: "0xD6014EA05BDe904448B743833dDF07c3C7837481",
		decimals: 18
	},
	{
		symbol: "iBTC",
		address: "0x2B143041a6F8BE9dCC66E9110178a264A223A3bd",
		decimals: 18
	},
	{
		symbol: "IBVOL",
		address: "0x627e2Ee3dbDA546e168eaAFF25A2C5212E4A95a0",
		decimals: 18
	},
	{
		symbol: "ICC",
		address: "0xeDc502b12ced7e16Ce21749E7161F9eD22bfca53",
		decimals: 4
	},
	{
		symbol: "ICD",
		address: "0x3c20d67b6B1aE0985F913aBb7397babc2fBb1A1F",
		decimals: 18
	},
	{
		symbol: "ICEX",
		address: "0x336213e1DDFC69f4701Fc3F86F4ef4A160c1159d",
		decimals: 18
	},
	{
		symbol: "ICH",
		address: "0xf8483E2d6560585C02D46bF7B3186Bf154a96166",
		decimals: 8
	},
	{
		symbol: "ICHI",
		address: "0x903bEF1736CDdf2A537176cf3C64579C3867A881",
		decimals: 9
	},
	{
		symbol: "ICHIEMA",
		address: "0xe86811516F9E46F6F2a8a19754c893deD414D682",
		decimals: 18
	},
	{
		symbol: "ICHX",
		address: "0xa573661b5FB2063d7AB12336ee24589F7A79fdab",
		decimals: 18
	},
	{
		symbol: "ICK",
		address: "0x793e2602A8396468f3CE6E34C1B6C6Fd6D985bAD",
		decimals: 18
	},
	{
		symbol: "ICN",
		address: "0x79BfD2670b6Bb2219D30a6fd0DBF287F2B66633d",
		decimals: 8
	},
	{
		symbol: "ICN",
		address: "0x888666CA69E0f178DED6D75b5726Cee99A87D698",
		decimals: 18
	},
	{
		symbol: "ICNQ",
		address: "0xB3e2Cb7CccfE139f8FF84013823Bf22dA6B6390A",
		decimals: 18
	},
	{
		symbol: "ICOS",
		address: "0x014B50466590340D41307Cc54DCee990c8D58aa8",
		decimals: 6
	},
	{
		symbol: "ICPT.CX",
		address: "0x3d90D2818CD6570e31CCc1DB5e9fbd7289988173",
		decimals: 8
	},
	{
		symbol: "ICSS",
		address: "0xCBE3F73C65d13402cbbc2f9db8b6999D5c52982A",
		decimals: 4
	},
	{
		symbol: "ICST",
		address: "0xe6bC60a00B81C7F3cBc8F4Ef3B0A6805b6851753",
		decimals: 18
	},
	{
		symbol: "ICT",
		address: "0x2d71983E810B9e95258966B9c164C4d61a829bA9",
		decimals: 6
	},
	{
		symbol: "ICX",
		address: "0xb5A5F22694352C15B00323844aD545ABb2B11028",
		decimals: 18
	},
	{
		symbol: "ICY",
		address: "0x8903E8f101D86Ea097eFe104A3D53f4C42cb44bc",
		decimals: 18
	},
	{
		symbol: "ID",
		address: "0xEBd9D99A3982d547C5Bb4DB7E3b1F9F14b67Eb83",
		decimals: 18
	},
	{
		symbol: "ID7",
		address: "0x6bC4375083D3aD563dE91caD8438F629841448a5",
		decimals: 18
	},
	{
		symbol: "IDAI",
		address: "0x14094949152EDDBFcd073717200DA82fEd8dC960",
		decimals: 18
	},
	{
		symbol: "iDAI",
		address: "0x493C57C4763932315A328269E1ADaD09653B9081",
		decimals: 18
	},
	{
		symbol: "IDASH",
		address: "0xCB98f42221b2C251A4E74A1609722eE09f0cc08E",
		decimals: 18
	},
	{
		symbol: "IDCE",
		address: "0x5a84969bb663fb64F6d015DcF9F622Aedc796750",
		decimals: 18
	},
	{
		symbol: "IDD",
		address: "0x145b4467b2fa0Faf4296F165bca214691a5E08D6",
		decimals: 8
	},
	{
		symbol: "IDEA",
		address: "0x814CAfd4782d2e728170FDA68257983F03321c58",
		decimals: 0
	},
	{
		symbol: "IDEFI",
		address: "0x14d10003807AC60d07BB0ba82cAeaC8d2087c157",
		decimals: 18
	},
	{
		symbol: "IDEX",
		address: "0xB705268213D593B8FD88d3FDEFF93AFF5CbDcfAE",
		decimals: 18
	},
	{
		symbol: "IDH",
		address: "0x5136C98A80811C3f46bDda8B5c4555CFd9f812F0",
		decimals: 6
	},
	{
		symbol: "IDL",
		address: "0x6febD6Be8fa45bE6a5EeB61A17c82D33b9addD41",
		decimals: 18
	},
	{
		symbol: "IDLE",
		address: "0x875773784Af8135eA0ef43b5a374AaD105c5D39e",
		decimals: 18
	},
	{
		symbol: "idleDAISafe",
		address: "0x1846bdfDB6A0f5c473dEc610144513bd071999fB",
		decimals: 18
	},
	{
		symbol: "idleDAIYield",
		address: "0x78751B12Da02728F467A44eAc40F5cbc16Bd7934",
		decimals: 18
	},
	{
		symbol: "idleSUSDYield",
		address: "0xE79E177d2a5c7085027d7C64c8F271c81430fc9b",
		decimals: 18
	},
	{
		symbol: "idleTUSDYield",
		address: "0x51C77689A9c2e8cCBEcD4eC9770a1fA5fA83EeF1",
		decimals: 18
	},
	{
		symbol: "idleUSDCSafe",
		address: "0xcDdB1Bceb7a1979C6caa0229820707429dd3Ec6C",
		decimals: 18
	},
	{
		symbol: "idleUSDCYield",
		address: "0x12B98C621E8754Ae70d0fDbBC73D6208bC3e3cA6",
		decimals: 18
	},
	{
		symbol: "idleUSDTSafe",
		address: "0x42740698959761BAF1B06baa51EfBD88CB1D862B",
		decimals: 18
	},
	{
		symbol: "idleUSDTYield",
		address: "0x63D27B3DA94A9E871222CB0A32232674B02D2f2D",
		decimals: 18
	},
	{
		symbol: "idleWBTCYield",
		address: "0xD6f279B7ccBCD70F8be439d25B9Df93AEb60eC55",
		decimals: 18
	},
	{
		symbol: "IDLV",
		address: "0xDf2237d32ab6945657A6E56F6e4568D19DACe492",
		decimals: 18
	},
	{
		symbol: "IDOL",
		address: "0x2Cc114bbE7b551d62B15C465c7bdCccd9125b182",
		decimals: 8
	},
	{
		symbol: "IDON",
		address: "0x12c5E73Ddb44cD70225669B9F6f0d9DE5455Bc31",
		decimals: 18
	},
	{
		symbol: "IDRT",
		address: "0x998FFE1E43fAcffb941dc337dD0468d52bA5b48A",
		decimals: 2
	},
	{
		symbol: "IDX",
		address: "0x8427760A577F7F2F91a7bA7a3c7826C92A950727",
		decimals: 8
	},
	{
		symbol: "IDXM",
		address: "0xCc13Fc627EFfd6E35D2D2706Ea3C4D7396c610ea",
		decimals: 8
	},
	{
		symbol: "IDXT",
		address: "0x18a4979bbB4c88275d4575d66B9c9CD6BeA0cD5E",
		decimals: 18
	},
	{
		symbol: "IECT",
		address: "0x607415Cb26756d5D0E6aE56Adc06FBe29Edf79D9",
		decimals: 8
	},
	{
		symbol: "IEI",
		address: "0xB0A66227b50810df87CE4b152920d22A716b9b1D",
		decimals: 18
	},
	{
		symbol: "IEOS",
		address: "0x395f7bC771DB53732025547458f96Ee217aF6aD1",
		decimals: 18
	},
	{
		symbol: "IEOS",
		address: "0xF4EebDD0704021eF2a6Bbe993fdf93030Cd784b4",
		decimals: 18
	},
	{
		symbol: "IETC",
		address: "0xd50c1746D835d2770dDA3703B69187bFfeB14126",
		decimals: 18
	},
	{
		symbol: "IETH",
		address: "0xA9859874e1743A32409f75bB11549892138BBA1E",
		decimals: 18
	},
	{
		symbol: "iETH",
		address: "0x9Dde7cdd09dbed542fC422d18d89A589fA9fD4C0",
		decimals: 18
	},
	{
		symbol: "iETH",
		address: "0x859a9C0b44cb7066D956a958B0b82e54C9e44b4B",
		decimals: 8
	},
	{
		symbol: "iETH",
		address: "0x77f973FCaF871459aa58cd81881Ce453759281bC",
		decimals: 18
	},
	{
		symbol: "iETH",
		address: "0xD4fb1706Ae549FEBeC06bb7175b08010DD1B0C2e",
		decimals: 18
	},
	{
		symbol: "IETH20SMACO",
		address: "0x5cD487CE4dB7091292F2E914F7B31445Bd4A5E1b",
		decimals: 18
	},
	{
		symbol: "IETH50SMACO",
		address: "0xAC1565e473F69FAdA09661A6B4103FBbF801CeEE",
		decimals: 18
	},
	{
		symbol: "IFOOD",
		address: "0x81E74a3eA4BaB2277aA3b941E9D9F37B08Ac5374",
		decimals: 18
	},
	{
		symbol: "IFT",
		address: "0x7654915A1b82D6D2D0AFc37c52Af556eA8983c7E",
		decimals: 18
	},
	{
		symbol: "IFTC",
		address: "0xAAB29eCC3783aCB436A6679919F22D30932E93F2",
		decimals: 18
	},
	{
		symbol: "IFX.CX",
		address: "0x4bdAb8164D77608294335bE695E01aB3d77De3Ab",
		decimals: 8
	},
	{
		symbol: "IFX24",
		address: "0xc962ad021a69D457564e985738C719aE3f79B707",
		decimals: 18
	},
	{
		symbol: "IG",
		address: "0x8a88f04e0c905054D2F33b26BB3A46D7091A039A",
		decimals: 18
	},
	{
		symbol: "IGF",
		address: "0xA261e1facd9e90233dC08f785c2B1Fb1691024bA",
		decimals: 8
	},
	{
		symbol: "IGI",
		address: "0x449c640B6C7fce4f8aD2e3Dcd900D13be40174Af",
		decimals: 18
	},
	{
		symbol: "IHF",
		address: "0xaF1250fa68D7DECD34fD75dE8742Bc03B29BD58e",
		decimals: 18
	},
	{
		symbol: "IHT",
		address: "0xEda8B016efA8b1161208Cf041cD86972eeE0F31E",
		decimals: 18
	},
	{
		symbol: "IIC",
		address: "0x16662F73dF3e79e54c6c5938b4313f92C524C120",
		decimals: 18
	},
	{
		symbol: "IIC",
		address: "0xb6F43025B29196Af2dddd69b0a58AFBa079cD600",
		decimals: 18
	},
	{
		symbol: "IIOTT",
		address: "0x485715b5E3114E254069ca9e72701CC9239fA4CC",
		decimals: 8
	},
	{
		symbol: "IKB",
		address: "0x88AE96845e157558ef59e9Ff90E766E22E480390",
		decimals: 0
	},
	{
		symbol: "ILINK",
		address: "0x2d7aC061fc3db53c39fe1607fB8cec1B2C162B01",
		decimals: 18
	},
	{
		symbol: "ILK",
		address: "0xF784682C82526e245F50975190EF0fff4E4fC077",
		decimals: 8
	},
	{
		symbol: "ILTC",
		address: "0x79da1431150C9b82D2E5dfc1C68B33216846851e",
		decimals: 18
	},
	{
		symbol: "ILV",
		address: "0x767FE9EDC9E0dF98E07454847909b5E959D7ca0E",
		decimals: 18
	},
	{
		symbol: "IMBTC",
		address: "0x3212b29E33587A00FB1C83346f5dBFA69A458923",
		decimals: 8
	},
	{
		symbol: "imBTC",
		address: "0x17d8CBB6Bce8cEE970a4027d1198F6700A7a6c24",
		decimals: 18
	},
	{
		symbol: "IMC",
		address: "0xe3831c5A982B279A198456D577cfb90424cb6340",
		decimals: 6
	},
	{
		symbol: "IMG",
		address: "0xd1F579cc0a5405D7610346b371371bEd1528D18b",
		decimals: 18
	},
	{
		symbol: "IMP",
		address: "0x48FF53777F747cFB694101222a944dE070c15D36",
		decimals: 7
	},
	{
		symbol: "IMT",
		address: "0x22E5F62D0FA19974749faa194e3d3eF6d89c08d7",
		decimals: 0
	},
	{
		symbol: "IMT",
		address: "0x13119E34E140097a507B07a5564bDe1bC375D9e6",
		decimals: 18
	},
	{
		symbol: "IMT",
		address: "0xBfE03707aDb75b478Add9A01978057803F480E44",
		decimals: 8
	},
	{
		symbol: "imUSD",
		address: "0x30647a72Dc82d7Fbb1123EA74716aB8A317Eac19",
		decimals: 18
	},
	{
		symbol: "IMVR",
		address: "0x7878424E994D8a2B8E329D31096922B7CeAbe660",
		decimals: 18
	},
	{
		symbol: "INA",
		address: "0x33d8e28949Eb784556064ED095A18C0E66219860",
		decimals: 18
	},
	{
		symbol: "INB",
		address: "0x17Aa18A4B64A55aBEd7FA543F2Ba4E91f2dcE482",
		decimals: 18
	},
	{
		symbol: "INBOX",
		address: "0xb688A7B1472e2427c338b975D77E12389eCF2558",
		decimals: 8
	},
	{
		symbol: "INC",
		address: "0x4BFFC9B4d4DcF730820a2EdCAD48Ff5D7E0Ae807",
		decimals: 18
	},
	{
		symbol: "IND",
		address: "0xf8e386EDa857484f5a12e4B5DAa9984E06E73705",
		decimals: 18
	},
	{
		symbol: "INDEX",
		address: "0x0954906da0Bf32d5479e25f46056d22f08464cab",
		decimals: 18
	},
	{
		symbol: "INDI",
		address: "0xE8c09672cfb9cFcE6E2edBB01057d9fa569F97c1",
		decimals: 18
	},
	{
		symbol: "INE",
		address: "0x86e6A4F512b1290c043970B04E0b570D4FC98291",
		decimals: 18
	},
	{
		symbol: "INEX",
		address: "0xa2D77f8353cB2AFD709Aba4a967257511ECFf716",
		decimals: 8
	},
	{
		symbol: "INEX",
		address: "0xDAC2bd8fbAae386EB50f084b82a04815Dd8b0A60",
		decimals: 8
	},
	{
		symbol: "INF",
		address: "0x4C6584dDCdFaB7110c7b1bE47749Bde8edc9c0c9",
		decimals: 18
	},
	{
		symbol: "INF",
		address: "0x00E150D741Eda1d49d341189CAE4c08a73a49C95",
		decimals: 18
	},
	{
		symbol: "INFI",
		address: "0x159751323A9E0415DD3d6D42a1212fe9F4a0848C",
		decimals: 18
	},
	{
		symbol: "INFS",
		address: "0x193408cA0576B73156Ed42A2EA7D6fD3f6507162",
		decimals: 1
	},
	{
		symbol: "INFT",
		address: "0x83d60E7aED59c6829fb251229061a55F35432c4d",
		decimals: 6
	},
	{
		symbol: "ING",
		address: "0x24dDFf6D8B8a42d835af3b440De91f3386554Aa4",
		decimals: 18
	},
	{
		symbol: "INJ",
		address: "0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30",
		decimals: 18
	},
	{
		symbol: "INNBC",
		address: "0xB67718b98d52318240c52E71A898335da4A28c42",
		decimals: 6
	},
	{
		symbol: "INNBCL",
		address: "0x0Cc9FCCFF81252F4bd8C5c6b359B14ae2Ed851cf",
		decimals: 6
	},
	{
		symbol: "INRM",
		address: "0x48e5413b73add2434e47504E2a22d14940dBFe78",
		decimals: 3
	},
	{
		symbol: "INS",
		address: "0x5B2e4a700dfBc560061e957edec8F6EeEb74a320",
		decimals: 10
	},
	{
		symbol: "INSTAR",
		address: "0xc72fe8e3Dd5BeF0F9f31f259399F301272eF2a2D",
		decimals: 18
	},
	{
		symbol: "INSUR",
		address: "0x51fB3dA8A67861361281AC56Fe2Ad8c3b4539FFa",
		decimals: 18
	},
	{
		symbol: "INSUR",
		address: "0x544c42fBB96B39B21DF61cf322b5EDC285EE7429",
		decimals: 18
	},
	{
		symbol: "INT",
		address: "0xeDE7518b8f90cbca48b551e5658b20513937d622",
		decimals: 8
	},
	{
		symbol: "INT",
		address: "0x0b76544F6C413a555F309Bf76260d1E02377c02A",
		decimals: 6
	},
	{
		symbol: "INTBTC",
		address: "0xB32c960c46f28059C2B5F1C3eCC2b9DD77aB0aA0",
		decimals: 18
	},
	{
		symbol: "INTC.CX",
		address: "0x1245712fb154F7233E496e21eDb61F89c63E7878",
		decimals: 8
	},
	{
		symbol: "INTRATIO",
		address: "0xBA8Ea15b647F54D9ff849670FcaAcF35Df21A457",
		decimals: 18
	},
	{
		symbol: "INTX",
		address: "0x7533D63A2558965472398Ef473908e1320520AE2",
		decimals: 9
	},
	{
		symbol: "INV",
		address: "0x41D5D79431A913C4aE7d69a668ecdfE5fF9DFB68",
		decimals: 18
	},
	{
		symbol: "INV",
		address: "0xEcE83617Db208Ad255Ad4f45Daf81E25137535bb",
		decimals: 8
	},
	{
		symbol: "INVE",
		address: "0xDAC4AE188AcE3C8985765eDc6C9B4739D4845DdC",
		decimals: 18
	},
	{
		symbol: "INVOX",
		address: "0x4485561Db76614Ff727f8E0a3Ea95690b8b16022",
		decimals: 18
	},
	{
		symbol: "INX",
		address: "0x84fE25f3921f3426395c883707950d0c00367576",
		decimals: 18
	},
	{
		symbol: "INX",
		address: "0x018d7D179350f1Bb9853D04982820E37ccE13a92",
		decimals: 8
	},
	{
		symbol: "INXT",
		address: "0xa8006C4ca56F24d6836727D106349320dB7fEF82",
		decimals: 8
	},
	{
		symbol: "IOG",
		address: "0x1c4b7d0e1885bd7667Af3378E0c538F74E712006",
		decimals: 18
	},
	{
		symbol: "IONC",
		address: "0xbC647aAd10114B89564c0a7aabE542bd0cf2C5aF",
		decimals: 18
	},
	{
		symbol: "IOOX",
		address: "0xf6923F7d96fc22c4b8010a865e41cF7edfB6379C",
		decimals: 8
	},
	{
		symbol: "IOST",
		address: "0xFA1a856Cfa3409CFa145Fa4e20Eb270dF3EB21ab",
		decimals: 18
	},
	{
		symbol: "IOT",
		address: "0x6cb262679C522c4f0834041A6248e8feB35F0337",
		decimals: 18
	},
	{
		symbol: "IoT",
		address: "0xC34B21f6F8e51cC965c2393B3ccFa3b82BEb2403",
		decimals: 6
	},
	{
		symbol: "IOTE",
		address: "0xAd7195E2f5E4F104cC2Ed31Cb719EfD95b9Eb490",
		decimals: 18
	},
	{
		symbol: "IOTU",
		address: "0xB49c61B2da035BF198815A0d43F108530a834cCe",
		decimals: 18
	},
	{
		symbol: "IOTX",
		address: "0x6fB3e0A217407EFFf7Ca062D46c26E5d60a14d69",
		decimals: 18
	},
	{
		symbol: "IOV",
		address: "0x0E69D0A2bbB30aBcB7e5CfEA0E4FDe19C00A8d47",
		decimals: 8
	},
	{
		symbol: "IOWN",
		address: "0x555D051538C7a13712F1f590fA6b4C176Ca4529f",
		decimals: 18
	},
	{
		symbol: "IP.CX",
		address: "0xFb2C4F8a6E30C3B8C97bc61050cAfDe5eeEbb500",
		decimals: 8
	},
	{
		symbol: "IPC",
		address: "0x622CD54dEb2bB7A051515192417109bcF3fe098f",
		decimals: 8
	},
	{
		symbol: "IPGO",
		address: "0xCcADe040b89d7865977c0f9Cf09bDB897B8F8D40",
		decimals: 4
	},
	{
		symbol: "IPL",
		address: "0x64CdF819d3E75Ac8eC217B3496d7cE167Be42e80",
		decimals: 18
	},
	{
		symbol: "IPM",
		address: "0x8fEEf860E9fA9326ff9d7E0058F637bE8579Cc29",
		decimals: 18
	},
	{
		symbol: "IPN.CX",
		address: "0xA86EcAb27C0F92F4393A6bCb03B01407b87b0892",
		decimals: 8
	},
	{
		symbol: "IPSX",
		address: "0x001F0aA5dA15585e5b2305DbaB2bac425ea71007",
		decimals: 18
	},
	{
		symbol: "IPUX",
		address: "0x5F236F062f16A9B19819c535127398dF9a01D762",
		decimals: 18
	},
	{
		symbol: "IPWT",
		address: "0xA02d0b6bfcE1dBd02b9cBB70e6b480333E8A86eC",
		decimals: 18
	},
	{
		symbol: "IPY",
		address: "0x2cfd4c10c075Fa51649744245EC1D0aA3d567e23",
		decimals: 8
	},
	{
		symbol: "IQF",
		address: "0x15223C63A203731db1a2eBfE5277a55F77a453b9",
		decimals: 8
	},
	{
		symbol: "IQN",
		address: "0x0DB8D8b76BC361bAcbB72E2C491E06085A97Ab31",
		decimals: 18
	},
	{
		symbol: "IRBT.CX",
		address: "0xFD3E213Eb8d3D01Ff737010eb2aD18a205a1b5AD",
		decimals: 8
	},
	{
		symbol: "IRC",
		address: "0x1F21d8395655fb262251897df7CB3c9358BEc6a2",
		decimals: 8
	},
	{
		symbol: "ISDT",
		address: "0xf2354F740f31704820f6FcfBA70B9dA065459b62",
		decimals: 18
	},
	{
		symbol: "ISIKC",
		address: "0x42726d074BBa68Ccc15200442B72Afa2D495A783",
		decimals: 4
	},
	{
		symbol: "ISL",
		address: "0x1969442391737025812C2215E77E676d7fA84847",
		decimals: 18
	},
	{
		symbol: "ISLA",
		address: "0x697eF32B4a3F5a4C39dE1cB7563f24CA7BfC5947",
		decimals: 18
	},
	{
		symbol: "ISP",
		address: "0xC8807f0f5BA3fa45FfBdc66928d71c5289249014",
		decimals: 18
	},
	{
		symbol: "ISP",
		address: "0x3db1678170418D1014012f855E2DdA492f35C289",
		decimals: 18
	},
	{
		symbol: "ISR",
		address: "0xB16d3Ed603D62b125c6bd45519EDa40829549489",
		decimals: 18
	},
	{
		symbol: "ISRG.CX",
		address: "0xc8209c0DD9577ab10c2bdbd96b02EAb114af80E0",
		decimals: 8
	},
	{
		symbol: "IST",
		address: "0x7a4d70528c0B8d376C206b0Fb2c9dB1d26315c2d",
		decimals: 18
	},
	{
		symbol: "IST",
		address: "0x44A41d8feC3877297edC40122f3DE783861cd9af",
		decimals: 8
	},
	{
		symbol: "IST34",
		address: "0x55675E0d2551a34c2E3C68FA83B5108527957fDd",
		decimals: 18
	},
	{
		symbol: "IST34",
		address: "0x0cF713b11C9b986EC40D65bD4F7fbd50F6ff2d64",
		decimals: 18
	},
	{
		symbol: "IT40.CX",
		address: "0xa23C150bD61Fef5e4ED2dC480461c0eA2E6Dd977",
		decimals: 8
	},
	{
		symbol: "ITC",
		address: "0x5E6b6d9aBAd9093fdc861Ea1600eBa1b355Cd940",
		decimals: 18
	},
	{
		symbol: "ITL",
		address: "0x122A86b5DFF2D085AfB49600b4cd7375D0d94A5f",
		decimals: 8
	},
	{
		symbol: "ITO",
		address: "0x293B0Cd0991DB07c8529fEBb01bc7D052315C5Ab",
		decimals: 18
	},
	{
		symbol: "ITR",
		address: "0x6Ef5febbD2A56FAb23f18a69d3fB9F4E2A70440B",
		decimals: 18
	},
	{
		symbol: "iTRX",
		address: "0xC5807183a9661A533CB08CbC297594a0B864dc12",
		decimals: 18
	},
	{
		symbol: "ITRX",
		address: "0xCd8D927f2CB03d2eFB7f96CeB66Ec4976843E012",
		decimals: 18
	},
	{
		symbol: "ITS",
		address: "0xC32cC5b70BEe4bd54Aa62B9Aefb91346d18821C4",
		decimals: 18
	},
	{
		symbol: "ITT",
		address: "0x0aeF06DcCCC531e581f0440059E6FfCC206039EE",
		decimals: 8
	},
	{
		symbol: "IUT",
		address: "0xD36a0e7b741542208aE0fBb35453C893D0136625",
		decimals: 0
	},
	{
		symbol: "IVI",
		address: "0xA91464AbD4625A23aB719e3F0FCE84DaDd54E546",
		decimals: 18
	},
	{
		symbol: "IVY",
		address: "0x829067D40A8D1233927891D9b3381d6aeCeE1E80",
		decimals: 18
	},
	{
		symbol: "IVY",
		address: "0xA4eA687A2A7F29cF2dc66B39c68e4411C0D00C49",
		decimals: 18
	},
	{
		symbol: "IXE",
		address: "0x7A07E1a0c2514D51132183EcfeA2A880Ec3b7648",
		decimals: 18
	},
	{
		symbol: "IXMR",
		address: "0x4AdF728E2Df4945082cDD6053869f51278fae196",
		decimals: 18
	},
	{
		symbol: "IXRP",
		address: "0x27269b3e45A4D3E79A3D6BFeE0C8fB13d0D711A6",
		decimals: 18
	},
	{
		symbol: "IXT",
		address: "0xfcA47962D45ADFdfd1Ab2D972315dB4ce7CCf094",
		decimals: 8
	},
	{
		symbol: "IXTZ",
		address: "0xc2992b2C22238F296c2f429ee2f7AfB462Ed1750",
		decimals: 18
	},
	{
		symbol: "iXTZ",
		address: "0x8deef89058090ac5655A99EEB451a4f9183D1678",
		decimals: 18
	},
	{
		symbol: "IYF",
		address: "0x5D762F76b9E91F71cc4F94391BDFe6333dB8519c",
		decimals: 18
	},
	{
		symbol: "IZA",
		address: "0x52956CD6f9d5D8a0FFdCe1E9b68ef72Cd9D64655",
		decimals: 18
	},
	{
		symbol: "IZB",
		address: "0x11E0b97730A67E6dfb8A917Ce9a464Bf6Fb1ABE0",
		decimals: 8
	},
	{
		symbol: "IZE",
		address: "0x6944d3e38973C4831dA24E954fbD790c7E688bDd",
		decimals: 18
	},
	{
		symbol: "IZE",
		address: "0xcF8048b2D336c569a3985bD93CbB91B758ded178",
		decimals: 18
	},
	{
		symbol: "IZER",
		address: "0xab5c04BBE42667610a2Da07aC98ea9FA6e4a9514",
		decimals: 8
	},
	{
		symbol: "IZX",
		address: "0x2Ad180cBAFFbc97237F572148Fc1B283b68D8861",
		decimals: 18
	},
	{
		symbol: "J8T",
		address: "0x0D262e5dC4A06a0F1c90cE79C7a60C09DfC884E4",
		decimals: 8
	},
	{
		symbol: "JAAG",
		address: "0xE3C51FC064053ebc5a802e6f1d2897bf457c244f",
		decimals: 18
	},
	{
		symbol: "JAC",
		address: "0x642F4bE6DA9d9Daa9076F8D161B15A166e966069",
		decimals: 8
	},
	{
		symbol: "JADE",
		address: "0x5ABaFf0B83F81DC061C590AAdcbA013C69237fd7",
		decimals: 18
	},
	{
		symbol: "JADE",
		address: "0x70508920986C120bC534f40450390bb1578B2637",
		decimals: 18
	},
	{
		symbol: "JAMM",
		address: "0x56687cf29Ac9751Ce2a4E764680B6aD7E668942e",
		decimals: 4
	},
	{
		symbol: "JAN",
		address: "0xAf80e6612D9C2E883122e7F2292Ee6C34176ad4F",
		decimals: 18
	},
	{
		symbol: "JASMY",
		address: "0x7420B4b9a0110cdC71fB720908340C03F9Bc03EC",
		decimals: 18
	},
	{
		symbol: "JBC",
		address: "0x14AA9c36D76901Fe1EBcc860038aee9318596103",
		decimals: 8
	},
	{
		symbol: "JBD",
		address: "0x9A3619499825fbAe63329Aa8bCb3f10CD5958E1c",
		decimals: 10
	},
	{
		symbol: "JBL.CX",
		address: "0xCA40FD7471a441A196b9e5D031baF0A8F391313b",
		decimals: 8
	},
	{
		symbol: "JBT",
		address: "0xaA3A522d9E25070D30961bAeaE0112498F90e295",
		decimals: 18
	},
	{
		symbol: "JBX",
		address: "0x884e3902C4d5cFA86de4aCE7A96AA91EbC25C0Ff",
		decimals: 18
	},
	{
		symbol: "JC",
		address: "0xE2D82Dc7dA0E6f882E96846451F4faBcc8f90528",
		decimals: 18
	},
	{
		symbol: "JCC",
		address: "0xeA7aA1eDd21735A5ab05EE3E90869016191e274E",
		decimals: 18
	},
	{
		symbol: "JCP",
		address: "0x02F7D805f895c8Ea3d14f11ba4Df3352580cc506",
		decimals: 8
	},
	{
		symbol: "JCT",
		address: "0x9288d6b823927f528AEa244C5fa71a356b807112",
		decimals: 8
	},
	{
		symbol: "JET",
		address: "0x773450335eD4ec3DB45aF74f34F2c85348645D39",
		decimals: 18
	},
	{
		symbol: "JET",
		address: "0x8727c112C712c4a03371AC87a74dD6aB104Af768",
		decimals: 18
	},
	{
		symbol: "JEX",
		address: "0xfF98a08c143311719cA492e4B8C950C940f26872",
		decimals: 4
	},
	{
		symbol: "JIAOZI",
		address: "0x94939D55000B31B7808904a80aA7Bab05eF59Ed6",
		decimals: 18
	},
	{
		symbol: "JKS.CX",
		address: "0x369C8Ff27DA9Fb53C6d971385d2F602c45FF79C2",
		decimals: 8
	},
	{
		symbol: "JLT",
		address: "0xB6957bf56805FaeD7f1bAe30EAEbE918B8baFF71",
		decimals: 18
	},
	{
		symbol: "JNJ.CX",
		address: "0x5C583018358339AdBfCC46410C346d52606bf70D",
		decimals: 8
	},
	{
		symbol: "JNT",
		address: "0xa5Fd1A791C4dfcaacC963D4F73c6Ae5824149eA7",
		decimals: 18
	},
	{
		symbol: "JOB",
		address: "0xdfbc9050F5B01DF53512DCC39B4f2B2BBaCD517A",
		decimals: 8
	},
	{
		symbol: "JOINT",
		address: "0x347C099f110Ca6761779329D2879957b606b6aCE",
		decimals: 18
	},
	{
		symbol: "JOON",
		address: "0x174897edD3ce414084A009d22db31C7b7826400d",
		decimals: 4
	},
	{
		symbol: "JOT",
		address: "0xdb455c71C1bC2de4e80cA451184041Ef32054001",
		decimals: 18
	},
	{
		symbol: "JOY",
		address: "0xDDe12a12A6f67156e0DA672be05c374e1B0a3e57",
		decimals: 6
	},
	{
		symbol: "JPM.CX",
		address: "0x339989c3d77a57d1ABf1209af3Ce8bB6Cac53875",
		decimals: 8
	},
	{
		symbol: "JPX",
		address: "0xcd56fC21564FBA45c17D0BF663CCED37f5E22d7e",
		decimals: 4
	},
	{
		symbol: "JPYQ",
		address: "0x558A069a3A1a1e72398607b9E3577fCe1C67EA63",
		decimals: 18
	},
	{
		symbol: "JPYX",
		address: "0x743c79F88dCadC6E7cFd7FA2bd8e2bFC68DaE053",
		decimals: 18
	},
	{
		symbol: "JRT",
		address: "0x8A9C67fee641579dEbA04928c4BC45F66e26343A",
		decimals: 18
	},
	{
		symbol: "JS",
		address: "0x5046E860ff274fb8c66106B0Ffb8155849fB0787",
		decimals: 8
	},
	{
		symbol: "JSE",
		address: "0x2d184014b5658C453443AA87c8e9C4D57285620b",
		decimals: 18
	},
	{
		symbol: "JUI",
		address: "0x2CaE31D2Ca104a951654456f46168Bc9F88FDc65",
		decimals: 18
	},
	{
		symbol: "JUICE",
		address: "0x889eFB523cc39590B8483EB9491890AC71407f64",
		decimals: 18
	},
	{
		symbol: "JUL",
		address: "0x5580ab97F226C324c671746a1787524AEF42E415",
		decimals: 18
	},
	{
		symbol: "JULIEN",
		address: "0xe6710e0CdA178f3D921f456902707B0d4C4A332B",
		decimals: 4
	},
	{
		symbol: "JUP",
		address: "0x4B1E80cAC91e2216EEb63e29B957eB91Ae9C2Be8",
		decimals: 18
	},
	{
		symbol: "JURM",
		address: "0x34Dd5EDfED51c632d1d4d2502bC901EfB5fdfCD4",
		decimals: 18
	},
	{
		symbol: "JUS",
		address: "0x14cA41Eecd7D81D5D13098586C0d2314EBa285bE",
		decimals: 18
	},
	{
		symbol: "JWL",
		address: "0x8275eBF521Dc217aa79C88132017A5BCEf001dd9",
		decimals: 18
	},
	{
		symbol: "JWN.CX",
		address: "0x7206926Ae9482DbdAD19E112B1f2dd4F88dd7772",
		decimals: 8
	},
	{
		symbol: "K.CX",
		address: "0x9eFc8dF9CCc40017e800381cD9fD457DbEbED995",
		decimals: 8
	},
	{
		symbol: "K21",
		address: "0xB9d99C33eA2d86EC5eC6b8A4dD816EBBA64404AF",
		decimals: 18
	},
	{
		symbol: "KAASO",
		address: "0xF6Bf74a97d78f2242376769EF1E79885Cf1F0C1c",
		decimals: 18
	},
	{
		symbol: "KAI",
		address: "0xBD6467a31899590474cE1e84F70594c53D628e46",
		decimals: 18
	},
	{
		symbol: "KAI",
		address: "0xD9Ec3ff1f8be459Bb9369b4E79e9Ebcf7141C093",
		decimals: 18
	},
	{
		symbol: "KAIJU",
		address: "0x58a5d3e4873A75B07fB3c7CF477EeBc44ea73B3B",
		decimals: 4
	},
	{
		symbol: "KAKI",
		address: "0xD668E107aAb776E35061D208BB083918AaeDE9B5",
		decimals: 18
	},
	{
		symbol: "KAM",
		address: "0xBdBB0Ee6144544eC814d417B0ad41f16fC8B858E",
		decimals: 8
	},
	{
		symbol: "KAM",
		address: "0xF8D9fd49d0519a7B93F3Ce80c2C070f1294EAD26",
		decimals: 18
	},
	{
		symbol: "KAN",
		address: "0x1410434b0346f5bE678d0FB554E5c7ab620f8f4a",
		decimals: 18
	},
	{
		symbol: "KAPA",
		address: "0xe15254a13D34F9700320330abcb7c7F857aF2Fb7",
		decimals: 2
	},
	{
		symbol: "KAPP",
		address: "0xF39f19565B8D937EC30f1db5BD42F558D1E312A6",
		decimals: 18
	},
	{
		symbol: "KARMA",
		address: "0xdfe691F37b6264a90Ff507EB359C45d55037951C",
		decimals: 4
	},
	{
		symbol: "KASH",
		address: "0x2c50ba1ED5e4574C1b613b044Bd1876f0B0B87a9",
		decimals: 18
	},
	{
		symbol: "KASSIAHOME",
		address: "0x4CC84b41ECECC387244512242Eec226Eb7948A92",
		decimals: 18
	},
	{
		symbol: "KASSIAHOTEL",
		address: "0x06FF1a3B08b63E3b2f98A5124bFC22Dc0AE654d3",
		decimals: 18
	},
	{
		symbol: "KAT",
		address: "0x14da230d6726C50F759Bc1838717F8CE6373509C",
		decimals: 18
	},
	{
		symbol: "KAT",
		address: "0xA858bC1b71a895Ee83B92F149616F9B3F6Afa0FB",
		decimals: 18
	},
	{
		symbol: "KAT",
		address: "0x88FCFBc22C6d3dBaa25aF478C578978339BDe77a",
		decimals: 18
	},
	{
		symbol: "KATANA",
		address: "0xe6410569602124506658Ff992F258616Ea2D4A3D",
		decimals: 18
	},
	{
		symbol: "KAU",
		address: "0xe172F366678EC7B559F6C2913a437BaaDfd4e6c8",
		decimals: 8
	},
	{
		symbol: "KAYA",
		address: "0xFd66c6771D00b5646949086152B7CCDCa25E5686",
		decimals: 18
	},
	{
		symbol: "KBC",
		address: "0xd67b1Db49801b6F4c96a01a4F7964233150dc58b",
		decimals: 7
	},
	{
		symbol: "KBOT",
		address: "0xCd64aA18dDbCe84411aDBfe6da49354ba5187a45",
		decimals: 8
	},
	{
		symbol: "KBR",
		address: "0xd5527579226E4ebC8864906E49D05d4458CcF47f",
		decimals: 0
	},
	{
		symbol: "KC",
		address: "0x0D6DD9f68d24EC1d5fE2174f3EC8DAB52B52BaF5",
		decimals: 18
	},
	{
		symbol: "KCAL",
		address: "0x14EB60F5f270B059B0c788De0Ddc51Da86f8a06d",
		decimals: 10
	},
	{
		symbol: "KCH",
		address: "0xdB80734b094a3F964DEdfD10e8946753aE0AC04c",
		decimals: 18
	},
	{
		symbol: "KCH",
		address: "0x28C391FbF3F5E10fb3Fb8D6b2728419d3037409B",
		decimals: 18
	},
	{
		symbol: "KCS",
		address: "0x039B5649A59967e3e936D7471f9c3700100Ee1ab",
		decimals: 6
	},
	{
		symbol: "KCS",
		address: "0xf34960d9d60be18cC1D5Afc1A6F012A723a28811",
		decimals: 6
	},
	{
		symbol: "KCY",
		address: "0x9D22c3BF2b51213A3572E865ECf78fAb0294E75b",
		decimals: 18
	},
	{
		symbol: "KDAG",
		address: "0x95E40E065AFB3059dcabe4aaf404c1F92756603a",
		decimals: 18
	},
	{
		symbol: "KDH",
		address: "0xa3fAE71843524Eb359bCac859E8c8C10fd18e0e4",
		decimals: 8
	},
	{
		symbol: "KEA",
		address: "0x390D6673c1FA9DBb8000dB1AE89252b7d531Ab75",
		decimals: 8
	},
	{
		symbol: "KEE",
		address: "0x72D32ac1c5E66BfC5b08806271f8eEF915545164",
		decimals: 0
	},
	{
		symbol: "KEEP",
		address: "0x85Eee30c52B0b379b046Fb0F85F4f3Dc3009aFEC",
		decimals: 18
	},
	{
		symbol: "KEK",
		address: "0x3fa400483487A489EC9b1dB29C4129063EEC4654",
		decimals: 18
	},
	{
		symbol: "KEN",
		address: "0x6A7Ef4998eB9d0f706238756949F311a59E05745",
		decimals: 18
	},
	{
		symbol: "KEN",
		address: "0xBf4a29269bF3a5c351c2aF3A9c9Ed81b07129ce4",
		decimals: 18
	},
	{
		symbol: "KERMAN",
		address: "0x7841B2A48D1F6e78ACeC359FEd6D874Eb8a0f63c",
		decimals: 4
	},
	{
		symbol: "KEX",
		address: "0x16980b3B4a3f9D89E33311B5aa8f80303E5ca4F8",
		decimals: 6
	},
	{
		symbol: "KEY",
		address: "0x4Cd988AfBad37289BAAf53C13e98E2BD46aAEa8c",
		decimals: 18
	},
	{
		symbol: "KEY",
		address: "0x4CC19356f2D37338b9802aa8E8fc58B0373296E7",
		decimals: 18
	},
	{
		symbol: "KEYT",
		address: "0xcE13aBCE0DB5A8224616ef24D3979d466F19CF90",
		decimals: 18
	},
	{
		symbol: "KGC",
		address: "0xa8262Eb913FccEa4C3f77fc95b8b4043B384cFbB",
		decimals: 18
	},
	{
		symbol: "KGSL",
		address: "0xDC10e348AB2e3849573bD17BA1Db9e0eda705B5E",
		decimals: 18
	},
	{
		symbol: "KGT",
		address: "0xF3E0b9368993640287eEed970945Fdf57Da53Ed1",
		decimals: 18
	},
	{
		symbol: "KGW",
		address: "0x55Eb5288c9b65037a4cd2289637f38A4F9DB3a6B",
		decimals: 18
	},
	{
		symbol: "KHC.CX",
		address: "0xE96bfeBe8b8c85540519C57c06AB96f7435DC184",
		decimals: 8
	},
	{
		symbol: "KICK",
		address: "0x27695E09149AdC738A978e9A678F99E4c39e9eb9",
		decimals: 8
	},
	{
		symbol: "KICK",
		address: "0xC12D1c73eE7DC3615BA4e37E4ABFdbDDFA38907E",
		decimals: 8
	},
	{
		symbol: "KICKS",
		address: "0xD91a6162F146EF85922d9A15eE6eB14A00344586",
		decimals: 18
	},
	{
		symbol: "KIF",
		address: "0x177BA0cac51bFC7eA24BAd39d81dcEFd59d74fAa",
		decimals: 18
	},
	{
		symbol: "KIMCHI",
		address: "0x1E18821E69B9FAA8e6e75DFFe54E7E25754beDa0",
		decimals: 18
	},
	{
		symbol: "KIN",
		address: "0x818Fc6C2Ec5986bc6E2CBf00939d90556aB12ce5",
		decimals: 18
	},
	{
		symbol: "KIND",
		address: "0x4618519de4C304F3444ffa7f812dddC2971cc688",
		decimals: 8
	},
	{
		symbol: "KINE",
		address: "0xCbfef8fdd706cde6F208460f2Bf39Aa9c785F05D",
		decimals: 18
	},
	{
		symbol: "KING",
		address: "0xCc33Da342f28C4E52c349D6d3aB2d6ECb4969bA2",
		decimals: 18
	},
	{
		symbol: "KIP",
		address: "0x64E65D352f6A2949463B3a7595911B61BBaFc63E",
		decimals: 18
	},
	{
		symbol: "KIRO",
		address: "0xB1191F691A355b43542Bea9B8847bc73e7Abb137",
		decimals: 18
	},
	{
		symbol: "KIT",
		address: "0x080eB7238031F97Ff011e273D6CaD5ad0c2dE532",
		decimals: 18
	},
	{
		symbol: "KIT",
		address: "0x7866E48C74CbFB8183cd1a929cd9b95a7a5CB4F4",
		decimals: 18
	},
	{
		symbol: "KIWI",
		address: "0x2BF91c18Cd4AE9C2f2858ef9FE518180F7B5096D",
		decimals: 8
	},
	{
		symbol: "KLON",
		address: "0xB97D5cF2864FB0D08b34a484FF48d5492B2324A0",
		decimals: 18
	},
	{
		symbol: "KLOWN",
		address: "0xc97A5cdF41BAfD51c8dBE82270097e704d748b92",
		decimals: 7
	},
	{
		symbol: "KMC",
		address: "0x4b3eAcB500955d22eE8bCdD8dd3D9009E29F2d24",
		decimals: 8
	},
	{
		symbol: "KMC",
		address: "0xeD79E6dd91324F6Af138f01967BD24233d642a24",
		decimals: 8
	},
	{
		symbol: "KMPL",
		address: "0xe8D17542dfe79Ff4FBd4b850f2d39DC69c4489a2",
		decimals: 9
	},
	{
		symbol: "KMR",
		address: "0x71F7B56F9F8641f73cA71512a93857a7868d1443",
		decimals: 18
	},
	{
		symbol: "KMTBA",
		address: "0x2BDD6c9bf1bf396a37501AAE53751B9946B503Da",
		decimals: 18
	},
	{
		symbol: "KMX",
		address: "0x9b8C184439245B7bb24a5B2EC51Ec81c39589E8A",
		decimals: 18
	},
	{
		symbol: "KNCL",
		address: "0xdd974D5C2e2928deA5F71b9825b8b646686BD200",
		decimals: 18
	},
	{
		symbol: "KNDC",
		address: "0x8E5610ab5E39d26828167640EA29823fe1dD5843",
		decimals: 8
	},
	{
		symbol: "KNG",
		address: "0xac5470280C680956b1851F4ef9330F32E6fd243F",
		decimals: 18
	},
	{
		symbol: "KNOW",
		address: "0xb41f09a973a85c7F497c10B00a939dE667B55a78",
		decimals: 10
	},
	{
		symbol: "KNT",
		address: "0xfF5c25D2F40B47C4a37f989DE933E26562Ef0Ac0",
		decimals: 16
	},
	{
		symbol: "KNV",
		address: "0x5935Ffc231E93AC04DaA089C0F1B94d0FB2449de",
		decimals: 8
	},
	{
		symbol: "KNZV",
		address: "0x8cE5256f14A432579f7EE608a61761E1c4Af7d93",
		decimals: 8
	},
	{
		symbol: "KO.CX",
		address: "0x808126cd87Bde0144f1487DbFECC092613a3a832",
		decimals: 8
	},
	{
		symbol: "KOBE",
		address: "0xCb4e8CafEDa995da5cEdfda5205BD5664a12b848",
		decimals: 18
	},
	{
		symbol: "KOC",
		address: "0x677a3f5d699C70C606220382C41fa473F7e2f6bb",
		decimals: 18
	},
	{
		symbol: "KOIN",
		address: "0x66d28cb58487a7609877550E1a34691810A6b9FC",
		decimals: 8
	},
	{
		symbol: "KOK",
		address: "0x7BD6a4E7DB3A34c485A8DD02b30B6565e3bbC633",
		decimals: 18
	},
	{
		symbol: "KOMET",
		address: "0x6CfB6dF56BbdB00226AeFfCdb2CD1FE8Da1ABdA7",
		decimals: 18
	},
	{
		symbol: "KOMP",
		address: "0x41Bc0913ED789428E107C4eA9ED007815c5A8230",
		decimals: 18
	},
	{
		symbol: "KON",
		address: "0x9c10B6D9a92e8CdA1179F20a637F748E965F64E7",
		decimals: 18
	},
	{
		symbol: "KONO",
		address: "0x850aAB69f0e0171A9a49dB8BE3E71351c8247Df4",
		decimals: 18
	},
	{
		symbol: "KOP",
		address: "0xAE36C4A6E5076d76579dD2B00df90890Da2fBae8",
		decimals: 18
	},
	{
		symbol: "KOPI",
		address: "0x8CBC6d8E11a9cb59922278321E0E61Dfabc0D9F4",
		decimals: 2
	},
	{
		symbol: "KORE",
		address: "0xA866F0198208Eb07c83081d5136BE7f775c2399e",
		decimals: 18
	},
	{
		symbol: "KP3R",
		address: "0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44",
		decimals: 18
	},
	{
		symbol: "KP4R",
		address: "0xA89ac6e529aCf391CfbBD377F3aC9D93eae9664e",
		decimals: 18
	},
	{
		symbol: "KPER",
		address: "0xc89B4a8a121Dd3E726fE7515e703936cF83e3350",
		decimals: 18
	},
	{
		symbol: "KPR",
		address: "0xb5C33F965C8899D255c34CDD2A3efA8AbCbB3DeA",
		decimals: 18
	},
	{
		symbol: "KPW",
		address: "0xd3E41Fd8BbCd3D512119608Cf4a687a1Fda9807D",
		decimals: 8
	},
	{
		symbol: "KRC",
		address: "0x52ED883E23A22fb0ACE4629f0Dc5c6348580d1CE",
		decimals: 18
	},
	{
		symbol: "KRG",
		address: "0x32A8cD4D04D5F2e5De30AD73ef0A377eca2Fdd98",
		decimals: 18
	},
	{
		symbol: "KRI",
		address: "0x42566cFEFC853c232117EbA4413e45782a72715d",
		decimals: 18
	},
	{
		symbol: "KRL",
		address: "0x464eBE77c293E473B48cFe96dDCf88fcF7bFDAC0",
		decimals: 18
	},
	{
		symbol: "KRS",
		address: "0xdfB410994b66778Bd6cC2C82E8ffe4f7B2870006",
		decimals: 18
	},
	{
		symbol: "KRS",
		address: "0x229A569B673D908cee8920658AE7BCaD68e7d01D",
		decimals: 18
	},
	{
		symbol: "KRW-G",
		address: "0x4CC8486F2F3dCE2d3B5E27057Cf565e16906D12D",
		decimals: 18
	},
	{
		symbol: "KSEED",
		address: "0x3F09400313e83d53366147e3ea0e4e2279D80850",
		decimals: 18
	},
	{
		symbol: "KSG",
		address: "0xfda1F5278b9aa923b5e581565d599810C78c71f5",
		decimals: 18
	},
	{
		symbol: "KSWAP",
		address: "0x7705c572d9cc824fBA4e4EFb40F00916534396d9",
		decimals: 18
	},
	{
		symbol: "KT",
		address: "0x26DDF6CabADcBF4F013841BD8d914830BeB0d984",
		decimals: 8
	},
	{
		symbol: "KTC",
		address: "0x9827F6E8Df0CcC584ff7b37144De8bac7c446385",
		decimals: 18
	},
	{
		symbol: "KTETH",
		address: "0x2F90599aB7D47A7eEB25017B5429d7305794257B",
		decimals: 8
	},
	{
		symbol: "KTH",
		address: "0x0f8b6440A1F7BE3354fe072638a5C0F500b044bE",
		decimals: 18
	},
	{
		symbol: "KTLYO",
		address: "0x24E3794605C84E580EEA4972738D633E8a7127c8",
		decimals: 18
	},
	{
		symbol: "KTN",
		address: "0x491E136FF7FF03E6aB097E54734697Bb5802FC1C",
		decimals: 18
	},
	{
		symbol: "KTN",
		address: "0xa70b2f0738749248153446E8feaECe123714A104",
		decimals: 8
	},
	{
		symbol: "KTT",
		address: "0xCA24Db399fFc8f33aaEFa4926C9de3f58d1dA63D",
		decimals: 18
	},
	{
		symbol: "KUB",
		address: "0xc59cb23295e2DEEB66bd090ACB6B02BE8d30A11F",
		decimals: 10
	},
	{
		symbol: "KUBO",
		address: "0x4f76E85d067e219779A863ff18577846b3152F1F",
		decimals: 8
	},
	{
		symbol: "KUE",
		address: "0xdf1338FbAfe7aF1789151627B886781ba556eF9a",
		decimals: 18
	},
	{
		symbol: "KUPP",
		address: "0xc6c6224Cf32F5B0850Ddf740B47cD1eD31AbeaD4",
		decimals: 8
	},
	{
		symbol: "KUV",
		address: "0xF70d160102cF7a22c1E432d6928a9d625Db91170",
		decimals: 18
	},
	{
		symbol: "KWATT",
		address: "0x241bA672574A78a3A604CDd0a94429A73a84a324",
		decimals: 18
	},
	{
		symbol: "KWH",
		address: "0xB8DdC930c2bAB6c71610A2BE639036E829F9C10b",
		decimals: 18
	},
	{
		symbol: "KXC",
		address: "0x016396044709EB3edc69C44f4d5Fa6996917E4e8",
		decimals: 18
	},
	{
		symbol: "KYL",
		address: "0x67B6D479c7bB412C54e03dCA8E1Bc6740ce6b99C",
		decimals: 18
	},
	{
		symbol: "KYSC",
		address: "0x7e1A6Fb26702Ecb0439A641C5c285F7eec430419",
		decimals: 18
	},
	{
		symbol: "KYT",
		address: "0x532843F66375d5257eA34F723c6C2723Ccf7b7a2",
		decimals: 18
	},
	{
		symbol: "KZE",
		address: "0x71944c7953c93dBc0cd977e0ee1bBd9C2494B7B1",
		decimals: 8
	},
	{
		symbol: "KZN",
		address: "0x9541FD8B9b5FA97381783783CeBF2F5fA793C262",
		decimals: 8
	},
	{
		symbol: "L2",
		address: "0xBbff34E47E559ef680067a6B1c980639EEb64D24",
		decimals: 18
	},
	{
		symbol: "L2P",
		address: "0xeE0f286776639cD363Da810DAF3e0623F82576b0",
		decimals: 18
	},
	{
		symbol: "L9",
		address: "0x33Afa6514ad44594B1886859165B9AA641bDaBA9",
		decimals: 18
	},
	{
		symbol: "LA",
		address: "0xE50365f5D679CB98a1dd62D6F6e58e59321BcdDf",
		decimals: 18
	},
	{
		symbol: "LABS",
		address: "0x8b0E42F366bA502d787BB134478aDfAE966C8798",
		decimals: 18
	},
	{
		symbol: "LALA",
		address: "0xfD107B473AB90e8Fbd89872144a3DC92C40Fa8C9",
		decimals: 18
	},
	{
		symbol: "LAMB",
		address: "0x8971f9fd7196e5cEE2C1032B50F656855af7Dd26",
		decimals: 18
	},
	{
		symbol: "LAMBO",
		address: "0x59b8d11d50Ab6615F9cd430743BaF646Fb8966c6",
		decimals: 18
	},
	{
		symbol: "LAR",
		address: "0x6226caA1857AFBc6DFB6ca66071Eb241228031A1",
		decimals: 18
	},
	{
		symbol: "LATINO",
		address: "0x567287d4f42086BEAb4b36De9Af21C70aDEc6760",
		decimals: 4
	},
	{
		symbol: "LATX",
		address: "0x2f85E502a988AF76f7ee6D83b7db8d6c0A823bf9",
		decimals: 8
	},
	{
		symbol: "LAYER",
		address: "0x0fF6ffcFDa92c53F615a4A75D982f399C989366b",
		decimals: 18
	},
	{
		symbol: "LB.CX",
		address: "0x8E854926D29855d16661f4572F8Ca1785bb240C2",
		decimals: 8
	},
	{
		symbol: "LBA",
		address: "0xfe5F141Bf94fE84bC28deD0AB966c16B17490657",
		decimals: 18
	},
	{
		symbol: "LBD",
		address: "0xb15AE165000c8D7B69D2a82e425E110668C73ad5",
		decimals: 9
	},
	{
		symbol: "LBET",
		address: "0x932d447274dCFfB4Aea4f0944d3C804e88056416",
		decimals: 18
	},
	{
		symbol: "LBK",
		address: "0x9cB1AEaFcc8A9406632C5B084246Ea72f62d37b6",
		decimals: 8
	},
	{
		symbol: "LBK",
		address: "0xd9af2d11d788da0097076f4Eb21bd1C5533743D9",
		decimals: 18
	},
	{
		symbol: "LBN",
		address: "0xB9843e5dE0f37d1e22C8075e5814e13565FE7C22",
		decimals: 18
	},
	{
		symbol: "LBRTY",
		address: "0xB1F2b122139daCD2aD29840E92cbc38716568994",
		decimals: 18
	},
	{
		symbol: "LBURST",
		address: "0x93eCD2ecDFb91aB2fEe28A8779A6adfe2851cda6",
		decimals: 18
	},
	{
		symbol: "LBXC",
		address: "0xfFE510a92434a0Df346C5E72a3494b043Cf249eB",
		decimals: 18
	},
	{
		symbol: "LC+",
		address: "0xF133F87980CFA1EdC6594Bb37409D9AbcCBbA786",
		decimals: 18
	},
	{
		symbol: "LCS",
		address: "0xAA19961b6B858D9F18a115f25aa1D98ABc1fdBA8",
		decimals: 18
	},
	{
		symbol: "LCT",
		address: "0x4A37A91eec4C97F9090CE66d21D3B3Aadf1aE5aD",
		decimals: 18
	},
	{
		symbol: "LCT",
		address: "0x05C7065d644096a4E4C3FE24AF86e36dE021074b",
		decimals: 18
	},
	{
		symbol: "LCX",
		address: "0x037A54AaB062628C9Bbae1FDB1583c195585fe41",
		decimals: 18
	},
	{
		symbol: "LDC",
		address: "0x5102791cA02FC3595398400BFE0e33d7B6C82267",
		decimals: 18
	},
	{
		symbol: "LDEX",
		address: "0xb1D22DfFb6C9BF70544116b3ce784454cf383577",
		decimals: 18
	},
	{
		symbol: "LDG",
		address: "0x614348D080835ADCbbDEe121af077024e27EcCC6",
		decimals: 18
	},
	{
		symbol: "LDN",
		address: "0x8260AA7B903FA1746820ebf674f2F837b22F016b",
		decimals: 8
	},
	{
		symbol: "LDN",
		address: "0xb29663Aa4E2e81e425294193616c1B102B70a158",
		decimals: 18
	},
	{
		symbol: "LDO",
		address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
		decimals: 18
	},
	{
		symbol: "LDS",
		address: "0xF23444084c75B15d76414633abb003d855dF4605",
		decimals: 18
	},
	{
		symbol: "LDX",
		address: "0x9eFa0e2387E4CBA02a6E4E6594b8f4Dd209a0b93",
		decimals: 0
	},
	{
		symbol: "LEAD",
		address: "0x1dD80016e3d4ae146Ee2EBB484e8edD92dacC4ce",
		decimals: 18
	},
	{
		symbol: "LEDU",
		address: "0x5b26C5D0772E5bbaC8b3182AE9a13f9BB2D03765",
		decimals: 8
	},
	{
		symbol: "LEDU",
		address: "0xC741f06082AA47F93729070aD0dD95E223Bda091",
		decimals: 8
	},
	{
		symbol: "LEEE",
		address: "0x7f23114A9810757f38bF5D5A342872aAfbe98C13",
		decimals: 18
	},
	{
		symbol: "LEGA",
		address: "0xC166F976ce9926A3205b145Af104eB0E4b38b5C0",
		decimals: 18
	},
	{
		symbol: "LELOAP",
		address: "0x8a63bE90F095F6777be3Ed25D9fC7CD2a63DDb30",
		decimals: 18
	},
	{
		symbol: "LEML",
		address: "0x1F9232E7F1318Abf91366e6081d57Fa3C1bcdE88",
		decimals: 18
	},
	{
		symbol: "LEMO",
		address: "0x60C24407d01782C2175D32fe7C8921ed732371D1",
		decimals: 18
	},
	{
		symbol: "LEND",
		address: "0x80fB784B7eD66730e8b1DBd9820aFD29931aab03",
		decimals: 18
	},
	{
		symbol: "LENS",
		address: "0x13Cb835C47782dad075Ce7fAA1F8439b548B712D",
		decimals: 8
	},
	{
		symbol: "LEO",
		address: "0x2AF5D2aD76741191D15Dfe7bF6aC92d4Bd912Ca3",
		decimals: 18
	},
	{
		symbol: "LEO",
		address: "0xf97b5d65Da6b0468b90D531ddae2a69843e6797d",
		decimals: 18
	},
	{
		symbol: "LEOBEAR",
		address: "0x3c955e35b6da1fF623D38D750c85b3Aed89A10c1",
		decimals: 18
	},
	{
		symbol: "LEOBULL",
		address: "0xC2685307Ef2B8842fbf3DeF432408C46Bd0420fd",
		decimals: 18
	},
	{
		symbol: "LEODOOM",
		address: "0x22f39B18d17665177f1AC88d6DA4861B13be07Df",
		decimals: 18
	},
	{
		symbol: "LEOHEDGE",
		address: "0xD83c5c357969628272DEf87DcdB5B66352dFD794",
		decimals: 18
	},
	{
		symbol: "LEOMOON",
		address: "0xcFEB236743Bd4b3789D28bbEa9Dc4ef0792c87f9",
		decimals: 18
	},
	{
		symbol: "LESS",
		address: "0x7ca121b093e2FbD4bB9A894bD5Ff487d16f1F83b",
		decimals: 18
	},
	{
		symbol: "LET",
		address: "0xFA3118B34522580c35Ae27F6cf52da1dBb756288",
		decimals: 6
	},
	{
		symbol: "LEV",
		address: "0x0F4CA92660Efad97a9a70CB0fe969c755439772C",
		decimals: 9
	},
	{
		symbol: "LEVL",
		address: "0x09970aec766b6f3223aCA9111555E99DC50Ff13a",
		decimals: 18
	},
	{
		symbol: "LFC",
		address: "0xe0c8087CE1a17bdd5D6c12eb52F8d7efF7791987",
		decimals: 18
	},
	{
		symbol: "LFR",
		address: "0xc798cd1c49db0E297312E4c682752668CE1dB2AD",
		decimals: 5
	},
	{
		symbol: "LG",
		address: "0x6Fe536a1d595C12cbb407C5B2C03999f658A5C72",
		decimals: 18
	},
	{
		symbol: "LG",
		address: "0xc520F3Ac303a107D8F4B08b326B6ea66A4f961cd",
		decimals: 18
	},
	{
		symbol: "LGBTQ",
		address: "0x5881dA4527BCdC44a100F8bA2efC4039243D2C07",
		decimals: 1
	},
	{
		symbol: "LGC",
		address: "0x3b3A5557F119106270017A7662488C1FF6312A6b",
		decimals: 18
	},
	{
		symbol: "LGC",
		address: "0x2bc8B955F6a0Ed5a9D4146DED61aEC0bB74EcF67",
		decimals: 18
	},
	{
		symbol: "LGC",
		address: "0xA0E5A7Da90765bEf7550cBD0E208e50E20c97d41",
		decimals: 8
	},
	{
		symbol: "LGCY",
		address: "0xaE697F994Fc5eBC000F8e22EbFfeE04612f98A0d",
		decimals: 18
	},
	{
		symbol: "LGD",
		address: "0x59061b6f26BB4A9cE5828A19d35CFD5A4B80F056",
		decimals: 8
	},
	{
		symbol: "LGD",
		address: "0xb56739D48429d272881597090E5680409271Bc24",
		decimals: 18
	},
	{
		symbol: "LGO",
		address: "0x123aB195DD38B1b40510d467a6a359b201af056f",
		decimals: 8
	},
	{
		symbol: "LGO",
		address: "0x0a50C93c762fDD6E56D86215C24AaAD43aB629aa",
		decimals: 8
	},
	{
		symbol: "LGOLD",
		address: "0x27778E14Ce36d3B85e1efFeB43816a17bBB7088A",
		decimals: 18
	},
	{
		symbol: "LGR",
		address: "0x2eb86e8fC520E0F6Bb5D9Af08F924fe70558Ab89",
		decimals: 8
	},
	{
		symbol: "LHA.CX",
		address: "0x64a16Ec57cca09556Cc259D86886EEC73493BC1e",
		decimals: 8
	},
	{
		symbol: "LIB",
		address: "0x3FD2E747CEA0E8A78f1827ea2FfD3334628A600b",
		decimals: 18
	},
	{
		symbol: "LIB",
		address: "0x0bf6261297198D91D4FA460242C69232146A5703",
		decimals: 18
	},
	{
		symbol: "LIBER",
		address: "0xE6DfBF1FAcA95036B8E76e1Fb28933D025B76Cc0",
		decimals: 18
	},
	{
		symbol: "LIBERTAS",
		address: "0x49184E6dAe8C8ecD89d8Bdc1B950c597b8167c90",
		decimals: 2
	},
	{
		symbol: "LIBFX",
		address: "0xc0ea83113038987d974FE667831a36E442e661E7",
		decimals: 18
	},
	{
		symbol: "LIBREF",
		address: "0x449efE48ad7cD423BAB056276639f8120cd4F9a3",
		decimals: 18
	},
	{
		symbol: "LID",
		address: "0x0417912b3a7AF768051765040A55BB0925D4DDcF",
		decimals: 18
	},
	{
		symbol: "LIEN",
		address: "0xaB37e1358b639Fd877f015027Bb62d3ddAa7557E",
		decimals: 8
	},
	{
		symbol: "LIF",
		address: "0xEB9951021698B42e4399f9cBb6267Aa35F82D59D",
		decimals: 18
	},
	{
		symbol: "LIFE",
		address: "0xfF18DBc487b4c2E3222d115952bABfDa8BA52F5F",
		decimals: 18
	},
	{
		symbol: "LIGHT",
		address: "0x1295b55fA04FBAc6d9e7c351Ecb3486e88129027",
		decimals: 8
	},
	{
		symbol: "LIKE",
		address: "0x02F61Fd266DA6E8B102D4121f5CE7b992640CF98",
		decimals: 18
	},
	{
		symbol: "LIKE",
		address: "0x92298Fa0647b5dcFf6eEaBAb97c9Bd81b5c30D06",
		decimals: 0
	},
	{
		symbol: "LINA",
		address: "0x3E9BC21C9b189C09dF3eF1B824798658d5011937",
		decimals: 18
	},
	{
		symbol: "LINA",
		address: "0xC05d14442A510De4D3d71a3d316585aA0CE32b50",
		decimals: 18
	},
	{
		symbol: "LINK",
		address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
		decimals: 18
	},
	{
		symbol: "LINKA",
		address: "0x578B49C45961f98d8DF92854b53F1641AF0A5036",
		decimals: 18
	},
	{
		symbol: "LINKBEAR",
		address: "0xa209Ba34C01A2713a4453A656630cc9De8A362Bc",
		decimals: 18
	},
	{
		symbol: "LINKBULL",
		address: "0x83aD87C988aC0c6277C0c6234Cc8108b20bB5d9B",
		decimals: 18
	},
	{
		symbol: "LINKETHPA",
		address: "0x542156d51D10Db5acCB99f9Db7e7C91B74E80a2c",
		decimals: 18
	},
	{
		symbol: "LINKETHRSI",
		address: "0x8933ea1Ce67B946BdF2436cE860fFBb53Ce814d2",
		decimals: 18
	},
	{
		symbol: "LINKPT",
		address: "0x78E29d35573beA6265aEDfCb9F45481B717EBFdE",
		decimals: 18
	},
	{
		symbol: "LINKRSICO",
		address: "0x0329d23fC7B1b1e6Cca57aFA3F0090F1189069e8",
		decimals: 18
	},
	{
		symbol: "LINKUSD",
		address: "0x0E2EC54fC0B509F445631Bf4b91AB8168230C752",
		decimals: 18
	},
	{
		symbol: "LIQ",
		address: "0x72CA0501427BB8f089c1c4F767cb17d017e803a9",
		decimals: 18
	},
	{
		symbol: "LIQ",
		address: "0x44Fd55aEB7420b4fD275e19d6f0674a6f91AD356",
		decimals: 8
	},
	{
		symbol: "LIQ",
		address: "0xe6A9e1BEC166f50Eda336d02dF2662d4Eb8AB23c",
		decimals: 18
	},
	{
		symbol: "LIQLO",
		address: "0x59AD6061A0be82155E7aCcE9F0C37Bf59F9c1e3C",
		decimals: 18
	},
	{
		symbol: "LIQUID",
		address: "0xaC2385e183d9301dd5E2BB08DA932CbF9800dC9c",
		decimals: 18
	},
	{
		symbol: "LIT",
		address: "0x763Fa6806e1acf68130D2D0f0df754C93cC546B2",
		decimals: 18
	},
	{
		symbol: "LIT",
		address: "0xb59490aB09A0f526Cc7305822aC65f2Ab12f9723",
		decimals: 18
	},
	{
		symbol: "LIT",
		address: "0xF525CC44bA797d91413A490a3a7bF5532c8fD378",
		decimals: 18
	},
	{
		symbol: "LIT",
		address: "0x2e3C062E16c1a3a04Ddc5003c62E294305d83684",
		decimals: 2
	},
	{
		symbol: "LIVE",
		address: "0x24A77c1F17C547105E14813e517be06b0040aa76",
		decimals: 18
	},
	{
		symbol: "LIX",
		address: "0xd0345D30FD918D7682398ACbCdf139C808998709",
		decimals: 18
	},
	{
		symbol: "LKB",
		address: "0x1397688eC12D9E556529008D88723d7C6c58E152",
		decimals: 18
	},
	{
		symbol: "LKC",
		address: "0xE58e8d254d17520FF1E7Bf0cDE3ae32Bd795203b",
		decimals: 18
	},
	{
		symbol: "LKN",
		address: "0x9f549ebFD4974cD4eD4A1550D40394B44A7382AA",
		decimals: 18
	},
	{
		symbol: "LKOD.CX",
		address: "0x1022a16994230272763D801CCA849D4d122c814B",
		decimals: 8
	},
	{
		symbol: "LKY",
		address: "0x49bD2DA75b1F7AF1E4dFd6b1125FEcDe59dBec58",
		decimals: 18
	},
	{
		symbol: "LLAND",
		address: "0xE5bF6790D138B154f1DF3Db8d245bE46A5D05eE4",
		decimals: 18
	},
	{
		symbol: "LLU",
		address: "0xDF44a0043dfAE212a49ccfa2C480e52E3E4367Bc",
		decimals: 18
	},
	{
		symbol: "LLY.CX",
		address: "0x5f88889c7466212e85bB9a720952abE56F6ACC95",
		decimals: 8
	},
	{
		symbol: "LML",
		address: "0x25B6325f5BB1c1E03cfbC3e53F470E1F1ca022E3",
		decimals: 18
	},
	{
		symbol: "LMY",
		address: "0x66fD97a78d8854fEc445cd1C80a07896B0b4851f",
		decimals: 18
	},
	{
		symbol: "LNC",
		address: "0x6BEB418Fc6E1958204aC8baddCf109B8E9694966",
		decimals: 18
	},
	{
		symbol: "LNC",
		address: "0x63e634330A20150DbB61B15648bC73855d6CCF07",
		decimals: 18
	},
	{
		symbol: "LND",
		address: "0x0947b0e6D821378805c9598291385CE7c791A6B2",
		decimals: 18
	},
	{
		symbol: "LNK",
		address: "0xE2E6D4BE086c6938B53B22144855eef674281639",
		decimals: 18
	},
	{
		symbol: "LNKO",
		address: "0x11afE7Fa792589dd1236257f99ba09f510460Ad9",
		decimals: 8
	},
	{
		symbol: "LNOT",
		address: "0xB4eA189499C7722B39cBA00443Cd9d0E600a8670",
		decimals: 18
	},
	{
		symbol: "LNT",
		address: "0x3a73F6156C4fBC71B8fDF38090A9D99401163644",
		decimals: 18
	},
	{
		symbol: "LNX",
		address: "0x8e907bbA61ae322A067644D6C8211fA05F2A12f4",
		decimals: 18
	},
	{
		symbol: "LOA",
		address: "0x7458fd786B2fe8CD801C0381f88b61C5071A006F",
		decimals: 18
	},
	{
		symbol: "LOAD",
		address: "0xa883E72c12473DeD50A5FbfFA60E4000fa5FE3C8",
		decimals: 8
	},
	{
		symbol: "LOC",
		address: "0x2ca76b74C148cE6c4f51f47278EF089030E03178",
		decimals: 6
	},
	{
		symbol: "LOC",
		address: "0x5e3346444010135322268a4630d2ED5F8D09446c",
		decimals: 18
	},
	{
		symbol: "LOCI",
		address: "0x9c23D67AEA7B95D80942e3836BCDF7E708A747C2",
		decimals: 18
	},
	{
		symbol: "LOCK",
		address: "0x95172ccBe8344fecD73D0a30F54123652981BD6F",
		decimals: 18
	},
	{
		symbol: "LOCK",
		address: "0xB9464ef80880c5aeA54C7324c0b8Dd6ca6d05A90",
		decimals: 18
	},
	{
		symbol: "LOCUS",
		address: "0xC64500DD7B0f1794807e67802F8Abbf5F8Ffb054",
		decimals: 18
	},
	{
		symbol: "LOK",
		address: "0x21aE23B882A340A22282162086bC98D3E2B73018",
		decimals: 18
	},
	{
		symbol: "LOL",
		address: "0x5978708d6ccE1CC9640Eed47422D64c91BbD5171",
		decimals: 18
	},
	{
		symbol: "LOM",
		address: "0x2516ac5Db37DF788f8f6Ef69EcaA7Cd76652eAe2",
		decimals: 18
	},
	{
		symbol: "LON",
		address: "0x0000000000095413afC295d19EDeb1Ad7B71c952",
		decimals: 18
	},
	{
		symbol: "LONG",
		address: "0x28C6A58C2A5d8c5F6681e07bfa0AdA4bea14C9EE",
		decimals: 18
	},
	{
		symbol: "LOOK",
		address: "0x253C7dd074f4BaCb305387F922225A4f737C08bd",
		decimals: 18
	},
	{
		symbol: "LOOM",
		address: "0x42476F744292107e34519F9c357927074Ea3F75D",
		decimals: 18
	},
	{
		symbol: "LOOMOLD",
		address: "0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0",
		decimals: 18
	},
	{
		symbol: "LOON",
		address: "0x7C5d5100B339Fe7D995a893AF6CB496B9474373c",
		decimals: 18
	},
	{
		symbol: "LOOT",
		address: "0x7b3D36Eb606f873A75A6aB68f8c999848B04F935",
		decimals: 18
	},
	{
		symbol: "LORI",
		address: "0x8cd58D4A29aa5461D07F7fe1EDB5F6D3d22D5ADa",
		decimals: 18
	},
	{
		symbol: "LOT",
		address: "0x6556D2EC4D96Da39CF75cbE50D58fae90079800a",
		decimals: 18
	},
	{
		symbol: "LOTEU",
		address: "0xF8A3Dc13B7A8DA473f80660f513C4343E4EDd7f7",
		decimals: 8
	},
	{
		symbol: "LOTO",
		address: "0xf947B0824c3995787EFC899017A36bC9f281265e",
		decimals: 8
	},
	{
		symbol: "LOV",
		address: "0xE3c864307b5592404431649De541c259497e2BD1",
		decimals: 8
	},
	{
		symbol: "LP",
		address: "0x14D9444F6B9D55CaBa5d73f15BEa947695C11C82",
		decimals: 9
	},
	{
		symbol: "LPK",
		address: "0x2cc71c048A804Da930e28E93F3211dC03c702995",
		decimals: 8
	},
	{
		symbol: "LPL",
		address: "0x99295f1141d58A99e939F7bE6BBe734916a875B8",
		decimals: 18
	},
	{
		symbol: "LPNT",
		address: "0x6a4C76874e686A7d080D173987A35A9c48905583",
		decimals: 18
	},
	{
		symbol: "LPOOL",
		address: "0x6149C26Cd2f7b5CCdb32029aF817123F6E37Df5B",
		decimals: 18
	},
	{
		symbol: "LPS",
		address: "0x97Bdd9FdFa0B1677A2a353848514d93c108BeC85",
		decimals: 10
	},
	{
		symbol: "LPT",
		address: "0x58b6A8A3302369DAEc383334672404Ee733aB239",
		decimals: 18
	},
	{
		symbol: "LQD",
		address: "0xD29F0b5b3F50b07Fe9a9511F7d86F4f4bAc3f8c4",
		decimals: 18
	},
	{
		symbol: "LQTY",
		address: "0x6DEA81C8171D0bA574754EF6F8b412F2Ed88c54D",
		decimals: 18
	},
	{
		symbol: "LRC",
		address: "0xEF68e7C694F40c8202821eDF525dE3782458639f",
		decimals: 18
	},
	{
		symbol: "LRC",
		address: "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
		decimals: 18
	},
	{
		symbol: "LSC",
		address: "0xc77D7E0dD7b2A01B990e866FeB21d031f1418c2E",
		decimals: 18
	},
	{
		symbol: "LSILVER",
		address: "0xD64809f5F7d772D9112A6BD379De00A77188199E",
		decimals: 18
	},
	{
		symbol: "LST",
		address: "0x6b9F1F092E0B10015a4391A80cD3E6B6cefD1728",
		decimals: 18
	},
	{
		symbol: "LST",
		address: "0x355376d6471E09A4FfCA8790F50DA625630c5270",
		decimals: 18
	},
	{
		symbol: "LST",
		address: "0x681Ecc5a0bFD18c308A1138fF607F818baC5E417",
		decimals: 18
	},
	{
		symbol: "LST",
		address: "0x4de2573e27E648607B50e1Cfff921A33E4A34405",
		decimals: 18
	},
	{
		symbol: "LSV",
		address: "0xEe059F0ca1507e4E20C689b20CFf71B5E924f7bd",
		decimals: 18
	},
	{
		symbol: "LT",
		address: "0xbEa9BA2527f584B9543D1fdf402493bF23EF156f",
		decimals: 18
	},
	{
		symbol: "LT",
		address: "0x48F3726C787Bdc36Bb00c978E701879cEEd185A4",
		decimals: 4
	},
	{
		symbol: "LTB",
		address: "0xa105C740BC012A43a342Ab4A0Ef40143452C8E89",
		decimals: 18
	},
	{
		symbol: "LTCBEAR",
		address: "0xB422e605fBd765B80D2C4b5d8196C2f94144438B",
		decimals: 18
	},
	{
		symbol: "LTCBULL",
		address: "0xDB61354E9cf2217a29770E9811832B360a8DAad3",
		decimals: 18
	},
	{
		symbol: "LTCDOOM",
		address: "0x31E15A071A5340F0393eA98dDe3A095D64206A02",
		decimals: 18
	},
	{
		symbol: "LTCHEDGE",
		address: "0xD0C64D6c0E9aA53fFFd8B80313e035f7B83083F3",
		decimals: 18
	},
	{
		symbol: "LTCMOON",
		address: "0x08dA69ca2BFe378f384cb76c84D6deD701eC65C7",
		decimals: 18
	},
	{
		symbol: "LTCONE",
		address: "0x9Eb4F2dD25958eF1C72FE115D62DA67ABd6c000C",
		decimals: 18
	},
	{
		symbol: "LTG",
		address: "0x0879e0c9822b75f31f0b0eD2A30BE9F484a57C2F",
		decimals: 0
	},
	{
		symbol: "LTG",
		address: "0xb4C9abc8a74Bd2E0E0b7AC5ecE30792e65D86c59",
		decimals: 8
	},
	{
		symbol: "LTH",
		address: "0x5c8118FC0237697422CeD89a448Dce2C8E34B4EF",
		decimals: 8
	},
	{
		symbol: "LTK",
		address: "0x8A732BC91c33c167F868E0af7e6f31e0776d0f71",
		decimals: 18
	},
	{
		symbol: "LTO",
		address: "0x3DB6Ba6ab6F95efed1a6E794caD492fAAabF294D",
		decimals: 8
	},
	{
		symbol: "LTT",
		address: "0x5F1dF88D5C354006DfF74D1B72A40E8c4afc0C37",
		decimals: 18
	},
	{
		symbol: "LTX",
		address: "0xa393473d64d2F9F026B60b6Df7859A689715d092",
		decimals: 8
	},
	{
		symbol: "LUA",
		address: "0xB1f66997A5760428D3a87D68b90BfE0aE64121cC",
		decimals: 18
	},
	{
		symbol: "LUC",
		address: "0x5dbe296F97B23C4A6AA6183D73e574D02bA5c719",
		decimals: 18
	},
	{
		symbol: "LUCK",
		address: "0xFB12e3CcA983B9f59D90912Fd17F8D745A8B2953",
		decimals: 0
	},
	{
		symbol: "LUD",
		address: "0xe64b47931f28f89Cc7A0C6965Ecf89EaDB4975f5",
		decimals: 18
	},
	{
		symbol: "LUM",
		address: "0xA89b5934863447f6E4Fc53B315a93e873bdA69a3",
		decimals: 18
	},
	{
		symbol: "LUN",
		address: "0xfa05A73FfE78ef8f1a739473e462c54bae6567D9",
		decimals: 18
	},
	{
		symbol: "LUSD",
		address: "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
		decimals: 18
	},
	{
		symbol: "LVE",
		address: "0x428d941E0A014Bb5cdeB09BB00Bc7b245221Bdb0",
		decimals: 18
	},
	{
		symbol: "LVN",
		address: "0xc8Cac7672f4669685817cF332a33Eb249F085475",
		decimals: 18
	},
	{
		symbol: "LVX",
		address: "0x261638EC8ee8100484130EBD2fEBfDAdC0D8742a",
		decimals: 18
	},
	{
		symbol: "LX.CX",
		address: "0xE06D2Bf8fB832020091Fdc0063b5Cb6C5b889Ea4",
		decimals: 8
	},
	{
		symbol: "LXC",
		address: "0x6a404a3386655Bd8b63E584f2EFd2E3fb60E70f8",
		decimals: 18
	},
	{
		symbol: "LXT",
		address: "0xBC46D9961A3932f7D6b64abfdeC80C1816C4B835",
		decimals: 18
	},
	{
		symbol: "LXT",
		address: "0xaA031595D2D9B82847a5Df3390C6395839b273D0",
		decimals: 18
	},
	{
		symbol: "LYFE",
		address: "0x08350DFE9b5BcA39599B20E0ED92c5C78dC8a891",
		decimals: 18
	},
	{
		symbol: "LYFT.CX",
		address: "0x3F1844917418cADE330F938093Cf6F23F0ED5093",
		decimals: 8
	},
	{
		symbol: "LYM",
		address: "0xc690F7C7FcfFA6a82b79faB7508c466FEfdfc8c5",
		decimals: 18
	},
	{
		symbol: "LYN",
		address: "0xB0B1685f55843D03739c7D9b0A230F1B7DcF03D5",
		decimals: 18
	},
	{
		symbol: "LYXE",
		address: "0xA8b919680258d369114910511cc87595aec0be6D",
		decimals: 18
	},
	{
		symbol: "LZE",
		address: "0xFe69bc0920Fb63c5924CfC322dc4a5Cc23d9afED",
		decimals: 18
	},
	{
		symbol: "LZR",
		address: "0x3453769b660b7EE4261AaA043479Aa3CA02243bf",
		decimals: 18
	},
	{
		symbol: "M-ETH",
		address: "0x3f4B726668da46f5e0E75aA5D478ACEc9f38210F",
		decimals: 18
	},
	{
		symbol: "M.CX",
		address: "0x2e42E8Da119315881748B140E69a0343daCAB4Ea",
		decimals: 8
	},
	{
		symbol: "MA.CX",
		address: "0x3A50BD419e88b07D7a27eB0b79e691C7350Fc54C",
		decimals: 8
	},
	{
		symbol: "MAAPL",
		address: "0xd36932143F6eBDEDD872D5Fb0651f4B72Fd15a84",
		decimals: 18
	},
	{
		symbol: "MAC",
		address: "0xc3e2de0b661cF58F66BdE8E896905399ded58af5",
		decimals: 0
	},
	{
		symbol: "MAC",
		address: "0x77dBa24943F348d9C3ce4D9dF0675CaA7Bb550bf",
		decimals: 6
	},
	{
		symbol: "MACH",
		address: "0xB119Ce94D098C18fe380904c24e358bd887F00BE",
		decimals: 18
	},
	{
		symbol: "MACPO",
		address: "0x63bf0126c6C4D17bb33c362151759EC21b36537B",
		decimals: 18
	},
	{
		symbol: "MAD",
		address: "0x5B09A0371C1DA44A8E24D36Bf5DEb1141a84d875",
		decimals: 18
	},
	{
		symbol: "MAFI",
		address: "0x4889F721f80C5E9fadE6Ea9B85835D405D79a4f4",
		decimals: 18
	},
	{
		symbol: "MAG",
		address: "0x647F274b3a7248D6CF51b35f08E7E7fD6EdFb271",
		decimals: 0
	},
	{
		symbol: "MAHA",
		address: "0xB4d930279552397bbA2ee473229f89Ec245bc365",
		decimals: 18
	},
	{
		symbol: "MAI",
		address: "0x75387e1287Dd85482aB66102DA9f6577E027f609",
		decimals: 18
	},
	{
		symbol: "MAK",
		address: "0x49A2e9Be4e06C7106c5708bFCABB9322d0ba33db",
		decimals: 18
	},
	{
		symbol: "MAKI",
		address: "0x270D09cb4be817c98e84fEffdE03D5CD45e30a27",
		decimals: 18
	},
	{
		symbol: "MALL",
		address: "0x41BbcF4F8f0e8a0a3CcE4287d1C0C3D27C65Ba0D",
		decimals: 18
	},
	{
		symbol: "MAME",
		address: "0xABccaAdd77078A67622dFD5f74066ce4581c0a99",
		decimals: 8
	},
	{
		symbol: "MAMZN",
		address: "0x0cae9e4d663793c2a2A0b211c1Cf4bBca2B9cAa7",
		decimals: 18
	},
	{
		symbol: "MAN",
		address: "0xe25bCec5D3801cE3a794079BF94adF1B8cCD802D",
		decimals: 18
	},
	{
		symbol: "MANA",
		address: "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942",
		decimals: 18
	},
	{
		symbol: "MANDI",
		address: "0x5aA485E6b794bcf5F834BF5c7FF43B9B83322764",
		decimals: 8
	},
	{
		symbol: "MANY",
		address: "0xAB7aaf9e485a3bc885985184ABE9FC6Aba727bD6",
		decimals: 18
	},
	{
		symbol: "MAP",
		address: "0x49229C3902d49BE6443E01C0251b02780397ab1A",
		decimals: 18
	},
	{
		symbol: "MAP",
		address: "0x9E976F211daea0D652912AB99b0Dc21a7fD728e4",
		decimals: 18
	},
	{
		symbol: "MAR",
		address: "0xA9080Bf7C8e55f2Af5C6603243D5865F4f328715",
		decimals: 18
	},
	{
		symbol: "MARIO-CASH-JAN-2021",
		address: "0x84bd083B1c8BF929f39c98bC17cf518F40154F58",
		decimals: 18
	},
	{
		symbol: "MARK",
		address: "0x67c597624B17b16fb77959217360B7cD18284253",
		decimals: 9
	},
	{
		symbol: "MARS",
		address: "0xEDD8DA5C20EB014E550008DF3304213ddE5e29F0",
		decimals: 8
	},
	{
		symbol: "MART",
		address: "0xfdcc07Ab60660de533b5Ad26e1457b565a9D59Bd",
		decimals: 18
	},
	{
		symbol: "MAS",
		address: "0x23Ccc43365D9dD3882eab88F43d515208f832430",
		decimals: 18
	},
	{
		symbol: "MASH",
		address: "0xa0d440C6DA37892Dc06Ee7930B2eedE0634FD681",
		decimals: 8
	},
	{
		symbol: "MASK",
		address: "0x0fe629d1E84E171f8fF0C1Ded2Cc2221Caa48a3f",
		decimals: 18
	},
	{
		symbol: "MASK",
		address: "0x69af81e73A73B40adF4f3d4223Cd9b1ECE623074",
		decimals: 18
	},
	{
		symbol: "MATH",
		address: "0x08d967bb0134F2d07f7cfb6E246680c53927DD30",
		decimals: 18
	},
	{
		symbol: "MATIC",
		address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
		decimals: 18
	},
	{
		symbol: "MATICBEAR",
		address: "0xbE893b4C214DBFfC17ef1E338fBDb7061FF09237",
		decimals: 18
	},
	{
		symbol: "MATICBULL",
		address: "0x7e03521b9dA891Ca3F79A8728E2eaeb24886c5f9",
		decimals: 18
	},
	{
		symbol: "MATTER",
		address: "0x1C9491865a1DE77C5b6e19d2E6a5F1D7a6F2b25F",
		decimals: 18
	},
	{
		symbol: "MAVC",
		address: "0x621E3b71D07b51242bcca167928e184235A4bb87",
		decimals: 18
	},
	{
		symbol: "MAX",
		address: "0xe7976c4Efc60d9f4C200Cc1bCEF1A1e3B02c73e7",
		decimals: 18
	},
	{
		symbol: "MAYA",
		address: "0x294caEC1E7C1B674F409514AF529aF02E67CdB56",
		decimals: 18
	},
	{
		symbol: "MAYA",
		address: "0x14468FF6b324f1C5A869e62B9C442846e7D0baf1",
		decimals: 18
	},
	{
		symbol: "MB",
		address: "0x8D8129963291740dDDd917ab01af18c7aed4BA58",
		decimals: 18
	},
	{
		symbol: "MB",
		address: "0x7aB1fc79F319718690e9c883BaC910f8E289ce8f",
		decimals: 18
	},
	{
		symbol: "MB",
		address: "0x421291c62344278642a1Ea917cDca23EfFd01416",
		decimals: 2
	},
	{
		symbol: "MBABA",
		address: "0x56aA298a19C93c6801FDde870fA63EF75Cc0aF72",
		decimals: 18
	},
	{
		symbol: "MBBASED",
		address: "0x26cF82e4aE43D31eA51e72B663d26e26a75AF729",
		decimals: 18
	},
	{
		symbol: "MBC",
		address: "0xB63ffE88c2903080cCf9AB14EfA56A11E3e01273",
		decimals: 18
	},
	{
		symbol: "MBC",
		address: "0x8888889213DD4dA823EbDD1e235b09590633C150",
		decimals: 18
	},
	{
		symbol: "MBC",
		address: "0x47aF9FD69AdC231E674140c81811a640dD92dC51",
		decimals: 8
	},
	{
		symbol: "MBCASH",
		address: "0xEfbB3F1058fd8E0C9d7204f532E17d7572AFfc3e",
		decimals: 18
	},
	{
		symbol: "MBIT",
		address: "0xAbd1f4cF6d1119895fAeD8DEA5748726f254B3b2",
		decimals: 8
	},
	{
		symbol: "MBL",
		address: "0xB879DA8b24c9b8685dE8526cF492E954f165D74b",
		decimals: 18
	},
	{
		symbol: "MBM",
		address: "0x281F5B914b0D589F8193cd5e711c6920874E00C8",
		decimals: 18
	},
	{
		symbol: "MBMT",
		address: "0x6af406c781Dba39F71184a53155e94393a0DAFc8",
		decimals: 18
	},
	{
		symbol: "MBN",
		address: "0x4Eeea7B48b9C3ac8F70a9c932A8B1E8a5CB624c7",
		decimals: 18
	},
	{
		symbol: "MBN",
		address: "0xaF80951201a0EFF85A0Fd3aDF4c7043dB856d3E6",
		decimals: 18
	},
	{
		symbol: "MBRS",
		address: "0x386467F1f3ddbE832448650418311a479EECFC57",
		decimals: 0
	},
	{
		symbol: "MBS",
		address: "0x53893a4A67D4392EBEbDf1A683E98E1C577aB6C1",
		decimals: 18
	},
	{
		symbol: "MBTC",
		address: "0x7e8C149f70437eba6785f9059190A5b08aBf03dE",
		decimals: 8
	},
	{
		symbol: "mBTC",
		address: "0x945Facb997494CC2570096c74b5F66A3507330a1",
		decimals: 18
	},
	{
		symbol: "MC",
		address: "0xA38b7EE9dF79955b90cC4E2dE90421f6Baa83A3D",
		decimals: 18
	},
	{
		symbol: "MC.CX",
		address: "0x408CEB38C21826D25e1Ebc8a6588a38B836b19a9",
		decimals: 8
	},
	{
		symbol: "MCAP",
		address: "0x93E682107d1E9defB0b5ee701C71707a4B2E46Bc",
		decimals: 8
	},
	{
		symbol: "MCB",
		address: "0x4e352cF164E64ADCBad318C3a1e222E9EBa4Ce42",
		decimals: 18
	},
	{
		symbol: "MCB",
		address: "0x03A6d45820Edb4e66e41Ece0Dc96170E875A1d16",
		decimals: 8
	},
	{
		symbol: "MCD.CX",
		address: "0x29D84dD4559fF6D5a09596b549cc01b3AF8F1E9E",
		decimals: 8
	},
	{
		symbol: "MCH",
		address: "0xA4e7414FCba1AF15203030C6daAC630df8F16AEa",
		decimals: 18
	},
	{
		symbol: "MCHP.CX",
		address: "0x3a6dbEC0218284037E8364121a5B79883D5D6F94",
		decimals: 8
	},
	{
		symbol: "MCI",
		address: "0x138A8752093F4f9a79AaeDF48d4B9248fab93c9C",
		decimals: 18
	},
	{
		symbol: "MCI",
		address: "0x3b58c52C03ca5Eb619EBa171091c86C34d603e5f",
		decimals: 9
	},
	{
		symbol: "MCM",
		address: "0x3b3801F0Fc76528E42390Df701F513fc62CbF154",
		decimals: 18
	},
	{
		symbol: "MCO",
		address: "0xB63B606Ac810a52cCa15e44bB630fd42D8d1d83d",
		decimals: 8
	},
	{
		symbol: "MCP",
		address: "0x2186Ecb39f1B765bA7d78f1C43c2E9D7Fc0C1eca",
		decimals: 18
	},
	{
		symbol: "MCR",
		address: "0x7E9e99f059BB84298332b63be6F882a73120b9FB",
		decimals: 8
	},
	{
		symbol: "MCS",
		address: "0x8C5Cc09dfc32AF3Fbe764C5Ec9fFaDa63AAdA32A",
		decimals: 18
	},
	{
		symbol: "MCT",
		address: "0x6876EbA317272FE221C67405C5e8EB3B24535547",
		decimals: 18
	},
	{
		symbol: "MCT",
		address: "0x785585878fEB8cf7cd1e3b9ecA0635464c2dD0cB",
		decimals: 18
	},
	{
		symbol: "MCTK",
		address: "0x46c76f8Be43Fd8Aa7Ce59D649A76728323b30214",
		decimals: 18
	},
	{
		symbol: "MCW",
		address: "0x33B919F54692dDbf702065763EA2b50Ca02e6bfF",
		decimals: 18
	},
	{
		symbol: "MCX",
		address: "0xd15eCDCF5Ea68e3995b2D0527A0aE0a3258302F8",
		decimals: 18
	},
	{
		symbol: "MDA",
		address: "0x51DB5Ad35C671a87207d88fC11d593AC0C8415bd",
		decimals: 18
	},
	{
		symbol: "mDAI",
		address: "0x06301057D77D54B6e14c7FafFB11Ffc7Cab4eaa7",
		decimals: 18
	},
	{
		symbol: "MDS",
		address: "0x92B7e4409dCf8C439f313eD1f05fdC0550d18DDd",
		decimals: 18
	},
	{
		symbol: "MDS",
		address: "0x66186008C1050627F979d464eABb258860563dbE",
		decimals: 18
	},
	{
		symbol: "MDT",
		address: "0x814e0908b12A99FeCf5BC101bB5d0b8B5cDf7d26",
		decimals: 18
	},
	{
		symbol: "MDT",
		address: "0x4Dfd148B532e934a2a26eA65689cf6268753e130",
		decimals: 18
	},
	{
		symbol: "MDTL",
		address: "0x625687081BA9FcbFfB0ae6bfe8D7FaD6f616f494",
		decimals: 18
	},
	{
		symbol: "MDX",
		address: "0x9d03393d297E42C135625D450C814892505F1a84",
		decimals: 18
	},
	{
		symbol: "MDX",
		address: "0x947AEb02304391f8fbE5B25D7D98D649b57b1788",
		decimals: 18
	},
	{
		symbol: "MDXT",
		address: "0xcAc67589dF40394c6F658F06A6545166c7ca6768",
		decimals: 18
	},
	{
		symbol: "MDZA",
		address: "0x0eCDd783dc7bF820614044B51862ED29714d2BA5",
		decimals: 18
	},
	{
		symbol: "MEDIBIT",
		address: "0x737fA0372c8D001904Ae6aCAf0552d4015F9c947",
		decimals: 18
	},
	{
		symbol: "MEDX",
		address: "0xfd1e80508F243E64CE234eA88A5Fd2827c71D4b7",
		decimals: 8
	},
	{
		symbol: "MEME",
		address: "0xD5525D397898e5502075Ea5E830d8914f6F0affe",
		decimals: 8
	},
	{
		symbol: "MEQ",
		address: "0x082280b4AE1A9E552555c256124De96FAb63159B",
		decimals: 18
	},
	{
		symbol: "MESG",
		address: "0x420167D87d35c3A249b32Ef6225872fBD9aB85D2",
		decimals: 18
	},
	{
		symbol: "MESH",
		address: "0x01F2AcF2914860331C1Cb1a9AcecDa7475e06Af8",
		decimals: 18
	},
	{
		symbol: "MEST",
		address: "0x5B8D43FfdE4a2982B9A5387cDF21D54Ead64Ac8d",
		decimals: 18
	},
	{
		symbol: "MET",
		address: "0xa3d58c4E56fedCae3a7c43A725aeE9A71F0ece4e",
		decimals: 18
	},
	{
		symbol: "META",
		address: "0xDE2F7766C8BF14CA67193128535E5c7454f8387C",
		decimals: 18
	},
	{
		symbol: "METH",
		address: "0x19EdFbe9814AF6eeE88289fdd789BC473e84f8F7",
		decimals: 18
	},
	{
		symbol: "METH",
		address: "0x6c158864d3B06113BFd9F5F2c219725FD5bC3923",
		decimals: 0
	},
	{
		symbol: "mETH",
		address: "0xdF9307DFf0a1B57660F60f9457D32027a55ca0B2",
		decimals: 18
	},
	{
		symbol: "METM",
		address: "0xFEF3884b603C33EF8eD4183346E093A173C94da6",
		decimals: 18
	},
	{
		symbol: "METP",
		address: "0x108D27F9c4b2A98C025c94c76Ca78c6Ce6C7A4eB",
		decimals: 18
	},
	{
		symbol: "METRIC",
		address: "0xEfc1C73A3D8728Dc4Cf2A18ac5705FE93E5914AC",
		decimals: 18
	},
	{
		symbol: "MEX",
		address: "0x2ba6b1E4424e19816382d15937739959F7DA5fD8",
		decimals: 18
	},
	{
		symbol: "MEXC",
		address: "0x7DE2d123042994737105802D2abD0A10a7BdE276",
		decimals: 18
	},
	{
		symbol: "MEXP",
		address: "0xDe201dAec04ba73166d9917Fdf08e1728E270F06",
		decimals: 18
	},
	{
		symbol: "MFBT",
		address: "0x9709bb5CE25FCd6f9786d3E4cCf422717367473C",
		decimals: 18
	},
	{
		symbol: "MFCC",
		address: "0xf45B778E53d858c79BF4DFBDD5c1bfDB426bb891",
		decimals: 18
	},
	{
		symbol: "MFCK",
		address: "0x3E6941521c85C7233632BF76e3ADB05dB8e2F1db",
		decimals: 18
	},
	{
		symbol: "MFG",
		address: "0x6710c63432A2De02954fc0f851db07146a6c0312",
		decimals: 18
	},
	{
		symbol: "MFI",
		address: "0xAa4e3edb11AFa93c41db59842b29de64b72E355B",
		decimals: 18
	},
	{
		symbol: "MFR",
		address: "0xa9aa40627C6B989F97A6656a4AD658275479361C",
		decimals: 8
	},
	{
		symbol: "MFR2",
		address: "0xbD4E39aCF23c96d68e2aB28337AE6B25441b32C2",
		decimals: 8
	},
	{
		symbol: "MFSN",
		address: "0x41f3b2B6d4d122e81834582a3f3367388dEF95cf",
		decimals: 18
	},
	{
		symbol: "MFT",
		address: "0x6b60d7285504D73DD88547cf1289c3B5528827d3",
		decimals: 18
	},
	{
		symbol: "MFT",
		address: "0xDF2C7238198Ad8B389666574f2d8bc411A4b7428",
		decimals: 18
	},
	{
		symbol: "MFTU",
		address: "0xbA745513ACEbcBb977497C569D4F7d340f2A936B",
		decimals: 18
	},
	{
		symbol: "MFTU",
		address: "0x05D412CE18F24040bB3Fa45CF2C69e506586D8e8",
		decimals: 18
	},
	{
		symbol: "MGC",
		address: "0x174BfA6600Bf90C885c7c01C7031389ed1461Ab9",
		decimals: 18
	},
	{
		symbol: "MGC",
		address: "0xa6EB54102F20095679882Db4C84E72E65Ab782A4",
		decimals: 8
	},
	{
		symbol: "MGC",
		address: "0x0BBa19f02B9fbDCa23D783cCc3f78C0A06544073",
		decimals: 18
	},
	{
		symbol: "MGM.CX",
		address: "0xaA1878e5243b86c4Ba9073f8419cCB37BfEB5631",
		decimals: 8
	},
	{
		symbol: "MGN",
		address: "0x80f222a749a2e18Eb7f676D371F19ad7EFEEe3b7",
		decimals: 18
	},
	{
		symbol: "MGO",
		address: "0x40395044Ac3c0C57051906dA938B54BD6557F212",
		decimals: 8
	},
	{
		symbol: "MGOOGL",
		address: "0x59A921Db27Dd6d4d974745B7FfC5c33932653442",
		decimals: 18
	},
	{
		symbol: "MGP",
		address: "0x8a845Fc339CeB022A695281554890429a34DF120",
		decimals: 18
	},
	{
		symbol: "MGT",
		address: "0x0cB20b77AdBe5cD58fCeCc4F4069D04b327862e5",
		decimals: 8
	},
	{
		symbol: "MGX",
		address: "0x1412f6Aa5ADC77C620715BB2a020AA690B85F68A",
		decimals: 18
	},
	{
		symbol: "MGX",
		address: "0xC79d440551A03f84f863b1f259F135794C8A7190",
		decimals: 18
	},
	{
		symbol: "MHLK",
		address: "0xE3D0a162fCc5c02C9448274D7C58E18e1811385f",
		decimals: 2
	},
	{
		symbol: "MIAU",
		address: "0x1d350417d9787E000cc1b95d70E9536DcD91F373",
		decimals: 18
	},
	{
		symbol: "MIB",
		address: "0x146D8D942048ad517479C9bab1788712Af180Fde",
		decimals: 18
	},
	{
		symbol: "MIC",
		address: "0x3A1237D38D0Fb94513f85D61679cAd7F38507242",
		decimals: 18
	},
	{
		symbol: "MIDBEAR",
		address: "0xC82abB524257C8ee4790BFDefB452b2d6a395e21",
		decimals: 18
	},
	{
		symbol: "MIDBULL",
		address: "0x59db60bD41bbC8cA4c1EfEE6Ea2A97EAe1E30cF5",
		decimals: 18
	},
	{
		symbol: "MIDDOOM",
		address: "0xFBCCADbe483adfaC499c82ac31D17965043F6174",
		decimals: 18
	},
	{
		symbol: "MIDHEDGE",
		address: "0xbEd04D5Ba351FB2a93470bEE04BabB32D7F6817c",
		decimals: 18
	},
	{
		symbol: "MIDMOON",
		address: "0x24982f160803DaCa0233661d1860de77046519a4",
		decimals: 18
	},
	{
		symbol: "MILC",
		address: "0xD717B75404022fb1C8582ADf1c66B9A553811754",
		decimals: 18
	},
	{
		symbol: "MILES",
		address: "0x01E2087BE8C34fB06229Aa9e49BF801a89d30d9D",
		decimals: 18
	},
	{
		symbol: "MILK2",
		address: "0x80c8C3dCfB854f9542567c8Dac3f44D709eBc1de",
		decimals: 18
	},
	{
		symbol: "MIMA",
		address: "0x61D71973A6FfD07d5F1095AED53b06E5673E64BC",
		decimals: 18
	},
	{
		symbol: "MIN",
		address: "0x5D64D850c8368008aFB39224E92aD0DcEFf3CF38",
		decimals: 18
	},
	{
		symbol: "MINDS",
		address: "0xB26631c6dda06aD89B93C71400D25692de89c068",
		decimals: 18
	},
	{
		symbol: "MINI",
		address: "0x4D953cf077c0C95Ba090226E59A18FcF97db44EC",
		decimals: 18
	},
	{
		symbol: "MINT",
		address: "0x0CDF9acd87E940837ff21BB40c9fd55F68bba059",
		decimals: 18
	},
	{
		symbol: "MINTY",
		address: "0xb6c6920327B33f8eeC26786c7462c5F4098D47E3",
		decimals: 18
	},
	{
		symbol: "MINX",
		address: "0xae353DaEed8DCc7a9a12027F7e070c0A50B7b6A4",
		decimals: 6
	},
	{
		symbol: "MIR",
		address: "0x09a3EcAFa817268f77BE1283176B946C4ff2E608",
		decimals: 18
	},
	{
		symbol: "MIRCO",
		address: "0x35Ea6342189b9B9D0103eC8D4E185A2C38847b68",
		decimals: 18
	},
	{
		symbol: "MIRO",
		address: "0x0168703872fa06741Ecaa9Dff7803168e83f7aE0",
		decimals: 8
	},
	{
		symbol: "MIS",
		address: "0xCD1cb16a67937ff8Af5D726e2681010cE1E9891a",
		decimals: 8
	},
	{
		symbol: "MIS",
		address: "0x4b4D2e899658FB59b1D518b68fe836B100ee8958",
		decimals: 18
	},
	{
		symbol: "MIT",
		address: "0xAd8DD4c725dE1D31b9E8F8D146089e9DC6882093",
		decimals: 6
	},
	{
		symbol: "MIT",
		address: "0xe23cd160761f63FC3a1cF78Aa034b6cdF97d3E0C",
		decimals: 18
	},
	{
		symbol: "MITH",
		address: "0x3893b9422Cd5D70a81eDeFfe3d5A1c6A978310BB",
		decimals: 18
	},
	{
		symbol: "MITX",
		address: "0x4a527d8fc13C5203AB24BA0944F4Cb14658D1Db6",
		decimals: 18
	},
	{
		symbol: "MIX",
		address: "0x5d285F735998F36631F678FF41fb56A10A4d0429",
		decimals: 18
	},
	{
		symbol: "MIXS",
		address: "0xB0BFB1E2F72511cF8b4D004852E2054d7b9a76e1",
		decimals: 18
	},
	{
		symbol: "MJ.CX",
		address: "0xB94eDB666710430803C7dE70cE7CAD553153E6E2",
		decimals: 8
	},
	{
		symbol: "MJA",
		address: "0x4b969C8c382953E18976bF9211B0Fe7A28E12172",
		decimals: 2
	},
	{
		symbol: "MKC",
		address: "0x9A3f91237408ECB94e21E4c293010347F80a136F",
		decimals: 18
	},
	{
		symbol: "MKCY",
		address: "0xF3281c539716a08c754EC4C8F2B4cEe0faB64BB9",
		decimals: 18
	},
	{
		symbol: "MKEY",
		address: "0xE154D54890c35634ca525d543ed58C741af7CF7a",
		decimals: 18
	},
	{
		symbol: "MKR",
		address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
		decimals: 18
	},
	{
		symbol: "MKR",
		address: "0xC66eA802717bFb9833400264Dd12c2bCeAa34a6d",
		decimals: 18
	},
	{
		symbol: "MKS",
		address: "0xCfF20cE22e71EcF2Ea89c86eCbD4a3CF513768c7",
		decimals: 6
	},
	{
		symbol: "MKT",
		address: "0x7939882b54fcf0bCAe6b53dEc39Ad6e806176442",
		decimals: 8
	},
	{
		symbol: "MKT",
		address: "0x16558553E4647ca500c3718C56C356eDB6F9b11C",
		decimals: 6
	},
	{
		symbol: "MKT",
		address: "0x508F36BAAc673fE9E213e69f0F75CBcFEB015917",
		decimals: 18
	},
	{
		symbol: "MLC",
		address: "0x14449dE7937fE1C1207006E92f89dEe17BbE418A",
		decimals: 18
	},
	{
		symbol: "MLC",
		address: "0x4c9a72FB706084A58653BD8BD74f8AEe0316fF5a",
		decimals: 18
	},
	{
		symbol: "MLD",
		address: "0x52E30201f31283dc5F7928b4198896083F604416",
		decimals: 18
	},
	{
		symbol: "MLGC",
		address: "0x4534492034a2cd3EAb34C8F357cD139c95b09F52",
		decimals: 0
	},
	{
		symbol: "MLN",
		address: "0xec67005c4E498Ec7f55E092bd1d35cbC47C91892",
		decimals: 18
	},
	{
		symbol: "MLR",
		address: "0xF26893f89B23084C4C6216038D6eBDBE9e96C5cb",
		decimals: 18
	},
	{
		symbol: "MM",
		address: "0xcd23Ef2cBa177A1B5f5D3818d055868E4B599d18",
		decimals: 18
	},
	{
		symbol: "MMSFT",
		address: "0x41BbEDd7286dAab5910a1f15d12CBda839852BD7",
		decimals: 18
	},
	{
		symbol: "MMT",
		address: "0x6Ef77d991Eb5306E9F235abC0Cc65925Da398aD0",
		decimals: 18
	},
	{
		symbol: "MNC",
		address: "0x9f0f1Be08591AB7d990faf910B38ed5D60e4D5Bf",
		decimals: 18
	},
	{
		symbol: "MNE",
		address: "0x426CA1eA2406c07d75Db9585F22781c096e3d0E0",
		decimals: 8
	},
	{
		symbol: "MNE",
		address: "0x1a95B271B0535D15fa49932Daba31BA612b52946",
		decimals: 8
	},
	{
		symbol: "MNFLX",
		address: "0xC8d674114bac90148d11D3C1d33C61835a0F9DCD",
		decimals: 18
	},
	{
		symbol: "MNGUZ",
		address: "0x66AF49eBAeEfed6F0F43df48142341391F3F25c1",
		decimals: 18
	},
	{
		symbol: "MNJ",
		address: "0x2dfF4c3A62cd46b692d654EF733f06e4eF704D6D",
		decimals: 18
	},
	{
		symbol: "MNK.CX",
		address: "0xdAF1FE038a05E66304a696E2d0dFD07510c8db2B",
		decimals: 8
	},
	{
		symbol: "MNMC",
		address: "0xF45091f25d374BbE956c0bb64bB85e02D07Aa741",
		decimals: 8
	},
	{
		symbol: "MNR",
		address: "0xE4E2DAf5F7F0C1c35DF922C5d9340913EDECC8e8",
		decimals: 18
	},
	{
		symbol: "MNS",
		address: "0x53884b61963351C283118a8E1Fc05BA464a11959",
		decimals: 18
	},
	{
		symbol: "MNT",
		address: "0xA9877b1e05D035899131DBd1e403825166D09f92",
		decimals: 18
	},
	{
		symbol: "MNTP",
		address: "0x83cee9e086A77e492eE0bB93C2B0437aD6fdECCc",
		decimals: 18
	},
	{
		symbol: "MOC",
		address: "0x865ec58b06bF6305B886793AA20A2da31D034E68",
		decimals: 18
	},
	{
		symbol: "MOD",
		address: "0x957c30aB0426e0C93CD8241E2c60392d08c6aC8e",
		decimals: 0
	},
	{
		symbol: "MOD",
		address: "0xEA1ea0972fa092dd463f2968F9bB51Cc4c981D71",
		decimals: 18
	},
	{
		symbol: "MODEX",
		address: "0x4bceA5E4d0F6eD53cf45e7a28FebB2d3621D7438",
		decimals: 18
	},
	{
		symbol: "MODX",
		address: "0x3c6Da7763cAA0e4b684BbC733f04a8EC08Af3762",
		decimals: 8
	},
	{
		symbol: "MOLK",
		address: "0x97Cb5Cc1b2e10cC56DC16ab9179f06dfEDBe41A2",
		decimals: 18
	},
	{
		symbol: "MOMO.CX",
		address: "0x0911d4eFeeF46726eDe1A84E196EE0589feF97A5",
		decimals: 8
	},
	{
		symbol: "MOON",
		address: "0xba7CDd0953E8f950317dda347A716f162713B226",
		decimals: 18
	},
	{
		symbol: "MOON",
		address: "0x68a3637bA6E75c0f66B61A42639c4e9fCD3D4824",
		decimals: 18
	},
	{
		symbol: "MOONDAY",
		address: "0x1ad606ADDe97c0C28bD6ac85554176bC55783c01",
		decimals: 18
	},
	{
		symbol: "MOONS",
		address: "0x260e63d91fCCC499606BAe3FE945c4ed1CF56A56",
		decimals: 18
	},
	{
		symbol: "MOONSHIT",
		address: "0xf5312DA58ab6C1706D651ED9FCd3Ca000c3a25b7",
		decimals: 18
	},
	{
		symbol: "MORE",
		address: "0x501262281B2Ba043e2fbf14904980689CDDB0C78",
		decimals: 2
	},
	{
		symbol: "MORK",
		address: "0xf552b656022c218C26dAd43ad88881Fc04116F76",
		decimals: 4
	},
	{
		symbol: "MOT",
		address: "0x263c618480DBe35C300D8d5EcDA19bbB986AcaeD",
		decimals: 18
	},
	{
		symbol: "MOV",
		address: "0x40284109c3309A7C3439111bFD93BF5E0fBB706c",
		decimals: 18
	},
	{
		symbol: "MOVI",
		address: "0x623B925b0A57a24EA8dE301F2E3E692cE903f0c3",
		decimals: 0
	},
	{
		symbol: "MOVI",
		address: "0x06F979E4F04ec565Ae8d7479a94C60dEF8846832",
		decimals: 6
	},
	{
		symbol: "MOVIE",
		address: "0x7a54Fae94B6960D9f7316612EEC179078e911769",
		decimals: 18
	},
	{
		symbol: "MOZO",
		address: "0x44bf22949F9cc84b61B9328a9d885d1b5C806b41",
		decimals: 2
	},
	{
		symbol: "MOZOX",
		address: "0xEA4931BfCf3260da6DBF0550e27f5C214E3c268b",
		decimals: 2
	},
	{
		symbol: "MPAY",
		address: "0x3810A4Ddf41E586Fa0dbA1463A7951B748cEcFca",
		decimals: 18
	},
	{
		symbol: "MPH",
		address: "0x8888801aF4d980682e47f1A9036e589479e835C5",
		decimals: 18
	},
	{
		symbol: "MPH",
		address: "0x6369c3DadfC00054A42BA8B2c09c48131dd4Aa38",
		decimals: 18
	},
	{
		symbol: "MPL",
		address: "0x218f1De2Ea9AE3e9FDEa347b6E707EbfdA2D6233",
		decimals: 18
	},
	{
		symbol: "MPS",
		address: "0x96c645D3D3706f793Ef52C19bBACe441900eD47D",
		decimals: 0
	},
	{
		symbol: "MQL",
		address: "0x428dc22668E6F3468273634067e5545ED5417A3E",
		decimals: 18
	},
	{
		symbol: "MQQQ",
		address: "0x13B02c8dE71680e71F0820c996E4bE43c2F57d15",
		decimals: 18
	},
	{
		symbol: "MQSS",
		address: "0x77b1465b0e01ba085e515324e30fEe6555C623EA",
		decimals: 18
	},
	{
		symbol: "MRC",
		address: "0xdc3228e10259494A834743260CA8340c7Ea90391",
		decimals: 18
	},
	{
		symbol: "MRCL",
		address: "0x2534409dAA29B07682020D07eAC9AE01c34ACEc0",
		decimals: 18
	},
	{
		symbol: "MRG",
		address: "0xcbee6459728019CB1f2bB971dDe2eE3271BC7617",
		decimals: 18
	},
	{
		symbol: "MRK",
		address: "0xf453B5B9d4E0B5c62ffB256BB2378cc2BC8e8a89",
		decimals: 8
	},
	{
		symbol: "MRK.CX",
		address: "0x05b4FB1A630c330feB85980d4bF0e32a96EF16C9",
		decimals: 8
	},
	{
		symbol: "MRL",
		address: "0x82125AFe01819Dff1535D0D6276d57045291B6c0",
		decimals: 18
	},
	{
		symbol: "MRO",
		address: "0x6ff313FB38d53d7A458860b1bf7512f54a03e968",
		decimals: 18
	},
	{
		symbol: "MRP",
		address: "0x21f0F0fD3141Ee9E11B3d7f13a1028CD515f459c",
		decimals: 18
	},
	{
		symbol: "MRPH",
		address: "0x7B0C06043468469967DBA22d1AF33d77d44056c8",
		decimals: 4
	},
	{
		symbol: "MRS",
		address: "0x1254E59712e6e727dC71E0E3121Ae952b2c4c3b6",
		decimals: 18
	},
	{
		symbol: "MRS",
		address: "0x9Af5A20AaC8D83230ba68542Ba29d132d50cbe08",
		decimals: 18
	},
	{
		symbol: "MRV",
		address: "0xAB6CF87a50F17d7F5E1FEaf81B6fE9FfBe8EBF84",
		decimals: 18
	},
	{
		symbol: "MRVL.CX",
		address: "0xD88dc46B9b5d1eAf9aCB5d446e96576ceB7264B8",
		decimals: 8
	},
	{
		symbol: "MSA",
		address: "0xa2B2953B35971D7F85CBE38B7dc9C42E8B1aDeF4",
		decimals: 18
	},
	{
		symbol: "MSB",
		address: "0x84c722e6F1363E8D5C6dB3eA600bEF9a006Da824",
		decimals: 18
	},
	{
		symbol: "MSDZAR",
		address: "0xEC9eE41b316b7F335274c37eF17F8e34b1171Df8",
		decimals: 18
	},
	{
		symbol: "MSFT.CX",
		address: "0x8a9E5032803fF0867F5C58e08D268C089f57CbB5",
		decimals: 8
	},
	{
		symbol: "MSG",
		address: "0xBD10EACCc4004f379B30562835668F3a74433714",
		decimals: 18
	},
	{
		symbol: "MSLV",
		address: "0x9d1555d8cB3C846Bb4f7D5B1B1080872c3166676",
		decimals: 18
	},
	{
		symbol: "MSP",
		address: "0x68AA3F232dA9bdC2343465545794ef3eEa5209BD",
		decimals: 18
	},
	{
		symbol: "MSRM",
		address: "0x1320c8c64b9f2eAa851F70702e6C9FC1EE4E8Ce4",
		decimals: 6
	},
	{
		symbol: "MST",
		address: "0x1977c795b5f52BF6f8150136b07822D1f00704F3",
		decimals: 18
	},
	{
		symbol: "MSV",
		address: "0x1A04cfe90Fb72Ed884977DBB8F77B59D95fEDBb3",
		decimals: 18
	},
	{
		symbol: "MSV",
		address: "0x3D3aB800D105fBd2F97102675A412Da3dC934357",
		decimals: 18
	},
	{
		symbol: "MT",
		address: "0x9b4e2B4B13d125238Aa0480dD42B4f6fC71b37CC",
		decimals: 18
	},
	{
		symbol: "MTA",
		address: "0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2",
		decimals: 18
	},
	{
		symbol: "MTBK",
		address: "0x1dFEc1Cf1336c572c2D2E34fe8F6Aa2F409C8251",
		decimals: 18
	},
	{
		symbol: "MTC",
		address: "0xdfdc0D82d96F8fd40ca0CFB4A288955bECEc2088",
		decimals: 18
	},
	{
		symbol: "MTC",
		address: "0x905E337c6c8645263D3521205Aa37bf4d034e745",
		decimals: 18
	},
	{
		symbol: "MTCH.CX",
		address: "0xC918B74218528f4aFA91Ff3e8Dd4B6EEd955C1A4",
		decimals: 8
	},
	{
		symbol: "MTCN",
		address: "0xF6117cC92d7247F605F11d4c942F0feda3399CB5",
		decimals: 18
	},
	{
		symbol: "MTG",
		address: "0x51726Fd6e6D264370114d15dF83dA1E13063FB0F",
		decimals: 5
	},
	{
		symbol: "MTH",
		address: "0xaF4DcE16Da2877f8c9e00544c93B62Ac40631F16",
		decimals: 5
	},
	{
		symbol: "MTL",
		address: "0xF433089366899D83a9f26A773D59ec7eCF30355e",
		decimals: 8
	},
	{
		symbol: "MTLX",
		address: "0x2e1E15C44Ffe4Df6a0cb7371CD00d5028e571d14",
		decimals: 18
	},
	{
		symbol: "MTN",
		address: "0x41dBECc1cdC5517C6f76f6a6E836aDbEe2754DE3",
		decimals: 18
	},
	{
		symbol: "MTN",
		address: "0x6BA083855c2a5b11fa557C853D73f4C215d6866c",
		decimals: 18
	},
	{
		symbol: "MTR",
		address: "0x7FC408011165760eE31bE2BF20dAf450356692Af",
		decimals: 8
	},
	{
		symbol: "MTRC",
		address: "0x1e49fF77c355A3e38D6651ce8404AF0E48c5395f",
		decimals: 18
	},
	{
		symbol: "MTSLA",
		address: "0x21cA39943E91d704678F5D00b6616650F066fD63",
		decimals: 18
	},
	{
		symbol: "MTUSD",
		address: "0x4f01eCbe8D6882FFaEe47fe23A9677A96AAbED07",
		decimals: 18
	},
	{
		symbol: "MTV",
		address: "0x8aa688AB789d1848d131C65D98CEAA8875D97eF1",
		decimals: 18
	},
	{
		symbol: "MTWTR",
		address: "0xEdb0414627E6f1e3F082DE65cD4F9C693D78CCA9",
		decimals: 18
	},
	{
		symbol: "MTX",
		address: "0x0AF44e2784637218dD1D32A322D44e603A8f0c6A",
		decimals: 18
	},
	{
		symbol: "MTX",
		address: "0x0AF44e2784637218dD1D32A322D44e603A8f0c6A",
		decimals: 18
	},
	{
		symbol: "MUFC",
		address: "0x7ed07b51975D9e8363b568B2d725bE8F3e8516CF",
		decimals: 18
	},
	{
		symbol: "MUM",
		address: "0xC9634DA9B1EEfd1CB3d88b598A91Ec69E5afe4E4",
		decimals: 0
	},
	{
		symbol: "MUSD",
		address: "0xe2f2a5C287993345a840Db3B0845fbC70f5935a5",
		decimals: 18
	},
	{
		symbol: "MUSD",
		address: "0xA52383B665b91DCe42dD4b6d1E0Fb37d3EFFe489",
		decimals: 18
	},
	{
		symbol: "mUSDC",
		address: "0x3564ad35b9E95340E5Ace2D6251dbfC76098669B",
		decimals: 6
	},
	{
		symbol: "MUSE",
		address: "0xB6Ca7399B4F9CA56FC27cBfF44F4d2e4Eef1fc81",
		decimals: 18
	},
	{
		symbol: "MUSH",
		address: "0xea6412Fb370e8d1605E6aEeAA21aD07C3C7e9F24",
		decimals: 18
	},
	{
		symbol: "MUSK",
		address: "0x5003B168b457B663c3c18FFcF5B6a24bEe8f59C7",
		decimals: 18
	},
	{
		symbol: "MUSO",
		address: "0x31c63146a635EB7465e5853020b39713AC356991",
		decimals: 18
	},
	{
		symbol: "MUST",
		address: "0x9C78EE466D6Cb57A4d01Fd887D2b5dFb2D46288f",
		decimals: 18
	},
	{
		symbol: "MUX",
		address: "0x488e4c2dC6696A04286EB204A7bDb7f99AA48D69",
		decimals: 18
	},
	{
		symbol: "MUXE",
		address: "0x515669d308f887Fd83a471C7764F5d084886D34D",
		decimals: 18
	},
	{
		symbol: "MVC",
		address: "0xB17DF9a3B09583a9bDCf757d6367171476D4D8a3",
		decimals: 18
	},
	{
		symbol: "MVC",
		address: "0x581911b360B6eB3a14eF295a83a91DC2bCE2D6f7",
		decimals: 18
	},
	{
		symbol: "MVC",
		address: "0xEbfc4Fa869A6DB3cbD6a849b5B656baE4aba68F0",
		decimals: 0
	},
	{
		symbol: "MVG",
		address: "0x71396a6410249725C5609646c4e449C6c4d41E27",
		decimals: 0
	},
	{
		symbol: "MVIXY",
		address: "0xf72FCd9DCF0190923Fadd44811E240Ef4533fc86",
		decimals: 18
	},
	{
		symbol: "MVL",
		address: "0xA849EaaE994fb86Afa73382e9Bd88c2B6b18Dc71",
		decimals: 18
	},
	{
		symbol: "MVP",
		address: "0x8a77e40936BbC27e80E9a3F526368C967869c86D",
		decimals: 18
	},
	{
		symbol: "MVT",
		address: "0x3D46454212c61ECb7b31248047Fa033120B88668",
		decimals: 18
	},
	{
		symbol: "MWAT",
		address: "0x6425c6BE902d692AE2db752B3c268AFAdb099D3b",
		decimals: 18
	},
	{
		symbol: "MWT",
		address: "0xC118ab211227a35386718804a1fD14946d42643f",
		decimals: 18
	},
	{
		symbol: "MWT",
		address: "0x82A6A22d68fFba4057d5b49F93dE5C05e4416bd1",
		decimals: 8
	},
	{
		symbol: "MX",
		address: "0x11eeF04c884E24d9B7B4760e7476D06ddF797f36",
		decimals: 18
	},
	{
		symbol: "MXC",
		address: "0x5Ca381bBfb58f0092df149bD3D243b08B9a8386e",
		decimals: 18
	},
	{
		symbol: "MXM",
		address: "0x8E766F57F7d16Ca50B4A0b90b88f6468A09b0439",
		decimals: 18
	},
	{
		symbol: "MXT",
		address: "0x6251E725CD45Fb1AF99354035a414A2C0890B929",
		decimals: 18
	},
	{
		symbol: "MXX",
		address: "0x8a6f3BF52A26a21531514E23016eEAe8Ba7e7018",
		decimals: 8
	},
	{
		symbol: "MYB",
		address: "0x5d60d8d7eF6d37E16EBABc324de3bE57f135e0BC",
		decimals: 18
	},
	{
		symbol: "MYC",
		address: "0xE1Ac9Eb7cDDAbfd9e5CA49c23bd521aFcDF8BE49",
		decimals: 18
	},
	{
		symbol: "MYD",
		address: "0xf7e983781609012307f2514f63D526D83D24F466",
		decimals: 16
	},
	{
		symbol: "MYFI",
		address: "0x0DfDD839cde95dAbF56f0b5c5698E0159138930d",
		decimals: 18
	},
	{
		symbol: "MYFI",
		address: "0x1Efb2286BF89F01488C6B2a22B2556C0f45e972b",
		decimals: 18
	},
	{
		symbol: "MYFIE",
		address: "0xCb529Ae44941500dEd968Baf9617dDeCacc6FB87",
		decimals: 8
	},
	{
		symbol: "MYO",
		address: "0x50987e6BE405ebac691f8988304562E5efc3B2ea",
		decimals: 18
	},
	{
		symbol: "MYST",
		address: "0xa645264C5603E96c3b0B078cdab68733794B0A71",
		decimals: 8
	},
	{
		symbol: "MYST",
		address: "0x4Cf89ca06ad997bC732Dc876ed2A7F26a9E7f361",
		decimals: 18
	},
	{
		symbol: "MYTH",
		address: "0x79Ef5b79dC1E6B99fA9d896779E94aE659B494F2",
		decimals: 9
	},
	{
		symbol: "MYTV",
		address: "0x45Af324F53a8D7DA1752DAd74ADc1748126D7978",
		decimals: 18
	},
	{
		symbol: "MYX",
		address: "0x2129fF6000b95A973236020BCd2b2006B0D8E019",
		decimals: 18
	},
	{
		symbol: "MZG",
		address: "0xFd0Df7B58bD53D1dd4835ecD69A703b4b26F7816",
		decimals: 18
	},
	{
		symbol: "MZK",
		address: "0x1F35a281036Be57E64e7E7A2A556b4f888A1b829",
		decimals: 18
	},
	{
		symbol: "N3RDZ",
		address: "0x32C868F6318D6334B2250F323D914Bc2239E4EeE",
		decimals: 18
	},
	{
		symbol: "NAC",
		address: "0x8d80de8A78198396329dfA769aD54d24bF90E7aa",
		decimals: 18
	},
	{
		symbol: "NAER",
		address: "0x3fE856E55C4076682400f23d6bE7dd737ee7E947",
		decimals: 8
	},
	{
		symbol: "NAMTC",
		address: "0xA79e0012bb3379f8509a5ab49caB7e6Abb49701D",
		decimals: 18
	},
	{
		symbol: "NAMTT",
		address: "0x9025f9A59694dd939739e05beB2502a567e8326f",
		decimals: 18
	},
	{
		symbol: "NANJ",
		address: "0xFFE02ee4C69eDf1b340fCaD64fbd6b37a7b9e265",
		decimals: 8
	},
	{
		symbol: "NAOS",
		address: "0x4a615bB7166210CCe20E6642a6f8Fb5d4D044496",
		decimals: 18
	},
	{
		symbol: "NAS",
		address: "0x5d65D971895Edc438f465c17DB6992698a52318D",
		decimals: 18
	},
	{
		symbol: "NAT",
		address: "0x90D46A9636B973f18186541d1B04ed3621a49Cb0",
		decimals: 18
	},
	{
		symbol: "NAT",
		address: "0xEcb79A9B7559168174c41B153997BC462B6dFE4e",
		decimals: 18
	},
	{
		symbol: "NAVI",
		address: "0x588047365dF5BA589F923604AAC23d673555c623",
		decimals: 18
	},
	{
		symbol: "NAVY",
		address: "0xc15A399c4eA7815fE36857C9E290EE452A5D6B21",
		decimals: 18
	},
	{
		symbol: "NB",
		address: "0x82622209cEf6EBf4b8BDB353a8FC7e0b8655D0b0",
		decimals: 0
	},
	{
		symbol: "NBAI",
		address: "0x17f8aFB63DfcDcC90ebE6e84F060Cc306A98257D",
		decimals: 18
	},
	{
		symbol: "NBC",
		address: "0x9F195617fA8fbAD9540C5D113A99A0a0172aaEDC",
		decimals: 18
	},
	{
		symbol: "NBT",
		address: "0x0574586d9C3741C638998434cEA480C67e4aA88f",
		decimals: 8
	},
	{
		symbol: "NC",
		address: "0x9e176aD338d72DDA4b3434A2A9DAa598b08fA5c5",
		decimals: 18
	},
	{
		symbol: "NCA",
		address: "0x3C04FF86492Ce16CcB306AcB9226a1064CaFAd07",
		decimals: 6
	},
	{
		symbol: "NCASH",
		address: "0x809826cceAb68c387726af962713b64Cb5Cb3CCA",
		decimals: 18
	},
	{
		symbol: "NCC",
		address: "0x9344b383b1D59b5ce3468B234DAB43C7190ba735",
		decimals: 18
	},
	{
		symbol: "NCC",
		address: "0x5d48F293BaED247A2D0189058bA37aa238bD4725",
		decimals: 18
	},
	{
		symbol: "NCDT",
		address: "0xE0C8b298db4cfFE05d1bEA0bb1BA414522B33C1B",
		decimals: 18
	},
	{
		symbol: "NCLH.CX",
		address: "0x82BDdf734Bea7f551d664dD23644F451B3C6E87f",
		decimals: 8
	},
	{
		symbol: "NCOV",
		address: "0xb80112E516DAbcaC6Ab4665f1BD650996403156C",
		decimals: 18
	},
	{
		symbol: "NCOV",
		address: "0x10Ef64cb79Fd4d75d4Aa7e8502d95C42124e434b",
		decimals: 18
	},
	{
		symbol: "NCT",
		address: "0x9E46A38F5DaaBe8683E10793b06749EEF7D733d1",
		decimals: 18
	},
	{
		symbol: "NDA.CX",
		address: "0x4441306a9A611FD6c6305Dbf5182466655942CD6",
		decimals: 8
	},
	{
		symbol: "NDC",
		address: "0xA54ddC7B3CcE7FC8b1E3Fa0256D0DB80D2c10970",
		decimals: 18
	},
	{
		symbol: "NDIO",
		address: "0x405Dd8FcA636282aB5EE47B88036A7256fD29b31",
		decimals: 18
	},
	{
		symbol: "NDN",
		address: "0x6Ec47a178A9d50d4ec4683003d8324f19Ca35382",
		decimals: 18
	},
	{
		symbol: "NDX",
		address: "0x1966d718A565566e8E202792658D7b5Ff4ECe469",
		decimals: 18
	},
	{
		symbol: "NDXM.CX",
		address: "0x3299842aa08B85c5c68DD432f2e7922EeF60EEE8",
		decimals: 8
	},
	{
		symbol: "NEAL",
		address: "0xAcCe88F5A63A5e65DB9AA7303720bE16b556E751",
		decimals: 18
	},
	{
		symbol: "NEBO",
		address: "0x7f0c8B125040f707441cad9e5eD8a8408673b455",
		decimals: 18
	},
	{
		symbol: "NEC",
		address: "0xCc80C051057B774cD75067Dc48f8987C4Eb97A5e",
		decimals: 18
	},
	{
		symbol: "NECOS",
		address: "0x6e55027CAe60cfdB7BACA78f3e6514aEE716fCf9",
		decimals: 5
	},
	{
		symbol: "NEE.CX",
		address: "0x0cDa1454BdA46DF7f8593286c4aab856BE803518",
		decimals: 8
	},
	{
		symbol: "NEEO",
		address: "0xd8446236FA95b9b5f9fd0f8E7Df1a944823c683d",
		decimals: 18
	},
	{
		symbol: "NEET",
		address: "0x34D18AAC981D3C93e649814A5ECA79e296411b65",
		decimals: 18
	},
	{
		symbol: "NEM.CX",
		address: "0x9730EeEE01d9068E8c37fc2E92045295a617B329",
		decimals: 8
	},
	{
		symbol: "NEST",
		address: "0x04abEdA201850aC0124161F037Efd70c74ddC74C",
		decimals: 18
	},
	{
		symbol: "NET",
		address: "0xcfb98637bcae43C13323EAa1731cED2B716962fD",
		decimals: 18
	},
	{
		symbol: "NET.CX",
		address: "0x3ea9Fb5d766458e8eeC3C2d6434e14c484d03db7",
		decimals: 8
	},
	{
		symbol: "NEU",
		address: "0xA823E6722006afe99E91c30FF5295052fe6b8E32",
		decimals: 18
	},
	{
		symbol: "NEWB",
		address: "0x814964b1bceAf24e26296D031EaDf134a2Ca4105",
		decimals: 0
	},
	{
		symbol: "NEWOS",
		address: "0x29536B7Ca7029b5cDDEB03c0451715615AcA35ba",
		decimals: 8
	},
	{
		symbol: "NEX",
		address: "0xE2dc070524A6e305ddB64d8513DC444B6a1ec845",
		decimals: 8
	},
	{
		symbol: "NEXE",
		address: "0x5C2aAfDBbB24dA45C48DD4d74B2252a44A6Be6d7",
		decimals: 18
	},
	{
		symbol: "NEXE",
		address: "0xd9F7DEaeB3450cd698FD6d45a7B05A18D84BB1e1",
		decimals: 18
	},
	{
		symbol: "NEXO",
		address: "0xB62132e35a6c13ee1EE0f84dC5d40bad8d815206",
		decimals: 18
	},
	{
		symbol: "NEXT",
		address: "0x377d552914E7A104bC22B4F3B6268dDC69615Be7",
		decimals: 18
	},
	{
		symbol: "NEXXO",
		address: "0x278a83B64C3e3E1139f8E8A52D96360cA3c69A3D",
		decimals: 18
	},
	{
		symbol: "NFC",
		address: "0xb0866289e870D2efc282406cF4123Df6E5BcB652",
		decimals: 18
	},
	{
		symbol: "NFLX.CX",
		address: "0x0A3Dc37762f0102175fD43d3871D7FA855626146",
		decimals: 8
	},
	{
		symbol: "NFT",
		address: "0xcB8d1260F9c92A3A545d409466280fFdD7AF7042",
		decimals: 18
	},
	{
		symbol: "NFT",
		address: "0xE3BEbAAfa32767A7eE6102664079F11801586E1C",
		decimals: 18
	},
	{
		symbol: "NFTX",
		address: "0x87d73E916D7057945c9BcD8cdd94e42A6F47f776",
		decimals: 18
	},
	{
		symbol: "NFX",
		address: "0x19F3E6521f73a0184Cc171c8ccBE1e21F93f4b3b",
		decimals: 18
	},
	{
		symbol: "NFXC",
		address: "0x2D39EC4da54329D28d230B4973F5Aa27886C3AeE",
		decimals: 18
	},
	{
		symbol: "NFY",
		address: "0x1cBb83EbcD552D5EBf8131eF8c9CD9d9BAB342bC",
		decimals: 18
	},
	{
		symbol: "NGC",
		address: "0x72dD4b6bd852A3AA172Be4d6C5a6dbEc588cf131",
		decimals: 18
	},
	{
		symbol: "NGOT",
		address: "0x1EbD8d3Ca115451b9B6BbaA7Ee2F7B0F96E49fD8",
		decimals: 5
	},
	{
		symbol: "NIF",
		address: "0x7e291890B01E5181f7ecC98D79ffBe12Ad23df9e",
		decimals: 18
	},
	{
		symbol: "NIMFA",
		address: "0xe26517A9967299453d3F1B48Aa005E6127e67210",
		decimals: 18
	},
	{
		symbol: "NIO",
		address: "0xCc2AD789f459Bc73e5Fb33364964B658a62C1Ee7",
		decimals: 8
	},
	{
		symbol: "NIO",
		address: "0x5554e04e76533E1d14c52f05beEF6c9d329E1E30",
		decimals: 0
	},
	{
		symbol: "NIOX",
		address: "0xc813EA5e3b48BEbeedb796ab42A30C5599b01740",
		decimals: 4
	},
	{
		symbol: "NIOX",
		address: "0x9cEc335cf6922eeb5A563C871D1F09f2cf264230",
		decimals: 4
	},
	{
		symbol: "NIUMC",
		address: "0xB901351bB846FeD866554945b22cbdd38A3DF1d1",
		decimals: 18
	},
	{
		symbol: "NIX",
		address: "0xcCF4FE6Ac4B53193457e6eAD1A2B92E78F4dD8A0",
		decimals: 18
	},
	{
		symbol: "NJBC",
		address: "0x3635e381C67252405c1C0E550973155832d5E490",
		decimals: 18
	},
	{
		symbol: "NKCL",
		address: "0x5378A8BFE52592fCF436dfbe3cd389C494706C5F",
		decimals: 18
	},
	{
		symbol: "NKE.CX",
		address: "0x0fDc3b843D26F4290597223BbAf24C460091B0C8",
		decimals: 8
	},
	{
		symbol: "NKN",
		address: "0x5Cf04716BA20127F1E2297AdDCf4B5035000c9eb",
		decimals: 18
	},
	{
		symbol: "NKTR.CX",
		address: "0xd1e4dEb6d4CEe49e4C721aAba13c7d6b4a12Ce73",
		decimals: 8
	},
	{
		symbol: "NL25.CX",
		address: "0xD2Ae2619ed65bfE3A421F1f250f21E899f0dC086",
		decimals: 8
	},
	{
		symbol: "NLD",
		address: "0x48E234d2Ddcb32d780971c0Df7fDDe25Bba192DE",
		decimals: 18
	},
	{
		symbol: "NLINK",
		address: "0x493c8d6a973246a7B26Aa8Ef4b1494867A825DE5",
		decimals: 3
	},
	{
		symbol: "NLM",
		address: "0xA30C7cDac7d8505F32Bb0930Ed82B9Ba5777b5F3",
		decimals: 18
	},
	{
		symbol: "NLOK.CX",
		address: "0x3d6826939286211d1e0E20351F669c642Ff64D47",
		decimals: 8
	},
	{
		symbol: "NLYA",
		address: "0xCeE4019Fd41ECDc8bae9EFDd20510f4b6FAA6197",
		decimals: 18
	},
	{
		symbol: "NMR",
		address: "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671",
		decimals: 18
	},
	{
		symbol: "NOAH",
		address: "0x58a4884182d9E835597f405e5F258290E46ae7C2",
		decimals: 18
	},
	{
		symbol: "NOAHP",
		address: "0x41b3F18c6384Dc9A39c33AFEcA60d9b8e61eAa9F",
		decimals: 18
	},
	{
		symbol: "NOBS",
		address: "0xF4FaEa455575354d2699BC209B0a65CA99F69982",
		decimals: 18
	},
	{
		symbol: "NODE",
		address: "0x0C3eF32f802967DB75B9D49fE1e76620151cCB81",
		decimals: 5
	},
	{
		symbol: "NODE",
		address: "0x435d664F72D6F194ef67d63B5f3936650187b131",
		decimals: 18
	},
	{
		symbol: "NOIA",
		address: "0x22E3c3A3BdA39C897a48257bC822e7466F171729",
		decimals: 18
	},
	{
		symbol: "NOIA",
		address: "0xa8c8CfB141A3bB59FEA1E2ea6B79b5ECBCD7b6ca",
		decimals: 18
	},
	{
		symbol: "NOIA",
		address: "0xfc858154C0b2c4A3323046Fb505811F110EBdA57",
		decimals: 18
	},
	{
		symbol: "NOIZ",
		address: "0x36151737B45017234E9570Cf9a1cAc97138953C2",
		decimals: 18
	},
	{
		symbol: "NOODLE",
		address: "0x420Ab548B18911717Ed7C4CCBF46371EA758458C",
		decimals: 18
	},
	{
		symbol: "NOTRUMP",
		address: "0x40ce0A1D8F4999807b92ec266a025F071814b15d",
		decimals: 18
	},
	{
		symbol: "NOW.CX",
		address: "0x1AeE70cf78587dDC593DEDB311BC87851b16B914",
		decimals: 8
	},
	{
		symbol: "NOX",
		address: "0xeC46f8207D766012454c408De210BCBc2243E71c",
		decimals: 18
	},
	{
		symbol: "NP5",
		address: "0x74cE17209d3a7cd057BeB1Ce1BaB705e17b164F7",
		decimals: 18
	},
	{
		symbol: "NPER",
		address: "0x4cE6B362Bc77A24966Dda9078f9cEF81b3B886a7",
		decimals: 18
	},
	{
		symbol: "NPLC",
		address: "0x97fB6Fc2AD532033Af97043B563131C5204F8A35",
		decimals: 18
	},
	{
		symbol: "NPX",
		address: "0x28b5E12CcE51f15594B0b91d5b5AdaA70F684a02",
		decimals: 2
	},
	{
		symbol: "NPXS",
		address: "0xA15C7Ebe1f07CaF6bFF097D8a589fb8AC49Ae5B3",
		decimals: 18
	},
	{
		symbol: "NRM",
		address: "0x000000085824F23a070c2474442ED014c0e46B58",
		decimals: 18
	},
	{
		symbol: "NRP",
		address: "0x3918C42F14F2eB1168365F911f63E540E5A306b5",
		decimals: 8
	},
	{
		symbol: "NRV",
		address: "0x768386990688B293226B9f83465974003B5e40D7",
		decimals: 18
	},
	{
		symbol: "NSC",
		address: "0x184c280E3450BD59B0dF35ba7fcE3aae3f353b83",
		decimals: 8
	},
	{
		symbol: "NSE",
		address: "0x81361BA977b6e214E905D4e03c65557b757240D9",
		decimals: 8
	},
	{
		symbol: "NSRT",
		address: "0xfF340f03E226B669c873516755a6B88a45b0B2aC",
		decimals: 18
	},
	{
		symbol: "NSS",
		address: "0x4E3Bddd468AbfC6C88bc25dAA5d894380CEd5bc8",
		decimals: 18
	},
	{
		symbol: "NST",
		address: "0xD89040Ac9823B72F64d71f66Fa2DeAE7C8520671",
		decimals: 18
	},
	{
		symbol: "NSURE",
		address: "0x20945cA1df56D237fD40036d47E866C7DcCD2114",
		decimals: 18
	},
	{
		symbol: "NTC",
		address: "0x8d5A69dc82a47594881256F2eef81770274fA30f",
		decimals: 18
	},
	{
		symbol: "NTER",
		address: "0x462Edaa6c1339F98Bcb59582Af782326603DF5f2",
		decimals: 18
	},
	{
		symbol: "NTES.CX",
		address: "0xFa2AadAad9E258ea845426822bCF47488CE8420C",
		decimals: 8
	},
	{
		symbol: "NTK",
		address: "0x69BEaB403438253f13b6e92Db91F7FB849258263",
		decimals: 18
	},
	{
		symbol: "NTK",
		address: "0x5D4d57cd06Fa7fe99e26fdc481b468f77f05073C",
		decimals: 18
	},
	{
		symbol: "NTO",
		address: "0x8A99ED8a1b204903Ee46e733f2c1286F6d20b177",
		decimals: 18
	},
	{
		symbol: "NTP",
		address: "0x58a2263f77e1B23A74A3D99b9D01506DA308800b",
		decimals: 8
	},
	{
		symbol: "NTR",
		address: "0x11B79147AB4aF4C6C1785cf23672a2E3E5Ba24a4",
		decimals: 18
	},
	{
		symbol: "NTRS",
		address: "0xeCcf15A4B5976a1365BAeD5297058B4cA42777C0",
		decimals: 18
	},
	{
		symbol: "NTRT",
		address: "0xEdc1A631d4C3d0F554da14a4BCe630f6CBC30A68",
		decimals: 8
	},
	{
		symbol: "NTRUMP",
		address: "0x44Ea84a85616F8e9cD719Fc843DE31D852ad7240",
		decimals: 15
	},
	{
		symbol: "NTS",
		address: "0x3dfeaF13a6615e560Aecc5648Ace8FA50d7cF6bF",
		decimals: 12
	},
	{
		symbol: "NTWK",
		address: "0x2233799Ee2683d75dfefAcbCd2A26c78D34b470d",
		decimals: 18
	},
	{
		symbol: "NU",
		address: "0x4fE83213D56308330EC302a8BD641f1d0113A4Cc",
		decimals: 18
	},
	{
		symbol: "NUG",
		address: "0x245ef47D4d0505ECF3Ac463F4d81f41ADE8f1fd1",
		decimals: 18
	},
	{
		symbol: "NUK",
		address: "0x9E12c837159deDc233719EDf5A4eC2405644E8a7",
		decimals: 3
	},
	{
		symbol: "NUKE",
		address: "0xc58c0Fca06908E66540102356f2E91edCaEB8D81",
		decimals: 18
	},
	{
		symbol: "NULS",
		address: "0xB91318F35Bdb262E9423Bc7c7c2A3A93DD93C92C",
		decimals: 18
	},
	{
		symbol: "NUMA",
		address: "0x303D396bB1E2A73b1536665964aa9f5AA0f7f9cA",
		decimals: 0
	},
	{
		symbol: "NUSD",
		address: "0x0C6144c16af288948C8fdB37fD8fEc94bfF3d1d9",
		decimals: 6
	},
	{
		symbol: "NUT",
		address: "0xaB622b253e441928aFfa6E2EFb2F0F9A8bF6890d",
		decimals: 4
	},
	{
		symbol: "NUTS",
		address: "0x84294FC9710e1252d407d3D80A84bC39001bd4A8",
		decimals: 18
	},
	{
		symbol: "NUVO",
		address: "0xE2Db94E8D4E4144c336e45668a792D17D48a482c",
		decimals: 18
	},
	{
		symbol: "NVA",
		address: "0x38F7Cd43662D1cfF4CC3c2C4b749F7cfEd1d1DB3",
		decimals: 18
	},
	{
		symbol: "NVDA.CX",
		address: "0xF4490981a99019D9FF07e000b9B00238f399B04B",
		decimals: 8
	},
	{
		symbol: "NVT",
		address: "0x7b6F71c8B123b38aa8099e0098bEC7fbc35B8a13",
		decimals: 8
	},
	{
		symbol: "NVT",
		address: "0x09D8b66C48424324b25754A873e290caE5dca439",
		decimals: 18
	},
	{
		symbol: "NVZN",
		address: "0x99963EE76C886fc43D5063428fF8F926E8A50985",
		decimals: 18
	},
	{
		symbol: "NXC",
		address: "0x45e42D659D9f9466cD5DF622506033145a9b89Bc",
		decimals: 3
	},
	{
		symbol: "NXC",
		address: "0x93Ec2b9D85a7F4b0Abc66abf4CA8d5E50C355516",
		decimals: 18
	},
	{
		symbol: "NXCT",
		address: "0x41Ab75435668919Bb507F871dd01E9762C2D173a",
		decimals: 18
	},
	{
		symbol: "NXM",
		address: "0xd7c49CEE7E9188cCa6AD8FF264C1DA2e69D4Cf3B",
		decimals: 18
	},
	{
		symbol: "NXX",
		address: "0x5c6183d10A00CD747a6Dbb5F658aD514383e9419",
		decimals: 8
	},
	{
		symbol: "NXX",
		address: "0x7627de4B93263a6a7570b8dAfa64bae812e5c394",
		decimals: 8
	},
	{
		symbol: "NXY",
		address: "0x49DE436eA25Be263cB3E8ff1401931C6F9B70660",
		decimals: 18
	},
	{
		symbol: "NXZ",
		address: "0x63e66571a6936B23e03b82A44306409D9f0aFe32",
		decimals: 18
	},
	{
		symbol: "NYAN",
		address: "0xC9cE70A381910D0a90B30d408CC9C7705ee882de",
		decimals: 18
	},
	{
		symbol: "NYB",
		address: "0x798A9055a98913835bBFb45a0BbC209438dcFD97",
		decimals: 18
	},
	{
		symbol: "NYN",
		address: "0x5b52b324fC10cB43B9eeADaf9bd15afb98867942",
		decimals: 18
	},
	{
		symbol: "NYOMI",
		address: "0xe09f5A388d4Ec73DB7Bcac6594A9a699C54cA80B",
		decimals: 18
	},
	{
		symbol: "NZDX",
		address: "0x6871799A4866BB9068B36B7A9bB93475AC77AC5D",
		decimals: 18
	},
	{
		symbol: "NZE",
		address: "0x47BA0689fbd72936749b007d18dFB75d34bF241B",
		decimals: 8
	},
	{
		symbol: "NZO",
		address: "0x94eea9a484F0BaE03D19623cfe389E2CBA56B72F",
		decimals: 18
	},
	{
		symbol: "OA",
		address: "0x534479D1F4E31bC8F3265009b2B05f89DC3B9aF1",
		decimals: 8
	},
	{
		symbol: "OAK",
		address: "0x5e888B83B7287EED4fB7DA7b7d0A0D4c735d94b3",
		decimals: 18
	},
	{
		symbol: "OAP",
		address: "0x1788430620960F9a70e3DC14202a3A35ddE1A316",
		decimals: 18
	},
	{
		symbol: "OAS",
		address: "0x877f2558cdfe1953606aC8c13Ba262007fFd8F1E",
		decimals: 18
	},
	{
		symbol: "OAS.CX",
		address: "0xC7F77384B416B68d6ae1ddc3ED55bA2797e3B7f2",
		decimals: 8
	},
	{
		symbol: "OATH",
		address: "0x19C9872640eC38c2Cf36C0F04d1365Ef067869B3",
		decimals: 18
	},
	{
		symbol: "OAX",
		address: "0x701C244b988a513c945973dEFA05de933b23Fe1D",
		decimals: 18
	},
	{
		symbol: "OBE",
		address: "0xa497A35C26d019b61fF05ad090323bc8690a1ECd",
		decimals: 18
	},
	{
		symbol: "OBSR",
		address: "0x87DEF9265B40ba7F867f73d4Af519CD9f074BeD6",
		decimals: 8
	},
	{
		symbol: "OBTC",
		address: "0x8064d9Ae6cDf087b1bcd5BDf3531bD5d8C537a68",
		decimals: 18
	},
	{
		symbol: "OBTC",
		address: "0x8fC01E6CbDfFaf09B54F423f9Bb1F856b22e47b2",
		decimals: 8
	},
	{
		symbol: "OCC",
		address: "0x2F109021aFe75B949429fe30523Ee7C0D5B27207",
		decimals: 18
	},
	{
		symbol: "OCC",
		address: "0x0235fE624e044A05eeD7A43E16E3083bc8A4287A",
		decimals: 18
	},
	{
		symbol: "OCDAI",
		address: "0x98CC3BD6Af1880fcfDa17ac477B2F612980e5e33",
		decimals: 8
	},
	{
		symbol: "OCEAN",
		address: "0x985dd3D42De1e256d09e1c10F112bCCB8015AD41",
		decimals: 18
	},
	{
		symbol: "OCEAN",
		address: "0x967da4048cD07aB37855c090aAF366e4ce1b9F48",
		decimals: 18
	},
	{
		symbol: "OCFT.CX",
		address: "0xc4621CB2E5E6fF8252e25dbc8E4E6EE34AFA0C9c",
		decimals: 8
	},
	{
		symbol: "OCG",
		address: "0xD84958Efa6fE4e6F29457917a9aB1bBc1b542995",
		decimals: 9
	},
	{
		symbol: "OCN",
		address: "0x4092678e4E78230F46A1534C0fbc8fA39780892B",
		decimals: 18
	},
	{
		symbol: "OCRV",
		address: "0x4BA8C6Ce0e855C051e65DfC37883360efAf7c82B",
		decimals: 15
	},
	{
		symbol: "OCTO",
		address: "0x7240aC91f01233BaAf8b064248E80feaA5912BA3",
		decimals: 18
	},
	{
		symbol: "OCUSDC",
		address: "0x8ED9f862363fFdFD3a07546e618214b6D59F03d4",
		decimals: 8
	},
	{
		symbol: "ODC",
		address: "0x70438034810b12798b1568b9D72792E073919a12",
		decimals: 18
	},
	{
		symbol: "ODC",
		address: "0x49e90537D5eF6778fd000D1F05be20134F9f6dC6",
		decimals: 8
	},
	{
		symbol: "ODDZ",
		address: "0xCd2828fc4D8E8a0eDe91bB38CF64B1a81De65Bf6",
		decimals: 18
	},
	{
		symbol: "ODE",
		address: "0xbf52F2ab39e26E0951d2a02b49B7702aBe30406a",
		decimals: 18
	},
	{
		symbol: "ODEX",
		address: "0xa960d2bA7000d58773E7fa5754DeC3Bb40A069D5",
		decimals: 18
	},
	{
		symbol: "ODIN",
		address: "0x57c8D5d5b87A1580FDAF996cEF674Bb0d7F14C98",
		decimals: 18
	},
	{
		symbol: "OEC",
		address: "0x31ed1bc96FA75Ee33d513A0CeF4b65c2500b320b",
		decimals: 18
	},
	{
		symbol: "OEN",
		address: "0x93E3ea31a74209Daf3FcBd8A4013236B8e21559F",
		decimals: 18
	},
	{
		symbol: "OEX",
		address: "0x770192738485d4794f4222E49501f31e85814cEC",
		decimals: 18
	},
	{
		symbol: "OFBC",
		address: "0x4d7FD9F3FeCb85E4cD68ffDA1eF3015E3d3b8DFE",
		decimals: 2
	},
	{
		symbol: "OFT",
		address: "0xc0A25a24CcE412E2Fb407c08E3785437FEE9Ad1d",
		decimals: 18
	},
	{
		symbol: "OG",
		address: "0x8a4491936a8e5A1662c8a755932b83dBE9634b0d",
		decimals: 18
	},
	{
		symbol: "OGK",
		address: "0x5f4506dB5b568e103532F84d32A285cDd5Aa5751",
		decimals: 10
	},
	{
		symbol: "OGN",
		address: "0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26",
		decimals: 18
	},
	{
		symbol: "OGO",
		address: "0xFF0E5e014cf97e0615cb50F6f39Da6388E2FaE6E",
		decimals: 18
	},
	{
		symbol: "OGODS",
		address: "0x1051a014E4b3F2bD08E5A7e52522f0F71628162B",
		decimals: 18
	},
	{
		symbol: "OGZD.CX",
		address: "0xc1e83478BFa1F590A75d3477dbcb995aa2A142dd",
		decimals: 8
	},
	{
		symbol: "OHL.CX",
		address: "0xfe3A103054E73DCE81673EBd6C5b3740AC2B8B40",
		decimals: 8
	},
	{
		symbol: "OHM",
		address: "0x383518188C0C6d7730D91b2c03a03C837814a899",
		decimals: 9
	},
	{
		symbol: "OHNI",
		address: "0x6f539a9456A5BCb6334A1A41207c3788f5825207",
		decimals: 18
	},
	{
		symbol: "OIKOS",
		address: "0x21E13cB3F3F26f92A62ac7Adab4093e8997D1fb1",
		decimals: 2
	},
	{
		symbol: "OIL",
		address: "0xaE6eb6F6c0A1694968b9f78a4316319C27B0964b",
		decimals: 18
	},
	{
		symbol: "OIL",
		address: "0x0275E1001e293C46CFe158B3702AADe0B99f88a5",
		decimals: 18
	},
	{
		symbol: "OIN",
		address: "0x9aeB50f542050172359A0e1a25a9933Bc8c01259",
		decimals: 8
	},
	{
		symbol: "OIO",
		address: "0xa3Efef1a1e3d1AD72b9D0f4253e7c9c084C2c08B",
		decimals: 18
	},
	{
		symbol: "OKB",
		address: "0x75231F58b43240C9718Dd58B4967c5114342a86c",
		decimals: 18
	},
	{
		symbol: "OKBBEAR",
		address: "0x053E5BA7Cb9669Dcc2fEb2D0E1d3d4a0AD6aaE39",
		decimals: 18
	},
	{
		symbol: "OKBBULL",
		address: "0x8aF785687ee8D75114B028997c9ca36b5CC67Bc4",
		decimals: 18
	},
	{
		symbol: "OKBDOOM",
		address: "0x2474cA2e5A1cE0cA904Ca512530C2555048603bE",
		decimals: 18
	},
	{
		symbol: "OKBHEDGE",
		address: "0x889BC62E94bb6902D022bB82B38f7FCd637Df28C",
		decimals: 18
	},
	{
		symbol: "OKBMOON",
		address: "0xA160D857FcEd9436A57C6A405b2f379aCEB83186",
		decimals: 18
	},
	{
		symbol: "OKG",
		address: "0x5fB1bBFbDBBB26E4D51A47B1765CC6272Ebb31E4",
		decimals: 18
	},
	{
		symbol: "OKNC",
		address: "0x0228528581c01A303d59d8CF6b72BD5A5D219458",
		decimals: 4
	},
	{
		symbol: "OKU",
		address: "0x6f9cFda542DB28ECdF3C18b5c40Ed394d7adBA47",
		decimals: 18
	},
	{
		symbol: "OLDNII",
		address: "0xAc4f2f204b38390b92D0540908447d5ed352799a",
		decimals: 15
	},
	{
		symbol: "OLE",
		address: "0x9d9223436dDD466FC247e9dbbD20207e640fEf58",
		decimals: 18
	},
	{
		symbol: "OLT",
		address: "0x64A60493D888728Cf42616e034a0dfEAe38EFCF0",
		decimals: 18
	},
	{
		symbol: "OLY",
		address: "0x6595b8fD9C920C81500dCa94e53Cdc712513Fb1f",
		decimals: 18
	},
	{
		symbol: "OM",
		address: "0x3593D125a4f7849a1B059E64F4517A86Dd60c95d",
		decimals: 18
	},
	{
		symbol: "OM",
		address: "0x2baEcDf43734F22FD5c152DB08E3C27233F0c7d2",
		decimals: 18
	},
	{
		symbol: "OMC",
		address: "0xd6bD97a26232bA02172Ff86b055d5D7bE789335B",
		decimals: 18
	},
	{
		symbol: "OMG",
		address: "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07",
		decimals: 18
	},
	{
		symbol: "OML",
		address: "0x224DB5E6180761df4C3d8936585f6b8b83879770",
		decimals: 18
	},
	{
		symbol: "OMNES",
		address: "0xc29004Ab38334dc7A9ecA1b89d6D4BF9f564d5Cf",
		decimals: 18
	},
	{
		symbol: "OMX",
		address: "0xB5DBC6D3cf380079dF3b27135664b6BCF45D1869",
		decimals: 8
	},
	{
		symbol: "ON",
		address: "0x3b4cAAAF6F3ce5Bee2871C89987cbd825Ac30822",
		decimals: 18
	},
	{
		symbol: "ONC",
		address: "0xD90E69f67203EBE02c917B5128629E77B4cd92dc",
		decimals: 18
	},
	{
		symbol: "ONE",
		address: "0x946551DD05C5Abd7CC808927480225ce36D8c475",
		decimals: 18
	},
	{
		symbol: "ONE",
		address: "0x4D807509aECe24C0fa5A102b6a3B059Ec6E14392",
		decimals: 18
	},
	{
		symbol: "ONEK",
		address: "0xB23be73573bC7E03DB6e5dfc62405368716d28a8",
		decimals: 18
	},
	{
		symbol: "ONEM.CX",
		address: "0x56f71ce60B10192901E97F281D2F230EB5Ab27AA",
		decimals: 8
	},
	{
		symbol: "ONES",
		address: "0x0B342C51d1592C41068d5D4b4DA4A68C0a04d5A4",
		decimals: 18
	},
	{
		symbol: "ONEZ",
		address: "0x12419EEA0B053FfeA92f9afcD7986a495E2CF0Dd",
		decimals: 18
	},
	{
		symbol: "ONG",
		address: "0xd341d1680Eeee3255b8C4c75bCCE7EB57f144dAe",
		decimals: 18
	},
	{
		symbol: "ONIGIRI",
		address: "0xcf9c692F7e62Af3c571D4173fd4ABf9A3E5330D0",
		decimals: 18
	},
	{
		symbol: "ONIT",
		address: "0x410e731c2970Dce3AdD351064AcF5cE9E33FDBf0",
		decimals: 18
	},
	{
		symbol: "ONL",
		address: "0x6863bE0e7CF7ce860A574760e9020D519a8bDC47",
		decimals: 18
	},
	{
		symbol: "ONLEXPA",
		address: "0x33384af34b03eaCA63FD153F59589F504772b570",
		decimals: 18
	},
	{
		symbol: "ONLY",
		address: "0x9eeC65E5b998dB6845321BaA915eC3338B1a469B",
		decimals: 18
	},
	{
		symbol: "ONOT",
		address: "0xB31C219959E06f9aFBeB36b388a4BaD13E802725",
		decimals: 18
	},
	{
		symbol: "ONS",
		address: "0x5BB29c33C4A3C29f56F8ACa40B4dB91d8a5fe2c5",
		decimals: 18
	},
	{
		symbol: "ONX",
		address: "0xE0aD1806Fd3E7edF6FF52Fdb822432e847411033",
		decimals: 18
	},
	{
		symbol: "OPA",
		address: "0x3fE2eF1DFb1595195768627d16751D552586dce8",
		decimals: 10
	},
	{
		symbol: "OPC",
		address: "0xf2d4dcFe87430Ae9d1E0235EdAA7CD3D445E2378",
		decimals: 18
	},
	{
		symbol: "OPCT",
		address: "0xDb05EA0877A2622883941b939f0bb11d1ac7c400",
		decimals: 18
	},
	{
		symbol: "OPEN",
		address: "0x69c4BB240cF05D51eeab6985Bab35527d04a8C64",
		decimals: 8
	},
	{
		symbol: "OPEN",
		address: "0x69e8b9528CABDA89fe846C67675B5D73d463a916",
		decimals: 18
	},
	{
		symbol: "OPEN",
		address: "0x9D86b1B2554ec410ecCFfBf111A6994910111340",
		decimals: 8
	},
	{
		symbol: "OPIUM",
		address: "0x888888888889C00c67689029D7856AAC1065eC11",
		decimals: 18
	},
	{
		symbol: "OPM",
		address: "0xF4c17Bc4979c1dc7b4CA50115358Dec58C67fD9d",
		decimals: 18
	},
	{
		symbol: "OPNN",
		address: "0xA829F97373069ee5d23175e4105dF8fD49238Be7",
		decimals: 18
	},
	{
		symbol: "OPQ",
		address: "0x77599D2C6DB170224243e255e6669280F11F1473",
		decimals: 18
	},
	{
		symbol: "OPT",
		address: "0x4355fC160f74328f9b383dF2EC589bB3dFd82Ba0",
		decimals: 18
	},
	{
		symbol: "OPT",
		address: "0x7D25d9f10Cd224EcCe0Bc824A2eC800Db81C01d7",
		decimals: 18
	},
	{
		symbol: "OPT",
		address: "0x4FE5851C9af07df9e5AD8217aFAE1ea72737Ebda",
		decimals: 18
	},
	{
		symbol: "OPTC",
		address: "0x8E91A9cBAdB74EF60c456f1E4Ba3E391b143AAD9",
		decimals: 18
	},
	{
		symbol: "OPTI",
		address: "0x832904863978b94802123106e6eB491BDF0Df928",
		decimals: 18
	},
	{
		symbol: "OR",
		address: "0x3fF9CeBbeAA7Bcc48a952a011A02a22a1FDd1C62",
		decimals: 18
	},
	{
		symbol: "ORAI",
		address: "0x4c11249814f11b9346808179Cf06e71ac328c1b5",
		decimals: 18
	},
	{
		symbol: "ORB",
		address: "0x1b7c4d4F226cCf3211B0F99c4fdfb84A2606bF8e",
		decimals: 18
	},
	{
		symbol: "ORBI",
		address: "0x11A2Ab94adE17e96197C78f9D5f057332a19a0b9",
		decimals: 9
	},
	{
		symbol: "ORBIT",
		address: "0x248aDE18435f7B5E39d855CC98C42D8f6840a386",
		decimals: 3
	},
	{
		symbol: "ORBS",
		address: "0xff56Cc6b1E6dEd347aA0B7676C85AB0B3D08B0FA",
		decimals: 18
	},
	{
		symbol: "ORC",
		address: "0x324AF2D5353f2dD138E234b359d30d67C64b1b20",
		decimals: 18
	},
	{
		symbol: "ORC",
		address: "0x6C86228D240c22d4F4744654026326895351B2eC",
		decimals: 8
	},
	{
		symbol: "ORC",
		address: "0x662b67d00A13FAf93254714DD601F5Ed49Ef2F51",
		decimals: 18
	},
	{
		symbol: "ORCA",
		address: "0x6F59e0461Ae5E2799F1fB3847f05a63B16d0DbF8",
		decimals: 18
	},
	{
		symbol: "ORCL.CX",
		address: "0xFb9ec3111B7d68A8D80491cbF356dC4881e7e4F0",
		decimals: 8
	},
	{
		symbol: "ORI",
		address: "0xd2Fa8f92Ea72AbB35dBD6DECa57173d22db2BA49",
		decimals: 18
	},
	{
		symbol: "ORM",
		address: "0xd51e852630DeBC24E9e1041a03d80A0107F8Ef0C",
		decimals: 0
	},
	{
		symbol: "ORME",
		address: "0xc96DF921009B790dfFcA412375251ed1A2b75c60",
		decimals: 8
	},
	{
		symbol: "ORN",
		address: "0x0258F474786DdFd37ABCE6df6BBb1Dd5dfC4434a",
		decimals: 8
	},
	{
		symbol: "ORO",
		address: "0xc3Eb2622190c57429aac3901808994443b64B466",
		decimals: 18
	},
	{
		symbol: "OROM",
		address: "0xE3B05c42667DE42cA4a4eA1e9682eb590b6A65D1",
		decimals: 18
	},
	{
		symbol: "OROX",
		address: "0x1C5b760F133220855340003B43cC9113EC494823",
		decimals: 18
	},
	{
		symbol: "ORS",
		address: "0xEB9A4B185816C354dB92DB09cC3B50bE60b901b6",
		decimals: 18
	},
	{
		symbol: "ORS",
		address: "0xac2e58A06E6265F1Cf5084EE58da68e5d75b49CA",
		decimals: 18
	},
	{
		symbol: "ORT",
		address: "0x5dBA63c221d7A584795431cE01Ecd641A1798416",
		decimals: 18
	},
	{
		symbol: "ORX",
		address: "0x4e84A65B5664D33B67750771F8bEAeC458bD6729",
		decimals: 18
	},
	{
		symbol: "ORYX",
		address: "0x5C0Bc243Fb13632c4D247F4f0bC27f2f58982C39",
		decimals: 18
	},
	{
		symbol: "OSC",
		address: "0x60a640e2D10E020fee94217707bfa9543c8b59E0",
		decimals: 18
	},
	{
		symbol: "OSC",
		address: "0x24700A297960E8477Ce3CA6C58b70a7Af3410398",
		decimals: 18
	},
	{
		symbol: "OSCH",
		address: "0xf46f98a8F6032914921aE9CFb5aaaB5083Bd9376",
		decimals: 18
	},
	{
		symbol: "OSPV",
		address: "0xFCCe9526E030F1691966d5A651F5EbE1A5B4C8E4",
		decimals: 18
	},
	{
		symbol: "OSPVS",
		address: "0xf7D1f35518950E78c18E5A442097cA07962f4D8A",
		decimals: 18
	},
	{
		symbol: "OST",
		address: "0x2C4e8f2D746113d0696cE89B35F0d8bF88E0AEcA",
		decimals: 18
	},
	{
		symbol: "OSTK.CX",
		address: "0x530AD8376E292b5b17f4c95aAB8767cD4E90De06",
		decimals: 8
	},
	{
		symbol: "OTB",
		address: "0xA86a0Da9D05d0771955DF05B44Ca120661aF16DE",
		decimals: 18
	},
	{
		symbol: "OTN",
		address: "0x881Ef48211982D01E2CB7092C915E647Cd40D85C",
		decimals: 18
	},
	{
		symbol: "OTO",
		address: "0x028CE5EA3298a50c0D8a27b937b1F48Cf0d68b56",
		decimals: 18
	},
	{
		symbol: "OUSD",
		address: "0x7c0AFD49D40Ec308d49E2926E5c99B037d54EE7e",
		decimals: 18
	},
	{
		symbol: "OUSD",
		address: "0xD2d01dd6Aa7a2F5228c7c17298905A7C7E1dfE81",
		decimals: 18
	},
	{
		symbol: "OUSD",
		address: "0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86",
		decimals: 18
	},
	{
		symbol: "OVC",
		address: "0x49D09cDa1Deb8a1680F1270C5ed15218fc4B18f0",
		decimals: 18
	},
	{
		symbol: "OVO",
		address: "0x8232875761b97A5242A4CfFB94828Dff5c101950",
		decimals: 9
	},
	{
		symbol: "OVR",
		address: "0x21BfBDa47A0B4B5b1248c767Ee49F7caA9B23697",
		decimals: 18
	},
	{
		symbol: "OW",
		address: "0x2B959EF258370C7A554d2bB052B3BC062D17E758",
		decimals: 18
	},
	{
		symbol: "OWL",
		address: "0x1A5F9352Af8aF974bFC03399e3767DF6370d82e4",
		decimals: 18
	},
	{
		symbol: "OWL",
		address: "0x2a7f709eE001069771ceB6D42e85035f7D18E736",
		decimals: 18
	},
	{
		symbol: "OWN",
		address: "0x170b275CEd089FffAEBFe927F445a350ED9160DC",
		decimals: 8
	},
	{
		symbol: "OWN",
		address: "0xcC6F15Be8573cB8243C42d300565566D328213Dd",
		decimals: 18
	},
	{
		symbol: "OWT",
		address: "0xC2494604e9DcEfa2A70dCEbf81e6D7BE064a334e",
		decimals: 18
	},
	{
		symbol: "OX",
		address: "0x65A15014964F2102Ff58647e16a16a6B9E14bCF6",
		decimals: 3
	},
	{
		symbol: "OXT",
		address: "0x4575f41308EC1483f3d399aa9a2826d74Da13Deb",
		decimals: 18
	},
	{
		symbol: "OXY",
		address: "0x965697b4ef02F0DE01384D0d4F9F782B1670c163",
		decimals: 6
	},
	{
		symbol: "OXY2",
		address: "0x66149b85cbd202EAf4A93713702A7E94fC1121a7",
		decimals: 5
	},
	{
		symbol: "P2PS",
		address: "0x4527a3B4A8A150403090a99b87efFC96F2195047",
		decimals: 8
	},
	{
		symbol: "PAA",
		address: "0x3D9Ac8e7a9C9bE11DFac1677dDa901E28d44527f",
		decimals: 8
	},
	{
		symbol: "PAHOO",
		address: "0x35401C8CA3e994d627d1610777877e5AbeE932dC",
		decimals: 18
	},
	{
		symbol: "pahoo",
		address: "0x9954Ff0295443c01f562Dccb1f893bE464e01986",
		decimals: 18
	},
	{
		symbol: "PAI",
		address: "0xB9bb08AB7E9Fa0A1356bd4A39eC0ca267E03b0b3",
		decimals: 18
	},
	{
		symbol: "PAID",
		address: "0x8c8687fC965593DFb2F0b4EAeFD55E9D8df348df",
		decimals: 18
	},
	{
		symbol: "PAID",
		address: "0x1614F18Fc94f47967A3Fbe5FfcD46d4e7Da3D787",
		decimals: 18
	},
	{
		symbol: "PAINT",
		address: "0x4C6eC08CF3fc987c6C4BEB03184D335A2dFc4042",
		decimals: 18
	},
	{
		symbol: "PAL",
		address: "0x562952c749D05DCa4cD004489a153c7EE7E58240",
		decimals: 18
	},
	{
		symbol: "PAL",
		address: "0xfeDAE5642668f8636A11987Ff386bfd215F942EE",
		decimals: 18
	},
	{
		symbol: "PALS",
		address: "0x794d1d86685d45F9297C2fE80F295aA7F8285Bb4",
		decimals: 18
	},
	{
		symbol: "PAMP",
		address: "0xF0FAC7104aAC544e4a7CE1A55ADF2B5a25c65bD1",
		decimals: 18
	},
	{
		symbol: "PAMP",
		address: "0xCe833222051740Aa5427D089A46fF3918763107f",
		decimals: 18
	},
	{
		symbol: "PAN",
		address: "0x536381a8628dBcC8C70aC9A30A7258442eAb4c92",
		decimals: 8
	},
	{
		symbol: "PAN",
		address: "0xD56daC73A4d6766464b38ec6D91eB45Ce7457c44",
		decimals: 18
	},
	{
		symbol: "PAN",
		address: "0x03b828cCA6594dc0a21c814bd8c944104BB03223",
		decimals: 18
	},
	{
		symbol: "PANCHO",
		address: "0x61FEf6246a010e601843477A90Eb54F8F97A91d9",
		decimals: 7
	},
	{
		symbol: "PANDA",
		address: "0x0A5Dc2204DFC6082eF3BbCFc3A468F16318C4168",
		decimals: 18
	},
	{
		symbol: "PAR",
		address: "0x68037790A0229e9Ce6EaA8A99ea92964106C4703",
		decimals: 18
	},
	{
		symbol: "PAR",
		address: "0x1BeEF31946fbbb40B877a72E4ae04a8D1A5Cee06",
		decimals: 18
	},
	{
		symbol: "PARETO",
		address: "0xea5f88E54d982Cbb0c441cde4E79bC305e5b43Bc",
		decimals: 18
	},
	{
		symbol: "PARTY",
		address: "0x314bD765cAB4774b2E547eB0aA15013e03FF74d2",
		decimals: 6
	},
	{
		symbol: "PASS",
		address: "0x77761e63C05aeE6648FDaeaa9B94248351AF9bCd",
		decimals: 18
	},
	{
		symbol: "PASS",
		address: "0x6C4522F0035bED2180B40f4c5d9DbAab64B41325",
		decimals: 18
	},
	{
		symbol: "PASS",
		address: "0xeE4458e052B533b1aABD493B5f8c4d85D7B263Dc",
		decimals: 6
	},
	{
		symbol: "PASTA",
		address: "0x08A2E41FB99A7599725190B9C970Ad3893fa33CF",
		decimals: 18
	},
	{
		symbol: "PASTA",
		address: "0xE54f9E6Ab80ebc28515aF8b8233c1aeE6506a15E",
		decimals: 18
	},
	{
		symbol: "PAT",
		address: "0xF3b3Cad094B89392fcE5faFD40bC03b80F2Bc624",
		decimals: 18
	},
	{
		symbol: "PATENTS",
		address: "0x694404595e3075A942397F466AAcD462FF1a7BD0",
		decimals: 18
	},
	{
		symbol: "PATH",
		address: "0xF813F3902bBc00A6DCe378634d3B79D84F9803d7",
		decimals: 18
	},
	{
		symbol: "PATR",
		address: "0x9FbA684D77D2d6A1408C24b60A1f5534e71f5b75",
		decimals: 18
	},
	{
		symbol: "PATS",
		address: "0x3310f5Acb5df71DA3b15A27230122bFbF3f7B9A0",
		decimals: 18
	},
	{
		symbol: "PAX",
		address: "0xc1D204d77861dEf49b6E769347a883B15EC397Ff",
		decimals: 18
	},
	{
		symbol: "PAX",
		address: "0x8E870D67F660D95d5be530380D0eC0bd388289E1",
		decimals: 18
	},
	{
		symbol: "PAXCURVE",
		address: "0xD905e2eaeBe188fc92179b6350807D8bd91Db0D8",
		decimals: 18
	},
	{
		symbol: "PAXG",
		address: "0x45804880De22913dAFE09f4980848ECE6EcbAf78",
		decimals: 18
	},
	{
		symbol: "PAXGBEAR",
		address: "0x3C4a46F0C075A7F191A7459bb51EB1f81ac36F8A",
		decimals: 18
	},
	{
		symbol: "PAXGBULL",
		address: "0x81f09eD4b98B1c8e99b1Fa838B72acB842AFE94c",
		decimals: 18
	},
	{
		symbol: "PAY",
		address: "0xB97048628DB6B661D4C2aA833e95Dbe1A905B280",
		decimals: 18
	},
	{
		symbol: "PAY",
		address: "0x3CA660B3200A89641aBF895CF051eb42dAfb01ef",
		decimals: 18
	},
	{
		symbol: "PAYC.CX",
		address: "0xF37a3FB5543F7283C051E8FEd12b9e98dc54e5Dc",
		decimals: 8
	},
	{
		symbol: "PAYOU",
		address: "0xCb2Fa15F4EA7C55bF6Ef9456A662412B137043e9",
		decimals: 18
	},
	{
		symbol: "PAYT",
		address: "0x8EF47555856f6Ce2E0cd7C36AeF4FAb317d2e2E2",
		decimals: 18
	},
	{
		symbol: "PAYX",
		address: "0x62a56a4A2Ef4D355D34D10fBF837e747504d38d4",
		decimals: 2
	},
	{
		symbol: "PAZZI",
		address: "0xbcD8756Ea481608Ea3DD5a555493305Cf0A79640",
		decimals: 18
	},
	{
		symbol: "PBC",
		address: "0xad808ba4Eb817A968889ec0e93130c4fDE8e71B8",
		decimals: 8
	},
	{
		symbol: "PBC",
		address: "0x31DDd688D6CdA430aad84142b2cD8c019d88094D",
		decimals: 18
	},
	{
		symbol: "PBF.CX",
		address: "0xE27fc04D0f239DdFF43C4A2531d2A16c26EC014B",
		decimals: 8
	},
	{
		symbol: "PBK",
		address: "0x077DC3c0c9543df1cdD78386DF3204E69E0DD274",
		decimals: 7
	},
	{
		symbol: "PBL",
		address: "0x55648De19836338549130B1af587F16beA46F66B",
		decimals: 18
	},
	{
		symbol: "PBLC",
		address: "0x6fFbd6B41b802550C57D4661d81A1700A502f2AB",
		decimals: 9
	},
	{
		symbol: "PBR.CX",
		address: "0x149088326be49CA948988F44Fcf65C0c4d248b16",
		decimals: 8
	},
	{
		symbol: "PBT",
		address: "0x77f06890793DEeD1338D995BfC36bD8ea2Ce6B9a",
		decimals: 18
	},
	{
		symbol: "PBT",
		address: "0xF4c07b1865bC326A3c01339492Ca7538FD038Cc0",
		decimals: 4
	},
	{
		symbol: "PBTC",
		address: "0x5228a22e72ccC52d415EcFd199F99D0665E7733b",
		decimals: 18
	},
	{
		symbol: "PBTC35A",
		address: "0xA8b12Cc90AbF65191532a12bb5394A714A46d358",
		decimals: 18
	},
	{
		symbol: "PBYI.CX",
		address: "0xf964E7DBA960437CE4dB92e2F712297A292c8006",
		decimals: 8
	},
	{
		symbol: "PC",
		address: "0xa6714a2e5f0B1bdb97b895b0913b4FcD3a775E4D",
		decimals: 5
	},
	{
		symbol: "PCC",
		address: "0x6Aa27b3A8AAB51745b7eAF53E61AbA833B0F9400",
		decimals: 8
	},
	{
		symbol: "PCCM",
		address: "0x8Dd57C98580E5070853272e765Ea2c243F2d13E0",
		decimals: 18
	},
	{
		symbol: "PCCS",
		address: "0xB6C65067b2a6fb0Bce553Fa893602de43a7A7F84",
		decimals: 8
	},
	{
		symbol: "PCH",
		address: "0xE3F4b4A5d91e5cB9435B947F090A319737036312",
		decimals: 18
	},
	{
		symbol: "PCH",
		address: "0xfcAC7A7515e9A9d7619fA77A1fa738111f66727e",
		decimals: 18
	},
	{
		symbol: "PCL",
		address: "0x3618516F45CD3c913F81F9987AF41077932Bc40d",
		decimals: 8
	},
	{
		symbol: "PCL",
		address: "0x0F02e27745e3b6e9e1310d19469e2b5D7B5eC99A",
		decimals: 8
	},
	{
		symbol: "PCM",
		address: "0x6096d2460CF5177E40B515223428DC005ad35123",
		decimals: 18
	},
	{
		symbol: "PCO",
		address: "0xf5B815344641412401d8e868790dBD125e6761Ca",
		decimals: 8
	},
	{
		symbol: "PCOIN",
		address: "0x3dD12D935CFA82fbB4EDE9523c552240F2058C0B",
		decimals: 18
	},
	{
		symbol: "PCT",
		address: "0x5ebE6a342a93102393EdD9D2e458C689e5aC0bb3",
		decimals: 8
	},
	{
		symbol: "PCT",
		address: "0xbc16da9df0A22f01A16BC0620a27e7D6d6488550",
		decimals: 18
	},
	{
		symbol: "PCTO",
		address: "0xc4A59854A63588a049f4E326af927400C6140746",
		decimals: 3
	},
	{
		symbol: "PDAI",
		address: "0x9043d4d51C9d2e31e3F169de4551E416970c27Ef",
		decimals: 18
	},
	{
		symbol: "PDATA",
		address: "0x0db03B6CDe0B2d427C64a04FeAfd825938368f1F",
		decimals: 18
	},
	{
		symbol: "PDC",
		address: "0xAF0336137c2f68E881cEa7d95059E6B2ddCf7E57",
		decimals: 18
	},
	{
		symbol: "PDF",
		address: "0x6CcD05F73a54359A257fc5649c598A3DE75905e7",
		decimals: 18
	},
	{
		symbol: "PDI",
		address: "0xC50948bac01116F246259070Ea6084C04649efDF",
		decimals: 6
	},
	{
		symbol: "PDRY",
		address: "0x4E8E8eB5A4ED17170B646D33b8EF3E7352585607",
		decimals: 18
	},
	{
		symbol: "PDX",
		address: "0x5F33d158CA7275848F70A3f149b421190DF85B32",
		decimals: 18
	},
	{
		symbol: "PE",
		address: "0x6e336C1934d99dAB9CA3E4CC6357051Aef4dFc0f",
		decimals: 18
	},
	{
		symbol: "PEAK",
		address: "0xA2A8Dec9d963e2fE7a5aB8469586B07eF53bb505",
		decimals: 18
	},
	{
		symbol: "PEAK",
		address: "0x630d98424eFe0Ea27fB1b3Ab7741907DFFEaAd78",
		decimals: 8
	},
	{
		symbol: "PEAK",
		address: "0x633eE3fbE5ffc05bD44Ecd8240732fF9ef9Dee1d",
		decimals: 8
	},
	{
		symbol: "PEC",
		address: "0x432Bf73443909c33b545EfED536a5246c9a722cA",
		decimals: 18
	},
	{
		symbol: "PEG",
		address: "0x8Ae56a6850a7cbeaC3c3Ab2cB311e7620167eAC8",
		decimals: 18
	},
	{
		symbol: "PELO",
		address: "0x121C6e0613317a98cC14a9d379e2aBe546ba980C",
		decimals: 18
	},
	{
		symbol: "PENDLE",
		address: "0x808507121B80c02388fAd14726482e061B8da827",
		decimals: 18
	},
	{
		symbol: "PEP",
		address: "0x61630FD1F65a7B72aF8E9FAa6E2646080131F501",
		decimals: 18
	},
	{
		symbol: "PEP",
		address: "0xBb0eF9e617FADdf54B8D16e29046F72B4D3ec77F",
		decimals: 18
	},
	{
		symbol: "PERA",
		address: "0xbFd78aebcCF26cb964A7836263143b5ee8072D84",
		decimals: 8
	},
	{
		symbol: "PERL",
		address: "0xb5A73f5Fc8BbdbcE59bfD01CA8d35062e0dad801",
		decimals: 9
	},
	{
		symbol: "PERL",
		address: "0xeca82185adCE47f39c684352B0439f030f860318",
		decimals: 18
	},
	{
		symbol: "PERP",
		address: "0xbC396689893D065F41bc2C6EcbeE5e0085233447",
		decimals: 18
	},
	{
		symbol: "PERX",
		address: "0x3C6ff50c9Ec362efa359317009428d52115fe643",
		decimals: 18
	},
	{
		symbol: "PESO",
		address: "0x30FEF258d2728F9d1eDF038059c725FAf785697E",
		decimals: 2
	},
	{
		symbol: "PET",
		address: "0x5884969Ec0480556E11d119980136a4C17eDDEd1",
		decimals: 18
	},
	{
		symbol: "PET",
		address: "0x66208d03526FC7435caa36fc4fe698C9c02A4aEd",
		decimals: 18
	},
	{
		symbol: "PETC",
		address: "0xd1D3b662D91faaa4A5d809D804fa70550B2B3E9C",
		decimals: 18
	},
	{
		symbol: "PETH",
		address: "0xf53AD2c6851052A81B42133467480961B2321C09",
		decimals: 18
	},
	{
		symbol: "PETRO",
		address: "0xeC18f898B4076A3E18f1089D33376CC380BDe61D",
		decimals: 18
	},
	{
		symbol: "PEW",
		address: "0xa701122c1b67220a8B6883D03C8Ad67896B12466",
		decimals: 8
	},
	{
		symbol: "PEXT",
		address: "0x55c2A0C171D920843560594dE3d6EEcC09eFc098",
		decimals: 4
	},
	{
		symbol: "PFARM",
		address: "0x6a8C66Cab4F766E5E30b4e9445582094303cc322",
		decimals: 18
	},
	{
		symbol: "PFB",
		address: "0x46760d2BF2F4dd5405646D9b2cE7B723EFE74a48",
		decimals: 18
	},
	{
		symbol: "PFD",
		address: "0x65f68E5771Bde2E128232Fd8fBA9fa0247f1feDf",
		decimals: 18
	},
	{
		symbol: "PFE.CX",
		address: "0xF2EB99dEc2FEef17f7158b67dCB959fa08a41852",
		decimals: 8
	},
	{
		symbol: "PFI",
		address: "0x989ac4c1fC5aB2B8c86924c6253aAF1Ee68E9ce9",
		decimals: 18
	},
	{
		symbol: "PFID",
		address: "0x87C4Bd3038176301e81E6682CE51A6fDAEfabD0C",
		decimals: 18
	},
	{
		symbol: "PFR",
		address: "0x2FA32a39fc1c399E0Cc7B2935868f5165De7cE97",
		decimals: 8
	},
	{
		symbol: "PFR",
		address: "0x6353EaDF8D1D4421002332BB9074222b14d54881",
		decimals: 8
	},
	{
		symbol: "PGF7T",
		address: "0x9FadeA1aFF842D407893e21DBD0E2017b4C287b6",
		decimals: 18
	},
	{
		symbol: "PGL",
		address: "0x089A6D83282Fb8988A656189F1E7A73FA6C1caC2",
		decimals: 18
	},
	{
		symbol: "PGOLD",
		address: "0xF02DAB52205aFf6Bb3d47Cc7B21624a5064F9FBA",
		decimals: 4
	},
	{
		symbol: "PGS",
		address: "0x931ad0628aa11791C26FF4d41ce23E40C31c5E4e",
		decimals: 8
	},
	{
		symbol: "PGT",
		address: "0xeaccb6E0f24d66cF4Aa6cBDa33971b9231d332a1",
		decimals: 18
	},
	{
		symbol: "PHA",
		address: "0x6c5bA91642F10282b576d91922Ae6448C9d52f4E",
		decimals: 18
	},
	{
		symbol: "PHI",
		address: "0x13C2fab6354d3790D8ece4f0f1a3280b4A25aD96",
		decimals: 18
	},
	{
		symbol: "PHN",
		address: "0xF73Fc4B74a4CC6F9ea203A9d5BBFf4fFCe3A4c48",
		decimals: 18
	},
	{
		symbol: "PHNX",
		address: "0x38A2fDc11f526Ddd5a607C1F251C065f40fBF2f7",
		decimals: 18
	},
	{
		symbol: "PHT",
		address: "0xbbd227e805b90b8FE8f4c01A3f4E48bdAE0599af",
		decimals: 2
	},
	{
		symbol: "PHTM",
		address: "0x50fFF411F4E22e79857fF9aD3475b50D6dF195f0",
		decimals: 18
	},
	{
		symbol: "PHV",
		address: "0x25200235cA7113C2541E70dE737c41f5e9AcD1F6",
		decimals: 18
	},
	{
		symbol: "PIB",
		address: "0x1864cE27E9F7517047933CaAE530674e8C70b8A7",
		decimals: 18
	},
	{
		symbol: "PICK",
		address: "0x287609A15A683640A5bbC4d93D4D5f4Ed6bAD3A0",
		decimals: 18
	},
	{
		symbol: "PICKLE",
		address: "0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5",
		decimals: 18
	},
	{
		symbol: "PIE",
		address: "0x607C794cDa77efB21F8848B7910ecf27451Ae842",
		decimals: 18
	},
	{
		symbol: "Pigx",
		address: "0x86F654CEBb9bAE068d0C4398D1E337b351E6523B",
		decimals: 18
	},
	{
		symbol: "PIGX",
		address: "0x47E820dF943170b0e31F9E18ECD5bDd67b77FF1f",
		decimals: 18
	},
	{
		symbol: "PIPL",
		address: "0xE64509F0bf07ce2d29A7eF19A8A9bc065477C1B4",
		decimals: 8
	},
	{
		symbol: "PIPS",
		address: "0x59db9fDE270b39a07F38fA3106A760829074c7d9",
		decimals: 18
	},
	{
		symbol: "PIPT",
		address: "0xb2B9335791346E94245DCd316A9C9ED486E6dD7f",
		decimals: 18
	},
	{
		symbol: "PIPT",
		address: "0x26607aC599266b21d13c7aCF7942c7701a8b699c",
		decimals: 18
	},
	{
		symbol: "PIS",
		address: "0x834cE7aD163ab3Be0C5Fd4e0a81E67aC8f51E00C",
		decimals: 18
	},
	{
		symbol: "PIT",
		address: "0x0fF161071e627A0E6de138105C73970F86ca7922",
		decimals: 18
	},
	{
		symbol: "PIT",
		address: "0xA44Fb3AA5c8465512B806145a8f9b60e74f3f851",
		decimals: 18
	},
	{
		symbol: "PITCH",
		address: "0x87f56Ee356B434187105b40F96B230F5283c0AB4",
		decimals: 9
	},
	{
		symbol: "PITI",
		address: "0x92AAdc367fEB0cad3Cc52BB19721bE3aAd95953c",
		decimals: 18
	},
	{
		symbol: "PIX",
		address: "0x8eFFd494eB698cc399AF6231fCcd39E08fd20B15",
		decimals: 0
	},
	{
		symbol: "PIXBY",
		address: "0xB53e08B97724126Bda6d237B94F766c0b81C90fE",
		decimals: 18
	},
	{
		symbol: "PIXIE",
		address: "0x9318105460626e7fA58308FA4bcE40e4616F3565",
		decimals: 18
	},
	{
		symbol: "PJM",
		address: "0x61bc1F530AC6193D73aF1e1A6A14CB44b9C3f915",
		decimals: 18
	},
	{
		symbol: "PKF",
		address: "0x8B39B70E39Aa811b69365398e0aACe9bee238AEb",
		decimals: 18
	},
	{
		symbol: "PKG",
		address: "0x02F2D4a04E6E01aCE88bD2Cd632875543b2eF577",
		decimals: 18
	},
	{
		symbol: "PKO",
		address: "0x98b89a9947a668C1bAA48382DE7f4A952ef37b53",
		decimals: 18
	},
	{
		symbol: "PKP",
		address: "0x6A532b08c654A1A86069b74C560d8Fa0ff842218",
		decimals: 18
	},
	{
		symbol: "PKT",
		address: "0x2604FA406Be957E542BEb89E6754fCdE6815e83f",
		decimals: 18
	},
	{
		symbol: "PLA",
		address: "0x307d45Afbb7E84F82ef3D251A6bb0F00Edf632E4",
		decimals: 18
	},
	{
		symbol: "PLA",
		address: "0x8c32E8c6487C35DEfF3d65bcDA73f86Db8a1Fa67",
		decimals: 18
	},
	{
		symbol: "PLA",
		address: "0x677294C0E019145f595914BE0ea5E5DC27974Cc6",
		decimals: 18
	},
	{
		symbol: "PLA",
		address: "0x0198f46f520F33cd4329bd4bE380a25a90536CD5",
		decimals: 18
	},
	{
		symbol: "PLAAS",
		address: "0x60571E95E12c78CbA5223042692908f0649435a5",
		decimals: 18
	},
	{
		symbol: "PLANETAGRO",
		address: "0x2775F2A3C83bee1541D1d1BC308b3BB432B45151",
		decimals: 18
	},
	{
		symbol: "PLAY",
		address: "0xE477292f1B3268687A29376116B0ED27A9c76170",
		decimals: 18
	},
	{
		symbol: "PLAY",
		address: "0x6F6DEb5db0C4994A8283A01D6CFeEB27Fc3bBe9C",
		decimals: 0
	},
	{
		symbol: "PLBT",
		address: "0x0AfFa06e7Fbe5bC9a764C979aA66E8256A631f02",
		decimals: 6
	},
	{
		symbol: "PLCN",
		address: "0xcfc2437916A6df165235272dbfb116687bb1A00b",
		decimals: 18
	},
	{
		symbol: "PLD",
		address: "0xe9541c7EA236332f4d07BE73101670F39B27dA02",
		decimals: 18
	},
	{
		symbol: "PLF",
		address: "0xaDA62f7CCd6af6cAcff04ACCBC4f56f3D4FFd4Ef",
		decimals: 18
	},
	{
		symbol: "PLG",
		address: "0xBa069Ee53b8B531F3AB117c92ca09A204C9E6285",
		decimals: 18
	},
	{
		symbol: "PLG",
		address: "0x85ca6710D0F1D511d130f6935eDDA88ACBD921bD",
		decimals: 18
	},
	{
		symbol: "PLM",
		address: "0x80d211718f9B9Ba31959a14328Acd8D8c9d5382f",
		decimals: 6
	},
	{
		symbol: "PLNX",
		address: "0xaAce6480798b4A7b596ec4ce3A26b8de9b9Ae2E2",
		decimals: 18
	},
	{
		symbol: "PLOT",
		address: "0x72F020f8f3E8fd9382705723Cd26380f8D0c66Bb",
		decimals: 18
	},
	{
		symbol: "PLR",
		address: "0xe3818504c1B32bF1557b16C238B2E01Fd3149C17",
		decimals: 18
	},
	{
		symbol: "PLST",
		address: "0x22314B3d1375548C969eaAE65e43203b51f9e9E9",
		decimals: 2
	},
	{
		symbol: "PLT",
		address: "0x9fBFed658919A896B5Dc7b00456Ce22D780f9B65",
		decimals: 18
	},
	{
		symbol: "PLT",
		address: "0xe15684Ff27237bE7F681eb6BdF301d0B2fbf191c",
		decimals: 18
	},
	{
		symbol: "PLTC",
		address: "0x5979F50f1D4c08f9A53863C2f39A7B0492C38d0f",
		decimals: 18
	},
	{
		symbol: "PLTC",
		address: "0x429D83Bb0DCB8cdd5311e34680ADC8B12070a07f",
		decimals: 18
	},
	{
		symbol: "PLU",
		address: "0xD8912C10681D8B21Fd3742244f44658dBA12264E",
		decimals: 18
	},
	{
		symbol: "PLUT",
		address: "0xF38011F9153aCFfACa3fBFC42Ddfa766C980d967",
		decimals: 18
	},
	{
		symbol: "PLX",
		address: "0xb3203DB25a01fa7950a860B42b899Ad7Da52DDD6",
		decimals: 8
	},
	{
		symbol: "PLX",
		address: "0x59BE937f05cf2c406b61c42C6c82a093fA54edfE",
		decimals: 9
	},
	{
		symbol: "PMA",
		address: "0x846C66cf71C43f80403B51fE3906B3599D63336f",
		decimals: 18
	},
	{
		symbol: "PMC",
		address: "0x767588059265d2a243445dd3f23DB37B96018dD5",
		decimals: 8
	},
	{
		symbol: "PMD",
		address: "0x89700D6Cd7b77D1F52c29cA776a1EAe313320fC5",
		decimals: 18
	},
	{
		symbol: "PMGT",
		address: "0xAFFCDd96531bCd66faED95FC61e443D08F79eFEf",
		decimals: 5
	},
	{
		symbol: "PMNT",
		address: "0x81b4D08645DA11374a03749AB170836E4e539767",
		decimals: 9
	},
	{
		symbol: "PMON",
		address: "0x1796ae0b0fa4862485106a0de9b654eFE301D0b2",
		decimals: 18
	},
	{
		symbol: "PMT",
		address: "0xC1322D8aE3B0e2E437e0AE36388D0CFD2C02f1c9",
		decimals: 4
	},
	{
		symbol: "PNC",
		address: "0x31141Dc226c214d40B1f77FEb532741d8F893C6f",
		decimals: 18
	},
	{
		symbol: "PNC.CX",
		address: "0x9A882dDd550b9E1a211C849496D1CCb7BBCC32Ae",
		decimals: 8
	},
	{
		symbol: "PNK",
		address: "0x93ED3FBe21207Ec2E8f2d3c3de6e058Cb73Bc04d",
		decimals: 18
	},
	{
		symbol: "PNT",
		address: "0x89Ab32156e46F46D02ade3FEcbe5Fc4243B9AAeD",
		decimals: 18
	},
	{
		symbol: "PNT",
		address: "0x53066cdDBc0099eb6c96785d9b3DF2AAeEDE5DA3",
		decimals: 18
	},
	{
		symbol: "POA20",
		address: "0x6758B7d441a9739b98552B373703d8d3d14f9e62",
		decimals: 18
	},
	{
		symbol: "POC",
		address: "0xc9c4d9Ec2B44B241361707679D3Db0876aC10CA6",
		decimals: 18
	},
	{
		symbol: "POCC",
		address: "0x926Be13B4d93F29eA254E4e518f33099e45d7f06",
		decimals: 18
	},
	{
		symbol: "POE",
		address: "0x0e0989b1f9B8A38983c2BA8053269Ca62Ec9B195",
		decimals: 8
	},
	{
		symbol: "POIN",
		address: "0x43F6a1BE992deE408721748490772B15143CE0a7",
		decimals: 0
	},
	{
		symbol: "POK",
		address: "0xBc8dEee89F1cf4B661514185AA1aB780336c4c4A",
		decimals: 18
	},
	{
		symbol: "POLC",
		address: "0xaA8330FB2B4D5D07ABFE7A72262752a8505C6B37",
		decimals: 18
	},
	{
		symbol: "POLIS",
		address: "0x622f2962AE78e8686EcC1E30cF2f9a6e5aC35626",
		decimals: 18
	},
	{
		symbol: "POLL",
		address: "0x705EE96c1c160842C92c1aeCfCFfccc9C412e3D9",
		decimals: 18
	},
	{
		symbol: "POLS",
		address: "0x83e6f1E41cdd28eAcEB20Cb649155049Fac3D5Aa",
		decimals: 18
	},
	{
		symbol: "POLY",
		address: "0x9992eC3cF6A55b00978cdDF2b27BC6882d88D1eC",
		decimals: 18
	},
	{
		symbol: "POMAC",
		address: "0xDF4dF8eE1bD1c9f01e60ee15E4C2F7643B690699",
		decimals: 18
	},
	{
		symbol: "PON",
		address: "0x19ddC3605052554A1aC2b174aE745c911456841f",
		decimals: 18
	},
	{
		symbol: "POND",
		address: "0x57B946008913B82E4dF85f501cbAeD910e58D26C",
		decimals: 18
	},
	{
		symbol: "PONG",
		address: "0x95fa5C2d804838164bDcA5c188E9fFD1D8a624DC",
		decimals: 8
	},
	{
		symbol: "POOL",
		address: "0x779B7b713C86e3E6774f5040D9cCC2D43ad375F8",
		decimals: 8
	},
	{
		symbol: "POOL",
		address: "0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e",
		decimals: 18
	},
	{
		symbol: "POOLZ",
		address: "0x69A95185ee2a045CDC4bCd1b1Df10710395e4e23",
		decimals: 18
	},
	{
		symbol: "POP",
		address: "0x5D858bcd53E085920620549214a8b27CE2f04670",
		decimals: 18
	},
	{
		symbol: "PORTAL",
		address: "0x8DB90E3e7D04C875a51997092f9178FCac9DefdB",
		decimals: 18
	},
	{
		symbol: "POS",
		address: "0xEe609fE292128Cad03b786DBb9Bc2634Ccdbe7fC",
		decimals: 18
	},
	{
		symbol: "POSH",
		address: "0x685aea4F02E39E5a5BB7f7117E88DB1151F38364",
		decimals: 18
	},
	{
		symbol: "POSS",
		address: "0x6b193e107A773967bD821bCf8218f3548Cfa2503",
		decimals: 18
	},
	{
		symbol: "POT",
		address: "0x042aFd3869A47E2d5d42CC787D5c9E19DF32185F",
		decimals: 18
	},
	{
		symbol: "POWER",
		address: "0xF2f9A7e93f845b3ce154EfbeB64fB9346FCCE509",
		decimals: 18
	},
	{
		symbol: "POWR",
		address: "0x595832F8FC6BF59c85C527fEC3740A1b7a361269",
		decimals: 6
	},
	{
		symbol: "PP",
		address: "0xb628919a5456fd746A6b7a9f1003040Ca63e6d45",
		decimals: 18
	},
	{
		symbol: "PPAY",
		address: "0x054D64b73d3D8A21Af3D764eFd76bCaA774f3Bb2",
		decimals: 18
	},
	{
		symbol: "PPBLZ",
		address: "0x4D2eE5DAe46C86DA2FF521F7657dad98834f97b8",
		decimals: 18
	},
	{
		symbol: "PPC",
		address: "0x84F710Bae3316A74Fb0fCb01904d2578A4cc6A26",
		decimals: 1
	},
	{
		symbol: "PPDEX",
		address: "0xf1F508c7C9f0d1b15a76fbA564eEf2d956220cf7",
		decimals: 18
	},
	{
		symbol: "PPI",
		address: "0x5a3c9A1725AA82690ee0959c89abE96fD1b527ee",
		decimals: 18
	},
	{
		symbol: "PPL",
		address: "0x36Dd88A0A0f53C90555087E57F758383978e64b5",
		decimals: 18
	},
	{
		symbol: "PPN",
		address: "0xb3AAE68d195138CB1Faed4d8c905b8113EA33049",
		decimals: 0
	},
	{
		symbol: "PPP",
		address: "0xc42209aCcC14029c1012fB5680D95fBd6036E2a0",
		decimals: 18
	},
	{
		symbol: "PPT",
		address: "0xd4fa1460F537bb9085d22C7bcCB5DD450Ef28e3a",
		decimals: 8
	},
	{
		symbol: "PRA",
		address: "0x9041Fe5B3FDEA0f5e4afDC17e75180738D877A01",
		decimals: 18
	},
	{
		symbol: "PRARE",
		address: "0x2C2f7e7C5604D162d75641256b80F1Bf6f4dC796",
		decimals: 18
	},
	{
		symbol: "PRC",
		address: "0xcaa05e82bdcBA9e25CD1A3Bf1AfB790C1758943d",
		decimals: 8
	},
	{
		symbol: "PRDX",
		address: "0x556148562d5DdeB72545D7EC4B3eC8edc8F55Ba7",
		decimals: 18
	},
	{
		symbol: "PRDZ",
		address: "0x4e085036A1b732cBe4FfB1C12ddfDd87E7C3664d",
		decimals: 18
	},
	{
		symbol: "PRE",
		address: "0xEC213F83defB583af3A000B1c0ada660b1902A0F",
		decimals: 18
	},
	{
		symbol: "PRE",
		address: "0x88A3E4F35D64aAD41A6d4030ac9AFE4356cB84fA",
		decimals: 18
	},
	{
		symbol: "PRFT",
		address: "0xC5ceA8292e514405967D958c2325106f2f48dA77",
		decimals: 18
	},
	{
		symbol: "PRG",
		address: "0x7728dFEF5aBd468669EB7f9b48A7f70a501eD29D",
		decimals: 6
	},
	{
		symbol: "PRIA",
		address: "0xb9871cB10738eADA636432E86FC0Cb920Dc3De24",
		decimals: 18
	},
	{
		symbol: "PRIME",
		address: "0xE59064a8185Ed1Fca1D17999621eFedfab4425c9",
		decimals: 18
	},
	{
		symbol: "PRINT",
		address: "0x54b8c98268dA0055971652A95F2bfD3a9349A38c",
		decimals: 18
	},
	{
		symbol: "PRIVATE",
		address: "0x17540494Ad5E39AEFD49901774528e9ff17FE40B",
		decimals: 3
	},
	{
		symbol: "PRIX",
		address: "0x3ADfc4999F77D04c8341BAC5F3A76f58DfF5B37A",
		decimals: 8
	},
	{
		symbol: "PRL",
		address: "0x1844b21593262668B7248d0f57a220CaaBA46ab9",
		decimals: 18
	},
	{
		symbol: "PRMI",
		address: "0x1351e42b173061168E7fBC6C032820fA4eaF3170",
		decimals: 18
	},
	{
		symbol: "PRN",
		address: "0x600E156B5d158033648C5963A2ed7042D5D240Ba",
		decimals: 18
	},
	{
		symbol: "PRO",
		address: "0x226bb599a12C826476e3A771454697EA52E9E220",
		decimals: 8
	},
	{
		symbol: "PRO",
		address: "0xCf2f184b317573103b19e9D0c0204c841d70fE04",
		decimals: 18
	},
	{
		symbol: "PROB",
		address: "0xfB559CE67Ff522ec0b9Ba7f5dC9dc7EF6c139803",
		decimals: 18
	},
	{
		symbol: "PROM",
		address: "0xfc82bb4ba86045Af6F327323a46E80412b91b27d",
		decimals: 18
	},
	{
		symbol: "PRON",
		address: "0xA3149E0fA0061A9007fAf307074cdCd290f0e2Fd",
		decimals: 8
	},
	{
		symbol: "PROPHET",
		address: "0x8D5DB0c1f0681071Cb38A382AE6704588D9DA587",
		decimals: 9
	},
	{
		symbol: "PROPS",
		address: "0x6fe56C0bcdD471359019FcBC48863d6c3e9d4F41",
		decimals: 18
	},
	{
		symbol: "PROS",
		address: "0x8642A849D0dcb7a15a974794668ADcfbe4794B56",
		decimals: 18
	},
	{
		symbol: "PROVE",
		address: "0x95DB29aCcE0DB3D3c9B0A1772Ec13Bd13138Cf3F",
		decimals: 18
	},
	{
		symbol: "PRPS",
		address: "0xb628Bc994e39CE264ECa6f6EE1620909816A9F12",
		decimals: 18
	},
	{
		symbol: "PRQ",
		address: "0xFE2786D7D1cCAb8B015f6Ef7392F67d778f8d8D7",
		decimals: 18
	},
	{
		symbol: "PRQ",
		address: "0x362bc847A3a9637d3af6624EeC853618a43ed7D2",
		decimals: 18
	},
	{
		symbol: "PRQBOOST",
		address: "0xa211F450Ce88deb31D3F12Ae3C1EBf6b0e55A5d9",
		decimals: 18
	},
	{
		symbol: "PRS",
		address: "0xe0D95530820aAfc51b1d98023AA1Ff000b78d8b2",
		decimals: 18
	},
	{
		symbol: "PRS",
		address: "0x163733bcc28dbf26B41a8CfA83e369b5B3af741b",
		decimals: 18
	},
	{
		symbol: "PRSP",
		address: "0x0C04d4f331DA8dF75f9E2e271E3f3F1494C66C36",
		decimals: 9
	},
	{
		symbol: "PRSTX",
		address: "0x00ad22AB1006FC282674887aFF1114e5aD14077d",
		decimals: 18
	},
	{
		symbol: "PRT",
		address: "0xA617E4728F216009b86354797d8d2305d3380179",
		decimals: 18
	},
	{
		symbol: "PS",
		address: "0x9686b875439dd142B0F2008b6596D6313a68a937",
		decimals: 18
	},
	{
		symbol: "PSC",
		address: "0x304E9847104B14628a56CfB3366CF9E94718b036",
		decimals: 18
	},
	{
		symbol: "PSDN",
		address: "0x5F85c60187aB233Ca6e750731D15e7eFd061fBdE",
		decimals: 18
	},
	{
		symbol: "PSHP",
		address: "0x88D59Ba796fDf639dEd3b5E720988D59fDb71Eb8",
		decimals: 18
	},
	{
		symbol: "PSK",
		address: "0x3F84c4184b35c488F7fe4A12469610C9B1CB03C9",
		decimals: 18
	},
	{
		symbol: "PSK",
		address: "0x1c5F43710a1776b0Ea7191b7Ead75D4B98D69858",
		decimals: 18
	},
	{
		symbol: "PSM",
		address: "0x1A66E09F7DccC10eAe46e27cfA6B8d44a50dF1E7",
		decimals: 18
	},
	{
		symbol: "PST",
		address: "0xE3feDAeCD47aa8EAb6b23227b0eE56F092C967a9",
		decimals: 18
	},
	{
		symbol: "PST",
		address: "0x5d4ABC77B8405aD177d8ac6682D584ecbFd46CEc",
		decimals: 18
	},
	{
		symbol: "PT",
		address: "0xE26d6d83d8607AB016E3f8a5B00D91B0C9731840",
		decimals: 8
	},
	{
		symbol: "PT",
		address: "0x66497A283E0a007bA3974e837784C6AE323447de",
		decimals: 18
	},
	{
		symbol: "PTC",
		address: "0x27E627d032593fE2A8EbBB30f3B1264B3b51a707",
		decimals: 18
	},
	{
		symbol: "PTC",
		address: "0x2a8E98e256f32259b5E5Cb55Dd63C8e891950666",
		decimals: 18
	},
	{
		symbol: "PTC",
		address: "0x4F818A843580a16a1C3dF50bC4C059C027f60701",
		decimals: 18
	},
	{
		symbol: "PTE",
		address: "0x51Bb9c623226CE781F4A54FC8F4A530a47142b6B",
		decimals: 18
	},
	{
		symbol: "PTEN.CX",
		address: "0x5F9b347Cdd2B35B346BA98ad35a9F367432A41b9",
		decimals: 8
	},
	{
		symbol: "PTERIA",
		address: "0x02Eca910CB3A7D43eBC7e8028652ed5C6b70259B",
		decimals: 18
	},
	{
		symbol: "PTF",
		address: "0xC57d533c50bC22247d49a368880fb49a1caA39F7",
		decimals: 18
	},
	{
		symbol: "PTM",
		address: "0x7c32DB0645A259FaE61353c1f891151A2e7f8c1e",
		decimals: 18
	},
	{
		symbol: "PTN",
		address: "0xFE76BE9cEC465ed3219a9972c21655D57d21aec6",
		decimals: 18
	},
	{
		symbol: "PTON",
		address: "0x4946583c5b86E01cCD30c71a05617D06E3E73060",
		decimals: 18
	},
	{
		symbol: "PTON.CX",
		address: "0xEF1223208d93D7c4934C2D426D939a9a0B917b6E",
		decimals: 8
	},
	{
		symbol: "PTOY",
		address: "0x8Ae4BF2C33a8e667de34B54938B0ccD03Eb8CC06",
		decimals: 8
	},
	{
		symbol: "PTS",
		address: "0x540e5fFF293f523Acd26291b5bC7ac5713991FEb",
		decimals: 8
	},
	{
		symbol: "PTS",
		address: "0x16b00b9d7b54406625EED1044E009b5a4B3AD710",
		decimals: 18
	},
	{
		symbol: "PTT",
		address: "0x4689a4e169eB39cC9078C0940e21ff1Aa8A39B9C",
		decimals: 18
	},
	{
		symbol: "PTWO",
		address: "0x5512e1D6A7BE424b4323126B4f9E86D023F95764",
		decimals: 18
	},
	{
		symbol: "PUC",
		address: "0xEf6B4cE8C9Bc83744fbcdE2657b32eC18790458A",
		decimals: 0
	},
	{
		symbol: "PUN",
		address: "0x32eb7Fa944aD61b0CF093499aF12f35A479315a2",
		decimals: 18
	},
	{
		symbol: "PUNDIX",
		address: "0x0FD10b9899882a6f2fcb5c371E17e70FdEe00C38",
		decimals: 18
	},
	{
		symbol: "PUNT",
		address: "0x6f3Bb1fEBc415183Dec801D78B1F92eDa200Fe3E",
		decimals: 18
	},
	{
		symbol: "PURE",
		address: "0x2904b9b16652d7d0408EcCfA23A19D4A3358230f",
		decimals: 18
	},
	{
		symbol: "pUSD",
		address: "0x93d3296cac208422BF587c3597D116e809870f2b",
		decimals: 8
	},
	{
		symbol: "PUSD",
		address: "0x38D389C300357A26Beec198F3893fbA54FDe69C5",
		decimals: 18
	},
	{
		symbol: "PUX",
		address: "0xE277aC35F9D327A670c1A3F3eeC80a83022431e4",
		decimals: 8
	},
	{
		symbol: "PVB",
		address: "0xcb324E4C8c1561D547c38Bd1d4A3B12a405B8019",
		decimals: 18
	},
	{
		symbol: "PVG",
		address: "0x6F0b09BFa87410aB993291Ec5f8CDa81f1D2acd9",
		decimals: 18
	},
	{
		symbol: "PVT",
		address: "0x7869c4A1a3f6F8684FBCC422a21aD7Abe3167834",
		decimals: 18
	},
	{
		symbol: "PWMC",
		address: "0xB6098082cc5B21E3CF89e802DD2343455B545C3B",
		decimals: 8
	},
	{
		symbol: "PWV",
		address: "0x8f66A173696502A0aD280781C3e55928A06c1312",
		decimals: 18
	},
	{
		symbol: "PWZ",
		address: "0x86B9018BD65629E047d4bEE2a96cbeA8931D6Ea1",
		decimals: 18
	},
	{
		symbol: "PXC",
		address: "0xC27C95350eCD634C80dF89db0f10cd5c24B7B11f",
		decimals: 2
	},
	{
		symbol: "PXG",
		address: "0x47e67BA66b0699500f18A53F94E2b9dB3D47437e",
		decimals: 18
	},
	{
		symbol: "PXG",
		address: "0x91bb6965BACE45baE7E78Ae638152Af467F9b004",
		decimals: 18
	},
	{
		symbol: "PXL",
		address: "0xF88951D7B676798705fd3a362ba5B1DBca2B233b",
		decimals: 18
	},
	{
		symbol: "PXL",
		address: "0x9BC0B36CdEdADB9ae906F53bdEa6deBe20b81b8E",
		decimals: 0
	},
	{
		symbol: "PXP",
		address: "0x8f179114235842978D8917e08721541072C46584",
		decimals: 3
	},
	{
		symbol: "PXT",
		address: "0xaf146FBD319CA7aE178cAA2C9D80a2db6B944350",
		decimals: 18
	},
	{
		symbol: "PXT",
		address: "0xc14830E53aA344E8c14603A91229A0b925b0B262",
		decimals: 8
	},
	{
		symbol: "PXU",
		address: "0x11905B73cc08C6d96A9012b4EdF45b03243503b8",
		decimals: 2
	},
	{
		symbol: "PXUSD-MAR2021",
		address: "0xf93340b1a3aDf7eedcAEc25Fae8171D4b736e89F",
		decimals: 18
	},
	{
		symbol: "PXUSD-OCT2020",
		address: "0xDaFF85B6f5787b2d9eE11CCDf5e852816063326A",
		decimals: 18
	},
	{
		symbol: "PYC",
		address: "0x19037B591cE06e7cd1b990146697466A23b165bF",
		decimals: 18
	},
	{
		symbol: "PYD",
		address: "0xE8f8378f02DD54153aA21d93673F291322222714",
		decimals: 18
	},
	{
		symbol: "PYLNT",
		address: "0x7703C35CfFdC5CDa8D27aa3df2F9ba6964544b6e",
		decimals: 18
	},
	{
		symbol: "PYLON",
		address: "0xD7B7d3C0bdA57723Fb54ab95Fd8F9EA033AF37f2",
		decimals: 18
	},
	{
		symbol: "PYN",
		address: "0x0142C3B2fC51819B5aF5dFc4AA52Df9722790851",
		decimals: 18
	},
	{
		symbol: "PYPL.CX",
		address: "0x26ea73221553a1a1Cc07cB8f351839b299DCc9F8",
		decimals: 8
	},
	{
		symbol: "PYR",
		address: "0x9534ad65fb398E27Ac8F4251dAe1780B989D136e",
		decimals: 18
	},
	{
		symbol: "PYRO",
		address: "0x14409B0Fc5C7f87b5DAd20754fE22d29A3dE8217",
		decimals: 18
	},
	{
		symbol: "PZT",
		address: "0xa68B177677452C6858440ca1b5bfcE1fAaEAA98F",
		decimals: 18
	},
	{
		symbol: "QASH",
		address: "0x618E75Ac90b12c6049Ba3b27f5d5F8651b0037F6",
		decimals: 6
	},
	{
		symbol: "QAU",
		address: "0x671AbBe5CE652491985342e85428EB1b07bC6c64",
		decimals: 8
	},
	{
		symbol: "QBIT",
		address: "0x1602af2C782cC03F9241992E243290Fccf73Bb13",
		decimals: 18
	},
	{
		symbol: "QBX",
		address: "0x2467AA6B5A2351416fD4C3DeF8462d841feeecEC",
		decimals: 18
	},
	{
		symbol: "QCH",
		address: "0x687BfC3E73f6af55F0CccA8450114D107E781a0e",
		decimals: 18
	},
	{
		symbol: "QCOM.CX",
		address: "0x4E6c19aA53F0E4F8E1C53d8CB14CD81767Dff5Cd",
		decimals: 8
	},
	{
		symbol: "QCSS",
		address: "0x27D16A670BeC2e2dB9E0Ca367AAEe6758d2cb3c7",
		decimals: 18
	},
	{
		symbol: "QCX",
		address: "0xF9e5aF7B42D31D51677c75bbBD37c1986eC79AEE",
		decimals: 8
	},
	{
		symbol: "QDAO",
		address: "0x3166C570935a7D8554c8f4eA792ff965D2EFe1f2",
		decimals: 18
	},
	{
		symbol: "QDEFI",
		address: "0xfee4DBe2751bF8d1B1B861aAF9664961F19Ce91A",
		decimals: 18
	},
	{
		symbol: "QHC",
		address: "0x5df94780f00140FE72d239D0D261f7797E3Fbd1B",
		decimals: 18
	},
	{
		symbol: "QKC",
		address: "0xEA26c4aC16D4a5A106820BC8AEE85fd0b7b2b664",
		decimals: 18
	},
	{
		symbol: "QNT",
		address: "0x4a220E6096B25EADb88358cb44068A3248254675",
		decimals: 18
	},
	{
		symbol: "QNTU",
		address: "0x4234f63B1D202F6c016Ca3b6a0d41d7d85f17716",
		decimals: 18
	},
	{
		symbol: "QOS",
		address: "0x7b188A8b3A2113621895Fb35fC67a779CAFFA92D",
		decimals: 4
	},
	{
		symbol: "QQBC",
		address: "0xA2B47Bc1f3E58C30D7744EF1194E2dbB4363e287",
		decimals: 18
	},
	{
		symbol: "QQQ",
		address: "0x2822f6D1B2f41F93f33d937bc7d84A8Dfa4f4C21",
		decimals: 18
	},
	{
		symbol: "QRG",
		address: "0xFFAA5ffc455d9131f8A2713A741fD1960330508B",
		decimals: 18
	},
	{
		symbol: "QRL",
		address: "0x697beac28B09E122C4332D163985e8a73121b97F",
		decimals: 8
	},
	{
		symbol: "QRVO.CX",
		address: "0xf237f9Cb687857b41FA88A141793115f1af9AC80",
		decimals: 8
	},
	{
		symbol: "QRX",
		address: "0x6e0daDE58D2d89eBBe7aFc384e3E4f15b70b14D8",
		decimals: 18
	},
	{
		symbol: "QSP",
		address: "0x99ea4dB9EE77ACD40B119BD1dC4E33e1C070b80d",
		decimals: 18
	},
	{
		symbol: "QTB",
		address: "0x1e8c423b2e8AAE409280c696c5acDA62F7E6F23C",
		decimals: 18
	},
	{
		symbol: "QTC",
		address: "0x923C90B98ee834D118c85DDf44906EE1769Df648",
		decimals: 6
	},
	{
		symbol: "QTC",
		address: "0x19131a8aE42E32c747c1EAd318Fadb98B0be45B7",
		decimals: 18
	},
	{
		symbol: "QTCON",
		address: "0x1bF7Fd22709733cCD7c45AB27Dd02C7EC8E50078",
		decimals: 18
	},
	{
		symbol: "QTQ",
		address: "0x2C3C1F05187dBa7A5f2Dd47Dca57281C4d4F183F",
		decimals: 18
	},
	{
		symbol: "QTUM",
		address: "0x9a642d6b3368ddc662CA244bAdf32cDA716005BC",
		decimals: 18
	},
	{
		symbol: "QUAI",
		address: "0x40821CD074dfeCb1524286923bC69315075b5c89",
		decimals: 18
	},
	{
		symbol: "QUBE",
		address: "0x57838fF342f36A1EC18224981ea8715a4667fB3a",
		decimals: 18
	},
	{
		symbol: "QUICK",
		address: "0x6c28AeF8977c9B773996d0e8376d2EE379446F2f",
		decimals: 18
	},
	{
		symbol: "QUIN",
		address: "0x86E44543164D9b97B14ef7f6f3aB7bA670CAB346",
		decimals: 18
	},
	{
		symbol: "QUN",
		address: "0x264Dc2DedCdcbb897561A57CBa5085CA416fb7b4",
		decimals: 18
	},
	{
		symbol: "QURA",
		address: "0x4eE6E959d460dE47DfE58E5E6fBAB330Ce8484b6",
		decimals: 18
	},
	{
		symbol: "QVT",
		address: "0x1183F92A5624D68e85FFB9170F16BF0443B4c242",
		decimals: 18
	},
	{
		symbol: "R",
		address: "0x48f775EFBE4F5EcE6e0DF2f7b5932dF56823B990",
		decimals: 0
	},
	{
		symbol: "R.CX",
		address: "0xCf58e894042c41a72fBB3B57811b11F987e19741",
		decimals: 8
	},
	{
		symbol: "R2R",
		address: "0x688fF43c3c19e4714f0BeB76df8Ee394207Ab411",
		decimals: 18
	},
	{
		symbol: "RAC",
		address: "0x342Ba159F988F24f0b033F3cc5232377eE500543",
		decimals: 18
	},
	{
		symbol: "RAC",
		address: "0xc22B30E4cce6b78aaaADae91E44E73593929a3e9",
		decimals: 18
	},
	{
		symbol: "RAD",
		address: "0x31c8EAcBFFdD875c74b94b077895Bd78CF1E64A3",
		decimals: 18
	},
	{
		symbol: "RAD.CX",
		address: "0x07F064e5E36B8b06b4C825233945eC1B61BBA09f",
		decimals: 8
	},
	{
		symbol: "RAE",
		address: "0xE5a3229CCb22b6484594973A03a3851dCd948756",
		decimals: 18
	},
	{
		symbol: "RAI",
		address: "0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919",
		decimals: 18
	},
	{
		symbol: "RAI",
		address: "0x5B86b0d1C304C246282dEa0e0f21DB2bAa429b31",
		decimals: 8
	},
	{
		symbol: "RAIN",
		address: "0x61cDb66e56FAD942a7b5cE3F419FfE9375E31075",
		decimals: 18
	},
	{
		symbol: "RAISE",
		address: "0x10bA8C420e912bF07BEdaC03Aa6908720db04e0c",
		decimals: 18
	},
	{
		symbol: "RAK",
		address: "0xa8B0F154A688c22142E361707df64277e0A0bE66",
		decimals: 18
	},
	{
		symbol: "RAKU",
		address: "0x51BC0DeaF7bBE82bC9006b0c3531668a4206D27F",
		decimals: 18
	},
	{
		symbol: "RALLY",
		address: "0xe947b388fbE682784170B62F2Bd4665f9719a285",
		decimals: 18
	},
	{
		symbol: "RAMP",
		address: "0x33D0568941C0C64ff7e0FB4fbA0B11BD37deEd9f",
		decimals: 18
	},
	{
		symbol: "RAO",
		address: "0x45eDb535942a8C84D9f4b5D37e1b25F91Ea4804c",
		decimals: 18
	},
	{
		symbol: "RARE",
		address: "0x81B1bFD6CB9Ad42DB395c2a27F73D4DCf5777e2D",
		decimals: 4
	},
	{
		symbol: "RARE",
		address: "0x93dfaf57D986B9cA77Df9376c50878E013D9c7C8",
		decimals: 18
	},
	{
		symbol: "RARI",
		address: "0xFca59Cd816aB1eaD66534D82bc21E7515cE441CF",
		decimals: 18
	},
	{
		symbol: "RAS",
		address: "0x393fAC0773C765c80dc887451377d553C46F83b1",
		decimals: 18
	},
	{
		symbol: "RATING",
		address: "0xE8663A64A96169ff4d95b4299E7ae9a76b905B31",
		decimals: 8
	},
	{
		symbol: "RAUX",
		address: "0x68496eE825DAFE1cF66D4083f776B9eAAb31e447",
		decimals: 18
	},
	{
		symbol: "RAVE",
		address: "0x6A09e1b7cC5cb52FfdfC585a8dF51CED7063915C",
		decimals: 18
	},
	{
		symbol: "RAX",
		address: "0x468D58D6a52249844a166d0Ef045dbdD7Ce0c751",
		decimals: 18
	},
	{
		symbol: "RAYAX",
		address: "0x6750D0f2ba5f7F3A3eA555F734d5C109975Df1C7",
		decimals: 18
	},
	{
		symbol: "RAZ",
		address: "0xE99a76d5FB19Bc419D72F355050045fAD88E060f",
		decimals: 18
	},
	{
		symbol: "RAZE",
		address: "0x5Eaa69B29f99C84Fe5dE8200340b4e9b4Ab38EaC",
		decimals: 18
	},
	{
		symbol: "RAZOR",
		address: "0x50DE6856358Cc35f3A9a57eAAA34BD4cB707d2cd",
		decimals: 18
	},
	{
		symbol: "RBASE",
		address: "0xE8b251822d003a2b2466ee0E38391C2db2048739",
		decimals: 9
	},
	{
		symbol: "RBC",
		address: "0xF5078213B8D39E0eEC2011d9486C17ddF07eA003",
		decimals: 18
	},
	{
		symbol: "RBC",
		address: "0xE5bAfC0e45973259bCe6923eC884680867332447",
		decimals: 18
	},
	{
		symbol: "RBC",
		address: "0xA4EED63db85311E22dF4473f87CcfC3DaDCFA3E3",
		decimals: 18
	},
	{
		symbol: "RBD",
		address: "0x7105eC15995A97496eC25de36CF7eEc47b703375",
		decimals: 18
	},
	{
		symbol: "RBG",
		address: "0x0794ce7d4459105926Da230F318c1e34BC790517",
		decimals: 18
	},
	{
		symbol: "RBLX",
		address: "0xFc2C4D8f95002C14eD0a7aA65102Cac9e5953b5E",
		decimals: 18
	},
	{
		symbol: "RBPC",
		address: "0x050508637d2878755CB29B2bE4320aC24d5CE4FF",
		decimals: 18
	},
	{
		symbol: "RBTC",
		address: "0x7f65BE7FAd0c22813e51746E7e8f13a20bAa9411",
		decimals: 8
	},
	{
		symbol: "RC",
		address: "0x2Ff0a6868E80e0177295a3ebfcA75F9Bae074499",
		decimals: 18
	},
	{
		symbol: "RC20",
		address: "0x61B2d3eA9f1c6b387C985C73d40e8fBfb284E5C7",
		decimals: 18
	},
	{
		symbol: "RCC",
		address: "0x9b6443b0fB9C241A7fdAC375595cEa13e6B7807A",
		decimals: 18
	},
	{
		symbol: "RCCC",
		address: "0x33bFD20660eeAF952E8D5Bc3236E1918701F17D0",
		decimals: 18
	},
	{
		symbol: "RCKT",
		address: "0x78571acCAf24052795F98B11F093b488a2d9EAA4",
		decimals: 18
	},
	{
		symbol: "RCKT",
		address: "0xbD03BD923c7D51019Fd84571D84e4eBcf7213509",
		decimals: 18
	},
	{
		symbol: "RCN",
		address: "0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6",
		decimals: 18
	},
	{
		symbol: "RCT",
		address: "0x13f25cd52b21650caa8225C9942337d914C9B030",
		decimals: 18
	},
	{
		symbol: "RDAI",
		address: "0x261b45D85cCFeAbb11F022eBa346ee8D1cd488c0",
		decimals: 18
	},
	{
		symbol: "RDC",
		address: "0x7A74c427c833baD2A638E0fb203BA2C728f557C1",
		decimals: 18
	},
	{
		symbol: "RDC",
		address: "0x840086881Facb1E8C222Fa5DEB2f93F238B0bA95",
		decimals: 18
	},
	{
		symbol: "RDN",
		address: "0x255Aa6DF07540Cb5d3d297f0D0D4D84cb52bc8e6",
		decimals: 18
	},
	{
		symbol: "RDT",
		address: "0x2f6d747528654e489cb0282a51DC08Fd3a7B2A85",
		decimals: 18
	},
	{
		symbol: "RDV",
		address: "0xd967d9F941CD316Ab238d3EE761F80b7cAec7819",
		decimals: 18
	},
	{
		symbol: "REA",
		address: "0x767bA2915EC344015a7938E3eEDfeC2785195D05",
		decimals: 18
	},
	{
		symbol: "READ",
		address: "0x13d0bf45e5F319Fa0B58900807049f23caE7C40D",
		decimals: 8
	},
	{
		symbol: "REAL",
		address: "0x9214eC02CB71CbA0ADA6896b8dA260736a67ab10",
		decimals: 18
	},
	{
		symbol: "REAL",
		address: "0x6b4389Afb3e243A65668B7311fA9Ef092A8a3B64",
		decimals: 18
	},
	{
		symbol: "REALTOKEN-10024-10028-APPOLINE-ST-DETROIT-MI",
		address: "0x5807CA447851C98569c567963B25B1C83D41BeBc",
		decimals: 18
	},
	{
		symbol: "REALTOKEN-15634-LIBERAL-ST-DETROIT-MI",
		address: "0xbEcaeA7Aa3629d4B7DdCcf3A973Bef09Ff34d4b6",
		decimals: 18
	},
	{
		symbol: "REALTOKEN-16200-FULLERTON-AVE-DETROIT-MI",
		address: "0x22C8ECF727C23422f47093b562EC53c139805301",
		decimals: 18
	},
	{
		symbol: "REALTOKEN-18276-APPOLINE-ST-DETROIT-MI",
		address: "0xfC89f1b932079b462Ef9C8757dE5A28E387b847b",
		decimals: 18
	},
	{
		symbol: "REALTOKEN-18900-MANSFIELD-ST-DETROIT-MI",
		address: "0x22CaBb38295eaeccFedE4e99AF508052e3B74cA0",
		decimals: 18
	},
	{
		symbol: "REALTOKEN-20200-LESURE-ST-DETROIT-MI",
		address: "0x395C47a421C254AE42253764A7f56e0Ee0CDDac5",
		decimals: 18
	},
	{
		symbol: "REALTOKEN-25097-ANDOVER-DR-DEARBORN-MI",
		address: "0x74d2cb65B1158300c3e6BeA149d68509C7B2425d",
		decimals: 18
	},
	{
		symbol: "REALTOKEN-5942-AUDUBON-RD-DETROIT-MI",
		address: "0x43688910273f199B8AE2cA018c13918fb3D37B58",
		decimals: 18
	},
	{
		symbol: "REALTOKEN-8342-SCHAEFER-HWY-DETROIT-MI",
		address: "0x6Fd016CCc4611F7BAB1DD3267334cB0216Ef47f9",
		decimals: 18
	},
	{
		symbol: "REALTOKEN-9336-PATTON-ST-DETROIT-MI",
		address: "0xeD42CeDcADbFbCAA3E6F411B09567C2C0b5AD28F",
		decimals: 18
	},
	{
		symbol: "REALTOKEN-9943-MARLOWE-ST-DETROIT-MI",
		address: "0xE5f7ef61443Fc36AE040650aa585B0395AEf77c8",
		decimals: 18
	},
	{
		symbol: "REAP",
		address: "0x1fc5EF0337AEA85C5f9198853a6E3A579a7A6987",
		decimals: 18
	},
	{
		symbol: "REBL",
		address: "0x5F53f7A8075614b699Baad0bC2c899f4bAd8FBBF",
		decimals: 18
	},
	{
		symbol: "RED",
		address: "0x76960Dccd5a1fe799F7c29bE9F19ceB4627aEb2f",
		decimals: 18
	},
	{
		symbol: "REDC",
		address: "0xB563300A3BAc79FC09B93b6F84CE0d4465A2AC27",
		decimals: 18
	},
	{
		symbol: "REEF",
		address: "0xFE3E6a25e6b192A42a44ecDDCd13796471735ACf",
		decimals: 18
	},
	{
		symbol: "REF",
		address: "0x89303500a7Abfb178B274FD89F2469C264951e1f",
		decimals: 8
	},
	{
		symbol: "REL",
		address: "0x61bFC979EA8160Ede9b862798B7833a97baFa02a",
		decimals: 18
	},
	{
		symbol: "REL",
		address: "0xb6c4267C4877BB0D6b1685Cfd85b0FBe82F105ec",
		decimals: 18
	},
	{
		symbol: "REM",
		address: "0x83984d6142934bb535793A82ADB0a46EF0F66B6d",
		decimals: 4
	},
	{
		symbol: "REMI",
		address: "0x13cb85823f78Cff38f0B0E90D3e975b8CB3AAd64",
		decimals: 18
	},
	{
		symbol: "REN",
		address: "0x408e41876cCCDC0F92210600ef50372656052a38",
		decimals: 18
	},
	{
		symbol: "RENBCH",
		address: "0x459086F2376525BdCebA5bDDA135e4E9d3FeF5bf",
		decimals: 8
	},
	{
		symbol: "RENBTC",
		address: "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D",
		decimals: 8
	},
	{
		symbol: "RENBTCCURVE",
		address: "0x49849C98ae39Fff122806C06791Fa73784FB3675",
		decimals: 18
	},
	{
		symbol: "RENZEC",
		address: "0x1C5db575E2Ff833E46a2E9864C22F4B22E0B37C2",
		decimals: 8
	},
	{
		symbol: "REP",
		address: "0x1985365e9f78359a9B6AD760e32412f4a445E862",
		decimals: 18
	},
	{
		symbol: "REP",
		address: "0x221657776846890989a759BA2973e427DfF5C9bB",
		decimals: 18
	},
	{
		symbol: "REQ",
		address: "0x8f8221aFbB33998d8584A2B05749bA73c37a938a",
		decimals: 18
	},
	{
		symbol: "RES",
		address: "0xEBBBE2ae55C9B2E21B09239362f3eee69455934d",
		decimals: 8
	},
	{
		symbol: "RES",
		address: "0x0a9f693FcE6F00A51A8e0db4351B5a8078B4242e",
		decimals: 5
	},
	{
		symbol: "RESH",
		address: "0xbf85479AbcF60328cd7224f43ecD71e2f9A282f8",
		decimals: 18
	},
	{
		symbol: "RET",
		address: "0xD7394087E1DBBE477FE4F1CF373B9Ac9459565fF",
		decimals: 8
	},
	{
		symbol: "REV",
		address: "0x2ef52Ed7De8c5ce03a4eF0efbe9B7450F2D7Edc9",
		decimals: 6
	},
	{
		symbol: "REVV",
		address: "0x557B933a7C2c45672B610F8954A3deB39a51A8Ca",
		decimals: 18
	},
	{
		symbol: "REX",
		address: "0xf05a9382A4C3F29E2784502754293D88b835109C",
		decimals: 18
	},
	{
		symbol: "RF",
		address: "0xD3f04e421771e92A5026AfFDdA5AbA80952917a0",
		decimals: 8
	},
	{
		symbol: "RFCTR",
		address: "0x16B1eb8b8E9058800bF0bA3684F805A6711a1D2c",
		decimals: 9
	},
	{
		symbol: "RFI",
		address: "0xA1AFFfE3F4D611d252010E3EAf6f4D77088b0cd7",
		decimals: 9
	},
	{
		symbol: "RFOX",
		address: "0xa1d6Df714F91DeBF4e0802A542E13067f31b8262",
		decimals: 18
	},
	{
		symbol: "RFR",
		address: "0xe0bDaafD0aAb238c55d68ad54E616305D4a21772",
		decimals: 9
	},
	{
		symbol: "RFR",
		address: "0xd0929d411954c47438dc1d871dd6081F5C5e149c",
		decimals: 4
	},
	{
		symbol: "RFUEL",
		address: "0xaf9f549774ecEDbD0966C52f250aCc548D3F36E5",
		decimals: 18
	},
	{
		symbol: "RFX",
		address: "0x159A1dFAe19057de57dFfFcbB3DA1aE784678965",
		decimals: 8
	},
	{
		symbol: "RFX",
		address: "0xf4c571fb6DD704E58561Cdd275fa4B80cFe82f76",
		decimals: 8
	},
	{
		symbol: "RGC",
		address: "0x5850700E214c16C73d1778B2886C01639e69faA3",
		decimals: 18
	},
	{
		symbol: "RGLS",
		address: "0xC25Cb249d4f6b8F2e69f58703F03e76523b081B0",
		decimals: 18
	},
	{
		symbol: "RGS",
		address: "0x4c383bDCae52a6e1cb810C76C70d6f31A249eC9B",
		decimals: 8
	},
	{
		symbol: "RGT",
		address: "0xD291E7a03283640FDc51b121aC401383A46cC623",
		decimals: 18
	},
	{
		symbol: "RH.CX",
		address: "0x895311Ca2EB28BD839dCfe63C542304aAD1Bb3c3",
		decimals: 8
	},
	{
		symbol: "RHEA",
		address: "0xf7A219FFFeaDe6Cd98789da5642b687F743270Eb",
		decimals: 18
	},
	{
		symbol: "RHOC",
		address: "0x168296bb09e24A88805CB9c33356536B980D3fC5",
		decimals: 8
	},
	{
		symbol: "RING",
		address: "0x9469D013805bFfB7D3DEBe5E7839237e535ec483",
		decimals: 18
	},
	{
		symbol: "RINGX",
		address: "0x7F86C782EC802ac402e0369d2E6d500256F7abC5",
		decimals: 18
	},
	{
		symbol: "RIO",
		address: "0xf21661D0D1d76d3ECb8e1B9F1c923DBfffAe4097",
		decimals: 18
	},
	{
		symbol: "RIPT",
		address: "0xdd007278B667F6bef52fD0a4c23604aA1f96039a",
		decimals: 8
	},
	{
		symbol: "RIT",
		address: "0x448a47359833b26e5AA988dDB7A72099F6242170",
		decimals: 18
	},
	{
		symbol: "RIYA",
		address: "0x0b1724cc9FDA0186911EF6a75949e9c0d3F0f2F3",
		decimals: 8
	},
	{
		symbol: "RKC",
		address: "0x6cCB56947eA1d6eFdc81ACfbAcd8263DDFa9b202",
		decimals: 18
	},
	{
		symbol: "RKN",
		address: "0x6E5a43DB10b04701385A34afb670E404bC7Ea597",
		decimals: 12
	},
	{
		symbol: "RKT",
		address: "0x106Aa49295B525fcf959aA75eC3f7dCbF5352f1C",
		decimals: 18
	},
	{
		symbol: "RLC",
		address: "0x607F4C5BB672230e8672085532f7e901544a7375",
		decimals: 9
	},
	{
		symbol: "RLD",
		address: "0xd1632eFa392925089785B43410C529F8959A8D9A",
		decimals: 8
	},
	{
		symbol: "RLR",
		address: "0x0E3EF895c59E7Db27214AB5bbf56347cE115A3f4",
		decimals: 18
	},
	{
		symbol: "RLR",
		address: "0x5b3F693EfD5710106eb2Eac839368364aCB5a70f",
		decimals: 18
	},
	{
		symbol: "RLT",
		address: "0xcCeD5B8288086BE8c38E23567e684C3740be4D48",
		decimals: 10
	},
	{
		symbol: "RLTY",
		address: "0xbe99B09709fc753b09BCf557A992F6605D5997B0",
		decimals: 8
	},
	{
		symbol: "RLX",
		address: "0x4A42d2c580f83dcE404aCad18dab26Db11a1750E",
		decimals: 18
	},
	{
		symbol: "RLX",
		address: "0x7fc693B16184B6778f4534f5410F06633Cb030e0",
		decimals: 6
	},
	{
		symbol: "RLY",
		address: "0xf1f955016EcbCd7321c7266BccFB96c68ea5E49b",
		decimals: 18
	},
	{
		symbol: "RM",
		address: "0x5AB55ec290BeacAE98f54c3eB70860460B167C3C",
		decimals: 18
	},
	{
		symbol: "RMC",
		address: "0x7Dc4f41294697a7903C4027f6Ac528C5d14cd7eB",
		decimals: 8
	},
	{
		symbol: "RMD.CX",
		address: "0x6489006B7D23b15C777c8690d01D46d98ae8DCE3",
		decimals: 8
	},
	{
		symbol: "RMESH",
		address: "0x8D5682941cE456900b12d47ac06a88b47C764CE1",
		decimals: 18
	},
	{
		symbol: "RMPL",
		address: "0xE17f017475a709De58E976081eB916081ff4c9d5",
		decimals: 9
	},
	{
		symbol: "RNDR",
		address: "0x0996bFb5D057faa237640E2506BE7B4f9C46de0B",
		decimals: 18
	},
	{
		symbol: "RNDR",
		address: "0x6De037ef9aD2725EB40118Bb1702EBb27e4Aeb24",
		decimals: 18
	},
	{
		symbol: "RNG",
		address: "0xBa7234570fCdAc6954156c13fB1D167890549Cd2",
		decimals: 4
	},
	{
		symbol: "RNO",
		address: "0x23a86B3c53E7C7878D6B908F53c8fd31596CdE7b",
		decimals: 18
	},
	{
		symbol: "RNO.CX",
		address: "0xB90E7EB29f5Db631c13838411cC58bB2d1475810",
		decimals: 8
	},
	{
		symbol: "RNT",
		address: "0xFF603F43946A3A28DF5E6A73172555D8C8b02386",
		decimals: 18
	},
	{
		symbol: "RNTB",
		address: "0x1FE70bE734e473e5721ea57C8B5B01e6Caa52686",
		decimals: 18
	},
	{
		symbol: "RNX",
		address: "0x72a6344185B383035d6665C3f44a9DfCC73873c8",
		decimals: 18
	},
	{
		symbol: "ROBET",
		address: "0x2344871f523cBb28A4f60045531184cF1F03Ad24",
		decimals: 18
	},
	{
		symbol: "ROBOT",
		address: "0xfb5453340C03db5aDe474b27E68B6a9c6b2823Eb",
		decimals: 18
	},
	{
		symbol: "ROC",
		address: "0x1BcBc54166F6bA149934870b60506199b6C9dB6D",
		decimals: 10
	},
	{
		symbol: "ROCK",
		address: "0xA40106134c5bF4c41411554e6db99B95A15ed9d8",
		decimals: 18
	},
	{
		symbol: "ROCK2",
		address: "0xC16b542ff490e01fcc0DC58a60e1EFdc3e357cA6",
		decimals: 0
	},
	{
		symbol: "Rock2Pay",
		address: "0x0E3de3B0E3D617FD8D1D8088639bA877feb4d742",
		decimals: 18
	},
	{
		symbol: "ROCKS",
		address: "0x0829d2d5cC09d3d341E813c821B0cfAE272D9fb2",
		decimals: 18
	},
	{
		symbol: "ROCKS",
		address: "0x92ecE48522E1aCbcda4Aaa8C2fBF2Aa9FB15D624",
		decimals: 18
	},
	{
		symbol: "ROK",
		address: "0xc9De4B7F0C3d991e967158E4D4bFA4b51Ec0b114",
		decimals: 18
	},
	{
		symbol: "ROKU.CX",
		address: "0x94bED3c94123AF8CebdB6c025240043FCeB8dbf5",
		decimals: 8
	},
	{
		symbol: "ROLC",
		address: "0x64a31C2F28e194e670666711117314784FDc5c6C",
		decimals: 18
	},
	{
		symbol: "ROM",
		address: "0xacACa5b8805636608e14C64b0bFFfC2Deb2C6cEc",
		decimals: 18
	},
	{
		symbol: "ROMTV",
		address: "0x5301E9F1B9156e600af0E08ad57A6e725A6cD479",
		decimals: 18
	},
	{
		symbol: "RON",
		address: "0x23f043426b2336E723B32FB3BF4A1cA410F7c49a",
		decimals: 18
	},
	{
		symbol: "ROOBEE",
		address: "0xA31B1767e09f842ECFd4bc471Fe44F830E3891AA",
		decimals: 18
	},
	{
		symbol: "ROOK",
		address: "0xfA5047c9c78B8877af97BDcb85Db743fD7313d4a",
		decimals: 18
	},
	{
		symbol: "ROOM",
		address: "0xAd4f86a25bbc20FfB751f2FAC312A0B4d8F88c64",
		decimals: 18
	},
	{
		symbol: "ROOT",
		address: "0xCb5f72d37685C3D5aD0bB5F982443BC8FcdF570E",
		decimals: 18
	},
	{
		symbol: "ROT",
		address: "0xD04785C4d8195e4A54d9dEc3a9043872875ae9E2",
		decimals: 18
	},
	{
		symbol: "ROTO",
		address: "0x0e3129B3FDe4a458B7910A2602E92AC533B9400e",
		decimals: 18
	},
	{
		symbol: "ROUND",
		address: "0x4993CB95c7443bdC06155c5f5688Be9D8f6999a5",
		decimals: 18
	},
	{
		symbol: "ROUTE",
		address: "0x16ECCfDbb4eE1A85A33f3A9B21175Cd7Ae753dB4",
		decimals: 18
	},
	{
		symbol: "ROX",
		address: "0x574F84108a98c575794F75483d801d1d5DC861a5",
		decimals: 18
	},
	{
		symbol: "ROYA",
		address: "0x7eaF9C89037e4814DC0d9952Ac7F888C784548DB",
		decimals: 18
	},
	{
		symbol: "ROZ",
		address: "0xE55CC44C0Cf9CEDE2d68f9432cBeeAfA6357ed92",
		decimals: 8
	},
	{
		symbol: "RPC",
		address: "0xf18aF466F8885f9Ea93D2b85c47a427cB01bAD52",
		decimals: 18
	},
	{
		symbol: "RPE",
		address: "0xCcc85AA8999505d6f886A32da4a107BBe0D1dE9E",
		decimals: 18
	},
	{
		symbol: "RPEPE",
		address: "0x0e9b56D2233ea2b5883861754435f9C51Dbca141",
		decimals: 18
	},
	{
		symbol: "RPL",
		address: "0xB4EFd85c19999D84251304bDA99E90B92300Bd93",
		decimals: 18
	},
	{
		symbol: "RPM",
		address: "0x490c95bE16384E1f28B9e864e98fFEcFCBfF386d",
		decimals: 18
	},
	{
		symbol: "RPZX",
		address: "0x68350d30D9F58C81aaaA41929f1bfC52FFf4Ea49",
		decimals: 18
	},
	{
		symbol: "RRW",
		address: "0x15771207D92B34F585BAE076dCf3fB34418afDCD",
		decimals: 5
	},
	{
		symbol: "RSP",
		address: "0xcf42De80d80edC4a8D56E4e840b5FF0Dc84AaA17",
		decimals: 18
	},
	{
		symbol: "RSPT",
		address: "0x016bf078ABcaCB987f0589a6d3BEAdD4316922B0",
		decimals: 18
	},
	{
		symbol: "RSR",
		address: "0x8762db106B2c2A0bccB3A80d1Ed41273552616E8",
		decimals: 18
	},
	{
		symbol: "RST",
		address: "0xA17d1bF14802e0EEc8F84b3b8B638A9402D60e9e",
		decimals: 10
	},
	{
		symbol: "RSV",
		address: "0x1C5857e110CD8411054660F60B5De6a6958CfAE2",
		decimals: 18
	},
	{
		symbol: "RSV",
		address: "0x196f4727526eA7FB1e17b2071B3d8eAA38486988",
		decimals: 18
	},
	{
		symbol: "RSX",
		address: "0x7D34C87C34a12f80912c452c528dbD24d8520E69",
		decimals: 18
	},
	{
		symbol: "RT",
		address: "0x6028D881eEA57C18255A85809cdd7F212688d946",
		decimals: 18
	},
	{
		symbol: "RTB",
		address: "0xEC491c1088Eae992B7A214efB0a266AD0927A72A",
		decimals: 18
	},
	{
		symbol: "RTC",
		address: "0x7A5599B97E8c4abB5dd06EBA0E9d1F75AF818DB9",
		decimals: 18
	},
	{
		symbol: "RTC",
		address: "0x7f9A00E03c2E53A3aF6031C17A150DBeDaAab3dC",
		decimals: 18
	},
	{
		symbol: "RTD",
		address: "0x003FfEFeFBC4a6F34a62A3cA7b7937a880065BCB",
		decimals: 18
	},
	{
		symbol: "RTE",
		address: "0x436F0F3a982074c4a05084485D421466a994FE53",
		decimals: 18
	},
	{
		symbol: "RTH",
		address: "0x3FD8f39A962eFDA04956981C31AB89FAB5FB8bC8",
		decimals: 18
	},
	{
		symbol: "RTK",
		address: "0x1F6DEADcb526c4710Cf941872b86dcdfBbBD9211",
		decimals: 18
	},
	{
		symbol: "RTK",
		address: "0x1F6deadDc2a81704a206Fd587D8e3643BD2d449c",
		decimals: 18
	},
	{
		symbol: "RTL",
		address: "0xb92f51CE4045212EeF8008C2f665DA713035267B",
		decimals: 18
	},
	{
		symbol: "RTN",
		address: "0x54b293226000ccBFC04DF902eEC567CB4C35a903",
		decimals: 18
	},
	{
		symbol: "RTX",
		address: "0x4d28ebe3c79B682B9870CF68B31bFF4D8A133E91",
		decimals: 18
	},
	{
		symbol: "RUFF",
		address: "0xf278c1CA969095ffddDED020290cf8B5C424AcE2",
		decimals: 18
	},
	{
		symbol: "RUGZ",
		address: "0xEdFBd6c48c3dDfF5612Ade14B45bb19F916809ba",
		decimals: 18
	},
	{
		symbol: "RUNE",
		address: "0xdEE02D94be4929d26f67B64Ada7aCf1914007F10",
		decimals: 18
	},
	{
		symbol: "RUNE",
		address: "0x3155BA85D5F96b2d030a4966AF206230e46849cb",
		decimals: 18
	},
	{
		symbol: "RVT",
		address: "0x3d1BA9be9f66B8ee101911bC36D3fB562eaC2244",
		decimals: 18
	},
	{
		symbol: "RWS",
		address: "0x08AD83D779BDf2BBE1ad9cc0f78aa0D24AB97802",
		decimals: 18
	},
	{
		symbol: "RXE",
		address: "0x9317ae2dC3313ae2177910cEBc3feAccBba2E824",
		decimals: 6
	},
	{
		symbol: "RYLT",
		address: "0xd30a2e9347Ad48Ea208ee563a9CdfD80E962a727",
		decimals: 18
	},
	{
		symbol: "RZN",
		address: "0xd8c82FbC4D8Ed0644a7eC04cF973e84c6153c1d7",
		decimals: 18
	},
	{
		symbol: "S",
		address: "0x96B0bF939D9460095C15251F71Fda11e41DcBddB",
		decimals: 18
	},
	{
		symbol: "S-A-PAT",
		address: "0x1EC8fE51a9B6A3a6C427D17d9ECC3060fbc4a45c",
		decimals: 18
	},
	{
		symbol: "S-ETH",
		address: "0x3eb91D237e491E0DEE8582c402D85CB440fb6b54",
		decimals: 18
	},
	{
		symbol: "S.CX",
		address: "0x0081220D4fEEF7c333BB3e8f67F0Bc09aFBA6FCb",
		decimals: 8
	},
	{
		symbol: "SAC",
		address: "0xabC1280A0187a2020cC675437aed400185F86Db6",
		decimals: 18
	},
	{
		symbol: "SADA",
		address: "0xe36E2D3c7c34281FA3bC737950a68571736880A1",
		decimals: 18
	},
	{
		symbol: "SAFE",
		address: "0x1Aa61c196E76805fcBe394eA00e4fFCEd24FC469",
		decimals: 18
	},
	{
		symbol: "SAFE2",
		address: "0x250a3500f48666561386832f1F1f1019b89a2699",
		decimals: 18
	},
	{
		symbol: "SAFT",
		address: "0xa2b72FF1EDbD1cb26Fcf941983376f89A4e230eb",
		decimals: 18
	},
	{
		symbol: "SAGE.CX",
		address: "0xe77dBb83DEb90749486A1D94FC47E1f42b55562b",
		decimals: 8
	},
	{
		symbol: "SAI",
		address: "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359",
		decimals: 18
	},
	{
		symbol: "SAITO",
		address: "0xFa14Fa6958401314851A17d6C5360cA29f74B57B",
		decimals: 18
	},
	{
		symbol: "SAK3",
		address: "0xe9F84dE264E91529aF07Fa2C746e934397810334",
		decimals: 18
	},
	{
		symbol: "SAKE",
		address: "0x066798d9ef0833ccc719076Dab77199eCbd178b0",
		decimals: 18
	},
	{
		symbol: "SAKE",
		address: "0x705051Bbfd9f287869A412cbA8bC7d112de48E69",
		decimals: 8
	},
	{
		symbol: "SAL",
		address: "0x75c5eE419331B6150879530D06f9Ba054755F1DA",
		decimals: 18
	},
	{
		symbol: "SALE",
		address: "0xF063fE1aB7a291c5d06a86e14730b00BF24cB589",
		decimals: 18
	},
	{
		symbol: "SALT",
		address: "0x4156D3342D5c385a87D264F90653733592000581",
		decimals: 8
	},
	{
		symbol: "SAM",
		address: "0xd9DBE80995dbe64e371464b94D78baF10A694eD0",
		decimals: 0
	},
	{
		symbol: "SAN",
		address: "0x7C5A0CE9267ED19B22F8cae653F198e3E8daf098",
		decimals: 18
	},
	{
		symbol: "SAND",
		address: "0x3845badAde8e6dFF049820680d1F14bD3903a5d0",
		decimals: 18
	},
	{
		symbol: "SANTA",
		address: "0x8c168Ef06b8BAf8Ad2236eEf2286f7870ad50F9B",
		decimals: 18
	},
	{
		symbol: "SAS",
		address: "0x4C38D0e726B6C86F64c1B281348E725973542043",
		decimals: 18
	},
	{
		symbol: "SASHIMI",
		address: "0xC28E27870558cF22ADD83540d2126da2e4b464c2",
		decimals: 18
	},
	{
		symbol: "SAT",
		address: "0xc56b13ebbCFfa67cFb7979b900b736b3fb480D78",
		decimals: 8
	},
	{
		symbol: "SAT",
		address: "0x1F0F468Ee03A6D99CD8A09dd071494a83Dc1c0e5",
		decimals: 4
	},
	{
		symbol: "SATA",
		address: "0x3ebb4A4e91Ad83BE51F8d596533818b246F4bEe1",
		decimals: 18
	},
	{
		symbol: "SATOS",
		address: "0x9cB085053Fae27ADdA04c09E2ba1Af61489Bf741",
		decimals: 8
	},
	{
		symbol: "SATURN",
		address: "0xb9440022a095343B440D590FCD2d7A3794Bd76c8",
		decimals: 4
	},
	{
		symbol: "SAUD",
		address: "0xF48e200EAF9906362BB1442fca31e0835773b8B4",
		decimals: 18
	},
	{
		symbol: "SAVE",
		address: "0xc1eEcf1f4AF8EB9a2a19f6C26B434aA96ce859e1",
		decimals: 8
	},
	{
		symbol: "SBA",
		address: "0xECB8F588EAf5A8ce9d964b0acece5D954E130e2f",
		decimals: 18
	},
	{
		symbol: "SBCH",
		address: "0x36a2422a863D5B950882190Ff5433E513413343a",
		decimals: 18
	},
	{
		symbol: "SBER.CX",
		address: "0x5E36f2272F650D92C3F0bf503462DbD074B841F1",
		decimals: 8
	},
	{
		symbol: "SBNB",
		address: "0x617aeCB6137B5108D1E7D4918e3725C8cEbdB848",
		decimals: 18
	},
	{
		symbol: "sBNB",
		address: "0x013AE307648f529aa72c5767A334DDd37aaB43c3",
		decimals: 18
	},
	{
		symbol: "SBREE",
		address: "0x25377ddb16c79C93B0CBf46809C8dE8765f03FCd",
		decimals: 18
	},
	{
		symbol: "SBTC",
		address: "0x309013d55fB0E8C17363bcC79F25d92f711A5802",
		decimals: 9
	},
	{
		symbol: "SBTC",
		address: "0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6",
		decimals: 18
	},
	{
		symbol: "SBTC",
		address: "0xb8e103b60A33597136EA9511F46b6dBeB643a3a5",
		decimals: 18
	},
	{
		symbol: "SBTCCURVE",
		address: "0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3",
		decimals: 18
	},
	{
		symbol: "SBUX.CX",
		address: "0x3705F7bF96BA50ED12533642F60a20904bCbDE0a",
		decimals: 8
	},
	{
		symbol: "SBX",
		address: "0x2579BB08387f0DE7Ab135edd6C2A985a3f577b6B",
		decimals: 18
	},
	{
		symbol: "SCAL",
		address: "0x296EC7B2b224ea122F8f8F9be2A824dF092Fc82c",
		decimals: 8
	},
	{
		symbol: "SCAVO",
		address: "0xA62cE5F4175bA550440171ef809197eE21002D64",
		decimals: 18
	},
	{
		symbol: "SCC",
		address: "0xe6b75a1960f91Bfa7010DEC8543685eaD67F8cFf",
		decimals: 18
	},
	{
		symbol: "SCC",
		address: "0x4a9f00dE5d8A244944313faEe23849FF725E680D",
		decimals: 18
	},
	{
		symbol: "SCC",
		address: "0x74FD51a98a4A1ECBeF8Cc43be801cce630E260Bd",
		decimals: 18
	},
	{
		symbol: "SCC",
		address: "0x355a458d555151D3B27F94227960Ade1504E526a",
		decimals: 18
	},
	{
		symbol: "SCC",
		address: "0x86696431D6ACA9bae5CE6536ECF5D437F2e6Dba2",
		decimals: 18
	},
	{
		symbol: "SCDS",
		address: "0xb72c794effb775197287d767cA80C22ae9094cB5",
		decimals: 18
	},
	{
		symbol: "SCEX",
		address: "0xeABACD844A196D7Faf3CE596edeBF9900341B420",
		decimals: 18
	},
	{
		symbol: "SCHA",
		address: "0x2cAd4991f62fc6Fcd8EC219f37E7DE52B688B75A",
		decimals: 0
	},
	{
		symbol: "SCHF",
		address: "0x0F83287FF768D1c1e17a42F44d644D7F22e8ee1d",
		decimals: 18
	},
	{
		symbol: "SCL",
		address: "0xd7631787B4dCc87b1254cfd1e5cE48e96823dEe8",
		decimals: 8
	},
	{
		symbol: "SCN",
		address: "0x8a65ab17324c155fAc3e46aD33e9553d9165a252",
		decimals: 8
	},
	{
		symbol: "SCO",
		address: "0xdF195c2101959f6f39F583FfA5A2AEaE71c0f503",
		decimals: 18
	},
	{
		symbol: "SCOI",
		address: "0x3F5b26B0FA3E9D8547b7cf6725871f96ee91313a",
		decimals: 18
	},
	{
		symbol: "SCS",
		address: "0x81995ff7AEe5c780192b47e0B42a7a86692d1415",
		decimals: 18
	},
	{
		symbol: "SCSC",
		address: "0x3366adFCd676463e2f5387d07649f227FCC5c15E",
		decimals: 9
	},
	{
		symbol: "SCT",
		address: "0x2DF43E6826CF24Bb844cC78611b0036EEA3671b4",
		decimals: 8
	},
	{
		symbol: "SCT",
		address: "0x63b992e6246d88f07fc35A056d2C365E6D441A3D",
		decimals: 18
	},
	{
		symbol: "SCTK",
		address: "0x1071BA8aDA384C2B9b87F808E19DbB9AA4f0F88a",
		decimals: 18
	},
	{
		symbol: "SCUDO",
		address: "0xb0CC5610E590eB7215bf4D69eCA2ca26b6A9Bc87",
		decimals: 18
	},
	{
		symbol: "SCURVE",
		address: "0xC25a3A3b969415c80451098fa907EC722572917F",
		decimals: 18
	},
	{
		symbol: "SCV",
		address: "0x282417b21236Ac01a3A3d7ba304eD8d284f48b4D",
		decimals: 18
	},
	{
		symbol: "SDAO",
		address: "0x646Cec6ee42d258336165cBbD5deB4AF14F0f476",
		decimals: 4
	},
	{
		symbol: "SDASH",
		address: "0xfE33ae95A9f0DA8A845aF33516EDc240DCD711d6",
		decimals: 18
	},
	{
		symbol: "SDC",
		address: "0x4212FEa9FEc90236eCc51E41e2096B16CEB84555",
		decimals: 18
	},
	{
		symbol: "SDC",
		address: "0x4360c56DcB5A549531971433CAC8E7D0E68D19e1",
		decimals: 18
	},
	{
		symbol: "SDC.CX",
		address: "0xE649cd5F867Ce87bD361D36A8eD4f7a87462042d",
		decimals: 8
	},
	{
		symbol: "SDEFI",
		address: "0xe1aFe1Fd76Fd88f78cBf599ea1846231B8bA3B6B",
		decimals: 18
	},
	{
		symbol: "SDRN",
		address: "0x73B534fb6F07381a29a60B01eed5ae57D4EE24D7",
		decimals: 18
	},
	{
		symbol: "SDT",
		address: "0x73968b9a57c6E53d41345FD57a6E6ae27d6CDB2F",
		decimals: 18
	},
	{
		symbol: "SE",
		address: "0x5581C0BC21a762E43D148b06d310F088B6Cf97b3",
		decimals: 18
	},
	{
		symbol: "SEA",
		address: "0x72EBD62060F78D91dC4Bc33E8D88F39307365F87",
		decimals: 4
	},
	{
		symbol: "SEDO",
		address: "0x0F00f1696218EaeFa2D2330Df3D6D1f94813b38f",
		decimals: 8
	},
	{
		symbol: "Seele",
		address: "0xB1eeF147028E9f480DbC5ccaA3277D417D1b85F0",
		decimals: 18
	},
	{
		symbol: "SEL",
		address: "0x2974963051F3A3237e16841dEa7126250098D8F5",
		decimals: 0
	},
	{
		symbol: "SELF",
		address: "0x67ab11058eF23D0a19178f61A050D3c38F81Ae21",
		decimals: 18
	},
	{
		symbol: "SELF",
		address: "0xd4dd48fa7eCa5CdE1B31F780774C9563186F91C0",
		decimals: 18
	},
	{
		symbol: "SELF",
		address: "0xCC26550cB4edfb2B54a514E102E803E58F39CFC7",
		decimals: 18
	},
	{
		symbol: "SELF",
		address: "0xc8F5e4c77422aD6423458cBe189F41bF669787c8",
		decimals: 6
	},
	{
		symbol: "SEMI",
		address: "0x6D7917864003a9bb13CBbEC8F1CdD4E36dDf6fc8",
		decimals: 18
	},
	{
		symbol: "SENC",
		address: "0xA13f0743951B4f6E3e3AA039f682E17279f52bc3",
		decimals: 18
	},
	{
		symbol: "SENSE",
		address: "0x6745fAB6801e376cD24F03572B9C9B0D4EdDDCcf",
		decimals: 8
	},
	{
		symbol: "sense",
		address: "0x4cA74185532DC1789527194e5B9c866dD33F4E82",
		decimals: 18
	},
	{
		symbol: "SENSO",
		address: "0xBa6DB13aeAE3607D400DDFFD675aa4e88ECc9a69",
		decimals: 0
	},
	{
		symbol: "SEOL",
		address: "0xD907DAEEd4daE963b0e2442E330d1760D752A68e",
		decimals: 18
	},
	{
		symbol: "SEOS",
		address: "0x88C8Cf3A212c0369698D13FE98Fcb76620389841",
		decimals: 18
	},
	{
		symbol: "SEOS",
		address: "0xC35e16a4FB05F12E3cB0253c807ee76C2833bE65",
		decimals: 18
	},
	{
		symbol: "SERUM",
		address: "0x567d297D0cBB66195B268162a4547F220EF49c51",
		decimals: 18
	},
	{
		symbol: "SESG.CX",
		address: "0x345E0A3a19C54F8Cd46de0d5a0EB897930223F65",
		decimals: 8
	},
	{
		symbol: "SET",
		address: "0xe06eda7435bA749b047380CEd49121ddE93334Ae",
		decimals: 0
	},
	{
		symbol: "SET",
		address: "0x0a2D9370cF74Da3FD3dF5d764e394Ca8205C50B6",
		decimals: 18
	},
	{
		symbol: "SET",
		address: "0xFA75b65E52A6CBC5503f45f4AbBA2C5df4688875",
		decimals: 18
	},
	{
		symbol: "SETC",
		address: "0x22602469d704BfFb0936c7A7cfcD18f7aA269375",
		decimals: 18
	},
	{
		symbol: "SETH",
		address: "0x5e74C9036fb86BD7eCdcb084a0673EFc32eA31cb",
		decimals: 18
	},
	{
		symbol: "SETH",
		address: "0x78B039921E84E726EB72E7b1212bb35504c645cA",
		decimals: 18
	},
	{
		symbol: "SETS",
		address: "0x04E0Af0af1b7f0023c6B12af5a94Df59B0e8cF59",
		decimals: 18
	},
	{
		symbol: "SEUR",
		address: "0xD71eCFF9342A5Ced620049e616c5035F1dB98620",
		decimals: 18
	},
	{
		symbol: "SEXC",
		address: "0x2567c677473d110D75a8360C35309e63B1d52429",
		decimals: 8
	},
	{
		symbol: "SEXY",
		address: "0x98F5e9b7F0e33956C0443E81bF7deB8B5b1ed545",
		decimals: 18
	},
	{
		symbol: "SFC",
		address: "0x3D3560279B7a4e57Af202c285305d8F761ccB60A",
		decimals: 4
	},
	{
		symbol: "SFCP",
		address: "0x8b6CdA5CC518c904e8844f445E1A7C7d2DB0fF16",
		decimals: 18
	},
	{
		symbol: "SFG",
		address: "0x8a6ACA71A218301c7081d4e96D64292D3B275ce0",
		decimals: 18
	},
	{
		symbol: "SFI",
		address: "0x1E15abF152067e9Fe4A48bbf094A71f5bB16325D",
		decimals: 18
	},
	{
		symbol: "SFI",
		address: "0xb753428af26E81097e7fD17f40c88aaA3E04902c",
		decimals: 18
	},
	{
		symbol: "SFR",
		address: "0x648d19d775a8D4BafbA09e189090BdcbF8Ef31c1",
		decimals: 8
	},
	{
		symbol: "SFT",
		address: "0xc3332Ce4991fc311aAE888C8D265B900F6e59B0B",
		decimals: 18
	},
	{
		symbol: "sFTSE",
		address: "0x23348160D7f5aca21195dF2b70f28Fce2B0be9fC",
		decimals: 18
	},
	{
		symbol: "SFU",
		address: "0x5b135D7E2774c801a73208f258123d7623E07784",
		decimals: 18
	},
	{
		symbol: "SGA",
		address: "0xed0849BF46CfB9845a2d900A0A4E593F2dD3673c",
		decimals: 18
	},
	{
		symbol: "SGBP",
		address: "0x97fe22E7341a0Cd8Db6F6C021A24Dc8f4DAD855F",
		decimals: 18
	},
	{
		symbol: "SGC",
		address: "0x80bD0cc689c206e3F642919244c4251c7Ef19852",
		decimals: 18
	},
	{
		symbol: "SGEL",
		address: "0xa1ccc166faf0E998b3E33225A1A0301B1C86119D",
		decimals: 18
	},
	{
		symbol: "SGN",
		address: "0xB2135AB9695a7678Dd590B1A996CB0f37BCB0718",
		decimals: 9
	},
	{
		symbol: "SGP",
		address: "0x33C623a2BAAfEb8D15DfaF3cE44095efec83D72C",
		decimals: 18
	},
	{
		symbol: "SGR",
		address: "0xCB5A05beF3257613E984C17DbcF039952B6d883F",
		decimals: 8
	},
	{
		symbol: "SGT",
		address: "0x37427576324fE1f3625c9102674772d7CF71377d",
		decimals: 18
	},
	{
		symbol: "SGT",
		address: "0xd248B0D48E44aaF9c49aea0312be7E13a6dc1468",
		decimals: 1
	},
	{
		symbol: "SGT",
		address: "0xc4199fB6FFDb30A829614becA030f9042f1c3992",
		decimals: 18
	},
	{
		symbol: "SGT",
		address: "0x616C281CD8effF8c0354723BE399c809e97A7bf4",
		decimals: 18
	},
	{
		symbol: "SHAKE",
		address: "0x6006FC2a849fEdABa8330ce36F5133DE01F96189",
		decimals: 18
	},
	{
		symbol: "SHARD",
		address: "0xBeBdab6DA046Bc49ffBb61fbD7b33157Eb270D05",
		decimals: 18
	},
	{
		symbol: "SHARE",
		address: "0x39795344CBCc76cC3Fb94B9D1b15C23c2070C66D",
		decimals: 9
	},
	{
		symbol: "SHARE",
		address: "0xC787A019EA4E0700e997C8E7d26Ba2EFA2e6862a",
		decimals: 0
	},
	{
		symbol: "SHARK",
		address: "0x18f865D0fC2C82e787cC2BEBc5f7652a3f600DF7",
		decimals: 18
	},
	{
		symbol: "SHE",
		address: "0x4AC84f878b331e0a60423d25665ebA7F33F346FE",
		decimals: 8
	},
	{
		symbol: "SHE",
		address: "0x9064c91e51d7021A85AD96817e1432aBf6624470",
		decimals: 18
	},
	{
		symbol: "SHEL",
		address: "0x59a17c58DAAEE299b39A060B9De67Bf7C829e4d3",
		decimals: 18
	},
	{
		symbol: "SHFT",
		address: "0xcba3eAe7f55D0F423AF43cC85E67ab0fBF87B61C",
		decimals: 18
	},
	{
		symbol: "SHIB",
		address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
		decimals: 18
	},
	{
		symbol: "SHIP",
		address: "0xe25b0BBA01Dc5630312B6A21927E578061A13f55",
		decimals: 18
	},
	{
		symbol: "SHIT",
		address: "0xEF2E9966eb61BB494E5375d5Df8d67B7dB8A780D",
		decimals: 0
	},
	{
		symbol: "SHK",
		address: "0xEBE4a49dF7885d015329c919bF43e6460a858F1e",
		decimals: 18
	},
	{
		symbol: "SHL",
		address: "0x8542325B72C6D9fC0aD2Ca965A78435413a915A0",
		decimals: 18
	},
	{
		symbol: "SHOP",
		address: "0xE860b123b38306b0f3409bdBB6a8fe85ed61c6D4",
		decimals: 0
	},
	{
		symbol: "SHOP.CX",
		address: "0x13550B383CB73b1731fcEd06c5aA86Ed7800Adb9",
		decimals: 8
	},
	{
		symbol: "SHP",
		address: "0xEF2463099360a085f1f10b076Ed72Ef625497a06",
		decimals: 18
	},
	{
		symbol: "SHR",
		address: "0xd98F75b1A3261dab9eEd4956c93F33749027a964",
		decimals: 2
	},
	{
		symbol: "SHR",
		address: "0xEE5fE244406F35d9B4dDb488a64D51456630beFC",
		decimals: 2
	},
	{
		symbol: "SHRIMP",
		address: "0x38c4102D11893351cED7eF187fCF43D33eb1aBE6",
		decimals: 18
	},
	{
		symbol: "SHROOM",
		address: "0xEd0439EACf4c4965AE4613D77a5C2Efe10e5f183",
		decimals: 18
	},
	{
		symbol: "SHT",
		address: "0xf73b1F84E0C16cD56B0FAD03295213A3098De0DE",
		decimals: 18
	},
	{
		symbol: "SHUF",
		address: "0x3A9FfF453d50D4Ac52A6890647b823379ba36B9E",
		decimals: 18
	},
	{
		symbol: "SI",
		address: "0xD23Ac27148aF6A2f339BD82D0e3CFF380b5093de",
		decimals: 18
	},
	{
		symbol: "SI14",
		address: "0x8b98dF4Dff429E64E9A56fc6Eebe2380c6c3409c",
		decimals: 8
	},
	{
		symbol: "SIBU",
		address: "0x980E45AB37c6bcAF93Fe911b3e207e08a3a60B5E",
		decimals: 2
	},
	{
		symbol: "SIFI",
		address: "0x4afb0AaC9b862946837b2444566B8a914D6d0d97",
		decimals: 9
	},
	{
		symbol: "SIFT",
		address: "0x8a187D5285d316bcBC9ADafc08b51d70a0d8e000",
		decimals: 0
	},
	{
		symbol: "SIG",
		address: "0x6888a16eA9792c15A4DCF2f6C623D055c8eDe792",
		decimals: 18
	},
	{
		symbol: "SIG",
		address: "0x7777777777697cFEECF846A76326dA79CC606517",
		decimals: 18
	},
	{
		symbol: "SIG.CX",
		address: "0x728c2ba981F67677bD66E11ce389fb5FD0f33E95",
		decimals: 8
	},
	{
		symbol: "SILK",
		address: "0x4C1e085d8c2D2a8377834d0D7b38f12cc5b86898",
		decimals: 18
	},
	{
		symbol: "SILS",
		address: "0xB38018c51987DC57a815aB21f5DD94004c259686",
		decimals: 18
	},
	{
		symbol: "SIM",
		address: "0x7528E3040376EdD5DB8263Db2F5bd1beD91467FB",
		decimals: 18
	},
	{
		symbol: "SINE",
		address: "0xeb2C0E11aF20FB1c41C6e7ABe5ad214E48738514",
		decimals: 18
	},
	{
		symbol: "SINOC",
		address: "0xcbA8162778E6A3eBA60E1cF7C012B327340BD05d",
		decimals: 18
	},
	{
		symbol: "SION",
		address: "0xE8d1eFD0c95011298E9A30143A0182c06b45ff5D",
		decimals: 9
	},
	{
		symbol: "sJPY",
		address: "0xF6b1C627e95BFc3c1b4c9B825a032Ff0fBf3e07d",
		decimals: 18
	},
	{
		symbol: "SKB",
		address: "0x4aF328C52921706dCB739F25786210499169AFe6",
		decimals: 8
	},
	{
		symbol: "SKC",
		address: "0x0fE156436F203B114C6c562Cb1a2A81aa2801090",
		decimals: 18
	},
	{
		symbol: "SKC",
		address: "0xd88a43faCbA9990b536113EA3b2BBba93F75fa9a",
		decimals: 18
	},
	{
		symbol: "SKCH",
		address: "0x70c621f949b6556c4545707a2d5d73A776b98359",
		decimals: 6
	},
	{
		symbol: "SKD",
		address: "0x9d707701a56655202379f6b4CA5109BcC1C3d7ec",
		decimals: 18
	},
	{
		symbol: "SKE",
		address: "0xD3f89750010eAE391d2e40e3B3F9d638C7635279",
		decimals: 18
	},
	{
		symbol: "SKE",
		address: "0x13DB74B3cf512F65C4b91683940B4f3955E05085",
		decimals: 8
	},
	{
		symbol: "SKEIN",
		address: "0x45D0251Bc82b0D383006Ca536fC580Db113Eb4D7",
		decimals: 18
	},
	{
		symbol: "SKEY",
		address: "0x06A01a4d579479Dd5D884EBf61A31727A3d8D442",
		decimals: 8
	},
	{
		symbol: "SKI",
		address: "0x996Dc5dfc819408Dd98Cd92c9a76f64b0738Dc3D",
		decimals: 18
	},
	{
		symbol: "SKILL",
		address: "0x417d6fEEae8B2fcB73d14D64BE7F192E49431978",
		decimals: 18
	},
	{
		symbol: "SKIN",
		address: "0x2bDC0D42996017fCe214b21607a515DA41A9E0C5",
		decimals: 6
	},
	{
		symbol: "SKL",
		address: "0x00c83aeCC790e8a4453e5dD3B0B4b3680501a7A7",
		decimals: 18
	},
	{
		symbol: "SKM",
		address: "0xd99b8A7fA48E25Cce83B81812220A3E03Bf64e5f",
		decimals: 18
	},
	{
		symbol: "SKM",
		address: "0x048Fe49BE32adfC9ED68C37D32B5ec9Df17b3603",
		decimals: 18
	},
	{
		symbol: "SKO",
		address: "0x6B40089e6CBa08696D9ae48F38e2b06fAFF81765",
		decimals: 18
	},
	{
		symbol: "SKO1",
		address: "0x4994e81897a920c0FEA235eb8CEdEEd3c6fFF697",
		decimals: 18
	},
	{
		symbol: "SKR",
		address: "0x26587F4D672876E61a91B887f83CeD591be1CbA4",
		decimals: 8
	},
	{
		symbol: "SKR",
		address: "0x4c382F8E09615AC86E08CE58266CC227e7d4D913",
		decimals: 6
	},
	{
		symbol: "SKRP",
		address: "0xfdFE8b7aB6CF1bD1E3d14538Ef40686296C42052",
		decimals: 18
	},
	{
		symbol: "SKRP",
		address: "0x6E34d8d84764D40f6D7b39cd569Fd017bF53177D",
		decimals: 18
	},
	{
		symbol: "SKRP",
		address: "0x324A48eBCbB46e61993931eF9D35F6697CD2901b",
		decimals: 18
	},
	{
		symbol: "SKT",
		address: "0xA7c8d7a1C894E51dbB7c680B5B1dBdc845BFbDAB",
		decimals: 5
	},
	{
		symbol: "SKT",
		address: "0x82bdfb4C6F488fC47700ceF12C448a2F13F8fF4F",
		decimals: 18
	},
	{
		symbol: "SKULL",
		address: "0xBcc66ed2aB491e9aE7Bf8386541Fb17421Fa9d35",
		decimals: 4
	},
	{
		symbol: "SKYFT",
		address: "0x5dd0815A4cF119AD91BA045BbBF879F3F7de3C68",
		decimals: 18
	},
	{
		symbol: "SKYM",
		address: "0x7297862B9670fF015192799cc849726c88bf1d77",
		decimals: 18
	},
	{
		symbol: "SLC",
		address: "0x2ac22EbC138fF127566F68db600Addad7dF38d38",
		decimals: 18
	},
	{
		symbol: "SLCA.CX",
		address: "0xbaA103e4AA491602f5afB01267C02Fd84d75d55e",
		decimals: 8
	},
	{
		symbol: "SLD",
		address: "0x6B2bAB5E4b9Bc9592636c16bC4e5e07eF076cD6d",
		decimals: 18
	},
	{
		symbol: "SLICE",
		address: "0x0AeE8703D34DD9aE107386d3eFF22AE75Dd616D1",
		decimals: 18
	},
	{
		symbol: "SLINK",
		address: "0xbBC455cb4F1B9e4bFC4B73970d360c8f032EfEE6",
		decimals: 18
	},
	{
		symbol: "SLINK",
		address: "0x10Bae51262490B4f4AF41e12eD52A0E744c1137A",
		decimals: 9
	},
	{
		symbol: "SLM",
		address: "0x07a0AD7a9dfc3854466F8F29A173bf04bbA5686e",
		decimals: 18
	},
	{
		symbol: "SLOPPS",
		address: "0x834Aa7A8DAb83672609aFa51B4FE6Aa55114E424",
		decimals: 8
	},
	{
		symbol: "SLOT",
		address: "0xAee7474c3713eCe228Aa5Ec43C89c708f2Ec7ed2",
		decimals: 18
	},
	{
		symbol: "SLP",
		address: "0x37236CD05b34Cc79d3715AF2383E96dd7443dCF1",
		decimals: 0
	},
	{
		symbol: "SLP",
		address: "0xCC8Fa225D80b9c7D42F96e9570156c65D6cAAa25",
		decimals: 0
	},
	{
		symbol: "SLT",
		address: "0x851017523AE205adc9195e7F97D029f4Cfe7794c",
		decimals: 9
	},
	{
		symbol: "SLT",
		address: "0x7A5fF295Dc8239d5C2374E4D894202aAF029Cab6",
		decimals: 3
	},
	{
		symbol: "SLT",
		address: "0xE9f3cB0229eb8D0aAF03Ec84883950134eD20DDC",
		decimals: 8
	},
	{
		symbol: "SLTC",
		address: "0xC14103C2141E842e228FBaC594579e798616ce7A",
		decimals: 18
	},
	{
		symbol: "SLUSD",
		address: "0xD1ef44d439A885A867732Db280d233213Ef54C2B",
		decimals: 6
	},
	{
		symbol: "SLV",
		address: "0x4c1C4957D22D8F373aeD54d0853b090666F6F9De",
		decimals: 18
	},
	{
		symbol: "SLVG",
		address: "0x7EF55A013D0632c24955553367C8D5Cc082ddBfF",
		decimals: 18
	},
	{
		symbol: "SLY",
		address: "0x7928c8aBF1F74eF9F96D4D0a44e3b4209d360785",
		decimals: 18
	},
	{
		symbol: "SMARTUP",
		address: "0x78F5bBC74fb9137A75D85f3C9C3c599Be49f0A56",
		decimals: 18
	},
	{
		symbol: "SME",
		address: "0xDFe7351c291bC0e49079c62212587244e1C666BA",
		decimals: 18
	},
	{
		symbol: "SMG.CX",
		address: "0xFc5E03176b1eB31aC1ffaB16431650B2e09BbB4c",
		decimals: 8
	},
	{
		symbol: "SML",
		address: "0x138537DDba70aB69C05497b89Ee2e34F9201DCec",
		decimals: 18
	},
	{
		symbol: "SMOL",
		address: "0x2216e873ea4282EbEf7A02aC5aeA220bE6391A7C",
		decimals: 18
	},
	{
		symbol: "SMP",
		address: "0x696A846252E7d19caE1ca30dd918768C0623ED6c",
		decimals: 18
	},
	{
		symbol: "SMS",
		address: "0x39013F961c378f02C2b82A6E1d31E9812786FD9D",
		decimals: 3
	},
	{
		symbol: "SMS",
		address: "0xe5867608b51A2c9C78B9587355cC093140A49B0A",
		decimals: 3
	},
	{
		symbol: "SMT",
		address: "0x21f15966E07a10554C364b988e91DaB01D32794A",
		decimals: 18
	},
	{
		symbol: "SMT",
		address: "0x7aa82EC1cbD3769d2Ea55cD3B7957b786d0EFF49",
		decimals: 18
	},
	{
		symbol: "SMT",
		address: "0x78Eb8DC641077F049f910659b6d580E80dC4d237",
		decimals: 8
	},
	{
		symbol: "SMT",
		address: "0x55F93985431Fc9304077687a35A1BA103dC1e081",
		decimals: 18
	},
	{
		symbol: "SMT",
		address: "0x2dCFAAc11c9EebD8C6C42103Fe9e2a6AD237aF27",
		decimals: 18
	},
	{
		symbol: "SMT",
		address: "0xc761c8Dc05Ae52a8a785665E528ddbb00C098AD1",
		decimals: 18
	},
	{
		symbol: "SNAP",
		address: "0x1Afe191601c0c7095C995bd6875F94a89FA5d71b",
		decimals: 18
	},
	{
		symbol: "SNAP.CX",
		address: "0x2dD0E4A0dBA20e1C823D65fe7B2b93BfF8Fa6d42",
		decimals: 8
	},
	{
		symbol: "SNB",
		address: "0x179E31FB25E433441a2839389A7b8EC9c4654b7B",
		decimals: 18
	},
	{
		symbol: "SNBL",
		address: "0x198A87b3114143913d4229Fb0f6D4BCb44aa8AFF",
		decimals: 8
	},
	{
		symbol: "SNC",
		address: "0xF4134146AF2d511Dd5EA8cDB1C4AC88C57D60404",
		decimals: 18
	},
	{
		symbol: "SND",
		address: "0xf333b2Ace992ac2bBD8798bF57Bc65a06184afBa",
		decimals: 0
	},
	{
		symbol: "SNE.CX",
		address: "0x1852E5f5A9a6933Dc236fb226d4b197f5B1F279C",
		decimals: 8
	},
	{
		symbol: "SNET",
		address: "0xFf19138b039D938db46bDDA0067DC4BA132ec71C",
		decimals: 8
	},
	{
		symbol: "SNG",
		address: "0xcFD6Ae8BF13f42DE14867351eAff7A8A3b9FbBe7",
		decimals: 8
	},
	{
		symbol: "SNGJ",
		address: "0x249f71F8D9dA86c60f485E021b509A206667A079",
		decimals: 18
	},
	{
		symbol: "SNGLS",
		address: "0xaeC2E87E0A235266D9C5ADc9DEb4b2E29b54D009",
		decimals: 0
	},
	{
		symbol: "sNIKKEI",
		address: "0x757de3ac6B830a931eF178C6634c5C551773155c",
		decimals: 18
	},
	{
		symbol: "SNIP",
		address: "0x44F588aEeB8C44471439D1270B3603c66a9262F1",
		decimals: 18
	},
	{
		symbol: "SNL",
		address: "0xA806B3FEd6891136940cF81c4085661500aa2709",
		decimals: 6
	},
	{
		symbol: "SNM",
		address: "0x983F6d60db79ea8cA4eB9968C6aFf8cfA04B3c63",
		decimals: 18
	},
	{
		symbol: "SNN",
		address: "0xF5717f5DF41eA67Ef67DFD3c1d02F9940bcF5d08",
		decimals: 3
	},
	{
		symbol: "SNOV",
		address: "0xBDC5bAC39Dbe132B1E030e898aE3830017D7d969",
		decimals: 18
	},
	{
		symbol: "SNOW",
		address: "0xfe9A29aB92522D14Fc65880d817214261D8479AE",
		decimals: 18
	},
	{
		symbol: "SNP",
		address: "0x16bC74c21420b377cef9E03deFAe8beef647BeE9",
		decimals: 18
	},
	{
		symbol: "SNPC",
		address: "0x752FF65b884b9C260D212C804E0b7ACEea012473",
		decimals: 18
	},
	{
		symbol: "SNT",
		address: "0x744d70FDBE2Ba4CF95131626614a1763DF805B9E",
		decimals: 18
	},
	{
		symbol: "SNTR",
		address: "0x2859021eE7F2Cb10162E67F33Af2D22764B31aFf",
		decimals: 4
	},
	{
		symbol: "SNTVT",
		address: "0x7865af71cf0b288b4E7F654f4F7851EB46a2B7F8",
		decimals: 18
	},
	{
		symbol: "SNX",
		address: "0xC011A72400E58ecD99Ee497CF89E3775d4bd732F",
		decimals: 18
	},
	{
		symbol: "SNX",
		address: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
		decimals: 18
	},
	{
		symbol: "SOAR",
		address: "0xD65960FAcb8E4a2dFcb2C2212cb2e44a02e2a57E",
		decimals: 6
	},
	{
		symbol: "SOC",
		address: "0x2d0E95bd4795D7aCe0da3C0Ff7b706a5970eb9D3",
		decimals: 18
	},
	{
		symbol: "SOCKS",
		address: "0x23B608675a2B2fB1890d3ABBd85c5775c51691d5",
		decimals: 18
	},
	{
		symbol: "SOFI",
		address: "0xAEA5E11E22E447fA9837738A0cd2848857748ADF",
		decimals: 18
	},
	{
		symbol: "SOG",
		address: "0x86A0835f6B49f633fb1a3FA91B30DAe1Af4bbb6b",
		decimals: 18
	},
	{
		symbol: "SOHU.CX",
		address: "0x51F14D64435D9C1099a6feA383d26646f931825b",
		decimals: 8
	},
	{
		symbol: "SOL",
		address: "0x1F54638b7737193FFd86c19Ec51907A7c41755D8",
		decimals: 6
	},
	{
		symbol: "SOLARITE",
		address: "0x930eD81ad809603baf727117385D01f04354612E",
		decimals: 18
	},
	{
		symbol: "SOLM",
		address: "0x1279c15969Bb2007ec075c7d19F55dE3E3DA3807",
		decimals: 18
	},
	{
		symbol: "SOLVE",
		address: "0x446C9033E7516D820cc9a2ce2d0B7328b579406F",
		decimals: 8
	},
	{
		symbol: "SONIQ",
		address: "0x1C62aCa2b7605Db3606eAcdA7Bc67A1857DDb8FF",
		decimals: 18
	},
	{
		symbol: "SOP",
		address: "0x076641aF1B8f06B7f8C92587156143C109002cbe",
		decimals: 18
	},
	{
		symbol: "SOUL",
		address: "0xBb1f24C0c1554b9990222f036b0AaD6Ee4CAec29",
		decimals: 18
	},
	{
		symbol: "SOUL",
		address: "0x72DC3D52b7EF107a7CFFb6953eaa8A2aD6a204Cd",
		decimals: 6
	},
	{
		symbol: "SOUL",
		address: "0x79C75E2e8720B39e258F41c37cC4f309E0b0fF80",
		decimals: 8
	},
	{
		symbol: "SOVC",
		address: "0x9F4De9Ba900FD9FDF56F96439A0c2f447a1EaEb9",
		decimals: 10
	},
	{
		symbol: "SOZ",
		address: "0x3A10B7a22AE98E0f53276923F19f99B259F61778",
		decimals: 18
	},
	{
		symbol: "SPA",
		address: "0x9631483f28B7f5CBf7D435Ab249Be8f709215bC3",
		decimals: 18
	},
	{
		symbol: "SPA",
		address: "0xF7623A0A44045b907D81AAD8479AA3c4A818211d",
		decimals: 18
	},
	{
		symbol: "SPACE",
		address: "0xcc7ab8d78dBA187dC95bF3bB86e65E0C26d0041f",
		decimals: 18
	},
	{
		symbol: "SPANK",
		address: "0x42d6622deCe394b54999Fbd73D108123806f6a18",
		decimals: 18
	},
	{
		symbol: "SPARC",
		address: "0x58bf7df57d9DA7113c4cCb49d8463D4908C735cb",
		decimals: 18
	},
	{
		symbol: "SPARTA",
		address: "0x24AEF3BF1A47561500f9430D74Ed4097C47F51F2",
		decimals: 4
	},
	{
		symbol: "SPAZ",
		address: "0x8F9bfe5b6A5C3fEa8c64ad41a5Cf6f60Ec4aa47c",
		decimals: 8
	},
	{
		symbol: "SPAZ",
		address: "0x810908B285f85Af668F6348cD8B26D76B3EC12e1",
		decimals: 8
	},
	{
		symbol: "SPC",
		address: "0x8069080a922834460C3A092FB2c1510224dc066b",
		decimals: 18
	},
	{
		symbol: "SPC",
		address: "0x86ed939B500E121C0C5f493F399084Db596dAd20",
		decimals: 18
	},
	{
		symbol: "SPD",
		address: "0x1dEa979ae76f26071870F824088dA78979eb91C8",
		decimals: 18
	},
	{
		symbol: "SPDR",
		address: "0xbcD4b7dE6fde81025f74426D43165a5b0D790Fdd",
		decimals: 18
	},
	{
		symbol: "SPEC",
		address: "0x259059f137CB9B8F60AE27Bd199d97aBb69E539B",
		decimals: 18
	},
	{
		symbol: "SPELL",
		address: "0x090185f2135308BaD17527004364eBcC2D37e5F6",
		decimals: 18
	},
	{
		symbol: "SPF",
		address: "0x85089389C14Bd9c77FC2b8F0c3d1dC3363Bf06Ef",
		decimals: 18
	},
	{
		symbol: "SPH",
		address: "0xA0CF46eb152656C7090e769916eb44a138aaa406",
		decimals: 18
	},
	{
		symbol: "SPHTX",
		address: "0x3833ddA0AEB6947b98cE454d89366cBA8Cc55528",
		decimals: 18
	},
	{
		symbol: "SPI",
		address: "0x9B02dD390a603Add5c07f9fd9175b7DABE8D63B7",
		decimals: 18
	},
	{
		symbol: "SPICE",
		address: "0x1fDaB294EDA5112B7d066ED8F2E4E562D5bCc664",
		decimals: 18
	},
	{
		symbol: "SPICE",
		address: "0x0324dd195D0Cd53F9F07bEe6a48eE7a20bad738f",
		decimals: 8
	},
	{
		symbol: "SPIKE",
		address: "0xA7fC5D2453E3F68aF0cc1B78bcFEe94A1B293650",
		decimals: 10
	},
	{
		symbol: "SPIN",
		address: "0x4F22310C27eF39FEAA4A756027896DC382F0b5E2",
		decimals: 18
	},
	{
		symbol: "SPIRIT",
		address: "0x92d7A89405Ea3cC605A467E834236e09DF60bf16",
		decimals: 18
	},
	{
		symbol: "SPIZ",
		address: "0xa7A5c1058194Af8F00c187adB7FcC0c95f1C6c2d",
		decimals: 18
	},
	{
		symbol: "SPK",
		address: "0x0ca8E31a9058BD0D3Db73758FF36e74159A542CB",
		decimals: 0
	},
	{
		symbol: "SPN",
		address: "0x20F7A3DdF244dc9299975b4Da1C39F8D5D75f05A",
		decimals: 6
	},
	{
		symbol: "SPN.CX",
		address: "0x6Cb218854502a4e0F2CeB202616847ba470DF1Ca",
		decimals: 8
	},
	{
		symbol: "SPN3.CX",
		address: "0x9A387c22cEfc08cE815e0e8E5841c98537E4D039",
		decimals: 8
	},
	{
		symbol: "SPND",
		address: "0xDDD460bBD9F79847ea08681563e8A9696867210C",
		decimals: 18
	},
	{
		symbol: "SPORE",
		address: "0xa4Bad5d040d4464EC5CE130987731F2f428c9307",
		decimals: 18
	},
	{
		symbol: "SPRK",
		address: "0x971d048E737619884f2df75e31c7Eb6412392328",
		decimals: 18
	},
	{
		symbol: "SPRKL",
		address: "0x4b7aD3a56810032782Afce12d7d27122bDb96efF",
		decimals: 8
	},
	{
		symbol: "SPS",
		address: "0xe4F83110b59C0A751733263A870bB63b407ad0c0",
		decimals: 3
	},
	{
		symbol: "SPX",
		address: "0x05aAaA829Afa407D83315cDED1d45EB16025910c",
		decimals: 18
	},
	{
		symbol: "SPXM.CX",
		address: "0xd4A8C8cafd223E372C8A217FD201f9E11e440B85",
		decimals: 8
	},
	{
		symbol: "SPY",
		address: "0xB73e314501Ec4dc2C7c7351514458b1c139Df98A",
		decimals: 18
	},
	{
		symbol: "SPY",
		address: "0xe4883Bcb919386Bb5f48EF59B7C31C1D93A51A57",
		decimals: 18
	},
	{
		symbol: "SPYA",
		address: "0x2297AF5e7E48be46C61A9e6164F64bd44DDC6ca3",
		decimals: 18
	},
	{
		symbol: "SPYCE",
		address: "0x2B0eF43E0111c8aCaEAa26D93FA77048EF2A2CBf",
		decimals: 18
	},
	{
		symbol: "SQ.CX",
		address: "0x38FC9F9db961dC455Ac0B3aEC65eD2db8b958b03",
		decimals: 8
	},
	{
		symbol: "SRC",
		address: "0x221F7d0F2Fa0bFbd5F8B0d0340425906F2F9968c",
		decimals: 18
	},
	{
		symbol: "SRH",
		address: "0xc350e846e2C57F9EecE90FEBc253d14C8080871B",
		decimals: 18
	},
	{
		symbol: "SRK",
		address: "0x0488401c3F535193Fa8Df029d9fFe615A06E74E6",
		decimals: 18
	},
	{
		symbol: "SRM",
		address: "0x476c5E26a75bd202a9683ffD34359C0CC15be0fF",
		decimals: 6
	},
	{
		symbol: "SRM",
		address: "0x681724368d052a4e29Fc226eD5085082d74Fe716",
		decimals: 18
	},
	{
		symbol: "SRN",
		address: "0x68d57c9a1C35f63E2c83eE8e49A64e9d70528D25",
		decimals: 18
	},
	{
		symbol: "SRNT",
		address: "0xBC7942054F77b82e8A71aCE170E4B00ebAe67eB6",
		decimals: 18
	},
	{
		symbol: "SRPT.CX",
		address: "0x0Ec623C98a0014D67B0a0E411b80a45f2CD6C29d",
		decimals: 8
	},
	{
		symbol: "SRX",
		address: "0x32F3b8A00B6912D0314be212fe9538B7B9430c12",
		decimals: 8
	},
	{
		symbol: "SS",
		address: "0xbbFF862d906E348E9946Bfb2132ecB157Da3D4b4",
		decimals: 18
	},
	{
		symbol: "SSA.CX",
		address: "0xf68Fe4eEB1b4f93DE4f11C29FdCE6cf120b475c0",
		decimals: 8
	},
	{
		symbol: "SSC",
		address: "0xE66F7261F72861e3399eb15424f2F2A2E976CaB3",
		decimals: 18
	},
	{
		symbol: "SSJ",
		address: "0xB4ae194a0DCF1B4080b164C1d775ee06E0817305",
		decimals: 18
	},
	{
		symbol: "SSN",
		address: "0xA5b46FF9a887180C8FB2d97146398Ddfc5FEF1Cd",
		decimals: 18
	},
	{
		symbol: "SSP",
		address: "0x624d520BAB2E4aD83935Fa503fB130614374E850",
		decimals: 4
	},
	{
		symbol: "SSS",
		address: "0x7d3E7D41DA367b4FDCe7CBE06502B13294Deb758",
		decimals: 8
	},
	{
		symbol: "SSS",
		address: "0x8D7dB6A562764b437F3248031F886359b4183cc4",
		decimals: 18
	},
	{
		symbol: "SST",
		address: "0x2863916C6ebDBBf0c6f02F87b7eB478509299868",
		decimals: 18
	},
	{
		symbol: "SST",
		address: "0x4257D36dF231DC71F7B7a6E1bE3Ef9C99B9181fD",
		decimals: 8
	},
	{
		symbol: "STA",
		address: "0xa7DE087329BFcda5639247F96140f9DAbe3DeED1",
		decimals: 18
	},
	{
		symbol: "STACS",
		address: "0x286708f069225905194673755F12359e6afF6FE1",
		decimals: 18
	},
	{
		symbol: "STAKE",
		address: "0x0Ae055097C6d159879521C384F1D2123D1f195e6",
		decimals: 18
	},
	{
		symbol: "STAR",
		address: "0xF70a642bD387F94380fFb90451C2c81d4Eb82CBc",
		decimals: 18
	},
	{
		symbol: "STARK",
		address: "0x1eDC9bA729Ef6FB017ef9c687b1A37D48B6a166C",
		decimals: 18
	},
	{
		symbol: "STASH",
		address: "0x965F109d31CCb77005858DEfaE0Ebaf7B4381652",
		decimals: 18
	},
	{
		symbol: "STB",
		address: "0x3154da898943Fc7151bc77F16E43C0C47b5E452d",
		decimals: 18
	},
	{
		symbol: "STB",
		address: "0x09BcA6eBAb05Ee2ae945BE4edA51393d94Bf7b99",
		decimals: 4
	},
	{
		symbol: "STB",
		address: "0xc48B1aC1417dB27C4e2C2ed3DAE5a3D2fBB07DC5",
		decimals: 8
	},
	{
		symbol: "STBU",
		address: "0x212DD60D4Bf0DA8372fe8116474602d429E5735F",
		decimals: 18
	},
	{
		symbol: "STC",
		address: "0x9a005c9a89BD72a4Bd27721E7a09A3c11D2b03C4",
		decimals: 18
	},
	{
		symbol: "STC",
		address: "0x629aEe55ed49581C33ab27f9403F7992A289ffd5",
		decimals: 18
	},
	{
		symbol: "STDEX",
		address: "0xdF44A80c17813789f60090638827aEb23698B122",
		decimals: 18
	},
	{
		symbol: "STEP",
		address: "0x50026ad58b338Cf3eccC2b422dEB8Faa725F377F",
		decimals: 8
	},
	{
		symbol: "STETH",
		address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
		decimals: 18
	},
	{
		symbol: "STETH",
		address: "0xDFe66B14D37C77F4E9b180cEb433d1b164f0281D",
		decimals: 18
	},
	{
		symbol: "STISH",
		address: "0xb472C71365eF9ed14226bB0AA4C9a3Fa45EcE510",
		decimals: 4
	},
	{
		symbol: "STK",
		address: "0xaE73B38d1c9A8b274127ec30160a4927C4d71824",
		decimals: 18
	},
	{
		symbol: "STL",
		address: "0xC1Ad68c43508dD5AdDb8d0ac0927dbE752d149D6",
		decimals: 18
	},
	{
		symbol: "STLD.CX",
		address: "0x90aD3De8e3A93177E4b999e21f1D70a6496d44A9",
		decimals: 8
	},
	{
		symbol: "STM",
		address: "0x302ce6674A16b54bA1B8A49FED64C471EdE6C174",
		decimals: 0
	},
	{
		symbol: "STM",
		address: "0x2E8C6Bbe8E3aA834EF5a851b2cdFc52403d61b87",
		decimals: 18
	},
	{
		symbol: "STM",
		address: "0x0E22734e078d6e399BCeE40a549DB591C4EA46cB",
		decimals: 18
	},
	{
		symbol: "STM.CX",
		address: "0xe5e36647Efde7951e95FD612Ea23803aff2a1B83",
		decimals: 8
	},
	{
		symbol: "STMX",
		address: "0xbE9375C6a420D2eEB258962efB95551A5b722803",
		decimals: 18
	},
	{
		symbol: "STN",
		address: "0x599346779e90fc3F5F997b5ea715349820F91571",
		decimals: 4
	},
	{
		symbol: "STONK",
		address: "0xb60Fde5D798236fBF1e2697B2A0645380921FccF",
		decimals: 18
	},
	{
		symbol: "STONK",
		address: "0xb4058411967D5046f3510943103805be61f0600E",
		decimals: 18
	},
	{
		symbol: "STOP",
		address: "0x8c3eE4F778E282B59D42d693A97b80b1ed80f4Ee",
		decimals: 18
	},
	{
		symbol: "STOR",
		address: "0xA3CEaC0AAc5c5d868973e546cE4731Ba90e873c2",
		decimals: 8
	},
	{
		symbol: "STORJ",
		address: "0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC",
		decimals: 8
	},
	{
		symbol: "STORM",
		address: "0xD0a4b8946Cb52f0661273bfbC6fD0E0C75Fc6433",
		decimals: 18
	},
	{
		symbol: "STP",
		address: "0xecd570bBf74761b960Fa04Cc10fe2c4e86FfDA36",
		decimals: 8
	},
	{
		symbol: "STPC",
		address: "0x3Fb8D8A28AFf053CcF446BC075eEcb7a0Ef65D0c",
		decimals: 18
	},
	{
		symbol: "STPL",
		address: "0x9b5C2BE869a19e84BDBcb1386dAD83a2ec8DAe82",
		decimals: 18
	},
	{
		symbol: "STPT",
		address: "0xDe7D85157d9714EADf595045CC12Ca4A5f3E2aDb",
		decimals: 18
	},
	{
		symbol: "STQ",
		address: "0x5c3a228510D246b78a3765C20221Cbf3082b44a4",
		decimals: 18
	},
	{
		symbol: "STR",
		address: "0x426567F78e74577f8a6233B635970eb729631e05",
		decimals: 18
	},
	{
		symbol: "STR",
		address: "0xBAE235823D7255D9D48635cEd4735227244Cd583",
		decimals: 18
	},
	{
		symbol: "STRC",
		address: "0x46492473755e8dF960F8034877F61732D718CE96",
		decimals: 8
	},
	{
		symbol: "STRN",
		address: "0x90b426067bE0b0FF5De257BC4dd6a4815Ea03b5f",
		decimals: 18
	},
	{
		symbol: "STRNG",
		address: "0x350a6A30C79Df3600C4e0E67DeAb0a64B645e2C2",
		decimals: 18
	},
	{
		symbol: "STRO",
		address: "0xc2e343118f937F88Ee1FC3150cDc0d6f3D11bBa7",
		decimals: 18
	},
	{
		symbol: "STRONG",
		address: "0x990f341946A3fdB507aE7e52d17851B87168017c",
		decimals: 18
	},
	{
		symbol: "sTRX",
		address: "0xf2E08356588EC5cd9E437552Da87C0076b4970B0",
		decimals: 18
	},
	{
		symbol: "STRX",
		address: "0x12c8B0914e6DEE22C7557a0A8B928AE6CaCFbCf7",
		decimals: 18
	},
	{
		symbol: "STRX",
		address: "0x0944d2C41FEF3088467287e208E5bBB622A0c09C",
		decimals: 18
	},
	{
		symbol: "STS",
		address: "0x4c14114C107D6374EC31981F5F6Cc27A13e22F9a",
		decimals: 18
	},
	{
		symbol: "STT",
		address: "0xaC9Bb427953aC7FDDC562ADcA86CF42D988047Fd",
		decimals: 18
	},
	{
		symbol: "STU",
		address: "0x0371A82e4A9d0A4312f3ee2Ac9c6958512891372",
		decimals: 18
	},
	{
		symbol: "STX",
		address: "0x006BeA43Baa3f7A6f765F14f10A1a1b08334EF45",
		decimals: 18
	},
	{
		symbol: "stZEN",
		address: "0x31B595e7cfDB624D10A3E7A562eD98c3567e3865",
		decimals: 8
	},
	{
		symbol: "SUB",
		address: "0x8D75959f1E61EC2571aa72798237101F084DE63a",
		decimals: 18
	},
	{
		symbol: "SUKU",
		address: "0x0763fdCCF1aE541A5961815C0872A8c5Bc6DE4d7",
		decimals: 18
	},
	{
		symbol: "SUN",
		address: "0x7CC61e3aE6360e923e9296C802382ec7c9dD3652",
		decimals: 8
	},
	{
		symbol: "SUNC",
		address: "0x6b0D7b8357bB851De9F1953199c39c7Bc4675796",
		decimals: 18
	},
	{
		symbol: "SUP8EME",
		address: "0x47935Edfb3CDd358C50F6c0Add1Cc24662e30F5f",
		decimals: 6
	},
	{
		symbol: "SUPER",
		address: "0xe53EC727dbDEB9E2d5456c3be40cFF031AB40A55",
		decimals: 18
	},
	{
		symbol: "SUPERBID",
		address: "0x0563DCe613D559a47877fFD1593549fb9d3510D6",
		decimals: 18
	},
	{
		symbol: "SUPT",
		address: "0x868ab6C9E560Ff70584b9770d1Bd1b961AD09d82",
		decimals: 8
	},
	{
		symbol: "SUR",
		address: "0xe120c1ECBfdFeA7F0A8f0Ee30063491E8c26fedf",
		decimals: 8
	},
	{
		symbol: "SURE",
		address: "0xb5a4ac5b04E777230bA3381195EfF6a60c3934F2",
		decimals: 18
	},
	{
		symbol: "SURF",
		address: "0xEa319e87Cf06203DAe107Dd8E5672175e3Ee976c",
		decimals: 18
	},
	{
		symbol: "SURF",
		address: "0x46d473a0B3eEEc9F55FADE641bC576d5bc0b2246",
		decimals: 18
	},
	{
		symbol: "SUSD",
		address: "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
		decimals: 18
	},
	{
		symbol: "sUSD",
		address: "0x57Ab1E02fEE23774580C119740129eAC7081e9D3",
		decimals: 18
	},
	{
		symbol: "SUSHI",
		address: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
		decimals: 18
	},
	{
		symbol: "SVC",
		address: "0x64EA2c6104F1CF3035E28Be0f781B6286d50934D",
		decimals: 18
	},
	{
		symbol: "SVCS",
		address: "0x9CEc686ba6f07D6135B2091140c795166Ef5b761",
		decimals: 18
	},
	{
		symbol: "SVD",
		address: "0xbdEB4b83251Fb146687fa19D1C660F99411eefe3",
		decimals: 18
	},
	{
		symbol: "SVT",
		address: "0x3503BE8049Ff6CE3235a4c9087f4F6F5da63Eac6",
		decimals: 18
	},
	{
		symbol: "SWAG",
		address: "0x87eDfFDe3E14c7a66c9b9724747a1C5696b742e6",
		decimals: 18
	},
	{
		symbol: "SWAGG",
		address: "0xa19A40FbD7375431fAB013a4B08F00871B9a2791",
		decimals: 4
	},
	{
		symbol: "SWAP",
		address: "0xCC4304A31d09258b0029eA7FE63d032f52e44EFe",
		decimals: 18
	},
	{
		symbol: "SWAP",
		address: "0xC958e9FB59724f8b0927426a8836F1158F0d03cf",
		decimals: 18
	},
	{
		symbol: "SWAT",
		address: "0xc0F1728d9513EFC316D0E93A0758c992f88b0809",
		decimals: 8
	},
	{
		symbol: "SWC",
		address: "0x78fE18e41f436e1981a3a60D1557c8a7a9370461",
		decimals: 2
	},
	{
		symbol: "SWC",
		address: "0xADF8B8050639b6236915f7516d69dE714672F0bF",
		decimals: 18
	},
	{
		symbol: "SWFL",
		address: "0xBa21Ef4c9f433Ede00badEFcC2754B8E74bd538A",
		decimals: 18
	},
	{
		symbol: "SWFTC",
		address: "0x0bb217E40F8a5Cb79Adf04E1aAb60E5abd0dfC1e",
		decimals: 8
	},
	{
		symbol: "SWGB",
		address: "0x92eF4FFBfe0Df030837b65d7FcCFE1ABd6549579",
		decimals: 18
	},
	{
		symbol: "SWIPE",
		address: "0x13D71cfC90A83CD1cC0E59675c3F4b90d4162a8B",
		decimals: 8
	},
	{
		symbol: "SWKS.CX",
		address: "0x04B0672f1659E6d9cAe313415F7bBfe87b678A7c",
		decimals: 8
	},
	{
		symbol: "SWM",
		address: "0x3505F494c3f0fed0B594E01Fa41Dd3967645ca39",
		decimals: 18
	},
	{
		symbol: "SWM",
		address: "0x9e88613418cF03dCa54D6a2cf6Ad934A78C7A17A",
		decimals: 18
	},
	{
		symbol: "SWN.CX",
		address: "0xa58b5C6c60D2F05792E9261727143dB1eE544C54",
		decimals: 8
	},
	{
		symbol: "SWRM",
		address: "0x6e2050CBFB3eD8A4d39b64cC9f47E711a03a5a89",
		decimals: 18
	},
	{
		symbol: "SWRV",
		address: "0xB8BAa0e4287890a5F79863aB62b7F175ceCbD433",
		decimals: 18
	},
	{
		symbol: "SWT",
		address: "0xB9e7F8568e08d5659f5D29C4997173d84CdF2607",
		decimals: 18
	},
	{
		symbol: "SWUSD",
		address: "0x77C6E4a580c0dCE4E5c7a17d0bc077188a83A059",
		decimals: 18
	},
	{
		symbol: "SWYFTT",
		address: "0xA1248c718d52752b2cC257eeb0eBa900408dAeB8",
		decimals: 18
	},
	{
		symbol: "SWZL",
		address: "0x946eA588417fFa565976EFdA354d82c01719a2EA",
		decimals: 0
	},
	{
		symbol: "SX",
		address: "0x99fE3B1391503A1bC1788051347A1324bff41452",
		decimals: 18
	},
	{
		symbol: "SXAG",
		address: "0x6A22e5e94388464181578Aa7A6B869e00fE27846",
		decimals: 18
	},
	{
		symbol: "SXAU",
		address: "0x261EfCdD24CeA98652B9700800a13DfBca4103fF",
		decimals: 18
	},
	{
		symbol: "SXDT",
		address: "0x12B306fA98F4CbB8d4457FdFf3a0A0a56f07cCdf",
		decimals: 18
	},
	{
		symbol: "SXMR",
		address: "0x5299d6F7472DCc137D7f3C4BcfBBB514BaBF341A",
		decimals: 18
	},
	{
		symbol: "SXP",
		address: "0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9",
		decimals: 18
	},
	{
		symbol: "SXR",
		address: "0xfCdaE8771F8d28E3B9027AB58F4A20749767a097",
		decimals: 8
	},
	{
		symbol: "SXRP",
		address: "0xa2B0fDe6D710e201d0d608e924A484d1A5fEd57c",
		decimals: 18
	},
	{
		symbol: "sXTZ",
		address: "0x2e59005c5c0f0a4D77CcA82653d48b46322EE5Cd",
		decimals: 18
	},
	{
		symbol: "SXTZ",
		address: "0xF45B14ddaBF0F0e275E215b94dD24Ae013a27F12",
		decimals: 18
	},
	{
		symbol: "SXUT",
		address: "0x2C82c73d5B34AA015989462b2948cd616a37641F",
		decimals: 18
	},
	{
		symbol: "SYBC",
		address: "0x69428BB4272e3181dE9E3caB461e19b0131855c8",
		decimals: 8
	},
	{
		symbol: "SYC",
		address: "0xE49214e4c92dc9bcb3B56C1309aFE0D626dD730E",
		decimals: 18
	},
	{
		symbol: "SYCO",
		address: "0x0598C2Fdd3a0564970A86B69C72a6C57077c84bb",
		decimals: 8
	},
	{
		symbol: "SYFI",
		address: "0x322124122DF407b0d0D902cB713B3714FB2e2E1F",
		decimals: 9
	},
	{
		symbol: "SYFI",
		address: "0x88093840AaD42d2621e1a452BF5d7076fF804D61",
		decimals: 9
	},
	{
		symbol: "SYLO",
		address: "0xf293d23BF2CDc05411Ca0edDD588eb1977e8dcd4",
		decimals: 18
	},
	{
		symbol: "SYM",
		address: "0x2fd61567c29E7ADB4Ca17e60E1f4a3Fcfe68aCb8",
		decimals: 18
	},
	{
		symbol: "SYN",
		address: "0x10B123FdDde003243199aaD03522065dC05827A0",
		decimals: 18
	},
	{
		symbol: "SYN",
		address: "0x1695936d6a953df699C38CA21c2140d497C08BD9",
		decimals: 18
	},
	{
		symbol: "SYNC",
		address: "0xB6ff96B8A8d214544Ca0dBc9B33f7AD6503eFD32",
		decimals: 18
	},
	{
		symbol: "SYSX",
		address: "0x3A0D746B3EA1d8ccDf19aD915913BD68391133Ca",
		decimals: 8
	},
	{
		symbol: "SYT",
		address: "0x1F6324f07e452c4C63C14844f0AA9d235167Fe72",
		decimals: 18
	},
	{
		symbol: "SYY.CX",
		address: "0x99f653292d2343c92E72212dc5CcDDfb04c6368b",
		decimals: 8
	},
	{
		symbol: "SZC",
		address: "0xE2Ad8c40a00926023D0cB4d5C6A6306470524001",
		decimals: 18
	},
	{
		symbol: "SZC",
		address: "0xf5832512CFDa8083E5b2dd0aA7C1B9265c03BA1F",
		decimals: 8
	},
	{
		symbol: "TAAS",
		address: "0xE7775A6e9Bcf904eb39DA2b68c5efb4F9360e08C",
		decimals: 6
	},
	{
		symbol: "TAC",
		address: "0xca694eb79eF355eA0999485d211E68F39aE98493",
		decimals: 8
	},
	{
		symbol: "TACO",
		address: "0x00D1793D7C3aAE506257Ba985b34C76AaF642557",
		decimals: 18
	},
	{
		symbol: "TALAO",
		address: "0x1D4cCC31dAB6EA20f461d329a0562C1c58412515",
		decimals: 18
	},
	{
		symbol: "TAN",
		address: "0x2C36204a0712A2a50E54A62F7c4F01867e78cB53",
		decimals: 18
	},
	{
		symbol: "TANTAN",
		address: "0x2121a1B68E9C2Cc8fF4Bfd8bCD0F891ece331c51",
		decimals: 8
	},
	{
		symbol: "TAPE",
		address: "0x9Bfb088C9f311415E3F9B507DA73081c52a49d8c",
		decimals: 18
	},
	{
		symbol: "TARM",
		address: "0xcDd0A6B15B49A9eb3Ce011CCE22FAc2ccf09ecE6",
		decimals: 18
	},
	{
		symbol: "TAT",
		address: "0x37Ee79E0B44866876de2fB7F416d0443DD5ae481",
		decimals: 18
	},
	{
		symbol: "TAT",
		address: "0xD6E6a28eB0a72AF2336f80E143E7311bc3108B97",
		decimals: 18
	},
	{
		symbol: "TAU",
		address: "0xc27A2F05fa577a83BA0fDb4c38443c0718356501",
		decimals: 18
	},
	{
		symbol: "TAUD",
		address: "0x00006100F7090010005F1bd7aE6122c3C2CF0090",
		decimals: 18
	},
	{
		symbol: "TAUR",
		address: "0x64786063A352b399d44de2875909D1229F120eBE",
		decimals: 18
	},
	{
		symbol: "TAX",
		address: "0xF0EbB4A0784e710bfe06e69935018a94926cCd57",
		decimals: 18
	},
	{
		symbol: "TBC",
		address: "0x627974847450C45b60B3Fe3598f4e6E4cf945B9a",
		decimals: 18
	},
	{
		symbol: "TBC2",
		address: "0xFACCD5Fc83c3E4C3c1AC1EF35D15adf06bCF209C",
		decimals: 8
	},
	{
		symbol: "TBT",
		address: "0xAFe60511341a37488de25Bef351952562E31fCc1",
		decimals: 8
	},
	{
		symbol: "TBTC",
		address: "0x1bBE271d15Bb64dF0bc6CD28Df9Ff322F2eBD847",
		decimals: 18
	},
	{
		symbol: "TBTC",
		address: "0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa",
		decimals: 18
	},
	{
		symbol: "TBUX",
		address: "0x9d29bD441E9DA3EfF48568Aea1348383544547e7",
		decimals: 18
	},
	{
		symbol: "TBX",
		address: "0x3A92bD396aEf82af98EbC0Aa9030D25a23B11C6b",
		decimals: 18
	},
	{
		symbol: "TCA",
		address: "0xfA0eF5E034CaE1AE752d59bdb8aDcDe37Ed7aB97",
		decimals: 18
	},
	{
		symbol: "TCAD",
		address: "0x00000100F2A2bd000715001920eB70D229700085",
		decimals: 18
	},
	{
		symbol: "TCAPBTCUSDC",
		address: "0x7510D6fac98A6eCa2DB7c9357619715a7f5049d4",
		decimals: 18
	},
	{
		symbol: "TCAPETHDAI",
		address: "0x8e4dBF540Bf814c044785218B58C930B20a56BE1",
		decimals: 18
	},
	{
		symbol: "TCASH",
		address: "0x7051620d11042c4335069AaA4f10Cd3B4290C681",
		decimals: 8
	},
	{
		symbol: "TCAT",
		address: "0xaff84e86d72EDb971341a6A66eb2dA209446FA14",
		decimals: 18
	},
	{
		symbol: "TCFX",
		address: "0x36dCffe069a3F2878Fab2A46D81e83D462d0cBF7",
		decimals: 18
	},
	{
		symbol: "TCFX",
		address: "0x031E0C6A7C91DF1BC171D33ccCc6988fd2DDEB6f",
		decimals: 18
	},
	{
		symbol: "TCH",
		address: "0x9972A0F24194447E73a7e8b6CD26a52e02DDfAD5",
		decimals: 0
	},
	{
		symbol: "TCH",
		address: "0x3B4B29C4c1872a60D09937686bD2b358Db9Dee8a",
		decimals: 18
	},
	{
		symbol: "TCH",
		address: "0xCd475371E39c0d94e82FCCc9dD0ea710D0dc0C0B",
		decimals: 18
	},
	{
		symbol: "TCH",
		address: "0x59C337EF937D0bA9Cb1cc47D4e6DeD632D22D623",
		decimals: 18
	},
	{
		symbol: "TCH",
		address: "0x9B39A0B97319a9bd5fed217c1dB7b030453bac91",
		decimals: 18
	},
	{
		symbol: "TCLB",
		address: "0x798b5C3D3A56B6e55C1B44A8368746F9a11E4D7d",
		decimals: 18
	},
	{
		symbol: "TCNX",
		address: "0x28d7F432d24ba6020d1cbD4f28BEDc5a82F24320",
		decimals: 18
	},
	{
		symbol: "TCO",
		address: "0x6288014d6BA425D71f5fdc1DBfb01378241D78DB",
		decimals: 18
	},
	{
		symbol: "TCO",
		address: "0xecF52B1cD443E51BF9bcea862B584b748725DA9f",
		decimals: 18
	},
	{
		symbol: "TCOIN",
		address: "0x86b9d8B2491cD816B1B26AD2AFC5c267126c0C34",
		decimals: 8
	},
	{
		symbol: "TCOIN",
		address: "0xaBb77F5c1E1C61adC3666b62dC614e64c584bE6b",
		decimals: 8
	},
	{
		symbol: "TCORE",
		address: "0x7A3D5d49D64E57DBd6FBB21dF7202bD3EE7A2253",
		decimals: 18
	},
	{
		symbol: "TCP",
		address: "0x331A4589516EAE384eA5F557853AF6aF73B9534e",
		decimals: 18
	},
	{
		symbol: "TCS",
		address: "0x0Cd1b0e93eBAAD374752af74FE44F877dd0438c0",
		decimals: 18
	},
	{
		symbol: "TCST",
		address: "0x9910f4AeD4A7550A4120ad7da8dF8b56E91197Fa",
		decimals: 0
	},
	{
		symbol: "TCT",
		address: "0x4824A7b64E3966B0133f4f4FFB1b9D6bEb75FFF7",
		decimals: 18
	},
	{
		symbol: "TCT",
		address: "0xED82730312babb41367E060911F798002FFA445F",
		decimals: 18
	},
	{
		symbol: "TDC",
		address: "0xc769506C9411821f62AEBc13a98D002561FB3a1f",
		decimals: 10
	},
	{
		symbol: "TDC",
		address: "0xDF18a53C2eeb81635C306c555D7A844e42bf7134",
		decimals: 0
	},
	{
		symbol: "TDE",
		address: "0xf872F60A163701cB2cFC240D728eA3df51BA11F9",
		decimals: 18
	},
	{
		symbol: "TDEX",
		address: "0xc5e19Fd321B9bc49b41d9a3a5ad71bcc21CC3c54",
		decimals: 18
	},
	{
		symbol: "TDH",
		address: "0x2a1dbabe65c595B0022e75208C34014139d5d357",
		decimals: 18
	},
	{
		symbol: "TDN",
		address: "0x6d68A12305051291d194162b8406aEA080342645",
		decimals: 18
	},
	{
		symbol: "TDP",
		address: "0x5b11aAcB6Bddb9ffab908FDCE739Bf4aed554327",
		decimals: 18
	},
	{
		symbol: "TDS",
		address: "0x6295Ab2BE04A617747481B292c390BfcA592Cf28",
		decimals: 18
	},
	{
		symbol: "TEAM",
		address: "0xb05AF453011d7ad68a92b0065FFD9d1277eD2741",
		decimals: 18
	},
	{
		symbol: "TEAM",
		address: "0x1c79ab32C66aCAa1e9E81952B8AAa581B43e54E7",
		decimals: 4
	},
	{
		symbol: "TEAM.CX",
		address: "0x7b1FBA5ddd5cFEE1fCC27514d8f7dAe4669C4D82",
		decimals: 8
	},
	{
		symbol: "TECH",
		address: "0xA1BA7186eeC1Be5114b0Cf49b95B23aDC4131B51",
		decimals: 10
	},
	{
		symbol: "TECN",
		address: "0x7dEe371A788f9BD6c546dF83F0d74fBe37cbf006",
		decimals: 18
	},
	{
		symbol: "TED",
		address: "0xa2A7963B19A82665e0F471C0Bee29B111d4AE0a2",
		decimals: 18
	},
	{
		symbol: "TEEN",
		address: "0xD3003b3778bf4887e73EB320B71a04728961505C",
		decimals: 18
	},
	{
		symbol: "TEL",
		address: "0x467Bccd9d29f223BcE8043b84E8C8B282827790F",
		decimals: 2
	},
	{
		symbol: "TEL",
		address: "0x85e076361cc813A908Ff672F9BAd1541474402b2",
		decimals: 2
	},
	{
		symbol: "TEL",
		address: "0xEc32A9725C59855d841ba7d8D9c99c84ff754688",
		decimals: 18
	},
	{
		symbol: "TELE",
		address: "0xB363A3C584b1f379c79fBF09df015DA5529d4dac",
		decimals: 18
	},
	{
		symbol: "TEN",
		address: "0xDD16eC0F66E54d453e6756713E533355989040E4",
		decimals: 18
	},
	{
		symbol: "TENA",
		address: "0xE14A603f7c77d4101A87859b8736a04CFD85C688",
		decimals: 18
	},
	{
		symbol: "TEND",
		address: "0x1453Dbb8A29551ADe11D89825CA812e05317EAEB",
		decimals: 18
	},
	{
		symbol: "TENX",
		address: "0x515bA0a2E286AF10115284F151cF398688A69170",
		decimals: 18
	},
	{
		symbol: "TEP",
		address: "0x2E65E12b5f0fD1D58738c6F38dA7D57F5F183d1c",
		decimals: 8
	},
	{
		symbol: "TER.CX",
		address: "0xB22083BA68EBe04a5306625d01F25eF17475cB1B",
		decimals: 8
	},
	{
		symbol: "TEU",
		address: "0xeEAc3F8da16bb0485a4A11c5128b0518DaC81448",
		decimals: 18
	},
	{
		symbol: "TFB",
		address: "0x79cdFa04e3c4EB58C4f49DAE78b322E5b0D38788",
		decimals: 18
	},
	{
		symbol: "TFC",
		address: "0x8694EE05B45c9fE1058CE532de8dbCf1d84A4154",
		decimals: 5
	},
	{
		symbol: "TFD",
		address: "0xE5F166c0D8872B68790061317BB6CcA04582C912",
		decimals: 18
	},
	{
		symbol: "TFG1",
		address: "0x666a64F5567c3145fbA7CA9EF73648Cd4fA2008F",
		decimals: 8
	},
	{
		symbol: "TFL",
		address: "0xa7f976C360ebBeD4465c2855684D1AAE5271eFa9",
		decimals: 8
	},
	{
		symbol: "TFT",
		address: "0xaeF4F02E31CdbF007f8D98da4aE365188A0E9eCC",
		decimals: 8
	},
	{
		symbol: "TFX.CX",
		address: "0x3f63e135346C97Bc1b3388BA7f1185Af7d5DF0e6",
		decimals: 8
	},
	{
		symbol: "TGAME",
		address: "0xF8e06E4e4A80287FDCa5b02dcCecAa9D0954840F",
		decimals: 18
	},
	{
		symbol: "TGBP",
		address: "0x106d8fB5775a57ae38A2FFB1441eb0963e09dBa7",
		decimals: 18
	},
	{
		symbol: "TGBP",
		address: "0x7BD33c6DAf9ba1bdbC7652fabDC7B308f41668c5",
		decimals: 18
	},
	{
		symbol: "TGBP",
		address: "0x00000000441378008EA67F4284A57932B1c000a5",
		decimals: 18
	},
	{
		symbol: "TGBP",
		address: "0x5EC598ee5838E1D786b6ac9e4aDeB6BD5DdE1a87",
		decimals: 18
	},
	{
		symbol: "TGBP",
		address: "0x8511dC1Dece6FaF58f696AAC265Fef18Da7D7a05",
		decimals: 18
	},
	{
		symbol: "TGBP",
		address: "0x808662d05B8D6F613cab2FBfae3A32b20bF44F9A",
		decimals: 18
	},
	{
		symbol: "TGBP",
		address: "0x137ceE63f06ca413Ca51D485fE98B0d12bAcFA14",
		decimals: 18
	},
	{
		symbol: "TGT",
		address: "0xf96AA656eC0E0Ac163590DB372B430Cf3C0d61cA",
		decimals: 18
	},
	{
		symbol: "TGT",
		address: "0xAc3Da587eac229C9896D919aBC235CA4Fd7f72c1",
		decimals: 1
	},
	{
		symbol: "TGT.CX",
		address: "0x9D4a6860830Bb62459FE8528Fd249D972DdFf6c4",
		decimals: 8
	},
	{
		symbol: "Thar",
		address: "0x96c30D5499EF6eA96A9c221Bc18BC39D29c97F27",
		decimals: 18
	},
	{
		symbol: "THBC",
		address: "0x04ad70466A79Dd1251F22Ad426248088724ff32B",
		decimals: 4
	},
	{
		symbol: "THE",
		address: "0xB4a677B0E363c3815d46326954a4E4d2B1ACe357",
		decimals: 18
	},
	{
		symbol: "TheDAO",
		address: "0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413",
		decimals: 16
	},
	{
		symbol: "THETA",
		address: "0x3883f5e181fccaF8410FA61e12b59BAd963fb645",
		decimals: 18
	},
	{
		symbol: "THEX",
		address: "0x3204DcdE0C50b7b2E606587663a0Fe2EE8DFb6Bf",
		decimals: 0
	},
	{
		symbol: "THIRM",
		address: "0xb526FD41360c98929006f3bDcBd16d55dE4b0069",
		decimals: 18
	},
	{
		symbol: "THKD",
		address: "0x0000852600CEB001E08e00bC008be620d60031F2",
		decimals: 18
	},
	{
		symbol: "THM",
		address: "0xf1dd5964EAbCC6e86230fa6f222677CFdAaf9F0e",
		decimals: 18
	},
	{
		symbol: "THO",
		address: "0x64fa5D4FAfa693D4B9f4E16fbDd1ac0e30b048b2",
		decimals: 18
	},
	{
		symbol: "THOR",
		address: "0x063e49E4F59365711d9218E67314dD98f00d97e5",
		decimals: 8
	},
	{
		symbol: "THP",
		address: "0xAeC39406348bEcc28aa008b70FEf6063a36CE10f",
		decimals: 18
	},
	{
		symbol: "THPC",
		address: "0x38A19bA829f192A30Ec7e03cda1368c50DAD9785",
		decimals: 8
	},
	{
		symbol: "THPT",
		address: "0x9F58702Ef19ebEB76363884362439a8691E3f033",
		decimals: 4
	},
	{
		symbol: "THR",
		address: "0x1Cb3209D45B2a60B7fBCA1cCDBF87f674237A4aa",
		decimals: 4
	},
	{
		symbol: "thrm",
		address: "0xa93f2a6b50D92BD64848f5ea15164F558B75ce9C",
		decimals: 18
	},
	{
		symbol: "THRN",
		address: "0x35A735B7D1d811887966656855F870c05fD0A86D",
		decimals: 18
	},
	{
		symbol: "THRT",
		address: "0x4f27053F32edA8Af84956437Bc00e5fFa7003287",
		decimals: 18
	},
	{
		symbol: "THS",
		address: "0xD0Df51CeC800D1F8045722377f6faceba8d15A4d",
		decimals: 18
	},
	{
		symbol: "THUG",
		address: "0xfe7B915A0bAA0E79f85c5553266513F7C1c03Ed0",
		decimals: 18
	},
	{
		symbol: "THX",
		address: "0xA98ED1fD277EaD2c00D143Cbe1465F59E65A0066",
		decimals: 18
	},
	{
		symbol: "TIC",
		address: "0x614b9802D45Aa1bC2282651dC1408632F9027A6e",
		decimals: 18
	},
	{
		symbol: "TIC",
		address: "0x72430A612Adc007c50e3b6946dBb1Bb0fd3101D1",
		decimals: 8
	},
	{
		symbol: "TICO",
		address: "0x7F4B2A690605A7cbb66F7AA6885EbD906a5e2E9E",
		decimals: 8
	},
	{
		symbol: "TICO",
		address: "0x36B60a425b82483004487aBc7aDcb0002918FC56",
		decimals: 8
	},
	{
		symbol: "TIDAL",
		address: "0x29CbD0510EEc0327992CD6006e63F9Fa8E7f33B7",
		decimals: 18
	},
	{
		symbol: "TIE",
		address: "0x999967E2Ec8A74B7c8E9dB19E039d920B31d39D0",
		decimals: 18
	},
	{
		symbol: "TIEN",
		address: "0x67A1Ca08e580af9f54dC9b03Fd59EC2388AD7c6c",
		decimals: 18
	},
	{
		symbol: "TIG",
		address: "0x749826F1041CAF0Ea856a4b3578Ba327B18335F8",
		decimals: 18
	},
	{
		symbol: "TIG",
		address: "0xEee2d00Eb7DEB8Dd6924187f5AA3496B7d06E62A",
		decimals: 18
	},
	{
		symbol: "TILE",
		address: "0x25f735b108B4273fb0aceB87599ED8Bba10065De",
		decimals: 18
	},
	{
		symbol: "TILY",
		address: "0x834625F5D8B006D70a6CaAEeF73C29442F156dAF",
		decimals: 18
	},
	{
		symbol: "TIME",
		address: "0x485d17A6f1B8780392d53D64751824253011A260",
		decimals: 8
	},
	{
		symbol: "TIME",
		address: "0x6531f133e6DeeBe7F2dcE5A0441aA7ef330B4e53",
		decimals: 8
	},
	{
		symbol: "TIME",
		address: "0xA54C67bd320Da4F9725a6f585b7635a0c09B122e",
		decimals: 6
	},
	{
		symbol: "TIO",
		address: "0x80BC5512561c7f85A3A9508c7df7901b370Fa1DF",
		decimals: 18
	},
	{
		symbol: "TIOX",
		address: "0xd947b0ceab2A8885866B9A04A06AE99DE852a3d4",
		decimals: 18
	},
	{
		symbol: "TITAN",
		address: "0x3A8cCCB969a61532d1E6005e2CE12C200caeCe87",
		decimals: 18
	},
	{
		symbol: "TITAN",
		address: "0x29Ff774B920b8FF581108d0c12E5073dF5158E8a",
		decimals: 18
	},
	{
		symbol: "TIX",
		address: "0xEa1f346faF023F974Eb5adaf088BbCdf02d761F4",
		decimals: 18
	},
	{
		symbol: "TIX",
		address: "0x39b23f14528Fb000E8C46ad75DF2dB9a3Ee49422",
		decimals: 8
	},
	{
		symbol: "TKA",
		address: "0xdaE1Baf249964bc4b6aC98c3122f0e3E785fd279",
		decimals: 18
	},
	{
		symbol: "TKC",
		address: "0xeeB7A9744e82D00998ebfE232F4b00F3d03b7A77",
		decimals: 18
	},
	{
		symbol: "TKL",
		address: "0xa6d6720258CbB7E4A79BB2F379e3d8f25d78B716",
		decimals: 18
	},
	{
		symbol: "TKN",
		address: "0xaAAf91D9b90dF800Df4F55c205fd6989c977E73a",
		decimals: 8
	},
	{
		symbol: "TKO",
		address: "0x4E676548D262ea27825aA9c5150121AF65dfA304",
		decimals: 18
	},
	{
		symbol: "TKP",
		address: "0xd31695a1d35E489252CE57b129FD4b1B05E6AcaC",
		decimals: 18
	},
	{
		symbol: "TKR",
		address: "0xB45a50545bEEAB73F38F31E5973768C421805E5E",
		decimals: 18
	},
	{
		symbol: "TKX",
		address: "0x667102BD3413bFEaa3Dffb48fa8288819E480a88",
		decimals: 8
	},
	{
		symbol: "TKX",
		address: "0x058Ef0Ba85E053e55d357C8A95BC6Ea7458Def8a",
		decimals: 18
	},
	{
		symbol: "TLB",
		address: "0x8ab0565dFE65BF9BE754D7b0Dadbb42c4eCaEC01",
		decimals: 18
	},
	{
		symbol: "TLC",
		address: "0x2352858080A45D776609b5449A1B8Dcb1AE549c8",
		decimals: 18
	},
	{
		symbol: "TLC",
		address: "0x4EAC6Df4B1D8e2FAa125d10ba2531B491114c6b6",
		decimals: 18
	},
	{
		symbol: "TLM",
		address: "0x888888848B652B3E3a0f34c96E00EEC0F3a23F72",
		decimals: 4
	},
	{
		symbol: "TLN",
		address: "0x679131F591B4f369acB8cd8c51E68596806c3916",
		decimals: 18
	},
	{
		symbol: "TLOS",
		address: "0x7825e833D495F3d1c28872415a4aee339D26AC88",
		decimals: 18
	},
	{
		symbol: "TLRY.CX",
		address: "0x7c9511E3e8b8875694d283B28Cb21f12c0017B69",
		decimals: 8
	},
	{
		symbol: "TLW",
		address: "0x06f3CDabae564B0546529b4DD8FeF1bcD4235753",
		decimals: 8
	},
	{
		symbol: "TLX",
		address: "0xb3616550aBc8AF79c7A5902DEF9Efa3bC9A95200",
		decimals: 8
	},
	{
		symbol: "TMB",
		address: "0x1De09690e0d3c75C22cd19aCC1AEBdE46bbC7d25",
		decimals: 0
	},
	{
		symbol: "TMC",
		address: "0x1c153BADb7e54AbcdCB65f0A09fCd6f10dE36aA3",
		decimals: 18
	},
	{
		symbol: "TMC",
		address: "0xe13559cf6eDf84bD04bf679e251f285000B9305E",
		decimals: 18
	},
	{
		symbol: "TMCN",
		address: "0x5D45AA01b73c971c65f3DF409c9b3627b8FE2726",
		decimals: 18
	},
	{
		symbol: "TME",
		address: "0x6E742E29395Cf5736c358538f0f1372AB3dFE731",
		decimals: 18
	},
	{
		symbol: "TMED",
		address: "0xd32641191578Ea9b208125dDD4EC5E7B84FcaB4C",
		decimals: 18
	},
	{
		symbol: "TMH",
		address: "0x901fe080Ee18383BF5494049538F1bca155F4d0b",
		decimals: 18
	},
	{
		symbol: "TMP",
		address: "0x25677657E70694C79f64C3D477796aCb43A6f1c0",
		decimals: 5
	},
	{
		symbol: "TMPL",
		address: "0x52132a43D7cAE69B23abE77B226fA1a5BC66b839",
		decimals: 9
	},
	{
		symbol: "TMT",
		address: "0x3209f98BeBF0149B769ce26D71F7aEA8E435EfEa",
		decimals: 18
	},
	{
		symbol: "TMT",
		address: "0xB9cB7905981198ADd8059114B3b7dc7042B52f7b",
		decimals: 18
	},
	{
		symbol: "TMT",
		address: "0x6F02055E3541DD74A1aBD8692116c22fFAFaDc5D",
		decimals: 18
	},
	{
		symbol: "TMTG",
		address: "0x10086399DD8c1e3De736724AF52587a2044c9fA2",
		decimals: 18
	},
	{
		symbol: "TMUS.CX",
		address: "0x4D9F37E79723A3bb910E1b2fc7b1ef851261B1d9",
		decimals: 8
	},
	{
		symbol: "TMV",
		address: "0x5abFd418AdB35e89c68313574eB16BdfFc15e607",
		decimals: 18
	},
	{
		symbol: "TNB",
		address: "0xF7920B0768Ecb20A123fAc32311d07D193381d6f",
		decimals: 18
	},
	{
		symbol: "TNO",
		address: "0xAD6683b7f3618c44F5CA6040902812Dd890DdE4d",
		decimals: 18
	},
	{
		symbol: "TNPC",
		address: "0xE1229dc9824f9911ba4b0f427F1Ac95FBDD10308",
		decimals: 8
	},
	{
		symbol: "TNS",
		address: "0xb0280743b44bF7db4B6bE482b2Ba7b75E5dA096C",
		decimals: 18
	},
	{
		symbol: "TNT",
		address: "0x08f5a9235B08173b7569F83645d2c7fB55e8cCD8",
		decimals: 8
	},
	{
		symbol: "TOB",
		address: "0x7777770f8A6632ff043c8833310e245EBa9209E6",
		decimals: 18
	},
	{
		symbol: "TOC",
		address: "0x5d5D4962621b24547feC4a5161Cb1A07eBD9E556",
		decimals: 18
	},
	{
		symbol: "TOC",
		address: "0xE02784175C3BE0DEa7CC0F284041b64503639E66",
		decimals: 18
	},
	{
		symbol: "TOCC",
		address: "0x71179af0e9D44a8299EB54C8C4EDA226e8A93859",
		decimals: 8
	},
	{
		symbol: "TOK",
		address: "0x9a49f02e128a8E989b443a8f94843C0918BF45E7",
		decimals: 8
	},
	{
		symbol: "TOKIO",
		address: "0x3aBA9f23E857E6DbC4062a2eD4DBB041025B59b0",
		decimals: 18
	},
	{
		symbol: "TOKO",
		address: "0x0c963A1B52Eb97C5e457c7D76696F8b95c3087eD",
		decimals: 18
	},
	{
		symbol: "TOL",
		address: "0xd07D9Fe2d2cc067015E2b4917D24933804f42cFA",
		decimals: 18
	},
	{
		symbol: "TOM",
		address: "0xF7970499814654CD13Cb7B6E7634A12a7A8A9ABc",
		decimals: 18
	},
	{
		symbol: "TOMO",
		address: "0x8b353021189375591723E7384262F45709A3C3dC",
		decimals: 18
	},
	{
		symbol: "TOMOBEAR",
		address: "0xA1653CB37852249e4f18dfBc473a5cE3F88Fa6aD",
		decimals: 18
	},
	{
		symbol: "TOMOBULL",
		address: "0xa38920C00D1a5303dB538A3Ea08da7a779e1F751",
		decimals: 18
	},
	{
		symbol: "TON",
		address: "0x2C7F4cca29a4627A7A8e20440abF107ACC3E42EB",
		decimals: 2
	},
	{
		symbol: "TON",
		address: "0x6a6c2adA3Ce053561C2FbC3eE211F23d9b8C520a",
		decimals: 18
	},
	{
		symbol: "TON",
		address: "0x2be5e8c109e2197D077D13A82dAead6a9b3433C5",
		decimals: 18
	},
	{
		symbol: "TOOLS",
		address: "0xeE59784fc8fBA300Ae37FA41E229163DFaEb68c3",
		decimals: 18
	},
	{
		symbol: "TOOR",
		address: "0x8eb965ee9cCFBCE76c0a06264492c0afEfc2826d",
		decimals: 18
	},
	{
		symbol: "TOOS",
		address: "0xdb03Cf87e195eba7F1A259d3a70030918d7EfA2e",
		decimals: 8
	},
	{
		symbol: "TOP",
		address: "0xED6aAd9650815D1647480CaA1133043800d31533",
		decimals: 18
	},
	{
		symbol: "TOP",
		address: "0xdcD85914b8aE28c1E62f1C488E1D968D5aaFfE2b",
		decimals: 18
	},
	{
		symbol: "TOPB",
		address: "0xF6317DD9B04097a9E7B016cd23DCAa7CfE19D9c6",
		decimals: 18
	},
	{
		symbol: "TOPC",
		address: "0x1b6C5864375b34aF3Ff5Bd2E5f40Bc425B4a8D79",
		decimals: 6
	},
	{
		symbol: "TOR",
		address: "0x4f5f2EEA4ED3485E5e23a39704d5fD9d0A423886",
		decimals: 18
	},
	{
		symbol: "TOR",
		address: "0x9ea20fBFAA44efBc60C6728fCdBA17f01b7E04FE",
		decimals: 8
	},
	{
		symbol: "TORI",
		address: "0xc71E20E54ADfC415f79bF0A8F11122917920050E",
		decimals: 18
	},
	{
		symbol: "TORM",
		address: "0x8cEa63f6383c1C13633F179F1af70ef75701a979",
		decimals: 18
	},
	{
		symbol: "TORN",
		address: "0x77777FeDdddFfC19Ff86DB637967013e6C6A116C",
		decimals: 18
	},
	{
		symbol: "TOROCUS",
		address: "0x406ae253Fb0aa898F9912fB192c1e6dEb9623A07",
		decimals: 18
	},
	{
		symbol: "TORQ",
		address: "0x1C65C261cb89178b02CF2aEE20058b992787D770",
		decimals: 18
	},
	{
		symbol: "TOS",
		address: "0xFb5a551374B656C6e39787B1D3A03fEAb7f3a98E",
		decimals: 18
	},
	{
		symbol: "TOT",
		address: "0x619ff65f38474989959c707B2144EBd2Cbe58D1C",
		decimals: 8
	},
	{
		symbol: "TOTO",
		address: "0xe3278DF3eB2085bA9B6899812A99a10f9CA5E0Df",
		decimals: 8
	},
	{
		symbol: "TOU",
		address: "0x1E29ca8c874b4dFF828297cc2e9856819eea0933",
		decimals: 18
	},
	{
		symbol: "TPD",
		address: "0x2a6AaC80905912aC1E769e28cdA3807A4d20b3b6",
		decimals: 18
	},
	{
		symbol: "TPP",
		address: "0x11dD5dDdD1bd9b2Df6fF908FBcf8Db09CefED29B",
		decimals: 12
	},
	{
		symbol: "TPT",
		address: "0xC596bD09d652827b0106292D3e378D5938df4B12",
		decimals: 18
	},
	{
		symbol: "TPX.CX",
		address: "0x9570893324f2bBe9E774230Ee3524E8928e0cE51",
		decimals: 8
	},
	{
		symbol: "TQN",
		address: "0x6613876533Bc69b9DD628611a4D5dD2CCD8C7638",
		decimals: 18
	},
	{
		symbol: "TRAC",
		address: "0xaA7a9CA87d3694B5755f213B5D04094b8d0F0A6F",
		decimals: 18
	},
	{
		symbol: "TRAD",
		address: "0xb09aD98524780228D2df4f34AA665D9Dbb9999E4",
		decimals: 18
	},
	{
		symbol: "TRADE",
		address: "0x6F87D756DAf0503d08Eb8993686c7Fc01Dc44fB1",
		decimals: 18
	},
	{
		symbol: "TRAK",
		address: "0x12759512D326303B45f1ceC8F7B6fd96F387778E",
		decimals: 18
	},
	{
		symbol: "TRAT",
		address: "0x0cbC9b02B8628AE08688b5cC8134dc09e36C443b",
		decimals: 5
	},
	{
		symbol: "TRB",
		address: "0x901F8679a6EF435d533732f5eA49bb82d568BE99",
		decimals: 18
	},
	{
		symbol: "TRB",
		address: "0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0",
		decimals: 18
	},
	{
		symbol: "TRB",
		address: "0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5",
		decimals: 18
	},
	{
		symbol: "TRBT",
		address: "0x7031AB87DCC46818806EC07aF46fa8c2aD2A2BFC",
		decimals: 18
	},
	{
		symbol: "TRC",
		address: "0xdB52a87cda28EdA00f8aDd1C79c9DB4a50a70457",
		decimals: 18
	},
	{
		symbol: "TRC",
		address: "0xcB3F902bf97626391bF8bA87264bbC3DC13469be",
		decimals: 18
	},
	{
		symbol: "TRCL",
		address: "0x0a9d68886a0D7Db83a30ec00d62512483e5Ad437",
		decimals: 0
	},
	{
		symbol: "TRCN",
		address: "0x566Fd7999B1Fc3988022bD38507A48F0bCf22c77",
		decimals: 18
	},
	{
		symbol: "TRCT",
		address: "0x30ceCB5461A449A90081F5a5F55db4e048397BAB",
		decimals: 8
	},
	{
		symbol: "TRDS",
		address: "0x9AD685A3eAa6b0a1Ea601f48b7797A12011fDeb0",
		decimals: 3
	},
	{
		symbol: "TRDT",
		address: "0x33f90Dee07c6E8B9682dD20F73E6C358B2ED0f03",
		decimals: 0
	},
	{
		symbol: "TRET",
		address: "0xC6D603A9Df53D1542552058c382bf115AACE70C7",
		decimals: 8
	},
	{
		symbol: "TRI",
		address: "0x29d9aac5EE0B954690ccE0007a87ADAd129fE2E2",
		decimals: 10
	},
	{
		symbol: "TRI",
		address: "0xc299004a310303D1C0005Cb14c70ccC02863924d",
		decimals: 9
	},
	{
		symbol: "TRIAS",
		address: "0x3A856d4effa670C54585a5D523e96513e148e95d",
		decimals: 18
	},
	{
		symbol: "TRIO",
		address: "0x8B40761142B9aa6dc8964e61D0585995425C3D94",
		decimals: 18
	},
	{
		symbol: "TRIP.CX",
		address: "0x155085e375F53eC2a15c6f372804aBF7dBCD11da",
		decimals: 8
	},
	{
		symbol: "TRM",
		address: "0xbfFe4FDCD397e7942Fd7c9F99255e0AA34E4B3FB",
		decimals: 8
	},
	{
		symbol: "TRN",
		address: "0x70968FEAF13299d0dBf78f66860bAb9DbE3856bc",
		decimals: 18
	},
	{
		symbol: "TRN",
		address: "0xC4C1F484b6dC3edB27F3A208735Dc96Ac9C03BDD",
		decimals: 18
	},
	{
		symbol: "TRND",
		address: "0xc3dD23A0a854b4f9aE80670f528094E9Eb607CCb",
		decimals: 18
	},
	{
		symbol: "TRON",
		address: "0x9693dDED163393F18810C7A799c662998BF8BF3e",
		decimals: 18
	},
	{
		symbol: "TRST",
		address: "0xCb94be6f13A1182E4A4B6140cb7bf2025d28e41B",
		decimals: 6
	},
	{
		symbol: "TRT",
		address: "0x32054526df40FBB08b733Abe256A8d21De58432D",
		decimals: 18
	},
	{
		symbol: "TRU",
		address: "0xaD9355F782c6Ec75F134B93304b8F9a691a4432a",
		decimals: 18
	},
	{
		symbol: "TRU",
		address: "0x4C19596f5aAfF459fA38B0f7eD92F11AE6543784",
		decimals: 8
	},
	{
		symbol: "TRUE",
		address: "0xA4d17AB1eE0efDD23edc2869E7BA96B89eEcf9AB",
		decimals: 18
	},
	{
		symbol: "TRUEBIT",
		address: "0x5062946b19C0f01467AD1E6aE8d792395078a7c8",
		decimals: 18
	},
	{
		symbol: "TRUMP",
		address: "0x012ba3ae1074aE43A34A14BCA5c4eD0Af01b6e53",
		decimals: 18
	},
	{
		symbol: "TRUMPLOSE",
		address: "0x70878b693A57a733A79560e33cF6a828E685d19a",
		decimals: 18
	},
	{
		symbol: "TRUMPWIN",
		address: "0x073aF3f70516380654Ba7C5812c4Ab0255F081Bc",
		decimals: 18
	},
	{
		symbol: "TRUSD",
		address: "0xDD436a0Dce9244B36599AE7b22f0373b4e33992d",
		decimals: 18
	},
	{
		symbol: "TRUST",
		address: "0x57700244B20f84799a31c6C96DadFF373ca9D6c5",
		decimals: 18
	},
	{
		symbol: "TRUST",
		address: "0x0EE815F8BE0B0259E2657C8b8d1E57Bd3D60F26b",
		decimals: 6
	},
	{
		symbol: "TRV",
		address: "0x72955eCFf76E48F2C8AbCCe11d54e5734D6f3657",
		decimals: 18
	},
	{
		symbol: "TRXBEAR",
		address: "0x86807Da5B92d31F67E128771CAcb85F3579646eA",
		decimals: 18
	},
	{
		symbol: "TRXBULL",
		address: "0xc175E77b04F2341517334Ea3Ed0b198A01A97383",
		decimals: 18
	},
	{
		symbol: "TRXC",
		address: "0xaD5Fe5B0B8eC8fF4565204990E4405B2Da117d8e",
		decimals: 0
	},
	{
		symbol: "TRXDOOM",
		address: "0xc58432a1969a2CB15f14dAe6dcCA736cFa60285a",
		decimals: 18
	},
	{
		symbol: "TRXHEDGE",
		address: "0xe58C8dF0088Cf27b26C7D546A9835deAcC29496c",
		decimals: 18
	},
	{
		symbol: "TRXMOON",
		address: "0x681F1A3761384109E5Bc52F7d479eF27540A5641",
		decimals: 18
	},
	{
		symbol: "TRY",
		address: "0xe431a4c5DB8B73c773e06cf2587dA1EB53c41373",
		decimals: 18
	},
	{
		symbol: "TRYB",
		address: "0x2C537E5624e4af88A7ae4060C022609376C8D0EB",
		decimals: 6
	},
	{
		symbol: "TRYBBEAR",
		address: "0xA5dDFCA8B837cCD0cf80fe6C24E2A9018FB50dbA",
		decimals: 18
	},
	{
		symbol: "TRYBBULL",
		address: "0xc7038cCf60E48C5b7119E55566A6aD9f2D66C7c2",
		decimals: 18
	},
	{
		symbol: "TRYL",
		address: "0x005f977f633d1C23748294671B0e69F3512E6702",
		decimals: 2
	},
	{
		symbol: "TRYX",
		address: "0x6FAff971d9248e7d398A98FdBE6a81F6d7489568",
		decimals: 18
	},
	{
		symbol: "TRZ",
		address: "0x23935765cDf2F7548F86042Ff053D16A22C4e240",
		decimals: 18
	},
	{
		symbol: "TSD",
		address: "0x4846239FDF4D4C1AEB26729fa064B0205acA90e1",
		decimals: 18
	},
	{
		symbol: "TSL",
		address: "0x03806Ce5ef69Bd9780EDFb04c29da1F23Db96294",
		decimals: 18
	},
	{
		symbol: "TSLA.CX",
		address: "0xd68A2cb2bacD96d81E7342F041851b68458116eD",
		decimals: 8
	},
	{
		symbol: "TSR",
		address: "0x58959E0C71080434f237bD42d07Cd84B74CeF438",
		decimals: 5
	},
	{
		symbol: "TST",
		address: "0x1aA0DD2faaDA457d467a1C426b63c6bf8c176663",
		decimals: 18
	},
	{
		symbol: "TST",
		address: "0xD9baE39c725A1864b1133Ad0eF1640d02f79B78c",
		decimals: 18
	},
	{
		symbol: "TST",
		address: "0xc6003a33F7464d6E6c1DC17344A75A9952187541",
		decimals: 18
	},
	{
		symbol: "TST",
		address: "0xf67041758D3B6e56D6fDafA5B32038302C3634DA",
		decimals: 18
	},
	{
		symbol: "TST",
		address: "0x9EEAb220E44410C16aC80C12830bC11AF7dD5C6E",
		decimals: 18
	},
	{
		symbol: "TSW",
		address: "0x6B87999bE87358065bBdE41e8a0fe0B7b1cd2514",
		decimals: 18
	},
	{
		symbol: "TTA",
		address: "0xaaB606817809841E8b1168be8779Eeaf6744Ef64",
		decimals: 18
	},
	{
		symbol: "TTC",
		address: "0xaFf4ABDc75f07387401ba9bC0f75EBe4c734B4c9",
		decimals: 18
	},
	{
		symbol: "TTC",
		address: "0x9389434852b94bbaD4c8AfEd5B7BDBc5Ff0c2275",
		decimals: 18
	},
	{
		symbol: "TTM",
		address: "0x714B1fDed61090a6C49Eb0B4D088B8e5EBd64e61",
		decimals: 18
	},
	{
		symbol: "TTP",
		address: "0x38f22479795a1A51Ccd1E5A41F09C7525fb27318",
		decimals: 15
	},
	{
		symbol: "TTT",
		address: "0x2494a68C1484376fEf880b4c24D91f049d29B02A",
		decimals: 18
	},
	{
		symbol: "TTU",
		address: "0x9CDa8A60dd5AfA156c95Bd974428d91a0812e054",
		decimals: 18
	},
	{
		symbol: "TTV",
		address: "0xa838be6E4b760E6061D4732D6B9F11Bf578f9A76",
		decimals: 18
	},
	{
		symbol: "TTWO.CX",
		address: "0x9945E8d665365A3B27654F27a7CFe6d70B2CB9B5",
		decimals: 8
	},
	{
		symbol: "TUBER",
		address: "0xd1766A85B0d6F81185782dC07F15326d63C3cBaa",
		decimals: 18
	},
	{
		symbol: "TUDA",
		address: "0x5E3002dff591C5e75Bb9DEdae268049742E6b13a",
		decimals: 8
	},
	{
		symbol: "TUG",
		address: "0x45088E0838D1d55491ebEa1b2648f6f5F378aaF1",
		decimals: 8
	},
	{
		symbol: "TUSD",
		address: "0x0000000000085d4780B73119b644AE5ecd22b376",
		decimals: 18
	},
	{
		symbol: "TUSD",
		address: "0x8dd5fbCe2F6a956C3022bA3663759011Dd51e73E",
		decimals: 18
	},
	{
		symbol: "TUT",
		address: "0xfE3A06a947a036EFf9f9E8EC25B385ff4E853c38",
		decimals: 18
	},
	{
		symbol: "TVK",
		address: "0xd084B83C305daFD76AE3E1b4E1F1fe2eCcCb3988",
		decimals: 18
	},
	{
		symbol: "TVND",
		address: "0x3Dc0501c32beE0cc1e629d590302A4b909797474",
		decimals: 18
	},
	{
		symbol: "TVT",
		address: "0x98E0438d3eE1404FEA48E38e92853BB08Cfa68bD",
		decimals: 8
	},
	{
		symbol: "TWBT",
		address: "0xe7c6708bf942a80c9a5811033a2a68205b034486",
		decimals: 18
	},
	{
		symbol: "TWDT",
		address: "0x35A4e77aE040AFc9743157911d39D1451cF2F05d",
		decimals: 6
	},
	{
		symbol: "TWEE",
		address: "0x2b6fF53Fc2493CcD5202D80a6C439741414C5Ff2",
		decimals: 18
	},
	{
		symbol: "TWLO.CX",
		address: "0x6f612996A752DC152cebeF10C2E3E0649E49CdF4",
		decimals: 8
	},
	{
		symbol: "TWN",
		address: "0x2eF1aB8a26187C58BB8aAeB11B2fC6D25C5c0716",
		decimals: 18
	},
	{
		symbol: "TWNKL",
		address: "0xfbd0d1c77B501796A35D86cF91d65D9778EeE695",
		decimals: 3
	},
	{
		symbol: "TWOB",
		address: "0x975CE667d59318e13Da8acD3D2f534BE5a64087B",
		decimals: 18
	},
	{
		symbol: "TWS",
		address: "0xa4f267b2bf5C47873Ec85cB55749368bc15eC2ec",
		decimals: 8
	},
	{
		symbol: "TWTR.CX",
		address: "0xDFe35224B17B2E12b92e3987340abf5247fCe201",
		decimals: 8
	},
	{
		symbol: "TXC",
		address: "0xc11551BB497875050b69A2FDCCC20A53a9a70263",
		decimals: 18
	},
	{
		symbol: "TXH",
		address: "0x5432C580E34f590f4dd901B825DDeb92e905e826",
		decimals: 18
	},
	{
		symbol: "TXL",
		address: "0x8711CF7764d23D32092C0DCEdfDAc63eCe1E6cF3",
		decimals: 18
	},
	{
		symbol: "TXL",
		address: "0x8eEF5a82E6Aa222a60F009ac18c24EE12dBf4b41",
		decimals: 18
	},
	{
		symbol: "TXT",
		address: "0xA57a2aD52AD6b1995F215b12fC037BffD990Bc5E",
		decimals: 18
	},
	{
		symbol: "TXT.CX",
		address: "0x57b1b057330D428199477B463f93a1fc9E61F94f",
		decimals: 8
	},
	{
		symbol: "TYD",
		address: "0xC8717FE8465D51d83581c3941171C0b74CB64F9B",
		decimals: 8
	},
	{
		symbol: "TYPE",
		address: "0xeaf61FC150CD5c3BeA75744e830D916E60EA5A9F",
		decimals: 4
	},
	{
		symbol: "TYT",
		address: "0x614FD8F06cE4D93AA2361B342C86554eB5CB39f1",
		decimals: 6
	},
	{
		symbol: "UAA.CX",
		address: "0x4ad72841EEA8Cd10dB1D2AeB8e2c59064126c83D",
		decimals: 8
	},
	{
		symbol: "UAT",
		address: "0x01C0987E88F778DF6640787226bc96354E1a9766",
		decimals: 18
	},
	{
		symbol: "UAX",
		address: "0x1Fc31488f28ac846588FFA201cDe0669168471bD",
		decimals: 2
	},
	{
		symbol: "UBBEY",
		address: "0x6cB1C2B61e24aD08bF5FFF4d2b13ea987d211a88",
		decimals: 18
	},
	{
		symbol: "UBC",
		address: "0x2D3E7D4870a51b918919E7B851FE19983E4c38d5",
		decimals: 18
	},
	{
		symbol: "UBER.CX",
		address: "0x430ACa35d154FA19b0A679044241CdDbf89B1C90",
		decimals: 8
	},
	{
		symbol: "UBEX",
		address: "0x6704B673c70dE9bF74C8fBa4b4bd748F0e2190E1",
		decimals: 18
	},
	{
		symbol: "UBIT",
		address: "0xD750430Fb81dc53a23aD225cdc82D7E4C22B0cFB",
		decimals: 6
	},
	{
		symbol: "UBL",
		address: "0xede35FeA9186F117D90c450a390Bb6d6Fdd70aFB",
		decimals: 18
	},
	{
		symbol: "UBN",
		address: "0xDB13025b219dB5e4529f48b65Ff009a26B6Ae733",
		decimals: 18
	},
	{
		symbol: "UBOMB",
		address: "0x265Ba42daF2D20F3F358a7361D9f69Cb4E28F0E6",
		decimals: 18
	},
	{
		symbol: "UBS",
		address: "0xde24F0bbf288ea5902C95dd0B63bA38d569a1A8e",
		decimals: 18
	},
	{
		symbol: "UBT",
		address: "0x8400D94A5cb0fa0D041a3788e395285d61c9ee5e",
		decimals: 8
	},
	{
		symbol: "UBXT",
		address: "0x8564653879a18C560E7C0Ea0E084c516C62F5653",
		decimals: 18
	},
	{
		symbol: "UC",
		address: "0xF84df2db2C87dd650641f8904aF71EbFC3ddE0Ea",
		decimals: 18
	},
	{
		symbol: "UCASH",
		address: "0x92e52a1A235d9A103D970901066CE910AAceFD37",
		decimals: 8
	},
	{
		symbol: "UCBI",
		address: "0x2adba23Cf1252dE095aCEd801e758b369EC10426",
		decimals: 8
	},
	{
		symbol: "UCN",
		address: "0xAAf37055188Feee4869dE63464937e683d61b2a1",
		decimals: 18
	},
	{
		symbol: "UCN",
		address: "0x1b76d0364e803fB94c1d5cA9Faf55f05Ee494731",
		decimals: 18
	},
	{
		symbol: "UCO",
		address: "0x8a3d77e9d6968b780564936d15B09805827C21fa",
		decimals: 18
	},
	{
		symbol: "UCT",
		address: "0x3c4bEa627039F0B7e7d21E34bB9C9FE962977518",
		decimals: 18
	},
	{
		symbol: "UDAI",
		address: "0x4aD0b81f92B16624BBcF46FC0030cFBBf8d02376",
		decimals: 18
	},
	{
		symbol: "uDOO",
		address: "0x0dF721639CA2F7fF0E1F618b918A65FFB199AC4E",
		decimals: 18
	},
	{
		symbol: "UDOO",
		address: "0x12f649A9E821F90BB143089a6e56846945892ffB",
		decimals: 18
	},
	{
		symbol: "UENC",
		address: "0xB3dD5dCe850dCa7519E74A943568B69f958df52c",
		decimals: 18
	},
	{
		symbol: "UETH",
		address: "0x77607588222e01bf892a29Abab45796A2047fc7b",
		decimals: 18
	},
	{
		symbol: "UETL",
		address: "0xa5a283557653f36cf9aA0d5cC74B1e30422349f2",
		decimals: 8
	},
	{
		symbol: "UFAC",
		address: "0x0Ff69c20206D644331e6b6cA5262eeb8D6cCf7aF",
		decimals: 6
	},
	{
		symbol: "UFC",
		address: "0x995dE3D961b40Ec6CDee0009059D48768ccbdD48",
		decimals: 8
	},
	{
		symbol: "UFFYI",
		address: "0x021576770CB3729716CCfb687afdB4c6bF720CB6",
		decimals: 18
	},
	{
		symbol: "UFR",
		address: "0xEA097A2b1dB00627B2Fa17460Ad260c016016977",
		decimals: 18
	},
	{
		symbol: "UFT",
		address: "0x0202Be363B8a4820f3F4DE7FaF5224fF05943AB1",
		decimals: 18
	},
	{
		symbol: "UGAS",
		address: "0x8716Fc5Da009D3A208f0178b637a50F4ef42400F",
		decimals: 18
	},
	{
		symbol: "UGAS-JAN21",
		address: "0x3d995510F8d82C2ea341845932b5DdDe0beAD9A3",
		decimals: 18
	},
	{
		symbol: "UGC",
		address: "0xf485C5E679238f9304D986bb2fC28fE3379200e5",
		decimals: 18
	},
	{
		symbol: "UHP",
		address: "0x9135D92e3A34e2A94e4474B74b9DC2d51118eeD5",
		decimals: 18
	},
	{
		symbol: "UIP",
		address: "0x4290563C2D7c255B5EEC87f2D3bD10389f991d68",
		decimals: 18
	},
	{
		symbol: "UKG",
		address: "0x24692791Bc444c5Cd0b81e3CBCaba4b04Acd1F3B",
		decimals: 18
	},
	{
		symbol: "ULT",
		address: "0xE884cc2795b9c45bEeac0607DA9539Fd571cCF85",
		decimals: 18
	},
	{
		symbol: "ULT",
		address: "0x09617F6fD6cF8A71278ec86e23bBab29C04353a7",
		decimals: 18
	},
	{
		symbol: "ULU",
		address: "0x035bfe6057E15Ea692c0DfdcaB3BB41a64Dd2aD4",
		decimals: 18
	},
	{
		symbol: "UMA",
		address: "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828",
		decimals: 18
	},
	{
		symbol: "UMB",
		address: "0x6fC13EACE26590B80cCCAB1ba5d51890577D83B2",
		decimals: 18
	},
	{
		symbol: "UMBR",
		address: "0xa4bBE66f151B22B167127c770016b15fF97Dd35C",
		decimals: 18
	},
	{
		symbol: "UMC",
		address: "0xd3EC111e4E33C0a1c32e3AD0BE976214d30Dc37E",
		decimals: 18
	},
	{
		symbol: "UMC",
		address: "0x190fB342aa6a15eB82903323ae78066fF8616746",
		decimals: 6
	},
	{
		symbol: "UMKA",
		address: "0x8e5afc69f6227A3ad75eD346c8723Bc62ce97123",
		decimals: 4
	},
	{
		symbol: "UMX",
		address: "0x10Be9a8dAe441d276a5027936c3aADEd2d82bC15",
		decimals: 18
	},
	{
		symbol: "UNB",
		address: "0xCaBeC58a571979f9fE825885fcb8F7A93892eaB0",
		decimals: 18
	},
	{
		symbol: "UNC",
		address: "0x4dCadD9aDFD450C2Ef997Bb71888C2995e2D33A0",
		decimals: 0
	},
	{
		symbol: "UNC",
		address: "0xf29e46887FFAE92f1ff87DfE39713875Da541373",
		decimals: 18
	},
	{
		symbol: "UNCX",
		address: "0xaDB2437e6F65682B85F814fBc12FeC0508A7B1D0",
		decimals: 18
	},
	{
		symbol: "UND",
		address: "0xBE6ac6B50F577205c9D107f37b6E205aA6ACC5D4",
		decimals: 18
	},
	{
		symbol: "UNDB",
		address: "0xd03B6ae96CaE26b743A6207DceE7Cbe60a425c70",
		decimals: 18
	},
	{
		symbol: "UNDT",
		address: "0x7C6C3b4e91923F080d6CC847A68d7330400a95d7",
		decimals: 18
	},
	{
		symbol: "UNI",
		address: "0x2730d6FdC86C95a74253BefFaA8306B40feDecbb",
		decimals: 8
	},
	{
		symbol: "UNI",
		address: "0x3e370A6c8255b065bD42bc0AC9255b269CFcC172",
		decimals: 8
	},
	{
		symbol: "UNI",
		address: "0xE6877ea9C28fBDeC631ffBc087956d0023A76bF2",
		decimals: 18
	},
	{
		symbol: "UNI",
		address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
		decimals: 18
	},
	{
		symbol: "UNI-V2",
		address: "0x989ebc2B7E1E16F1ecECd9A4Fad931618c12CE36",
		decimals: 18
	},
	{
		symbol: "UNICRAP",
		address: "0x64c5572E7a100AF9901c148D75d72c619A7f1e9d",
		decimals: 18
	},
	{
		symbol: "UNIF",
		address: "0xEC02cEc4eDD54196D2767b61F43b29A49b056fe6",
		decimals: 7
	},
	{
		symbol: "UNIFI",
		address: "0x9E78b8274e1D6a76a0dBbf90418894DF27cBCEb5",
		decimals: 18
	},
	{
		symbol: "UNIFI",
		address: "0x0eF3b2024ae079e6dBC2b37435cE30d2731F0101",
		decimals: 18
	},
	{
		symbol: "UNII",
		address: "0x825130Aa1bEeF07BdF4f389705321816D05b0d0f",
		decimals: 18
	},
	{
		symbol: "UNIS",
		address: "0x7611674336151835403c4dB867fDd30782073C65",
		decimals: 18
	},
	{
		symbol: "UNIS",
		address: "0xedC87caB8bd12ca39088DeAF9fdfb63503f19f85",
		decimals: 18
	},
	{
		symbol: "UNISTAKE",
		address: "0x9Ed8e7C9604790F7Ec589F99b94361d8AAB64E5E",
		decimals: 18
	},
	{
		symbol: "UNITS",
		address: "0x25cef4fB106E76080E88135a0e4059276FA9BE87",
		decimals: 5
	},
	{
		symbol: "UNIUSD",
		address: "0x256845e721C0c46d54E6afBD4FA3B52CB72353EA",
		decimals: 18
	},
	{
		symbol: "UNL",
		address: "0x354E514c135c8603f840ffADb4c33cDE6D2A37e0",
		decimals: 18
	},
	{
		symbol: "UNN",
		address: "0x226f7b842E0F0120b7E194D05432b3fd14773a9D",
		decimals: 18
	},
	{
		symbol: "UNOC",
		address: "0x1fff4Dd33105054E853955C6d0dBa82859C01Cff",
		decimals: 18
	},
	{
		symbol: "UNT",
		address: "0x6dddF4111ad997A8C7Be9B2e502aa476Bf1F4251",
		decimals: 18
	},
	{
		symbol: "UNY",
		address: "0x1a986F1659e11E2AE7CC6543F307bAE5cDe1C761",
		decimals: 2
	},
	{
		symbol: "UOP",
		address: "0xE4AE84448DB5CFE1DaF1e6fb172b469c161CB85F",
		decimals: 18
	},
	{
		symbol: "UOS",
		address: "0x430bd07726423A54f6d82Ab0F578CE62A3b8054D",
		decimals: 4
	},
	{
		symbol: "UOS",
		address: "0xD13c7342e1ef687C5ad21b27c2b65D772cAb5C8c",
		decimals: 4
	},
	{
		symbol: "UP",
		address: "0x6Ba460AB75Cd2c56343b3517ffeBA60748654D26",
		decimals: 8
	},
	{
		symbol: "UPA",
		address: "0xd17f8c64635e189F3CA1ca3A16b33E841Bf53427",
		decimals: 2
	},
	{
		symbol: "UPB",
		address: "0x114a86D31b8Cb3867040B48e7c17d5d04D886ce0",
		decimals: 8
	},
	{
		symbol: "UPC",
		address: "0xfb84176fE449b51661757d7c45d6Ba8a9877bD5D",
		decimals: 8
	},
	{
		symbol: "UPEUR",
		address: "0x6C103D85C15107Dce19F5a75fC746227e610AaBd",
		decimals: 2
	},
	{
		symbol: "UPI",
		address: "0x70D2b7C19352bB76e4409858FF5746e500f2B67c",
		decimals: 18
	},
	{
		symbol: "UPP",
		address: "0xCe25b4271cc4d937A7D9BF75B2068A7892b9961D",
		decimals: 18
	},
	{
		symbol: "UPP",
		address: "0xC86D054809623432210c107af2e3F619DcFbf652",
		decimals: 18
	},
	{
		symbol: "UPT",
		address: "0x6CA88Cc8D9288f5cAD825053B6A1B179B05c76fC",
		decimals: 18
	},
	{
		symbol: "UPUSD",
		address: "0x86367c0e517622DAcdab379f2de389c3C9524345",
		decimals: 2
	},
	{
		symbol: "UPX",
		address: "0x5f778ec4B31a506c1Dfd8b06F131E9B451a61D39",
		decimals: 18
	},
	{
		symbol: "UPXAU",
		address: "0x0557Df767419296474C3f551Bb0A0ED4c2DD3380",
		decimals: 5
	},
	{
		symbol: "UQC",
		address: "0xD01DB73E047855Efb414e6202098C4Be4Cd2423B",
		decimals: 18
	},
	{
		symbol: "UQC",
		address: "0x8806926Ab68EB5a7b909DcAf6FdBe5d93271D6e2",
		decimals: 18
	},
	{
		symbol: "URAC",
		address: "0xff8Be4B22CeDC440591dcB1E641EB2a0dd9d25A5",
		decimals: 18
	},
	{
		symbol: "URB",
		address: "0x931684139f756C24eC0731E9F74FE50e5548dDeF",
		decimals: 18
	},
	{
		symbol: "USD",
		address: "0x44086035439E676c02D411880FcCb9837CE37c57",
		decimals: 18
	},
	{
		symbol: "USD",
		address: "0xd233D1f6FD11640081aBB8db125f722b5dc729dc",
		decimals: 9
	},
	{
		symbol: "uSD",
		address: "0x84841e552A021224de716b7Be89747bb2D62D642",
		decimals: 18
	},
	{
		symbol: "USD++",
		address: "0x9A48BD0EC040ea4f1D3147C025cd4076A2e71e3e",
		decimals: 18
	},
	{
		symbol: "USD-G",
		address: "0xfB0aaA0432112779d9AC483D9d5E3961ecE18eec",
		decimals: 18
	},
	{
		symbol: "USD1",
		address: "0xf6c0aA7eBFE9992200C67E5388E4F42da49E1783",
		decimals: 2
	},
	{
		symbol: "USDA",
		address: "0x3C7b464376DB7C9927930cf50EEfDEA2EFF3A66A",
		decimals: 8
	},
	{
		symbol: "USDAP",
		address: "0x9a1997C130f4b2997166975D9AFf92797d5134c2",
		decimals: 18
	},
	{
		symbol: "USDB",
		address: "0x309627af60F0926daa6041B8279484312f2bf060",
		decimals: 18
	},
	{
		symbol: "USDC",
		address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
		decimals: 6
	},
	{
		symbol: "USDEX",
		address: "0x4e3856c37B2fe7FF2Fe34510cdA82a1DFfD63CD0",
		decimals: 18
	},
	{
		symbol: "USDF",
		address: "0x3d61e677944204Cd1002202912a2B7a43A8E2823",
		decimals: 9
	},
	{
		symbol: "USDF",
		address: "0x05462671C05aDc39A6521fA60D5e9443e9E9d2B9",
		decimals: 9
	},
	{
		symbol: "USDFL",
		address: "0x2B4200A8D373d484993C37d63eE14AeE0096cd12",
		decimals: 18
	},
	{
		symbol: "USDG",
		address: "0xF906997808F73B09C1007B98Ab539b189282b192",
		decimals: 3
	},
	{
		symbol: "USDG",
		address: "0x4AB30B965A8Ef0F512DA064B5e574d9Ad73c0e79",
		decimals: 18
	},
	{
		symbol: "USDK",
		address: "0x1c48f86ae57291F7686349F12601910BD8D470bb",
		decimals: 18
	},
	{
		symbol: "USDL",
		address: "0x3e991dBEc296E00626E58C33b62E53beC9D54636",
		decimals: 18
	},
	{
		symbol: "USDM",
		address: "0xD760ADdFb24D9C01Fe4Bfea7475C5e3636684058",
		decimals: 2
	},
	{
		symbol: "USDN",
		address: "0x674C6Ad92Fd080e4004b2312b45f796a192D27a0",
		decimals: 18
	},
	{
		symbol: "USDP",
		address: "0x1456688345527bE1f37E9e627DA0837D6f08C925",
		decimals: 18
	},
	{
		symbol: "USDQ",
		address: "0x4954Db6391F4feB5468b6B943D4935353596aEC9",
		decimals: 18
	},
	{
		symbol: "USDS",
		address: "0xA4Bdb11dc0a2bEC88d24A3aa1E6Bb17201112eBe",
		decimals: 6
	},
	{
		symbol: "USDT",
		address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
		decimals: 6
	},
	{
		symbol: "USDTBEAR",
		address: "0x0cd6c8161f1638485A1A2F5Bf1A0127E45913C2F",
		decimals: 18
	},
	{
		symbol: "USDTBULL",
		address: "0x8Cce19943A01E78B7C277794fb081816F6151Bab",
		decimals: 18
	},
	{
		symbol: "USDTDOOM",
		address: "0xC2D3d1CbAb16f0e77ACd96b08EDD3C4dd4129763",
		decimals: 18
	},
	{
		symbol: "USDTHEDGE",
		address: "0xF3b8d4B2607A39114dAcB902baCd4dDDE7182560",
		decimals: 18
	},
	{
		symbol: "USDU",
		address: "0x41a03E41eF555392c9f0AD60f4F61E263078BF10",
		decimals: 18
	},
	{
		symbol: "USDX",
		address: "0xeb269732ab75A6fD61Ea60b06fE994cD32a83549",
		decimals: 18
	},
	{
		symbol: "USE",
		address: "0xd9485499499d66B175Cf5ED54c0a19f1a6Bcb61A",
		decimals: 18
	},
	{
		symbol: "UST",
		address: "0x2bdbF15d055899a767F5459A151bEd15Fb8fD2F6",
		decimals: 18
	},
	{
		symbol: "UST",
		address: "0x9B4A295282AB64F284787B43E706722c1AD78c45",
		decimals: 6
	},
	{
		symbol: "UST",
		address: "0xa47c8bf37f92aBed4A126BDA807A7b7498661acD",
		decimals: 18
	},
	{
		symbol: "UST",
		address: "0xCDA4377806cb09f226Aa4840A9df8B5C2B7744EC",
		decimals: 18
	},
	{
		symbol: "USUB",
		address: "0x20D236D3D74B90c00abA0Fe0D7ed7D57E8B769a3",
		decimals: 4
	},
	{
		symbol: "UTD",
		address: "0xC2bE193f581F129Ace32d2Fe949d100Dc09C2A05",
		decimals: 18
	},
	{
		symbol: "UTK",
		address: "0xdc9Ac3C20D1ed0B540dF9b1feDC10039Df13F99c",
		decimals: 18
	},
	{
		symbol: "UTK",
		address: "0x70a72833d6bF7F508C8224CE59ea1Ef3d0Ea3A38",
		decimals: 18
	},
	{
		symbol: "UTNP",
		address: "0x9e3319636e2126e3c0bc9e3134AEC5e1508A46c7",
		decimals: 18
	},
	{
		symbol: "UTO",
		address: "0x1F8f123bf24849443a56eD9fC42b9265b7F3A39a",
		decimals: 18
	},
	{
		symbol: "UTT",
		address: "0x16f812Be7FfF02cAF662B85d5d58a5da6572D4Df",
		decimals: 8
	},
	{
		symbol: "UTU",
		address: "0xa58a4f5c4Bb043d2CC1E170613B74e767c94189B",
		decimals: 18
	},
	{
		symbol: "UTY",
		address: "0xc6BF2A2A43cA360bb0ec6770F57f77CddE64Bb3F",
		decimals: 8
	},
	{
		symbol: "UUSDC",
		address: "0xBc5991cCd8cAcEba01edC44C2BB9832712c29cAB",
		decimals: 6
	},
	{
		symbol: "UUSDRBTC-DEC",
		address: "0xF06DdacF71e2992E2122A1a0168C6967aFdf63ce",
		decimals: 18
	},
	{
		symbol: "UUSDRBTC-OCT",
		address: "0x208D174775dc39fe18B1b374972F77ddEc6c0F73",
		decimals: 18
	},
	{
		symbol: "UUSDT",
		address: "0x178Bf8fD04b47D2De3eF3f6b3D112106375ad584",
		decimals: 6
	},
	{
		symbol: "UUSDWETH-DEC",
		address: "0xD16c79c8A39D44B2F3eB45D2019cd6A42B03E2A9",
		decimals: 18
	},
	{
		symbol: "UUU",
		address: "0x3543638eD4a9006E4840B105944271Bcea15605D",
		decimals: 18
	},
	{
		symbol: "UWBTC",
		address: "0x3aF5Ba94C29a8407785f5f6d90eF5d69a8EB2436",
		decimals: 8
	},
	{
		symbol: "UWTC",
		address: "0x282CB0a611280fF5887Ca122911A0cA6b841CB03",
		decimals: 6
	},
	{
		symbol: "UXET",
		address: "0x30DfD1E3ba2919D1337512a9f3CF83050fA7B84B",
		decimals: 0
	},
	{
		symbol: "UZT",
		address: "0xfa1004e9c0063E59DBf965B9490f3153B87Fb45f",
		decimals: 8
	},
	{
		symbol: "V.CX",
		address: "0x011a105076791F654282DaA392D48cC9b77757Af",
		decimals: 8
	},
	{
		symbol: "VAI",
		address: "0xD4078bdB652610Ad5383A747d130cbe905911102",
		decimals: 18
	},
	{
		symbol: "VAIP",
		address: "0x4457DC5a9e71B975A8E0F855bbE795F5Cbdcc10F",
		decimals: 18
	},
	{
		symbol: "VAL",
		address: "0x27b681934215ddA5c4DEbf5b59F23EAb9a8261Cc",
		decimals: 10
	},
	{
		symbol: "VAL",
		address: "0xe88f8313e61A97cEc1871EE37fBbe2a8bf3ed1E4",
		decimals: 18
	},
	{
		symbol: "VALOR",
		address: "0x297E4e5e59Ad72B1B0A2fd446929e76117be0E0a",
		decimals: 18
	},
	{
		symbol: "VALUE",
		address: "0x49E833337ECe7aFE375e44F4E3e8481029218E5c",
		decimals: 18
	},
	{
		symbol: "VANY",
		address: "0x4EDD66235349E353eb8CB8e40596599644bfE91c",
		decimals: 18
	},
	{
		symbol: "VBNT",
		address: "0x48Fb253446873234F2fEBbF9BdeAA72d9d387f94",
		decimals: 18
	},
	{
		symbol: "VBX",
		address: "0x6DCcF9C0aB71dAc26b7F7886E43a2B433806c590",
		decimals: 18
	},
	{
		symbol: "VCT",
		address: "0x9746953F5b1324a78132895cfD263F417B0faAE3",
		decimals: 18
	},
	{
		symbol: "VD",
		address: "0x9a9bB9b4b11BF8eccff84B58a6CCCCD4058A7f0D",
		decimals: 8
	},
	{
		symbol: "VDG",
		address: "0x57C75ECCc8557136D32619a191fBCDc88560d711",
		decimals: 0
	},
	{
		symbol: "VDOC",
		address: "0x82BD526bDB718C6d4DD2291Ed013A5186cAE2DCa",
		decimals: 18
	},
	{
		symbol: "VDX",
		address: "0x91e64F39C1FE14492e8FDf5A8B0f305BD218C8A1",
		decimals: 18
	},
	{
		symbol: "VEE",
		address: "0x340D2bdE5Eb28c1eed91B2f790723E3B160613B7",
		decimals: 18
	},
	{
		symbol: "VEEN",
		address: "0x5206186997FeC1951482C2304A246BeF34dcEE12",
		decimals: 18
	},
	{
		symbol: "VEGAN",
		address: "0xFADe17a07ba3B480aA1714c3724a52D4C57d410E",
		decimals: 8
	},
	{
		symbol: "VEN",
		address: "0xD850942eF8811f2A866692A623011bDE52a462C1",
		decimals: 18
	},
	{
		symbol: "VENUS",
		address: "0xEbeD4fF9fe34413db8fC8294556BBD1528a4DAca",
		decimals: 3
	},
	{
		symbol: "VERI",
		address: "0x8f3470A7388c05eE4e7AF3d01D8C722b0FF52374",
		decimals: 18
	},
	{
		symbol: "Veros",
		address: "0xeDBaF3c5100302dCddA53269322f3730b1F0416d",
		decimals: 5
	},
	{
		symbol: "VERSI",
		address: "0x1B879d3812F2Ade1214264655B473910e0caF1e6",
		decimals: 18
	},
	{
		symbol: "VEST",
		address: "0x37F04d2C3AE075Fad5483bB918491F656B12BDB6",
		decimals: 8
	},
	{
		symbol: "VETH",
		address: "0x75572098dc462F976127f59F8c97dFa291f81d8b",
		decimals: 18
	},
	{
		symbol: "VETH",
		address: "0x01217729940055011F17BeFE6270e6E59B7d0337",
		decimals: 18
	},
	{
		symbol: "VETH",
		address: "0x4Ba6dDd7b89ed838FEd25d208D4f644106E34279",
		decimals: 18
	},
	{
		symbol: "VEY",
		address: "0x70A63225BcaDacc4430919F0C1A4f0f5fcffBaac",
		decimals: 4
	},
	{
		symbol: "VGO",
		address: "0x8e87F1811De0025D2335174dbc7338a43dF6d7cc",
		decimals: 18
	},
	{
		symbol: "VGR",
		address: "0x16987C021C14ca1045cd0afEbB33c124a58Bf16C",
		decimals: 2
	},
	{
		symbol: "VGT",
		address: "0xCc394f10545AeEf24483d2347B32A34a44F20E6F",
		decimals: 18
	},
	{
		symbol: "VGT.CX",
		address: "0x08D8aA3F0011E529CC4bE4FdA8999C0B01fb6ec3",
		decimals: 8
	},
	{
		symbol: "VGTG",
		address: "0xe61eECfDBa2aD1669cee138f1919D08cEd070B83",
		decimals: 18
	},
	{
		symbol: "VGTN",
		address: "0xB52FC0F17Df38ad76F290467Aab57caBaEEada14",
		decimals: 18
	},
	{
		symbol: "VGW",
		address: "0x94236591125E935F5ac128Bb3d5062944C24958c",
		decimals: 5
	},
	{
		symbol: "VGX",
		address: "0x5Af2Be193a6ABCa9c8817001F45744777Db30756",
		decimals: 8
	},
	{
		symbol: "VI",
		address: "0x8b6c3b7C01D9dB4393f9aa734750F36df1543E9A",
		decimals: 18
	},
	{
		symbol: "VI",
		address: "0xd321Ca7Cd7A233483b8CD5a11a89E9337e70Df84",
		decimals: 18
	},
	{
		symbol: "VIB",
		address: "0x2C974B2d0BA1716E644c1FC59982a89DDD2fF724",
		decimals: 18
	},
	{
		symbol: "VIBE",
		address: "0xe8Ff5C9c75dEb346acAc493C463C8950Be03Dfba",
		decimals: 18
	},
	{
		symbol: "VIBEX",
		address: "0x882448f83d90B2bf477Af2eA79327fDEA1335D93",
		decimals: 18
	},
	{
		symbol: "VIBS",
		address: "0x53Db6b7fee89383435e424764A8478ACDA4DD2cD",
		decimals: 18
	},
	{
		symbol: "VID",
		address: "0x2C9023bBc572ff8dc1228c7858A280046Ea8C9E5",
		decimals: 18
	},
	{
		symbol: "VIDT",
		address: "0xfeF4185594457050cC9c23980d301908FE057Bb1",
		decimals: 18
	},
	{
		symbol: "VIDT",
		address: "0x445f51299Ef3307dBD75036dd896565F5B4BF7A5",
		decimals: 18
	},
	{
		symbol: "VIDY",
		address: "0xC77b230F31b517F1ef362e59c173C2BE6540B5E8",
		decimals: 18
	},
	{
		symbol: "VIDYA",
		address: "0x3D3D35bb9bEC23b06Ca00fe472b50E7A4c692C30",
		decimals: 18
	},
	{
		symbol: "VIEW",
		address: "0xF03f8D65BaFA598611C3495124093c56e8F638f0",
		decimals: 18
	},
	{
		symbol: "VII",
		address: "0x0D5BB28972e0b2d63732F558b4Af265AA5407467",
		decimals: 4
	},
	{
		symbol: "VIKKY",
		address: "0xd2946be786F35c3Cc402C29b323647aBda799071",
		decimals: 8
	},
	{
		symbol: "VIN",
		address: "0xF3e014fE81267870624132ef3A646B8E83853a96",
		decimals: 18
	},
	{
		symbol: "VINCI",
		address: "0x3DB99ab08006aeFcC9600972eCA8C202396B4300",
		decimals: 18
	},
	{
		symbol: "VINX",
		address: "0x010c282118aA76174CE5952572BA715CF60A0c9B",
		decimals: 18
	},
	{
		symbol: "VIO",
		address: "0x86Dd3002BF215082Ea43b0Bd2fD595EcE4341880",
		decimals: 18
	},
	{
		symbol: "VIP",
		address: "0xC0d9DA090194D62b2027E4009d9123DE399eA7Bf",
		decimals: 18
	},
	{
		symbol: "VIPG",
		address: "0x058ed4EDFD0Ca7147e34a30fa4Dd9907B0c9C4ba",
		decimals: 18
	},
	{
		symbol: "VIR",
		address: "0xb763628C6BdE4266Cd4232A0cd91c1523aAA077C",
		decimals: 18
	},
	{
		symbol: "VIRUS",
		address: "0x88f400F6a26465c9ac6AE5c1C8C14Cf12B515C96",
		decimals: 9
	},
	{
		symbol: "VISION",
		address: "0xF406F7A9046793267bc276908778B29563323996",
		decimals: 18
	},
	{
		symbol: "VISR",
		address: "0xF938424F7210f31dF2Aee3011291b658f872e91e",
		decimals: 18
	},
	{
		symbol: "VIT",
		address: "0x23b75Bc7AaF28e2d6628C3f424B3882F8f072a3c",
		decimals: 18
	},
	{
		symbol: "VITE",
		address: "0x1b793E49237758dBD8b752AFC9Eb4b329d5Da016",
		decimals: 18
	},
	{
		symbol: "VIU",
		address: "0x519475b31653E46D20cD09F9FdcF3B12BDAcB4f5",
		decimals: 18
	},
	{
		symbol: "VIX",
		address: "0x86C31E6da2190a1FFd39A36990a44174D0A8be15",
		decimals: 18
	},
	{
		symbol: "VIXG",
		address: "0x566fF8D8bD6dE69d2af4e3cf9153E2Cc77c7972f",
		decimals: 18
	},
	{
		symbol: "VKNF",
		address: "0xD501900646641eAf5755758E11EeAA43dF691924",
		decimals: 12
	},
	{
		symbol: "VLC",
		address: "0x8f7b0B40E27E357540F90f187d90CE06366aC5A5",
		decimals: 18
	},
	{
		symbol: "VLD",
		address: "0x922aC473A3cC241fD3a0049Ed14536452D58D73c",
		decimals: 18
	},
	{
		symbol: "VLO",
		address: "0x98ad9B32dD10f8D8486927D846D4Df8BAf39Abe2",
		decimals: 18
	},
	{
		symbol: "VLT",
		address: "0x6b785a0322126826d8226d77e173d75DAfb84d11",
		decimals: 18
	},
	{
		symbol: "VMC",
		address: "0xd811250b7fE83150cBB3d70a892fCE6189fB3e08",
		decimals: 18
	},
	{
		symbol: "VMC",
		address: "0xa3AFe717038d4E12133d84088754811220aF9329",
		decimals: 18
	},
	{
		symbol: "VN",
		address: "0x00eA6f91B00E080e816f1bB2faD71b0fe1528983",
		decimals: 18
	},
	{
		symbol: "VNC",
		address: "0x5a246a981D61d8Bc5c254c6eBA1340796fb97e5f",
		decimals: 18
	},
	{
		symbol: "VNC",
		address: "0xDf413690Fb785e56895551CC21086A15b6E90386",
		decimals: 8
	},
	{
		symbol: "VNDC",
		address: "0x1F3F677Ecc58F6A1F9e2CF410dF4776a8546b5DE",
		decimals: 0
	},
	{
		symbol: "VNET.CX",
		address: "0x58a28B87FD6112ee43262c80ad1098F1709350eB",
		decimals: 8
	},
	{
		symbol: "VNG",
		address: "0xA05A577732b6f52CEc3D35eB5CC8f91CBA8d0be4",
		decimals: 6
	},
	{
		symbol: "VNL",
		address: "0x1017B147b05942EAd495E2ad6d606EF3C94B8FD0",
		decimals: 12
	},
	{
		symbol: "VNLA",
		address: "0xB97FaF860045483E0C7F08c56acb31333084a988",
		decimals: 18
	},
	{
		symbol: "VNM",
		address: "0x1b991b6A41BF3bBc5CBD3B60000F26A8Ea9fF9E9",
		decimals: 18
	},
	{
		symbol: "VNS",
		address: "0x97941Ff1962026955852E9609E202D1058BC0f48",
		decimals: 8
	},
	{
		symbol: "VNST",
		address: "0x1e4e36b3F011d862fd70006804da8fceFe89d3d8",
		decimals: 18
	},
	{
		symbol: "VNT",
		address: "0x69d2779533a4D2c780639713558B2cC98c46A9b7",
		decimals: 8
	},
	{
		symbol: "VNT",
		address: "0xe912b8bA2513D7e29b7b2E5B14398dbf77503Fb4",
		decimals: 18
	},
	{
		symbol: "VNTW",
		address: "0xd0f05D3D4e4d1243Ac826d8c6171180c58eaa9BC",
		decimals: 18
	},
	{
		symbol: "VNTY",
		address: "0xC650f5514AE1A3a27930922145ce49E8A91b91AB",
		decimals: 18
	},
	{
		symbol: "VNX",
		address: "0x1563D521ba309e2Ad9f4aFfD6f4dE9759E8d4F21",
		decimals: 18
	},
	{
		symbol: "VNXLU",
		address: "0x00fC270C9cc13e878Ab5363D00354bebF6f05C15",
		decimals: 18
	},
	{
		symbol: "VOC",
		address: "0xc3bC9Eb71f75Ec439A6b6C8E8b746fCF5b62F703",
		decimals: 18
	},
	{
		symbol: "VOC",
		address: "0xB1cfB2421F6F12EBdA4F9b8d0336518c82e63b2c",
		decimals: 8
	},
	{
		symbol: "VOCO",
		address: "0xB5Ca46cF1da09248126682a7bd72401fd7A6b151",
		decimals: 18
	},
	{
		symbol: "VOID",
		address: "0xB8796542765747ed7F921FF12faff057b5D624D7",
		decimals: 18
	},
	{
		symbol: "VOISE",
		address: "0x83eEA00D838f92dEC4D1475697B9f4D3537b56E3",
		decimals: 8
	},
	{
		symbol: "VOL",
		address: "0x2E2E0a28f6585e895DD646a363BAE29B77B88a31",
		decimals: 18
	},
	{
		symbol: "VOLTZ",
		address: "0x60715E436c37444E29772c0D26a98Ae1E8E1A989",
		decimals: 18
	},
	{
		symbol: "VOO.CX",
		address: "0xe7c7036C5c532180ee9D240B87B713bce797d0aE",
		decimals: 8
	},
	{
		symbol: "VOW3.CX",
		address: "0xcB21b60dc7D0ec8341B55adFE2DF25DB8503a21B",
		decimals: 8
	},
	{
		symbol: "VPP",
		address: "0x4d2c05109a1309c6DE0d3b7F06F397C9C41b8FAE",
		decimals: 18
	},
	{
		symbol: "VRA",
		address: "0xdF1D6405df92d981a2fB3ce68F6A03baC6C0E41F",
		decimals: 18
	},
	{
		symbol: "VRA",
		address: "0xF411903cbC70a74d22900a5DE66A2dda66507255",
		decimals: 18
	},
	{
		symbol: "VRE",
		address: "0xF722B01910F93B84EDa9CA128b9F05821A41EAe1",
		decimals: 18
	},
	{
		symbol: "VRES",
		address: "0x317dC3f08F7947F363dFC7cb008048a5a5ea1840",
		decimals: 18
	},
	{
		symbol: "VREX",
		address: "0x938F66735C6b4f99EE51E657D51e86c2847788cB",
		decimals: 18
	},
	{
		symbol: "VRO",
		address: "0x10BC518c32fbAE5e38Ecb50A612160571bD81e44",
		decimals: 8
	},
	{
		symbol: "VRS",
		address: "0xAbC430136A4dE71c9998242de8c1b4B97D2b9045",
		decimals: 6
	},
	{
		symbol: "VRS",
		address: "0x92E78dAe1315067a8819EFD6dCA432de9DCdE2e9",
		decimals: 6
	},
	{
		symbol: "VRTN",
		address: "0x24e96809B4E720Ea911bc3De8341400E26d6E994",
		decimals: 18
	},
	{
		symbol: "VRX",
		address: "0x87DE305311D5788e8da38D19bb427645b09CB4e5",
		decimals: 18
	},
	{
		symbol: "VRX",
		address: "0x7252fDbB1097C7089D93b0fBDf3494aECf2c92A0",
		decimals: 8
	},
	{
		symbol: "VSF",
		address: "0xBA3a79D758f19eFe588247388754b8e4d6EddA81",
		decimals: 18
	},
	{
		symbol: "VSF",
		address: "0xAC9ce326e95f51B5005e9fE1DD8085a01F18450c",
		decimals: 18
	},
	{
		symbol: "VSL",
		address: "0x5c543e7AE0A1104f78406C340E9C64FD9fCE5170",
		decimals: 18
	},
	{
		symbol: "VSL",
		address: "0xDb144CD0F15eE40AaC5602364B470d703d7e16b6",
		decimals: 8
	},
	{
		symbol: "VSN",
		address: "0x456AE45c0CE901E2e7c99c0718031cEc0A7A59Ff",
		decimals: 18
	},
	{
		symbol: "VSP",
		address: "0x1b40183EFB4Dd766f11bDa7A7c3AD8982e998421",
		decimals: 18
	},
	{
		symbol: "VSPACEX",
		address: "0x44e28f2aCC84C36373BAdcd681749D38E01e2cC4",
		decimals: 18
	},
	{
		symbol: "VSPY",
		address: "0x3e1e15AFD5d50b090aDcC88160dD84a48EA1B80E",
		decimals: 18
	},
	{
		symbol: "VT",
		address: "0x38405Fa410c6eba342F9Eb5aC66B2aaF6498C8E9",
		decimals: 18
	},
	{
		symbol: "VTCH",
		address: "0x881E1344EEe25CE7de2F4857bA86b04Df8F77BEA",
		decimals: 18
	},
	{
		symbol: "VTD",
		address: "0xf0E3543744AFcEd8042131582f2A19b6AEb82794",
		decimals: 18
	},
	{
		symbol: "VTM",
		address: "0x5adfBDf9B6dB65C71b7F44376549da6798470e1a",
		decimals: 18
	},
	{
		symbol: "VTM",
		address: "0xe88Fff42196f5a47fFC1bA2854c14E8Eee4Bfd05",
		decimals: 18
	},
	{
		symbol: "VTX",
		address: "0xd957E08ac5421E2C28510586B57d095E5094836a",
		decimals: 18
	},
	{
		symbol: "VTY",
		address: "0x7Ba8A5D59B21390a70b2Ba968a183712E12a049c",
		decimals: 18
	},
	{
		symbol: "VUSD",
		address: "0x3479B0ACF875405D7853f44142FE06470a40f6CC",
		decimals: 18
	},
	{
		symbol: "VXC",
		address: "0x14F0a12A43c36C49D4b403dD6e1A9B8222BE456C",
		decimals: 18
	},
	{
		symbol: "VXT",
		address: "0x8Ba009Cad493C7646e31D69428AB9A54F47B3779",
		decimals: 18
	},
	{
		symbol: "VXV",
		address: "0x7D29A64504629172a429e64183D6673b9dAcbFCe",
		decimals: 18
	},
	{
		symbol: "VZT",
		address: "0x9720b467a710382A232a32F540bDCed7d662a10B",
		decimals: 18
	},
	{
		symbol: "W.CX",
		address: "0xe650caC294202D1B6221A84d5A26A8671071a076",
		decimals: 8
	},
	{
		symbol: "W0XETH",
		address: "0x716523231368d43BDfe1F06AfE1C62930731aB13",
		decimals: 8
	},
	{
		symbol: "WAB",
		address: "0x4BBbC57aF270138Ef2FF2C50DbfAD684e9E0e604",
		decimals: 18
	},
	{
		symbol: "WABI",
		address: "0x286BDA1413a2Df81731D4930ce2F862a35A609fE",
		decimals: 18
	},
	{
		symbol: "WAE",
		address: "0x2f7b88458f4E6D9AbB19396b5a08b8bA7f3d4b20",
		decimals: 6
	},
	{
		symbol: "WAIF",
		address: "0xB2279B6769CFBa691416F00609b16244c0cF4b20",
		decimals: 18
	},
	{
		symbol: "WAK",
		address: "0x9f6513ED2b0DE89218E97DB4A5115ba04Be449f1",
		decimals: 18
	},
	{
		symbol: "WALT",
		address: "0x15bCDFAd12498DE8a922E62442Ae4CC4bd33bd25",
		decimals: 18
	},
	{
		symbol: "WANATHA",
		address: "0x3383c5a8969Dc413bfdDc9656Eb80A1408E4bA20",
		decimals: 18
	},
	{
		symbol: "WAND",
		address: "0x27f610BF36ecA0939093343ac28b1534a721DBB4",
		decimals: 18
	},
	{
		symbol: "WATB",
		address: "0x554ce35a973a1317f71885696cbe4dDf8Af177aB",
		decimals: 18
	},
	{
		symbol: "WATT",
		address: "0x829A4cA1303383F1082B6B1fB937116e4b3b5605",
		decimals: 18
	},
	{
		symbol: "WATT.CX",
		address: "0x71b4875fC519eEA158855354916f2fDB73Ef7081",
		decimals: 8
	},
	{
		symbol: "WAVES",
		address: "0x1cF4592ebfFd730c7dc92c1bdFFDfc3B9EfCf29a",
		decimals: 18
	},
	{
		symbol: "WAX",
		address: "0x39Bb259F66E1C59d5ABEF88375979b4D20D98022",
		decimals: 8
	},
	{
		symbol: "WAY",
		address: "0x217f96737b39f9b9211767cb6aeF5DbAe2Fe9402",
		decimals: 8
	},
	{
		symbol: "WB.CX",
		address: "0xfdCCB100eCB130377C70C17C15C8a2Fa5B61b18e",
		decimals: 8
	},
	{
		symbol: "WBA",
		address: "0x74951B677de32D596EE851A233336926e6A2cd09",
		decimals: 7
	},
	{
		symbol: "WBA.CX",
		address: "0x30ecfa6F6D1cF830a76d8652DdA9cC5a4b1a99e2",
		decimals: 8
	},
	{
		symbol: "WBCD",
		address: "0x6A6d430573D3F070AEAb97b3A189d698eA130454",
		decimals: 7
	},
	{
		symbol: "WBIND",
		address: "0x15334DCb171e8b65D6650321581dcA83bE870115",
		decimals: 8
	},
	{
		symbol: "WBT",
		address: "0xe2Ee1ac57B2E5564522b2dE064A47b3f98B0e9c9",
		decimals: 18
	},
	{
		symbol: "WBTC",
		address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
		decimals: 8
	},
	{
		symbol: "WBX",
		address: "0xbB97e381F1d1e94ffa2A5844F6875e6146981009",
		decimals: 18
	},
	{
		symbol: "WCCX",
		address: "0x21686F8ce003a95c99aCd297E302FAACf742F7d4",
		decimals: 6
	},
	{
		symbol: "WCDC",
		address: "0xAb51e836BdCbc7Cc06D926C50D88328f1BB17148",
		decimals: 18
	},
	{
		symbol: "WCELO",
		address: "0xE452E6Ea2dDeB012e20dB73bf5d3863A3Ac8d77a",
		decimals: 18
	},
	{
		symbol: "WCK",
		address: "0x09fE5f0236F0Ea5D930197DCE254d77B04128075",
		decimals: 18
	},
	{
		symbol: "WCO",
		address: "0xd44bb6663936CAb1310584A277f7DAa6943d4904",
		decimals: 8
	},
	{
		symbol: "WCOINBASE-IOU",
		address: "0x4185cf99745B2a20727B37EE798193DD4a56cDfa",
		decimals: 18
	},
	{
		symbol: "WCRES",
		address: "0xa0afAA285Ce85974c3C881256cB7F225e3A1178a",
		decimals: 18
	},
	{
		symbol: "WCT",
		address: "0x6a0A97E47d15aAd1D132a1Ac79a480E3F2079063",
		decimals: 18
	},
	{
		symbol: "WCUSD",
		address: "0xad3E3Fc59dff318BecEaAb7D00EB4F68b1EcF195",
		decimals: 18
	},
	{
		symbol: "WDAY.CX",
		address: "0x99d1f0F82C028bF4e017dd397a05bd860fC6edFb",
		decimals: 8
	},
	{
		symbol: "WDGLD",
		address: "0x123151402076fc819B7564510989e475c9cD93CA",
		decimals: 8
	},
	{
		symbol: "WDNA",
		address: "0xFCf1D048fAd53ff6AFb801659Cf8b7fA2468d170",
		decimals: 18
	},
	{
		symbol: "WEB",
		address: "0x840fe75ABfaDc0F2d54037829571B2782e919ce4",
		decimals: 18
	},
	{
		symbol: "WEFI",
		address: "0x31735f0292D42801dce3b0f83B0d9A09bFf75b07",
		decimals: 18
	},
	{
		symbol: "WELL",
		address: "0x684e2DCb12Bb755237E07242529C82f78a84Ea61",
		decimals: 18
	},
	{
		symbol: "WES",
		address: "0x75B5F145002ba88cdFDb7897e0550781e3909A08",
		decimals: 18
	},
	{
		symbol: "WETH",
		address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
		decimals: 18
	},
	{
		symbol: "WEV",
		address: "0xFB9fc4CCC2538172fe76F7dC231a6969950E57c8",
		decimals: 18
	},
	{
		symbol: "WFC",
		address: "0x9Eb5f8478AB6cE37CE30eb073F8731ab75Df8dcc",
		decimals: 2
	},
	{
		symbol: "WFC.CX",
		address: "0xFf40858a83396F9ef76608D3eA3dB812C7830a48",
		decimals: 8
	},
	{
		symbol: "WFIL",
		address: "0x6e1A19F235bE7ED8E3369eF73b196C07257494DE",
		decimals: 18
	},
	{
		symbol: "WG0",
		address: "0xa10740ff9FF6852eac84cdcfF9184e1D6d27C057",
		decimals: 18
	},
	{
		symbol: "WGC",
		address: "0x314dC48E17e904AFd13927cB2A5CB7Dc46d88A1A",
		decimals: 18
	},
	{
		symbol: "WGP",
		address: "0xdD94842C15abfe4c9bAFE4222adE02896Beb064c",
		decimals: 18
	},
	{
		symbol: "WGTG",
		address: "0xECe935DE3CCb9E78ADD846BeA5638E0Eb52E71Fb",
		decimals: 18
	},
	{
		symbol: "WHALE",
		address: "0x9355372396e3F6daF13359B7b607a3374cc638e0",
		decimals: 4
	},
	{
		symbol: "WHEN",
		address: "0xF4FE95603881D0e07954fD7605E0e9a916e42C44",
		decimals: 18
	},
	{
		symbol: "WHITE",
		address: "0x5F0E628B693018f639D10e4A4F59BD4d8B2B6B44",
		decimals: 18
	},
	{
		symbol: "WHO",
		address: "0xe933c0Cd9784414d5F278C114904F5A84b396919",
		decimals: 18
	},
	{
		symbol: "WHOLE",
		address: "0xe6179bB571D2d69837bE731da88C76e377ec4738",
		decimals: 18
	},
	{
		symbol: "WIAC",
		address: "0x3f2B9E1ae008AA43E68b882F8d0440D25432c7e4",
		decimals: 18
	},
	{
		symbol: "WIB",
		address: "0x3F17Dd476faF0a4855572F0B6ed5115D9bBA22AD",
		decimals: 9
	},
	{
		symbol: "WIC",
		address: "0x62CD07D414Ec50B68C7EcAa863a23d344f2d062f",
		decimals: 0
	},
	{
		symbol: "WIC",
		address: "0x4f878C0852722b0976A955d68B376E4Cd4Ae99E5",
		decimals: 8
	},
	{
		symbol: "WIC",
		address: "0x5e4ABE6419650CA839Ce5BB7Db422b881a6064bB",
		decimals: 18
	},
	{
		symbol: "WIDE",
		address: "0x62E9Ce974213C04bbf97dEE1E15f1A0B9df7274c",
		decimals: 0
	},
	{
		symbol: "WIFI",
		address: "0xe202873079913858f9Ba8795BA957A4Ad561ca24",
		decimals: 18
	},
	{
		symbol: "WIKEN",
		address: "0xb7e77aEbBe0687d2EfF24Cc90c41A3b6eA74bdAB",
		decimals: 18
	},
	{
		symbol: "WIKI",
		address: "0x66BaD545596fb17a0B4ebDC003a85dEF10E8F6Ae",
		decimals: 18
	},
	{
		symbol: "WILD",
		address: "0x2a3bFF78B79A009976EeA096a51A948a3dC00e34",
		decimals: 18
	},
	{
		symbol: "WILD",
		address: "0xFbcFD010d007d10D49f516bB738F4aED12880225",
		decimals: 18
	},
	{
		symbol: "WILD",
		address: "0xD3C00772B24D997A812249ca637a921e81357701",
		decimals: 18
	},
	{
		symbol: "WILL",
		address: "0xE2F385f672D9A4Fe44B172b9bDEe023AC4732d77",
		decimals: 18
	},
	{
		symbol: "WIN",
		address: "0x4CAc2515716Ab2531402cA8F992e235189F29C5a",
		decimals: 18
	},
	{
		symbol: "WIN",
		address: "0x899338b84D25aC505a332aDCE7402d697D947494",
		decimals: 8
	},
	{
		symbol: "WING",
		address: "0xcB3df3108635932D912632ef7132d03EcFC39080",
		decimals: 18
	},
	{
		symbol: "WINGS",
		address: "0x667088b212ce3d06a1b553a7221E1fD19000d9aF",
		decimals: 18
	},
	{
		symbol: "WIS",
		address: "0xFA12040497bC7B6077Ea125Bad27dAA8b74E7eDC",
		decimals: 18
	},
	{
		symbol: "WIS",
		address: "0xDecade1c6Bf2cD9fb89aFad73e4a519C867adcF5",
		decimals: 18
	},
	{
		symbol: "WISE",
		address: "0x66a0f676479Cee1d7373f3DC2e2952778BfF5bd6",
		decimals: 18
	},
	{
		symbol: "WISH",
		address: "0x1b22C32cD936cB97C28C5690a0695a82Abf688e6",
		decimals: 18
	},
	{
		symbol: "WISH",
		address: "0x13de0b0C1507D424fAd4c6212830A0b2e59587c5",
		decimals: 18
	},
	{
		symbol: "WIT",
		address: "0xE13Ef257cF4D5Df928ca11d230427C037666d466",
		decimals: 6
	},
	{
		symbol: "WIT",
		address: "0x0BE4A987fd8Dcbd2FfF64BA4131d3A208307F667",
		decimals: 18
	},
	{
		symbol: "WITT",
		address: "0x0B165b00431927E1392712FB0d7E804041154f7A",
		decimals: 18
	},
	{
		symbol: "WIX",
		address: "0x7bA19B7F7d106A9a1e0985397B94F38EEe0b555e",
		decimals: 2
	},
	{
		symbol: "WIZ",
		address: "0x7a82C573B378CEEa29772aFB93891f0d0afA93b7",
		decimals: 18
	},
	{
		symbol: "WIZ",
		address: "0x2F9b6779c37DF5707249eEb3734BbfC94763fBE2",
		decimals: 18
	},
	{
		symbol: "WLEO",
		address: "0x73A9fb46e228628f8f9BB9004eCa4f4F529D3998",
		decimals: 3
	},
	{
		symbol: "WLEO",
		address: "0x352c0F76Cfd34Ab3A2724ef67F46cf4D3f61192B",
		decimals: 3
	},
	{
		symbol: "WLF",
		address: "0x02b1669bC9EE893edAFf3cADfD326A294d643f99",
		decimals: 0
	},
	{
		symbol: "WLK",
		address: "0xF6B55acBBC49f4524Aa48D19281A9A77c54DE10f",
		decimals: 18
	},
	{
		symbol: "WLL.CX",
		address: "0x5C6aDF78eA74F057A2E0783ED9d52dBA11B225a0",
		decimals: 8
	},
	{
		symbol: "WMB",
		address: "0x7a18919f0b05fA5e91F3eF43aFE8a72105C9d4B8",
		decimals: 6
	},
	{
		symbol: "wMBX",
		address: "0x71ba91dC68C6a206Db0A6A92B4b1De3f9271432d",
		decimals: 18
	},
	{
		symbol: "WMC",
		address: "0x8AedB297FED4b6884b808ee61fAf0837713670d0",
		decimals: 18
	},
	{
		symbol: "WMK",
		address: "0xBFbe5332f172d77811bC6c272844f3e54A7B23bB",
		decimals: 18
	},
	{
		symbol: "WMPRO",
		address: "0x687A790E4e94a8aBF9952AED635c80A5540D7E5C",
		decimals: 18
	},
	{
		symbol: "WMT.CX",
		address: "0x021ecdA86507D0bC0cA1d8e738d78Fe303B42cd8",
		decimals: 8
	},
	{
		symbol: "WND",
		address: "0x69DC5556A91DFab39f8D50f6FE552296F2268Dda",
		decimals: 5
	},
	{
		symbol: "WNK",
		address: "0xd73A66B8FB26Be8B0AcD7c52Bd325054Ac7d468b",
		decimals: 18
	},
	{
		symbol: "WNL",
		address: "0xcFbf70e33d5163E25B0dad73955c1BD9E8cd8BA2",
		decimals: 18
	},
	{
		symbol: "WNRZ",
		address: "0x4690D8F53E0d367f5b68f7F571e6eb4b72D39ACe",
		decimals: 18
	},
	{
		symbol: "WNS",
		address: "0x4A0eEdF6e95581CdA46A767E612e83731C0cD418",
		decimals: 18
	},
	{
		symbol: "WNS",
		address: "0xBc19F228A2637b7b03205ab5753DF50f545D667d",
		decimals: 8
	},
	{
		symbol: "WNXM",
		address: "0x0d438F3b5175Bebc262bF23753C1E53d03432bDE",
		decimals: 18
	},
	{
		symbol: "wNXM",
		address: "0x57A2bCBa1902696B08B93C87451Be71b024d2a4C",
		decimals: 18
	},
	{
		symbol: "WOA",
		address: "0xEC0A0915A7c3443862B678B0d4721C7aB133FDCf",
		decimals: 18
	},
	{
		symbol: "WOC",
		address: "0xF9D9702D031407F425a4412682fDc56b07d05262",
		decimals: 18
	},
	{
		symbol: "WOLF",
		address: "0xF9CCebCed681780C6D9D35607eDc61f77aA8Ef7A",
		decimals: 18
	},
	{
		symbol: "WOLK",
		address: "0x728781E75735dc0962Df3a51d7Ef47E798A7107E",
		decimals: 18
	},
	{
		symbol: "WOM",
		address: "0xBd356a39BFf2cAda8E9248532DD879147221Cf76",
		decimals: 18
	},
	{
		symbol: "WOM",
		address: "0xa982B2e19e90b2D9F7948e9C1b65D119F1CE88D6",
		decimals: 18
	},
	{
		symbol: "WON",
		address: "0x1EddEe3Fa21591a9637f88DaB9615C33Ee636b9D",
		decimals: 18
	},
	{
		symbol: "WON",
		address: "0xBe68b4645Ab798ED4dB88192a444898ff4FDa5Ae",
		decimals: 8
	},
	{
		symbol: "WOO",
		address: "0x4691937a7508860F876c9c0a2a617E7d9E945D4B",
		decimals: 18
	},
	{
		symbol: "WOOFY",
		address: "0xD0660cD418a64a1d44E9214ad8e459324D8157f1",
		decimals: 12
	},
	{
		symbol: "WOONK",
		address: "0x5A386Eb0FcBfEE3f0d759e263053c09162ff102D",
		decimals: 18
	},
	{
		symbol: "WORK",
		address: "0xA686514FAF7d54289266F483D1e4852C99E13EC7",
		decimals: 8
	},
	{
		symbol: "WORK.CX",
		address: "0xA7Db8A24D77c0a20f9ef84FF219749d9f3e51886",
		decimals: 8
	},
	{
		symbol: "WOW",
		address: "0x843131b15F2Ec5BeA850aC5164D2e4a3749ad87f",
		decimals: 18
	},
	{
		symbol: "WOZX",
		address: "0x34950Ff2b487d9E5282c5aB342d08A2f712eb79F",
		decimals: 18
	},
	{
		symbol: "WPR",
		address: "0x4CF488387F035FF08c371515562CBa712f9015d4",
		decimals: 18
	},
	{
		symbol: "WPT",
		address: "0xe04491D64Eaa464Ec8Fdf53c7a4C92BF5B2278Cd",
		decimals: 18
	},
	{
		symbol: "WPX",
		address: "0xb3BACe433288645114FE8e8aA91F87659CBF665b",
		decimals: 18
	},
	{
		symbol: "WR",
		address: "0x5A42991621D2FE5f9FeA02143E25E6F79b0e090F",
		decimals: 18
	},
	{
		symbol: "WRC",
		address: "0x72aDadb447784dd7AB1F472467750fC485e4cb2d",
		decimals: 6
	},
	{
		symbol: "WRK",
		address: "0x71e8d74fF1C923E369D0e70DFb09866629C4DD35",
		decimals: 18
	},
	{
		symbol: "WRLD",
		address: "0xB2Cf3a438aCf46275839a38dB7594065f64151d3",
		decimals: 18
	},
	{
		symbol: "WS30.CX",
		address: "0xCA673072ceEDC01486E51A5434C3849216445658",
		decimals: 8
	},
	{
		symbol: "WSS",
		address: "0x1d9a3CeF66B01D44003b9db0e00ec3fd44746988",
		decimals: 18
	},
	{
		symbol: "WST",
		address: "0x2cf2F4E07ecc54740293df6D6fb4150d725A919f",
		decimals: 18
	},
	{
		symbol: "WT",
		address: "0xAAE81c0194D6459F320b70CA0CEdf88e11a242CE",
		decimals: 18
	},
	{
		symbol: "WTB",
		address: "0x39405A9Cee35331dfE835Fd6B0e7A9fa6F2Cf48D",
		decimals: 18
	},
	{
		symbol: "WTC",
		address: "0xb7cB1C96dB6B22b0D3d9536E0108d062BD488F74",
		decimals: 18
	},
	{
		symbol: "WTF",
		address: "0x0501E7a02C285B9B520FdBF1BADC74Ae931aD75d",
		decimals: 18
	},
	{
		symbol: "WTK",
		address: "0xDF9d4674a430BDCC096A3a403128357AB36844BA",
		decimals: 2
	},
	{
		symbol: "WTL",
		address: "0x9a0587EaE7eF64b2B38A10442a44CfA43EDd7D2A",
		decimals: 18
	},
	{
		symbol: "WTN",
		address: "0x0ea984e789302B7B612147E4e4144e64f21425Eb",
		decimals: 8
	},
	{
		symbol: "WTP",
		address: "0x1680CfdAD75dA2bb56Ded4f36BB9423C86ffa7B7",
		decimals: 18
	},
	{
		symbol: "WTT",
		address: "0x84119cb33E8F590D75c2D6Ea4e6B0741a7494EDA",
		decimals: 0
	},
	{
		symbol: "WUC",
		address: "0x9e9801BACE260f58407C15E6e515C45918756E0F",
		decimals: 8
	},
	{
		symbol: "WUSD",
		address: "0x7C974104DF9dd7fb91205ab3D66d15AFf1049DE8",
		decimals: 18
	},
	{
		symbol: "WVG0",
		address: "0x25C7b64A93Eb1261E130eC21a3e9918CaA38b611",
		decimals: 18
	},
	{
		symbol: "WWT",
		address: "0x512630DC263FD4c71DBe81Fec68cF61156d79E80",
		decimals: 18
	},
	{
		symbol: "WWW",
		address: "0x6A0ae448Da83d73B291A199b798D13bB2e7d664d",
		decimals: 18
	},
	{
		symbol: "WWX",
		address: "0x8A91eEcd3F6b6B7833fD6961E7f654C3d016a068",
		decimals: 18
	},
	{
		symbol: "WXC",
		address: "0x86225481747c774b24c7c3Bac4C1B7382f787C7F",
		decimals: 18
	},
	{
		symbol: "WXLM",
		address: "0x219F4a1D142DFC564bD6e80c022cD29f3394A999",
		decimals: 18
	},
	{
		symbol: "WXTZ",
		address: "0xA3865E64121537b5b59B5e239Db4aCBe6F36aa74",
		decimals: 18
	},
	{
		symbol: "WYS",
		address: "0xd8950fDeaa10304B7A7Fd03a2FC66BC39f3c711a",
		decimals: 18
	},
	{
		symbol: "WYV",
		address: "0x056017c55aE7AE32d12AeF7C679dF83A85ca75Ff",
		decimals: 18
	},
	{
		symbol: "WYX",
		address: "0x05EDFfBda103d90d5040829A105f687443e0CA3e",
		decimals: 18
	},
	{
		symbol: "WZBLT",
		address: "0x7a58da7C0568557eC65cd53c0DBE5B134a022a14",
		decimals: 18
	},
	{
		symbol: "WZEC",
		address: "0x4A64515E5E1d1073e83f30cB97BEd20400b66E10",
		decimals: 18
	},
	{
		symbol: "X.CX",
		address: "0xf8fe64a5E8969A7947382e290c91E1fA715a7eC9",
		decimals: 8
	},
	{
		symbol: "X8X",
		address: "0x910Dfc18D6EA3D6a7124A6F8B5458F281060fa4c",
		decimals: 18
	},
	{
		symbol: "XAC",
		address: "0xDe4C5a791913838027a2185709E98c5C6027EA63",
		decimals: 8
	},
	{
		symbol: "XAGM.CX",
		address: "0x386358639244Ed385ECEe3F46DAe26E6ab616031",
		decimals: 8
	},
	{
		symbol: "XAMP",
		address: "0xf911a7ec46a2c6fa49193212fe4a2a9B95851c27",
		decimals: 9
	},
	{
		symbol: "XAT",
		address: "0x01c8857057326B8f64DCb5cba6d802DcD132946e",
		decimals: 18
	},
	{
		symbol: "XAUM.CX",
		address: "0xD6bFc2D9C5BF6EeC918a7Ebc4E80843876efD6Ae",
		decimals: 8
	},
	{
		symbol: "XAUR",
		address: "0x4DF812F6064def1e5e029f1ca858777CC98D2D81",
		decimals: 8
	},
	{
		symbol: "XAUT",
		address: "0x4922a015c4407F87432B179bb209e125432E4a2A",
		decimals: 6
	},
	{
		symbol: "XAUTBEAR",
		address: "0x31CbF205e26Ba63296FdBD254a6b1bE3ED28CE47",
		decimals: 18
	},
	{
		symbol: "XAUTBULL",
		address: "0xc9287623832668432099CEF2FfDEF3CeD14f4315",
		decimals: 18
	},
	{
		symbol: "XBASE",
		address: "0x4D13d624a87baa278733c068A174412AfA9ca6C8",
		decimals: 18
	},
	{
		symbol: "XBASE",
		address: "0x5bdC00B6676579b301B276198Db1ea9AffB94329",
		decimals: 18
	},
	{
		symbol: "XBL",
		address: "0x49AeC0752E68D0282Db544C677f6BA407BA17ED7",
		decimals: 18
	},
	{
		symbol: "XBP",
		address: "0x28dee01D53FED0Edf5f6E310BF8Ef9311513Ae40",
		decimals: 18
	},
	{
		symbol: "XBR.CX",
		address: "0x35d9fF00fBd73f2E73bA3e1E99C0a0c5F967518d",
		decimals: 8
	},
	{
		symbol: "XBTC",
		address: "0xECbF566944250ddE88322581024E611419715f7A",
		decimals: 9
	},
	{
		symbol: "XCC",
		address: "0x4d829f8C92a6691c56300D020c9e0dB984Cfe2BA",
		decimals: 18
	},
	{
		symbol: "XCD",
		address: "0xca00bC15f67Ebea4b20DfaAa847CAcE113cc5501",
		decimals: 18
	},
	{
		symbol: "XCEL",
		address: "0xF6276830c265A779A2225B9d2FCbAb790CBEb92B",
		decimals: 18
	},
	{
		symbol: "XCF",
		address: "0x010D14d36C3eA6570D240ae3ac9d660398f7C48e",
		decimals: 18
	},
	{
		symbol: "XCHF",
		address: "0xB4272071eCAdd69d933AdcD19cA99fe80664fc08",
		decimals: 18
	},
	{
		symbol: "XCL",
		address: "0x0843971B4ac6e842a518AA184e0271d88B5cB74F",
		decimals: 8
	},
	{
		symbol: "XCLR",
		address: "0x1E26b3D07E57F453caE30F7DDd2f945f5bF3EF33",
		decimals: 8
	},
	{
		symbol: "XCM",
		address: "0x36ac219f90f5A6A3C77f2a7B660E3cC701f68e25",
		decimals: 18
	},
	{
		symbol: "XCM",
		address: "0x44E2ca91ceA1147f1B503e669f06CD11FB0C5490",
		decimals: 18
	},
	{
		symbol: "XCMG",
		address: "0xe60B3fcbD8f400a38476aDEB01fCaC861cCd2E42",
		decimals: 18
	},
	{
		symbol: "XCO",
		address: "0x820618367fB401310502760462FbA400a32C1D69",
		decimals: 2
	},
	{
		symbol: "XCON",
		address: "0x015df42d36Bc851c7F15f80bd1D4e8dBF02aed0c",
		decimals: 18
	},
	{
		symbol: "XCON",
		address: "0x0F237D5eA7876E0e2906034D98FDB20D43666ad4",
		decimals: 18
	},
	{
		symbol: "XCPS",
		address: "0x666Ea3276460BD6358b49965dd336Ea244174d5e",
		decimals: 8
	},
	{
		symbol: "XCT",
		address: "0xD2bb16cf38Ca086Cab5128D5c25DE9477eBD596B",
		decimals: 18
	},
	{
		symbol: "XCUR",
		address: "0xE1c7E30C42C24582888C758984f6e382096786bd",
		decimals: 8
	},
	{
		symbol: "XD",
		address: "0x24DCc881E7Dd730546834452F21872D5cb4b5293",
		decimals: 18
	},
	{
		symbol: "XDB",
		address: "0xB9EefC4b0d472A44be93970254Df4f4016569d27",
		decimals: 7
	},
	{
		symbol: "XDC",
		address: "0x0eFF3E0D75872C44B1c70Fee12FDFB88430059f4",
		decimals: 18
	},
	{
		symbol: "XDCE",
		address: "0x41AB1b6fcbB2fA9DCEd81aCbdeC13Ea6315F2Bf2",
		decimals: 18
	},
	{
		symbol: "XDFT",
		address: "0x51D01615F8D5af8F64C3d754f156E03D988f7771",
		decimals: 18
	},
	{
		symbol: "XEC.CX",
		address: "0xf3949F351758fBb7608c934f133C3ED1f2E94D17",
		decimals: 8
	},
	{
		symbol: "XED",
		address: "0xee573a945B01B788B9287CE062A0CFC15bE9fd86",
		decimals: 18
	},
	{
		symbol: "XES",
		address: "0xA017ac5faC5941f95010b12570B812C974469c2C",
		decimals: 18
	},
	{
		symbol: "XET",
		address: "0x054C64741dBafDC19784505494029823D89c3b13",
		decimals: 8
	},
	{
		symbol: "XETH",
		address: "0xaA19673aA1b483a5c4f73B446B4f851629a7e7D6",
		decimals: 18
	},
	{
		symbol: "XEV",
		address: "0xF4BBd1f932BDA87C24Fe13A50912A13b06ed2601",
		decimals: 18
	},
	{
		symbol: "XFI",
		address: "0x5BEfBB272290dD5b8521D4a938f6c4757742c430",
		decimals: 18
	},
	{
		symbol: "XFII",
		address: "0x1fa21b20222076D7465fb901E5f459289c95F66a",
		decimals: 18
	},
	{
		symbol: "XFOC",
		address: "0xF5A562597D5fB5Cc19482379755e1a5275A6607B",
		decimals: 7
	},
	{
		symbol: "XFRC",
		address: "0x5f5f8a9C9775499b783171ac1979b4327ab60447",
		decimals: 18
	},
	{
		symbol: "XFS",
		address: "0x16aF5bfb4Ae7E475b9aDC3Bf5Cb2f1E6a50d7940",
		decimals: 8
	},
	{
		symbol: "XFT",
		address: "0xABe580E7ee158dA464b51ee1a83Ac0289622e6be",
		decimals: 18
	},
	{
		symbol: "XFUND",
		address: "0x892A6f9dF0147e5f079b0993F486F9acA3c87881",
		decimals: 9
	},
	{
		symbol: "XFYI",
		address: "0x6bE7e93e45740C314C89A3bE52473A0dDF2450fe",
		decimals: 18
	},
	{
		symbol: "XGC",
		address: "0x89d3c0249307Ae570A316030764D12f53BB191FD",
		decimals: 14
	},
	{
		symbol: "XGG",
		address: "0xf6b6AA0Ef0f5Edc2C1c5d925477F97eAF66303e7",
		decimals: 8
	},
	{
		symbol: "XGG",
		address: "0x06B179e292f080871825beD5D722162fD96B4c95",
		decimals: 18
	},
	{
		symbol: "XGM",
		address: "0x533ef0984b2FAA227AcC620C67cce12aA39CD8CD",
		decimals: 8
	},
	{
		symbol: "XGP",
		address: "0xd8dc1070B5510583728eE2AFD6934877ea2dE474",
		decimals: 18
	},
	{
		symbol: "XGP",
		address: "0xD9dc38F1C0f551f949A81CF7269a017e48B1D5A4",
		decimals: 18
	},
	{
		symbol: "XGR",
		address: "0xCF28Bf20B662F746A4B487FA81de5A40ac0af49C",
		decimals: 8
	},
	{
		symbol: "XGT",
		address: "0x30f4A3e0aB7a76733D8b60b89DD93c3D0b4c9E2f",
		decimals: 18
	},
	{
		symbol: "XGT",
		address: "0xF87271fF78a3de23bB7A6Fbd3c7080199f6Ae82B",
		decimals: 18
	},
	{
		symbol: "XHDX",
		address: "0x6FCb6408499a7c0f242E32D77EB51fFa1dD28a7E",
		decimals: 12
	},
	{
		symbol: "XID",
		address: "0xB110eC7B1dcb8FAB8dEDbf28f53Bc63eA5BEdd84",
		decimals: 8
	},
	{
		symbol: "XIN",
		address: "0xA974c709cFb4566686553a20790685A47acEAA33",
		decimals: 18
	},
	{
		symbol: "XIO",
		address: "0x0f7F961648aE6Db43C75663aC7E5414Eb79b5704",
		decimals: 18
	},
	{
		symbol: "XIOT",
		address: "0x31024A4C3e9aEeb256B825790F5cb7ac645e7cD5",
		decimals: 3
	},
	{
		symbol: "XIV",
		address: "0x44f262622248027f8E2a8Fb1090c4Cf85072392C",
		decimals: 18
	},
	{
		symbol: "XJP",
		address: "0x604026696fDB3C6720AE3049C46d59AC604dEA0A",
		decimals: 18
	},
	{
		symbol: "XKN",
		address: "0x8f9933218213C9bEf8048Cc4618ebb1df96BDe8e",
		decimals: 18
	},
	{
		symbol: "XLAB",
		address: "0x8c4E7f814d40f8929F9112C5D09016F923d34472",
		decimals: 18
	},
	{
		symbol: "XLC",
		address: "0x8FAF0be1465B9bE70eE73d9123B2A1fDD9F2AAe4",
		decimals: 8
	},
	{
		symbol: "XLDZ",
		address: "0x2F5cDC81a729B750F3B733Cb95660E788441c71E",
		decimals: 18
	},
	{
		symbol: "XLMBULL",
		address: "0x3a43a04D80F9881d88080bf9fA8bB720AFb6c966",
		decimals: 18
	},
	{
		symbol: "XLNX.CX",
		address: "0x931a9350333C79D9DA373EE857CA97273c5a595F",
		decimals: 8
	},
	{
		symbol: "XLV.CX",
		address: "0x511eF917Ec95C8B2642F88444539e7821764614e",
		decimals: 8
	},
	{
		symbol: "XLX",
		address: "0x1d086b868d78040635CB8600bA733f12DB48cB42",
		decimals: 18
	},
	{
		symbol: "XMCT",
		address: "0x44449Fa4d607F807d1eD4a69ad942971728391C8",
		decimals: 18
	},
	{
		symbol: "XMD",
		address: "0xEa2524Bb0773DE6A5f641aA97294401F116572e7",
		decimals: 8
	},
	{
		symbol: "XMON",
		address: "0x3aaDA3e213aBf8529606924d8D1c55CbDc70Bf74",
		decimals: 18
	},
	{
		symbol: "XMOO",
		address: "0x221535CBCed4C264e53373d81b73c29d010832A5",
		decimals: 18
	},
	{
		symbol: "XMRG",
		address: "0x0f598112679B78e17A4A9feBC83703710d33489c",
		decimals: 8
	},
	{
		symbol: "XMX",
		address: "0x0f8c45B896784A1E408526B9300519ef8660209c",
		decimals: 8
	},
	{
		symbol: "XN35",
		address: "0x13dF4D4521A09f45554475BB086C099e3732cB99",
		decimals: 18
	},
	{
		symbol: "XNG.CX",
		address: "0x34031510Cb586733050F25C9888f685f4B084c66",
		decimals: 8
	},
	{
		symbol: "XNK",
		address: "0xBC86727E770de68B1060C91f6BB6945c73e10388",
		decimals: 18
	},
	{
		symbol: "XNN",
		address: "0xab95E915c123fdEd5BDfB6325e35ef5515F1EA69",
		decimals: 18
	},
	{
		symbol: "XNS",
		address: "0x79c71D3436F39Ce382D0f58F1B011D88100B9D91",
		decimals: 18
	},
	{
		symbol: "XNT",
		address: "0x572E6f318056ba0C5d47A422653113843D250691",
		decimals: 0
	},
	{
		symbol: "XOR",
		address: "0x40FD72257597aA14C7231A7B1aaa29Fce868F677",
		decimals: 18
	},
	{
		symbol: "XOV",
		address: "0x153eD9CC1b792979d2Bde0BBF45CC2A7e436a5F9",
		decimals: 18
	},
	{
		symbol: "XOXO",
		address: "0x222139425Bcb172721dd4c22c29DD841D4358f69",
		decimals: 18
	},
	{
		symbol: "XPA",
		address: "0x90528aeb3a2B736B780fD1B6C478bB7E1d643170",
		decimals: 18
	},
	{
		symbol: "XPAT",
		address: "0xBB1fA4FdEB3459733bF67EbC6f893003fA976a82",
		decimals: 18
	},
	{
		symbol: "XPAY",
		address: "0x5378AE149E06A6a6367E1e65332e4680DdE53E07",
		decimals: 8
	},
	{
		symbol: "XPAY",
		address: "0xbC7Ed0c8cf986ae62337fc8DF3B02C6EC87310Ed",
		decimals: 18
	},
	{
		symbol: "XPAYPRO",
		address: "0x565aC8639E53a4bFf4aFb34AC63A49D7bf01500E",
		decimals: 18
	},
	{
		symbol: "XPD.CX",
		address: "0x85Cf3e1E9854a6AaCe2Dd595E82AA9EEa4459A2a",
		decimals: 8
	},
	{
		symbol: "XPERL",
		address: "0x1fBbcFcFe97f27dea1b5E97FbFEb488B8B63e478",
		decimals: 18
	},
	{
		symbol: "XPN",
		address: "0x3b9e094D56103611f0ACEfDAb43182347BA60dF4",
		decimals: 18
	},
	{
		symbol: "XPO",
		address: "0x1a3564852D8EdE7c8249805E71718bd7AA93Dd6d",
		decimals: 2
	},
	{
		symbol: "XPO.CX",
		address: "0x8f606c58AeFF00169B06F88CA2f28862971668DD",
		decimals: 8
	},
	{
		symbol: "XPR",
		address: "0xD7EFB00d12C2c13131FD319336Fdf952525dA2af",
		decimals: 4
	},
	{
		symbol: "XPS",
		address: "0x17C8d8b7659141273a1c2223030C89b96713a44a",
		decimals: 18
	},
	{
		symbol: "XPST",
		address: "0x35C896b1700E344a81B95b6bC1D4d95b4503699c",
		decimals: 18
	},
	{
		symbol: "XPT",
		address: "0x08Aa0ed0040736dd28d4c8B16Ab453b368248d19",
		decimals: 18
	},
	{
		symbol: "XPT.CX",
		address: "0xc6afBdEF9467517410a49CBE513270dE3c96ebd7",
		decimals: 8
	},
	{
		symbol: "XPV",
		address: "0xD9b6F884771857A2AFB9171EA53303Ff041C2af9",
		decimals: 18
	},
	{
		symbol: "XQC",
		address: "0x70da48f4B7e83c386ef983D4CEF4e58c2c09D8Ac",
		decimals: 8
	},
	{
		symbol: "XRA",
		address: "0x7025baB2EC90410de37F488d1298204cd4D6b29d",
		decimals: 18
	},
	{
		symbol: "XRB",
		address: "0x0E3aBf45855fbaa1AfcC3b33CF08b3915bdCda96",
		decimals: 8
	},
	{
		symbol: "XRL",
		address: "0xB24754bE79281553dc1adC160ddF5Cd9b74361a4",
		decimals: 9
	},
	{
		symbol: "XRM",
		address: "0xE1329eBf8b719881549909d689987F746A8931D1",
		decimals: 18
	},
	{
		symbol: "XRM",
		address: "0xa249F0E9A464b9685F66992f41e1012388e39e81",
		decimals: 18
	},
	{
		symbol: "XRPBEAR",
		address: "0x94FC5934cF5970E944a67de806eEB5a4b493c6E6",
		decimals: 18
	},
	{
		symbol: "XRPBULL",
		address: "0x27c1bA4F85b8dC1c150157816623A6Ce80b7F187",
		decimals: 18
	},
	{
		symbol: "XRPC",
		address: "0xd4cA5c2AFf1eeFb0BeA9e9Eab16f88DB2990C183",
		decimals: 8
	},
	{
		symbol: "XRPDOOM",
		address: "0x526664Ca8ff5E5b924270bd6bD89Bf5D58fC79CD",
		decimals: 18
	},
	{
		symbol: "XRPGSW",
		address: "0x45526C392009cf7020AC10A10C1979E340A8A9DC",
		decimals: 8
	},
	{
		symbol: "XRPHEDGE",
		address: "0x55b54D8fB1640d1321D5164590e7B020BA43def2",
		decimals: 18
	},
	{
		symbol: "XRPMOON",
		address: "0x574A37B7244dABB08CE1618193F818f1C85180E6",
		decimals: 18
	},
	{
		symbol: "XRRT",
		address: "0x293989bB8B44c73B59F3E1F379bc861a33Bd6aEa",
		decimals: 18
	},
	{
		symbol: "XRT",
		address: "0x37D404A072056EDA0Cd10Cb714D35552329F8500",
		decimals: 18
	},
	{
		symbol: "XRT",
		address: "0x7dE91B204C1C737bcEe6F000AAA6569Cf7061cb7",
		decimals: 9
	},
	{
		symbol: "XRX",
		address: "0x5f12f33d0A36Fd369e4FfFAE3D82Eff9160013ce",
		decimals: 8
	},
	{
		symbol: "XSC",
		address: "0x4df2c7ec048f69BBA12098BF71a15aFeeAAf0c4B",
		decimals: 18
	},
	{
		symbol: "XSC",
		address: "0x0F513fFb4926ff82D7F60A05069047AcA295C413",
		decimals: 18
	},
	{
		symbol: "XSCC",
		address: "0x8Bf7326c3FFF3a3ba9fCc618641Bb8f3CD2Eb7F9",
		decimals: 18
	},
	{
		symbol: "XSGD",
		address: "0x70e8dE73cE538DA2bEEd35d14187F6959a8ecA96",
		decimals: 6
	},
	{
		symbol: "XSHOP",
		address: "0xA8dba64afC4A8704C98B0D1c9BFB7d307b30963a",
		decimals: 18
	},
	{
		symbol: "XSNXA",
		address: "0x2367012aB9c3da91290F71590D5ce217721eEfE4",
		decimals: 18
	},
	{
		symbol: "XSP",
		address: "0x9b06D48E0529ecF05905fF52DD426ebEc0EA3011",
		decimals: 18
	},
	{
		symbol: "XSP",
		address: "0xBA90351aC53860ecA66FB57aE43640fbb066418C",
		decimals: 18
	},
	{
		symbol: "XSR",
		address: "0x6bC1F3A1ae56231DbB64d3E82E070857EAe86045",
		decimals: 18
	},
	{
		symbol: "XSUSHI",
		address: "0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272",
		decimals: 18
	},
	{
		symbol: "XT",
		address: "0xeF65887a05415bF6316204b5ffB350d4d1a19BBA",
		decimals: 18
	},
	{
		symbol: "XT",
		address: "0x4BE10dA47A07716af28Ad199FbE020501BddD7aF",
		decimals: 18
	},
	{
		symbol: "XTEM",
		address: "0x2d2501dCc897ad69a12090Ca6b59Ab33018eAb97",
		decimals: 18
	},
	{
		symbol: "XTI-CX",
		address: "0xBc3a40ECda4Fa380f0D5F3201AD85E9126Fd2817",
		decimals: 8
	},
	{
		symbol: "XTK",
		address: "0xF96459323030137703483B46fD59A71D712BF0aa",
		decimals: 6
	},
	{
		symbol: "XTK",
		address: "0xBFf0E42EEC4223fBd12260F47f3348D29876db42",
		decimals: 6
	},
	{
		symbol: "XTM",
		address: "0x4FcfCe2CddD8114f5DDFF23f8869337197b27e1F",
		decimals: 18
	},
	{
		symbol: "XTP",
		address: "0x6368e1E18c4C419DDFC608A0BEd1ccb87b9250fc",
		decimals: 18
	},
	{
		symbol: "XTRD",
		address: "0x9c794f933b4DD8B49031A79b0f924D68BEF43992",
		decimals: 18
	},
	{
		symbol: "XTRL",
		address: "0x347a39127AE0730817B0caf177c4684e16a038fc",
		decimals: 8
	},
	{
		symbol: "XTRLPAY",
		address: "0x76a435B51bAeae457324406da02ee7E3473288B5",
		decimals: 8
	},
	{
		symbol: "XTS",
		address: "0x36232B1328E49A043434E71C02C0dc2be278E975",
		decimals: 18
	},
	{
		symbol: "XTT",
		address: "0xcb9a14d68cD0690b3696f42DCFDF609a67824736",
		decimals: 18
	},
	{
		symbol: "XTX",
		address: "0x1822126fEedb4C7d61EecdBE3682FE61e91383d6",
		decimals: 18
	},
	{
		symbol: "XTZBEAR",
		address: "0xbc41d05287498DEc58129560De6bd1b8d4E3aC1d",
		decimals: 18
	},
	{
		symbol: "XTZBULL",
		address: "0x8AF17a6396c8f315f6b6DBC6AA686C85f9b3E554",
		decimals: 18
	},
	{
		symbol: "XUC",
		address: "0xc324a2f6b05880503444451B8b27e6f9e63287Cb",
		decimals: 18
	},
	{
		symbol: "XUSB",
		address: "0x59a2EB1675F31406e3bc00262a6dC0D98E0376B1",
		decimals: 2
	},
	{
		symbol: "XWO",
		address: "0x5CC00ccA0692b9b34AF816e5439CDb47D3B63691",
		decimals: 18
	},
	{
		symbol: "XYO",
		address: "0x55296f69f40Ea6d20E478533C15A6B08B654E758",
		decimals: 18
	},
	{
		symbol: "XYS",
		address: "0xfa91f4177476633f100C59D336C0f2FfAd414CBA",
		decimals: 18
	},
	{
		symbol: "YAB",
		address: "0x52A7a5B50A567cA6c0a4F85E74b98142eba43f49",
		decimals: 0
	},
	{
		symbol: "YAH",
		address: "0xC2856A8310AF421A2A65De16428C2DEC6CeacB36",
		decimals: 18
	},
	{
		symbol: "YAM",
		address: "0x0AaCfbeC6a24756c20D41914F2caba817C0d8521",
		decimals: 18
	},
	{
		symbol: "YAMA",
		address: "0xc9c69a216568dE4d5B991b05cc9C382494FfA62e",
		decimals: 18
	},
	{
		symbol: "YAMV1",
		address: "0x0e2298E3B3390e3b945a5456fBf59eCc3f55DA16",
		decimals: 18
	},
	{
		symbol: "YAMV2",
		address: "0xAba8cAc6866B83Ae4eec97DD07ED254282f6aD8A",
		decimals: 24
	},
	{
		symbol: "YAP",
		address: "0x32b666599411F4721De6724c968ED9B3D1cABD79",
		decimals: 8
	},
	{
		symbol: "YAP",
		address: "0x245392ee7Ce736eC6A0908B67dC5d0a218230005",
		decimals: 18
	},
	{
		symbol: "YAT",
		address: "0x5CeB8c7f189e694B326310694Ac6DF98e5CED66E",
		decimals: 18
	},
	{
		symbol: "YATX",
		address: "0x39043aae9c48a628F5184Af7a5bB925137757B15",
		decimals: 8
	},
	{
		symbol: "YAX",
		address: "0xb1dC9124c395c1e97773ab855d66E879f053A289",
		decimals: 18
	},
	{
		symbol: "YB",
		address: "0xC4131C1893576e078a0b637b653f3E6A18e137Ac",
		decimals: 4
	},
	{
		symbol: "YBAN",
		address: "0x1706c33B9a5B12aeB85B862215378dEe9480EB95",
		decimals: 18
	},
	{
		symbol: "YBREE",
		address: "0x11F4C6B3E8F50c50935c7889EDc56C96F41B5399",
		decimals: 18
	},
	{
		symbol: "YBUSD",
		address: "0x04bC0Ab673d88aE9dbC9DA2380cB6B79C4BCa9aE",
		decimals: 18
	},
	{
		symbol: "YCC",
		address: "0x37E1160184F7dD29f00b78C050Bf13224780b0B0",
		decimals: 8
	},
	{
		symbol: "YCN",
		address: "0xD9D2C606EC5F7a01dF496768cfC9E5003B23d193",
		decimals: 8
	},
	{
		symbol: "YCURVE",
		address: "0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8",
		decimals: 18
	},
	{
		symbol: "YD-BTC-MAR21",
		address: "0x002f0B1A71C5730CF2F4dA1970A889207BdB6D0D",
		decimals: 18
	},
	{
		symbol: "YD-ETH-MAR21",
		address: "0x90f802C7E8fb5D40B0De583e34C065A3bd2020D8",
		decimals: 18
	},
	{
		symbol: "yDAI",
		address: "0xC2cB1040220768554cf699b0d863A3cd4324ce32",
		decimals: 18
	},
	{
		symbol: "yDAI",
		address: "0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01",
		decimals: 18
	},
	{
		symbol: "YEA",
		address: "0x40b92fCE37CEfA03baf7603e7913C1d34dD1a4EC",
		decimals: 8
	},
	{
		symbol: "YEC",
		address: "0xfC2f7ab5821e727A2EFD120DAE507c47b92fE055",
		decimals: 8
	},
	{
		symbol: "YEE",
		address: "0x922105fAd8153F516bCfB829f56DC097a0E1D705",
		decimals: 18
	},
	{
		symbol: "YEED",
		address: "0xcA2796F9F61dc7b238Aab043971e49c6164DF375",
		decimals: 18
	},
	{
		symbol: "YEFAM",
		address: "0x2B78C26973545F9fD7EbDb01922966628382e6Ba",
		decimals: 18
	},
	{
		symbol: "YEFI",
		address: "0xCF282Ba0bC91d2AA6E775bCfd90dA6B7912F1b1a",
		decimals: 18
	},
	{
		symbol: "YEFIM",
		address: "0x4B34c0CBeEF271F895d339c5F76322d71A60782B",
		decimals: 18
	},
	{
		symbol: "YEL",
		address: "0x8633e144f2d9b9b8bDD12ddB58e4bEF1E163a0cE",
		decimals: 18
	},
	{
		symbol: "YELD",
		address: "0x468ab3b1f63A1C14b361bC367c3cC92277588Da1",
		decimals: 18
	},
	{
		symbol: "YELP.CX",
		address: "0xfF3AB23B0e08bB2d575Aa00909cEb478607E2F32",
		decimals: 8
	},
	{
		symbol: "YESTRUMP",
		address: "0x5963FD7cA9b17b85768476019F81CB43d9d1818E",
		decimals: 18
	},
	{
		symbol: "YETH",
		address: "0xD387f0E62E3f123A54Ae486056A5D859AFFeD0c8",
		decimals: 18
	},
	{
		symbol: "YETI",
		address: "0xb4bebD34f6DaaFd808f73De0d10235a92Fbb6c3D",
		decimals: 18
	},
	{
		symbol: "YF-DAI",
		address: "0xf4CD3d3Fda8d7Fd6C5a500203e38640A70Bf9577",
		decimals: 18
	},
	{
		symbol: "YF4",
		address: "0x38ACeFAd338b870373fB8c810fE705569E1C7225",
		decimals: 18
	},
	{
		symbol: "YFA",
		address: "0xEf327568556310d344c49FB7cE6CBFE7b2bB83e6",
		decimals: 18
	},
	{
		symbol: "YFARM",
		address: "0xF5D0FefAaB749d8B14C27F0De60cC6e9e7f848d1",
		decimals: 18
	},
	{
		symbol: "YFARMER",
		address: "0x7B0F66fA5cf5cc28280c1e7051af881E06579362",
		decimals: 18
	},
	{
		symbol: "YFB2",
		address: "0x59e7B5DB9Be0BDD26Fa048d39E01FEe456AB674E",
		decimals: 18
	},
	{
		symbol: "YFBETA",
		address: "0x89eE58Af4871b474c30001982c3D7439C933c838",
		decimals: 18
	},
	{
		symbol: "YFBT",
		address: "0xf0A0F3A6FA6bED75345171a5EA18AbcadF6453BA",
		decimals: 18
	},
	{
		symbol: "YFC",
		address: "0xE8ed08a581777f112654e28DE507e11613DA0379",
		decimals: 18
	},
	{
		symbol: "YFD",
		address: "0x4F4F0Ef7978737ce928BFF395529161b44e27ad9",
		decimals: 18
	},
	{
		symbol: "YFDOT",
		address: "0x2e6539edc3b76f1E21B71d214527FAbA875F70F3",
		decimals: 18
	},
	{
		symbol: "YFDT",
		address: "0x1378eC93Ab2B07ba5A0eAEf19Cf354A33f64B9FD",
		decimals: 18
	},
	{
		symbol: "YFE",
		address: "0x33811D4EdBCaED10A685254eB5D3C4e4398520D2",
		decimals: 18
	},
	{
		symbol: "YFED",
		address: "0x2DBd330bC9B7f3A822a9173aB52172BdDDcAcE2A",
		decimals: 8
	},
	{
		symbol: "YFET",
		address: "0xc151ca64D66eA44EE4BE9D47c3ce7E031b2fccb7",
		decimals: 18
	},
	{
		symbol: "YFF",
		address: "0x8Be6a6158f6B8a19fe60569C757d16e546C2296D",
		decimals: 18
	},
	{
		symbol: "YFF",
		address: "0x05074b439211739bd952e1092127f17AFD0dE204",
		decimals: 18
	},
	{
		symbol: "YFFC",
		address: "0xea004e8FA3701B8E58E41b78D50996e0f7176CbD",
		decimals: 18
	},
	{
		symbol: "YFFI",
		address: "0xCee1d3c3A02267e37E6B373060F79d5d7b9e1669",
		decimals: 18
	},
	{
		symbol: "YFFII",
		address: "0x6c4B85CaB20c13aF72766025F0e17E0fe558A553",
		decimals: 18
	},
	{
		symbol: "YFFS",
		address: "0x90D702f071d2af33032943137AD0aB4280705817",
		decimals: 18
	},
	{
		symbol: "YFI",
		address: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
		decimals: 18
	},
	{
		symbol: "YFI CASH",
		address: "0x03e8f56ad0D759BCFfF960863388Bfdb2efD1579",
		decimals: 18
	},
	{
		symbol: "YFI2",
		address: "0xF6c151Ea50A4F1a50983eB98998A18be0a549aD5",
		decimals: 18
	},
	{
		symbol: "YFI3",
		address: "0x09843B9137fc5935B7F3832152F9074Db5D2d1Ee",
		decimals: 18
	},
	{
		symbol: "YFIA",
		address: "0xd778e4F5450eDE47289fEf874a37B79Db77c4CF1",
		decimals: 18
	},
	{
		symbol: "YFIAG",
		address: "0xd40adfF097E3cde2b96D81A4727F3E47093F3405",
		decimals: 18
	},
	{
		symbol: "YFIB",
		address: "0x03829f5675F3b51D0F8C2A74417a757625aCF22f",
		decimals: 18
	},
	{
		symbol: "YFIB",
		address: "0x47632dA9227E322EDa59F9e7691eAcC6430Ac87C",
		decimals: 18
	},
	{
		symbol: "YFIC",
		address: "0x6C8aAd3100e3fa45AAC799c0c302400900b60302",
		decimals: 18
	},
	{
		symbol: "YFICG",
		address: "0x9080e92296a176883aAB1d7d1B7e50BC055B0cAa",
		decimals: 18
	},
	{
		symbol: "YFID",
		address: "0x61266424B904d65cEb2945a1413Ac322185187D5",
		decimals: 18
	},
	{
		symbol: "YFIEC",
		address: "0x2E6E152d29053B6337E434bc9bE17504170f8a5B",
		decimals: 8
	},
	{
		symbol: "YFII",
		address: "0xa1d0E215a23d7030842FC67cE582a6aFa3CCaB83",
		decimals: 18
	},
	{
		symbol: "YFIIG",
		address: "0xeF8bA8cBa86f81B3108f60186FCe9c81B5096D5c",
		decimals: 18
	},
	{
		symbol: "YFIII",
		address: "0x649eBF73043Ffcc70A59855ecd8a568FD996415a",
		decimals: 18
	},
	{
		symbol: "YFIII",
		address: "0x4be40bc9681D0A7C24A99b4c92F85B9053Fc2A45",
		decimals: 18
	},
	{
		symbol: "YFIKING",
		address: "0x5F7fA1a0Ae94b5DD6bb6bD1708b5f3AF01b57908",
		decimals: 18
	},
	{
		symbol: "YFILD",
		address: "0xCec2387e04F9815BF12670dBf6cf03bba26DF25F",
		decimals: 18
	},
	{
		symbol: "YFIM",
		address: "0x2e2f3246b6c65CCc4239c9Ee556EC143a7E5DE2c",
		decimals: 18
	},
	{
		symbol: "YFIP",
		address: "0x8901Bed88A57DB0eAE2BB87D72ced14C6c91164B",
		decimals: 18
	},
	{
		symbol: "YFIP",
		address: "0xB9782532FA7062A6F73df1CE71d75c0E16046ebC",
		decimals: 8
	},
	{
		symbol: "YFIS",
		address: "0x86965A86539e2446F9e72634CEfCA7983CC21a81",
		decimals: 18
	},
	{
		symbol: "YFIV",
		address: "0x519083fc539F23131C3b7046992584592772D12A",
		decimals: 18
	},
	{
		symbol: "YFIVE",
		address: "0xd3E8695d2Bef061EAb38B5EF526c0f714108119C",
		decimals: 18
	},
	{
		symbol: "YFIX",
		address: "0xa4f779074850D320B5553C9Db5Fc6A8ab15Bd34a",
		decimals: 18
	},
	{
		symbol: "YFKA",
		address: "0x4086692D53262b2Be0b13909D804F0491FF6Ec3e",
		decimals: 18
	},
	{
		symbol: "YFL",
		address: "0x28cb7e841ee97947a86B06fA4090C8451f64c0be",
		decimals: 18
	},
	{
		symbol: "YFMB",
		address: "0x7aFaC1D878C66A47263DCe57976C371Ae2e74882",
		decimals: 18
	},
	{
		symbol: "YFMS",
		address: "0xfef3bEf71A5EB97E097039038776fD967ae5B106",
		decimals: 18
	},
	{
		symbol: "YFN",
		address: "0x3709AE438E0557976296051F431256F386De370C",
		decimals: 18
	},
	{
		symbol: "YFN",
		address: "0x3DD66732113Af9981A861Cf489431533aebA33B8",
		decimals: 18
	},
	{
		symbol: "YFN",
		address: "0x13cea0680b3FFecB835758046CC1dfE9080dBAd5",
		decimals: 18
	},
	{
		symbol: "YFO",
		address: "0xAc0C8dA4A4748d8d821A0973d00b157aA78C473D",
		decimals: 18
	},
	{
		symbol: "YFOS",
		address: "0xCd254568EBF88f088E40f456db9E17731243cb25",
		decimals: 18
	},
	{
		symbol: "YFOX",
		address: "0x706CB9E741CBFee00Ad5b3f5ACc8bd44D1644a74",
		decimals: 6
	},
	{
		symbol: "YFP",
		address: "0x96d62cdCD1cc49cb6eE99c867CB8812bea86B9FA",
		decimals: 18
	},
	{
		symbol: "YFPI",
		address: "0x05D27CdD23E22ca63e7f9c7C6D1B79ede9C4fCF5",
		decimals: 18
	},
	{
		symbol: "YFPRO",
		address: "0x0fdC5313333533cC0c00C22792BfF7383d3055F2",
		decimals: 18
	},
	{
		symbol: "YFR",
		address: "0xD6940A1FfD9F3B025D1F1055AbCfd9F7CdA81eF9",
		decimals: 18
	},
	{
		symbol: "YFRB",
		address: "0x5D1b1019d0Afa5E6cc047B9e78081D44cc579FC4",
		decimals: 18
	},
	{
		symbol: "YFRM",
		address: "0xbE685C5E06866cfB94A4242E3DF8f2fa3E7c2b73",
		decimals: 18
	},
	{
		symbol: "YFSI",
		address: "0x1DF6f1Bb7454E5E4BA3BcA882d3148FBf9b5697A",
		decimals: 18
	},
	{
		symbol: "YFST",
		address: "0x32A18B15985A290604dd9b2ebC39A1035b1a6B9C",
		decimals: 18
	},
	{
		symbol: "YFT",
		address: "0x9cD39dA8f25ec50cF2Ee260e464aC23EA23F6bb0",
		decimals: 18
	},
	{
		symbol: "YFT",
		address: "0x26B3038a7Fc10b36c426846a9086Ef87328dA702",
		decimals: 18
	},
	{
		symbol: "YFU",
		address: "0x59165E15026dD0712380cffe71E4F5d1Ef5f6AF0",
		decimals: 18
	},
	{
		symbol: "YFUEL",
		address: "0xbD301BE09eB78Df47019aa833D29eDc5D815D838",
		decimals: 18
	},
	{
		symbol: "YFUEL",
		address: "0x09df6A5ca936Be45f5Ae45C7e58C9b4602011fcd",
		decimals: 18
	},
	{
		symbol: "YFV",
		address: "0x45f24BaEef268BB6d63AEe5129015d69702BCDfa",
		decimals: 18
	},
	{
		symbol: "YG",
		address: "0xD811e485cB4ab1FAd56233dE4464Fb5d1C9f3E99",
		decimals: 18
	},
	{
		symbol: "YGY",
		address: "0x11b0a8C0FA626627601eD518c3538a39d92D609E",
		decimals: 6
	},
	{
		symbol: "YHFI",
		address: "0x5a143F78Bb66294ff37c47b5164584475B932bAb",
		decimals: 18
	},
	{
		symbol: "YKZ",
		address: "0xcd453276f4db9c38855056a036C4A99A8cac7b8d",
		decimals: 18
	},
	{
		symbol: "YKZ",
		address: "0x87047986E8e4961c11d2EdcD94285E3A1331d97B",
		decimals: 18
	},
	{
		symbol: "YLAB",
		address: "0x454CB9D0845bB4a28462F98C21a4fAFD16ceb25f",
		decimals: 18
	},
	{
		symbol: "YLAND",
		address: "0xd0658324074D6249a51876438916f7C423075451",
		decimals: 18
	},
	{
		symbol: "YLC",
		address: "0x21d5678A62DFe63a47062469Ebb2fAc2817D8832",
		decimals: 8
	},
	{
		symbol: "YLD",
		address: "0xDcB01cc464238396E213a6fDd933E36796eAfF9f",
		decimals: 18
	},
	{
		symbol: "YLD",
		address: "0x7F927f984177323c4ac49E6b1d398E40cd1A78F6",
		decimals: 2
	},
	{
		symbol: "YLD",
		address: "0xF94b5C5651c888d928439aB6514B93944eEE6F48",
		decimals: 18
	},
	{
		symbol: "YLFi",
		address: "0x186Af393bF9cEef31CE7EaE2b468C46231163cC7",
		decimals: 18
	},
	{
		symbol: "YMAX",
		address: "0x062f90480551379791FBe2ED74C1fe69821b30d3",
		decimals: 18
	},
	{
		symbol: "YMEN",
		address: "0xd0c59798F986d333554688cD667033d469C2398e",
		decimals: 18
	},
	{
		symbol: "YMF20",
		address: "0x16bE21C08EB27953273608629e4397556c561D26",
		decimals: 8
	},
	{
		symbol: "YMPL",
		address: "0xb7ba8461664dE526A3ae44189727DFC768625902",
		decimals: 9
	},
	{
		symbol: "YNDX.CX",
		address: "0x3366FDFC98a98e0D7Af48C0641D5126f7d4324D5",
		decimals: 8
	},
	{
		symbol: "YNK",
		address: "0x87C00817ABe35eD4C093e59043fae488238d2F74",
		decimals: 18
	},
	{
		symbol: "YNN",
		address: "0x1BC7C1dE0AC6eF4fDeC35c053030D90cf54c7e9A",
		decimals: 18
	},
	{
		symbol: "YO",
		address: "0xeBF4CA5319F406602EEFf68da16261f1216011B5",
		decimals: 18
	},
	{
		symbol: "YOK",
		address: "0x05Fcc72CFb4150AbAE415c885f7a433Ff523296F",
		decimals: 18
	},
	{
		symbol: "YOLO.CX",
		address: "0xE7E6c560C7E07B9FdBe8F88ed8C0988b1Fec055d",
		decimals: 8
	},
	{
		symbol: "YOO",
		address: "0xC7596f3FC97AE603e1D7FfA61e6eFb7B6a59Bed2",
		decimals: 18
	},
	{
		symbol: "YOP",
		address: "0xAE1eaAE3F627AAca434127644371b67B18444051",
		decimals: 8
	},
	{
		symbol: "YOT",
		address: "0x9f978Aa425148CdD9223eb175446a877B86727Ff",
		decimals: 6
	},
	{
		symbol: "YOU",
		address: "0x34364BEe11607b1963d66BCA665FDE93fCA666a8",
		decimals: 18
	},
	{
		symbol: "YOUC",
		address: "0x3D371413dd5489F3A04C07c0C2CE369c20986ceb",
		decimals: 10
	},
	{
		symbol: "YOYOW",
		address: "0xcbeAEc699431857FDB4d37aDDBBdc20E132D4903",
		decimals: 18
	},
	{
		symbol: "YPIE",
		address: "0x17525E4f4Af59fbc29551bC4eCe6AB60Ed49CE31",
		decimals: 18
	},
	{
		symbol: "YRISE",
		address: "0x6051C1354Ccc51b4d561e43b02735DEaE64768B8",
		decimals: 18
	},
	{
		symbol: "YSDT",
		address: "0x41d3CeE04b3e6A00D506309bA6008f7adD1BC94e",
		decimals: 8
	},
	{
		symbol: "YSEC",
		address: "0xeea9aE787f3A620072d13b2cdC8cabFFb9c0aB96",
		decimals: 18
	},
	{
		symbol: "YSKF",
		address: "0x9C664F20C0a00a4949DFfcA76748c02754C875aa",
		decimals: 18
	},
	{
		symbol: "YSR",
		address: "0xD9A947789974bAD9BE77E45C2b327174A9c59D71",
		decimals: 18
	},
	{
		symbol: "ySUSD",
		address: "0xF61718057901F84C4eEC4339EF8f0D86D2B45600",
		decimals: 18
	},
	{
		symbol: "YT",
		address: "0x5c89736e9454200141B80C37Eb28eaCECA2cE8Cb",
		decimals: 8
	},
	{
		symbol: "YTA",
		address: "0x5EdC1a266E8b2c5E8086d373725dF0690af7e3Ea",
		decimals: 18
	},
	{
		symbol: "YTHO",
		address: "0x48cf0E2eCA22EAe0AD33feE16A5CB6E62207A8Ab",
		decimals: 18
	},
	{
		symbol: "YTRO",
		address: "0x534546C490A4Ed2a9D0c3555447Bb9b4b01bcb9E",
		decimals: 17
	},
	{
		symbol: "YTRUMP",
		address: "0x3af375d9f77Ddd4F16F86A5D51a9386b7B4493Fa",
		decimals: 15
	},
	{
		symbol: "YTSLA",
		address: "0x5322A3556F979cE2180B30e689a9436fDDCB1021",
		decimals: 18
	},
	{
		symbol: "YTUSD",
		address: "0x73a052500105205d34Daf004eAb301916DA8190f",
		decimals: 18
	},
	{
		symbol: "YUKI",
		address: "0x5AB793E36070F0fac928EA15826b0c1Bc5365119",
		decimals: 8
	},
	{
		symbol: "YUNO",
		address: "0x4B4F5286e0f93E965292B922B9Cd1677512F1222",
		decimals: 18
	},
	{
		symbol: "YUP",
		address: "0x0F33bb20a282A7649C7B3AFf644F084a9348e933",
		decimals: 18
	},
	{
		symbol: "YUP",
		address: "0xD9A12Cde03a86E800496469858De8581D3A5353d",
		decimals: 18
	},
	{
		symbol: "YUSD-OCT20",
		address: "0xB2FdD60AD80ca7bA89B9BAb3b5336c2601C020b4",
		decimals: 18
	},
	{
		symbol: "YUSD-SEP20",
		address: "0x81ab848898b5ffD3354dbbEfb333D5D183eEDcB5",
		decimals: 18
	},
	{
		symbol: "YUSDC",
		address: "0x26EA744E5B887E5205727f55dFBE8685e3b21951",
		decimals: 6
	},
	{
		symbol: "yUSDC",
		address: "0xd6aD7a6750A7593E092a9B218d66C0A814a3436e",
		decimals: 6
	},
	{
		symbol: "yUSDT",
		address: "0xE6354ed5bC4b393a5Aad09f21c46E101e692d447",
		decimals: 6
	},
	{
		symbol: "yUSDT",
		address: "0x83f798e925BcD4017Eb265844FDDAbb448f1707D",
		decimals: 6
	},
	{
		symbol: "YUSDT",
		address: "0x0622769D566B3c4C1C58cA4FAbee8E60bb3163e5",
		decimals: 6
	},
	{
		symbol: "YVAULT-LP-YCURVE",
		address: "0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c",
		decimals: 18
	},
	{
		symbol: "YVE-CRVDAO",
		address: "0xc5bDdf9843308380375a611c18B50Fb9341f502A",
		decimals: 18
	},
	{
		symbol: "YVS",
		address: "0xEC681F28f4561c2a9534799AA38E0d36A83Cf478",
		decimals: 18
	},
	{
		symbol: "yWETH",
		address: "0xe1237aA7f535b0CC33Fd973D66cBf830354D16c7",
		decimals: 18
	},
	{
		symbol: "yWTBC",
		address: "0x04Aa51bbcB46541455cCF1B8bef2ebc5d3787EC9",
		decimals: 8
	},
	{
		symbol: "YY.CX",
		address: "0x8d5E98738C6A83B5E7AEA2B4937c2A9d92F779Ba",
		decimals: 8
	},
	{
		symbol: "ZAC",
		address: "0x98a90499b62Ae48E151a66B0F647570b5a473B1c",
		decimals: 18
	},
	{
		symbol: "ZAI",
		address: "0x9d1233cc46795E94029fDA81aAaDc1455D510f15",
		decimals: 18
	},
	{
		symbol: "ZALX",
		address: "0xF1dED9284c73F9C3A664503E9a5E15188A991935",
		decimals: 6
	},
	{
		symbol: "ZAM",
		address: "0x9D3571f685e0feC61925B248977a09F8dA047f48",
		decimals: 18
	},
	{
		symbol: "ZAP",
		address: "0x6781a0F84c7E9e846DCb84A9a5bd49333067b104",
		decimals: 18
	},
	{
		symbol: "ZARX",
		address: "0x29eC3ff4e1dCad5A207DbD5d14e48073AbBA0Bd3",
		decimals: 18
	},
	{
		symbol: "ZAY",
		address: "0xFFb5531e6A916d228958016441146299ab5eddD0",
		decimals: 18
	},
	{
		symbol: "ZB",
		address: "0xBd0793332e9fB844A52a205A233EF27a5b34B927",
		decimals: 18
	},
	{
		symbol: "ZB",
		address: "0x182A603541a4483c308475147D621bbB4E2587c6",
		decimals: 18
	},
	{
		symbol: "ZBK",
		address: "0x29257908879c5792F1bb25449A7209205434DC3f",
		decimals: 18
	},
	{
		symbol: "ZBLT",
		address: "0x98a1208A9287e378d329225836b823481D890409",
		decimals: 18
	},
	{
		symbol: "ZBUX",
		address: "0x7090a6e22c838469c9E67851D6489ba9c933a43F",
		decimals: 0
	},
	{
		symbol: "ZCC",
		address: "0x26548041e3a78fDc60f3ccE21977E1F5e46561B7",
		decimals: 18
	},
	{
		symbol: "ZCC",
		address: "0x6737fE98389Ffb356F64ebB726aA1a92390D94Fb",
		decimals: 18
	},
	{
		symbol: "ZCG",
		address: "0x180e5087935A94Fd5bbAb00fD2249C5bE0473381",
		decimals: 8
	},
	{
		symbol: "ZCN",
		address: "0xb9EF770B6A5e12E45983C5D80545258aA38F3B78",
		decimals: 10
	},
	{
		symbol: "ZCNOX",
		address: "0x8b83116E05F722554e1089b9850e731ee20dD692",
		decimals: 18
	},
	{
		symbol: "ZCO",
		address: "0x2008e3057BD734e10AD13c9EAe45Ff132aBc1722",
		decimals: 8
	},
	{
		symbol: "ZCOR",
		address: "0x83FF572a1757b9E4508CB08f13a79Ed162c756c4",
		decimals: 0
	},
	{
		symbol: "ZCRT",
		address: "0xC7e43A1c8E118aA2965F5EAbe0e718D83DB7A63C",
		decimals: 18
	},
	{
		symbol: "ZDC",
		address: "0x7A2810d3d859Ed03ede523eB801a3B43B5e8979C",
		decimals: 18
	},
	{
		symbol: "ZDC",
		address: "0x1cF402135d7Bd27Dc9d21C03Ae2D8375BC43E9eC",
		decimals: 18
	},
	{
		symbol: "ZDEX",
		address: "0x5150956E082C748Ca837a5dFa0a7C10CA4697f9c",
		decimals: 18
	},
	{
		symbol: "ZDR",
		address: "0xBDFA65533074B0b23EbC18c7190BE79Fa74b30c2",
		decimals: 18
	},
	{
		symbol: "ZEB",
		address: "0xee98A5c3FD8c9063C5D8777758d3901a88df957b",
		decimals: 18
	},
	{
		symbol: "ZEE",
		address: "0x2eDf094dB69d6Dcd487f1B3dB9febE2eeC0dd4c5",
		decimals: 18
	},
	{
		symbol: "ZEFU",
		address: "0xB1e9157c2Fdcc5a856C8DA8b2d89b6C32b3c1229",
		decimals: 18
	},
	{
		symbol: "ZELDA ELASTIC CASH",
		address: "0xCF55a7F92d5e0C6683dEbBC1fc20c0a6e056Df13",
		decimals: 18
	},
	{
		symbol: "ZELDA SPRING NUTS CASH",
		address: "0x654EEBaC62240E6C56bAB5f6AdF7cfA74A894510",
		decimals: 18
	},
	{
		symbol: "ZELDA SUMMER NUTS CASH",
		address: "0xb3F83A3be59e71876659c5CEcc6a3c4D690D258e",
		decimals: 18
	},
	{
		symbol: "ZEON",
		address: "0xE5B826Ca2Ca02F09c1725e9bd98d9a8874C30532",
		decimals: 18
	},
	{
		symbol: "ZERA",
		address: "0x8188e51Bc678F0070531f0e782718Df0027452De",
		decimals: 8
	},
	{
		symbol: "ZERO",
		address: "0xF0939011a9bb95c3B791f0cb546377Ed2693a574",
		decimals: 18
	},
	{
		symbol: "ZEST",
		address: "0x757703bD5B2c4BBCfde0BE2C0b0E7C2f31FCf4E9",
		decimals: 18
	},
	{
		symbol: "ZETH",
		address: "0xd55E5eA9e6c055708eC01C881cb12907d33b21d4",
		decimals: 18
	},
	{
		symbol: "ZEUS",
		address: "0xe7E4279b80D319EDe2889855135A22021baf0907",
		decimals: 18
	},
	{
		symbol: "ZFL",
		address: "0x19fFfd124CD9089E21026d10dA97f8cD6B442Bff",
		decimals: 8
	},
	{
		symbol: "ZGK",
		address: "0x5e0Ed77611560AFF6c0fD9E15b7a66C430dc1E72",
		decimals: 8
	},
	{
		symbol: "ZGOLD",
		address: "0x6dE0d485a8218c0208DB949456dF05dd22450002",
		decimals: 8
	},
	{
		symbol: "ZHEGIC",
		address: "0x837010619aeb2AE24141605aFC8f66577f6fb2e7",
		decimals: 18
	},
	{
		symbol: "ZHSH",
		address: "0x743BbA828949FcE4557BAD9a52Db488cE6FdFf8D",
		decimals: 4
	},
	{
		symbol: "ZIK",
		address: "0xE7750c38c9a10D877650C0D99d1717bB28A5C42e",
		decimals: 18
	},
	{
		symbol: "ZIL",
		address: "0x05f4a42e251f2d52b8ed15E9FEdAacFcEF1FAD27",
		decimals: 12
	},
	{
		symbol: "ZINC",
		address: "0x4AaC461C86aBfA71e9d00d9a2cde8d74E4E1aeEa",
		decimals: 18
	},
	{
		symbol: "ZIP",
		address: "0xA9d2927d3a04309E008B6af6E2e282AE2952e7fD",
		decimals: 18
	},
	{
		symbol: "ZIPT",
		address: "0xEDD7c94FD7B4971b916d15067Bc454b9E1bAD980",
		decimals: 18
	},
	{
		symbol: "ZIX",
		address: "0xf3C092cA8CD6D3d4ca004Dc1d0f1fe8CcAB53599",
		decimals: 18
	},
	{
		symbol: "ZJLT",
		address: "0xBC34985b4d345AeA933d5cAc19F3a86bd1Fb398F",
		decimals: 18
	},
	{
		symbol: "ZKS",
		address: "0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6",
		decimals: 18
	},
	{
		symbol: "ZLA",
		address: "0xfd8971d5E8E1740cE2d0A84095fCA4De729d0c16",
		decimals: 18
	},
	{
		symbol: "ZLOT",
		address: "0xA8e7AD77C60eE6f30BaC54E2E7c0617Bd7B5A03E",
		decimals: 18
	},
	{
		symbol: "ZLP",
		address: "0x94D8Db14831c2c08943798542C450df2844913e5",
		decimals: 18
	},
	{
		symbol: "ZLW",
		address: "0x5319e86F0e41a06E49eb37046b8c11D78bcAd68C",
		decimals: 18
	},
	{
		symbol: "ZMAN",
		address: "0xE25FAAb5821ce70BA4179A70c1d481BA45b9D0c9",
		decimals: 8
	},
	{
		symbol: "ZMN",
		address: "0x554FFc77F4251a9fB3c0E3590a6a205f8d4e067D",
		decimals: 18
	},
	{
		symbol: "ZMT",
		address: "0xaa602dE53347579f86b996D2Add74bb6F79462b2",
		decimals: 18
	},
	{
		symbol: "ZNA",
		address: "0x59c3BA7a0A4C26955037710654F60D368303B3E1",
		decimals: 18
	},
	{
		symbol: "ZNT",
		address: "0xE95990825AAB1a7f0Af4cc648f76a3Bcc99F25B2",
		decimals: 18
	},
	{
		symbol: "ZNT",
		address: "0x138fd9A2B4b283676109d5E76cf3b83de7d15F25",
		decimals: 8
	},
	{
		symbol: "ZOM",
		address: "0x1a231e75538a931c395785EF5D1A5581ec622B0e",
		decimals: 18
	},
	{
		symbol: "ZOM",
		address: "0x42382F39e7C9F1ADD5fa5f0c6e24aa62f50be3b3",
		decimals: 18
	},
	{
		symbol: "ZOMB",
		address: "0x78175901e9B04090Bf3B3D3cB7f91CA986fb1aF6",
		decimals: 18
	},
	{
		symbol: "ZOMBIE",
		address: "0xd55BD2C12B30075b325Bc35aEf0B46363B3818f8",
		decimals: 18
	},
	{
		symbol: "ZORA",
		address: "0xD8E3FB3b08eBA982F2754988d70D57eDc0055ae6",
		decimals: 9
	},
	{
		symbol: "ZOZ",
		address: "0x65adB08bEb7454C2cD5DFfC271aDEE9Fbf69632b",
		decimals: 18
	},
	{
		symbol: "ZPAE",
		address: "0x045Eb7e34e94B28C7A3641BC5e1A1F61f225Af9F",
		decimals: 18
	},
	{
		symbol: "ZPAY",
		address: "0xEfFeA57067E02999fDCd0Bb45c0f1071a29472D9",
		decimals: 18
	},
	{
		symbol: "ZPR",
		address: "0xb5b8F5616Fe42d5ceCA3e87F3FddbDd8F496d760",
		decimals: 18
	},
	{
		symbol: "ZRX",
		address: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
		decimals: 18
	},
	{
		symbol: "ZSC",
		address: "0x7A41e0517a5ecA4FdbC7FbebA4D4c47B9fF6DC63",
		decimals: 18
	},
	{
		symbol: "ZST",
		address: "0xe386B139Ed3715Ca4B18Fd52671bDcea1cdFE4b1",
		decimals: 8
	},
	{
		symbol: "ZT",
		address: "0xFE39e6a32AcD2aF7955Cb3D406Ba2B55C901f247",
		decimals: 18
	},
	{
		symbol: "ZTH",
		address: "0xa49DEd8B4607F958003E0d87d7f2d2f69bCADD41",
		decimals: 18
	},
	{
		symbol: "ZTT",
		address: "0x6F0F17DF020cb9F200C175883B24B4407d18C521",
		decimals: 18
	},
	{
		symbol: "ZTX",
		address: "0xE8F9fa977ea585591d9F394681318C16552577fB",
		decimals: 18
	},
	{
		symbol: "ZUBE",
		address: "0xc5e017450346e4F9A2E477519d65aFFcfc90586a",
		decimals: 18
	},
	{
		symbol: "ZUC",
		address: "0x6b4689E4514957699eDeB2Ee91C947F18E439806",
		decimals: 18
	},
	{
		symbol: "ZUM",
		address: "0xe0b9BcD54bF8A730EA5d3f1fFCe0885E911a502c",
		decimals: 8
	},
	{
		symbol: "ZUT",
		address: "0x83F873388Cd14b83A9f47FabDe3C9850b5C74548",
		decimals: 18
	},
	{
		symbol: "ZXC",
		address: "0x83e2BE8d114F9661221384B3a50d24B96a5653F5",
		decimals: 18
	},
	{
		symbol: "ZXT",
		address: "0x8Ed5AFCb8877624802a0CBfb942C95c2B7c87146",
		decimals: 18
	},
	{
		symbol: "ZXTH",
		address: "0xF9933cb5f0397bf020Bb950C307e30dd8f62080f",
		decimals: 18
	},
	{
		symbol: "ZYN",
		address: "0xE65ee7c03Bbb3C950Cfd4895c24989afA233EF01",
		decimals: 18
	},
	{
		symbol: "ZYR",
		address: "0x35E3a8658D87FA71Ba349bac7F3AeD948F6EbC0C",
		decimals: 18
	},
	{
		symbol: "ZZZ",
		address: "0xc75F15AdA581219c95485c578E124df3985e4CE0",
		decimals: 18
	},
	{
		symbol: "¢",
		address: "0xa33e729bf4fdeb868B534e1f20523463D9C46bEe",
		decimals: 10
	},
	{
		symbol: "☀️ PLASMA",
		address: "0x59416A25628A76b4730eC51486114c32E0B582A1",
		decimals: 6
	},
	{
		symbol: "🍺",
		address: "0x7367A68039d4704f30BfBF6d948020C3B07DFC59",
		decimals: 18
	},
	{
		symbol: "🦄",
		address: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
		decimals: 0
	}
];

var ETH = {
  name: 'ETH',
  name_long: 'Ethereum',
  homePage: 'https://ethereum.org',
  blockExplorerTX: 'https://etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://etherscan.io/address/[[address]]',
  chainID: 1,
  tokens: tokens$5,
  contracts: [],
  currencyName: 'ETH'
};

// import tokens from '@/tokens/tokens-goerli.json';
var GOERLI = {
  name: 'GOERLI',
  name_long: 'Goerli',
  homePage: 'https://github.com/goerli/testnet',
  blockExplorerTX: 'https://goerli.etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://goerli.etherscan.io/address/[[address]]',
  chainID: 5,
  tokens: [],
  contracts: [],
  currencyName: 'GöETH'
};

// import tokens from '@/tokens/tokens-kov.json';
// import contracts from '@/contracts/contract-abi-kov.json';
// import kov from '@/assets/images/icons/network.svg';
var KOV = {
  name: 'KOV',
  name_long: 'Kovan',
  homePage: 'https://kovan-testnet.github.io/website/',
  blockExplorerTX: 'https://kovan.etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://kovan.etherscan.io/address/[[address]]',
  chainID: 42,
  tokens: [],
  contracts: [],
  // icon: kov,
  currencyName: 'KOV'
};

var tokens$4 = [
	{
		symbol: "*PLASMA",
		address: "0x95D7321EdCe519419ba1DbC60A89bAfbF55EAC0D",
		decimals: 6
	},
	{
		symbol: "aBAT",
		address: "0x0D0Ff1C81F2Fbc8cbafA8Df4bF668f5ba963Dab4",
		decimals: 18
	},
	{
		symbol: "ABCD",
		address: "0x21C968b15be143484E0BD1CfaE1f7378f89b414c",
		decimals: 18
	},
	{
		symbol: "aDAI",
		address: "0xcB1Fe6F440c49E9290c3eb7f158534c2dC374201",
		decimals: 18
	},
	{
		symbol: "aETH",
		address: "0x2433A1b6FcF156956599280C3Eb1863247CFE675",
		decimals: 18
	},
	{
		symbol: "aKNC",
		address: "0xCf6efd4528d27Df440fdd585a116D3c1fC5aDdEe",
		decimals: 18
	},
	{
		symbol: "aLEND",
		address: "0x383261d0e287f0A641322AEB15E3da50147Dd36b",
		decimals: 18
	},
	{
		symbol: "aLINK",
		address: "0x52fd99c15e6FFf8D4CF1B83b2263a501FDd78973",
		decimals: 18
	},
	{
		symbol: "aMANA",
		address: "0x8e96a4068da80F66ef1CFc7987f0F834c26106fa",
		decimals: 18
	},
	{
		symbol: "aMKR",
		address: "0xEd6A5d671f7c55aa029cbAEa2e5E9A18E9d6a1CE",
		decimals: 18
	},
	{
		symbol: "aREP",
		address: "0xE4B92BcDB2f972e1ccc069D4dB33d5f6363738dE",
		decimals: 18
	},
	{
		symbol: "aSUSD",
		address: "0x5D17e0ea2d886F865E40176D71dbc0b59a54d8c1",
		decimals: 6
	},
	{
		symbol: "aTUSD",
		address: "0x6308180b412c481982628D093f342A259b4e681C",
		decimals: 18
	},
	{
		symbol: "aUSDC",
		address: "0x2dB6a31f973Ec26F5e17895f0741BB5965d5Ae15",
		decimals: 6
	},
	{
		symbol: "aUSDT",
		address: "0x790744bC4257B4a0519a3C5649Ac1d16DDaFAE0D",
		decimals: 6
	},
	{
		symbol: "aWBTC",
		address: "0xA1c4dB01F8344eCb11219714706C82f0c0c64841",
		decimals: 18
	},
	{
		symbol: "aZRX",
		address: "0x5BDC773c9D3515a5e3Dd415428F92a90E8e63Ae4",
		decimals: 18
	},
	{
		symbol: "cBAT",
		address: "0x189CA88bE39C9c1B8c8dd437F5ff1DB1f584b14b",
		decimals: 8
	},
	{
		symbol: "cDAI",
		address: "0x2B536482a01E620eE111747F8334B395a42A555E",
		decimals: 8
	},
	{
		symbol: "cETH",
		address: "0x42a628e0c5F3767930097B34b08dCF77e78e4F2B",
		decimals: 8
	},
	{
		symbol: "cREP",
		address: "0xA3C2c1618214549281E1b15dee9D682C8aa0DC1C",
		decimals: 8
	},
	{
		symbol: "cUSDC",
		address: "0x43a1363AFB28235720FCbDF0C2dAb7759091F7e0",
		decimals: 8
	},
	{
		symbol: "cWBTC",
		address: "0x06E728D7907C164649427D2ACFD4c81669D453Bf",
		decimals: 8
	},
	{
		symbol: "cZRX",
		address: "0xDff375162cfE7D77473C1BEC4560dEDE974E138c",
		decimals: 8
	},
	{
		symbol: "dqr30",
		address: "0xa1bAccA0e12D4091Ec1f92e7CaE3394CC9854D3D",
		decimals: 18
	},
	{
		symbol: "FQXT",
		address: "0x5D47033e140f7b589CC2545416eC9D7a712A7de9",
		decimals: 8
	},
	{
		symbol: "MEWV5",
		address: "0x4C572Fbc03D4A2B683cF4f10ffdcaFD00885E108",
		decimals: 9
	},
	{
		symbol: "RLC",
		address: "0x7314Dc4d7794b5E7894212CA1556ae8e3De58621",
		decimals: 9
	}
];

var ROP = {
  name: 'ROP',
  name_long: 'Ropsten',
  homePage: 'https://github.com/ethereum/ropsten',
  blockExplorerTX: 'https://ropsten.etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://ropsten.etherscan.io/address/[[address]]',
  chainID: 3,
  tokens: tokens$4,
  contracts: [],
  currencyName: 'ROP'
};

var tokens$3 = [
	{
		symbol: "$DG",
		address: "0x2a93172c8DCCbfBC60a39d56183B7279a2F647b4",
		decimals: 18
	},
	{
		symbol: "0xBTC",
		address: "0x71B821aa52a49F32EEd535fCA6Eb5aa130085978",
		decimals: 8
	},
	{
		symbol: "AAVE",
		address: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
		decimals: 18
	},
	{
		symbol: "AGA",
		address: "0x033d942A6b495C4071083f4CDe1f17e986FE856c",
		decimals: 4
	},
	{
		symbol: "AGAr",
		address: "0xF84BD51eab957c2e7B7D646A3427C5A50848281D",
		decimals: 8
	},
	{
		symbol: "amAAVE",
		address: "0x1d2a0E5EC8E5bBDCA5CB219e649B565d8e5c3360",
		decimals: 18
	},
	{
		symbol: "amDAI",
		address: "0x27F8D03b3a2196956ED754baDc28D73be8830A6e",
		decimals: 18
	},
	{
		symbol: "amUSDC",
		address: "0x1a13F4Ca1d028320A707D99520AbFefca3998b7F",
		decimals: 6
	},
	{
		symbol: "amUSDT",
		address: "0x60D55F02A771d515e077c9C2403a1ef324885CeC",
		decimals: 6
	},
	{
		symbol: "amWBTC",
		address: "0x5c2ed810328349100A66B82b78a1791B101C9D61",
		decimals: 8
	},
	{
		symbol: "amWETH",
		address: "0x28424507fefb6f7f8E9D3860F56504E4e5f5f390",
		decimals: 18
	},
	{
		symbol: "amWMATIC",
		address: "0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4",
		decimals: 18
	},
	{
		symbol: "ANY",
		address: "0x6aB6d61428fde76768D7b45D8BFeec19c6eF91A8",
		decimals: 18
	},
	{
		symbol: "ARIA20",
		address: "0x46F48FbdedAa6F5500993BEDE9539ef85F4BeE8e",
		decimals: 18
	},
	{
		symbol: "AZUKI",
		address: "0x7CdC0421469398e0F3aA8890693d86c840Ac8931",
		decimals: 18
	},
	{
		symbol: "bBADGER",
		address: "0x2628D301b161DB70E3dBbAc88d9D900cA426fF02",
		decimals: 18
	},
	{
		symbol: "bDIGG",
		address: "0xFDde616084427f0A231D0664a985E1F820E34693",
		decimals: 18
	},
	{
		symbol: "BIFI",
		address: "0xFbdd194376de19a88118e84E279b977f165d01b8",
		decimals: 18
	},
	{
		symbol: "BTU",
		address: "0xFdc26CDA2d2440d0E83CD1DeE8E8bE48405806DC",
		decimals: 18
	},
	{
		symbol: "BURNER",
		address: "0x0000000000000000000000000000000000000000",
		decimals: 0
	},
	{
		symbol: "CC10",
		address: "0x9c49BA0212Bb5Db371e66b59D1565b7c06E4894e",
		decimals: 18
	},
	{
		symbol: "CEL",
		address: "0xD85d1e945766Fea5Eda9103F918Bd915FbCa63E6",
		decimals: 4
	},
	{
		symbol: "CFi",
		address: "0xeCf8f2FA183b1C4d2A269BF98A54fCe86C812d3e",
		decimals: 18
	},
	{
		symbol: "COMP",
		address: "0x8505b9d2254A7Ae468c0E9dd10Ccea3A837aef5c",
		decimals: 18
	},
	{
		symbol: "CRV",
		address: "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
		decimals: 18
	},
	{
		symbol: "CTSI",
		address: "0x2727Ab1c2D22170ABc9b595177B2D5C6E1Ab7B7B",
		decimals: 18
	},
	{
		symbol: "DAI",
		address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
		decimals: 18
	},
	{
		symbol: "DB",
		address: "0x0e59D50adD2d90f5111aca875baE0a72D95B4762",
		decimals: 18
	},
	{
		symbol: "DEFI5",
		address: "0x42435F467D33e5C4146a4E8893976ef12BBCE762",
		decimals: 18
	},
	{
		symbol: "DEGEN",
		address: "0x8a2870fb69A90000D6439b7aDfB01d4bA383A415",
		decimals: 18
	},
	{
		symbol: "DFYN",
		address: "0xC168E40227E4ebD8C1caE80F7a55a4F0e6D66C97",
		decimals: 18
	},
	{
		symbol: "DMT",
		address: "0xd28449BB9bB659725aCcAd52947677ccE3719fD7",
		decimals: 18
	},
	{
		symbol: "DRC",
		address: "0xFeD16c746CB5BFeD009730f9E3e6A673006105c7",
		decimals: 0
	},
	{
		symbol: "DSLA",
		address: "0xa0E390e9ceA0D0e8cd40048ced9fA9EA10D71639",
		decimals: 18
	},
	{
		symbol: "EASY",
		address: "0xDb3b3b147A030F032633f6C4BEBf9a2fB5a882B5",
		decimals: 18
	},
	{
		symbol: "ELE",
		address: "0xAcD7B3D9c10e97d0efA418903C0c7669E702E4C0",
		decimals: 18
	},
	{
		symbol: "Elemeteum (PoS)",
		address: "0x07738Eb4ce8932CA961c815Cb12C9d4ab5Bd0Da4",
		decimals: 18
	},
	{
		symbol: "FISH",
		address: "0x3a3Df212b7AA91Aa0402B9035b098891d276572B",
		decimals: 18
	},
	{
		symbol: "FRAX",
		address: "0x104592a158490a9228070E0A8e5343B499e125D0",
		decimals: 18
	},
	{
		symbol: "FSN",
		address: "0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c",
		decimals: 18
	},
	{
		symbol: "FXS",
		address: "0x3e121107F6F22DA4911079845a470757aF4e1A1b",
		decimals: 18
	},
	{
		symbol: "GAME",
		address: "0x8d1566569d5b695d44a9a234540f68D393cDC40D",
		decimals: 18
	},
	{
		symbol: "GFARM2",
		address: "0x7075cAB6bCCA06613e2d071bd918D1a0241379E2",
		decimals: 18
	},
	{
		symbol: "GHST",
		address: "0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7",
		decimals: 18
	},
	{
		symbol: "HAWK",
		address: "0x69CBC7449ee102eB792f1656744bF1A7c1bACB7e",
		decimals: 18
	},
	{
		symbol: "HEX",
		address: "0x23D29D30e35C5e8D321e1dc9A8a61BFD846D4C5C",
		decimals: 8
	},
	{
		symbol: "Holyheld (PoS)",
		address: "0x521CddC0CBa84F14c69C1E99249F781AA73Ee0BC",
		decimals: 18
	},
	{
		symbol: "IGG",
		address: "0xe6FC6C7CB6d2c31b359A49A33eF08aB87F4dE7CE",
		decimals: 6
	},
	{
		symbol: "IRON",
		address: "0xD86b5923F3AD7b585eD81B448170ae026c65ae9a",
		decimals: 18
	},
	{
		symbol: "Krill",
		address: "0x05089C9EBFFa4F0AcA269e32056b1b36B37ED71b",
		decimals: 18
	},
	{
		symbol: "LEND",
		address: "0x313d009888329C9d1cf4f75CA3f32566335bd604",
		decimals: 18
	},
	{
		symbol: "LINK",
		address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
		decimals: 18
	},
	{
		symbol: "MANA",
		address: "0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4",
		decimals: 18
	},
	{
		symbol: "mDEF",
		address: "0x82B6205002ecd05e97642D38D61e2cFeaC0E18cE",
		decimals: 9
	},
	{
		symbol: "MEME",
		address: "0xf2b5a8c37278bcdD50727D5CA879f8e5A4642e2e",
		decimals: 8
	},
	{
		symbol: "miFARM",
		address: "0xab0b2ddB9C7e440fAc8E140A89c0dbCBf2d7Bbff",
		decimals: 18
	},
	{
		symbol: "mOCEAN",
		address: "0x282d8efCe846A88B159800bd4130ad77443Fa1A1",
		decimals: 18
	},
	{
		symbol: "MONA",
		address: "0x6968105460f67c3BF751bE7C15f92F5286Fd0CE5",
		decimals: 18
	},
	{
		symbol: "mRBAL",
		address: "0x66768ad00746aC4d68ded9f64886d55d5243f5Ec",
		decimals: 18
	},
	{
		symbol: "mUSD",
		address: "0xE840B73E5287865EEc17d250bFb1536704B43B21",
		decimals: 18
	},
	{
		symbol: "MUST",
		address: "0x9C78EE466D6Cb57A4d01Fd887D2b5dFb2D46288f",
		decimals: 18
	},
	{
		symbol: "NDR",
		address: "0xfb65ef42F7c8A70ff73F627DB6E9ba2Aff1F20fa",
		decimals: 18
	},
	{
		symbol: "NFTP",
		address: "0xf7d9e281c5Cb4C6796284C5b663b3593D2037aF2",
		decimals: 18
	},
	{
		symbol: "OM",
		address: "0xC3Ec80343D2bae2F8E680FDADDe7C17E71E114ea",
		decimals: 18
	},
	{
		symbol: "OPU",
		address: "0x7ff2FC33E161E3b1C6511B934F0209D304267857",
		decimals: 18
	},
	{
		symbol: "PICKLE",
		address: "0x2b88aD57897A8b496595925F43048301C37615Da",
		decimals: 18
	},
	{
		symbol: "PLOT",
		address: "0xe82808eaA78339b06a691fd92E1Be79671cAd8D3",
		decimals: 18
	},
	{
		symbol: "PolyDodge",
		address: "0x8A953CfE442c5E8855cc6c61b1293FA648BAE472",
		decimals: 18
	},
	{
		symbol: "PPDEX",
		address: "0x127984b5E6d5c59f81DACc9F1C8b3Bdc8494572e",
		decimals: 18
	},
	{
		symbol: "PYR",
		address: "0x348e62131fce2F4e0d5ead3Fe1719Bc039B380A9",
		decimals: 18
	},
	{
		symbol: "QUICK",
		address: "0x831753DD7087CaC61aB5644b308642cc1c33Dc13",
		decimals: 18
	},
	{
		symbol: "RBAL",
		address: "0x03247a4368A280bEc8133300cD930A3a61d604f6",
		decimals: 18
	},
	{
		symbol: "SDT",
		address: "0x361A5a4993493cE00f61C32d4EcCA5512b82CE90",
		decimals: 18
	},
	{
		symbol: "SENT",
		address: "0x48e3883233461C2eF4cB3FcF419D6db07fb86CeA",
		decimals: 8
	},
	{
		symbol: "SUPER",
		address: "0xa1428174F516F527fafdD146b883bB4428682737",
		decimals: 18
	},
	{
		symbol: "SUPERBID",
		address: "0xA3860f969075045D82de85B06bB665f93c4BAE32",
		decimals: 18
	},
	{
		symbol: "SUSHI",
		address: "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a",
		decimals: 18
	},
	{
		symbol: "SWAP",
		address: "0x3809dcDd5dDe24B37AbE64A5a339784c3323c44F",
		decimals: 18
	},
	{
		symbol: "SWG",
		address: "0x043A3Aa319B563aC25D4E342d32bFfb51298DB7b",
		decimals: 18
	},
	{
		symbol: "TEL",
		address: "0xdF7837DE1F2Fa4631D716CF2502f8b230F1dcc32",
		decimals: 2
	},
	{
		symbol: "TITAN",
		address: "0xaAa5B9e6c589642f98a1cDA99B9D024B8407285A",
		decimals: 18
	},
	{
		symbol: "UBT",
		address: "0x7FBc10850caE055B27039aF31bD258430e714c62",
		decimals: 8
	},
	{
		symbol: "UNI",
		address: "0xb33EaAd8d922B1083446DC23f610c2567fB5180f",
		decimals: 18
	},
	{
		symbol: "USDC",
		address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
		decimals: 6
	},
	{
		symbol: "USDT",
		address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
		decimals: 6
	},
	{
		symbol: "VISION",
		address: "0x034b2090b579228482520c589dbD397c53Fc51cC",
		decimals: 18
	},
	{
		symbol: "WBTC",
		address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
		decimals: 18
	},
	{
		symbol: "WETH",
		address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
		decimals: 18
	},
	{
		symbol: "WISE",
		address: "0xB77e62709e39aD1cbeEBE77cF493745AeC0F453a",
		decimals: 18
	},
	{
		symbol: "WMATIC",
		address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
		decimals: 18
	},
	{
		symbol: "WOLF",
		address: "0x8f18dC399594b451EdA8c5da02d0563c0b2d0f16",
		decimals: 9
	},
	{
		symbol: "WRX",
		address: "0x72d6066F486bd0052eefB9114B66ae40e0A6031a",
		decimals: 8
	},
	{
		symbol: "xMARK",
		address: "0xf153EfF70DC0bf3b085134928daeEA248d9B30d0",
		decimals: 9
	},
	{
		symbol: "xSDT",
		address: "0xD921F8318cfd786baB1ea7492673F053c518Ac04",
		decimals: 18
	},
	{
		symbol: "YFI",
		address: "0xDA537104D6A5edd53c6fBba9A898708E465260b6",
		decimals: 18
	},
	{
		symbol: "ZUT",
		address: "0xe86E8beb7340659DDDCE61727E500e3A5aD75a90",
		decimals: 18
	},
	{
		symbol: "ZUZ",
		address: "0x232eaB56c4fB3f84c6Fb0a50c087c74b7B43c6Ad",
		decimals: 18
	}
];

var MATIC = {
  name: 'MATIC',
  name_long: 'Polygon (Matic)',
  homePage: 'https://polygonscan.com/',
  blockExplorerTX: 'https://polygonscan.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://polygonscan.com/address/[[address]]',
  chainID: 137,
  tokens: tokens$3,
  contracts: [],
  currencyName: 'MATIC'
};

var tokens$2 = [
	{
		symbol: "1INCH",
		address: "0x111111111117dC0aa78b770fA6A738034120C302",
		decimals: 18
	},
	{
		symbol: "7UP",
		address: "0x29f350B3822F51dc29619C583AdBC9628646E315",
		decimals: 18
	},
	{
		symbol: "8PAY",
		address: "0xFeea0bDd3D07eb6FE305938878C0caDBFa169042",
		decimals: 18
	},
	{
		symbol: "AceD",
		address: "0x3B98bbefe14B98000f10124ca95eD298AC9dB3Ff",
		decimals: 18
	},
	{
		symbol: "ACS",
		address: "0x4197C6EF3879a08cD51e5560da5064B773aa1d29",
		decimals: 18
	},
	{
		symbol: "ACSI",
		address: "0x5b17b4d5e4009B5C43e3e3d63A5229F794cBA389",
		decimals: 18
	},
	{
		symbol: "ADA",
		address: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47",
		decimals: 18
	},
	{
		symbol: "ALLOY",
		address: "0x5eF5994fA33FF4eB6c82d51ee1DC145c546065Bd",
		decimals: 18
	},
	{
		symbol: "ALPA",
		address: "0xc5E6689C9c8B02be7C49912Ef19e79cF24977f03",
		decimals: 18
	},
	{
		symbol: "ALPACA",
		address: "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F",
		decimals: 18
	},
	{
		symbol: "ALPHA",
		address: "0xa1faa113cbE53436Df28FF0aEe54275c13B40975",
		decimals: 18
	},
	{
		symbol: "ANKR",
		address: "0xf307910A4c7bbc79691fD374889b36d8531B08e3",
		decimals: 18
	},
	{
		symbol: "ANY",
		address: "0xF68C9Df95a18B2A5a5fa1124d79EEEffBaD0B6Fa",
		decimals: 18
	},
	{
		symbol: "anyBTC",
		address: "0x54261774905f3e6E9718f2ABb10ed6555cae308a",
		decimals: 8
	},
	{
		symbol: "anyETH",
		address: "0x6F817a0cE8F7640Add3bC0c1C2298635043c2423",
		decimals: 18
	},
	{
		symbol: "AQUAGOAT",
		address: "0x07af67b392B7A202fAD8E0FBc64C34F33102165B",
		decimals: 9
	},
	{
		symbol: "ARGON",
		address: "0x851F7a700c5d67DB59612b871338a85526752c25",
		decimals: 18
	},
	{
		symbol: "ATOM",
		address: "0x0Eb3a705fc54725037CC9e008bDede697f62F335",
		decimals: 18
	},
	{
		symbol: "AUTO",
		address: "0xa184088a740c695E156F91f5cC086a06bb78b827",
		decimals: 18
	},
	{
		symbol: "BAKE",
		address: "0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5",
		decimals: 18
	},
	{
		symbol: "bALBT",
		address: "0x72fAa679E1008Ad8382959FF48E392042A8b06f7",
		decimals: 18
	},
	{
		symbol: "BALL",
		address: "0xC87eaFC1D1C3F46148Ea5446d7A645602340b1E6",
		decimals: 18
	},
	{
		symbol: "BANANA",
		address: "0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95",
		decimals: 18
	},
	{
		symbol: "BAND",
		address: "0xAD6cAEb32CD2c308980a548bD0Bc5AA4306c6c18",
		decimals: 18
	},
	{
		symbol: "BAT",
		address: "0x101d82428437127bF1608F699CD651e6Abf9766E",
		decimals: 18
	},
	{
		symbol: "bBADGER",
		address: "0x1F7216fdB338247512Ec99715587bb97BBf96eae",
		decimals: 18
	},
	{
		symbol: "bBAG",
		address: "0x1AD0132D8B5Ef3cEBDA1A9692f36AC30be871b6b",
		decimals: 18
	},
	{
		symbol: "BBOO",
		address: "0xd909840613fCb0fADC6ee7E5eCF30cDEf4281a68",
		decimals: 18
	},
	{
		symbol: "bCFX",
		address: "0x045c4324039dA91c52C55DF5D785385Aab073DcF",
		decimals: 18
	},
	{
		symbol: "BCH",
		address: "0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf",
		decimals: 18
	},
	{
		symbol: "BCHA",
		address: "0xD475c9c934DCD6d5f1cAC530585aa5ba14185b92",
		decimals: 18
	},
	{
		symbol: "BDAY",
		address: "0x645748Fa7e54A818310aFDad898410bcB54FC4E0",
		decimals: 18
	},
	{
		symbol: "bDIGG",
		address: "0x5986D5c77c65e5801a5cAa4fAE80089f870A71dA",
		decimals: 18
	},
	{
		symbol: "BDO",
		address: "0x190b589cf9Fb8DDEabBFeae36a813FFb2A702454",
		decimals: 18
	},
	{
		symbol: "BEAR",
		address: "0x580f500cC7Da45B7B058De7dF325F6D8f83065E1",
		decimals: 18
	},
	{
		symbol: "BELT",
		address: "0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f",
		decimals: 18
	},
	{
		symbol: "BELUGA",
		address: "0x181dE8C57C4F25eBA9Fd27757BBd11Cc66a55d31",
		decimals: 18
	},
	{
		symbol: "Berry",
		address: "0x8626F099434d9A7E603B8f0273880209eaBfc1c5",
		decimals: 18
	},
	{
		symbol: "BETH",
		address: "0x250632378E573c6Be1AC2f97Fcdf00515d0Aa91B",
		decimals: 18
	},
	{
		symbol: "BFI",
		address: "0x81859801b01764D4f0Fa5E64729f5a6C3b91435b",
		decimals: 18
	},
	{
		symbol: "BGO",
		address: "0x579A6277a6c2c63a5b25006F63Bce5DC8D9c25e7",
		decimals: 18
	},
	{
		symbol: "BGOV",
		address: "0xf8E026dC4C0860771f691EcFFBbdfe2fa51c77CF",
		decimals: 18
	},
	{
		symbol: "BHC",
		address: "0x6fd7c98458a943f469E1Cf4eA85B173f5Cd342F4",
		decimals: 18
	},
	{
		symbol: "BIDR",
		address: "0x9A2f5556e9A637e8fBcE886d8e3cf8b316a1D8a2",
		decimals: 18
	},
	{
		symbol: "BIFI",
		address: "0xCa3F508B8e4Dd382eE878A314789373D80A5190A",
		decimals: 18
	},
	{
		symbol: "BINGUS",
		address: "0xdA20C8a5c3B1AB48e31ba6e43f0F2830E50218D8",
		decimals: 9
	},
	{
		symbol: "bKANGAL",
		address: "0xd632Bd021a07AF70592CE1E18717Ab9aA126DECB",
		decimals: 18
	},
	{
		symbol: "bLEO",
		address: "0x6421531AF54C7B14Ea805719035EBf1e3661c44A",
		decimals: 3
	},
	{
		symbol: "blink",
		address: "0x63870A18B6e42b01Ef1Ad8A2302ef50B7132054F",
		decimals: 6
	},
	{
		symbol: "BLUE",
		address: "0x36C0556c2B15aED79F842675Ff030782738eF9e8",
		decimals: 18
	},
	{
		symbol: "BLZD",
		address: "0x57067A6BD75c0E95a6A5f158455926e43E79BeB0",
		decimals: 18
	},
	{
		symbol: "bMXX",
		address: "0x4131b87F74415190425ccD873048C708F8005823",
		decimals: 18
	},
	{
		symbol: "BNBTC",
		address: "0xE7Cb24F449973D5B3520E5b93D88B405903c75Fb",
		decimals: 8
	},
	{
		symbol: "BNSD",
		address: "0xC1165227519FfD22Fdc77Ceb1037b9b284eeF068",
		decimals: 18
	},
	{
		symbol: "BOG",
		address: "0xD7B729ef857Aa773f47D37088A1181bB3fbF0099",
		decimals: 18
	},
	{
		symbol: "BONDLY",
		address: "0x96058f8C3e16576D9BD68766f3836d9A33158f89",
		decimals: 18
	},
	{
		symbol: "BOR",
		address: "0x92D7756c60dcfD4c689290E8A9F4d263b3b32241",
		decimals: 18
	},
	{
		symbol: "BORSHCH",
		address: "0x7b41e1860c91Be188c18341AE53a18B49C4b8D15",
		decimals: 18
	},
	{
		symbol: "BR34P",
		address: "0xa86d305A36cDB815af991834B46aD3d7FbB38523",
		decimals: 8
	},
	{
		symbol: "BREW",
		address: "0x790Be81C3cA0e53974bE2688cDb954732C9862e1",
		decimals: 18
	},
	{
		symbol: "BRICK",
		address: "0xc4DaA5a9f2B832eD0f9Bc579662883cD53EA9d61",
		decimals: 18
	},
	{
		symbol: "bROOBEE",
		address: "0xE64F5Cb844946C1F102Bd25bBD87a5aB4aE89Fbe",
		decimals: 18
	},
	{
		symbol: "BRRL",
		address: "0xcbe73dd7E8FC74011136b837a59205801c45e6A1",
		decimals: 18
	},
	{
		symbol: "BRY",
		address: "0xf859Bf77cBe8699013d6Dbc7C2b926Aaf307F830",
		decimals: 18
	},
	{
		symbol: "BSC",
		address: "0x17bc015607Fdf93e7C949e9Ca22f96907cFBeF88",
		decimals: 18
	},
	{
		symbol: "BSCPAD",
		address: "0x5A3010d4d8D3B5fB49f8B6E57FB9E48063f16700",
		decimals: 18
	},
	{
		symbol: "BSCS",
		address: "0xbcb24AFb019BE7E93EA9C43B7E22Bb55D5B7f45D",
		decimals: 18
	},
	{
		symbol: "BSCX",
		address: "0x5Ac52EE5b2a633895292Ff6d8A89bB9190451587",
		decimals: 18
	},
	{
		symbol: "bSRK",
		address: "0x14b1166aB53A237c8cEaeE2BBc4BbCa200cb7da8",
		decimals: 18
	},
	{
		symbol: "BTCB",
		address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
		decimals: 18
	},
	{
		symbol: "BTCST",
		address: "0x78650B139471520656b9E7aA7A5e9276814a38e9",
		decimals: 17
	},
	{
		symbol: "BTD",
		address: "0xD1102332a213E21faF78B69C03572031F3552c33",
		decimals: 18
	},
	{
		symbol: "BTS",
		address: "0xc2e1acef50aE55661855E8dcB72adB182A3cC259",
		decimals: 18
	},
	{
		symbol: "BUNNY",
		address: "0xC9849E6fdB743d08fAeE3E34dd2D1bc69EA11a51",
		decimals: 18
	},
	{
		symbol: "BURGER",
		address: "0xAe9269f27437f0fcBC232d39Ec814844a51d6b8f",
		decimals: 18
	},
	{
		symbol: "BURNER",
		address: "0x0000000000000000000000000000000000000000",
		decimals: 0
	},
	{
		symbol: "BUSD",
		address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
		decimals: 18
	},
	{
		symbol: "BUX",
		address: "0x211FfbE424b90e25a15531ca322adF1559779E45",
		decimals: 18
	},
	{
		symbol: "bwJUP",
		address: "0x0231f91e02DebD20345Ae8AB7D71A41f8E140cE7",
		decimals: 18
	},
	{
		symbol: "Cake",
		address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
		decimals: 18
	},
	{
		symbol: "CAN",
		address: "0x007EA5C0Ea75a8DF45D288a4debdD5bb633F9e56",
		decimals: 18
	},
	{
		symbol: "CBIX",
		address: "0x34681C1035F97E1eDcccec5f142e02FF81a3A230",
		decimals: 18
	},
	{
		symbol: "CCAKE",
		address: "0xc7091AA18598b87588e37501b6Ce865263CD67Ce",
		decimals: 18
	},
	{
		symbol: "CHI",
		address: "0x0000000000004946c0e9F43F4Dee607b0eF1fA1c",
		decimals: 0
	},
	{
		symbol: "CHIP",
		address: "0xa25FC408EF05321103243557C851101f9AceE608",
		decimals: 18
	},
	{
		symbol: "CHS",
		address: "0xaDD8A06fd58761A5047426e160B2B88AD3B9D464",
		decimals: 18
	},
	{
		symbol: "CLIMB",
		address: "0x2A1d286ed5edAD78BeFD6E0d8BEb38791e8cD69d",
		decimals: 8
	},
	{
		symbol: "COMP",
		address: "0x52CE071Bd9b1C4B00A0b92D298c512478CaD67e8",
		decimals: 18
	},
	{
		symbol: "COOK",
		address: "0x965b0Df5BDA0E7a0649324D78f03D5F7F2De086a",
		decimals: 18
	},
	{
		symbol: "COS",
		address: "0x96Dd399F9c3AFda1F194182F71600F1B65946501",
		decimals: 18
	},
	{
		symbol: "CPX",
		address: "0xB7B1bd104645D5A06120d369c63822b2AeAd1598",
		decimals: 18
	},
	{
		symbol: "crADA",
		address: "0x81C15D3E956e55e77E1f3F257f0A65Bd2725fC55",
		decimals: 8
	},
	{
		symbol: "crALPHA",
		address: "0x264Bc4Ea2F45cF6331AD6C3aC8d7257Cf487FcbC",
		decimals: 8
	},
	{
		symbol: "crATOM",
		address: "0x0E9d900C884964dC4B26db96Ba113825B1a09Baa",
		decimals: 8
	},
	{
		symbol: "crBAND",
		address: "0x738f3810b3dA0F3e6dC8C689D0d72f3b4992c43b",
		decimals: 8
	},
	{
		symbol: "crBCH",
		address: "0xCb87Cee8c77CdFD310fb3C58ff72e688d46f90b1",
		decimals: 8
	},
	{
		symbol: "crBNB",
		address: "0x1Ffe17B99b439bE0aFC831239dDECda2A790fF3A",
		decimals: 8
	},
	{
		symbol: "crBTCB",
		address: "0x11883Cdea6bAb720092791cc89affa54428Ce069",
		decimals: 8
	},
	{
		symbol: "crBUSD",
		address: "0x2Bc4eb013DDee29D37920938B96d353171289B7C",
		decimals: 8
	},
	{
		symbol: "crCREAM",
		address: "0x426D6D53187be3288fe37f214e3F6901D8145b62",
		decimals: 8
	},
	{
		symbol: "crDAI",
		address: "0x9095e8d707E40982aFFce41C61c10895157A1B22",
		decimals: 8
	},
	{
		symbol: "crDOT",
		address: "0x53D88d2ffDBE71E81D95b08AE0cA49D0C4A8515f",
		decimals: 8
	},
	{
		symbol: "CREAM",
		address: "0xd4CB328A82bDf5f03eB737f37Fa6B370aef3e888",
		decimals: 18
	},
	{
		symbol: "crEOS",
		address: "0x19eE64850862cFd234e20c0db4edA286f12ec907",
		decimals: 8
	},
	{
		symbol: "crETH",
		address: "0xb31f5d117541825D6692c10e4357008EDF3E2BCD",
		decimals: 8
	},
	{
		symbol: "crFIL",
		address: "0x1aF8c1C3AD36A041cb6678feD86B1E095004fd16",
		decimals: 8
	},
	{
		symbol: "crLINK",
		address: "0x3942936782d788ce69155F776A51A5F1C9dd9B22",
		decimals: 8
	},
	{
		symbol: "crLTC",
		address: "0x8cc7E2a6de999758499658bB702143FD025E09B2",
		decimals: 8
	},
	{
		symbol: "CROW",
		address: "0xcc2E12a9b5b75360c6FBf23B584c275D52cDdb0E",
		decimals: 18
	},
	{
		symbol: "CRP",
		address: "0x1Ad8D89074AFA789A027B9a31d0bd14e254711D0",
		decimals: 18
	},
	{
		symbol: "CRPTP",
		address: "0xD0e931a596C8A0F6e2EbaAE507a55F687BeF829c",
		decimals: 18
	},
	{
		symbol: "crTWT",
		address: "0x2d3bfaDF9BC94E3Ab796029A030e863F1898aA06",
		decimals: 8
	},
	{
		symbol: "crUNI",
		address: "0x3B0Be453a4008EBc2eDd457e7Bd355f1C5469d68",
		decimals: 8
	},
	{
		symbol: "crUSDC",
		address: "0xD83C88DB3A6cA4a32FFf1603b0f7DDce01F5f727",
		decimals: 8
	},
	{
		symbol: "crUSDT",
		address: "0xEF6d459FE81C3Ed53d292c936b2df5a8084975De",
		decimals: 8
	},
	{
		symbol: "CRX",
		address: "0x97a30C692eCe9C317235d48287d23d358170FC40",
		decimals: 18
	},
	{
		symbol: "crXRP",
		address: "0xAa46e2c21B7763a73DB48e9b318899253E66e20C",
		decimals: 8
	},
	{
		symbol: "crXTZ",
		address: "0xE692714717a89E4F2ab89dd17d8DDdD7bb52De8e",
		decimals: 8
	},
	{
		symbol: "crYFI",
		address: "0xEA466cd2583A0290b9E7b987a769a7Eb468FB0A5",
		decimals: 8
	},
	{
		symbol: "CTF",
		address: "0x299baC24C8ad5635586fDe6619efF7891a6c8969",
		decimals: 18
	},
	{
		symbol: "CTK",
		address: "0xA8c2B8eec3d368C0253ad3dae65a5F2BBB89c929",
		decimals: 6
	},
	{
		symbol: "CUB",
		address: "0x50D809c74e0B8e49e7B4c65BB3109AbE3Ff4C1C1",
		decimals: 18
	},
	{
		symbol: "CUMMIES",
		address: "0x27Ae27110350B98d564b9A3eeD31bAeBc82d878d",
		decimals: 18
	},
	{
		symbol: "CYC",
		address: "0x810EE35443639348aDbbC467b33310d2AB43c168",
		decimals: 18
	},
	{
		symbol: "D100",
		address: "0x9d8AAC497A4b8fe697dd63101d793F0C6A6EEbB6",
		decimals: 9
	},
	{
		symbol: "DAI",
		address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
		decimals: 18
	},
	{
		symbol: "DANGO",
		address: "0x0957C57C9EB7744850dCC95db5A06eD4a246236E",
		decimals: 6
	},
	{
		symbol: "DDIM",
		address: "0xc9132C76060F6b319764Ea075973a650A1a53bC9",
		decimals: 18
	},
	{
		symbol: "DEGO",
		address: "0x3FdA9383A84C05eC8f7630Fe10AdF1fAC13241CC",
		decimals: 18
	},
	{
		symbol: "DEXE",
		address: "0x039cB485212f996A9DBb85A9a75d898F94d38dA6",
		decimals: 18
	},
	{
		symbol: "DF",
		address: "0x4A9A2b2b04549C3927dd2c9668A5eF3fCA473623",
		decimals: 18
	},
	{
		symbol: "DFX",
		address: "0x74B3abB94e9e1ECc25Bd77d6872949B4a9B2aACF",
		decimals: 18
	},
	{
		symbol: "DFY",
		address: "0xD98560689C6e748DC37bc410B4d3096B1aA3D8C2",
		decimals: 18
	},
	{
		symbol: "DIESEL",
		address: "0xe1eA2E1907d93F154234CE3b5A7418faf175fE11",
		decimals: 18
	},
	{
		symbol: "DITTO",
		address: "0x233d91A0713155003fc4DcE0AFa871b508B3B715",
		decimals: 9
	},
	{
		symbol: "DODO",
		address: "0x67ee3Cb086F8a16f34beE3ca72FAD36F7Db929e2",
		decimals: 18
	},
	{
		symbol: "DOG",
		address: "0xF94CA0B303e52d68b63626Bed7f680fa4DC3f779",
		decimals: 9
	},
	{
		symbol: "DOGE",
		address: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
		decimals: 8
	},
	{
		symbol: "DOS",
		address: "0xDc0f0a5719c39764b011eDd02811BD228296887C",
		decimals: 18
	},
	{
		symbol: "DOT",
		address: "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402",
		decimals: 18
	},
	{
		symbol: "DUSK",
		address: "0xB2BD0749DBE21f623d9BABa856D3B0f0e1BFEc9C",
		decimals: 18
	},
	{
		symbol: "EARS",
		address: "0x0EC4B89462557150302AC6e81270a081F2e3BD20",
		decimals: 18
	},
	{
		symbol: "ECP",
		address: "0x375483CfA7Fc18F6b455E005D835A8335FbdbB1f",
		decimals: 9
	},
	{
		symbol: "EGG",
		address: "0xF952Fc3ca7325Cc27D15885d37117676d25BfdA6",
		decimals: 18
	},
	{
		symbol: "EGLD",
		address: "0xbF7c81FFF98BbE61B40Ed186e4AfD6DDd01337fe",
		decimals: 18
	},
	{
		symbol: "ELE",
		address: "0xAcD7B3D9c10e97d0efA418903C0c7669E702E4C0",
		decimals: 18
	},
	{
		symbol: "ELF",
		address: "0xa3f020a5C92e15be13CAF0Ee5C95cF79585EeCC9",
		decimals: 18
	},
	{
		symbol: "ElonGate",
		address: "0x2A9718defF471f3Bb91FA0ECEAB14154F150a385",
		decimals: 9
	},
	{
		symbol: "EOS",
		address: "0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6",
		decimals: 18
	},
	{
		symbol: "EPS",
		address: "0xA7f552078dcC247C2684336020c03648500C6d9F",
		decimals: 18
	},
	{
		symbol: "ERC20",
		address: "0x58730ae0FAA10d73b0cDdb5e7b87C3594f7a20CB",
		decimals: 18
	},
	{
		symbol: "ETC",
		address: "0x3d6545b08693daE087E957cb1180ee38B9e3c25E",
		decimals: 18
	},
	{
		symbol: "ETH",
		address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
		decimals: 18
	},
	{
		symbol: "ETHb",
		address: "0xc5137E8e017799e71A65e0cFe3F340d719AF17D3",
		decimals: 18
	},
	{
		symbol: "FARM",
		address: "0x4B5C23cac08a567ecf0c1fFcA8372A45a5D33743",
		decimals: 18
	},
	{
		symbol: "FAT",
		address: "0x90e767A68a7d707B74D569C8E79f9bBb79b98a8b",
		decimals: 18
	},
	{
		symbol: "FEB",
		address: "0xA72a0564d0e887123112e6A4DC1abA7611Ad861d",
		decimals: 0
	},
	{
		symbol: "FIL",
		address: "0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153",
		decimals: 18
	},
	{
		symbol: "FINE",
		address: "0x4e6415a5727ea08aAE4580057187923aeC331227",
		decimals: 18
	},
	{
		symbol: "FLO",
		address: "0x2263bF3C00787a7cfA17aef830261D1FE342FD5B",
		decimals: 18
	},
	{
		symbol: "FMT",
		address: "0x99c6e435eC259A7E8d65E1955C9423DB624bA54C",
		decimals: 18
	},
	{
		symbol: "FOR",
		address: "0x658A109C5900BC6d2357c87549B651670E5b0539",
		decimals: 18
	},
	{
		symbol: "FOX",
		address: "0xFAd8E46123D7b4e77496491769C167FF894d2ACB",
		decimals: 9
	},
	{
		symbol: "FREE",
		address: "0x12e34cDf6A031a10FE241864c32fB03a4FDaD739",
		decimals: 18
	},
	{
		symbol: "FREN",
		address: "0x13958e1eb63dFB8540Eaf6ed7DcbBc1A60FD52AF",
		decimals: 18
	},
	{
		symbol: "FRIES",
		address: "0x393B312C01048b3ed2720bF1B090084C09e408A1",
		decimals: 18
	},
	{
		symbol: "FRONT",
		address: "0x928e55daB735aa8260AF3cEDadA18B5f70C72f1b",
		decimals: 18
	},
	{
		symbol: "FSAFE",
		address: "0xEE738a9e5FB78c24D26ceCD30389ED977C38D0Ca",
		decimals: 9
	},
	{
		symbol: "Fuel",
		address: "0x2090c8295769791ab7A3CF1CC6e0AA19F35e441A",
		decimals: 18
	},
	{
		symbol: "fUSDT",
		address: "0x049d68029688eAbF473097a2fC38ef61633A3C7A",
		decimals: 6
	},
	{
		symbol: "FUSE",
		address: "0x5857c96DaE9cF8511B08Cb07f85753C472D36Ea3",
		decimals: 18
	},
	{
		symbol: "FUSII",
		address: "0x3A50d6daacc82f17A2434184fE904fC45542A734",
		decimals: 18
	},
	{
		symbol: "GEN",
		address: "0xB0F2939A1c0e43683E5954c9Fe142F7df9F8D967",
		decimals: 18
	},
	{
		symbol: "GFCE",
		address: "0x94BaBBE728D9411612Ee41b20241a6FA251b26Ce",
		decimals: 9
	},
	{
		symbol: "GMT",
		address: "0x99e92123eB77Bc8f999316f622e5222498438784",
		decimals: 18
	},
	{
		symbol: "GREEN",
		address: "0xa4FB1f591980e6E4eb4661A0D96df19A13D21aA7",
		decimals: 18
	},
	{
		symbol: "GST",
		address: "0x444A0E0c139Cac67e8f9be945C6Dfe01A2766ED1",
		decimals: 18
	},
	{
		symbol: "GTON",
		address: "0x64D5BaF5ac030e2b7c435aDD967f787ae94D0205",
		decimals: 18
	},
	{
		symbol: "gwUSDN",
		address: "0xc4b6F32B84657E9f6a73fE119f0967bE5bA8CF05",
		decimals: 18
	},
	{
		symbol: "HAKKA",
		address: "0x1D1eb8E8293222e1a29d2C0E4cE6C0Acfd89AaaC",
		decimals: 18
	},
	{
		symbol: "HARD",
		address: "0xf79037F6f6bE66832DE4E7516be52826BC3cBcc4",
		decimals: 6
	},
	{
		symbol: "Helmet",
		address: "0x948d2a81086A075b3130BAc19e4c6DEe1D2E3fE8",
		decimals: 18
	},
	{
		symbol: "HOGL",
		address: "0x182c763a4b2Fbd18C9B5f2D18102a0dDd9D5DF26",
		decimals: 18
	},
	{
		symbol: "HPS",
		address: "0xeDa21B525Ac789EaB1a08ef2404dd8505FfB973D",
		decimals: 18
	},
	{
		symbol: "HYDRO",
		address: "0xf3DBB49999B25c9D6641a9423C7ad84168D00071",
		decimals: 18
	},
	{
		symbol: "ICE",
		address: "0xf16e81dce15B08F326220742020379B855B87DF9",
		decimals: 18
	},
	{
		symbol: "INJ",
		address: "0xa2B726B1145A4773F68593CF171187d8EBe4d495",
		decimals: 18
	},
	{
		symbol: "INNBC",
		address: "0xdF1F0026374d4BCc490BE5E316963Cf6Df2FfF19",
		decimals: 6
	},
	{
		symbol: "IOTX",
		address: "0x9678E42ceBEb63F23197D726B29b1CB20d0064E5",
		decimals: 18
	},
	{
		symbol: "IRON",
		address: "0x7b65B489fE53fCE1F6548Db886C08aD73111DDd8",
		decimals: 18
	},
	{
		symbol: "ITAM",
		address: "0x04C747b40Be4D535fC83D09939fb0f626F32800B",
		decimals: 18
	},
	{
		symbol: "JGN",
		address: "0xC13B7a43223BB9Bf4B69BD68Ab20ca1B79d81C75",
		decimals: 18
	},
	{
		symbol: "JIGG",
		address: "0x82d49D4c442219Fdda7857fC1102E7CE6e6E5612",
		decimals: 18
	},
	{
		symbol: "JNTR",
		address: "0x5f2Caa99Fc378248Ac02CbbAaC27e3Fa155Ed2C4",
		decimals: 18
	},
	{
		symbol: "JULb",
		address: "0x32dFFc3fE8E3EF3571bF8a72c0d0015C5373f41D",
		decimals: 18
	},
	{
		symbol: "JulD",
		address: "0x5A41F637C3f7553dBa6dDC2D3cA92641096577ea",
		decimals: 18
	},
	{
		symbol: "JUV",
		address: "0xC40C9A843E1c6D01b7578284a9028854f6683b1B",
		decimals: 2
	},
	{
		symbol: "KaiInu",
		address: "0xe5a09784b16E1065C37dF14c6e2f06fDcE317a1b",
		decimals: 9
	},
	{
		symbol: "KEBAB",
		address: "0x7979F6C54ebA05E18Ded44C4F986F49a5De551c2",
		decimals: 18
	},
	{
		symbol: "KEY",
		address: "0x85c128eE1feEb39A59490c720A9C563554B51D33",
		decimals: 18
	},
	{
		symbol: "KIND",
		address: "0xE3Ba88c38D2789FE58465020CC0FB60b70c10d32",
		decimals: 8
	},
	{
		symbol: "KODA",
		address: "0x9E993671976a5AC51bBfB3Db9E34eAC8d518fe82",
		decimals: 9
	},
	{
		symbol: "KP3RB",
		address: "0x5EA29eEe799aA7cC379FdE5cf370BC24f2Ea7c81",
		decimals: 18
	},
	{
		symbol: "LAUNCH",
		address: "0xb5389A679151C4b8621b1098C6E0961A3CFEe8d4",
		decimals: 18
	},
	{
		symbol: "LIME",
		address: "0xBBabF1636b7ab0069a8F7ce76b4AFbee2F1e2F2c",
		decimals: 18
	},
	{
		symbol: "LINA",
		address: "0x762539b45A1dCcE3D36d080F74d1AED37844b878",
		decimals: 18
	},
	{
		symbol: "LINK",
		address: "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD",
		decimals: 18
	},
	{
		symbol: "LIT",
		address: "0xb59490aB09A0f526Cc7305822aC65f2Ab12f9723",
		decimals: 18
	},
	{
		symbol: "LOT",
		address: "0x4E7Ae924FD9a5D60b56BE486b2900efE0c6a9CA7",
		decimals: 9
	},
	{
		symbol: "lowb",
		address: "0x843D4a358471547f51534e3e51fae91cb4Dc3F28",
		decimals: 18
	},
	{
		symbol: "LPTP",
		address: "0x73a3a0CD0C2cC69Dc18335EAd38525ED3222587e",
		decimals: 18
	},
	{
		symbol: "LTC",
		address: "0x4338665CBB7B2485A8855A139b75D5e34AB0DB94",
		decimals: 18
	},
	{
		symbol: "LTO",
		address: "0x857B222Fc79e1cBBf8Ca5f78CB133d1b7CF34BBd",
		decimals: 18
	},
	{
		symbol: "LUNAR",
		address: "0x4e8a9D0BF525d78fd9E0c88710099f227F6924cf",
		decimals: 9
	},
	{
		symbol: "MARSH",
		address: "0x2FA5dAF6Fe0708fBD63b1A7D1592577284f52256",
		decimals: 18
	},
	{
		symbol: "MASH",
		address: "0x787732f27D18495494cea3792ed7946BbCFF8db2",
		decimals: 18
	},
	{
		symbol: "MATH",
		address: "0xF218184Af829Cf2b0019F8E6F0b2423498a36983",
		decimals: 18
	},
	{
		symbol: "MATTER",
		address: "0x1C9491865a1DE77C5b6e19d2E6a5F1D7a6F2b25F",
		decimals: 18
	},
	{
		symbol: "MBOX",
		address: "0x3203c9E46cA618C8C1cE5dC67e7e9D75f5da2377",
		decimals: 18
	},
	{
		symbol: "MCRN",
		address: "0xacb2d47827C9813AE26De80965845D80935afd0B",
		decimals: 18
	},
	{
		symbol: "MDA",
		address: "0xd72aA9e1cDDC2F6D6e0444580002170fbA1f8eED",
		decimals: 18
	},
	{
		symbol: "MDG",
		address: "0xC1eDCc306E6faab9dA629efCa48670BE4678779D",
		decimals: 18
	},
	{
		symbol: "MDO",
		address: "0x35e869B7456462b81cdB5e6e42434bD27f3F788c",
		decimals: 18
	},
	{
		symbol: "MDS",
		address: "0x242E46490397ACCa94ED930F2C4EdF16250237fa",
		decimals: 18
	},
	{
		symbol: "MEOWTH",
		address: "0xE561479bEbEE0e606c19bB1973Fc4761613e3C42",
		decimals: 18
	},
	{
		symbol: "MGB",
		address: "0xF78839B9e972Cf15014843A7Ca5ebf1E321A284c",
		decimals: 18
	},
	{
		symbol: "MILK",
		address: "0x8E9f5173e16Ff93F81579d73A7f9723324d6B6aF",
		decimals: 18
	},
	{
		symbol: "MILK2",
		address: "0x4A5a34212404f30C5aB7eB61b078fA4A55AdC5a5",
		decimals: 18
	},
	{
		symbol: "MKR",
		address: "0x5f0Da599BB2ccCfcf6Fdfd7D81743B6020864350",
		decimals: 18
	},
	{
		symbol: "MLA",
		address: "0xbDDD7D426274fc5F370817C80C06b86D651963e4",
		decimals: 18
	},
	{
		symbol: "MNDAO",
		address: "0x069B2619Eb24367A46Fda638Bd1b88Aa4daD7879",
		decimals: 9
	},
	{
		symbol: "MNTN",
		address: "0xA7Fcb2BAaBDA9dB593e24B25A1a32bfb5168018b",
		decimals: 18
	},
	{
		symbol: "MOCHI",
		address: "0x055daB90880613a556a5ae2903B2682f8A5b8d27",
		decimals: 18
	},
	{
		symbol: "MOD",
		address: "0xd4fBc57B6233F268E7FbA3b66E62719D74deecBc",
		decimals: 18
	},
	{
		symbol: "MOONMOON",
		address: "0x0e0e877894a101Ad8711AE3A0194Fa44Ca837a79",
		decimals: 9
	},
	{
		symbol: "MOONSTAR",
		address: "0xCe5814eFfF15D53EFd8025B9F2006D4d7D640b9B",
		decimals: 9
	},
	{
		symbol: "MOONTOKEN",
		address: "0x81E4d494b85A24a58a6BA45c9B418b32a4E039de",
		decimals: 18
	},
	{
		symbol: "MRAT",
		address: "0x6D949f9297A522c0f97C232CC209a67Bd7CfA471",
		decimals: 9
	},
	{
		symbol: "MSC",
		address: "0x8C784C49097Dcc637b93232e15810D53871992BF",
		decimals: 18
	},
	{
		symbol: "MSS",
		address: "0xAcABD3f9b8F76fFd2724604185Fa5AFA5dF25aC6",
		decimals: 18
	},
	{
		symbol: "MTF",
		address: "0x95Ea82A63ee70f3cB141eC55ea4a37339746eB32",
		decimals: 8
	},
	{
		symbol: "NANA",
		address: "0x355ad7aBB7bdD53beC94c068F3ABbCB2E2571d0D",
		decimals: 9
	},
	{
		symbol: "NAUT",
		address: "0x05B339B0A346bF01f851ddE47a5d485c34FE220c",
		decimals: 8
	},
	{
		symbol: "NEAR",
		address: "0x1Fa4a73a3F0133f0025378af00236f3aBDEE5D63",
		decimals: 18
	},
	{
		symbol: "NEON",
		address: "0x94026f0227cE0c9611e8a228f114F9F19CC3Fa87",
		decimals: 18
	},
	{
		symbol: "NFTART",
		address: "0xF7844CB890F4C339c497aeAb599aBDc3c874B67A",
		decimals: 9
	},
	{
		symbol: "NFTL",
		address: "0x2f7b4C618Dc8E0bBA648E54cDADce3D8361f9816",
		decimals: 18
	},
	{
		symbol: "NIU",
		address: "0xfA90d5d5Ff08D9A06C9fDF89B4B22217b9dbc418",
		decimals: 18
	},
	{
		symbol: "NMX",
		address: "0xd32d01A43c869EdcD1117C640fBDcfCFD97d9d65",
		decimals: 18
	},
	{
		symbol: "NRV",
		address: "0x42F6f551ae042cBe50C739158b4f0CAC0Edb9096",
		decimals: 18
	},
	{
		symbol: "NUTS",
		address: "0x8893D5fA71389673C5c4b9b3cb4EE1ba71207556",
		decimals: 18
	},
	{
		symbol: "NVT",
		address: "0xf0E406c49C63AbF358030A299C0E00118C4C6BA5",
		decimals: 8
	},
	{
		symbol: "OCT",
		address: "0x49277cC5be56b519901E561096bfD416277b4F6d",
		decimals: 8
	},
	{
		symbol: "OCTA",
		address: "0x86c3E4FfAcdB3AF628ef985a518cd6ee22A22b28",
		decimals: 9
	},
	{
		symbol: "ONT",
		address: "0xFd7B3A77848f1C2D67E05E54d78d174a0C850335",
		decimals: 18
	},
	{
		symbol: "OPERAND",
		address: "0x7Cb2f28505E733F60C0db208AfaA321c792F6Cf4",
		decimals: 8
	},
	{
		symbol: "PALM",
		address: "0x9768E5b2d8e761905BC81Dfc554f9437A46CdCC6",
		decimals: 18
	},
	{
		symbol: "PASTA",
		address: "0xAB9D0Fae6eB062F2698C2D429a1BE9185A5D4F6E",
		decimals: 18
	},
	{
		symbol: "PAX",
		address: "0xb7F8Cd00C5A06c0537E2aBfF0b58033d02e5E094",
		decimals: 18
	},
	{
		symbol: "PAXG",
		address: "0x7950865a9140cB519342433146Ed5b40c6F210f7",
		decimals: 18
	},
	{
		symbol: "pCWS",
		address: "0xbcf39F0EDDa668C58371E519AF37CA705f2bFcbd",
		decimals: 18
	},
	{
		symbol: "PDO",
		address: "0x5BCcFbd33873A5498F8406146868eDdd5E998962",
		decimals: 18
	},
	{
		symbol: "PEAK",
		address: "0x630d98424eFe0Ea27fB1b3Ab7741907DFFEaAd78",
		decimals: 8
	},
	{
		symbol: "PET",
		address: "0x4d4e595d643dc61EA7FCbF12e4b1AAA39f9975B8",
		decimals: 18
	},
	{
		symbol: "PHO",
		address: "0xb9784C1633ef3b839563B988c323798634714368",
		decimals: 8
	},
	{
		symbol: "PIG",
		address: "0x8850D2c68c632E3B258e612abAA8FadA7E6958E5",
		decimals: 9
	},
	{
		symbol: "PIKA",
		address: "0x50D370cc853217099Bef3815FaaBfc563139eC2A",
		decimals: 18
	},
	{
		symbol: "PIN",
		address: "0xb21f4E20BF387bD207AdC0bA4e5169ACa3B253bf",
		decimals: 18
	},
	{
		symbol: "PNL",
		address: "0x16A62C9955ca1BA52e0ECA9ee4c3992204Eb0915",
		decimals: 18
	},
	{
		symbol: "PoFi",
		address: "0x461f6C9aE13a7daC7055C73fBF8daB529D667041",
		decimals: 18
	},
	{
		symbol: "POLAR",
		address: "0x1C545E9943CFd1b41E60a7917465911fa00Fc28C",
		decimals: 18
	},
	{
		symbol: "POLS",
		address: "0x7e624FA0E1c4AbFD309cC15719b7E2580887f570",
		decimals: 18
	},
	{
		symbol: "POODL",
		address: "0x4a68C250486a116DC8D6A0C5B0677dE07cc09C5D",
		decimals: 9
	},
	{
		symbol: "pOPIUM",
		address: "0x566cedD201F67E542A6851A2959c1a449a041945",
		decimals: 18
	},
	{
		symbol: "PROM",
		address: "0xaF53d56ff99f1322515E54FdDE93FF8b3b7DAFd5",
		decimals: 18
	},
	{
		symbol: "PROPEL",
		address: "0x9B44Df3318972bE845d83f961735609137C4C23c",
		decimals: 18
	},
	{
		symbol: "QUAM",
		address: "0x1AdE17B4B38B472B5259BbC938618226dF7b5Ca8",
		decimals: 18
	},
	{
		symbol: "Ramen",
		address: "0x4F47A0d15c1E53F3d94c069C7D16977c29F9CB6B",
		decimals: 18
	},
	{
		symbol: "RAMP",
		address: "0x8519EA49c997f50cefFa444d240fB655e89248Aa",
		decimals: 18
	},
	{
		symbol: "RAZE",
		address: "0x65e66a61D0a8F1e686C2D6083ad611a10D84D97A",
		decimals: 18
	},
	{
		symbol: "REEF",
		address: "0xF21768cCBC73Ea5B6fd3C687208a7c2def2d966e",
		decimals: 18
	},
	{
		symbol: "renBCH",
		address: "0xA164B067193bd119933e5C1e7877421FCE53D3E5",
		decimals: 8
	},
	{
		symbol: "renBTC",
		address: "0xfCe146bF3146100cfe5dB4129cf6C82b0eF4Ad8c",
		decimals: 8
	},
	{
		symbol: "renDGB",
		address: "0x31a0D1A199631D244761EEba67e8501296d2E383",
		decimals: 8
	},
	{
		symbol: "renDOGE",
		address: "0xc3fEd6eB39178A541D274e6Fc748d48f0Ca01CC3",
		decimals: 8
	},
	{
		symbol: "renFIL",
		address: "0xDBf31dF14B66535aF65AaC99C32e9eA844e14501",
		decimals: 18
	},
	{
		symbol: "renLUNA",
		address: "0xc4Ace9278e7E01755B670C0838c3106367639962",
		decimals: 6
	},
	{
		symbol: "renZEC",
		address: "0x695FD30aF473F2960e81Dc9bA7cB67679d35EDb7",
		decimals: 8
	},
	{
		symbol: "RSD",
		address: "0x61Ed1C66239d29Cc93C8597c6167159e8F69a823",
		decimals: 18
	},
	{
		symbol: "RUGBUST",
		address: "0x57bb0f40479D7Dd0caa67f2A579273A8e9c038Ee",
		decimals: 18
	},
	{
		symbol: "RUPEE",
		address: "0x7B0409A3A3f79bAa284035d48E1DFd581d7d7654",
		decimals: 18
	},
	{
		symbol: "SACT",
		address: "0x1bA8c21c623C843Cd4c60438d70E7Ad50f363fbb",
		decimals: 18
	},
	{
		symbol: "SAFEBTC",
		address: "0x380624A4a7e69dB1cA07deEcF764025FC224D056",
		decimals: 9
	},
	{
		symbol: "SAFEGALAXY",
		address: "0x6b51231c43B1604815313801dB5E9E614914d6e4",
		decimals: 9
	},
	{
		symbol: "SAFEMARS",
		address: "0x3aD9594151886Ce8538C1ff615EFa2385a8C3A88",
		decimals: 9
	},
	{
		symbol: "SAFEMOON",
		address: "0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3",
		decimals: 9
	},
	{
		symbol: "SAFEP",
		address: "0xA8c514D991F59baB02d32b68f04204cB89261c88",
		decimals: 8
	},
	{
		symbol: "SAFESPACE",
		address: "0xe1DB3d1eE5CfE5C6333BE96e6421f9Bd5b85c987",
		decimals: 9
	},
	{
		symbol: "SAFESTAR",
		address: "0x3C00F8FCc8791fa78DAA4A480095Ec7D475781e2",
		decimals: 9
	},
	{
		symbol: "SAIL",
		address: "0x8148b58393f00b4B379cBEb8018d3445E0b636a0",
		decimals: 18
	},
	{
		symbol: "sALPACA",
		address: "0x6F695Bd5FFD25149176629f8491A5099426Ce7a7",
		decimals: 18
	},
	{
		symbol: "SALT",
		address: "0x2849b1aE7E04A3D9Bc288673A92477CF63F28aF4",
		decimals: 18
	},
	{
		symbol: "sBDO",
		address: "0x0d9319565be7f53CeFE84Ad201Be3f40feAE2740",
		decimals: 18
	},
	{
		symbol: "SEA",
		address: "0xFB52FC1f90Dd2B070B9Cf7ad68ac3d68905643fa",
		decimals: 18
	},
	{
		symbol: "SFP",
		address: "0xD41FDb03Ba84762dD66a0af1a6C8540FF1ba5dfb",
		decimals: 18
	},
	{
		symbol: "SFUND",
		address: "0x477bC8d23c634C154061869478bce96BE6045D12",
		decimals: 18
	},
	{
		symbol: "SHAKE",
		address: "0xbA8A6Ef5f15ED18e7184f44a775060a6bF91d8d0",
		decimals: 18
	},
	{
		symbol: "SHIELD",
		address: "0x60b3BC37593853c04410c4F07fE4D6748245BF77",
		decimals: 18
	},
	{
		symbol: "SLME",
		address: "0x4fCfA6cC8914ab455B5b33Df916d90BFe70b6AB1",
		decimals: 18
	},
	{
		symbol: "SMDX",
		address: "0xEA8c5B9c537f3ebBcc8F2df0573F2d084E9e2BDb",
		decimals: 18
	},
	{
		symbol: "SMOKE",
		address: "0x5239fE1A8c0b6ece6AD6009D15315e02B1E7c4Ea",
		decimals: 18
	},
	{
		symbol: "SOAK",
		address: "0x849233FF1aea15D80EF658B2871664C9Ca994063",
		decimals: 18
	},
	{
		symbol: "SOUL",
		address: "0x67d012F731c23F0313CEA1186d0121779c77fcFE",
		decimals: 8
	},
	{
		symbol: "SOUP",
		address: "0x94F559aE621F1c810F31a6a620Ad7376776fe09E",
		decimals: 18
	},
	{
		symbol: "SOUPS",
		address: "0x69F27E70E820197A6e495219D9aC34C8C6dA7EeE",
		decimals: 18
	},
	{
		symbol: "SPACE",
		address: "0x0abd3E3502c15ec252f90F64341cbA74a24fba06",
		decimals: 18
	},
	{
		symbol: "SPARTA",
		address: "0xE4Ae305ebE1AbE663f261Bc00534067C80ad677C",
		decimals: 18
	},
	{
		symbol: "SPG",
		address: "0x3aabCf53A1930A42E18D938C019E83Ebee50a849",
		decimals: 9
	},
	{
		symbol: "SPOOL",
		address: "0x8cEAe826D99A8936bC5e2d2e1e7f79afA0408315",
		decimals: 18
	},
	{
		symbol: "SPORE",
		address: "0x77f6A5f1B7a2b6D6C322Af8581317D6Bb0a52689",
		decimals: 18
	},
	{
		symbol: "START",
		address: "0x31D0a7AdA4d4c131Eb612DB48861211F63e57610",
		decimals: 18
	},
	{
		symbol: "STAX",
		address: "0x0Da6Ed8B13214Ff28e9Ca979Dd37439e8a88F6c4",
		decimals: 18
	},
	{
		symbol: "STEEL",
		address: "0x9001eE054F1692feF3A48330cB543b6FEc6287eb",
		decimals: 18
	},
	{
		symbol: "STM",
		address: "0x90DF11a8ccE420675e73922419e3f4f3Fe13CCCb",
		decimals: 18
	},
	{
		symbol: "SUPER",
		address: "0x51BA0b044d96C3aBfcA52B64D733603CCC4F0d4D",
		decimals: 18
	},
	{
		symbol: "SWAMP",
		address: "0xc5A49b4CBe004b6FD55B30Ba1dE6AC360FF9765d",
		decimals: 18
	},
	{
		symbol: "SWGb",
		address: "0xE40255C5d7fa7ceEc5120408C78C787CECB4cfdb",
		decimals: 18
	},
	{
		symbol: "SWIRL",
		address: "0x52d86850bc8207b520340B7E39cDaF22561b9E56",
		decimals: 18
	},
	{
		symbol: "SWTH",
		address: "0x250b211EE44459dAd5Cd3bCa803dD6a7EcB5d46C",
		decimals: 8
	},
	{
		symbol: "SXP",
		address: "0x47BEAd2563dCBf3bF2c9407fEa4dC236fAbA485A",
		decimals: 18
	},
	{
		symbol: "TACO",
		address: "0x9066e87Bac891409D690cfEfA41379b34af06391",
		decimals: 18
	},
	{
		symbol: "TAO",
		address: "0xf0443834B7b21104b7102Edbe8F9ec06204Cd395",
		decimals: 9
	},
	{
		symbol: "TBC",
		address: "0xeAF7D8395CCE52DAef138d39a1CEfA51b97C15aE",
		decimals: 18
	},
	{
		symbol: "TCT",
		address: "0xCA0a9Df6a8cAD800046C1DDc5755810718b65C44",
		decimals: 18
	},
	{
		symbol: "TFF",
		address: "0x2d69c55baEcefC6ec815239DA0a985747B50Db6E",
		decimals: 18
	},
	{
		symbol: "TINFOIL Token",
		address: "0xaADeB3d2170d391aBb1a12e3Da69cC93D880A31b",
		decimals: 18
	},
	{
		symbol: "TIT",
		address: "0xe9C97e26dE6F4109E041736867789E789dc904d3",
		decimals: 18
	},
	{
		symbol: "TKO",
		address: "0x9f589e3eabe42ebC94A44727b3f3531C0c877809",
		decimals: 18
	},
	{
		symbol: "TLM",
		address: "0x2222227E22102Fe3322098e4CBfE18cFebD57c95",
		decimals: 4
	},
	{
		symbol: "TNDR",
		address: "0x7Cc46141AB1057b1928de5Ad5Ee78Bb37eFC4868",
		decimals: 18
	},
	{
		symbol: "TOOLS",
		address: "0x1311b352467d2B5c296881BaDEA82850bcd8f886",
		decimals: 18
	},
	{
		symbol: "TORJ",
		address: "0xECD2376a8C5Ece76323282441a1b935Bbcb45Ec2",
		decimals: 3
	},
	{
		symbol: "TPT",
		address: "0xECa41281c24451168a37211F0bc2b8645AF45092",
		decimals: 4
	},
	{
		symbol: "TRADE",
		address: "0x7af173F350D916358AF3e218Bdf2178494Beb748",
		decimals: 18
	},
	{
		symbol: "TRDG",
		address: "0x92a42Db88Ed0F02c71D439e55962Ca7CAB0168b5",
		decimals: 9
	},
	{
		symbol: "TREAT",
		address: "0xac0C7d9B063eD2C0946982dDB378e03886C064E6",
		decimals: 18
	},
	{
		symbol: "TREE",
		address: "0x039471b9e8a86B977aaeb5eC4182Cf3866f436B0",
		decimals: 18
	},
	{
		symbol: "TUSD",
		address: "0x14016E85a25aeb13065688cAFB43044C2ef86784",
		decimals: 18
	},
	{
		symbol: "TWT",
		address: "0x4B0F1812e5Df2A09796481Ff14017e6005508003",
		decimals: 18
	},
	{
		symbol: "TXL",
		address: "0x1FFD0b47127fdd4097E54521C9E2c7f0D66AafC5",
		decimals: 18
	},
	{
		symbol: "TYPH",
		address: "0x4090e535F2e251F5F88518998B18b54d26B3b07c",
		decimals: 18
	},
	{
		symbol: "UBU",
		address: "0xd2DdFba7bb12f6e70c2AAB6B6bf9EdaEf42ed22F",
		decimals: 18
	},
	{
		symbol: "UBXT",
		address: "0xBbEB90cFb6FAFa1F69AA130B7341089AbeEF5811",
		decimals: 18
	},
	{
		symbol: "UNFI",
		address: "0xA7cA04F7602cD7A939d3E4827F442f48cF8E9daD",
		decimals: 18
	},
	{
		symbol: "UNI",
		address: "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1",
		decimals: 18
	},
	{
		symbol: "UNICORN",
		address: "0xe3E1FabEaBD48491bD6902B0c32FDEee8D2Ff12b",
		decimals: 18
	},
	{
		symbol: "UNIF",
		address: "0xce5347fdd503f25f8428151A274544A5bD1Bd8cA",
		decimals: 9
	},
	{
		symbol: "USDC",
		address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
		decimals: 18
	},
	{
		symbol: "USDT",
		address: "0x55d398326f99059fF775485246999027B3197955",
		decimals: 18
	},
	{
		symbol: "UST",
		address: "0x23396cF899Ca06c4472205fC903bDB4de249D6fC",
		decimals: 18
	},
	{
		symbol: "UTL",
		address: "0x3fc20a9672b321e66083896B40a567D5Cc65cfAF",
		decimals: 18
	},
	{
		symbol: "vADA",
		address: "0x9A0AF7FDb2065Ce470D72664DE73cAE409dA28Ec",
		decimals: 8
	},
	{
		symbol: "VAI",
		address: "0x4BD17003473389A42DAF6a0a729f6Fdb328BbBd7",
		decimals: 18
	},
	{
		symbol: "VANCAT",
		address: "0x8597ba143AC509189E89aaB3BA28d661A5dD9830",
		decimals: 0
	},
	{
		symbol: "vBCH",
		address: "0x5F0388EBc2B94FA8E123F404b79cCF5f40b29176",
		decimals: 8
	},
	{
		symbol: "vBETH",
		address: "0x972207A639CC1B374B893cc33Fa251b55CEB7c07",
		decimals: 8
	},
	{
		symbol: "vBNB",
		address: "0xA07c5b74C9B40447a954e1466938b865b6BBea36",
		decimals: 8
	},
	{
		symbol: "vBSWAP",
		address: "0x4f0ed527e8A95ecAA132Af214dFd41F30b361600",
		decimals: 18
	},
	{
		symbol: "vBTC",
		address: "0x882C173bC7Ff3b7786CA16dfeD3DFFfb9Ee7847B",
		decimals: 8
	},
	{
		symbol: "vBUSD",
		address: "0x95c78222B3D6e262426483D42CfA53685A67Ab9D",
		decimals: 8
	},
	{
		symbol: "vDAI",
		address: "0x334b3eCB4DCa3593BCCC3c7EBD1A1C1d1780FBF1",
		decimals: 8
	},
	{
		symbol: "vDOT",
		address: "0x1610bc33319e9398de5f57B33a5b184c806aD217",
		decimals: 8
	},
	{
		symbol: "vETH",
		address: "0xf508fCD89b8bd15579dc79A6827cB4686A3592c8",
		decimals: 8
	},
	{
		symbol: "vFIL",
		address: "0xf91d58b5aE142DAcC749f58A49FCBac340Cb0343",
		decimals: 8
	},
	{
		symbol: "VGD",
		address: "0xFd91Fa8fab5cA11569E256fa8844Bc2abecc331D",
		decimals: 18
	},
	{
		symbol: "VIDT",
		address: "0x3f515f0a8e93F2E2f891ceeB3Db4e62e202d7110",
		decimals: 18
	},
	{
		symbol: "VIKING",
		address: "0x896eDE222D3f7f3414e136a2791BDB08AAa25Ce0",
		decimals: 18
	},
	{
		symbol: "vLINK",
		address: "0x650b940a1033B8A1b1873f78730FcFC73ec11f1f",
		decimals: 8
	},
	{
		symbol: "vLTC",
		address: "0x57A5297F2cB2c0AaC9D554660acd6D385Ab50c6B",
		decimals: 8
	},
	{
		symbol: "vSXP",
		address: "0x2fF3d0F6990a40261c66E1ff2017aCBc282EB6d0",
		decimals: 8
	},
	{
		symbol: "vUSDC",
		address: "0xecA88125a5ADbe82614ffC12D0DB554E2e2867C8",
		decimals: 8
	},
	{
		symbol: "vUSDT",
		address: "0xfD5840Cd36d94D7229439859C0112a4185BC0255",
		decimals: 8
	},
	{
		symbol: "vXRP",
		address: "0xB248a295732e0225acd3337607cc01068e3b9c10",
		decimals: 8
	},
	{
		symbol: "vXVS",
		address: "0x151B1e2635A717bcDc836ECd6FbB62B674FE3E1D",
		decimals: 8
	},
	{
		symbol: "Warden",
		address: "0x0fEAdcC3824E7F3c12f40E324a60c23cA51627fc",
		decimals: 18
	},
	{
		symbol: "WATCH",
		address: "0x7A9f28EB62C791422Aa23CeAE1dA9C847cBeC9b0",
		decimals: 18
	},
	{
		symbol: "WBNB",
		address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
		decimals: 18
	},
	{
		symbol: "WENMOON",
		address: "0xb93ba7DC61ECFced69067151FC00C41cA369A797",
		decimals: 7
	},
	{
		symbol: "WEX",
		address: "0xa9c41A46a6B3531d28d5c32F6633dd2fF05dFB90",
		decimals: 18
	},
	{
		symbol: "WHIRL",
		address: "0x7f479d78380Ad00341fdD7322fE8AEf766e29e5A",
		decimals: 18
	},
	{
		symbol: "WOOP",
		address: "0x8b303d5BbfBbf46F1a4d9741E491e06986894e18",
		decimals: 18
	},
	{
		symbol: "WOW",
		address: "0x4DA996C5Fe84755C80e108cf96Fe705174c5e36A",
		decimals: 18
	},
	{
		symbol: "wSOTE",
		address: "0x541E619858737031A1244A5d0Cd47E5ef480342c",
		decimals: 18
	},
	{
		symbol: "XBN",
		address: "0x547CBE0f0c25085e7015Aa6939b28402EB0CcDAC",
		decimals: 18
	},
	{
		symbol: "XCUR",
		address: "0x708C671Aa997da536869B50B6C67FA0C32Ce80B2",
		decimals: 8
	},
	{
		symbol: "XED",
		address: "0x5621b5A3f4a8008c4CCDd1b942B121c8B1944F1f",
		decimals: 18
	},
	{
		symbol: "XEND",
		address: "0x4a080377f83D669D7bB83B3184a8A5E61B500608",
		decimals: 18
	},
	{
		symbol: "xMARK",
		address: "0x26A5dFab467d4f58fB266648CAe769503CEC9580",
		decimals: 9
	},
	{
		symbol: "XRP",
		address: "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE",
		decimals: 18
	},
	{
		symbol: "XSPACE",
		address: "0xAD90c05BC51672eEdfeE36E58b3ff1A78bbC146d",
		decimals: 9
	},
	{
		symbol: "XVS",
		address: "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63",
		decimals: 18
	},
	{
		symbol: "XWIN",
		address: "0xd88ca08d8eec1E9E09562213Ae83A7853ebB5d28",
		decimals: 18
	},
	{
		symbol: "YETU",
		address: "0x6652048Fa5E66ed63a0225FFd7C82e106b0Aa18b",
		decimals: 18
	},
	{
		symbol: "YFI",
		address: "0x88f1A5ae2A3BF98AEAF342D26B30a79438c9142e",
		decimals: 18
	},
	{
		symbol: "YFII",
		address: "0x7F70642d88cf1C4a3a7abb072B53B929b653edA5",
		decimals: 18
	},
	{
		symbol: "yPANDA",
		address: "0x9806aec346064183b5cE441313231DFf89811f7A",
		decimals: 8
	},
	{
		symbol: "YVS",
		address: "0x47c1C7B9D7941A7265D123DCfb100D8FB5348213",
		decimals: 18
	},
	{
		symbol: "ZD",
		address: "0x1c213179C2c08906fB759878860652a61727Ed14",
		decimals: 18
	},
	{
		symbol: "ZEC",
		address: "0x1Ba42e5193dfA8B03D15dd1B86a3113bbBEF8Eeb",
		decimals: 18
	},
	{
		symbol: "ZEFI",
		address: "0x0288D3E353fE2299F11eA2c2e1696b4A648eCC07",
		decimals: 18
	},
	{
		symbol: "ZERO",
		address: "0x1f534d2B1ee2933f1fdF8e4b63A44b2249d77EAf",
		decimals: 18
	},
	{
		symbol: "ZIL",
		address: "0xb86AbCb37C3A4B64f74f59301AFF131a1BEcC787",
		decimals: 12
	},
	{
		symbol: "zSEED",
		address: "0x5cd50Aae14E14B3fdF3fF13c7A40e8cf5ae8b0A5",
		decimals: 18
	}
];

var BSC = {
  name: 'BSC',
  name_long: 'Binance Smart Chain',
  homePage: 'https://www.binance.org/en/smartChain',
  blockExplorerTX: 'https://bscscan.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://bscscan.com/address/[[address]]',
  chainID: 56,
  tokens: tokens$2,
  contracts: [],
  currencyName: 'BNB'
};

var tokens$1 = [
	{
		symbol: "BEC",
		address: "0x085fb4f24031EAedbC2B611AA528f22343eB52Db",
		decimals: 8
	},
	{
		symbol: "PLAY",
		address: "0x5acE17f87c7391E5792a7683069A8025B83bbd85",
		decimals: 0
	},
	{
		symbol: "UVC",
		address: "0x76d0184CF511788032A74a1FB91146e63F43dd53",
		decimals: 5
	},
	{
		symbol: "UVCX",
		address: "0xd6dF0C579f2A65049a893fDaEC9fCE098CC19F87",
		decimals: 18
	}
];

var ETC = {
  name: 'ETC',
  name_long: 'Ethereum Classic',
  homePage: 'https://ethereumclassic.org/',
  blockExplorerTX: 'https://blockscout.com/etc/mainnet/tx/[[txHash]]',
  blockExplorerAddr: 'https://blockscout.com/etc/mainnet/address/[[address]]',
  chainID: 61,
  tokens: tokens$1,
  contracts: [],
  currencyName: 'ETC'
};

var RIN = {
  name: 'RIN',
  name_long: 'Rinkeby',
  homePage: 'https://www.rinkeby.io/',
  blockExplorerTX: 'https://rinkeby.etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://rinkeby.etherscan.io/address/[[address]]',
  chainID: 4,
  tokens: [],
  contracts: [],
  currencyName: 'RIN'
};

var tokens = [
	{
		symbol: "OMG",
		address: "0xe1E2ec9a85C607092668789581251115bCBD20de",
		decimals: 18
	},
	{
		symbol: "USDT",
		address: "0x5DE1677344D3Cb0D7D465c10b72A8f60699C062d",
		decimals: 6
	},
	{
		symbol: "DAI",
		address: "0xf74195Bb8a5cf652411867c5C2C5b8C2a402be35",
		decimals: 18
	},
	{
		symbol: "USDC",
		address: "0x66a2A913e447d6b4BF33EFbec43aAeF87890FBbc",
		decimals: 6
	},
	{
		symbol: "WBTC",
		address: "0xdc0486f8bf31DF57a952bcd3c1d3e166e3d9eC8b",
		decimals: 8
	},
	{
		symbol: "REPv2",
		address: "0x8b5B1E971862015bc058234FC11ce6C4a4c536dD",
		decimals: 18
	},
	{
		symbol: "BAT",
		address: "0xc0C16dF1ee7dcEFb88C55003C49F57AA416A3578",
		decimals: 18
	},
	{
		symbol: "ZRX",
		address: "0xf135f13Db3B114107dCB0B32B6c9e10fFF5a6987",
		decimals: 18
	},
	{
		symbol: "SUSHI",
		address: "0x5fFccc55C0d2fd6D3AC32C26C020B3267e933F1b",
		decimals: 18
	},
	{
		symbol: "LINK",
		address: "0xD5D5030831eE83e22a2C9a5cF99931A50c676433",
		decimals: 18
	},
	{
		symbol: "UNI",
		address: "0xDBDE1347fED5dC03C74059010D571a16417d307e",
		decimals: 18
	},
	{
		symbol: "DODO",
		address: "0x572c5B5BF34f75FB62c39b9BFE9A75bb0bb47984",
		decimals: 18
	}
];

var BOBA = {
  name: 'Boba',
  name_long: 'Boba',
  homePage: 'https://boba.network',
  blockExplorerTX: 'https://blockexplorer.boba.network/tx/[[txHash]]',
  blockExplorerAddr: 'https://blockexplorer.boba.network/address/[[address]]',
  chainID: 288,
  tokens: tokens,
  contracts: [],
  currencyName: 'oETH'
};

var Networks = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ETH: ETH,
  GOERLI: GOERLI,
  KOV: KOV,
  ROP: ROP,
  MATIC: MATIC,
  BSC: BSC,
  ETC: ETC,
  RIN: RIN,
  BOBA: BOBA
});

var APP_STORE_LINK = IOS_LINK;
var PLAY_STORE_LINK = ANDROID_LINK;
var SCHEMA_BASE = 'mewwallet://dapps';
function mobileCheck() {
  var check = false;

  (function (a) {
    // eslint-disable-next-line
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || // eslint-disable-next-line
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);

  return check;
}

function iOS() {
  return ['iPhone Simulator', 'iPhone', 'iPod'].includes(navigator.platform);
}

function nativeCheck() {
  return new Promise(function (resolve) {
    try {
      if (mobileCheck()) {
        var fallbackToStore = function fallbackToStore() {
          if (iOS()) {
            window.location.replace(APP_STORE_LINK);
          } else {
            window.location.replace(PLAY_STORE_LINK);
          }

          resolve(false);
        };

        var openApp = function openApp() {
          var loc = window.location.origin;
          var url = encodeURIComponent(loc);
          var scheme = "".concat(SCHEMA_BASE, "?url=").concat(url);
          window.location.replace(scheme);
        };

        if (iOS()) {
          return resolve(true);
        }

        var triggerAppOpen = function triggerAppOpen() {
          openApp();
          setTimeout(fallbackToStore, 1000);
        };

        triggerAppOpen();
      } else {
        resolve(true);
      }
    } catch (e) {
      resolve(true);
    }
  });
}

var debugConnectionState = debugLogger__default['default']('MEWconnect:connection-state');
var debugErrors = debugLogger__default['default']('MEWconnectError');
var state = {
  wallet: null
};
var eventHub = new EventEmitter__default['default']();
var popUpCreator = {};

var Integration = /*#__PURE__*/function (_EventEmitter) {
  _inherits(Integration, _EventEmitter);

  var _super = _createSuper(Integration);

  function Integration() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Integration);

    _this = _super.call(this);

    if (window.ethereum) {
      if (window.ethereum.isMewConnect || window.ethereum.isTrust) {
        _this.runningInApp = true;
        state.web3Provider = window.ethereum;
      } else {
        _this.runningInApp = false;
      }
    } else {
      _this.runningInApp = false;
    }

    _this.windowClosedError = options.windowClosedError || false;
    _this.subscriptionNotFoundNoThrow = options.subscriptionNotFoundNoThrow || true;
    _this.CHAIN_ID = options.chainId || 1;
    _this.RPC_URL = options.rpcUrl || false;
    _this.noUrlCheck = options.noUrlCheck || false;
    _this.newNetworks = options.newNetworks || [];
    _this.knownNetworks = new Set();
    _this.lastHash = null;
    _this.initiator = new MewConnectInitiator();
    _this.popUpHandler = new PopUpHandler();
    _this.connectionState = false;
    _this.chainIdMapping = _this.createChainMapping(_this.newNetworks);
    _this.returnPromise = null;
    _this.disconnectComplete = false;
    popUpCreator = new PopUpCreator();
    return _this;
  }

  _createClass(Integration, [{
    key: "closeDataChannelForDemo",
    value: function closeDataChannelForDemo() {
      var connection = state.wallet.getConnection();
      connection.webRtcCommunication.closeDataChannelForDemo();
    }
  }, {
    key: "formatNewNetworks",
    value: function formatNewNetworks(newNetwork) {
      return {
        name: newNetwork.name,
        name_long: newNetwork.name_long || newNetwork.name,
        homePage: newNetwork.homePage || '',
        blockExplorerTX: newNetwork.blockExplorerTX || '',
        blockExplorerAddr: newNetwork.blockExplorerAddr || '',
        chainID: newNetwork.chainId ? newNetwork.chainId : newNetwork.chainID ? newNetwork.chainID : this.CHAIN_ID,
        tokens: newNetwork.tokens || [],
        contracts: [],
        currencyName: newNetwork.currencyName || newNetwork.name
      };
    }
  }, {
    key: "createChainMapping",
    value: function createChainMapping(newNetworks) {
      var _this2 = this;

      var networks = Networks;

      try {
        var additional = newNetworks.map(this.formatNewNetworks).reduce(function (acc, curr) {
          acc[curr.name] = curr;
        }, {});
        networks = Object.assign(networks, additional);
        this.networks = networks;
      } catch (e) {
        console.error(e);
      }

      return Object.keys(networks).reduce(function (acc, curr) {
        acc.push({
          name: networks[curr].name_long === 'Ethereum' ? 'mainnet' : networks[curr].name_long.toLowerCase(),
          chainId: networks[curr].chainID,
          key: networks[curr].name
        });

        _this2.knownNetworks.add(networks[curr].chainID);

        return acc;
      }, []);
    }
  }, {
    key: "showNotifierDemo",
    value: function showNotifierDemo(details) {
      if (details === 'sent') {
        this.popUpHandler.showNotice({
          type: messageConstants.sent,
          hash: '0x543284135d7821e0271272df721101420003cb0e43e8c2e2eed1451cdb571fa4',
          explorerPath: state.network.blockExplorerTX
        });
      } else {
        this.popUpHandler.showNotice(details);
      }
    }
  }, {
    key: "showConnectedNotice",
    value: function showConnectedNotice() {
      this.popUpHandler.showConnectedNotice();
    }
  }, {
    key: "enable",
    value: function enable() {
      var _this3 = this;

      popUpCreator.on('fatalError', function () {
        createWallet.setConnectionState(DISCONNECTED);
      });

      if (this.runningInApp) {
        return new Promise(function (resolve) {
          state.web3Provider.request({
            method: 'eth_requestAccounts',
            params: []
          }).then(function (address) {
            eventHub.emit('accountsChanged', address);

            _this3.popUpHandler.showConnectedNotice();

            createWallet.setConnectionState(CONNECTED);
            resolve(address);
          })["catch"](console.error);
        });
      }

      return nativeCheck().then(function (res) {
        if (res) {
          if (typeof popUpCreator.popupWindowOpen === 'boolean') {
            popUpCreator.showDialog();
          }

          if (createWallet.getConnectionState() === DISCONNECTED) {
            _this3.returnPromise = _this3.enabler();
          }

          return _this3.returnPromise;
        }
      });
    }
  }, {
    key: "enabler",
    value: function enabler() {
      var _this4 = this;

      // eslint-disable-next-line
      return new Promise( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(!state.wallet && createWallet.getConnectionState() === DISCONNECTED)) {
                    _context.next = 16;
                    break;
                  }

                  createWallet.setConnectionState(CONNECTING);
                  _this4.connectionState = CONNECTING;
                  debugConnectionState(createWallet.getConnectionState());
                  popUpCreator.setWindowClosedListener(function () {
                    if (_this4.windowClosedError) {
                      reject('ERROR: popup window closed');
                    }

                    _this4.emit('popupWindowClosed');

                    popUpCreator.popupWindowOpen = null;
                  });
                  state.knownHashes = [];
                  _context.next = 8;
                  return createWallet(state, popUpCreator, _this4.popUpHandler);

                case 8:
                  state.wallet = _context.sent;
                  console.log("Using MEWconnect v".concat(packageJson.version));

                  _this4.popUpHandler.showConnectedNotice();

                  _this4.popUpHandler.hideNotifier();

                  _this4.createDisconnectNotifier();

                  _this4.createCommunicationError();

                  popUpCreator.popupWindowOpen = null;
                  debugConnectionState(createWallet.getConnectionState());

                case 16:
                  if (!(state.web3 && state.wallet)) {
                    _context.next = 19;
                    break;
                  }

                  _context.next = 19;
                  return state.web3.eth.getTransactionCount(state.wallet.getAddressString());

                case 19:
                  if (state.web3Provider && state.wallet) {
                    if (state.web3Provider.accountsChanged) {
                      state.web3Provider.emit('accountsChanged', [state.wallet.getAddressString()]);
                    }

                    eventHub.emit('accounts_available', [state.wallet.getAddressString()]);
                  }

                  resolve([state.wallet.getAddressString()]);

                case 21:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "identifyChain",
    value: function identifyChain(check) {
      if (typeof check === 'number') {
        var result = this.chainIdMapping.find(function (value) {
          return value.chainId === check;
        });
        if (result) return result;
      } else if (typeof check === 'string') {
        var _result = this.chainIdMapping.find(function (value) {
          return value.chainId.toString() == check.toLowerCase();
        });

        if (_result) return _result;
        _result = this.chainIdMapping.find(function (value) {
          return value.name.toLowerCase() == check.toLowerCase();
        });
        if (_result) return _result;
        _result = this.chainIdMapping.find(function (value) {
          return value.key.toLowerCase() == check.toLowerCase();
        });
        if (_result) return _result;
      }

      return 'ETH';
    }
  }, {
    key: "makeWeb3Provider",
    value: function makeWeb3Provider() {
      var CHAIN_ID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.CHAIN_ID;
      var RPC_URL = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.RPC_URL;
      var web3Provider;

      try {
        if (this.runningInApp) {
          if (state.web3Provider) {
            web3Provider = state.web3Provider;
          } else {
            web3Provider = window.ethereum;
          }
        } else {
          if (this.knownNetworks.has(CHAIN_ID)) {
            var chain = this.identifyChain(CHAIN_ID || 1);
            state.network = this.networks[chain.key];
          } else {
            throw new Error('Unknown network, please add your network to the constructor');
          }

          var hostUrl = url__default['default'].parse(RPC_URL);
          var options = {
            subscriptionNotFoundNoThrow: this.subscriptionNotFoundNoThrow
          };

          if (!/[wW]/.test(hostUrl.protocol) && !/[htpHTP]/.test(hostUrl.protocol)) {
            throw Error('Invalid rpc endpoint supplied to MEWconnect during setup');
          }

          var parsedUrl = "".concat(hostUrl.protocol, "//").concat(hostUrl.hostname ? hostUrl.hostname : hostUrl.host).concat(hostUrl.port ? ':' + hostUrl.port : '').concat(hostUrl.pathname ? hostUrl.pathname : '');
          state.enable = this.enable.bind(this);
          web3Provider = new MEWProvider(parsedUrl, options, {
            state: state
          }, eventHub);
        }

        state.enable = this.enable.bind(this);
        web3Provider.close = this.disconnect; //.bind(this);

        web3Provider.disconnect = this.disconnect.bind(this);
        state.web3Provider = web3Provider;
        state.web3 = new web3__default['default'](web3Provider);

        if (!this.runningInApp) {
          state.web3.currentProvider.sendAsync = state.web3.currentProvider.send;
        }

        this.setupListeners();
        web3Provider.enable = this.enable.bind(this);
        web3Provider.isMewConnect = true;
        web3Provider.isMEWconnect = true;
        web3Provider.name = 'MewConnect';
        return web3Provider;
      } catch (e) {
        debugErrors('makeWeb3Provider ERROR');
        console.error(e);
      }
    }
  }, {
    key: "createDisconnectNotifier",
    value: function createDisconnectNotifier() {
      var _this5 = this;

      var connection = state.wallet.getConnection();
      debugConnectionState(createWallet.getConnectionState());
      connection.webRtcCommunication.on(connection.lifeCycle.RtcDisconnectEvent, function () {
        try {
          if (_this5.popupCreator) _this5.popUpHandler.showNotice(messageConstants.disconnect);
          createWallet.setConnectionState(connection.lifeCycle.disconnected);

          if (state.wallet !== null) {
            _this5.emit('close');

            _this5.emit('disconnect');
          }

          if (state.wallet !== null && state.web3Provider) {
            state.web3Provider.emit('disconnect');
            state.web3Provider.emit('close');
          }

          if (state.wallet !== null && state.web3Provider.disconnectCallback) {
            state.web3Provider.disconnectCallback();
          }

          if (state.wallet !== null && state.web3Provider.closeCallback) {
            state.web3Provider.closeCallback();
          }

          state.wallet = null;

          _this5.emit(DISCONNECTED);

          _this5.emit('close');

          _this5.emit('disconnect');
        } catch (e) {
          if (_this5.popUpHandler) {
            _this5.popUpHandler.showNotice(messageConstants.disconnectError);
          }
        }
      });
      connection.webRtcCommunication.on(connection.lifeCycle.RtcClosedEvent, function () {
        try {
          _this5.popUpHandler.showNotice(messageConstants.disconnect);

          createWallet.setConnectionState(connection.lifeCycle.disconnected);

          if (state.wallet !== null) {
            _this5.emit('close');

            _this5.emit('disconnect');
          }

          if (state.wallet !== null && state.web3Provider) {
            state.web3Provider.emit('disconnect');
            state.web3Provider.emit('close');
          }

          if (state.wallet !== null && state.web3Provider.disconnectCallback) {
            state.web3Provider.disconnectCallback();
          }

          if (state.wallet !== null && state.web3Provider.closeCallback) {
            state.web3Provider.closeCallback();
          }

          state.wallet = null;

          _this5.emit(connection.lifeCycle.disconnected);
        } catch (e) {
          if (_this5.popUpHandler) {
            _this5.popUpHandler.showNotice(messageConstants.disconnectError);
          }
        }
      });
    }
  }, {
    key: "createCommunicationError",
    value: function createCommunicationError() {
      var _this6 = this;

      var connection = state.wallet.getConnection();
      connection.webRtcCommunication.on(connection.lifeCycle.decryptError, function () {
        if (_this6.popupCreator) _this6.popUpHandler.showNoticePersistentEnter(messageConstants.communicationError);
      });
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      try {
        if (this.runningInApp) {
          return true;
        }

        if (state.wallet) {
          var connection = state.wallet.getConnection();
          connection.disconnectRTC();
          createWallet.setConnectionState(DISCONNECTED);
          return true;
        }

        state = {}; // eslint-disable-next-line

        console.warn('No connected wallet found');
        return true;
      } catch (e) {
        debugErrors('disconnect ERROR');

        if (this.popUpHandler) {
          this.popUpHandler.showNotice(messageConstants.disconnectError);
        } // eslint-disable-next-line


        console.error(e);
        return false;
      }
    }
  }, {
    key: "sign",
    value: function sign(tx) {
      if (state.wallet) {
        return state.wallet.signTransaction(tx);
      }
    }
  }, {
    key: "setupListeners",
    value: function setupListeners() {
      var _this7 = this;

      eventHub.on(EventNames.SHOW_TX_CONFIRM_MODAL, function (tx, resolve) {
        // this.responseFunction = resolve;
        if (!state.wallet) {
          _this7.popUpHandler.showNoticePersistentEnter(messageConstants.notConnected);
        } else {
          _this7.popUpHandler.showNoticePersistentEnter(messageConstants.approveTx);

          state.wallet.signTransaction(tx).then(function (_response) {
            if (!_response) return;

            if (!state.knownHashes.includes(_response.tx.hash)) {
              state.knownHashes.push(_response.tx.hash);

              _this7.popUpHandler.showNoticePersistentExit();

              resolve(_response);
            }
          })["catch"](function (err) {
            _this7.popUpHandler.showNoticePersistentExit();

            if (err.reject) {
              _this7.popUpHandler.noShow();

              setTimeout(function () {
                _this7.popUpHandler.showNotice('decline');
              }, 250);
            } else {
              debugErrors('sign transaction ERROR');
              state.wallet.errorHandler(err);
            }

            resolve(err);
          });
        }
      });
      eventHub.on(EventNames.SHOW_TX_SIGN_MODAL, function (tx, resolve) {
        // this.responseFunction = resolve;
        if (!state.wallet) {
          _this7.popUpHandler.showNoticePersistentEnter(messageConstants.notConnected);
        } else {
          _this7.popUpHandler.showNoticePersistentEnter(messageConstants.approveTx);

          state.wallet.signTransaction(tx).then(function (_response) {
            if (!state.knownHashes.includes(_response.tx.hash)) {
              state.knownHashes.push(_response.tx.hash);

              _this7.popUpHandler.showNoticePersistentExit();

              resolve(_response);
            }
          })["catch"](function (err) {
            _this7.popUpHandler.showNoticePersistentExit();

            if (err.reject) {
              _this7.popUpHandler.noShow();

              setTimeout(function () {
                _this7.popUpHandler.showNotice('decline');
              }, 250);
            } else {
              debugErrors('sign transaction ERROR');
              state.wallet.errorHandler(err);
            }

            resolve(err);
          });
        }
      });
      eventHub.on(EventNames.WALLET_NOT_CONNECTED, function () {
        if (!state.wallet) {
          _this7.popUpHandler.showNoticePersistentEnter(messageConstants.notConnected);
        }
      });
      eventHub.on(EventNames.ERROR_NOTIFY, function (err) {
        if (err && err.message) {
          _this7.popUpHandler.showNotice(err.message);
        }
      });
      eventHub.on(EventNames.SHOW_MSG_CONFIRM_MODAL, function (msg, resolve) {
        if (!state.wallet) {
          _this7.popUpHandler.showNoticePersistentEnter(messageConstants.notConnected);
        } else {
          _this7.popUpHandler.showNoticePersistentEnter(messageConstants.signMessage);

          state.wallet.signMessage(msg).then(function (result) {
            resolve(result);
          })["catch"](function (err) {
            if (err.reject) {
              _this7.popUpHandler.noShow();

              setTimeout(function () {
                _this7.popUpHandler.showNotice(messageConstants.declineMessage);
              }, 250);
            } else {
              debugErrors('sign message ERROR');
              state.wallet.errorHandler(err);
            }

            resolve(err);
          });
        }
      }); // TODO: Is this getting used???

      eventHub.on('showSendSignedTx', function (tx, resolve) {
        _this7.popUpHandler.showNotice(messageConstants.approveTx);

        var newTx = new ethereumjsTx.Transaction(tx);
        _this7.responseFunction = resolve;
        _this7.signedTxObject = {
          rawTransaction: tx,
          tx: {
            to: "0x".concat(newTx.to.toString('hex')),
            from: "0x".concat(newTx.from.toString('hex')),
            value: "0x".concat(newTx.value.toString('hex')),
            gasPrice: "0x".concat(newTx.gasPrice.toString('hex')),
            gas: "0x".concat(newTx.gas.toString('hex')),
            gasLimit: "0x".concat(newTx.gasLimit.toString('hex')),
            data: "0x".concat(newTx.data.toString('hex')),
            nonce: "0x".concat(newTx.nonce.toString('hex')),
            v: "0x".concat(newTx.v.toString('hex')),
            r: "0x".concat(newTx.r.toString('hex')),
            s: "0x".concat(newTx.s.toString('hex'))
          }
        };

        _this7.responseFunction(_this7.signedTxObject);
      });
      eventHub.on('Hash', function (hash) {
        _this7.lastHash = hash;

        _this7.popUpHandler.showNotice({
          type: messageConstants.sent,
          hash: hash,
          explorerPath: state.network.blockExplorerTX
        }, 10000);
      });
      eventHub.on('Receipt', function () {
        state.knownHashes = [];
        _this7.lastHash = null;

        _this7.popUpHandler.showNotice(messageConstants.complete);
      });
      eventHub.on('Error', function () {
        state.knownHashes = [];
        debugErrors('SendTx:Error ERROR');

        if (_this7.lastHash !== null) {
          _this7.popUpHandler.showNotice({
            type: messageConstants.failed,
            hash: _this7.lastHash,
            explorerPath: state.network.blockExplorerTX
          }, 10000);
        } else {
          _this7.popUpHandler.showNotice(messageConstants.error);
        }
      });
      eventHub.on(EventNames.GET_ENCRYPTED_PUBLIC_KEY, function (params, resolve) {
        if (!state.wallet) {
          _this7.popUpHandler.showNoticePersistentEnter(messageConstants.notConnected);
        } else {
          var mewConnect = state.wallet.getConnection();
          mewConnect.sendRtcMessage('eth_getEncryptionPublicKey', params);
          mewConnect.once('eth_getEncryptionPublicKey', function (data) {
            resolve(data);
          });
        }
      });
      eventHub.on(EventNames.DECRYPT, function (params, resolve) {
        if (!state.wallet) {
          _this7.popUpHandler.showNoticePersistentEnter(messageConstants.notConnected);
        } else {
          var mewConnect = state.wallet.getConnection();
          mewConnect.sendRtcMessage('eth_decrypt', params);
          mewConnect.once('eth_decrypt', function (data) {
            resolve(data);
          });
        }
      });
      eventHub.on(EventNames.SIGN_TYPE_DATA_V3, function (params, resolve) {
        if (!state.wallet) {
          _this7.popUpHandler.showNoticePersistentEnter(messageConstants.notConnected);
        } else {
          var mewConnect = state.wallet.getConnection();
          mewConnect.sendRtcMessage('eth_signTypedData_v3', params);
          mewConnect.once('eth_signTypedData_v3', function (data) {
            resolve(data);
          });
        }
      });
      eventHub.on(EventNames.SIGN_TYPE_DATA_V4, function (params, resolve) {
        if (!state.wallet) {
          _this7.popUpHandler.showNoticePersistentEnter(messageConstants.notConnected);
        } else {
          var mewConnect = state.wallet.getConnection();
          mewConnect.sendRtcMessage('eth_signTypedData_v4', params);
          mewConnect.once('eth_signTypedData_v4', function (data) {
            resolve(data);
          });
        }
      });
    }
  }, {
    key: "getWalletOnly",
    get: function get() {
      if (state.wallet) {
        return state.wallet;
      }

      return null;
    }
  }], [{
    key: "getConnectionState",
    get: function get() {
      return createWallet.getConnectionState();
    }
  }, {
    key: "isConnected",
    get: function get() {
      return createWallet.getConnectionState() !== DISCONNECTED && createWallet.getConnectionState() !== CONNECTING;
    }
  }]);

  return Integration;
}(EventEmitter__default['default']);

// INITIATOR CLIENT

var MEWconnect = {
  Initiator: MewConnectClient.Initiator,
  Crypto: MewConnectClient.Crypto,
  Client: MewConnectClient,
  Provider: Integration // icons

};

module.exports = MEWconnect;
