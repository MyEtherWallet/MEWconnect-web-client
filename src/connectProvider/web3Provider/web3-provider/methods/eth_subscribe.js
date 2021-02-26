/* eslint-disable */

import { toPayload } from '../jsonrpc';
import EventEmitter from 'rollup-plugin-node-builtins/src/es6/events';

class subscription extends EventEmitter {
  constructor() {
    super();
  }
  subscribe(event) {}
  unsubscribe() {
    this.removeAllListeners();
  }
}

// Only for Http
export default async ({ payload, store }, res, next) => {
  if (payload.method !== 'eth_subscribe') return next();

  if (store.state.wallet) {
    let count = 10;
    let currentBlock = '';
    let interval;
    const subscribeResult = {
      id: payload.id,

      unsubscribe: callback => {
        try {
          clearInterval(interval);
          if (typeof callback !== 'function') return;
          callback(null, true)
        } catch (e) {
          callback(e, null)
        }
      },
      dataCallback: () => {},
      connectedCallback: () => {},
      errorCallback: () => {},
      on: (type, callback) => {
        if (typeof callback !== 'function')
          throw new Error(
            'The second parameter callback must be a function.'
          );
        switch (type) {
          case 'data':
            // this.notificationCallbacks.push(callback);
            subscribeResult.dataCallback = callback;
            break;
          //
          case 'connect':
            subscribeResult.connectedCallback = callback;
            break;

          case 'error':
            subscribeResult.errorCallback = callback;
            break;
        }
      }
    };
    console.log(store.state.web3Provider); // todo remove dev item
    // store.state.web3Provider.createSubscriptions(subscribeResult, res)
    //-------------------------------------------
    // interval = setInterval(() => {
    //   store.state.web3.eth.getBlockNumber().then(result => {
    //     if (result !== currentBlock && currentBlock !== '') {
    //       currentBlock = result;
    //       console.log(result); // todo remove dev item
    //       store.state.web3.eth.getBlock(result).then(res => {
    //         subscribeResult.dataCallback(res);
    //       });
    //       // store.state.web3Provider.dataCallback();
    //       if (count < 0) {
    //         subscribeResult.unsubscribe()
    //       }
    //       count--;
    //     } else {
    //       currentBlock = result;
    //     }
    //   });
    // }, 1000);
    // // getTransactionReceipt
    // // eth_blockNumber
    // res(null, toPayload(payload.id, subscribeResult));
  } else {
    try {
      store.state.enable().then(accounts => {
        res(null, toPayload(payload.id, accounts));
      });
    } catch (e) {
      res(null, toPayload(payload.id, []));
    }
  }
};
