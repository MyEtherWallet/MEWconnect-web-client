import Web3WSProvider from './ws-web3-provider';
import { Manager as Web3RequestManager } from 'web3-core-requestmanager';
import MiddleWare from '../middleware';
import workerTimer from '../../helpers/webWorkerTimer/index';
import {
  ethSendTransaction,
  ethSignTransaction,
  ethSign,
  personalSign,
  ecRecover,
  ethAccounts,
  ethCoinbase,
  ethGetTransactionCount,
  netVersion
} from '../methods/index';

class WSProvider {
  constructor(host, options, store, eventHub) {
    this.wsProvider = new Web3WSProvider(host, options);
    this.oWSProvider = new Web3WSProvider(host, options);
    this.lastMessage = new Date().getTime();
    const keepAlive = () => {
      if (
        this.oWSProvider.connection.readyState ===
        this.oWSProvider.connection.OPEN
      )
        this.wsProvider.connection.send(
          '{"jsonrpc":"2.0","method":"net_version","params":[],"id":0}'
        );
      if (
        this.wsProvider.connection.readyState ===
        this.wsProvider.connection.OPEN
      )
        this.oWSProvider.connection.send(
          '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}'
        );
      if (
        !Object.is(this.wsProvider, store.state.web3.currentProvider) &&
        this.lastMessage + 10 * 60 * 1000 < new Date().getTime() //wait extra 10 minutes
      ) {
        this.wsProvider.disconnect();
        this.oWSProvider.disconnect();
        workerTimer.clearInterval(this.keepAliveTimer);
      }
    };
    this.keepAliveTimer = workerTimer.setInterval(keepAlive, 5000);
    const _this = this.wsProvider;
    delete this.wsProvider['send'];
    const rawSend = (payload, callback) => {
      this.lastMessage = new Date().getTime();
      if (_this.connection.readyState === _this.connection.CONNECTING) {
        setTimeout(() => {
          this.wsProvider.send(payload, callback);
        }, 10);
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
        requestManager: new Web3RequestManager(this.oWSProvider),
        eventHub
      };

      const middleware = new MiddleWare();
      middleware.use(ethSendTransaction);
      middleware.use(ethSignTransaction);
      middleware.use(ethSign);
      middleware.use(personalSign);
      middleware.use(ecRecover);
      middleware.use(ethAccounts);
      middleware.use(ethGetTransactionCount);
      middleware.use(ethCoinbase);
      middleware.use(netVersion);
      middleware.run(req, callback).then(() => {
        _this.connection.send(JSON.stringify(payload));
        _this._addResponseCallback(payload, callback);
      });
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
        return target(argumentsList[0], argumentsList[1]);
      }
    };
    this.wsProvider.send = new Proxy(rawSend, handler);
    return this.wsProvider;
  }
}

export default WSProvider;
