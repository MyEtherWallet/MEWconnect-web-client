import { toPayload } from '../jsonrpc';

export default async ({ payload, store }, res, next) => {
  if (payload.method !== 'eth_accounts') return next();
  if(store.state.wallet){
    res(null, toPayload(payload.id, [store.state.wallet.getAddressString()]));
  } else {
    try {
      store.state.enable().then(accounts =>{
        res(null, toPayload(payload.id, accounts));
      })
    } catch (e) {
      res(null, toPayload(payload.id, []));
    }
  }

};
