/* eslint-disable */

import HttpRequestManger from './http-request-manager';
import MiddleWare from '../middleware';
import {
  ethSendTransaction,
  ethSignTransaction,
  ethSign,
  ethAccounts,
  ethCoinbase,
  ethGetTransactionCount,
  ethGetTransactionReceipt,
  ethGetBlockByNumber,
  ethGetBlockNumber,
  netVersion,
  personalSign,
  ecRecover,
  ethSubscribeBypass,
  decrypt,
  signTypedData_v3,
  getEncryptionPublicKey
} from '../methods/index';

class HttpProvider {
  constructor(host, options, store, eventHub) {
    const requestManager = new HttpRequestManger(host, options);
    this.httpProvider = {
      send: (payload, callback) => {
        const req = {
          payload,
          store,
          requestManager,
          eventHub
        };
        const middleware = new MiddleWare();
        middleware.use(ethSendTransaction);
        middleware.use(ethSignTransaction);
        middleware.use(ethGetTransactionCount);
        middleware.use(ethGetTransactionReceipt);
        middleware.use(ethSign);
        middleware.use(personalSign);
        middleware.use(ecRecover);
        middleware.use(ethAccounts);
        middleware.use(ethCoinbase);
        middleware.use(ethGetBlockByNumber);
        middleware.use(ethGetBlockNumber);
        middleware.use(netVersion);
        middleware.use(ethSubscribeBypass)
        middleware.use(decrypt);
        middleware.use(signTypedData_v3);
        middleware.use(getEncryptionPublicKey)
        middleware.run(req, callback).then(() => {
          requestManager.provider.send(payload, callback);
        });
      },
      notificationCallbacks: [],
      disconnectCallbacks: [],
      closeCallbacks: [],
      accountsChangedCallbacks: [],
      createSubscriptions: (subscription, ) => {
        requestManager.addSubscription()
      },
      on: (type, callback) => {
        if (typeof callback !== 'function')
          throw new Error('The second parameter callback must be a function.');

        switch (type) {
          case 'data':
            this.httpProvider.notificationCallbacks.push(callback);
            this.httpProvider.dataCallback = callback;
            break;
          //
          // case 'connect':
          //   this.connection.onopen = callback;
          //   break;
          //
          // case 'end':
          //   this.connection.onclose = callback;
          //   break;
          //
          // case 'message':
          //   console.log('message callback'); // todo remove dev item
          //   console.log(callback); // todo remove dev item
          //   break;

          case 'accountsChanged':
            this.httpProvider.accountsChangedCallbacks.push(callback)
            this.accountsChanged = callback;
            break;
          case 'disconnected':
            this.httpProvider.disconnectedCallback = callback;
            break;
          case 'disconnect':
            this.httpProvider.disconnectCallbacks.push(callback)
            this.httpProvider.disconnectCallback = callback;
            break;
          case 'close':
            this.httpProvider.closeCallbacks.push(callback)
            this.httpProvider.closeCallback = callback;
            break;
        }
      },
      emit:(type, data) => {
        if (typeof type !== 'string')
          throw new Error('The first parameter type must be a function.');

        switch (type) {

          case 'accountsChanged':
            this.httpProvider.accountsChangedCallbacks.forEach(function(callback) {
              if (typeof callback === 'function') callback(data);
            });
            break;
          // case 'disconnected':
          //   this.disconnectedCallback = callback;
          //   break;
          case 'disconnect':
            this.httpProvider.disconnectCallbacks.forEach(function(callback) {
              if (typeof callback === 'function') callback(data);
            });
            break;
          case 'close':
            this.httpProvider.closeCallbacks.forEach(function(callback) {
              if (typeof callback === 'function') callback(data);
            });
            break;
        }
      }
    };

    const handler = {
      apply: function(target, thisArg, argumentsList) {
        if (argumentsList.length === 1) {
          if (
            argumentsList[0] === 'eth_requestAccounts' ||
            argumentsList[0] === 'eth_accounts'
          ) {
            return new Promise((resolve, reject) => {
              const callback = (err, response) => {
                if (err) reject(err);
                else resolve(response.result);
              };
              const payload = {
                id: 1,
                method: 'eth_accounts'
              };
              target(payload, callback);
            });
          }
        }

        if (
          typeof argumentsList[0] === 'string' &&
          typeof argumentsList[1] !== 'function'
        ) {
          return new Promise((resolve, reject) => {
            const callback = (err, response) => {
              if (err) reject(err);
              else resolve(response.result);
            };
            let params = [];
            if (argumentsList.length === 2) {
              params = Array.isArray(argumentsList[1])
                ? argumentsList[1]
                : argumentsList[1] !== undefined
                ? [argumentsList[1]]
                : [];
            }
            const payload = {
              jsonrpc: '2.0',
              id: 1,
              method: argumentsList[0],
              params: params
            };
            target(payload, callback);
          });
        }

        return target(argumentsList[0], argumentsList[1]);
      }
    };
    this.httpProvider.send = new Proxy(this.httpProvider.send, handler);
    this.httpProvider.request = (payload) => {
      return this.httpProvider.send(payload.method, payload.params)
    }
    return this.httpProvider;
  }
}
export default HttpProvider;
