/* eslint-disable */

import Web3WSProvider from './ws-web3-provider';
import { Manager as Web3RequestManager } from 'web3-core-requestmanager';
import MiddleWare from '../middleware';
import workerTimer from '../../helpers/webWorkerTimer/index';
import { v4 as uuidv4 } from 'uuid';
import {
  ethSendTransaction,
  ethSignTransaction,
  ethSign,
  personalSign,
  ecRecover,
  ethAccounts,
  ethCoinbase,
  netVersion,
  decrypt,
  signTypedData_v3,
  signTypedData_v4,
  getEncryptionPublicKey,
  ethRequestAccounts
} from '../methods/index';

class WSProvider {
  constructor(host, options, store, eventHub) {
    this.wsProvider = new Web3WSProvider(host, options);
    this.lastMessage = new Date().getTime();
    const keepAlive = () => {
      if (
        this.wsProvider.connection.readyState ===
        this.wsProvider.connection.OPEN
      )
        this.wsProvider.connection.send('');
      if (
        !Object.is(this.wsProvider, store.state.web3.currentProvider) &&
        this.lastMessage + 10 * 60 * 1000 < new Date().getTime() //wait extra 10 minutes
      ) {
        this.wsProvider.disconnect();
        workerTimer.clearInterval(this.keepAliveTimer);
      }
    };
    this.keepAliveTimer = workerTimer.setInterval(keepAlive, 5000);
    const _this = this.wsProvider;
    delete this.wsProvider['send'];
    this.wsProvider.send = (payload, callback) => {
      this.lastMessage = new Date().getTime();
      if (_this.connection.readyState === _this.connection.CONNECTING) {
        setTimeout(() => {
          this.wsProvider.send(payload, callback);
        }, 100);
        return;
      }
      if (_this.connection.readyState !== _this.connection.OPEN) {
        if (typeof _this.connection.onerror === 'function') {
          _this.connection.onerror(new Error('connection not open'));
        }
        callback(new Error('connection not open'));
        return;
      }
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
        _this.connection.send(JSON.stringify(payload));
        _this._addResponseCallback(payload, callback);
      });
    };
    this.wsProvider.request = payload => {
      return new Promise((resolve, reject) => {
        this.wsProvider.send(
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
    return this.wsProvider;
  }
}

export default WSProvider;
