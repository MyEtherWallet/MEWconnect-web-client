// socket.io-client.js
let EVENTS = {};


const socket = {
  on(event, func) {
    if (EVENTS[event]) {
      return EVENTS[event].push(func);
    }
    EVENTS[event] = [func];
  },
  emit(event, args) {
    console.log(event, args); // todo remove dev item
    EVENTS[event].forEach(func => func(args));
  }
};

const connect = {
  connect: function(url, options) {
    console.log(url, options); // todo remove dev item
    return socket;
  }
};

export default function io(url, options) {
  return connect;
};




// function emit(event, ...args) {
//   EVENTS[event].forEach(func => func(...args));
// }
//
// const socket = {
//   on(event, func) {
//     if (EVENTS[event]) {
//       return EVENTS[event].push(func);
//     }
//     EVENTS[event] = [func];
//   },
//   emit
// };
//
// function connect(url, options){
//   return socket;
// }
//
// function io(url, options) {
//   console.log(url, option); // todo remove dev item
//   return {
//    connect
//  }
// }

// io.connect = (url, options) => {
//   console.log(url, option); // todo remove dev item
//   return socket;
// };

// Additional helpers, not included in the real socket.io-client,just for out test.
// to emulate server emit.
// export const serverSocket = { emit, connect };

// cleanup helper
export function cleanup() {
  EVENTS = {};
}

