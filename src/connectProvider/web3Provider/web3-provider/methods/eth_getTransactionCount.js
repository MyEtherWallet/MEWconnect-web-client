import { toPayload } from '../jsonrpc';
import EthCalls from '../web3Calls';
import BigNumber from 'bignumber.js';
import Misc from '../../helpers/misc';

export default async ({ payload, store, requestManager }, res, next) => {
  if (payload.method !== 'eth_getTransactionCount') return next();
  const ethCalls = new EthCalls(requestManager);
  const addr = payload.params[0];
  let cached = {};
  if (store.nonceCache === undefined) {
    cached = {
      nonce: '0x00',
      timestamp: 0
    };
  } else {
    cached = store.nonceCache;
  }
  const timeDiff =
    Math.round((new Date().getTime() - cached.timestamp) / 1000) / 60;
  if (timeDiff > 1) {
    const liveNonce = await ethCalls.getTransactionCount(addr);
    const liveNonceBN = new BigNumber(liveNonce);
    const cachedNonceBN = new BigNumber(cached.nonce);
    if (timeDiff > 15) {
      cached = {
        nonce: Misc.sanitizeHex(liveNonceBN.toString(16)),
        timestamp: +new Date()
      };
    } else if (liveNonceBN.isGreaterThan(cachedNonceBN)) {
      cached = {
        nonce: Misc.sanitizeHex(liveNonceBN.toString(16)),
        timestamp: +new Date()
      };
    }
    store.nonceCache = cached;
  }
  res(null, toPayload(payload.id, cached.nonce));
};
