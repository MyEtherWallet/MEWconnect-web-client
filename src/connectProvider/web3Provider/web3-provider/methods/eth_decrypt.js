/* eslint-disable */
import unit from 'ethjs-unit';
import EthCalls from '../web3Calls';
import { toError, toPayload } from '../jsonrpc';
import EventNames from '../events';
import { getSanitizedTx } from './utils';

import sigUtils from 'eth-sig-util'

import debugLogger from 'debug';
import BigNumber from 'bignumber.js';
const debug = debugLogger('MEWconnectWeb3');
const debugErrors = debugLogger('MEWconnectError');

export default async (
  { payload, store, requestManager, eventHub },
  res,
  next
) => {
  console.log('eth_decrypt', payload, store, requestManager, eventHub); // todo remove dev item

  if (payload.method !== 'eth_decrypt') return next();
  try {
    console.log('eth_decrypt', payload); // todo remove dev item
    // const mewConnect = store.wallet.getConnection();
    // mewConnect.sendRtcMessage('eth_getEncryptionPublicKey', '');
    // mewConnect.once('eth_getEncryptionPublicKey', data => {
    //   res(data);
    // });
    console.log(payload.params[0]); // todo remove dev item
    eventHub.emit(EventNames.DECRYPT, payload.params[0], (_response) => {
      if(_response.reject){
        debug('USER DECLINED SIGN TRANSACTION');
        res(toError(payload.id, 'User Rejected Request', 4001));
        return;
      }
      debug('broadcasting', payload.method, _response);
      res(null, toPayload(payload.id, _response));
    });
  } catch (e) {
    debugErrors(e)
    debugErrors('Error: eth_decrypt', e);
    res(e);
  }
};
