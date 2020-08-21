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
    tx.nonce = !tx.nonce
      ? await store.state.web3.eth.getTransactionCount(
          store.state.wallet.getAddressString()
        )
      : tx.nonce;
    tx.gas = !tx.gas ? await ethCalls.estimateGas(localTx) : tx.gas;
    tx.gasPrice = !tx.gasPrice ? await store.state.web3.eth.getGasPrice() : tx.gasPrice
  } catch (e) {
    res(e);
    return;
  }
  tx.chainId = !tx.chainId ? store.state.network.type.chainID : tx.chainId;
  getSanitizedTx(tx)
    .then(_tx => {
      eventHub.emit(EventNames.SHOW_TX_CONFIRM_MODAL, _tx, _response => {
        if(_response.reject){
          debug('USER DECLINED SIGN TRANSACTION & SEND');
          res(toError(payload.id, 'User Rejected Request', 4001));
          return;
        }
        debug('broadcasting', payload.method, _response.rawTransaction)
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
            }
            res(null, toPayload(payload.id, hash));
          })
          .on('error', err => {
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
