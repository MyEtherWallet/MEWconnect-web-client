/* eslint-disable */
import EthCalls from '../web3Calls';
import EventNames from '../events';
import { toPayload, toError } from '../jsonrpc';
import { getSanitizedTx } from './utils';
import BigNumber from 'bignumber.js';
import Misc from '../../helpers/misc';
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
export default async (
  { payload, store, requestManager, eventHub },
  res,
  next
) => {
  if (payload.method !== 'eth_sendTransaction') return next();
  const tx = Object.assign({}, payload.params[0]);
  const localTx = Object.assign({}, tx);
  delete localTx['gas'];
  delete localTx['nonce'];
  const ethCalls = new EthCalls(requestManager);
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
    tx.gas =
      !tx.gas || new BigNumber(tx.gas).lte(0)
        ? await ethCalls.estimateGas(localTx)
        : tx.gas;
    tx.gasPrice =
      !tx.gasPrice || new BigNumber(tx.gasPrice).lte(0)
        ? await store.state.web3.eth.getGasPrice()
        : tx.gasPrice;
    tx.chainId = !tx.chainId ? store.state.network.type.chainID : tx.chainId;
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
        if (!store.state.knownHashes.includes(_response.tx.hash)) {
          store.state.knownHashes.push(_response.tx.hash);

          const _promiObj = store.state.web3.eth.sendSignedTransaction(
            _response.rawTransaction
          );

          _promiObj
            .once('transactionHash', hash => {
              if (store.state.wallet !== null) {
                const localStoredObj = store.nonceCache;
                store.nonceCache = {
                  nonce: Misc.sanitizeHex(
                    new BigNumber(localStoredObj.nonce).plus(1).toString(16)
                  ),
                  timestamp: localStoredObj.timestamp
                };
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
                  }, 1000);
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
        }
      });
    })
    .catch(e => {
      res(e);
    });
};
