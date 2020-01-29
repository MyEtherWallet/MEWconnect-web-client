'use strict';

// Libs //
import Initiator from '../../src/connectClient/MewConnectInitiator';
import MewConnectCrypto from '../../src/connectClient/MewConnectCrypto';
import Receiver from '@clients/receiverV1';
import ReceiverTurn from '@clients/receiverV1Turn';
import { rtcSignals, roles } from '@signals';
import { stunServers, websocketURL } from '@config';
const signals = {
  attemptingTurn: 'attemptingTurn',
  turnToken: 'turnToken',
  tryTurn: 'tryTurn',
  connection: 'connection',
  connect: 'connect',
  signature: 'signature',
  offerSignal: 'offerSignal',
  offer: 'offer',
  answerSignal: 'answerSignal',
  answer: 'answer',
  rtcConnected: 'rtcConnected',
  disconnect: 'disconnect',
  handshake: 'handshake',
  confirmation: 'confirmation',
  invalidConnection: 'InvalidConnection',
  confirmationFailedBusy: 'confirmationFailedBusy',
  confirmationFailed: 'confirmationFailed'
};
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

const silent = false;
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
  it('Should connect', async done => {
    try {
      initiator = new Initiator({version: 'V1'});
      receiver = new Receiver();

      const websocketURL = 'wss://connect.mewapi.io';
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
        if(!silent) console.log('receiver', signals.confirmation, stuff); // todo remove dev item
      });

      receiver.on(signals.offerSignal, async data => {
        if(!silent) console.log('receiver', signals.offerSignal, data); // todo remove dev item
      });

      receiver.on('address', stuff => {
         if(!silent) console.log('receiver', rtcSignals.data, stuff); // todo remove dev item
      });

      receiver.on(rtcSignals.connect, stuff => {
        receiver.sendRTC('address');
        if(!silent) console.log('receiver', rtcSignals.connect, stuff); // todo remove dev item
      });

      receiver.on(signals.offer, async data => {
        if(!silent) console.log('receiver', signals.offer, data); // todo remove dev item
        webRTCOffer = await receiver.decrypt(data.data);
        const answer = await receiver.answer(webRTCOffer);
        const message = { data: answer };




        receiver.on('RtcConnectedEvent', () => {
          console.log('RtcConnectedEvent'); // todo remove dev item
        });

        receiver.send(signals.answerSignal, message);
      });

      initiator.on('RtcConnectedEvent', () => {
        console.log('RtcConnectedEvent'); // todo remove dev item
        if(!silent) console.log('Initiator rtc connected event'); // todo remove dev item
        initiator.rtcSend({ type: 'address', data: '' });
      });

      initiator.on('address', (data) => {
        if(!silent) console.log('initiator: address', data); // todo remove dev item
        done();
      });

    } catch (e) {
      // console.log(e); // todo remove dev item
      done.fail(e);
    }
  }, 25000);

  xit('Should use Ice Servers', async done => {
    try {
      let firstView = true;
      initiator = new Initiator({turnTest: true});
      receiver = new ReceiverTurn();

      const websocketURL = 'wss://connect.mewapi.io';
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

        if (firstView) {
          initiator.socketV1Emit(signals.tryTurn);
          // initiator.socketV1Emit(signals.tryTurn);
          // initiator.disconnectRTC();
          console.log(signals.tryTurn); // todo remove dev item
          // initiator.socketV1Emit(signals.tryTurn);
          firstView = false;
          return;
        }
        if(!silent) console.log('receiver', signals.confirmation, stuff); // todo remove dev item
      });

      // receiver.on(signals.offerSignal, async data => {
      //   console.log('receiver', signals.offerSignal, data); // todo remove dev item
      // });

      receiver.on(signals.attemptingTurn, async data => {
        if(!silent) console.log('receiver attempting turn', data); // todo remove dev item
      });

      receiver.on(signals.turnToken, async data => {
        if(!silent) console.log('receiver attempting turn'); // todo remove dev item
      });

      receiver.on(signals.offer, async data => {
        if(!silent) console.log('receiver', signals.offer, data); // todo remove dev item
        if (firstView) {
          initiator.disconnectRTC();
          console.log(signals.tryTurn); // todo remove dev item
          initiator.socketV1Emit(signals.tryTurn);
          firstView = false;
          return;
        }
        console.log('receiver', signals.offer, data); // todo remove dev item
        webRTCOffer = await receiver.decrypt(data.data);
        const answer = await receiver.answer(webRTCOffer);
        const message = { data: answer };
        receiver.onRTC(rtcSignals.connect, stuff => {
          receiver.sendRTC('address');
          if(!silent) console.log('receiver', rtcSignals.connect, stuff); // todo remove dev item
        });

        receiver.onRTC(rtcSignals.data, stuff => {
          if(!silent) console.log('receiver', rtcSignals.data, stuff); // todo remove dev item
          done();
        });
        receiver.send(signals.answerSignal, message);
      });

      initiator.on('RtcConnectedEvent', () => {
        if(!silent) console.log('Initiator rtc connected event'); // todo remove dev item
        initiator.rtcSend({ type: 'address', data: '' });
      });

      initiator.on('address', (data) => {
        if(!silent) console.log('initiator: address', data); // todo remove dev item
        done();
      });

    } catch (e) {
      // console.log(e); // todo remove dev item
      done.fail(e);
    }
  }, 35000);

});
