/* eslint-disable */
import { toError, toPayload } from '../jsonrpc';
import EventNames from '../events';
import debugLogger from 'debug';
const debug = debugLogger('MEWconnectWeb3');
const debugErrors = debugLogger('MEWconnectError');

export default async ({ payload, eventHub }, res, next) => {
  if (payload.method !== 'eth_signTypedData_v3') return next();
  try {
    eventHub.emit(
      EventNames.SIGN_TYPE_DATA_V3,
      payload.params[1],
      _response => {
        if (_response.reject) {
          debug('USER DECLINED SIGN TYPED DATA');
          res(toError(payload.id, 'User Rejected Request', 4001));
          return;
        }
        debug('eth_signTypedData_v3 response', payload.method, _response);
        res(null, toPayload(payload.id, _response));
      }
    );
  } catch (e) {
    debugErrors(e);
    debugErrors('Error: eth_signTypedData_v3', e);
    res(e);
  }
};
