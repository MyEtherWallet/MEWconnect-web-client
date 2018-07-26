'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logging = require('logging');

var _logging2 = _interopRequireDefault(_logging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable no-console */


var events = require('events');
var EventEmitter = events.EventEmitter;

var _require = require('./constants'),
    versions = _require.versions,
    connectionCodeSchemas = _require.connectionCodeSchemas,
    connectionCodeSeparator = _require.connectionCodeSeparator,
    signal = _require.signal,
    rtc = _require.rtc,
    stages = _require.stages,
    lifeCycle = _require.lifeCycle,
    communicationTypes = _require.communicationTypes;

var _require2 = require('./config'),
    version = _require2.version,
    stunServers = _require2.stunServers;

var logger = (0, _logging2.default)('MewConnectCommon');

var MewConnectCommon = function (_EventEmitter) {
  _inherits(MewConnectCommon, _EventEmitter);

  /**
   * @param uiCommunicatorFunc
   * @param loggingFunc
   */
  function MewConnectCommon(uiCommunicatorFunc, loggingFunc) {
    _classCallCheck(this, MewConnectCommon);

    // if null it calls the middleware registered to each specific lifecycle event
    var _this2 = _possibleConstructorReturn(this, (MewConnectCommon.__proto__ || Object.getPrototypeOf(MewConnectCommon)).call(this));

    _this2.uiCommunicatorFunc = uiCommunicatorFunc || _this2.applyLifeCycleListeners;
    // Need to think of a little better way to do the above (to have built in and custom)
    // eslint-disable-next-line func-names
    _this2.logger = loggingFunc || function () {};

    _this2.isBrowser = typeof window !== 'undefined' &&
    // eslint-disable-next-line no-undef
    {}.toString.call(window) === '[object Window]';
    _this2.middleware = [];
    _this2.lifeCycleListeners = [];

    _this2.jsonDetails = {
      stunSrvers: [].concat(_toConsumableArray(stunServers)),
      signals: _extends({}, signal),
      stages: _extends({}, stages),
      lifeCycle: _extends({}, lifeCycle),
      rtc: _extends({}, rtc),
      communicationTypes: _extends({}, communicationTypes),
      connectionCodeSeparator: connectionCodeSeparator,
      version: version,
      versions: versions,
      connectionCodeSchemas: connectionCodeSchemas
    };
    return _this2;
  }

  /**
   *
   * @param uiCommunicationFunc
   */


  _createClass(MewConnectCommon, [{
    key: 'setCommunicationFunction',
    value: function setCommunicationFunction(uiCommunicationFunc) {
      this.uiCommunicatorFunc = uiCommunicationFunc;
    }

    /**
     *
     * @param func
     */

  }, {
    key: 'use',
    value: function use(func) {
      this.middleware.push(func);
    }

    // eslint-disable-next-line consistent-return

  }, {
    key: 'useDataHandlers',
    value: function useDataHandlers(input, fn) {
      var fns = this.middleware.slice(0);
      if (!fns.length) return fn(null);

      function run(i) {
        // eslint-disable-next-line consistent-return
        fns[i](input, function (err) {
          // upon error, short-circuit
          if (err) return fn(err);

          // if no middleware left, summon callback
          if (!fns[i + 1]) return fn(null);

          // go on to next
          run(i + 1);
        });
      }

      run(0);
    }
  }, {
    key: 'applyDatahandlers',
    value: function applyDatahandlers(data) {
      var _this = this;
      // function that runs after all middleware
      function next(args) {
        if (args === null) {
          if (_this.jsonDetails.communicationTypes[data.type]) {
            throw new Error('No Handler Exists for ' + data.type);
          }
        }
        return args;
      }
      this.useDataHandlers(data, next);
    }

    /**
     *
     * @param _signal
     * @param func
     */

  }, {
    key: 'registerLifeCycleListener',
    value: function registerLifeCycleListener(_signal, func) {
      if (this.lifeCycleListeners[_signal]) {
        this.lifeCycleListeners[_signal].push(func);
      } else {
        this.lifeCycleListeners[_signal] = [];
        this.lifeCycleListeners[_signal].push(func);
      }
    }

    // eslint-disable-next-line consistent-return

  }, {
    key: 'useLifeCycleListeners',
    value: function useLifeCycleListeners(_signal, input, fn) {
      var fns = void 0;
      if (this.lifeCycleListeners[_signal]) {
        fns = this.lifeCycleListeners[_signal].slice(0);
        if (!fns.length) return fn(null);

        // eslint-disable-next-line no-use-before-define
        run(0);
      }

      function run(i) {
        // eslint-disable-next-line no-undef,consistent-return
        fns[i](input, function (err) {
          // upon error, short-circuit
          if (err) return fn(err);
          // eslint-disable-next-line no-undef
          if (!fns[i + 1]) return fn(null); // if no middleware left, summon callback

          // go on to next
          run(i + 1);
        });
      }
    }
  }, {
    key: 'applyLifeCycleListeners',
    value: function applyLifeCycleListeners(_signal, data) {
      // function that runs after all middleware
      function next(args) {
        return args;
      }
      this.useLifeCycleListeners(_signal, data, next);
    }

    /*
    * allows external function to listen for lifecycle events
    */

  }, {
    key: 'uiCommunicator',
    value: function uiCommunicator(event, data) {
      this.emit(event, data);
      // return data ? this.uiCommunicatorFunc(event, data) : this.uiCommunicatorFunc(event, null)
    }
    // eslint-disable-next-line class-methods-use-this

  }, {
    key: 'isJSON',
    value: function isJSON(arg) {
      try {
        JSON.parse(arg);
        return true;
      } catch (e) {
        return false;
      }
    }
  }]);

  return MewConnectCommon;
}(EventEmitter);

module.exports = MewConnectCommon;