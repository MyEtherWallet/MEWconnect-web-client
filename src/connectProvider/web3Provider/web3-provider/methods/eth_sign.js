import EventNames from '../events';
import { toError, toPayload } from '../jsonrpc';
import misc from '../../helpers/misc';
import debugLogger from 'debug';
const debug = debugLogger('MEWconnectWeb3');

export default async ({ payload, eventHub }, res, next) => {
  if (payload.method !== 'eth_sign') return next();
  const msg = payload.params[1];
  eventHub.emit(EventNames.SHOW_MSG_CONFIRM_MODAL, msg, _response => {
    if(_response.reject){
      debug('USER DECLINED SIGN MESSAGE');
      res(toError(payload.id, 'User Rejected Request', 4001));
      return;
    }
    _response = misc.sanitizeHex(_response.toString('hex'));
    debug('sign result', _response)
    res(null, toPayload(payload.id, _response));
  });
};
