
const {version, versions, connectionCodeSchemas, connectionCodeSeparator, signal, rtc, stages, lifeCycle, communicationTypes} = require("./config")
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
    this.logger = loggingFunc || function (arg1, arg2) {
    };
    this.isBrowser = typeof window !== 'undefined'
      && ({}).toString.call(window) === '[object Window]';
    this.middleware = [];
    this.lifeCycleListeners = [];

    this.jsonDetails = {
      "signals": {
        ...signal
      },
      "stages": {
        ...stages
      },
      "lifeCycle": {
        ...lifeCycle
      },
      "rtc": {
        ...rtc
      },
      "communicationTypes":{
        ...communicationTypes
      },
      "connectionCodeSeparator": connectionCodeSeparator,
      "version" : version,
      "versions": versions,
      "connectionCodeSchemas": connectionCodeSchemas
    }
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
   * @param signal
   * @param data
   */
  commDefault(signal, data) {
    console.log("DEFAULT COMMUNICATION FUNCTION");//todo remove dev item
    console.log("CUSTON EVENT", signal);//todo remove dev item
    console.log("DATA: ", data);//todo remove dev item
  }

  /**
   *
   * @param func
   */
  use(func) {
    this.middleware.push(func);
  }

  useDataHandlers(input, fn) {
    var fns = this.middleware.slice(0);
    if (!fns.length) return fn(null);

    function run(i) {
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

  applyDatahandlers(data) {
    let _this = this;
    // function that runs after all middleware
    let next = function (args) {

      if(args === null){
        if(_this.jsonDetails.communicationTypes[data.type]){
          throw new Error(`No Handler Exists for ${data.type}`)
        }
        // console.log(`No Handler Exists for ${data}`); // todo remove dev item
      }
      return args;
    };
    this.useDataHandlers(data, next);
  }

  /**
   *
   * @param signal
   * @param func
   */
  registerLifeCycleListener(signal, func) {
    if (this.lifeCycleListeners[signal]) {
      this.lifeCycleListeners[signal].push(func);
    } else {
      this.lifeCycleListeners[signal] = [];
      this.lifeCycleListeners[signal].push(func);
    }

  }

  useLifeCycleListeners(signal, input, fn) {
    if (this.lifeCycleListeners[signal]) {

      var fns = this.lifeCycleListeners[signal].slice(0);
      if (!fns.length) return fn(null);

      run(0);
    }

    function run(i) {
      fns[i](input, function (err) {
        // upon error, short-circuit
        if (err) return fn(err);

        // if no middleware left, summon callback
        if (!fns[i + 1]) return fn(null);

        // go on to next
        run(i + 1);
      });
    }

  }

  applyLifeCycleListeners(signal, data) {
    // function that runs after all middleware
    let next = function (args) {
      return args;
    };
    this.useLifeCycleListeners(signal, data, next);
  }

  /*
  * allows external function to listen for lifecycle events
  */
  uiCommunicator(event, data) {
    // console.log(this.uiCommunicatorFunc); // todo remove dev item
    return data ? this.uiCommunicatorFunc(event, data) : this.uiCommunicatorFunc(event, null);
  }

  isJSON(arg){
    try{
      JSON.parse(arg)
      return true;
    } catch (e) {
      return false;
    }
  }

  // check necessary plugable functions are present
  functionCheck() {}

}


module.exports = MewConnectCommon