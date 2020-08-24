import misc from '../../helpers/misc';
import { toError, toPayload } from '../jsonrpc';
import utils from 'ethereumjs-util';

export default async ({ payload }, res, next) => {
  if (payload.method !== 'personal_ecRecover') return next();
  if (payload.params.length < 2) {
    res(
      toError(
        payload.id,
        `personal_ecRecover expects 2 parameters.  Received ${payload.params.length} `
      )
    );
  }
  const parts = utils.fromRpcSig(payload.params[1]);
  if (!parts) {
    res(
      toError(payload.id, 'Invalid signature supplied to personal_ecRecover')
    );
  }
  const recovered = utils.ecrecover(
    utils.hashPersonalMessage(misc.toBuffer(payload.params[0])),
    parts.v,
    parts.r,
    parts.s
  );
  const addressBuffer = utils.pubToAddress(recovered);
  res(null, toPayload(payload.id, '0x' + addressBuffer.toString('hex')));
};
