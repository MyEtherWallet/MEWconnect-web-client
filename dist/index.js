'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var createLogger = _interopDefault(require('logging'));
var debugLogger = _interopDefault(require('debug'));
var browserOrNode = require('browser-or-node');
var uuid = _interopDefault(require('uuid/v4'));
var queryString = _interopDefault(require('query-string'));
require('isomorphic-ws');
var SimplePeer = _interopDefault(require('simple-peer'));
var wrtc = _interopDefault(require('wrtc'));
var EventEmitter = _interopDefault(require('events'));
var detectBrowser = require('detect-browser');
var eccrypto = _interopDefault(require('eccrypto'));
var ethUtils = _interopDefault(require('ethereumjs-util'));
var crypto = _interopDefault(require('crypto'));
var secp256k1 = _interopDefault(require('secp256k1'));
var io = _interopDefault(require('socket.io-client'));

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

var defineProperty = function (obj, key, value) {
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
};

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

var debug = debugLogger('MEWconnect:websocketWrapper');

var WebsocketConnection = function () {
  function WebsocketConnection() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, WebsocketConnection);

    this.options = options;
    this.socket = {};
    this.listeners = {};

    this.SOCKET_STATES = {
      0: 'CONNECTING',
      1: 'OPEN',
      2: 'CLOSING',
      3: 'CLOSED'
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


  createClass(WebsocketConnection, [{
    key: 'connect',
    value: function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(websocketUrl) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var url, _WebSocket;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                url = websocketUrl + '?' + queryString.stringify(options);

                debug(url); // todo remove dev item

                if (!(typeof jest !== 'undefined' && typeof window === 'undefined')) {
                  _context.next = 11;
                  break;
                }

                _WebSocket = require('promise-ws').default;
                _context.next = 7;
                return _WebSocket.create(url);

              case 7:
                this.socket = _context.sent;

                this.socket.on('message', this.onMessage.bind(this));
                _context.next = 19;
                break;

              case 11:
                this.socket = new WebSocket(url);
                this.socket.onmessage = this.onMessage.bind(this);
                this.socket.onerror = this.onError.bind(this);
                this.socket.onopen = this.onOpen.bind(this);
                this.socket.onclose = this.onClose.bind(this);

                debug('extensions used: ' + this.socket.extensions + ' or none');
                debug('protocol used: ' + this.socket.protocol + ' or default');
                debug('binary type used: ' + this.socket.binaryType + ' [either blob or arraybuffer]');

              case 19:
                _context.next = 24;
                break;

              case 21:
                _context.prev = 21;
                _context.t0 = _context['catch'](0);

                debug('connect error:', _context.t0);

              case 24:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 21]]);
      }));

      function connect(_x3) {
        return _ref.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: 'disconnect',
    value: function () {
      var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                try {
                  debug('ADD DISCONNECT FUNCTIONALITY'); // todo remove dev item
                  this.socket.close();
                } catch (e) {
                  debug('disconnect error:', e);
                }

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function disconnect() {
        return _ref2.apply(this, arguments);
      }

      return disconnect;
    }()
  }, {
    key: 'getSocketState',
    value: function getSocketState() {
      return this.SOCKET_STATES[this.socket.readyState];
    }
  }, {
    key: 'onOpen',
    value: function onOpen() {
      debug('websocket onopen = ' + this.getSocketState());
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
    key: 'onMessage',
    value: function onMessage(message) {
      try {
        debug('message', message); // todo remove dev item
        debug('message data', message.data);
        var parsedMessage = void 0;
        if (typeof jest === 'undefined') {
          var parsedMessageRaw = typeof message === 'string' ? JSON.parse(message) : message;
          parsedMessage = typeof parsedMessageRaw.data === 'string' ? JSON.parse(parsedMessageRaw.data) : parsedMessageRaw.data;
          debug('parsedMessage', parsedMessage);
        } else {
          parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;
        }

        var signal = parsedMessage.signal;
        var data = parsedMessage.data;
        debug('onMessage Signal: ' + signal); // todo remove dev item
        try {
          this.listeners[signal].call(this, data);
        } catch (e) {
          debug(e);
          // Unhandled message signal
        }
      } catch (e) {
        debug('ERROR in onMessage', e);
      }
    }
  }, {
    key: 'onError',
    value: function onError(errorEvent) {
      debug('Websocket ERROR');
      debug('websocket error event', errorEvent);
    }
  }, {
    key: 'onClose',
    value: function onClose() {
      debug('websocket onClose = ' + this.getSocketState());
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
    key: 'on',
    value: function on(signal, fn) {
      this.listeners[signal] = fn;
    }

    /**
     * Unbind a particular message signal event listener.
     *
     * @param  {String} signal - The signal to unbind
     */

  }, {
    key: 'off',
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
    key: 'send',
    value: function send(signal) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      try {
        debug('socket connection state: ' + this.getSocketState());
        debug('send signal: ' + signal);
        debug('send data:', data);
        var message = JSON.stringify({
          action: signal,
          data: data
        });
        this.socket.send(message);
      } catch (e) {
        debug('ERROR in send', e);
      }
    }
  }]);
  return WebsocketConnection;
}();

