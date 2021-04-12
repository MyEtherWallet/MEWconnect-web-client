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

  if (payload.method !== 'eth_getEncryptionPublicKey') return next();
  try {
    // const mewConnect = store.wallet.getConnection();
    // mewConnect.sendRtcMessage('eth_getEncryptionPublicKey', '');
    // mewConnect.once('eth_getEncryptionPublicKey', data => {
    //   res(data);
    // });
    eventHub.emit(EventNames.GET_ENCRYPTED_PUBLIC_KEY, _response => {
      if(_response.reject){
        debug('USER DECLINED SIGN TRANSACTION');
        res(toError(payload.id, 'User Rejected Request', 4001));
        return;
      }
      debug('eth_getEncryptionPublicKey response', payload.method, _response);
      res(null, toPayload(payload.id, _response));
    });
  } catch (e) {
    debugErrors(e)
    debugErrors('Error: eth_getEncryptionPublicKey', e);
    res(e);
  }
};
