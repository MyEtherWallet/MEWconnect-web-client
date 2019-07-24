'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var crypto = _interopDefault(require('crypto'));
var eccrypto = _interopDefault(require('eccrypto'));
var ethUtils = _interopDefault(require('ethereumjs-util'));
var secp256k1 = _interopDefault(require('secp256k1'));
var queryString = _interopDefault(require('query-string'));
require('isomorphic-ws');
var Peer = _interopDefault(require('simple-peer'));
var wrtc = _interopDefault(require('wrtc'));
var createLogger = _interopDefault(require('logging'));
var EventEmitter = _interopDefault(require('events'));
var browserOrNode = require('browser-or-node');
var detectBrowser = require('detect-browser');
var debugLogger = _interopDefault(require('debug'));
var uuid = _interopDefault(require('uuid/v4'));

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

var _this = undefined;

/**
 * Generate a public/private keypair using secp256k1
 *
 * @return {Object} - publicKey/privateKey object
 */
var generateKeys = function generateKeys() {
  var privateKey = Buffer.from(crypto.randomBytes(32), 'hex');
  var publicKey = secp256k1.publicKeyCreate(privateKey);
  return {
    publicKey: publicKey,
    privateKey: privateKey
  };
};

/**
 * Generate a connId using given a public key
 *
 * @param  {String} publicKey - publicKey string (usually generated with generateKeys())
 * @return {String} - connId string
 */
var generateConnId = function generateConnId(publicKey) {
  return publicKey.toString('hex').slice(-32);
};

/**
 * Generate a random message of 32 bytes
 *
 * @return {String} - The randomly generated string
 */
var generateRandomMessage = function generateRandomMessage() {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Sign a message using a privateKey
 *
 * @param  {String} msg - Message to sign/hash
 * @param  {[type]} privateKey - Private key (usually generated with generateKeys())
 * @return {String} - Signed message
 */
var signMessage = function signMessage(msg, privateKey) {
  var hashedMsg = ethUtils.hashPersonalMessage(ethUtils.toBuffer(msg));
  var signed = ethUtils.ecsign(Buffer.from(hashedMsg), Buffer.from(privateKey, 'hex'));
  var combined = Buffer.concat([Buffer.from([signed.v]), Buffer.from(signed.r), Buffer.from(signed.s)]);
  var combinedHex = combined.toString('hex');
  return combinedHex;
};

/**
 * Encrypt a set of data given a private key using eccrypto
 *
 * @param  {Object/String} data - Data to encrypt
 * @param  {String} privateKey - Private key (usually generated with generateKeys())
 * @return {Object} - Encrypted data object with the following properties:
 *                    'ciphertext', 'ephemPublicKey', 'iv', 'mac'
 */
var encrypt = function () {
  var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data, privateKey) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', new Promise(function (resolve, reject) {
              var publicKey = eccrypto.getPublic(privateKey);
              eccrypto.encrypt(publicKey, Buffer.from(data)).then(function (encryptedData) {
                resolve(encryptedData);
              }).catch(function (error) {
                reject(error);
              });
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));

  return function encrypt(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Decrypt an encrypted data object given a private key using eccrypto
 *
 * @param  {Object} data - An encrypted data object (usually using the encrypt() function)
 * @param  {String} privateKey - Private key (usually generated with generateKeys())
 * @return {Object} - Decrypted data
 */
var decrypt = function () {
  var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data, privateKey) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', new Promise(function (resolve, reject) {
              eccrypto.decrypt(privateKey, {
                ciphertext: Buffer.from(data.ciphertext),
                ephemPublicKey: Buffer.from(data.ephemPublicKey),
                iv: Buffer.from(data.iv),
                mac: Buffer.from(data.mac)
              }).then(function (decrypted) {
                var result = void 0;
                try {
                  if (isJSON(decrypted)) {
                    var humanRadable = JSON.parse(decrypted);
                    if (Array.isArray(humanRadable)) {
                      result = humanRadable[0];
                    } else {
                      result = humanRadable;
                    }
                  } else {
                    result = decrypted.toString();
                  }
                } catch (e) {
                  reject(e);
                }
                resolve(JSON.stringify(result));
              }).catch(function (error) {
                reject(error);
              });
            }));

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this);
  }));

  return function decrypt(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var isJSON = function isJSON(arg) {
  try {
    JSON.parse(arg);
    return true;
  } catch (e) {
    return false;
  }
};

var CryptoUtils = {
  generateKeys: generateKeys,
  generateConnId: generateConnId,
  generateRandomMessage: generateRandomMessage,
  signMessage: signMessage,
  encrypt: encrypt,
  decrypt: decrypt
};

var WebsocketConnection = function () {
  function WebsocketConnection() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, WebsocketConnection);

    this.options = options;
    this.socket = {};
    this.listeners = {};
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
        var url;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!websocketUrl) websocketUrl = 'wss://0ec2scxqck.execute-api.us-west-1.amazonaws.com/dev';
                url = websocketUrl + '?' + queryString.stringify(options);

                console.log(url); // todo remove dev item
                this.socket = new WebSocket(url);
                // this.socket.on('message', this.onMessage.bind(this));
                this.socket.onmessage = this.onMessage.bind(this);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function connect(_x3) {
        return _ref.apply(this, arguments);
      }

      return connect;
    }()

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
      var parsedMessage = JSON.parse(message);
      var signal = parsedMessage.signal;
      var data = parsedMessage.data;

      try {
        this.listeners[signal].call(this, data);
      } catch (e) {
        // Unhandled message signal
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

      var message = JSON.stringify({
        action: signal,
        data: data
      });
      this.socket.send(message);
    }
  }]);
  return WebsocketConnection;
}();

