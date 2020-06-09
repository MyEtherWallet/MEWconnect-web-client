import EventNames from '../events';
import { toPayload } from '../jsonrpc';
import misc from '../../helpers/misc';

export default async ({ payload, eventHub }, res, next) => {
  if (payload.method !== 'personal_sign') return next();
  const msg = payload.params[1];
  eventHub.emit(EventNames.SHOW_MSG_CONFIRM_MODAL, msg, _response => {
    _response = misc.sanitizeHex(_response.toString('hex'));
    res(null, toPayload(payload.id, _response));
  });
};
