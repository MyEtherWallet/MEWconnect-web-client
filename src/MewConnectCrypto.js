import createLogger from 'logging';
import ethUtils from 'ethereumjs-util';
import crypto from 'crypto';
import secp256k1 from 'secp256k1';

const eccrypto = require('eccrypto/browser');
// const ethUtils = require('ethereumjs-util');
// const crypto = require('crypto');
// const secp256k1 = require('secp256k1');
const buffer = require('buffer').Buffer;

const logger = createLogger('MewCrypto');

export default class MewConnectCrypto {
  constructor(options = {}) {
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
      eccrypto
    });
  }

  setPrivate(pvtKey) {
    this.prvt = Buffer.from(pvtKey, 'hex');
  }

  generateMessage() {
    return this.crypto.randomBytes(32).toString('hex');
  }

  // Not for the Address, but generate them for the connection check
  prepareKey() {
    this.prvt = this.generatePrivate(); // Uint8Array
    this.pub = this.generatePublic(this.prvt); // Uint8Array
    return { pub: this.pub, pvt: this.prvt }; // this.addKey(this.pub, this.prvt);
  }

  generatePrivate() {
    let privKey;
    do {
      privKey = this.crypto.randomBytes(32);
    } while (!this.secp256k1.privateKeyVerify(privKey));
    return privKey;
  }

  generatePublic(privKey) {
    const pvt = new this.Buffer(privKey, 'hex');
    this.prvt = pvt;
    return this.secp256k1.publicKeyCreate(pvt);
  }

  encrypt(dataToSend) {
    const publicKeyA = eccrypto.getPublic(this.prvt);
    return new Promise((resolve, reject) => {
      this.eccrypto
        .encrypt(publicKeyA, this.Buffer.from(dataToSend))
        .then(_initial => {
          resolve(_initial);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  decrypt(dataToSee) {
    return new Promise((resolve, reject) => {
      this.eccrypto
        .decrypt(this.prvt, {
          ciphertext: Buffer.from(dataToSee.ciphertext),
          ephemPublicKey: Buffer.from(dataToSee.ephemPublicKey),
          iv: Buffer.from(dataToSee.iv),
          mac: Buffer.from(dataToSee.mac)
        })
        .then(_initial => {
          let result;
          try {
            if (this.isJSON(_initial)) {
              const humanRadable = JSON.parse(_initial);
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
        .catch(error => {
          reject(error);
        });
    });
  }

  signMessage(msgToSign) {
    return new Promise((resolve, reject) => {
      try {
        const msg = this.ethUtil.hashPersonalMessage(
          this.ethUtil.toBuffer(msgToSign)
        );
        const signed = this.ethUtil.ecsign(
          this.Buffer.from(msg),
          new this.Buffer(this.prvt, 'hex')
        );
        const combined = this.Buffer.concat([
          this.Buffer.from([signed.v]),
          this.Buffer.from(signed.r),
          this.Buffer.from(signed.s)
        ]);
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
  bufferToConnId(buf) {
    return buf.toString('hex').slice(32);
  }

  isJSON(arg) {
    try {
      JSON.parse(arg);
      return true;
    } catch (e) {
      return false;
    }
  }
}
