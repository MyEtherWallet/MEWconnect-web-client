'use strict'

import CryptoUtils from '@utils/crypto-utils'
import WebsocketConnection from '@utils/websocket-connection'
import WebRTCConnection from '@utils/webrtc-connection'
import { stunServers, websocketURL } from '@config'
import { signals, rtcSignals, roles } from '@signals'

export default class Initiator {
  constructor(options = {}) {
    this.socket = new WebsocketConnection()
    this.peer = new WebRTCConnection()

    this.publicKey
    this.privateKey
    this.signed
    this.connId
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
  generateKeys() {
    const keys = CryptoUtils.generateKeys()
    this.publicKey = keys.publicKey
    this.privateKey = keys.privateKey
    this.connId = CryptoUtils.generateConnId(this.publicKey)
    this.signed = CryptoUtils.signMessage(this.privateKey, this.privateKey)
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
  async encrypt(message) {
    message = typeof message === 'String' ? message : JSON.stringify(message)
    return await CryptoUtils.encrypt(message, this.privateKey)
  }

  /**
   * Decrypt an encrypted message using the generated privateKey.
   *
   * @param  {Object} message - Message to be decrypted.
   * @return {Object} - Decrypted message object
   */
  async decrypt(message) {
    const decryptedMessageString = await CryptoUtils.decrypt(
      message,
      this.privateKey
    )
    return JSON.parse(decryptedMessageString)
  }

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
  async connect(websocketURL, options = null) {
    const queryOptions = options
      ? options
      : {
          role: roles.initiator,
          connId: this.connId,
          signed: this.signed
        }
    await this.socket.connect(websocketURL, queryOptions)
  }

  /**
   * Bind a particular websocket signal/event to a given callback function.
   *
   * @param  {String} signal - Signal to listen to. E.g. 'onoffer'
   * @param  {Function} fn - Callback function to perform on given signal
   */
  on(signal, fn) {
    this.socket.on(signal, fn)
  }

  /**
   * Unbind listening to a particular signal that was bound in on()
   * @param  {String} signal - Signal to stop listening to. E.g. 'onoffer'
   */
  off(signal) {
    this.socket.off(signal)
  }

  /**
   * Emit a @signal event with a given @data payload.
   *
   * @param  {String} signal - Signal to emit. E.g. 'offersignal'
   * @param  {Object} data - Data/message payload to send
   */
  send(signal, data) {
    this.socket.send(signal, data)
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
  async offer(options = null) {
    const offer = await this.peer.offer(options)
    return await this.encrypt(offer)
  }

  /**
   * Given a WebRTC response from the receiver, complete p2p connection.
   *
   * @param  {Object} answer - WebRTC answer created by receiver
   */
  async signal(answer) {
    return await this.peer.connect(answer)
  }

  /**
   * Disconnect from current WebRTC connection
   */
  async disconnectRTC() {
    this.peer = new WebRTCConnection()
  }

  /**
   * On a given @signal event from the WebRTC connection, perform callback function.
   *
   * @param  {String} signal - Signal to listen to. E.g. 'data'
   * @param  {Function} fn - Callback function to perform
   */
  onRTC(signal, fn) {
    this.peer.on(signal, fn)
  }
}
