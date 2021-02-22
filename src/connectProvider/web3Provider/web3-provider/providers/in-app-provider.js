/* eslint-disable */

import utils from 'web3-utils';
import BigNumber from 'bignumber.js';

class InAppProvider {
  constructor(provider, options, store, eventHub) {
    console.log('provider', provider); // todo remove dev item
    const handler = {
      apply: function(target, thisArg, argumentsList) {
        console.log('argumentsList', JSON.stringify(argumentsList[0])); // todo remove dev item
        return new Promise((resolve, reject) => {
          const values = ['eth_signTransaction', 'eth_sendTransaction'];

          if (values.includes(argumentsList[0].method)) {
            if (argumentsList[0].method === values[0]) {
              argumentsList[0].method = 'signTransaction';
            }
            const checks = async payloadInner => {
              // console.log('PAYLOAD_INNER send', JSON.stringify(payloadInner)); // todo remove dev item
              // console.log('PAYLOAD_INNER send2', payloadInner.method); // todo remove dev item
              const tx = Object.assign({}, payloadInner.params[0]);
              const localTx = Object.assign({}, tx);
              delete localTx['gas'];
              delete localTx['nonce'];
              tx.nonce = !tx.nonce
                ? await store.state.web3.eth.getTransactionCount(
                    store.state.wallet.getAddressString()
                  )
                : utils.toHex(tx.nonce);

              if (tx.gasLimit && !tx.gas) {
                tx.gas = utils.toHex(tx.gas);
              } else if (!tx.gasLimit && tx.gas) {
                tx.gasLimit = utils.toHex(tx.gas);
              }

              tx.gas =
                !tx.gas || new BigNumber(tx.gas).lte(0)
                  ? await store.state.web3.eth.estimateGas(localTx)
                  : utils.toHex(tx.gas);

              if (!utils.isHex(tx.gas)) {
                console.log(tx.gas); // todo remove dev item
                tx.gas = utils.toHex(tx.gas);
              }

              if (!tx.gasLimit) {
                tx.gasLimit = utils.toHex(tx.gas);
              }

              tx.data = !tx.data ? '0x' : tx.data;
              tx.gasPrice =
                !tx.gasPrice || new BigNumber(tx.gasPrice).lte(0)
                  ? await store.state.web3.eth.getGasPrice()
                  : utils.toHex(tx.gasPrice);
              tx.chainId = !tx.chainId
                ? await store.state.web3.eth.getChainId()
                : utils.toHex(tx.chainId);
              tx.gas = utils.toHex(tx.gas);

              payloadInner.params[0] = tx;
              console.log(
                'payloadOuter | payloadInner',
                JSON.stringify(payloadInner)
              ); // todo remove dev item

              return payloadInner;
            };

            const callback = (err, response) => {
              console.log('err', err, 'response', response); // todo remove dev item
              if (err) reject(err);
              else resolve(response.result);
            };

            if (argumentsList[0].method === 'eth_signTransaction') {
              argumentsList[0].method = 'signTransaction';
            }
            checks(argumentsList[0]).then(payloadOuter => {
              console.log('payloadOuter', payloadOuter); // todo remove dev item
              target(payloadOuter, callback);
            });
          } else {
            resolve(target(argumentsList[0], argumentsList[1]));
          }
        });
      }
    };
    provider.sendAsync = new Proxy(provider.send, handler);
    return provider;
  }
}

export default InAppProvider;
