// import 'regenerator-runtime/runtime';
// import { expect as chaiExpect } from 'chai';
// import debug from 'debug';
// import * as MewConnectSrc from '../../src';
// import MewConnectReceiver from '../helpers/MewConnectReceiver';
//
// const connectLogger = debug('test:Connect');
// const fallbackLogger = debug('test:Fallback');
//
// const signalUrl = typeof signalServer !== 'undefined' ? signalServer : 'https://connect.mewapi.io';
import MewConnectInitiator from '../src/connectClient/initiator/MewConnectInitiator';
import MewConnectCrypto from '../src/connectClient/MewConnectCrypto';

describe('Check Base Connection Operation', () => {
  it('tests', async done => {
    const init = new MewConnectInitiator();
    init.generateKeys();
    const mewCrypto = init.mewCrypto
    const data = { type: 'address', data: '0x2khkj223lkjh2', id: '123' };
    const input = JSON.stringify(data);

    const encrypt = async arg => {
      let encryptedSend;
      if (typeof arg === 'string') {
        encryptedSend = await mewCrypto.encrypt(arg);
      } else {
        encryptedSend = await mewCrypto.encrypt(JSON.stringify(arg));
      }
      return JSON.stringify(encryptedSend);
    };
    encrypt(input).then(vlaue => {
      init.webRtcCommunication.on('appData', result => {
        console.log(result); // todo remove dev item
        expect(result.type).toEqual(expect.stringMatching(data.type));
        expect(result.data).toEqual(expect.stringMatching(data.data));
        expect(result.id).toEqual(expect.stringMatching(data.id));
        done();
      })
      init.webRtcCommunication.onData('123', vlaue)
    });
  });
});
