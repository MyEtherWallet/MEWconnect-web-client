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

var _ethereumjsUtil = require('ethereumjs-util');

var _ethereumjsUtil2 = _interopRequireDefault(_ethereumjsUtil);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _secp256k = require('secp256k1');

var _secp256k2 = _interopRequireDefault(_secp256k);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

var eccrypto = require('eccrypto/browser');
// const ethUtils = require('ethereumjs-util');
// const crypto = require('crypto');
// const secp256k1 = require('secp256k1');
var buffer = require('buffer').Buffer;

var logger = (0, _logging2.default)('MewCrypto');

var MewConnectCrypto = (function() {
  function MewConnectCrypto() {
    var options =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, MewConnectCrypto);

    this.crypto = options.crypto || _crypto2.default;
    this.secp256k1 = options.secp256k1 || _secp256k2.default;
    this.ethUtil = options.ethUtils || _ethereumjsUtil2.default;
    this.Buffer = options.buffer || buffer;
    this.eccrypto = options.eccrypto || eccrypto;
  }

  _createClass(
    MewConnectCrypto,
    [
      {
        key: 'setPrivate',
        value: function setPrivate(pvtKey) {
          this.prvt = Buffer.from(pvtKey, 'hex');
        }
      },
      {
        key: 'generateMessage',
        value: function generateMessage() {
          return this.crypto.randomBytes(32).toString('hex');
        }

        // Not for the Address, but generate them for the connection check
      },
      {
        key: 'prepareKey',
        value: function prepareKey() {
          this.prvt = this.generatePrivate(); // Uint8Array
          this.pub = this.generatePublic(this.prvt); // Uint8Array
          return { pub: this.pub, pvt: this.prvt }; // this.addKey(this.pub, this.prvt);
        }
      },
      {
        key: 'generatePrivate',
        value: function generatePrivate() {
          var privKey = void 0;
          do {
            privKey = this.crypto.randomBytes(32);
          } while (!this.secp256k1.privateKeyVerify(privKey));
          return privKey;
        }
      },
      {
        key: 'generatePublic',
        value: function generatePublic(privKey) {
          var pvt = new this.Buffer(privKey, 'hex');
          this.prvt = pvt;
          return this.secp256k1.publicKeyCreate(pvt);
        }
      },
      {
        key: 'encrypt',
        value: function encrypt(dataToSend) {
          var _this = this;

          var publicKeyA = eccrypto.getPublic(this.prvt);
          return new Promise(function(resolve, reject) {
            _this.eccrypto
              .encrypt(publicKeyA, _this.Buffer.from(dataToSend))
              .then(function(_initial) {
                resolve(_initial);
              })
              .catch(function(error) {
                reject(error);
              });
          });
        }
      },
      {
        key: 'decrypt',
        value: function decrypt(dataToSee) {
          var _this2 = this;

          return new Promise(function(resolve, reject) {
            _this2.eccrypto
              .decrypt(_this2.prvt, {
                ciphertext: Buffer.from(dataToSee.ciphertext),
                ephemPublicKey: Buffer.from(dataToSee.ephemPublicKey),
                iv: Buffer.from(dataToSee.iv),
                mac: Buffer.from(dataToSee.mac)
              })
              .then(function(_initial) {
                var result = void 0;
                try {
                  if (_this2.isJSON(_initial)) {
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
                  logger.error(e);
                }
                resolve(JSON.stringify(result));
              })
              .catch(function(error) {
                reject(error);
              });
          });
        }
      },
      {
        key: 'signMessage',
        value: function signMessage(msgToSign) {
          var _this3 = this;

          return new Promise(function(resolve, reject) {
            try {
              var msg = _this3.ethUtil.hashPersonalMessage(
                _this3.ethUtil.toBuffer(msgToSign)
              );
              var signed = _this3.ethUtil.ecsign(
                _this3.Buffer.from(msg),
                new _this3.Buffer(_this3.prvt, 'hex')
              );
              var combined = _this3.Buffer.concat([
                _this3.Buffer.from([signed.v]),
                _this3.Buffer.from(signed.r),
                _this3.Buffer.from(signed.s)
              ]);
              var combinedHex = combined.toString('hex');
              resolve(combinedHex);
            } catch (e) {
              reject(e);
            }
          });
        }

        /**
         *
         * @param pub
         * @param pvt
         * @returns {{pub: *, pvt: *}}
         */
        // eslint-disable-next-line class-methods-use-this
        // addKey(pub, pvt) {
        //   // console.log({pub: pub, pvt: pvt});
        //   // console.log('public as hex', pub.toString('hex'));
        //   return { pub, pvt };
        // }

        /**
         *
         * @param buf
         * @returns {string}
         */
      },
      {
        key: 'bufferToConnId',
        value: function bufferToConnId(buf) {
          return buf.toString('hex').slice(32);
        }
      },
      {
        key: 'isJSON',
        value: function isJSON(arg) {
          try {
            JSON.parse(arg);
            return true;
          } catch (e) {
            return false;
          }
        }
      }
    ],
    [
      {
        key: 'create',
        value: function create() {
          return new MewConnectCrypto({
            crypto: _crypto2.default,
            secp256k1: _secp256k2.default,
            ethUtils: _ethereumjsUtil2.default,
            buffer: buffer,
            eccrypto: eccrypto
          });
        }
      }
    ]
  );

  return MewConnectCrypto;
})();

exports.default = MewConnectCrypto;
module.exports = exports['default'];
