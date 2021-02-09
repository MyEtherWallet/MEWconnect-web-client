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
  netVersion, personalSign, ecRecover
} from '../methods';
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
        middleware.run(req, callback).then(() => {
          requestManager.provider.send(payload, callback);
        });
      },
      on: (type, callback) => {
      if (typeof callback !== 'function')
        throw new Error('The second parameter callback must be a function.');

      switch (type) {
        // case 'data':
        //   this.notificationCallbacks.push(callback);
        //   break;
        //
        // case 'connect':
        //   this.connection.onopen = callback;
        //   break;
        //
        // case 'end':
        //   this.connection.onclose = callback;
        //   break;
        //
        // case 'error':
        //   this.connection.onerror = callback;
        //   break;

        case 'accountsChanged':
          this.accountsChanged = callback;
          break;
        case 'disconnected':
          this.disconnected = callback;
          break;
      }
    }
    };
    return this.httpProvider;
  }
}
export default HttpProvider;
