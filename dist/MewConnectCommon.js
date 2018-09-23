'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _detectBrowser = require('detect-browser');

var _constants = require('./constants');

var _config = require('./config');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

var MewConnectCommon = (function(_EventEmitter) {
  _inherits(MewConnectCommon, _EventEmitter);

  function MewConnectCommon() {
    _classCallCheck(this, MewConnectCommon);

    var _this = _possibleConstructorReturn(
      this,
      (
        MewConnectCommon.__proto__ || Object.getPrototypeOf(MewConnectCommon)
      ).call(this)
    );

    _this.isBrowser =
      typeof window !== 'undefined' &&
      // eslint-disable-next-line no-undef
      {}.toString.call(window) === '[object Window]';
    _this.middleware = [];
    _this.lifeCycleListeners = [];

    _this.jsonDetails = {
      stunSrvers: [].concat(_toConsumableArray(_config.stunServers)),
      signals: _extends({}, _constants.signal),
      stages: _extends({}, _constants.stages),
      lifeCycle: _extends({}, _constants.lifeCycle),
      rtc: _extends({}, _constants.rtc),
      communicationTypes: _extends({}, _constants.communicationTypes),
      connectionCodeSeparator: _constants.connectionCodeSeparator,
      version: _config.version,
      versions: _constants.versions,
      connectionCodeSchemas: _constants.connectionCodeSchemas
    };
    return _this;
  }

  _createClass(
    MewConnectCommon,
    [
      {
        key: 'isJSON',
        value: function isJSON(arg) {
          try {
            JSON.parse(arg);
            return true;
          } catch (e) {
            return false;
          }
        }
      }
    ],
    [
      {
        key: 'getBrowserRTC',
        value: function getBrowserRTC() {
          if (typeof window === 'undefined') return null;
          var wrtc = {
            RTCPeerConnection:
              window.RTCPeerConnection ||
              window.mozRTCPeerConnection ||
              window.webkitRTCPeerConnection,
            RTCSessionDescription:
              window.RTCSessionDescription ||
              window.mozRTCSessionDescription ||
              window.webkitRTCSessionDescription,
            RTCIceCandidate:
              window.RTCIceCandidate ||
              window.mozRTCIceCandidate ||
              window.webkitRTCIceCandidate
          };
          if (!wrtc.RTCPeerConnection) return null;
          return wrtc;
        }
      },
      {
        key: 'checkWebRTCAvailable',
        value: function checkWebRTCAvailable() {
          var doesNotHaveWebRTC = MewConnectCommon.getBrowserRTC() == null;
          return !doesNotHaveWebRTC;
          // return false
        }
      },
      {
        key: 'checkBrowser',
        value: function checkBrowser() {
          var browser = (0, _detectBrowser.detect)();
          var version = browser.version.split(0, 1)[0];
          /*
      * Chrome > 23
      * Firefox > 22
      * Opera > 18
      * Safari > 11 (caveats exist)
      * Edge - none (RTCDataChannel not supported)
      * IE - none
      * */
          if (typeof window !== 'undefined') {
            if (browser.name === 'safari') {
              return MewConnectCommon.buildBrowserResult(
                true,
                'Safari',
                'version: ' + browser.version
              );
            } else if (browser.name === 'ie') {
              return MewConnectCommon.buildBrowserResult(
                true,
                'Internet Explorer',
                '',
                true
              );
            } else if (browser.name === 'edge') {
              return MewConnectCommon.buildBrowserResult(
                true,
                'Edge',
                'version: ' + browser.version,
                true
              );
            } else {
              var name = '';
              var minVersion = 0;

              if (browser.name === 'opera') {
                name = 'Opera';
                minVersion = 18;
              } else if (browser.name === 'firefox') {
                name = 'Firefox';
                minVersion = 22;
              } else if (browser.name === 'chrome') {
                name = 'Chrome';
                minVersion = 23;
              } else {
                return MewConnectCommon.buildBrowserResult(false, '', '', true);
              }

              try {
                if (minVersion >= +version) {
                  return MewConnectCommon.buildBrowserResult(
                    true,
                    name,
                    'version: ' + version
                  );
                } else {
                  return MewConnectCommon.buildBrowserResult(false, '', '');
                }
              } catch (e) {
                console.error(e);
              }
            }
          }
        }
      },
      {
        key: 'buildBrowserResult',
        value: function buildBrowserResult(
          status,
          browser,
          version,
          noSupport
        ) {
          return {
            status: status,
            browser: browser,
            version: version,
            noSupport: noSupport || false
          };
        }
      }
    ]
  );

  return MewConnectCommon;
})(_events2.default);

exports.default = MewConnectCommon;
module.exports = exports['default'];
