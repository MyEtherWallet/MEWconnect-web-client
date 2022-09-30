/* eslint-disable */

import HttpRequestManger from './http-request-manager';
import MiddleWare from '../middleware';
import {
  ethSendTransaction,
  ethSignTransaction,
  ethSign,
  ethAccounts,
  ethCoinbase,
  netVersion,
  personalSign,
  ecRecover,
  decrypt,
  signTypedData_v3,
  signTypedData_v4,
  getEncryptionPublicKey,
  ethRequestAccounts
} from '../methods/index';
import { v4 as uuidv4 } from 'uuid';
class HttpProvider {
  constructor(host, options, store, eventHub) {
    const requestManager = new HttpRequestManger(host, options);
    this.httpProvider = {
      send: (payload, callback) => {
        const req = {
          payload,
          store,
          eventHub
        };
        const middleware = new MiddleWare();
        middleware.use(ethSendTransaction);
        middleware.use(ethSignTransaction);
        middleware.use(ethSign);
        middleware.use(personalSign);
        middleware.use(ecRecover);
        middleware.use(ethAccounts);
        middleware.use(ethCoinbase);
        middleware.use(ethRequestAccounts);
        middleware.use(netVersion);
        middleware.use(decrypt);
        middleware.use(signTypedData_v3);
        middleware.use(signTypedData_v4);
        middleware.use(getEncryptionPublicKey);
        middleware.run(req, callback).then(() => {
          requestManager.provider.send(payload, callback);
        });
      },
      notificationCallbacks: [],
      disconnectCallbacks: [],
      closeCallbacks: [],
      accountsChangedCallbacks: [],
      createSubscriptions: subscription => {
        requestManager.addSubscription();
      },
      on: (type, callback) => {
        if (typeof callback !== 'function')
          throw new Error('The second parameter callback must be a function.');

        switch (type) {
          case 'data':
            this.httpProvider.notificationCallbacks.push(callback);
            this.httpProvider.dataCallback = callback;
            break;
          case 'accountsChanged':
            this.httpProvider.accountsChangedCallbacks.push(callback);
            this.accountsChanged = callback;
            break;
          case 'disconnected':
            this.httpProvider.disconnectedCallback = callback;
            break;
          case 'disconnect':
            this.httpProvider.disconnectCallbacks.push(callback);
            this.httpProvider.disconnectCallback = callback;
            break;
          case 'close':
            this.httpProvider.closeCallbacks.push(callback);
            this.httpProvider.closeCallback = callback;
            break;
        }
      },
      emit: (type, data) => {
        if (typeof type !== 'string')
          throw new Error('The first parameter type must be a string.');

        switch (type) {
          case 'accountsChanged':
            this.httpProvider.accountsChangedCallbacks.forEach(function(
              callback
            ) {
              if (typeof callback === 'function') callback(data);
            });
            break;
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
    this.httpProvider.request = payload => {
      return new Promise((resolve, reject) => {
        this.httpProvider.send(
          {
            jsonrpc: '2.0',
            id: uuidv4(),
            method: payload.method,
            params: payload.params
          },
          (err, res) => {
            if (err) return reject(err);
            else if (res.error) return reject(res.error);
            resolve(res.result);
          }
        );
      });
    };
    return this.httpProvider;
  }
}
export default HttpProvider;
