'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var eccrypto = require('eccrypto/browser');
var ethUtils = require('ethereumjs-util');
var crypto = require('crypto');
var secp256k1 = require('secp256k1');
var buffer = require('buffer').Buffer;

var logger = (0, _logging2.default)('MewCrypto');
/**
 *
 */

var MewConnectCrypto = function () {
  // constructor(crypto, secp256k1, ethUtilities, buffer) {
  function MewConnectCrypto(options) {
    _classCallCheck(this, MewConnectCrypto);

    // eslint-disable-next-line no-param-reassign
    options = options || {};
    this.crypto = options.crypto || crypto;
    this.secp256k1 = options.secp256k1 || secp256k1;
    this.ethUtil = options.ethUtils || ethUtils;
    this.Buffer = options.buffer || buffer;
    this.eccrypto = options.eccrypto || eccrypto;
  }

  _createClass(MewConnectCrypto, [{
    key: 'setPrivate',


    /**
     *
     * @param pvtKey
     */
    value: function setPrivate(pvtKey) {
      this.prvt = Buffer.from(pvtKey, 'hex');
    }

    /**
     *
     * @returns {*}
     */

  }, {
    key: 'generateMessage',
    value: function generateMessage() {
      return this.crypto.randomBytes(32).toString('hex');
    }

    /**
     *
     * @returns {{pub, pvt}}
     */
    // Not the Address, but generate them for the connection check

  }, {
    key: 'prepareKey',
    value: function prepareKey() {
      this.prvt = this.generatePrivate(); // Uint8Array
      this.pub = this.generatePublic(this.prvt); // Uint8Array
      return this.addKey(this.pub, this.prvt);
    }

    /**
     *
     * @returns {*}
     */

  }, {
    key: 'generatePrivate',
    value: function generatePrivate() {
      var privKey = void 0;
      do {
        privKey = this.crypto.randomBytes(32);
      } while (!this.secp256k1.privateKeyVerify(privKey));
      return privKey;
    }

    /**
     *
     * @param privKey
     * @returns {*}
     */

  }, {
    key: 'generatePublic',
    value: function generatePublic(privKey) {
      var pvt = new this.Buffer(privKey, 'hex');
      this.prvt = pvt;
      return this.secp256k1.publicKeyCreate(pvt);
    }

    /**
     *
     * @param dataToSend
     * @returns {Promise<string>}
     */

  }, {
    key: 'encrypt',
    value: function encrypt(dataToSend) {
      var _this = this;

      var publicKeyA = eccrypto.getPublic(this.prvt);
      return new Promise(function (resolve, reject) {
        _this.eccrypto.encrypt(publicKeyA, _this.Buffer.from(dataToSend)).then(function (_initial) {
          resolve(_initial);
        }).catch(function (error) {
          reject(error);
        });
      });
    }

    /**
     *
     * @param dataToSee
     * @returns {Promise<string>}
     */

  }, {
    key: 'decrypt',
    value: function decrypt(dataToSee) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.eccrypto.decrypt(_this2.prvt, {
          ciphertext: Buffer.from(dataToSee.ciphertext),
          ephemPublicKey: Buffer.from(dataToSee.ephemPublicKey),
          iv: Buffer.from(dataToSee.iv),
          mac: Buffer.from(dataToSee.mac)
        }).then(function (_initial) {
          var result = void 0;
          try {
            if (_this2.isJSON(_initial)) {
              var humanRadable = JSON.parse(_initial);
              if (Array.isArray(humanRadable)) {
                // eslint-disable-next-line prefer-destructuring
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
          // logger.debug('decrypt', result);
          resolve(JSON.stringify(result));
        }).catch(function (error) {
          reject(error);
        });
      });
    }

    /**
     *
     * @param msgToSign
     * @returns {Promise<string>}
     */

  }, {
    key: 'signMessage',
    value: function signMessage(msgToSign) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        try {
          var msg = _this3.ethUtil.hashPersonalMessage(_this3.ethUtil.toBuffer(msgToSign));
          var signed = _this3.ethUtil.ecsign(_this3.Buffer.from(msg), new _this3.Buffer(_this3.prvt, 'hex'));
          // eslint-disable-next-line max-len
          var combined = _this3.Buffer.concat([_this3.Buffer.from([signed.v]), _this3.Buffer.from(signed.r), _this3.Buffer.from(signed.s)]);
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

  }, {
    key: 'addKey',
    value: function addKey(pub, pvt) {
      // console.log({pub: pub, pvt: pvt});
      // console.log('public as hex', pub.toString('hex'));
      return { pub: pub, pvt: pvt };
    }

    /**
     *
     * @param buf
     * @returns {string}
     */
    // eslint-disable-next-line class-methods-use-this

  }, {
    key: 'bufferToConnId',
    value: function bufferToConnId(buf) {
      return buf.toString('hex').slice(32);
    }
    // eslint-disable-next-line class-methods-use-this

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
      return new MewConnectCrypto({
        crypto: crypto,
        secp256k1: secp256k1,
        ethUtils: ethUtils,
        buffer: buffer,
        eccrypto: eccrypto
      });
    }
  }]);

  return MewConnectCrypto;
}();

module.exports = MewConnectCrypto;