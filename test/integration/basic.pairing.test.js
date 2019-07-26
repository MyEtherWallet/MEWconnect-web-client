'use strict';

// Libs //
import Initiator from '../../src/MewConnectInitiator';
import Receiver from '@clients/receiver';
import { signals, rtcSignals, roles } from '@signals';
import { stunServers, websocketURL } from '@config';

/*
|--------------------------------------------------------------------------
|
| MewConnect Pairing Integration Tests
|
|--------------------------------------------------------------------------
|
| The goal of these integration tests are to ensure the functionality of the MewConnect Pairing Server.
| The Pairing Server attempts to pair two "signaling" peers together via a secure socket connection,
| via AWS Lambda Websockets.
| These peers will then establish a webRTC connection to each other, allowing
| secure communication using the credentials created during the pairing process.
|
| The tests attempt to mirror the process defined in the following documentation outline:
| https://docs.google.com/document/d/19acrYB3iLT4j9JDg0xGcccLXFenqfSlNiKVpXOdLL6Y
|
| There are (4) primary processes that must be tested:
|
| 1. Initial Websocket Connection
| 2. WebRTC Offer Creation
| 3. WebRtc Answer Creation
| 4. WebRTC Connection
|
*/

/*
===================================================================================
  Test "Member Variables"
===================================================================================
*/

// Clients //
let initiator;
let receiver;

// WebRTC Offer/Answer //
let webRTCOffer;
let webRTCAnswer;

// ICE Servers //
let iceServers;

/*
===================================================================================
  Test "Member Functions"
===================================================================================
*/

/**
 * Set a timeout to perform callback after process.env.CONNECTION_TIMEOUT.
 * This is done so that a test can pass after a given amount of time.
 *
 * @param  {Function} done - Callback function to perform (usually passing a test)
 */
const pass = async done => {
  setTimeout(done, process.env.CONNECTION_TIMEOUT);
};

