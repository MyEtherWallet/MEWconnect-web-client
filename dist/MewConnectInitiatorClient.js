'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// require("babel-polyfill")
var MewConnectInitiator = require('./MewConnectInitiator');

var MewConnectInitiatorClient = function (_MewConnectInitiator) {
  _inherits(MewConnectInitiatorClient, _MewConnectInitiator);

  /**
   *  extensions to plug callbacks into specific events/occurrences
   *  without needing to construct separate checking mechanisms
   *  and expose a factory method.
   */
  function MewConnectInitiatorClient(uiCommunicatorFunc, loggingFunc, additionalLibs) {
    _classCallCheck(this, MewConnectInitiatorClient);

    var _this = _possibleConstructorReturn(this, (MewConnectInitiatorClient.__proto__ || Object.getPrototypeOf(MewConnectInitiatorClient)).call(this, uiCommunicatorFunc, loggingFunc, additionalLibs));

    _this.qrCodeString = null;
    _this.addressCallback = null;
    _this.signerCallback = null;
    _this.messageSignerCallback = null;
    _this.transactionSignerCallback = null;
    _this.codeDisplayCallback = null;
    _this.rtcConnectedCallback = null;
    _this.rtcClosedCallback = null;
    _this.rtcErrorCallback = null;
    _this.connected = false;
    _this.internalMiddlewareActive = false;
    _this.internalLifeCycleActive = false;
    return _this;
  }

  /**
   * Factory Method that also attaches the created instance to
   * the creating static instance (I think...)
   */


  _createClass(MewConnectInitiatorClient, [{
    key: 'isInternalMiddlewareActive',
    value: function isInternalMiddlewareActive() {
      return this.internalMiddlewareActive;
    }
  }, {
    key: 'isInternalLifeCycleActive',
    value: function isInternalLifeCycleActive() {
      return this.internalLifeCycleActive;
    }

    /**
     * set a function to handle receipt of the address from the mobile (receiver) peer
     */

  }, {
    key: 'setAddressCallback',
    value: function setAddressCallback(func) {
      this.addressCallback = func;
    }

    /**
     * [don't believe this is used]
     * set a function to handle
     */
    // TODO check if this is used or useful

  }, {
    key: 'setSignerCallback',
    value: function setSignerCallback(func) {
      this.signerCallback = func;
    }

    /**
     * set a function to handle receipt of a signed message
     */

  }, {
    key: 'setMessageSignerCallback',
    value: function setMessageSignerCallback(func) {
      this.messageSignerCallback = func;
    }

    /**
     * set a function to handle receipt of a signed transaction
     */

  }, {
    key: 'setTransactionSignerCallback',
    value: function setTransactionSignerCallback(func) {
      this.transactionSignerCallback = func;
    }

    /**
     * set a function to handle communicating lifeCycle events to the UI
     */

  }, {
    key: 'setCommunicationFunction',
    value: function setCommunicationFunction(uiCommunicationFunc) {
      this.uiCommunicatorFunc = uiCommunicationFunc;
    }

    /**
     * set a function to handle receipt of the connection detail string (i.e. used to make QR Code)
     */

  }, {
    key: 'registerCodeDisplayCallback',
    value: function registerCodeDisplayCallback(func) {
      this.registerLifeCycleListener('codeDisplay', func);
    }

    /**
     * set a function to handle communicating the establishment of the WebRTC session
     */

  }, {
    key: 'registerRtcConnectedCallback',
    value: function registerRtcConnectedCallback(func) {
      this.registerLifeCycleListener('RtcConnectedEvent', func);
    }

    /**
     * set a function to handle communicating the WebRTC session closing
     */

  }, {
    key: 'registerRtcClosedCallback',
    value: function registerRtcClosedCallback(func) {
      this.registerLifeCycleListener('RtcClosedEvent', func);
    }

    /**
     * set a function to handle communicating an error from the WebRTC session
     */

  }, {
    key: 'registerRtcErrorCallback',
    value: function registerRtcErrorCallback(func) {
      this.registerLifeCycleListener('RtcErrorEvent', func);
    }

    /**
     * Call the defined lifeCycle handler functions if they exist, else proceed with
     * applying lifeCycle middleware until one handles the message type (purpose) or it is not handled
     */

  }, {
    key: 'configureInternalLifecycle',
    value: function configureInternalLifecycle() {
      var _this2 = this;

      if (!this.internalLifeCycleActive) {
        this.internalLifeCycleActive = true;
        this.use(function (data, next) {
          if (data) {
            if (data.type) {
              switch (data.type) {
                case 'codeDisplay':
                  if (!_this2.codeDisplayCallback) {
                    next();
                  } else {
                    _this2.codeDisplayCallback(data.data);
                  }
                  break;
                case 'RtcConnectedEvent':
                  _this2.connected = true;
                  // if (this.instance) this.instance.connected = true;
                  if (!_this2.rtcConnectedCallback) {
                    next();
                  } else {
                    _this2.rtcConnectedCallback(data.data);
                  }
                  break;
                // case "rtcDisconnect":
                // case "RtcDisconnectEvent":
                case 'RtcClosedEvent':
                  if (!_this2.rtcClosedCallback) {
                    next();
                  } else {
                    _this2.rtcClosedCallback(data.data);
                  }
                  break;
                case 'RtcErrorEvent':
                  if (!_this2.rtcErrorCallback) {
                    next();
                  } else {
                    _this2.rtcErrorCallback(data.data);
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

  }, {
    key: 'configureInternalMiddleware',
    value: function configureInternalMiddleware() {
      var _this3 = this;

      if (!this.internalMiddlewareActive) {
        this.internalMiddlewareActive = true;
        this.use(function (data, next) {
          if (data) {
            if (data.type) {
              switch (data.type) {
                case 'address':
                  if (!_this3.addressCallback) {
                    next();
                  } else {
                    _this3.addressCallback(data.data);
                  }
                  break;
                case 'sign':
                  if (!_this3.signerCallback) {
                    next();
                  } else {
                    _this3.signerCallback(data.data);
                  }
                  break;
                case 'signMessage':
                  if (!_this3.messageSignerCallback) {
                    next();
                  } else {
                    _this3.messageSignerCallback(data.data);
                  }
                  break;
                case 'signTx':
                  if (!_this3.transactionSignerCallback) {
                    next();
                  } else {
                    _this3.transactionSignerCallback(data.data);
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
  }], [{
    key: 'init',
    value: function init(uiCommunicatorFunc, loggingFunc, additionalLibs) {
      // if (typeof MewConnect !== 'undefined') {
      //   // eslint-disable-next-line no-undef
      //   this.instance = new MewConnect(uiCommunicatorFunc, loggingFunc, additionalLibs);
      // } else {
      // eslint-disable-next-line max-len
      this.instance = new MewConnectInitiatorClient(uiCommunicatorFunc, loggingFunc, additionalLibs);
      // }
      return this.instance;
    }

    /**
     * @returns {MewConnect}
     */

  }, {
    key: 'get',
    value: function get() {
      return this.instance;
    }
  }]);

  return MewConnectInitiatorClient;
}(MewConnectInitiator);

module.exports = MewConnectInitiatorClient;