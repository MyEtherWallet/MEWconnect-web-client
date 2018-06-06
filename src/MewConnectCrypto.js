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
    options = options || {};
    this.crypto = options.crypto || crypto;
    this.secp256k1 = options.secp256k1 || secp256k1;
    this.ethUtil = options.ethUtils || ethUtils;
    this.buffer = options.buffer || buffer;
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

  /**
   *
   * @param pvtKey
   */
  setPrivate(pvtKey) {
    this.prvt = new Buffer(pvtKey, 'hex');
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
  };

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
    let pvt = new this.buffer(privKey, 'hex');
    this.prvt = pvt;
    return this.secp256k1.publicKeyCreate(pvt);
  }

  /**
   *
   * @param dataToSend
   * @returns {Promise<string>}
   */
  encrypt(dataToSend) {
    var publicKeyA = eccrypto.getPublic(this.prvt);
    return new Promise((resolve, reject) => {
      this.eccrypto.encrypt(publicKeyA, this.buffer.from(dataToSend))
        .then(_initial => {
          resolve(_initial);
        })
        .catch(error => {
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
        ciphertext: new Buffer(dataToSee.ciphertext),
        ephemPublicKey: new Buffer(dataToSee.ephemPublicKey),
        iv: new Buffer(dataToSee.iv),
        mac: new Buffer(dataToSee.mac)
      })
        .then(_initial => {
          let result;
          try {
            if(this.isJSON(_initial)){
              let humanRadable = JSON.parse(_initial);
              if (Array.isArray(humanRadable)) {
                result = humanRadable[0]
              } else {
                result = humanRadable
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
        .catch(error => {
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
      // console.log('signMessage msgToSign', msgToSign);
      // console.log('Private Key', this.prvt.toString('hex')); // todo remove dev item
      let msg = this.ethUtil.hashPersonalMessage(this.ethUtil.toBuffer(msgToSign));
      let signed = this.ethUtil.ecsign(this.buffer.from(msg), new this.buffer(this.prvt, 'hex'));
      var combined = this.buffer.concat([this.buffer.from([signed.v]), this.buffer.from(signed.r), this.buffer.from(signed.s)]);
      let combinedHex = combined.toString('hex');
      // console.log('signed', signed); // todo remove dev item
      // console.log('combinedHex', combinedHex); // todo remove dev item
      resolve(combinedHex);
      // this.ethUtil.hashPersonalMessage(this.ethUtil.toBuffer(msgToSign))
      //   .then(_msg  =>{
      //     return this.ethUtil.ecsign(this.buffer.from(_msg), new this.buffer(this.prvt, 'hex'));
      //   })
      //   .then(_signed  =>{
      //     let combined = this.buffer.concat([this.buffer.from([_signed.v]), this.buffer.from(_signed.r), this.buffer.from(_signed.s)]);
      //     let combinedHex = combined.toString('hex');
      //     resolve(combinedHex)
      //   })
    });
  }

  /**
   *
   * @param pub
   * @param pvt
   * @returns {{pub: *, pvt: *}}
   */
  addKey(pub, pvt) {
    // console.log({pub: pub, pvt: pvt});
    // console.log('public as hex', pub.toString('hex'));
    return {pub: pub, pvt: pvt};
  }

  /**
   *
   * @param buf
   * @returns {string}
   */
  bufferToConnId(buf) {
    // return "321"; //todo remove dev item
    return buf.toString('hex').slice(32); //todo uncomment after dev
  }

  isJSON(arg){
    try{
      JSON.parse(arg)
      return true;
    } catch (e) {
      return false;
    }
  }

}

module.exports = MewConnectCrypto;