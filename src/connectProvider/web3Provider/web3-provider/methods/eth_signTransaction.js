/* eslint-disable */
import unit from 'ethjs-unit';
import EthCalls from '../web3Calls';
import { toError, toPayload } from '../jsonrpc';
import EventNames from '../events';
import { getSanitizedTx } from './utils';

import debugLogger from 'debug';
const debug = debugLogger('MEWconnectWeb3');
const debugErrors = debugLogger('MEWconnectError');

export default async (
  { payload, store, requestManager, eventHub },
  res,
  next
) => {
  if (payload.method !== 'eth_signTransaction') return next();
  const tx = payload.params[0];
  const localTx = Object.assign({}, payload);
  delete localTx['gas'];
  delete localTx['nonce'];
  const ethCalls = new EthCalls(requestManager);
  tx.nonce = !tx.nonce
    ? await store.state.web3.eth.getTransactionCount(
        store.state.wallet.getAddressString()
      )
    : tx.nonce;
  tx.gas =
    !tx.gas || tx.gas <= 0 ? await ethCalls.estimateGas(localTx) : tx.gas;
  tx.chainId = !tx.chainId ? store.state.network.type.chainID : tx.chainId;
  tx.gasPrice =
    !tx.gasPrice || tx.gasPrice <= 0
      ? await store.state.web3.eth.getGasPrice()
      : tx.gasPrice;
  getSanitizedTx(tx)
    .then(_tx => {
      eventHub.emit(EventNames.SHOW_TX_CONFIRM_MODAL, _tx, _response => {
        if(_response.reject){
          debug('USER DECLINED SIGN TRANSACTION');
          res(toError(payload.id, 'User Rejected Request', 4001));
          return;
        }
        debug('broadcasting', payload.method, _response);
        res(null, toPayload(payload.id, _response.rawTransaction));
      });
    })
    .catch(e => {
      debugErrors('Error: eth_signTransaction', e);
      res(e);
    });
};
