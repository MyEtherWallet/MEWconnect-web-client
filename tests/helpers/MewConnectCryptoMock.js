import ethUtils from 'ethereumjs-utils';
import crypto from 'crypto';
import secp256k1 from 'secp256k1';

const privateStr =
  '6d96ff74ad12467b3ebd993f6b0927d6996d464900bbd63de866b3090cb36d2b';
const pubStr =
  '035892d28938ebe58339649fdaef273953b0b1f5d68bfb7422adf41d5993d9e20d';
export default class MewConnectCrypto {
  static create() {
    return new MewConnectCrypto();
  }

  setPrivate(pvtKey) {
    this.prvt = Buffer.from(pvtKey, 'hex');
  }

  generateMessage() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Not for the Address, but generate them for the connection check
  prepareKey() {
    this.prvt = Buffer.from(privateStr, 'hex');
    this.pub = Buffer.from(pubStr, 'hex');
    return { pub: this.pub, pvt: this.prvt };
  }

  generatePrivate() {
    return Buffer.from(privateStr, 'hex');
  }

  generatePublic() {
    const pvt = Buffer.from(privateStr, 'hex');
    this.prvt = pvt;
    return secp256k1.publicKeyCreate(pvt);
  }

  encrypt(dataToSend) {
    return new Promise(resolve => {
      resolve(dataToSend);
    });
  }

  decrypt(dataToSee) {
    return new Promise(resolve => {
      resolve(dataToSee);
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
