/* eslint-disable */
import EventNames from '../events';
import { toPayload, toError } from '../jsonrpc';
import { getSanitizedTx } from './utils';
import BigNumber from 'bignumber.js';
import debugLogger from 'debug';
const debug = debugLogger('MEWconnectWeb3');
const debugErrors = debugLogger('MEWconnectError');

const setEvents = (promiObj, tx, eventHub) => {
  promiObj
    .once('transactionHash', hash => {
      eventHub.emit('Hash', hash);
    })
    .once('receipt', res => {
      eventHub.emit('Receipt', res);
    })
    .on('error', err => {
      eventHub.emit('Error', err);
    });
};
export default async ({ payload, store, eventHub }, res, next) => {
  if (payload.method !== 'eth_sendTransaction') return next();
  const tx = Object.assign({}, payload.params[0]);
  const localTx = Object.assign({}, tx);
  delete localTx['gas'];
  delete localTx['nonce'];
  try {
    if (!store.state.wallet) {
      eventHub.emit(EventNames.WALLET_NOT_CONNECTED);
      debug('NOT ACTIVE WALLET IDENTIFIED');
      res(toError(payload.id, 'No active wallet: eth_sendTransaction', 4002));
      return;
    }
    tx.nonce = !tx.nonce
      ? await store.state.web3.eth.getTransactionCount(
          store.state.wallet.getAddressString()
        )
      : tx.nonce;
    if (tx.gasLimit && !tx.gas) {
      tx.gas = tx.gasLimit;
    } else if (!tx.gasLimit && tx.gas) {
      tx.gasLimit = tx.gas;
    }
    tx.gas = !tx.gas ? await store.state.web3.eth.estimateGas(localTx) : tx.gas;
    tx.gasPrice = !tx.gasPrice
      ? await store.state.web3.eth.getGasPrice()
      : tx.gasPrice;
    tx.chainId = !tx.chainId ? store.state.network.chainID : tx.chainId;
  } catch (e) {
    eventHub.emit(EventNames.ERROR_NOTIFY, e);
    debugErrors(e);
    res(e);
    return;
  }
  debug('RAW TX', tx);
  getSanitizedTx(tx)
    .then(_tx => {
      debug('TX', _tx);
      eventHub.emit(EventNames.SHOW_TX_CONFIRM_MODAL, _tx, _response => {
        if (_response.reject) {
          debug('USER DECLINED SIGN TRANSACTION & SEND');
          res(toError(payload.id, 'User Rejected Request', 4001));
          return;
        }
        debug('broadcasting', payload.method, _response.rawTransaction);
        const _promiObj = store.state.web3.eth.sendSignedTransaction(
          _response.rawTransaction
        );
        _promiObj
          .once('transactionHash', hash => {
            if (store.state.wallet !== null) {
              if (store.noSubs) {
                const txHash = hash;
                const start = Date.now();
                const interval = setInterval(() => {
                  store.state.web3.eth
                    .getTransactionReceipt(txHash)
                    .then(result => {
                      if (result !== null) {
                        clearInterval(interval);
                        _promiObj.emit('receipt', result);
                        return;
                      }
                      const cancelInterval =
                        (Date.now() - start) / 1000 > 60 * 60;
                      if (cancelInterval) {
                        clearInterval(interval);
                      }
                    })
                    .catch(err => {
                      eventHub.emit(EventNames.ERROR_NOTIFY, err);
                      _promiObj.emit('error', err);
                    });
                }, 5000);
              }
            }
            res(null, toPayload(payload.id, hash));
          })
          .on('error', err => {
            eventHub.emit(EventNames.ERROR_NOTIFY, err);
            debugErrors('Error: eth_sendTransaction', err);
            res(err);
          });
        setEvents(_promiObj, _tx, eventHub);
      });
    })
    .catch(e => {
      res(e);
    });
};
