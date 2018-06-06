// require("babel-polyfill")
const MewConnectInitiator = require('./MewConnectInitiator');

class MewConnectInitiatorClient extends MewConnectInitiator {
  /**
   *  extensions to plug callbacks into specific events/occurrences
   *  without needing to construct separate checking mechanisms
   *  and expose a factory method.
   */
  constructor(uiCommunicatorFunc, loggingFunc, additionalLibs) {
    super(uiCommunicatorFunc, loggingFunc, additionalLibs);
    this.qrCodeString = null;
    this.addressCallback = null;
    this.signerCallback = null;
    this.messageSignerCallback = null;
    this.transactionSignerCallback = null;
    this.codeDisplayCallback = null;
    this.rtcConnectedCallback = null;
    this.rtcClosedCallback = null;
    this.connected = false;
    this.internalMiddlewareActive = false;
    this.internalLifeCycleActive = false;
  }

  /**
   * Factory Method that also attaches the created instance to
   * the creating static instance (I think...)
   */
  static init(uiCommunicatorFunc, loggingFunc, additionalLibs) {
    if (typeof MewConnect !== 'undefined') {
      // eslint-disable-next-line no-undef
      this.instance = new MewConnect(uiCommunicatorFunc, loggingFunc, additionalLibs);
    } else {
      // eslint-disable-next-line max-len
      this.instance = new MewConnectInitiatorClient(uiCommunicatorFunc, loggingFunc, additionalLibs);
    }
    return this.instance;
  }

  /**
   * @returns {MewConnect}
   */
  static get() {
    return this.instance;
  }

  isInternalMiddlewareActive() {
    return this.internalMiddlewareActive;
  }

  isInternalLifeCycleActive() {
    return this.internalLifeCycleActive;
  }

  /**
   * set a function to handle receipt of the address from the mobile (receiver) peer
   */
  setAddressCallback(func) {
    this.addressCallback = func;
  }

  /**
   * [don't believe this is used]
   * set a function to handle
   */
  // TODO check if this is used or useful
  setSignerCallback(func) {
    this.signerCallback = func;
  }

  /**
   * set a function to handle receipt of a signed message
   */
  setMessageSignerCallback(func) {
    this.messageSignerCallback = func;
  }

  /**
   * set a function to handle receipt of a signed transaction
   */
  setTransactionSignerCallback(func) {
    this.transactionSignerCallback = func;
  }

  /**
   * set a function to handle communicating lifeCycle events to the UI
   */
  setCommunicationFunction(uiCommunicationFunc) {
    this.uiCommunicatorFunc = uiCommunicationFunc;
  }

  /**
   * set a function to handle receipt of the connection detail string (i.e. used to make QR Code)
   */
  registerCodeDisplayCallback(func) {
    this.registerLifeCycleListener('codeDisplay', func);
  }

  /**
   * set a function to handle communicating the establishment of the WebRTC session
   */
  registerRtcConnectedCallback(func) {
    this.registerLifeCycleListener('RtcConnectedEvent', func);
  }

  /**
   * set a function to handle communicating the WebRTC session closing
   */
  registerRtcClosedCallback(func) {
    this.registerLifeCycleListener('RtcClosedEvent', func);
  }

  /**
   * Call the defined lifeCycle handler functions if they exist, else proceed with
   * applying lifeCycle middleware until one handles the message type (purpose) or it is not handled
   */
  configureInternalLifecycle() {
    if (!this.internalLifeCycleActive) {
      this.internalLifeCycleActive = true;
      this.use((data, next) => {
        if (data) {
          if (data.type) {
            switch (data.type) {
              case 'codeDisplay':
                if (!this.codeDisplayCallback) {
                  next();
                } else {
                  this.codeDisplayCallback(data.data);
                }
                break;
              case 'RtcConnectedEvent':
                this.connected = true;
                // if (this.instance) this.instance.connected = true;
                if (!this.rtcConnectedCallback) {
                  next();
                } else {
                  this.rtcConnectedCallback(data.data);
                }
                break;
              // case "rtcDisconnect":
              // case "RtcDisconnectEvent":
              case 'RtcClosedEvent':
                if (!this.rtcClosedCallback) {
                  next();
                } else {
                  this.rtcClosedCallback(data.data);
                }
                break;
              default:
                next();
                break;
            }
          } else {
            next();
          }
        } else {
          next();
        }
      });
    }
  }

  /**
   * Call a defined message type handler function if it exist, else proceed with
   * applying message middleware until one handles the message type (purpose) or it is not handled
   */
  configureInternalMiddleware() {
    if (!this.internalMiddlewareActive) {
      this.internalMiddlewareActive = true;
      this.use((data, next) => {
        if (data) {
          if (data.type) {
            switch (data.type) {
              case 'address':
                if (!this.addressCallback) {
                  next();
                } else {
                  this.addressCallback(data.data);
                }
                break;
              case 'sign':
                if (!this.signerCallback) {
                  next();
                } else {
                  this.signerCallback(data.data);
                }
                break;
              case 'signMessage':
                if (!this.messageSignerCallback) {
                  next();
                } else {
                  this.messageSignerCallback(data.data);
                }
                break;
              case 'signTx':
                if (!this.transactionSignerCallback) {
                  next();
                } else {
                  this.transactionSignerCallback(data.data);
                }
                break;
              default:
                next();
                break;
            }
          } else {
            next();
          }
        } else {
          next();
        }
      });
    }
  }
}

module.exports = MewConnectInitiatorClient;
