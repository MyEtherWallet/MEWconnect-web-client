'use strict';

import queryString from 'query-string';
// uncomment below to run tests
// import WebSocket from 'promise-ws';
import 'isomorphic-ws';
import debugLogger from 'debug';

const debugPeer = debugLogger('MEWconnectVerbose:websocketWrapper');
const debug = debugLogger('MEWconnect:websocketWrapper');

export default class WebsocketConnection {
  constructor(options = {}) {
    this.options = options;
    this.socket = {};
    this.listeners = {};

    this.SOCKET_STATES = {
      0: 'CONNECTING',
      1: 'OPEN',
      2: 'CLOSING',
      3: 'CLOSED'
    };
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
  async connect(websocketUrl, options = {}) {
    try {
      const url = `${websocketUrl}?${queryString.stringify(options)}`;
      debug(url);
      if (typeof jest !== 'undefined' && typeof window === 'undefined') {
        const WebSocket = require('promise-ws').default;
        this.socket = await WebSocket.create(url);
        this.socket.on('message', this.onMessage.bind(this));
      } else {
        this.socket = new WebSocket(url);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onerror = this.onError.bind(this);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);

        debug(`extensions used: ${this.socket.extensions} or none`);
        debug(`protocol used: ${this.socket.protocol} or default`);
        debug(
          `binary type used: ${this.socket.binaryType} [either blob or arraybuffer]`
        );
      }
    } catch (e) {
      debug('connect error:', e);
    }
  }

  async disconnect() {
    try {
      debug('ADD DISCONNECT FUNCTIONALITY');
      this.socket.close();
    } catch (e) {
      debug('disconnect error:', e);
    }
  }

  getSocketState() {
    return this.SOCKET_STATES[this.socket.readyState];
  }

  onOpen() {
    debug(`websocket onopen = ${this.getSocketState()}`);
  }

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
  onMessage(message) {
    try {
      debugPeer('message', message);
      debugPeer('message data', message.data);
      let parsedMessage;
      if (typeof jest === 'undefined') {
        const parsedMessageRaw =
          typeof message === 'string' ? JSON.parse(message) : message;
        parsedMessage =
          typeof parsedMessageRaw.data === 'string'
            ? JSON.parse(parsedMessageRaw.data)
            : parsedMessageRaw.data;
        debugPeer('parsedMessage', parsedMessage);
      } else {
        parsedMessage =
          typeof message === 'string' ? JSON.parse(message) : message;
        debugPeer('parsedMessage: message', parsedMessage);
        debugPeer('parsedMessage: message data', parsedMessage.data);
      }

      const signal = parsedMessage.signal;
      const data = parsedMessage.data;
      debug(`onMessage Signal: ${signal}`);
      try {
        this.listeners[signal].call(this, data);
      } catch (e) {
        debug(e);
        // Unhandled message signal
      }
    } catch (e) {
      debug('ERROR in onMessage', e);
    }
  }

  onError(errorEvent) {
    debug('Websocket ERROR');
    debug('websocket error event', errorEvent);
  }

  onClose() {
    debug(`websocket onClose = ${this.getSocketState()}`);
  }

  /**
   * Bind an function to a particular message signal event.
   * E.G.
   * socket.on('error', err => {})
   *
   * @param  {String} signal - The signal to listen for
   * @param  {Function} fn - Function to perform on message signal
   */
  on(signal, fn) {
    this.listeners[signal] = fn;
  }

  /**
   * Unbind a particular message signal event listener.
   *
   * @param  {String} signal - The signal to unbind
   */
  off(signal) {
    delete this.listeners[signal];
  }

  /**
   * Send a data payload to a particular signal.
   *
   * @param  {String} signal - Particular action/signal such as "offersignal"
   * @param  {[type]} data - Data payload
   */
  send(signal, data = {}) {
    try {
      debug(`socket connection state: ${this.getSocketState()}`);
      debug(`send signal: ${signal}`);
      debug('send data:', data);
      const message = JSON.stringify({
        action: signal,
        data: data
      });
      this.socket.send(message);
    } catch (e) {
      debug('ERROR in send', e);
    }
  }
}
