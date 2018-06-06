/* eslint-disable no-console */

const {
  version,
  versions,
  connectionCodeSchemas,
  connectionCodeSeparator,
  signal,
  rtc,
  stages,
  lifeCycle,
  communicationTypes,
} = require('./config');

/**
 *
 */
class MewConnectCommon {
  /**
   *
   * @param uiCommunicatorFunc
   * @param loggingFunc
   */
  constructor(uiCommunicatorFunc, loggingFunc) {
    // if null it calls the middleware registered to each specific lifecycle event
    this.uiCommunicatorFunc = uiCommunicatorFunc || this.applyLifeCycleListeners;
    // Need to think of a little better way to do the above (to have built in and custom)
    // eslint-disable-next-line func-names
    this.logger = loggingFunc || function () {
    };
    this.isBrowser = typeof window !== 'undefined'
    // eslint-disable-next-line no-undef
      && ({}).toString.call(window) === '[object Window]';
    this.middleware = [];
    this.lifeCycleListeners = [];

    this.jsonDetails = {
      signals: {
        ...signal,
      },
      stages: {
        ...stages,
      },
      lifeCycle: {
        ...lifeCycle,
      },
      rtc: {
        ...rtc,
      },
      communicationTypes: {
        ...communicationTypes,
      },
      connectionCodeSeparator,
      version,
      versions,
      connectionCodeSchemas,
    };
  }

  /**
   *
   * @param uiCommunicationFunc
   */
  setCommunicationFunction(uiCommunicationFunc) {
    this.uiCommunicatorFunc = uiCommunicationFunc;
  }

  /**
   *
   * @param _signal
   * @param data
   */
  // commDefault(_signal, data) {
  //   console.log('DEFAULT COMMUNICATION FUNCTION');// todo remove dev item
  //   console.log('CUSTON EVENT', signal);// todo remove dev item
  //   console.log('DATA: ', data);// todo remove dev item
  // }

  /**
   *
   * @param func
   */
  use(func) {
    this.middleware.push(func);
  }

  // eslint-disable-next-line consistent-return
  useDataHandlers(input, fn) {
    const fns = this.middleware.slice(0);
    if (!fns.length) return fn(null);

    function run(i) {
      // eslint-disable-next-line consistent-return
      fns[i](input, (err) => {
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

  applyDatahandlers(data) {
    const _this = this;
    // function that runs after all middleware
    function next(args) {
      if (args === null) {
        if (_this.jsonDetails.communicationTypes[data.type]) {
          throw new Error(`No Handler Exists for ${data.type}`);
        }
        // console.log(`No Handler Exists for ${data}`); // todo remove dev item
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
  registerLifeCycleListener(_signal, func) {
    if (this.lifeCycleListeners[_signal]) {
      this.lifeCycleListeners[_signal].push(func);
    } else {
      this.lifeCycleListeners[_signal] = [];
      this.lifeCycleListeners[_signal].push(func);
    }
  }

  // eslint-disable-next-line consistent-return
  useLifeCycleListeners(_signal, input, fn) {
    let fns;
    if (this.lifeCycleListeners[_signal]) {
      fns = this.lifeCycleListeners[_signal].slice(0);
      if (!fns.length) return fn(null);

      // eslint-disable-next-line no-use-before-define
      run(0);
    }

    function run(i) {
      // eslint-disable-next-line no-undef,consistent-return
      fns[i](input, (err) => {
        // upon error, short-circuit
        if (err) return fn(err);
        // eslint-disable-next-line no-undef
        if (!fns[i + 1]) return fn(null); // if no middleware left, summon callback


        // go on to next
        run(i + 1);
      });
    }
  }

  applyLifeCycleListeners(_signal, data) {
    // function that runs after all middleware
    function next(args) {
      return args;
    }
    this.useLifeCycleListeners(_signal, data, next);
  }

  /*
  * allows external function to listen for lifecycle events
  */
  uiCommunicator(event, data) {
    // console.log(this.uiCommunicatorFunc); // todo remove dev item
    return data ? this.uiCommunicatorFunc(event, data) : this.uiCommunicatorFunc(event, null);
  }
  // eslint-disable-next-line class-methods-use-this
  isJSON(arg) {
    try {
      JSON.parse(arg);
      return true;
    } catch (e) {
      return false;
    }
  }

  // check necessary plugable functions are present
  // functionCheck() {}
}


module.exports = MewConnectCommon;
