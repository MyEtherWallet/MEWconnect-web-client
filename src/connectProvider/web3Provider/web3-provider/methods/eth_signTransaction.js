// import unit from 'ethjs-unit';
import { toError, toPayload } from '../jsonrpc';
import EventNames from '../events';
import { getSanitizedTx } from './utils';

import debugLogger from 'debug';
import BigNumber from 'bignumber.js';
const debug = debugLogger('MEWconnectWeb3');
const debugErrors = debugLogger('MEWconnectError');

export default async ({ payload, store, eventHub }, res, next) => {
  if (payload.method !== 'eth_signTransaction') return next();
  const tx = payload.params[0];
  const localTx = Object.assign({}, tx);
  delete localTx['gas'];
  delete localTx['nonce'];
  try {
    if (!store.state.wallet) {
      eventHub.emit(EventNames.WALLET_NOT_CONNECTED);
      debug('NOT ACTIVE WALLET IDENTIFIED');
      res(toError(payload.id, 'No active wallet: eth_signTransaction', 4002));
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
        ? await store.state.web3.eth.estimateGas(localTx)
        : tx.gas;
    tx.chainId = !tx.chainId ? store.state.network.chainID : tx.chainId;
    tx.gasPrice =
      !tx.gasPrice || new BigNumber(tx.gasPrice).lte(0)
        ? await store.state.web3.eth.getGasPrice()
        : tx.gasPrice;

    getSanitizedTx(tx)
      .then(_tx => {
        eventHub.emit(EventNames.SHOW_TX_SIGN_MODAL, _tx, _response => {
          if (_response.reject) {
            debug('USER DECLINED SIGN TRANSACTION');
            res(toError(payload.id, 'User Rejected Request', 4001));
            return;
          }
          debug('return signed transaction', payload.method, _response);
          res(null, toPayload(payload.id, _response.rawTransaction));
        });
      })
      .catch(e => {
        eventHub.emit(EventNames.ERROR_NOTIFY, e);
        debugErrors('Error: eth_signTransaction', e);
        res(e);
      });
  } catch (e) {
    debugErrors(e);
    debugErrors('Error: eth_signTransaction', e);
    res(e);
  }
};
