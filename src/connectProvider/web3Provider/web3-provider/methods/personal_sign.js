import EventNames from '../events';
import { toError, toPayload } from '../jsonrpc';
import misc from '../../helpers/misc'
import debugLogger from 'debug';
const debug = debugLogger('MEWconnectWeb3');

export default async ({ payload, eventHub }, res, next) => {
  if (payload.method !== 'personal_sign') return next();
  const msg = payload.params[0];
  eventHub.emit(EventNames.SHOW_MSG_CONFIRM_MODAL, msg, _response => {
    if(_response.reject){
      debug('USER DECLINED PERSONAL SIGN');
      res(toError(payload.id, 'User Rejected Request', 4001));
      return;
    }
    _response = misc.sanitizeHex(_response.toString('hex'));
    res(null, toPayload(payload.id, _response));
  });
};