/*
===================================================================================
  Test Start
===================================================================================
*/
describe('Pairing', () => {
  xit('Should connect', async done => {
    try {
      initiator = new Initiator();
      receiver = new Receiver();

      const websocketURL = 'wss://0ec2scxqck.execute-api.us-west-1.amazonaws.com/dev';
      // initiator.generateKeys();
      await initiator.initiatorStart(websocketURL);

      // Receiver //

      await receiver.setKeys(
        initiator.publicKey,
        initiator.privateKey,
        initiator.connId
      );
      await receiver.connect(websocketURL);

      receiver.on(signals.confirmation, stuff => {
        console.log('receiver', signals.confirmation, stuff); // todo remove dev item
      });

      receiver.on(signals.offerSignal, async data => {
        console.log('receiver', signals.offerSignal, data); // todo remove dev item
      });

      receiver.on(signals.offer, async data => {
        console.log('receiver', signals.offer, data); // todo remove dev item
        webRTCOffer = await receiver.decrypt(data.data);
        const answer = await receiver.answer(webRTCOffer);
        const message = { data: answer };
        receiver.onRTC(rtcSignals.connect, stuff => {
          receiver.sendRTC('address');
          console.log('receiver', rtcSignals.connect, stuff); // todo remove dev item
        });

        receiver.onRTC(rtcSignals.data, stuff => {
          console.log('receiver', rtcSignals.data, stuff); // todo remove dev item
          done();
        });
        receiver.send(signals.answerSignal, message);
      });

      initiator.on('RtcConnectedEvent', () => {
        console.log('Initiator rtc connected event'); // todo remove dev item
        initiator.rtcSend({ type: 'address', data: '' });
      });

      // initiator.on(signals.initiated, data => {
      //   console.log(signals.initiated); // todo remove dev item
      // });
      // await receiver.connect(websocketURL);
      //
      // initiator.on(signals.confirmation, async stuff => {
      //   console.log('initiator', signals.confirmation, stuff); // todo remove dev item
      //   const offer = await initiator.offer()
      //   const message = { data: offer }
      //   initiator.send(signals.offerSignal, message)
      // });
      // initiator.on(signals.answer, async data => {
      //   console.log('initiator', signals.answer, data); // todo remove dev item
      //   const webRTCAnswer = await initiator.decrypt(data.data);
      //   await initiator.signal(webRTCAnswer)
      //   initiator.onRTC(rtcSignals.connect, stuff => {
      //     console.log('initiator', rtcSignals.connect, stuff); // todo remove dev item
      //     if(oneRecieved) done();
      //     oneRecieved = true;
      //   });
      // });

    } catch (e) {
      // console.log(e); // todo remove dev item
      done.fail(e);
    }
  }, 25000);

  it('Should use Ice Servers', async done => {
    try {
      initiator = new Initiator();
      receiver = new Receiver();

      const websocketURL = 'wss://0ec2scxqck.execute-api.us-west-1.amazonaws.com/dev';
      // initiator.generateKeys();
      await initiator.initiatorStart(websocketURL);

      // Receiver //

      await receiver.setKeys(
        initiator.publicKey,
        initiator.privateKey,
        initiator.connId
      );
      await receiver.connect(websocketURL);

      let firstView = true;
      receiver.on(signals.confirmation, stuff => {
        console.log('receiver', signals.confirmation, stuff); // todo remove dev item
      });

      // receiver.on(signals.offerSignal, async data => {
      //   console.log('receiver', signals.offerSignal, data); // todo remove dev item
      // });

      receiver.on(signals.offer, async data => {
        if (firstView) {
          initiator.socketEmit(signals.tryTurn);
          firstView = false;
          return;
        }
        console.log('receiver', signals.offer, data); // todo remove dev item
        webRTCOffer = await receiver.decrypt(data.data);
        const answer = await receiver.answer(webRTCOffer);
        const message = { data: answer };
        receiver.onRTC(rtcSignals.connect, stuff => {
          receiver.sendRTC('address');
          console.log('receiver', rtcSignals.connect, stuff); // todo remove dev item
        });

        receiver.onRTC(rtcSignals.data, stuff => {
          console.log('receiver', rtcSignals.data, stuff); // todo remove dev item
          done();
        });
        receiver.send(signals.answerSignal, message);
      });

      initiator.on('RtcConnectedEvent', () => {
        console.log('Initiator rtc connected event'); // todo remove dev item
        initiator.rtcSend({ type: 'address', data: '' });
      });

    } catch (e) {
      // console.log(e); // todo remove dev item
      done.fail(e);
    }
  }, 35000);

  xit('Should send a message via webRTC', async done => {

    receiver.onRTC(rtcSignals.data, stuff => {
      console.log('receiver', rtcSignals.data, stuff); // todo remove dev item
      done();
    });

    initiator.rtcSend({ type: 'address', data: '' });
  });

  xit('Should not connect with missing @role property', async done => {
    try {
      initiator = new Initiator();
      await initiator.initiatorStart(websocketURL);

      // Receiver //
      receiver = new Receiver();
      await receiver.setKeys(
        initiator.publicKey,
        initiator.privateKey,
        initiator.connId
      );

      await receiver.connect(websocketURL);

      receiver.on(signals.confirmation, stuff => {
        console.log('receiver', signals.confirmation, stuff); // todo remove dev item
      });

      receiver.on(signals.offerSignal, async data => {
        console.log('receiver', signals.offerSignal, data); // todo remove dev item
      });

      receiver.on(signals.offer, async data => {
        console.log('receiver', signals.offer, data); // todo remove dev item
        webRTCOffer = await receiver.decrypt(data.data);
        const answer = await receiver.answer(webRTCOffer);
        const message = { data: answer };
        receiver.onRTC(rtcSignals.connect, stuff => {
          console.log(rtcSignals.connect, stuff); // todo remove dev item
        });
        receiver.send(signals.answerSignal, message);
      });

    } catch (e) {
      // console.log(e); // todo remove dev item
      done.fail(e);
    }
  }, 20000);

});
