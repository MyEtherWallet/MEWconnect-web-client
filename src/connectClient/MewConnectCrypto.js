import createLogger from 'logging';

import eccrypto from 'eccrypto';
import ethUtils from 'ethereumjs-util';
import crypto from 'crypto';
import secp256k1 from 'secp256k1';

const logger = createLogger('MewCrypto');

export default class MewConnectCrypto {
  static create() {
    return new MewConnectCrypto();
  }

  setPrivate(pvtKey) {
    this.prvt = Buffer.from(pvtKey, 'hex');
    this.pub = this.generatePublic(this.prvt);
    return { publicKey: this.pub, privateKey: this.prvt };
  }

  generateMessage() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Not for the Address, but generate them for the connection check
  prepareKey() {
    this.prvt = this.generatePrivate();
    this.pub = this.generatePublic(this.prvt);
    return { pub: this.pub, pvt: this.prvt };
  }

  generateKeys() {
    this.prvt = this.generatePrivate();
    this.pub = this.generatePublic(this.prvt);
    return { publicKey: this.pub, privateKey: this.prvt };
  }

  generatePrivate() {
    let privKey;
    do {
      privKey = crypto.randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privKey));
    return privKey;
  }

  generatePublic(privKey) {
    const pvt = Buffer.from(privKey, 'hex');
    this.prvt = pvt;
    return secp256k1.publicKeyCreate(pvt);
  }

  encrypt(dataToSend) {
    const publicKeyA = eccrypto.getPublic(this.prvt);
    return new Promise((resolve, reject) => {
      eccrypto
        .encrypt(publicKeyA, Buffer.from(dataToSend))
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
      eccrypto
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
        const msg = ethUtils.hashPersonalMessage(ethUtils.toBuffer(msgToSign));
        const signed = ethUtils.ecsign(
          Buffer.from(msg),
          Buffer.from(this.prvt, 'hex')
        );
        const combined = Buffer.concat([
          Buffer.from([signed.v]),
          Buffer.from(signed.r),
          Buffer.from(signed.s)
        ]);
        const combinedHex = combined.toString('hex');
        resolve(combinedHex);
      } catch (e) {
        reject(e);
      }
    });
  }

  signMessageSync(msgToSign) {
    msgToSign = this.bufferToString(msgToSign);

    const msg = ethUtils.hashPersonalMessage(ethUtils.toBuffer(msgToSign));
    const signed = ethUtils.ecsign(
      Buffer.from(msg),
      Buffer.from(this.prvt, 'hex')
    );
    const combined = Buffer.concat([
      Buffer.from([signed.v]),
      Buffer.from(signed.r),
      Buffer.from(signed.s)
    ]);
    return combined.toString('hex');
  }

  bufferToConnId(buf) {
    return buf.toString('hex').slice(0, 32);
  }

  generateConnId(buf) {
    if (buf instanceof Buffer) {
      return buf.toString('hex').slice(0, 32);
    }
    return Buffer.from(buf)
      .toString('hex')
      .slice(0, 32);
  }

  isJSON(arg) {
    try {
      JSON.parse(arg);
      return true;
    } catch (e) {
      return false;
    }
  }

  toBuffer(buf) {
    if (buf instanceof Buffer) {
      return buf;
    }
    return Buffer.from(buf, 'hex');
  }

  bufferToString(buf) {
    if (buf instanceof Buffer) {
      return buf.toString('hex');
    }
    return buf;
  }
}
