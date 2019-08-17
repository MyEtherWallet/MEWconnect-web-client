'use strict'

import crypto from 'crypto'
import eccrypto from 'eccrypto'
import ethUtils from 'ethereumjs-util'
import secp256k1 from 'secp256k1'

export default (() => {
  /**
   * Generate a public/private keypair using secp256k1
   *
   * @return {Object} - publicKey/privateKey object
   */
  const generateKeys = () => {
    let privateKey = Buffer.from(crypto.randomBytes(32), 'hex')
    let publicKey = secp256k1.publicKeyCreate(privateKey)
    return {
      publicKey,
      privateKey
    }
  }

  /**
   * Generate a connId using given a public key
   *
   * @param  {String} publicKey - publicKey string (usually generated with generateKeys())
   * @return {String} - connId string
   */
  const generateConnId = publicKey => {
    return publicKey.toString('hex').slice(-32)
  }

  /**
   * Generate a random message of 32 bytes
   *
   * @return {String} - The randomly generated string
   */
  const generateRandomMessage = () => {
    return crypto.randomBytes(32).toString('hex')
  }

  const   bufferToString = (buf) => {
    if (buf instanceof Buffer) {
      return buf.toString('hex');
    }
    return buf;
  }

  /**
   * Sign a message using a privateKey
   *
   * @param  {String} msg - Message to sign/hash
   * @param  {[type]} privateKey - Private key (usually generated with generateKeys())
   * @return {String} - Signed message
   */
  const signMessage = (msg, privateKey) => {
    console.log(msg, privateKey); // todo remove dev item
    let hashedMsg = ethUtils.hashPersonalMessage(ethUtils.toBuffer(bufferToString(msg)))
    let signed = ethUtils.ecsign(
      Buffer.from(hashedMsg),
      Buffer.from(privateKey, 'hex')
    )
    let combined = Buffer.concat([
      Buffer.from([signed.v]),
      Buffer.from(signed.r),
      Buffer.from(signed.s)
    ])
    let combinedHex = combined.toString('hex')
    return combinedHex
  }

  /**
   * Encrypt a set of data given a private key using eccrypto
   *
   * @param  {Object/String} data - Data to encrypt
   * @param  {String} privateKey - Private key (usually generated with generateKeys())
   * @return {Object} - Encrypted data object with the following properties:
   *                    'ciphertext', 'ephemPublicKey', 'iv', 'mac'
   */
  const encrypt = async (data, privateKey) => {
    return new Promise((resolve, reject) => {
      let publicKey = eccrypto.getPublic(privateKey)
      eccrypto
        .encrypt(publicKey, Buffer.from(data))
        .then(encryptedData => {
          resolve(encryptedData)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  /**
   * Decrypt an encrypted data object given a private key using eccrypto
   *
   * @param  {Object} data - An encrypted data object (usually using the encrypt() function)
   * @param  {String} privateKey - Private key (usually generated with generateKeys())
   * @return {Object} - Decrypted data
   */
  const decrypt = async (data, privateKey) => {
    return new Promise((resolve, reject) => {
      eccrypto
        .decrypt(privateKey, {
          ciphertext: Buffer.from(data.ciphertext),
          ephemPublicKey: Buffer.from(data.ephemPublicKey),
          iv: Buffer.from(data.iv),
          mac: Buffer.from(data.mac)
        })
        .then(decrypted => {
          let result
          try {
            if (isJSON(decrypted)) {
              const humanRadable = JSON.parse(decrypted)
              if (Array.isArray(humanRadable)) {
                result = humanRadable[0]
              } else {
                result = humanRadable
              }
            } else {
              result = decrypted.toString()
            }
          } catch (e) {
            reject(e)
          }
          resolve(JSON.stringify(result))
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  const isJSON = arg => {
    try {
      JSON.parse(arg)
      return true
    } catch (e) {
      return false
    }
  }

  return {
    generateKeys,
    generateConnId,
    generateRandomMessage,
    signMessage,
    encrypt,
    decrypt
  }
})()
