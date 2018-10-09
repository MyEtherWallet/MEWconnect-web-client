// socket.io-client.js
let EVENTS = {};

export default class PeerMock {
  constructor(toEmit, data, time) {
    this._pc = {
      addEventListener(event, args) {
        console.log(event, args); // todo remove dev item
        EVENTS[event].forEach(func => func(args));
      }
    };
  }

  Peer() {
    let _this = this;
    console.log('called'); // todo remove dev item
    return function (){
      console.log('called'); // todo remove dev item
      return _this;
    }
  };

  on(event, func) {
    console.log(event); // todo remove dev item
    if (EVENTS[event]) {
      return EVENTS[event].push(func);
    }
    EVENTS[event] = [func];
    // if (event === toEmit) {
    setTimeout(() => {
      console.log(event, data); // todo remove dev item
      EVENTS[event].forEach(func => func(data));
    }, 50);
    // }
  }

  emit(event) {
    setTimeout(() => {
      console.log(event, data); // todo remove dev item
      EVENTS[event].forEach(func => func(data));
    }, time);
  }

  signal() {
    setTimeout(() => {
      console.log(event, data); // todo remove dev item
      EVENTS[event].forEach(func => func(data));
    }, time);
  }

  send() {

  }

  destroy() {

  }

}

// cleanup helper
export function cleanup() {
  EVENTS = {};
}

