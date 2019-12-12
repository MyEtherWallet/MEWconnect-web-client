'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var createLogger = _interopDefault(require('logging'));
var debugLogger = _interopDefault(require('debug'));
var browserOrNode = require('browser-or-node');
var EventEmitter = _interopDefault(require('events'));
var detectBrowser = require('detect-browser');
var eccrypto = _interopDefault(require('eccrypto'));
var ethUtils = _interopDefault(require('ethereumjs-util'));
var crypto = _interopDefault(require('crypto'));
var secp256k1 = _interopDefault(require('secp256k1'));
var uuid = _interopDefault(require('uuid/v4'));
var queryString = _interopDefault(require('query-string'));
require('isomorphic-ws');
var wrtc = _interopDefault(require('wrtc'));
var SimplePeer = _interopDefault(require('simple-peer'));
var io$1 = _interopDefault(require('socket.io-client'));

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

                debug(url);

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
                  debug('ADD DISCONNECT FUNCTIONALITY');
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
        debug('message', message);
        debug('message data', message.data);
        var parsedMessage = void 0;
        if (typeof jest === 'undefined') {
          var parsedMessageRaw = typeof message === 'string' ? JSON.parse(message) : message;
          parsedMessage = typeof parsedMessageRaw.data === 'string' ? JSON.parse(parsedMessageRaw.data) : parsedMessageRaw.data;
          debug('parsedMessage', parsedMessage);
        } else {
          parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;
          debug('parsedMessage: message', parsedMessage);
          debug('parsedMessage: message data', parsedMessage.data);
        }

        var signal = parsedMessage.signal;
        var data = parsedMessage.data;
        debug('onMessage Signal: ' + signal);
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

var debug$1 = debugLogger('MEWconnect:initiator');
var debugPeer = debugLogger('MEWconnectVerbose:peer-instances');
var debugStages = debugLogger('MEWconnect:initiator-stages');
var logger$2 = createLogger('MewConnectInitiator');

