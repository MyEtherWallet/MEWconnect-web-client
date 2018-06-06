const eccrypto = require('eccrypto/browser');
const ethUtils = require('ethereumjs-util');
const crypto = require('crypto');
const secp256k1 = require('secp256k1');
const buffer = require('buffer').Buffer;

/**
 *
 */
class MewConnectCrypto {
  // constructor(crypto, secp256k1, ethUtilities, buffer) {
  constructor(options) {
    // eslint-disable-next-line no-param-reassign
    options = options || {};
    this.crypto = options.crypto || crypto;
    this.secp256k1 = options.secp256k1 || secp256k1;
    this.ethUtil = options.ethUtils || ethUtils;
    this.Buffer = options.buffer || buffer;
    this.eccrypto = options.eccrypto || eccrypto;
  }

  static create() {
    return new MewConnectCrypto({
      crypto,
      secp256k1,
      ethUtils,
      buffer,
      eccrypto,
    });
  }

  /**
   *
   * @param pvtKey
   */
  setPrivate(pvtKey) {
    this.prvt = Buffer.from(pvtKey, 'hex');
    // console.log(this.prvt); // todo remove dev item
  }

  /**
   *
   * @returns {*}
   */
  generateMessage() {
    return this.crypto.randomBytes(32).toString('hex');
  }

  /**
   *
   * @returns {{pub, pvt}}
   */
  // Not the Address, but generate them for the connection check
  prepareKey() {
    this.prvt = this.generatePrivate(); // Uint8Array
    this.pub = this.generatePublic(this.prvt); // Uint8Array
    return this.addKey(this.pub, this.prvt);
  }

  /**
   *
   * @returns {*}
   */
  generatePrivate() {
    let privKey;
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
  generatePublic(privKey) {
    const pvt = new this.Buffer(privKey, 'hex');
    this.prvt = pvt;
    return this.secp256k1.publicKeyCreate(pvt);
  }

  /**
   *
   * @param dataToSend
   * @returns {Promise<string>}
   */
  encrypt(dataToSend) {
    const publicKeyA = eccrypto.getPublic(this.prvt);
    return new Promise((resolve, reject) => {
      this.eccrypto.encrypt(publicKeyA, this.Buffer.from(dataToSend))
        .then((_initial) => {
          resolve(_initial);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   *
   * @param dataToSee
   * @returns {Promise<string>}
   */
  decrypt(dataToSee) {
    return new Promise((resolve, reject) => {
      this.eccrypto.decrypt(this.prvt, {
        ciphertext: Buffer.from(dataToSee.ciphertext),
        ephemPublicKey: Buffer.from(dataToSee.ephemPublicKey),
        iv: Buffer.from(dataToSee.iv),
        mac: Buffer.from(dataToSee.mac),
      })
        .then((_initial) => {
          let result;
          try {
            if (this.isJSON(_initial)) {
              const humanRadable = JSON.parse(_initial);
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
            console.error(e);
          }
          console.log('decrypt', result); // todo remove dev item
          resolve(JSON.stringify(result));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   *
   * @param msgToSign
   * @returns {Promise<string>}
   */
  signMessage(msgToSign) {
    return new Promise((resolve, reject) => {
      try {
        // console.log('signMessage msgToSign', msgToSign);
        // console.log('Private Key', this.prvt.toString('hex')); // todo remove dev item
        const msg = this.ethUtil.hashPersonalMessage(this.ethUtil.toBuffer(msgToSign));
        const signed = this.ethUtil.ecsign(this.Buffer.from(msg), new this.Buffer(this.prvt, 'hex'));
        // eslint-disable-next-line max-len
        const combined = this.Buffer.concat([this.Buffer.from([signed.v]), this.Buffer.from(signed.r), this.Buffer.from(signed.s)]);
        const combinedHex = combined.toString('hex');
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
  addKey(pub, pvt) {
    // console.log({pub: pub, pvt: pvt});
    // console.log('public as hex', pub.toString('hex'));
    return { pub, pvt };
  }

  /**
   *
   * @param buf
   * @returns {string}
   */
  // eslint-disable-next-line class-methods-use-this
  bufferToConnId(buf) {
    // return "321"; //todo remove dev item
    return buf.toString('hex').slice(32); // todo uncomment after dev
  }
  // eslint-disable-next-line class-methods-use-this
  isJSON(arg) {
    try {
      JSON.parse(arg);
      return true;
    } catch (e) {
      return false;
    }
  }
}

module.exports = MewConnectCrypto;
