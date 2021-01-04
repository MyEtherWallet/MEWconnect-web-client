/* eslint-disable */
import unit from 'ethjs-unit';
import EthCalls from '../web3Calls';
import { toError, toPayload } from '../jsonrpc';
import EventNames from '../events';
import { getSanitizedTx } from './utils';

import debugLogger from 'debug';
import BigNumber from 'bignumber.js';
const debug = debugLogger('MEWconnectWeb3');
const debugErrors = debugLogger('MEWconnectError');

export default async (
  { payload, store, requestManager, eventHub },
  res,
  next
) => {
  if (payload.method !== 'eth_signTransaction') return next();
  const tx = payload.params[0];
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

    if(tx.gasLimit && !tx.gas){
      tx.gas = tx.gasLimit
    } else if(!tx.gasLimit && tx.gas){
      tx.gasLimit = tx.gas
    }
    tx.gas =
      !tx.gas || new BigNumber(tx.gas).lte(0) ? await ethCalls.estimateGas(localTx) : tx.gas;
    tx.chainId = !tx.chainId ? store.state.network.type.chainID : tx.chainId;
    tx.gasPrice =
      !tx.gasPrice || new BigNumber(tx.gasPrice).lte(0)
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
  } catch (e) {
    debugErrors(e)
    debugErrors('Error: eth_signTransaction', e);
    res(e);
  }
};