var WebRtcCommunication = function (_MewConnectCommon) {
  inherits(WebRtcCommunication, _MewConnectCommon);

  function WebRtcCommunication(mewCrypto) {
    classCallCheck(this, WebRtcCommunication);

    var _this = possibleConstructorReturn(this, (WebRtcCommunication.__proto__ || Object.getPrototypeOf(WebRtcCommunication)).call(this));

    _this.Peer = SimplePeer;
    _this.mewCrypto = mewCrypto;
    _this.peersCreated = [];
    _this.allPeerIds = [];
    _this.iceState = '';

    _this.signals = _this.jsonDetails.signals;
    _this.rtcEvents = _this.jsonDetails.rtc;
    _this.version = _this.jsonDetails.version;
    _this.versions = _this.jsonDetails.versions;
    _this.lifeCycle = _this.jsonDetails.lifeCycle;
    _this.iceStates = _this.jsonDetails.iceConnectionState;
    return _this;
  }

  createClass(WebRtcCommunication, [{
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
    key: 'start',
    value: function start(simpleOptions) {
      this.setActivePeerId();
      this.p = new this.Peer(simpleOptions);
      var peerID = this.getActivePeerId();
      this.p.peerInstanceId = peerID;
      this.peersCreated.push(this.p);
      this.p.on(this.rtcEvents.error, this.onError.bind(this, peerID));
      this.p.on(this.rtcEvents.connect, this.onConnect.bind(this, peerID));
      this.p.on(this.rtcEvents.close, this.onClose.bind(this, peerID));
      this.p.on(this.rtcEvents.data, this.onData.bind(this, peerID));
      this.p.on(this.rtcEvents.signal, this.signalListener.bind(this));
      this.p._pc.addEventListener('iceconnectionstatechange', this.stateChangeListener.bind(this, peerID));
    }
  }, {
    key: 'onConnect',
    value: function onConnect(peerID) {
      console.log('onConnect', peerID); // todo remove dev item
      this.emit('connect', peerID);
    }
  }, {
    key: 'signalListener',
    value: function signalListener(data) {
      this.emit('signal', data);
    }
  }, {
    key: 'recieveAnswer',
    value: function recieveAnswer(plainTextOffer) {
      console.log('recieveAnswer: plaintext', plainTextOffer); // todo remove dev item
      this.p.signal(plainTextOffer);
      console.log('============ INITIATOR ================='); // todo remove dev item
      console.log(this.p); // todo remove dev item
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
          if (this.timer) {
            clearTimeout(this.timer);
          }
          if (!this.connected) {
            this.connected = true;
            this.uiCommunicator(this.lifeCycle.RtcConnectedEvent);
          }
        }
        if ((evt.target.iceConnectionState === 'failed' || evt.target.iceConnectionState === 'disconnected') && !this.turnDisabled) {
          this.turnDisabled = true;
          this.useFallback();
        }
      }
    }

    // onConnectV2(peerID) {
    //   try {
    //     debugStages('RTC CONNECT', 'ok');
    //     debugPeer('peerID', peerID);
    //     this.connected = true;
    //     this.turnDisabled = true;
    //     this.socketV2Emit(this.signalsV2.rtcConnected, this.socketKey);
    //     this.socketV2Disconnect();
    //     this.uiCommunicator(this.lifeCycle.RtcConnectedEvent);
    //   } catch (e) {
    //     debug('onConnect error:', e);
    //   }
    // }

    // =========================================================
    // =========================================================
    // =========================================================

  }, {
    key: 'onData',
    value: function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(peerID, data) {
        var decryptedData, parsed;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                debug$1('DATA RECEIVED', data.toString());
                debugPeer('peerID', peerID);
                this.emit('data', data);
                _context.prev = 3;
                decryptedData = void 0;

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
                if (this.isJSON(decryptedData)) {
                  parsed = JSON.parse(decryptedData);

                  debug$1('DECRYPTED DATA RECEIVED 1', parsed);
                  this.emit('data', { type: parsed.type, data: parsed.data });
                } else {
                  debug$1('DECRYPTED DATA RECEIVED 2', decryptedData);
                  this.emit('data', {
                    type: decryptedData.type,
                    data: decryptedData.data
                  });
                }
                _context.next = 22;
                break;

              case 17:
                _context.prev = 17;
                _context.t0 = _context['catch'](3);

                logger$2.error(_context.t0);
                debug$1('onData ERROR: data=', data);
                debug$1('onData ERROR: data.toString()=', data.toString());

              case 22:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 17]]);
      }));

      function onData(_x, _x2) {
        return _ref.apply(this, arguments);
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
      this.emit('useFallback');
      // if (this.connPath === 'V2') {
      //   this.useFallbackV2();
      // } else if (this.connPath === 'V1') {
      //   this.useFallbackV1();
      // }
    }

    // ----- WebRTC Communication Methods

  }, {
    key: 'sendRtcMessageClosure',
    value: function sendRtcMessageClosure(type, msg) {
      var _this3 = this;

      return function () {
        debug$1('[SEND RTC MESSAGE Closure] type:  ' + type + ',  message:  ' + msg);
        _this3.rtcSend(JSON.stringify({ type: type, data: msg }));
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
      var _this4 = this;

      return function () {
        debugStages('DISCONNECT RTC Closure');
        _this4.connected = false;
        _this4.uiCommunicator(_this4.lifeCycle.RtcDisconnectEvent);
        _this4.rtcDestroy();
        _this4.instance = null;
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
      var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(arg) {
        var encryptedSend;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                console.log(this.isAlive()); // todo remove dev item

                if (!this.isAlive()) {
                  _context2.next = 16;
                  break;
                }

                encryptedSend = void 0;

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
                debug$1('SENDING RTC');
                this.p.send(JSON.stringify(encryptedSend));
                _context2.next = 18;
                break;

              case 16:
                // eslint-disable-next-line
                this.uiCommunicator(this.lifeCycle.attemptedDisconnectedSend);
                return _context2.abrupt('return', false);

              case 18:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function rtcSend(_x3) {
        return _ref2.apply(this, arguments);
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
  }]);
  return WebRtcCommunication;
}(MewConnectCommon);

var debug$2 = debugLogger('MEWconnect:initiator');
var debugPeer$1 = debugLogger('MEWconnectVerbose:peer-instances');
var debugStages$1 = debugLogger('MEWconnect:initiator-stages');
var logger$3 = createLogger('MewConnectInitiator');

var MewConnectInitiatorV2 = function (_MewConnectCommon) {
  inherits(MewConnectInitiatorV2, _MewConnectCommon);

  function MewConnectInitiatorV2() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, MewConnectInitiatorV2);

    var _this = possibleConstructorReturn(this, (MewConnectInitiatorV2.__proto__ || Object.getPrototypeOf(MewConnectInitiatorV2)).call(this, 'V2'));

    try {

      _this.uiCommunicator = options.uiCommunicator;
      _this.supportedBrowser = MewConnectCommon.checkBrowser();

      _this.activePeerId = '';
      _this.allPeerIds = [];
      _this.peersCreated = [];
      _this.Url = options.url || 'wss://connect2.mewapi.io/staging';

      _this.turnTest = options.turnTest;

      _this.p = null;
      _this.socketConnected = false;
      _this.socketV1Connected = false;
      _this.connected = false;
      _this.tryingTurn = false;
      _this.turnDisabled = false;
      _this.signalUrl = null;
      _this.iceState = '';
      _this.turnServers = [];

      // this.Peer = options.wrtc || SimplePeer; //WebRTCConnection
      // this.webRtcCommunication = new WebRtcCommunication();
      // this.mewCrypto = options.cryptoImpl || MewConnectCrypto.create();

      _this.socket = new WebsocketConnection();
      _this.io = io;
      _this.connPath = '';

      _this.signals = _this.jsonDetails.signals;
      _this.signalsV1 = _this.jsonDetails.signalsV1;
      _this.signals = _this.jsonDetails.signalsV2;
      _this.rtcEvents = _this.jsonDetails.rtc;
      _this.version = _this.jsonDetails.version;
      _this.versions = _this.jsonDetails.versions;
      _this.lifeCycle = _this.jsonDetails.lifeCycle;
      _this.stunServers = options.stunServers || _this.jsonDetails.stunSrvers;
      _this.iceStates = _this.jsonDetails.iceConnectionState;
      // Socket is abandoned.  disconnect.
      _this.timer = null;
      setTimeout(function () {
        if (_this.socket) {
          _this.socketDisconnect();
        }
      }, 120000);
    } catch (e) {
      debug$2('constructor error:', e);
    }

    return _this;
  }

  createClass(MewConnectInitiatorV2, [{
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
    key: 'setWebRtc',
    value: function setWebRtc(webRtcCommunication) {
      this.webRtcCommunication = webRtcCommunication;
    }
  }, {
    key: 'getSocketConnectionState',


    // Returns a boolean indicating whether the socket connection exists and is active
    value: function getSocketConnectionState() {
      return this.socketV1Connected || this.socketConnected;
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
    value: function displayCode(privateKey) {
      try {
        if (privateKey instanceof Buffer) {
          privateKey = privateKey.toString('hex');
        }
        debug$2('handshake', privateKey);
        this.socketKey = privateKey;
        var separator = this.jsonDetails.connectionCodeSeparator;
        var qrCodeString = this.version + separator + privateKey + separator + this.connId;

        debug$2(qrCodeString);

        this.uiCommunicator(this.lifeCycle.codeDisplay, qrCodeString);
        this.uiCommunicator(this.lifeCycle.checkNumber, privateKey);
        this.uiCommunicator(this.lifeCycle.ConnectionId, this.connId);
      } catch (e) {
        debug$2('displayCode error:', e);
      }
    }

    // async initiatorStart(url, testPrivate) {
    //   this.generateKeys(testPrivate);
    //   this.displayCode(this.privateKey);
    //   this.initiatorStartV1(this.v1Url);
    //   await this.initiatorStart(this.Url);
    // }

  }, {
    key: 'initiatorStart',
    value: function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.Url;
        var cryptoInstance = arguments[1];
        var details = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.connId = details.connId;
                this.signed = details.signed;
                _context.prev = 2;

                console.log('initiatorStart V2'); // todo remove dev item
                this.mewCrypto = cryptoInstance;
                this.uiCommunicator(this.lifeCycle.signatureCheck);
                _context.next = 8;
                return this.connect(url);

              case 8:
                // this.socket = this.socketManager.connect();
                this.initiatorConnect();
                _context.next = 14;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context['catch'](2);

                debug$2('initiatorStart error:', _context.t0);

              case 14:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 11]]);
      }));

      function initiatorStart() {
        return _ref.apply(this, arguments);
      }

      return initiatorStart;
    }()

    // beginRtcSequence(source, data) {
    //   if (source === '') {
    //     this.connPath = '';
    //     this.socketV1Disconnect();
    //     this.beginRtcSequence(data);
    //   } else if (source === 'V1') {
    //     this.connPath = 'V1';
    //     this.socketDisconnect();
    //     this.beginRtcSequence(data);
    //   }
    // }

  }, {
    key: 'connect',
    value: function () {
      var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(websocketURL) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var queryOptions;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;

                // if (!websocketURL)
                //   websocketURL =
                //     'wss://0ec2scxqck.execute-api.us-west-1.amazonaws.com/dev';
                if (typeof jest !== 'undefined' && this.connId === null) ;
                queryOptions = options ? options : {
                  role: this.jsonDetails.stages.initiator,
                  connId: this.connId,
                  signed: this.signed
                };


                debug$2(websocketURL, queryOptions);
                _context2.next = 6;
                return this.socket.connect(this.Url, queryOptions);

              case 6:
                _context2.next = 11;
                break;

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2['catch'](0);

                debug$2('connect error:', _context2.t0);

              case 11:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 8]]);
      }));

      function connect(_x5) {
        return _ref2.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: 'regenerateCode',
    value: function () {
      var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
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
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function regenerateCode() {
        return _ref3.apply(this, arguments);
      }

      return regenerateCode;
    }()
  }, {
    key: 'useFallback',
    value: function () {
      var _ref4 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.socketEmit(this.signals.tryTurn, { connId: this.connId });

              case 1:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function useFallback() {
        return _ref4.apply(this, arguments);
      }

      return useFallback;
    }()
  }, {
    key: 'socketEmit',
    value: function socketEmit(signal, data) {
      try {
        this.socket.send(signal, data);
      } catch (e) {
        debug$2('socketEmit error:', e);
      }
    }
  }, {
    key: 'socketDisconnect',
    value: function socketDisconnect() {
      this.socket.disconnect().catch(function (err) {
        debug$2('socketDisconnect', err);
      });
      this.socket = {};
      this.socketConnected = false;
    }
  }, {
    key: 'socketOn',
    value: function socketOn(signal, func) {
      try {
        this.socket.on(signal, func);
      } catch (e) {
        debug$2('socketOn error:', e);
      }
    }
  }, {
    key: 'initiatorConnect',
    value: function initiatorConnect() {
      var _this3 = this;

      try {
        debugStages$1('INITIATOR CONNECT');
        this.uiCommunicator(this.lifeCycle.SocketConnectedEvent);

        this.socket.on(this.signals.connect, function () {
          debugStages$1('SOCKET CONNECTED');
          _this3.socketConnected = true;
        });

        this.socketOn(this.signals.initiated, this.initiated.bind(this)); // response
        this.socketOn(this.signals.confirmation, this.beginRtcSequence.bind(this, '')); // response
        // this.signals.answer
        this.socketOn('answer', this.recieveAnswer.bind(this));
        this.socketOn(this.signals.confirmationFailedBusy, this.busyFailure.bind(this));
        this.socketOn(this.signals.confirmationFailed, this.confirmationFailure.bind(this));
        this.socketOn(this.signals.invalidConnection, this.invalidFailure.bind(this));
        this.socketOn(this.signals.disconnect, this.socketDisconnectHandler.bind(this));
        this.socketOn(this.signals.attemptingTurn, this.willAttemptTurn.bind(this));
        this.socketOn(this.signals.turnToken, this.beginTurn.bind(this));
      } catch (e) {
        debug$2('initiatorConnect error:', e);
      }
    }
  }, {
    key: 'initiated',
    value: function initiated(data) {
      this.uiCommunicator(this.signals.initiated, data);
      debug$2('initiator', this.signals.initiated, data);
    }
  }, {
    key: 'beginRtcSequence',
    value: function beginRtcSequence(data) {
      this.emit('beginRtcSequence', 'V2');
      try {
        debug$2('beginRtcSequence ');
        debug$2('sendOffer', data);
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

        this.initiatorStartRTC(options);
      } catch (e) {
        debug$2('beginRtcSequence error:', e);
      }
    }
  }, {
    key: 'sendOffer',
    value: function () {
      var _ref5 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(data) {
        var encryptedSend;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                debug$2('sendOffer');
                _context5.prev = 1;

                debug$2('SIGNAL', JSON.stringify(data));
                _context5.next = 5;
                return this.mewCrypto.encrypt(JSON.stringify(data));

              case 5:
                encryptedSend = _context5.sent;

                this.uiCommunicator(this.lifeCycle.sendOffer);
                this.socketEmit(this.signals.offerSignal, {
                  data: encryptedSend,
                  connId: this.connId
                });
                _context5.next = 14;
                break;

              case 10:
                _context5.prev = 10;
                _context5.t0 = _context5['catch'](1);

                logger$3.error(_context5.t0);
                debug$2('sendOffer error:', _context5.t0);

              case 14:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[1, 10]]);
      }));

      function sendOffer(_x6) {
        return _ref5.apply(this, arguments);
      }

      return sendOffer;
    }()

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
                debug$2('recieved answer');
                _context6.prev = 1;
                _context6.next = 4;
                return this.mewCrypto.decrypt(data.data);

              case 4:
                plainTextOffer = _context6.sent;

                this.uiCommunicator(this.lifeCycle.answerReceived);
                debug$2(plainTextOffer);
                this.p.signal(JSON.parse(plainTextOffer));
                _context6.next = 14;
                break;

              case 10:
                _context6.prev = 10;
                _context6.t0 = _context6['catch'](1);

                logger$3.error(_context6.t0);
                debug$2('recieveAnswer error:', _context6.t0);

              case 14:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[1, 10]]);
      }));

      function recieveAnswer(_x7) {
        return _ref6.apply(this, arguments);
      }

      return recieveAnswer;
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
    key: 'initiatorStartRTC',
    value: function initiatorStartRTC(options) {
      try {
        debug$2('initiatorStartRTC');
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

        this.webRtcCommunication.start();
        debug$2('initiatorStartRTC - options: ' + simpleOptions);
        this.uiCommunicator(this.lifeCycle.RtcInitiatedEvent);
        // this.p = new this.Peer(simpleOptions);
        var peerID = this.webRtcCommunication.getActivePeerId();
        // this.p.peerInstanceId = peerID;
        // this.peersCreated.push(this.p);
        // this.rtcEvents.error
        // this.p.on('error', this.onError.bind(this, peerID));
        this.webRtcCommunication.on('connect', this.onConnect.bind(this, peerID));
        this.webRtcCommunication.on('signal', this.sendOffer.bind(this));
        this.webRtcCommunication.on('data', this.onData.bind(this, peerID));
        this.p._pc.addEventListener('iceconnectionstatechange', this.stateChangeListener.bind(this, peerID));
      } catch (e) {
        debug$2('initiatorStartRTC error:', e);
      }
    }
  }, {
    key: 'stateChangeListener',
    value: function stateChangeListener(peerID, evt) {
      // eslint-disable-next-line no-undef
      if (typeof jest === 'undefined') {
        // included because target is not defined in jest
        debug$2('iceConnectionState: ' + evt.target.iceConnectionState);
        debugPeer$1('this.allPeerIds', this.allPeerIds);
        debugPeer$1('peerID', peerID);
        if (evt.target.iceConnectionState === 'connected' || evt.target.iceConnectionState === 'completed') {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          if (!this.connected) {
            this.connected = true;
            this.uiCommunicator(this.lifeCycle.RtcConnectedEvent);
          }
        }
        if ((evt.target.iceConnectionState === 'failed' || evt.target.iceConnectionState === 'disconnected') && !this.turnDisabled) {
          this.turnDisabled = true;
          this.useFallback();
        }
      }
    }
  }, {
    key: 'onConnect',
    value: function onConnect(peerID) {
      try {
        debugStages$1('RTC CONNECT', 'ok');
        debugPeer$1('peerID', peerID);
        this.connected = true;
        this.turnDisabled = true;
        this.socketEmit(this.signals.rtcConnected, this.socketKey);
        this.socketDisconnect();
        this.uiCommunicator(this.lifeCycle.RtcConnectedEvent);
      } catch (e) {
        debug$2('onConnect error:', e);
      }
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
                debug$2('DATA RECEIVED', data.toString());
                debugPeer$1('peerID', peerID);
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

                  debug$2('DECRYPTED DATA RECEIVED 1', parsed);
                  this.emit(parsed.type, parsed.data);
                } else {
                  debug$2('DECRYPTED DATA RECEIVED 2', decryptedData);
                  this.emit(decryptedData.type, decryptedData.data);
                }
                _context7.next = 21;
                break;

              case 16:
                _context7.prev = 16;
                _context7.t0 = _context7['catch'](2);

                logger$3.error(_context7.t0);
                debug$2('onData ERROR: data=', data);
                debug$2('onData ERROR: data.toString()=', data.toString());

              case 21:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this, [[2, 16]]);
      }));

      function onData(_x8, _x9) {
        return _ref7.apply(this, arguments);
      }

      return onData;
    }()
  }, {
    key: 'onClose',
    value: function onClose(peerID, data) {
      debugStages$1('WRTC MAYBE CLOSE');
      debugPeer$1('peerID', peerID);
      if (!this.isAlive()) {
        debugStages$1('WRTC CLOSE', data);
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
      debugStages$1('WRTC ERROR');
      debugPeer$1('peerID', peerID);
      debug$2(err.code);
      debug$2('error', err);
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
      var _this4 = this;

      return function () {
        debug$2('[SEND RTC MESSAGE Closure] type:  ' + type + ',  message:  ' + msg);
        _this4.rtcSend(JSON.stringify({ type: type, data: msg }));
      };
    }
  }, {
    key: 'sendRtcMessage',
    value: function sendRtcMessage(type, msg) {
      debug$2('[SEND RTC MESSAGE] type:  ' + type + ',  message:  ' + msg);
      this.rtcSend(JSON.stringify({ type: type, data: msg }));
    }
  }, {
    key: 'disconnectRTCClosure',
    value: function disconnectRTCClosure() {
      var _this5 = this;

      return function () {
        debugStages$1('DISCONNECT RTC Closure');
        _this5.connected = false;
        _this5.uiCommunicator(_this5.lifeCycle.RtcDisconnectEvent);
        _this5.rtcDestroy();
        _this5.instance = null;
      };
    }
  }, {
    key: 'disconnectRTC',
    value: function disconnectRTC() {
      debugStages$1('DISCONNECT RTC');
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
                debug$2('SENDING RTC');
                this.p.send(JSON.stringify(encryptedSend));
                _context8.next = 17;
                break;

              case 15:
                // eslint-disable-next-line
                this.uiCommunicator(this.lifeCycle.attemptedDisconnectedSend);
                return _context8.abrupt('return', false);

              case 17:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function rtcSend(_x10) {
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
  }, {
    key: 'retryViaTurn',
    value: function retryViaTurn(data) {
      try {
        debugStages$1('Retrying via TURN v2');
        this.iceServers = null;
        var options = {
          servers: data.iceServers.map(function (obj) {
            var newObject = {};
            delete Object.assign(newObject, obj, defineProperty({}, 'urls', obj['url']))['url'];
            return newObject;
          }),
          webRtcConfig: {
            initiator: true,
            trickle: false,
            iceTransportPolicy: 'relay',
            config: {
              iceServers: data.iceServers.map(function (obj) {
                var newObject = {};
                delete Object.assign(newObject, obj, defineProperty({}, 'urls', obj['url']))['url'];
                return newObject;
              })
            },
            wrtc: wrtc
          }
        };
        this.initiatorStartRTC(options);
      } catch (e) {
        debug$2('retryViaTurn error:', e);
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
  return MewConnectInitiatorV2;
}(MewConnectCommon);

var debug$3 = debugLogger('MEWconnect:initiator');
var debugPeer$2 = debugLogger('MEWconnectVerbose:peer-instances');
// const debugStages = debugLogger('MEWconnect:initiator-stages');
var debugStages$2 = console.log;
var logger$4 = createLogger('MewConnectInitiator');

var MewConnectInitiatorV1 = function (_MewConnectCommon) {
  inherits(MewConnectInitiatorV1, _MewConnectCommon);

  function MewConnectInitiatorV1() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, MewConnectInitiatorV1);

    var _this = possibleConstructorReturn(this, (MewConnectInitiatorV1.__proto__ || Object.getPrototypeOf(MewConnectInitiatorV1)).call(this, 'V1'));

    try {
      _this.supportedBrowser = MewConnectCommon.checkBrowser();
      _this.uiCommunicator = options.uiCommunicator;

      _this.activePeerId = '';
      _this.allPeerIds = [];
      _this.peersCreated = [];
      _this.Url = options.url || 'wss://connect.mewapi.io';
      _this.v2Url = options.v2Url || 'wss://connect2.mewapi.io/staging';

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

      _this.io = io$1;

      _this.signals = _this.jsonDetails.signals;
      _this.rtcEvents = _this.jsonDetails.rtc;
      _this.version = _this.jsonDetails.version;
      _this.versions = _this.jsonDetails.versions;
      _this.lifeCycle = _this.jsonDetails.lifeCycle;
      _this.stunServers = options.stunServers || _this.jsonDetails.stunSrvers;
      _this.iceStates = _this.jsonDetails.iceConnectionState;
      // Socket is abandoned.  disconnect.
      _this.timer = null;
      setTimeout(function () {
        if (_this.socket) {
          _this.socketDisconnect();
        }
      }, 120000);
      console.log(_this.signals); // todo remove dev item
    } catch (e) {
      console.log(e); // todo remove dev item
      debug$3('constructor error:', e);
    }
    return _this;
  }

  createClass(MewConnectInitiatorV1, [{
    key: 'setWebRtc',
    value: function setWebRtc(webRtcCommunication) {
      this.webRtcCommunication = webRtcCommunication;
    }

    // Initalize a websocket connection with the signal server

  }, {
    key: 'initiatorStart',
    value: function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.Url;
        var cryptoInstance = arguments[1];
        var details = arguments[2];
        var toSign, options;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
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
                  console.log(e);
                }

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function initiatorStart() {
        return _ref.apply(this, arguments);
      }

      return initiatorStart;
    }()

    // ------------- WebSocket Communication Methods and Handlers ------------------------------

    // ----- Setup handlers for communication with the signal server

  }, {
    key: 'initiatorConnect',
    value: function initiatorConnect(socket) {
      var _this2 = this;

      debugStages$2('INITIATOR CONNECT');
      this.uiCommunicator(this.lifeCycle.SocketConnectedEvent);

      this.socket.on(this.signals.connect, function () {
        console.log(': SOCKET CONNECTED');
        _this2.socketConnected = true;
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
    }

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

    // ----- Socket Event handlers

    // Handle Socket Disconnect Event

  }, {
    key: 'socketDisconnectHandler',
    value: function socketDisconnectHandler(reason) {
      debug$3(reason);
      this.socketConnected = false;
    }

    // Handle Socket Attempting Turn informative signal
    // Provide Notice that initial WebRTC connection failed and the fallback method will be used

  }, {
    key: 'willAttemptTurn',
    value: function willAttemptTurn() {
      this.tryingTurn = true;
      debugStages$2('TRY TURN CONNECTION');
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
      debug$3('confirmation Failed: Busy');
    }

    // Handle Failure due to no opposing peer existing

  }, {
    key: 'invalidFailure',
    value: function invalidFailure() {
      this.uiCommunicator(this.lifeCycle.Failed, this.lifeCycle.invalidConnectionEvent);
      debug$3('confirmation Failed: no opposite peer found');
    }

    // Handle Failure due to the handshake/ verify details being invalid for the connection ID

  }, {
    key: 'confirmationFailure',
    value: function confirmationFailure() {
      this.uiCommunicator(this.lifeCycle.Failed, this.lifeCycle.confirmationFailedEvent);
      debug$3('confirmation Failed: invalid confirmation');
    }

    // =============== [End] WebSocket Communication Methods and Handlers ========================

    // ======================== [Start] WebRTC Communication Methods =============================

    // ----- WebRTC Setup Methods

    // A connection pair exists, create and send WebRTC OFFER

  }, {
    key: 'beginRtcSequence',
    value: function () {
      var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data) {
        var options;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                console.log(data); // todo remove dev item
                console.log('sendOffer: SOCKET CONFIRMATION');
                this.emit('beginRtcSequence', 'V1');
                // this.connPath = source;
                // const plainTextVersion = await this.mewCrypto.decrypt(data.version);
                // this.peerVersion = plainTextVersion;
                // this.uiCommunicator(this.lifeCycle.receiverVersion, plainTextVersion);
                debug$3('sendOffer', data);
                options = {
                  signalListener: this.initiatorSignalListener,
                  webRtcConfig: {
                    servers: this.stunServers
                  }
                };

                this.initiatorStartRTC(this.socket, options);

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function beginRtcSequence(_x3) {
        return _ref2.apply(this, arguments);
      }

      return beginRtcSequence;
    }()
  }, {
    key: 'initiatorStartRTC',
    value: function initiatorStartRTC(socket, options) {
      console.log('initiatorStartRTC'); // todo remove dev item
      // this.setActivePeerId();
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

      debug$3('initiatorStartRTC - options: ' + simpleOptions);
      this.webRtcCommunication.start(simpleOptions);
      this.uiCommunicator(this.lifeCycle.RtcInitiatedEvent);
      var peerID = this.webRtcCommunication.getActivePeerId();
      this.webRtcCommunication.on('connect', this.onConnect.bind(this, peerID));
      this.webRtcCommunication.on('signal', this.onSignal.bind(this));
      this.webRtcCommunication.on('data', this.onData.bind(this, peerID));
    }
  }, {
    key: 'onSignal',
    value: function () {
      var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data) {
        var encryptedSend;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                console.log('onSignal'); // todo remove dev item
                console.log(data); // todo remove dev item
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
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function onSignal(_x4) {
        return _ref3.apply(this, arguments);
      }

      return onSignal;
    }()
  }, {
    key: 'initiatorSignalListener',
    value: function initiatorSignalListener(socket, options) {
      var _this3 = this;

      return function () {
        var _ref4 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(data) {
          var encryptedSend;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.prev = 0;

                  debug$3('SIGNAL', JSON.stringify(data));
                  _context4.next = 4;
                  return _this3.mewCrypto.encrypt(JSON.stringify(data));

                case 4:
                  encryptedSend = _context4.sent;

                  _this3.uiCommunicator(_this3.lifeCycle.sendOffer);
                  _this3.socketEmit(_this3.signals.offerSignal, {
                    data: encryptedSend,
                    connId: _this3.connId,
                    options: options.servers
                  });
                  _context4.next = 12;
                  break;

                case 9:
                  _context4.prev = 9;
                  _context4.t0 = _context4['catch'](0);

                  logger$4.error(_context4.t0);

                case 12:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, _this3, [[0, 9]]);
        }));

        return function (_x5) {
          return _ref4.apply(this, arguments);
        };
      }();
    }

    // Handle the WebRTC ANSWER from the opposite (mobile) peer

  }, {
    key: 'recieveAnswer',
    value: function () {
      var _ref5 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(data) {
        var plainTextOffer;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                console.log('recieveAnswer', data); // todo remove dev item
                _context5.prev = 1;
                _context5.next = 4;
                return this.mewCrypto.decrypt(data.data);

              case 4:
                plainTextOffer = _context5.sent;

                this.webRtcCommunication.recieveAnswer(JSON.parse(plainTextOffer));
                // this.rtcRecieveAnswer({ data: plainTextOffer });
                _context5.next = 11;
                break;

              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5['catch'](1);

                logger$4.error(_context5.t0);

              case 11:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[1, 8]]);
      }));

      function recieveAnswer(_x6) {
        return _ref5.apply(this, arguments);
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
    key: 'useFallback',
    value: function () {
      var _ref6 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                this.socketEmit(this.signals.tryTurn, { connId: this.connId });

              case 1:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function useFallback() {
        return _ref6.apply(this, arguments);
      }

      return useFallback;
    }()

    // ----- WebRTC Communication Event Handlers

  }, {
    key: 'onConnect',
    value: function onConnect(peerID) {
      debugStages$2('RTC CONNECT', 'ok');
      debugPeer$2('peerID', peerID);
      this.connected = true;
      this.turnDisabled = true;
      this.socketEmit(this.signals.rtcConnected, this.socketKey);
      this.socketDisconnect();
      this.uiCommunicator(this.lifeCycle.RtcConnectedEvent);
    }
  }, {
    key: 'onData',
    value: function onData(data) {
      this.emit(data.type, data.data);
    }
  }]);
  return MewConnectInitiatorV1;
}(MewConnectCommon);