var stunServers = [{ urls: 'stun:global.stun.twilio.com:3478?transport=udp' }];

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
  error: 'error'
};

var signalUrl = {
  V1: 'https://connect.mewapi.io',
  V2: 'wss://0ec2scxqck.execute-api.us-west-1.amazonaws.com/dev'
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

/* eslint-disable no-undef */

var logger = createLogger('MewConnectCommon');

var MewConnectCommon = function (_EventEmitter) {
  inherits(MewConnectCommon, _EventEmitter);

  function MewConnectCommon() {
    var version = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
    classCallCheck(this, MewConnectCommon);

    var _this = possibleConstructorReturn(this, (MewConnectCommon.__proto__ || Object.getPrototypeOf(MewConnectCommon)).call(this));

    _this.isBrowser = browserOrNode.isBrowser;

    _this.jsonDetails = {
      stunSrvers: [].concat(toConsumableArray(stunServers)),
      signalServer: signalServer(version),
      signals: _extends({}, signal(version)),
      signalsV1: _extends({}, signals.V1),
      signalsV2: _extends({}, signals.V2),
      stages: _extends({}, stages),
      lifeCycle: _extends({}, lifeCycle),
      rtc: _extends({}, rtc),
      communicationTypes: _extends({}, communicationTypes),
      iceConnectionState: _extends({}, iceConnectionState),
      connectionCodeSeparator: connectionCodeSeparator,
      version: version,
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
      this.pub = this.generatePublic(this.prvt);
      return { publicKey: this.pub, privateKey: this.prvt };
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
    key: 'generateKeys',
    value: function generateKeys() {
      this.prvt = this.generatePrivate();
      this.pub = this.generatePublic(this.prvt);
      return { publicKey: this.pub, privateKey: this.prvt };
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
    key: 'signMessageSync',
    value: function signMessageSync(msgToSign) {
      msgToSign = this.bufferToString(msgToSign);

      var msg = ethUtils.hashPersonalMessage(ethUtils.toBuffer(msgToSign));
      var signed = ethUtils.ecsign(Buffer.from(msg), Buffer.from(this.prvt, 'hex'));
      var combined = Buffer.concat([Buffer.from([signed.v]), Buffer.from(signed.r), Buffer.from(signed.s)]);
      return combined.toString('hex');
    }
  }, {
    key: 'bufferToConnId',
    value: function bufferToConnId(buf) {
      return buf.toString('hex').slice(0, 32);
    }
  }, {
    key: 'generateConnId',
    value: function generateConnId(buf) {
      if (buf instanceof Buffer) {
        return buf.toString('hex').slice(0, 32);
      }
      return Buffer.from(buf).toString('hex').slice(0, 32);
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
  }, {
    key: 'toBuffer',
    value: function toBuffer(buf) {
      if (buf instanceof Buffer) {
        return buf;
      }
      return Buffer.from(buf, 'hex');
    }
  }, {
    key: 'bufferToString',
    value: function bufferToString(buf) {
      if (buf instanceof Buffer) {
        return buf.toString('hex');
      }
      return buf;
    }
  }], [{
    key: 'create',
    value: function create() {
      return new MewConnectCrypto();
    }
  }]);
  return MewConnectCrypto;
}();

var debug$1 = debugLogger('MEWconnect:initiator');
var debugPeer = debugLogger('MEWconnectVerbose:peer-instances');
var debugStages = debugLogger('MEWconnect:initiator-stages');
var logger$2 = createLogger('MewConnectInitiator');

var MewConnectInitiator = function (_MewConnectCommon) {
  inherits(MewConnectInitiator, _MewConnectCommon);

  function MewConnectInitiator() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, MewConnectInitiator);

    var _this = possibleConstructorReturn(this, (MewConnectInitiator.__proto__ || Object.getPrototypeOf(MewConnectInitiator)).call(this, options.version));

    try {
      _this.supportedBrowser = MewConnectCommon.checkBrowser();

      _this.activePeerId = '';
      _this.allPeerIds = [];
      _this.peersCreated = [];
      _this.turnTest = options.turnTest;

      _this.destroyOnUnload();
      _this.p = null;
      _this.socketV2Connected = false;
      _this.socketV1Connected = false;
      _this.connected = false;
      _this.tryingTurn = false;
      _this.turnDisabled = false;
      _this.signalUrl = null;
      _this.iceState = '';
      _this.turnServers = [];

      // this.Peer = options.wrtc || SimplePeer; //WebRTCConnection
      _this.Peer = SimplePeer;
      _this.mewCrypto = options.cryptoImpl || MewConnectCrypto.create();

      _this.socketV2 = new WebsocketConnection();
      _this.io = io;
      _this.connPath = '';

      _this.signals = _this.jsonDetails.signals;
      _this.signalsV1 = _this.jsonDetails.signalsV1;
      _this.signalsV2 = _this.jsonDetails.signalsV2;
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
    } catch (e) {
      debug$1('constructor error:', e);
    }

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

    // Check if a WebRTC connection exists before a window/tab is closed or refreshed
    // Destroy the connection if one exists

  }, {
    key: 'destroyOnUnload',
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
      return this.socketV1Connected || this.socketV2Connected;
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
      console.log('uiCommunicator:', event); // todo remove dev item
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
    value: function displayCode(privateKey) {
      try {
        if (privateKey instanceof Buffer) {
          privateKey = privateKey.toString('hex');
        }
        debug$1('handshake', privateKey);
        this.socketKey = privateKey;
        var separator = this.jsonDetails.connectionCodeSeparator;
        var qrCodeString = this.version + separator + privateKey + separator + this.connId;

        debug$1(qrCodeString); // todo remove dev item

        this.uiCommunicator(this.lifeCycle.codeDisplay, qrCodeString);
        this.uiCommunicator(this.lifeCycle.checkNumber, privateKey);
        this.uiCommunicator(this.lifeCycle.ConnectionId, this.connId);
      } catch (e) {
        debug$1('displayCode error:', e);
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
    key: 'generateKeys',
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
      debug$1('this.signed', this.signed); // todo remove dev item
    }
  }, {
    key: 'initiatorStart',
    value: function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, testPrivate) {
        var v1Url, v2Url;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.generateKeys(testPrivate);
                this.displayCode(this.privateKey);
                v1Url = 'wss://connect.mewapi.io';

                this.initiatorStartV1(v1Url);
                v2Url = 'wss://0ec2scxqck.execute-api.us-west-1.amazonaws.com/dev';
                _context.next = 7;
                return this.initiatorStartV2(v2Url);

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function initiatorStart(_x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return initiatorStart;
    }()
  }, {
    key: 'beginRtcSequence',
    value: function beginRtcSequence(source, data) {
      console.log('source: ', source); // todo remove dev item
      if (source === 'V2') {
        this.connPath = 'V2';
        this.socketV1Disconnect();
        this.beginRtcSequenceV2(data);
      } else if (source === 'V1') {
        this.connPath = 'V1';
        this.socketV2Disconnect();
        console.log(data); // todo remove dev item
        this.beginRtcSequenceV2(data);
      }
    }

    // ===============================================
    // V1
    // ============================================

    // Initalize a websocket connection with the signal server

  }, {
    key: 'initiatorStartV1',
    value: function () {
      var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url) {
        var toSign, options;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // if (this.signalUrl === null) {
                //   this.signalUrl = url;
                // }
                // this.keys = this.mewCrypto.prepareKey();
                toSign = this.mewCrypto.generateMessage();


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
                this.socketV1 = this.socketManager.connect();
                this.initiatorConnectV1(this.socketV1);

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function initiatorStartV1(_x4) {
        return _ref2.apply(this, arguments);
      }

      return initiatorStartV1;
    }()

    // ------------- WebSocket Communication Methods and Handlers ------------------------------

    // ----- Wrapper around Socket.IO methods
    // socket.emit wrapper

  }, {
    key: 'socketV1Emit',
    value: function socketV1Emit(signal, data) {
      this.socketV1.binary(false).emit(signal, data);
    }

    // socket.disconnect wrapper

  }, {
    key: 'socketV1Disconnect',
    value: function socketV1Disconnect() {
      this.socketV1.disconnect();
      this.socketV1Connected = false;
    }

    // socket.on listener registration wrapper

  }, {
    key: 'socketV1On',
    value: function socketV1On(signal, func) {
      this.socketV1.on(signal, func);
    }

    // ----- Setup handlers for communication with the signal server

  }, {
    key: 'initiatorConnectV1',
    value: function initiatorConnectV1(socket) {
      var _this3 = this;

      debugStages('INITIATOR CONNECT');
      this.uiCommunicator(this.lifeCycle.SocketConnectedEvent);

      this.socketV1.on(this.signalsV1.connect, function () {
        console.log('V1: SOCKET CONNECTED');
        _this3.socketV1Connected = true;
      });

      this.socketV1On(this.signalsV1.confirmation, this.sendOfferV1.bind(this, 'V1')); // response
      this.socketV1On(this.signalsV1.answer, this.recieveAnswerV1.bind(this));
      this.socketV1On(this.signalsV1.confirmationFailedBusy, this.busyFailure.bind(this));
      this.socketV1On(this.signalsV1.confirmationFailed, this.confirmationFailure.bind(this));
      this.socketV1On(this.signalsV1.invalidConnection, this.invalidFailure.bind(this));
      this.socketV1On(this.signalsV1.disconnect, this.socketDisconnectHandler.bind(this));
      this.socketV1On(this.signalsV1.attemptingTurn, this.willAttemptTurn.bind(this));
      this.socketV1On(this.signalsV1.turnToken, this.beginTurn.bind(this));
      return socket;
    }

    // ----- Socket Event handlers

    // Handle Socket Disconnect Event

  }, {
    key: 'socketDisconnectHandler',
    value: function socketDisconnectHandler(reason) {
      debug$1(reason);
      this.socketV1Connected = false;
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
      debug$1('confirmation Failed: Busy');
    }

    // Handle Failure due to no opposing peer existing

  }, {
    key: 'invalidFailure',
    value: function invalidFailure() {
      this.uiCommunicator(this.lifeCycle.Failed, this.lifeCycle.invalidConnectionEvent);
      debug$1('confirmation Failed: no opposite peer found');
    }

    // Handle Failure due to the handshake/ verify details being invalid for the connection ID

  }, {
    key: 'confirmationFailure',
    value: function confirmationFailure() {
      this.uiCommunicator(this.lifeCycle.Failed, this.lifeCycle.confirmationFailedEvent);
      debug$1('confirmation Failed: invalid confirmation');
    }

    // =============== [End] WebSocket Communication Methods and Handlers ========================

    // ======================== [Start] WebRTC Communication Methods =============================

    // ----- WebRTC Setup Methods

    // A connection pair exists, create and send WebRTC OFFER

  }, {
    key: 'sendOfferV1',
    value: function () {
      var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(source, data) {
        var plainTextVersion, options;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.connPath = source;
                this.socketV2Disconnect();
                console.log('sendOfferV1(data)'); // todo remove dev item
                _context3.next = 5;
                return this.mewCrypto.decrypt(data.version);

              case 5:
                plainTextVersion = _context3.sent;

                this.peerVersion = plainTextVersion;
                this.uiCommunicator(this.lifeCycle.receiverVersion, plainTextVersion);
                debug$1('sendOffer', data);
                options = {
                  signalListener: this.initiatorSignalListener,
                  webRtcConfig: {
                    servers: this.stunServers
                  }
                };

                this.initiatorStartRTCV1(this.socketV1, options);

              case 11:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function sendOfferV1(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return sendOfferV1;
    }()
  }, {
    key: 'initiatorSignalListener',
    value: function initiatorSignalListener(socket, options) {
      var _this4 = this;

      return function () {
        var _ref4 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(data) {
          var encryptedSend;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.prev = 0;

                  debug$1('SIGNAL', JSON.stringify(data));
                  _context4.next = 4;
                  return _this4.mewCrypto.encrypt(JSON.stringify(data));

                case 4:
                  encryptedSend = _context4.sent;

                  _this4.uiCommunicator(_this4.lifeCycle.sendOffer);
                  _this4.socketV1Emit(_this4.signalsV1.offerSignal, {
                    data: encryptedSend,
                    connId: _this4.connId,
                    options: options.servers
                  });
                  _context4.next = 12;
                  break;

                case 9:
                  _context4.prev = 9;
                  _context4.t0 = _context4['catch'](0);

                  logger$2.error(_context4.t0);

                case 12:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, _this4, [[0, 9]]);
        }));

        return function (_x7) {
          return _ref4.apply(this, arguments);
        };
      }();
    }

    // Handle the WebRTC ANSWER from the opposite (mobile) peer

  }, {
    key: 'recieveAnswerV1',
    value: function () {
      var _ref5 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(data) {
        var plainTextOffer;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return this.mewCrypto.decrypt(data.data);

              case 3:
                plainTextOffer = _context5.sent;

                this.rtcRecieveAnswer({ data: plainTextOffer });
                _context5.next = 10;
                break;

              case 7:
                _context5.prev = 7;
                _context5.t0 = _context5['catch'](0);

                logger$2.error(_context5.t0);

              case 10:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 7]]);
      }));

      function recieveAnswerV1(_x8) {
        return _ref5.apply(this, arguments);
      }

      return recieveAnswerV1;
    }()
  }, {
    key: 'rtcRecieveAnswer',
    value: function rtcRecieveAnswer(data) {
      this.uiCommunicator(this.lifeCycle.answerReceived);
      this.p.signal(JSON.parse(data.data));
    }
  }, {
    key: 'initiatorStartRTCV1',
    value: function initiatorStartRTCV1(socket, options) {
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
        },
        wrtc: wrtc
      };

      var simpleOptions = _extends({}, defaultOptions, {
        suppliedOptions: suppliedOptions
      });
      debug$1('initiatorStartRTC - options: ' + simpleOptions);
      this.uiCommunicator(this.lifeCycle.RtcInitiatedEvent);
      this.p = new this.Peer(simpleOptions);
      var peerID = this.getActivePeerId();
      this.p.peerInstanceId = peerID;
      this.peersCreated.push(this.p);
      this.p.on(this.rtcEvents.error, this.onError.bind(this, peerID));
      this.p.on(this.rtcEvents.connect, this.onConnectV1.bind(this, peerID));
      this.p.on(this.rtcEvents.close, this.onClose.bind(this, peerID));
      this.p.on(this.rtcEvents.data, this.onData.bind(this, peerID));
      this.p.on(this.rtcEvents.signal, signalListener.bind(this));
      this.p._pc.addEventListener('iceconnectionstatechange', this.stateChangeListener.bind(this, peerID));
    }
  }, {
    key: 'useFallbackV1',
    value: function () {
      var _ref6 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                this.socketV1Emit(this.signalsV1.tryTurn, { connId: this.connId });

              case 1:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function useFallbackV1() {
        return _ref6.apply(this, arguments);
      }

      return useFallbackV1;
    }()

    // ----- WebRTC Communication Event Handlers

  }, {
    key: 'stateChangeListener',
    value: function stateChangeListener(peerID, evt) {
      // eslint-disable-next-line no-undef
      if (typeof jest === 'undefined') {
        // included because target is not defined in jest
        debug$1('iceConnectionState: ' + evt.target.iceConnectionState);
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
    key: 'onConnectV1',
    value: function onConnectV1(peerID) {
      console.log('RTC CONNECT'); // todo remove dev item
      debugStages('RTC CONNECT', 'ok');
      debugPeer('peerID', peerID);
      this.connected = true;
      this.turnDisabled = true;
      this.socketV1Emit(this.signalsV1.rtcConnected, this.socketKey);
      this.socketV1Disconnect();
      this.uiCommunicator(this.lifeCycle.RtcConnectedEvent);
    }

    //========================================================
    // V2
    //========================================================

  }, {
    key: 'connect',
    value: function () {
      var _ref7 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(websocketURL) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var queryOptions;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;

                if (!websocketURL) websocketURL = 'wss://0ec2scxqck.execute-api.us-west-1.amazonaws.com/dev';
                if (typeof jest !== 'undefined' && this.connId === null) ;
                queryOptions = options ? options : {
                  role: this.jsonDetails.stages.initiator,
                  connId: this.connId,
                  signed: this.signed
                };

                console.log(websocketURL, queryOptions); // todo remove dev item

                debug$1(websocketURL, queryOptions); // todo remove dev item
                _context7.next = 8;
                return this.socketV2.connect(websocketURL, queryOptions);

              case 8:
                _context7.next = 13;
                break;

              case 10:
                _context7.prev = 10;
                _context7.t0 = _context7['catch'](0);

                debug$1('connect error:', _context7.t0);

              case 13:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 10]]);
      }));

      function connect(_x10) {
        return _ref7.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: 'regenerateCode',
    value: function () {
      var _ref8 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (!(this.signalUrl === null)) {
                  _context8.next = 2;
                  break;
                }

                throw Error('regenerateCode called before initial code generation');

              case 2:
                this.socketDisconnect();
                this.initiatorStart(this.signalUrl);

              case 4:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function regenerateCode() {
        return _ref8.apply(this, arguments);
      }

      return regenerateCode;
    }()
  }, {
    key: 'useFallbackV2',
    value: function () {
      var _ref9 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                this.socketV2Emit(this.signalsV2.tryTurn, { connId: this.connId });

              case 1:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function useFallbackV2() {
        return _ref9.apply(this, arguments);
      }

      return useFallbackV2;
    }()
  }, {
    key: 'initiatorStartV2',
    value: function () {
      var _ref10 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(url, testPrivate) {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;

                this.uiCommunicator(this.lifeCycle.signatureCheck);
                _context10.next = 4;
                return this.connect(url);

              case 4:
                // this.socket = this.socketManager.connect();
                this.initiatorConnectV2();
                _context10.next = 10;
                break;

              case 7:
                _context10.prev = 7;
                _context10.t0 = _context10['catch'](0);

                debug$1('initiatorStart error:', _context10.t0);

              case 10:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this, [[0, 7]]);
      }));

      function initiatorStartV2(_x11, _x12) {
        return _ref10.apply(this, arguments);
      }

      return initiatorStartV2;
    }()
  }, {
    key: 'socketV2Emit',
    value: function socketV2Emit(signal, data) {
      try {
        this.socketV2.send(signal, data);
      } catch (e) {
        debug$1('socketEmit error:', e);
      }
    }
  }, {
    key: 'socketV2Disconnect',
    value: function socketV2Disconnect() {
      this.socketV2.disconnect().catch(function (err) {
        debug$1('socketDisconnect', err);
      });
      this.socketV2 = {};
      this.socketV2Connected = false;
    }
  }, {
    key: 'socketV2On',
    value: function socketV2On(signal, func) {
      try {
        this.socketV2.on(signal, func);
      } catch (e) {
        debug$1('socketOn error:', e);
      }
    }
  }, {
    key: 'initiatorConnectV2',
    value: function initiatorConnectV2() {
      var _this5 = this;

      try {
        debugStages('INITIATOR CONNECT');
        this.uiCommunicator(this.lifeCycle.SocketConnectedEvent);

        this.socketV2.on(this.signalsV2.connect, function () {
          debugStages('SOCKET CONNECTED');
          _this5.socketV2Connected = true;
        });

        this.socketV2On(this.signalsV2.initiated, this.initiated.bind(this)); // response
        this.socketV2On(this.signalsV2.confirmation, this.beginRtcSequence.bind(this, 'V2')); // response

        this.socketV2On(this.signalsV2.answer, this.recieveAnswerV2.bind(this));
        this.socketV2On(this.signalsV2.confirmationFailedBusy, this.busyFailure.bind(this));
        this.socketV2On(this.signalsV2.confirmationFailed, this.confirmationFailure.bind(this));
        this.socketV2On(this.signalsV2.invalidConnection, this.invalidFailure.bind(this));
        this.socketV2On(this.signalsV2.disconnect, this.socketDisconnectHandler.bind(this));
        this.socketV2On(this.signalsV2.attemptingTurn, this.willAttemptTurn.bind(this));
        this.socketV2On(this.signalsV2.turnToken, this.beginTurn.bind(this));
      } catch (e) {
        debug$1('initiatorConnect error:', e);
      }
    }
  }, {
    key: 'initiated',
    value: function initiated(data) {
      this.uiCommunicator(this.signalsV2.initiated, data);
      debug$1('initiator', this.signalsV2.initiated, data); // todo remove dev item
    }
  }, {
    key: 'beginRtcSequenceV2',
    value: function beginRtcSequenceV2(data) {
      try {
        console.log('============================================================================='); // todo remove dev item
        debug$1('beginRtcSequence V2');
        debug$1('sendOffer', data);
        this.iceServers = null;
        var options = {
          servers: this.stunServers,
          webRtcConfig: {
            initiator: true,
            trickle: false,
            iceTransportPolicy: 'relay',
            config: {
              iceServers: this.stunServers
            },
            wrtc: wrtc
          }
        };

        this.initiatorStartRTCV2(options);
      } catch (e) {
        debug$1('beginRtcSequence error:', e);
      }
    }
  }, {
    key: 'sendOfferV2',
    value: function () {
      var _ref11 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(data) {
        var encryptedSend;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                debug$1('sendOffer');
                _context11.prev = 1;

                debug$1('SIGNAL', JSON.stringify(data));
                _context11.next = 5;
                return this.mewCrypto.encrypt(JSON.stringify(data));

              case 5:
                encryptedSend = _context11.sent;

                this.uiCommunicator(this.lifeCycle.sendOffer);
                this.socketV2Emit(this.signalsV2.offerSignal, {
                  data: encryptedSend,
                  connId: this.connId
                });
                _context11.next = 14;
                break;

              case 10:
                _context11.prev = 10;
                _context11.t0 = _context11['catch'](1);

                logger$2.error(_context11.t0);
                debug$1('sendOffer error:', _context11.t0);

              case 14:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this, [[1, 10]]);
      }));

      function sendOfferV2(_x13) {
        return _ref11.apply(this, arguments);
      }

      return sendOfferV2;
    }()

    // Handle the WebRTC ANSWER from the opposite (mobile) peer

  }, {
    key: 'recieveAnswerV2',
    value: function () {
      var _ref12 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(data) {
        var plainTextOffer;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                debug$1('recieved answer'); // todo remove dev item
                _context12.prev = 1;
                _context12.next = 4;
                return this.mewCrypto.decrypt(data.data);

              case 4:
                plainTextOffer = _context12.sent;

                this.uiCommunicator(this.lifeCycle.answerReceived);
                this.p.signal(JSON.parse(plainTextOffer));
                _context12.next = 13;
                break;

              case 9:
                _context12.prev = 9;
                _context12.t0 = _context12['catch'](1);

                logger$2.error(_context12.t0);
                debug$1('recieveAnswer error:', _context12.t0);

              case 13:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this, [[1, 9]]);
      }));

      function recieveAnswerV2(_x14) {
        return _ref12.apply(this, arguments);
      }

      return recieveAnswerV2;
    }()
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
    key: 'initiatorStartRTCV2',
    value: function initiatorStartRTCV2(options) {
      try {
        debug$1('initiatorStartRTC');
        this.setActivePeerId();
        var webRtcConfig = options.webRtcConfig || {};
        var webRtcServers = webRtcConfig.servers || this.stunServers;

        this.iceServers = null;
        var defaultOptions = {
          initiator: true,
          trickle: false,
          iceTransportPolicy: 'relay',
          config: {
            iceServers: webRtcServers
          },
          wrtc: wrtc
        };

        //
        var simpleOptions = _extends({}, defaultOptions, webRtcConfig);

        debug$1('initiatorStartRTC - options: ' + simpleOptions);
        this.uiCommunicator(this.lifeCycle.RtcInitiatedEvent);
        this.p = new this.Peer(simpleOptions);
        var peerID = this.getActivePeerId();
        this.p.peerInstanceId = peerID;
        this.peersCreated.push(this.p);
        this.p.on(this.rtcEvents.error, this.onError.bind(this, peerID));
        this.p.on(this.rtcEvents.connect, this.onConnectV2.bind(this, peerID));
        this.p.on(this.rtcEvents.close, this.onClose.bind(this, peerID));
        this.p.on(this.rtcEvents.data, this.onData.bind(this, peerID));
        this.p.on(this.rtcEvents.signal, this.sendOfferV2.bind(this));
        this.p._pc.addEventListener('iceconnectionstatechange', this.stateChangeListener.bind(this, peerID));
      } catch (e) {
        debug$1('initiatorStartRTC error:', e);
      }
    }
  }, {
    key: 'onConnectV2',
    value: function onConnectV2(peerID) {
      try {
        debugStages('RTC CONNECT', 'ok');
        debugPeer('peerID', peerID);
        this.connected = true;
        this.turnDisabled = true;
        this.socketV2Emit(this.signalsV2.rtcConnected, this.socketKey);
        this.socketV2Disconnect();
        this.uiCommunicator(this.lifeCycle.RtcConnectedEvent);
      } catch (e) {
        debug$1('onConnect error:', e);
      }
    }

    // =========================================================
    // =========================================================
    // =========================================================

  }, {
    key: 'onData',
    value: function () {
      var _ref13 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(peerID, data) {
        var decryptedData, parsed;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                debug$1('DATA RECEIVED', data.toString());
                debugPeer('peerID', peerID);
                _context13.prev = 2;
                decryptedData = void 0;

                if (!this.isJSON(data)) {
                  _context13.next = 10;
                  break;
                }

                _context13.next = 7;
                return this.mewCrypto.decrypt(JSON.parse(data.toString()));

              case 7:
                decryptedData = _context13.sent;
                _context13.next = 13;
                break;

              case 10:
                _context13.next = 12;
                return this.mewCrypto.decrypt(JSON.parse(data.toString()));

              case 12:
                decryptedData = _context13.sent;

              case 13:
                if (this.isJSON(decryptedData)) {
                  parsed = JSON.parse(decryptedData);

                  debug$1('DECRYPTED DATA RECEIVED 1', parsed);
                  this.emit(parsed.type, parsed.data);
                } else {
                  debug$1('DECRYPTED DATA RECEIVED 2', decryptedData);
                  this.emit(decryptedData.type, decryptedData.data);
                }
                _context13.next = 21;
                break;

              case 16:
                _context13.prev = 16;
                _context13.t0 = _context13['catch'](2);

                logger$2.error(_context13.t0);
                debug$1('onData ERROR: data=', data);
                debug$1('onData ERROR: data.toString()=', data.toString());

              case 21:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this, [[2, 16]]);
      }));

      function onData(_x15, _x16) {
        return _ref13.apply(this, arguments);
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
      debug$1(err.code);
      debug$1('error', err);
      if (!this.connected && !this.tryingTurn && !this.turnDisabled) {
        this.useFallback();
      } else {
        if (!this.isAlive()) {
          this.uiCommunicator(this.lifeCycle.RtcErrorEvent);
        }
      }
    }
  }, {
    key: 'useFallback',
    value: function useFallback() {
      if (this.connPath === 'V2') {
        this.useFallbackV2();
      } else if (this.connPath === 'V1') {
        this.useFallbackV1();
      }
    }

    // ----- WebRTC Communication Methods

  }, {
    key: 'sendRtcMessageClosure',
    value: function sendRtcMessageClosure(type, msg) {
      var _this6 = this;

      return function () {
        debug$1('[SEND RTC MESSAGE Closure] type:  ' + type + ',  message:  ' + msg);
        _this6.rtcSend(JSON.stringify({ type: type, data: msg }));
      };
    }
  }, {
    key: 'sendRtcMessage',
    value: function sendRtcMessage(type, msg) {
      debug$1('[SEND RTC MESSAGE] type:  ' + type + ',  message:  ' + msg);
      this.rtcSend(JSON.stringify({ type: type, data: msg }));
    }
  }, {
    key: 'disconnectRTCClosure',
    value: function disconnectRTCClosure() {
      var _this7 = this;

      return function () {
        debugStages('DISCONNECT RTC Closure');
        _this7.connected = false;
        _this7.uiCommunicator(_this7.lifeCycle.RtcDisconnectEvent);
        _this7.rtcDestroy();
        _this7.instance = null;
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
      var _ref14 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(arg) {
        var encryptedSend;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                if (!this.isAlive()) {
                  _context14.next = 15;
                  break;
                }

                encryptedSend = void 0;

                if (!(typeof arg === 'string')) {
                  _context14.next = 8;
                  break;
                }

                _context14.next = 5;
                return this.mewCrypto.encrypt(arg);

              case 5:
                encryptedSend = _context14.sent;
                _context14.next = 11;
                break;

              case 8:
                _context14.next = 10;
                return this.mewCrypto.encrypt(JSON.stringify(arg));

              case 10:
                encryptedSend = _context14.sent;

              case 11:
                debug$1('SENDING RTC');
                this.p.send(JSON.stringify(encryptedSend));
                _context14.next = 16;
                break;

              case 15:
                // eslint-disable-next-line
                this.uiCommunicator(this.lifeCycle.attemptedDisconnectedSend);

              case 16:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function rtcSend(_x17) {
        return _ref14.apply(this, arguments);
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
      if (this.connPath === 'V2') {
        this.retryViaTurnV2(data);
      } else if (this.connPath === 'V1') {
        this.retryViaTurnV1(data);
      }
    }
  }, {
    key: 'retryViaTurnV1',
    value: function retryViaTurnV1(data) {
      debugStages('Retrying via TURN');
      var options = {
        signalListener: this.initiatorSignalListener,
        webRtcConfig: {
          servers: data.data
        }
      };
      this.initiatorStartRTCV1(this.socket, options);
    }
  }, {
    key: 'retryViaTurnV2',
    value: function retryViaTurnV2(data) {
      try {
        debugStages('Retrying via TURN');
        var options = {
          signalListener: this.initiatorSignalListener,
          servers: data.iceServers.map(function (obj) {
            var newObject = {};
            delete Object.assign(newObject, obj, defineProperty({}, 'urls', obj['url']))['url'];
            return newObject;
          })
        };
        this.initiatorStartRTC(this.socket, options);
      } catch (e) {
        debug$1('retryViaTurn error:', e);
      }
    }
  }], [{
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

// import version2 from './socketVersions/MewConnectInitiatorV2';
// export default version2;

/*
import createLogger from 'logging';
import debugLogger from 'debug';
// import { isBrowser } from 'browser-or-node';
// import uuid from 'uuid/v4';
// import WebSocket from './websocketWrapper';
// import SimplePeer from 'simple-peer';
// import wrtc from 'wrtc';
import MewConnectCommon from './MewConnectCommon';
// import MewConnectCrypto from './MewConnectCrypto';
// import version1 from './MewConnectInitiatorV1';
// import version2 from './MewConnectInitiatorV2';
import demo from './socketVersions/MewConnectInitiator.js'

const debug = debugLogger('MEWconnect:initiator');
const debugPeer = debugLogger('MEWconnectVerbose:peer-instances');
const debugStages = debugLogger('MEWconnect:initiator-stages');
const logger = createLogger('MewConnectInitiator');

export default class MewConnectInitiator extends MewConnectCommon {
  constructor(options = {}) {
    super();

    return new demo(options);
    // if (options.version) {
    //   const parts = options.version.split('.');
    //   if (parts[0] < 2) {
    //     debug('VERSION 1');
    //     console.log('version 1'); // todo remove dev item
    //     return new version1(options);
    //     // Reflect.setPrototypeOf(this, version1);
    //   } else {
    //     debug('VERSION 2');
    //     console.log('version 2'); // todo remove dev item
    //     return new version2(options);
    //     // Reflect.setPrototypeOf(this, version2);
    //   }
    // } else {
    //   debug('VERSION 2');
    //   return new version2(options);
    //   // Reflect.setPrototypeOf(this, version2);
    // }

  }

}
*/

// INITIATOR CLIENT

var index = {
  Crypto: MewConnectCrypto,
  Initiator: MewConnectInitiator
};

module.exports = index;
