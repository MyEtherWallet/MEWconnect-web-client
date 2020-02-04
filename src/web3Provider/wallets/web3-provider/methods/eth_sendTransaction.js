import unit from 'ethjs-unit';
import utils from 'web3-utils';
import EthCalls from '../web3Calls';
import EventNames from '../events';
import { toPayload } from '../jsonrpc';
import * as locStore from 'store';
import { getSanitizedTx } from './utils';
import BigNumber from 'bignumber.js';
import Misc from '../../helpers/misc';

const setEvents = (promiObj, tx, eventHub) => {
  promiObj
    .once('transactionHash', hash => {
      console.log(['Hash', tx.from, tx, hash]); // todo remove dev item
      eventHub.emit('Hash', hash)
      // dispatch('addNotification', ['Hash', tx.from, tx, hash]);
    })
    .once('receipt', res => {
      console.log(['Receipt', tx.from, tx, res]); // todo remove dev item
      eventHub.emit('Receipt')
      // dispatch('addNotification', ['Receipt', tx.from, tx, res]);
    })
    .on('error', err => {
      console.log(['Error', tx.from, tx, err]); // todo remove dev item
      eventHub.emit('Error', err)
      // dispatch('addNotification', ['Error', tx.from, tx, err]);
    });
};
export default async (
  { payload, store, requestManager, eventHub },
  res,
  next
) => {
  if (payload.method !== 'eth_sendTransaction') return next();
  const tx = Object.assign({}, payload.params[0]);
  // tx.gasPrice = tx.gasPrice unit.toWei(store.state.gasPrice, 'gwei').toString();
  console.log("eth_sendTransaction", tx); // todo remove dev item
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
  } catch (e) {
    res(e);
    return;
  }
  tx.chainId = !tx.chainId ? store.state.network.type.chainID : tx.chainId;
  getSanitizedTx(tx)
    .then(_tx => {
      eventHub.emit(EventNames.SHOW_TX_CONFIRM_MODAL, _tx, _response => {
        console.log('_response.rawTransaction', _response); // todo remove dev item
        const _promiObj = store.state.web3.eth.sendSignedTransaction(
          _response.rawTransaction
        );

        _promiObj
          .once('transactionHash', hash => {
            if (store.state.wallet !== null) {

              const localStoredObj = requestManager.nonceCache;
              requestManager.nonceCache = {
                nonce: Misc.sanitizeHex(
                  new BigNumber(localStoredObj.nonce).plus(1).toString(16)
                ),
                timestamp: localStoredObj.timestamp
              };
            }
            res(null, toPayload(payload.id, hash));
          })
          .on('error', err => {
            res(err);
          });
        setEvents(_promiObj, _tx, eventHub);
      });
    })
    .catch(e => {
      res(e);
    });
};