var debug$4 = debugLogger('MEWconnect:initiator');
var debugPeer$3 = debugLogger('MEWconnectVerbose:peer-instances');
var debugStages$3 = debugLogger('MEWconnect:initiator-stages');
var logger$5 = createLogger('MewConnectInitiator');

var MewConnectInitiator = function (_MewConnectCommon) {
  inherits(MewConnectInitiator, _MewConnectCommon);

  function MewConnectInitiator() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, MewConnectInitiator);

    var _this = possibleConstructorReturn(this, (MewConnectInitiator.__proto__ || Object.getPrototypeOf(MewConnectInitiator)).call(this, options.version));

    _this.optionVersion = options.version;
    try {
      _this.supportedBrowser = MewConnectCommon.checkBrowser();

      _this.V1 = {};
      _this.V2 = {};

      _this.activePeerId = '';
      _this.allPeerIds = [];
      _this.peersCreated = [];
      _this.v1Url = options.v1Url || 'wss://connect.mewapi.io';
      _this.v2Url = options.v2Url || 'wss://connect2.mewapi.io/staging';

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
      // this.Peer = SimplePeer;
      _this.mewCrypto = options.cryptoImpl || MewConnectCrypto.create();
      _this.webRtcCommunication = new WebRtcCommunication(_this.mewCrypto);

      _this.connPath = '';

      // this.signals = this.jsonDetails.signals;
      // this.signalsV1 = this.jsonDetails.signalsV1;
      // this.signalsV2 = this.jsonDetails.signalsV2;
      // this.rtcEvents = this.jsonDetails.rtc;
      // this.version = this.jsonDetails.version;
      // this.versions = this.jsonDetails.versions;
      // this.lifeCycle = this.jsonDetails.lifeCycle;
      _this.stunServers = options.stunServers || _this.jsonDetails.stunSrvers;
      // this.iceStates = this.jsonDetails.iceConnectionState;
      // Socket is abandoned.  disconnect.
      _this.timer = null;
      setTimeout(function () {
        if (_this.socket) {
          _this.socketDisconnect();
        }
      }, 120000);
    } catch (e) {
      debug$4('constructor error:', e);
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
        debug$4('handshake', privateKey);
        this.socketKey = privateKey;
        var separator = this.jsonDetails.connectionCodeSeparator;
        var qrCodeString = this.version + separator + privateKey + separator + this.connId;

        debug$4(qrCodeString);

        this.uiCommunicator(this.lifeCycle.codeDisplay, qrCodeString);
        this.uiCommunicator(this.lifeCycle.checkNumber, privateKey);
        this.uiCommunicator(this.lifeCycle.ConnectionId, this.connId);
      } catch (e) {
        debug$4('displayCode error:', e);
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
      debug$4('this.signed', this.signed);
    }

    // TODO change this to handle supplying urls at time point

  }, {
    key: 'initiatorStart',
    value: function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, testPrivate) {
        var options;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.generateKeys(testPrivate);
                this.displayCode(this.privateKey);
                options = {
                  stunServers: this.stunServers,
                  turnTest: this.turnTest,
                  version: this.optionVersion,
                  uiCommunicator: this.uiCommunicator.bind(this),
                  webRtcCommunication: this.webRtcCommunication
                };

                this.V1 = new MewConnectInitiatorV1(_extends({ url: this.v1Url }, options));
                this.V2 = new MewConnectInitiatorV2(_extends({ url: this.v2Url }, options));
                _context.next = 7;
                return this.V1.initiatorStart(this.v1Url, this.mewCrypto, { signed: this.signed, connId: this.connId });

              case 7:
                _context.next = 9;
                return this.V2.initiatorStart(this.v2Url, this.mewCrypto, { signed: this.signed, connId: this.connId });

              case 9:
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
      if (source === 'V2') {
        this.connPath = 'V2';
        this.V1.socketDisconnect();
        this.beginRtcSequenceV2(data);
      } else if (source === 'V1') {
        this.connPath = 'V1';
        this.socketV2Disconnect();
        this.beginRtcSequenceV2(data);
      }
    }
  }, {
    key: 'rtcSend',
    value: function () {
      var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(arg) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.webRtcCommunication.rtcSend(arg);

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function rtcSend(_x4) {
        return _ref2.apply(this, arguments);
      }

      return rtcSend;
    }()
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

// INITIATOR CLIENT

var index = {
  Crypto: MewConnectCrypto,
  Initiator: MewConnectInitiator
};

module.exports = index;