var version = "1.0.15";

var version$1 = version;

var stunServers = [{ urls: 'stun:global.stun.twilio.com:3478?transport=udp' }];

var versions = ['0.0.1'];

var connectionCodeSchemas = {
  '0.0.1': ['version', 'key', 'connId']
};

var connectionCodeSeparator = '_';

var signal = {
  //V1
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
  confirmationFailed: 'confirmationFailed',
  // V2
  initiated: 'initiated',
  socketTimeout: 'socketTimeout',
  receivedSignal: 'receivedSignal',
  error: 'error'
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

var WebRTCConnection = function () {
  function WebRTCConnection() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, WebRTCConnection);

    this.options = options;
    this.peer = {};
    this.listeners = {};
  }

  /**
   * Attempt to initiate an "offer" WebRTC connection between two peers.
   * This will return an offer object that can be used by the receiver to create a
   * p2p connection.
   *
   * If ICE servers are given, then use those instead. The object format returned
   * by twilio is incorrect. The 'url' properties must be renamed 'urls'
   *
   * @return {Object} - WebRTC connection offer
   */


  createClass(WebRTCConnection, [{
    key: 'offer',
    value: function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this = this;

        var iceServers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', new Promise(function (resolve, reject) {
                  var options = {
                    initiator: true,
                    trickle: false,
                    iceTransportPolicy: 'relay',
                    config: {
                      iceServers: iceServers ? iceServers.map(function (obj) {
                        var newObject = {};
                        delete Object.assign(newObject, obj, defineProperty({}, 'urls', obj['url']))['url'];
                        return newObject;
                      }) : stunServers
                    },
                    wrtc: wrtc
                  };

                  _this.peer = new Peer(options);
                  _this.peer.on(rtc.signal, function (data) {
                    resolve(data);
                  });
                }));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function offer() {
        return _ref.apply(this, arguments);
      }

      return offer;
    }()

    /**
     * Given a WebRTC offer object (created with the offer() function),
     * a receiver can create a WebRTC response in order to create a p2p
     * connection between the initiator and receiver.
     *
     * @param  {Object} offer - WebRTC offer object create with offer()
     * @return {Object} - WebRTC answer object, to be used by the initiator
     */

  }, {
    key: 'answer',
    value: function () {
      var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(offer) {
        var _this2 = this;

        var iceServers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', new Promise(function (resolve, reject) {
                  var options = {
                    trickle: false,
                    iceTransportPolicy: 'relay',
                    config: {
                      iceServers: iceServers ? iceServers : stunServers
                    },
                    wrtc: wrtc
                  };
                  _this2.peer = new Peer(options);
                  _this2.peer.signal(offer);
                  _this2.peer.on(rtc.signal, function (data) {
                    resolve(data);
                  });
                }));

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function answer(_x4) {
        return _ref2.apply(this, arguments);
      }

      return answer;
    }()

    /**
     * Given a WebRTC answer object, complete WebRTC connection.
     * @param  {Object} answer - WebRTC answer object created by answer()
     */

  }, {
    key: 'connect',
    value: function connect(answer) {
      this.peer.signal(answer);
    }

    /**
     * Disconnect from current WebRTC connection
     */

  }, {
    key: 'disconnect',
    value: function disconnect() {
      this.peer.destroy();
    }

    /**
     * On @sigal event sent via WebRTC, perform given fn
     * @param  {String} signal - WebRTC signal/event. E.g. 'data'
     * @param  {Function} fn - Callback function to perform on signal event
     */

  }, {
    key: 'on',
    value: function on(signal$$1, fn) {
      this.peer.on(signal$$1, fn);
    }
  }]);
  return WebRTCConnection;
}();

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
      var wrtc$$1 = {
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
      if (!wrtc$$1.RTCPeerConnection) return null;
      return wrtc$$1;
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

/* eslint-disable */

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
    _this.generateKeys();
    _this.socket = new WebsocketConnection();
    _this.peer = new WebRTCConnection();
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

    // this.io = options.io || io;
    // this.Peer = options.wrtc || SimplePeer;
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


  createClass(MewConnectInitiator, [{
    key: 'generateKeys',
    value: function generateKeys() {
      var keys = CryptoUtils.generateKeys();
      this.publicKey = keys.publicKey;
      this.privateKey = keys.privateKey;
      this.connId = CryptoUtils.generateConnId(this.publicKey);
      this.signed = CryptoUtils.signMessage(this.privateKey, this.privateKey);
    }

    /*
    ===================================================================================
    Encryption
    ===================================================================================
    */

    /**
     * Using the generated privateKey, encrypt a message.
     * The message must be a String, however, if an object is given,
     * it will become stringified for proper encryption.
     *
     * @param  {Object} message - String or Object to be encrypted
     * @return {Object} - Encrypted message
     */

  }, {
    key: 'encrypt',
    value: function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(message) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                message = typeof message === 'String' ? message : JSON.stringify(message);
                _context.next = 3;
                return CryptoUtils.encrypt(message, this.privateKey);

              case 3:
                return _context.abrupt('return', _context.sent);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function encrypt(_x2) {
        return _ref.apply(this, arguments);
      }

      return encrypt;
    }()

    /**
     * Decrypt an encrypted message using the generated privateKey.
     *
     * @param  {Object} message - Message to be decrypted.
     * @return {Object} - Decrypted message object
     */

  }, {
    key: 'decrypt',
    value: function () {
      var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(message) {
        var decryptedMessageString;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return CryptoUtils.decrypt(message, this.privateKey);

              case 2:
                decryptedMessageString = _context2.sent;
                return _context2.abrupt('return', JSON.parse(decryptedMessageString));

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function decrypt(_x3) {
        return _ref2.apply(this, arguments);
      }

      return decrypt;
    }()

    /*
    ===================================================================================
    Websocket
    ===================================================================================
    */

    /**
     * Given a @websocketURL, attempt to connect with given query param @options.
     * If no options are given, default to -what should- be the correct parameters.
     *
     * @param  {String} websocketURL - WS/WSS websocket URL
     * @param  {Object} options - (Optional) Connection query parameters
     */

  }, {
    key: 'connect',
    value: function () {
      var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(websocketURL) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var queryOptions;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!websocketURL) websocketURL = 'wss://0ec2scxqck.execute-api.us-west-1.amazonaws.com/dev';
                queryOptions = options ? options : {
                  role: this.jsonDetails.stages.initiator,
                  connId: this.connId,
                  signed: this.signed
                };
                _context3.next = 4;
                return this.socket.connect(websocketURL, queryOptions);

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function connect(_x5) {
        return _ref3.apply(this, arguments);
      }

      return connect;
    }()

    /**
     * Bind a particular websocket signal/event to a given callback function.
     *
     * @param  {String} signal - Signal to listen to. E.g. 'onoffer'
     * @param  {Function} fn - Callback function to perform on given signal
     */

  }, {
    key: 'socketOn',
    value: function socketOn(signal, fn) {
      this.socket.on(signal, fn);
    }

    /**
     * Unbind listening to a particular signal that was bound in on()
     * @param  {String} signal - Signal to stop listening to. E.g. 'onoffer'
     */

  }, {
    key: 'socketOff',
    value: function socketOff(signal) {
      this.socket.off(signal);
    }

    /**
     * Emit a @signal event with a given @data payload.
     *
     * @param  {String} signal - Signal to emit. E.g. 'offersignal'
     * @param  {Object} data - Data/message payload to send
     */

  }, {
    key: 'socketEmit',
    value: function socketEmit(signal, data) {
      this.socket.send(signal, data);
    }

    /*
    ===================================================================================
      WebRTC
    ===================================================================================
    */

    /**
     * Attempt to create a WebRTC Offer.
     * Return the encrypted offer for transmission to the receiver.
     *
     * @return {Object} - Encrypted WebRTC offer
     */

  }, {
    key: 'offer',
    value: function () {
      var _ref4 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var offer;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.peer.offer(options);

              case 2:
                offer = _context4.sent;
                _context4.next = 5;
                return this.encrypt(offer);

              case 5:
                return _context4.abrupt('return', _context4.sent);

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function offer() {
        return _ref4.apply(this, arguments);
      }

      return offer;
    }()

    /**
     * Given a WebRTC response from the receiver, complete p2p connection.
     *
     * @param  {Object} answer - WebRTC answer created by receiver
     */

  }, {
    key: 'signal',
    value: function () {
      var _ref5 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(answer) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.peer.connect(answer);

              case 2:
                return _context5.abrupt('return', _context5.sent);

              case 3:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function signal(_x7) {
        return _ref5.apply(this, arguments);
      }

      return signal;
    }()

    /**
     * Disconnect from current WebRTC connection
     */

  }, {
    key: 'disconnectRTC',
    value: function () {
      var _ref6 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                this.peer = new WebRTCConnection();

              case 1:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function disconnectRTC() {
        return _ref6.apply(this, arguments);
      }

      return disconnectRTC;
    }()

    /**
     * On a given @signal event from the WebRTC connection, perform callback function.
     *
     * @param  {String} signal - Signal to listen to. E.g. 'data'
     * @param  {Function} fn - Callback function to perform
     */

  }, {
    key: 'onRTC',
    value: function onRTC(signal, fn) {
      this.peer.on(signal, fn);
    }

    //==========================================================================================
    //==========================================================================================
    //==========================================================================================

  }, {
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
      var _ref7 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!(this.signalUrl === null)) {
                  _context7.next = 2;
                  break;
                }

                throw Error('regenerateCode called before initial code generation');

              case 2:
                this.socketDisconnect();
                this.initiatorStart(this.signalUrl);

              case 4:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function regenerateCode() {
        return _ref7.apply(this, arguments);
      }

      return regenerateCode;
    }()
  }, {
    key: 'useFallback',
    value: function () {
      var _ref8 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                this.socketEmit(this.signals.tryTurn, { connId: this.connId });

              case 1:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function useFallback() {
        return _ref8.apply(this, arguments);
      }

      return useFallback;
    }()

    // Initalize a websocket connection with the signal server

  }, {
    key: 'initiatorStart',
    value: function () {
      var _ref9 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(url) {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (this.signalUrl === null) {
                  this.signalUrl = url;
                }
                this.generateKeys();

                _context9.next = 4;
                return this.initiatorConnect(this.socket);

              case 4:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function initiatorStart(_x8) {
        return _ref9.apply(this, arguments);
      }

      return initiatorStart;
    }()

    // ------------- WebSocket Communication Methods and Handlers ------------------------------

    // ----- Wrapper around Socket.IO methods
    // socket.emit wrapper
    // socketEmit(signal, data) {
    //   this.socket.binary(false).emit(signal, data);
    // }

    // socket.disconnect wrapper

  }, {
    key: 'socketDisconnect',
    value: function socketDisconnect() {
      this.socket.disconnect();
      this.socketConnected = false;
    }

    // socket.on listener registration wrapper
    /**
     * Bind a particular websocket signal/event to a given callback function.
     *
     * @param  {String} signal - Signal to listen to. E.g. 'onoffer'
     * @param  {Function} fn - Callback function to perform on given signal
     */
    // on(signal, fn) {
    //   this.socket.on(signal, fn)
    // }
    // socketOn(signal, func) {
    //   this.socket.on(signal, func);
    // }

    // ----- Setup handlers for communication with the signal server

  }, {
    key: 'initiatorConnect',
    value: function () {
      var _ref10 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(socket) {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                debugStages('INITIATOR CONNECT');
                this.uiCommunicator(this.lifeCycle.SocketConnectedEvent);
                this.signalUrl = 'wss://0ec2scxqck.execute-api.us-west-1.amazonaws.com/dev';
                _context10.next = 5;
                return this.connect(this.signalUrl);

              case 5:

                // const initiatorInitiated = new Promise((resolve, reject) => {
                //   this.initiator.on(this.jsonDetails.signals.initiated, resolve)
                // });
                /*
                    const initiatorConfimation = new Promise((resolve, reject) => {
                      this.initiator.on(this.jsonDetails.signals.confirmation, resolve);
                    });
                
                    const initiatorConnect = new Promise((resolve, reject) => {
                      this.initiator.onRTC(this.jsonDetails.rtc.connect, resolve);
                    });
                
                    const offer = await this.initiator.offer();
                    const message = { data: offer };
                    this.initiator.send(this.jsonDetails.signals.offerSignal, message);
                
                    const initiatorReceiveAnswer = new Promise((resolve, reject) => {
                      this.initiator.on(this.jsonDetails.signals.answer, async data => {
                        const webRTCAnswer = await this.initiator.decrypt(data.data);
                        resolve(webRTCAnswer);
                      });
                    });*/

                // this.socket.on(this.signals.connect, () => {
                //   debugStages('SOCKET CONNECTED');
                //   this.socketConnected = true;
                // });
                this.socketOn(this.signals.initiated, this.initiated.bind(this)); // response

                this.socketOn(this.signals.confirmation, this.sendOffer.bind(this)); // response
                this.socketOn(this.signals.answer, this.recieveAnswer.bind(this));
                this.socketOn(this.signals.confirmationFailedBusy, this.busyFailure.bind(this));
                this.socketOn(this.signals.confirmationFailed, this.confirmationFailure.bind(this));
                this.socketOn(this.signals.invalidConnection, this.invalidFailure.bind(this));
                this.socketOn(this.signals.disconnect, this.socketDisconnectHandler.bind(this));
                // this.socketOn(this.signals.attemptingTurn, this.willAttemptTurn.bind(this));
                // this.socketOn(this.signals.turnToken, this.beginTurn.bind(this));
                return _context10.abrupt('return', socket);

              case 13:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function initiatorConnect(_x9) {
        return _ref10.apply(this, arguments);
      }

      return initiatorConnect;
    }()
  }, {
    key: 'initiated',
    value: function initiated(data) {}

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
      var _ref11 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(data) {
        var offer, message;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return this.offer();

              case 2:
                offer = _context11.sent;
                message = { data: offer };

                this.socketEmit(this.signals.offerSignal, message);

              case 5:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function sendOffer(_x10) {
        return _ref11.apply(this, arguments);
      }

      return sendOffer;
    }()
  }, {
    key: 'initiatorSignalListener',
    value: function initiatorSignalListener(socket, options) {
      this.uiCommunicator(this.lifeCycle.sendOffer);
      debug('SIGNAL', JSON.stringify(data));
    }

    // Handle the WebRTC ANSWER from the opposite (mobile) peer

  }, {
    key: 'recieveAnswer',
    value: function () {
      var _ref12 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(data) {
        var webRTCAnswer;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                this.uiCommunicator(this.lifeCycle.answerReceived);
                _context12.next = 3;
                return this.decrypt(data.data);

              case 3:
                webRTCAnswer = _context12.sent;

                this.p.signal(webRTCAnswer);

              case 5:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function recieveAnswer(_x11) {
        return _ref12.apply(this, arguments);
      }

      return recieveAnswer;
    }()
  }, {
    key: 'rtcRecieveAnswer',
    value: function rtcRecieveAnswer(data) {
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
      var _ref13 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(peerID, data) {
        var decryptedData, parsed;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                debug('DATA RECEIVED', data.toString());
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

                  debug('DECRYPTED DATA RECEIVED 1', parsed);
                  this.emit(parsed.type, parsed.data);
                } else {
                  debug('DECRYPTED DATA RECEIVED 2', decryptedData);
                  this.emit(decryptedData.type, decryptedData.data);
                }
                _context13.next = 21;
                break;

              case 16:
                _context13.prev = 16;
                _context13.t0 = _context13['catch'](2);

                logger$2.error(_context13.t0);
                debug('onData ERROR: data=', data);
                debug('onData ERROR: data.toString()=', data.toString());

              case 21:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this, [[2, 16]]);
      }));

      function onData(_x12, _x13) {
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
      var _this3 = this;

      return function () {
        debug('[SEND RTC MESSAGE Closure] type:  ' + type + ',  message:  ' + msg);
        _this3.rtcSend(JSON.stringify({ type: type, data: msg }));
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
      var _this4 = this;

      return function () {
        debugStages('DISCONNECT RTC Closure');
        _this4.connected = false;
        _this4.uiCommunicator(_this4.lifeCycle.RtcDisconnectEvent);
        _this4.rtcDestroy();
        _this4.instance = null;
      };
    }

    // disconnectRTC() {
    //   debugStages('DISCONNECT RTC');
    //   this.connected = false;
    //   this.uiCommunicator(this.lifeCycle.RtcDisconnectEvent);
    //   this.rtcDestroy();
    //   this.instance = null;
    // }

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
                debug('SENDING RTC');
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

      function rtcSend(_x14) {
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
