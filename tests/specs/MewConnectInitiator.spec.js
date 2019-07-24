import 'regenerator-runtime/runtime';
import { expect as chaiExpect } from 'chai';
import debug from 'debug';
import * as MewConnectSrc from '../../src';
import MewConnectReceiver from '../helpers/MewConnectReceiver';

const connectLogger = debug('test:Connect');
const fallbackLogger = debug('test:Fallback');

const signalUrl = typeof signalServer !== 'undefined' ? signalServer : 'https://connect.mewapi.io';



describe('Check Base Connection Operation', () => {
  if (typeof mocha === 'undefined') {
    const wrtc = require('wrtc');

    Object.defineProperties(window, {
      'MediaStream': {
        value: wrtc.MediaStream
      },
      'MediaStreamTrack': {
        value: wrtc.MediaStreamTrack
      },
      'RTCDataChannel': {
        value: wrtc.RTCDataChannel
      },
      'RTCDataChannelEvent': {
        value: wrtc.RTCDataChannelEvent
      },
      'RTCIceCandidate': {
        value: wrtc.RTCIceCandidate
      },
      'RTCPeerConnection': {
        value: wrtc.RTCPeerConnection
      },
      'RTCPeerConnectionIceEvent': {
        value: wrtc.RTCPeerConnectionIceEvent
      },
      'RTCRtpReceiver': {
        value: wrtc.RTCRtpReceiver
      },
      'RTCRtpSender': {
        value: wrtc.RTCRtpSender
      },
      'RTCSessionDescription': {
        value: wrtc.RTCSessionDescription
      }
    });

  }
  it('should connect', function(done) {
    if (typeof mocha !== 'undefined') this.timeout(7000);
    const recSignals = [];
    const intSignals = [];
    const completed = [];
    const MewConnect = MewConnectSrc.default.Initiator;
    const mewConnectClient = MewConnect.init();

    mewConnectClient.initiatorStart(signalUrl);

    mewConnectClient.on('codeDisplay', code => {
      console.log('started - should connect');
      intSignals.push('codeDisplay');
      const connParts = code.split('_');
      const params = {
        connId: connParts[2].trim(),
        key: connParts[1].trim(),
        version: connParts[0].trim()
      };

      const recieverPeer = new MewConnectReceiver();

      setTimeout(() => {
        recieverPeer.receiverStart(signalUrl, params);
      }, 500);

      recieverPeer.on('signatureCheck', () => {
        recSignals.push('signatureCheck');
      });
      recieverPeer.on('RtcInitiatedEvent', () => {
        recSignals.push('RtcInitiatedEvent');
      });

      mewConnectClient.on('signatureCheck', () => {
        intSignals.push('signatureCheck');
      });
      mewConnectClient.on('SocketConnectedEvent', () => {
        intSignals.push('SocketConnectedEvent');
      });
      mewConnectClient.on('offerCreated', () => {
        intSignals.push('offerCreated');
      });
      mewConnectClient.on('sendOffer', () => {
        intSignals.push('sendOffer');
      });
      mewConnectClient.on('answerReceived', () => {
        intSignals.push('answerReceived');
      });
      mewConnectClient.on('RtcInitiatedEvent', () => {
        intSignals.push('RtcInitiatedEvent');
      });
      mewConnectClient.on('UsingFallback', () => {
        intSignals.push('UsingFallback');
      });

      mewConnectClient.on('RtcConnectedEvent', () => {
        setTimeout(() => {
          mewConnectClient.disconnectRTC();
          chaiExpect(intSignals).to.be.an('array').to.include.members(['signatureCheck', 'SocketConnectedEvent', 'sendOffer', 'answerReceived', 'codeDisplay', 'RtcInitiatedEvent']);
          chaiExpect(intSignals).to.not.include(['UsingFallback']);

          completed.push('Initiator');
          connectLogger('intSignals', intSignals);
          if (completed.includes('Initiator') && completed.includes('Receiver')) {
            done();
          }
        }, 1000);
      });

      recieverPeer.on('RtcConnectedEvent', () => {
        setTimeout(() => {
          recieverPeer.disconnectRTC();
          chaiExpect(recSignals).to.be.an('array').to.include.members(['RtcInitiatedEvent', 'signatureCheck']);
          completed.push('Receiver');
          connectLogger('recSignals', recSignals);
          if (completed.includes('Initiator') && completed.includes('Receiver')) {
            done();
          }
        }, 1000);
      });
    });
  }, 7000);

});

xdescribe('Check Fallback Operation', () => {
  if (typeof mocha === 'undefined') {
    const wrtc = require('wrtc');

    Object.defineProperties(window, {
      'MediaStream': {
        value: wrtc.MediaStream
      },
      'MediaStreamTrack': {
        value: wrtc.MediaStreamTrack
      },
      'RTCDataChannel': {
        value: wrtc.RTCDataChannel
      },
      'RTCDataChannelEvent': {
        value: wrtc.RTCDataChannelEvent
      },
      'RTCIceCandidate': {
        value: wrtc.RTCIceCandidate
      },
      'RTCPeerConnection': {
        value: wrtc.RTCPeerConnection
      },
      'RTCPeerConnectionIceEvent': {
        value: wrtc.RTCPeerConnectionIceEvent
      },
      'RTCRtpReceiver': {
        value: wrtc.RTCRtpReceiver
      },
      'RTCRtpSender': {
        value: wrtc.RTCRtpSender
      },
      'RTCSessionDescription': {
        value: wrtc.RTCSessionDescription
      }
    });

  }
  it('should call fallback', function(done) {
    if (typeof mocha !== 'undefined') {
      // this.skip();
      this.timeout(8000);
    } else {
      console.log('SKIIPING TEST IN SERVER SIDE CONTEXT');
      console.log('should call fallback fails on node.js');
      done();
    }
    const recSignals = [];
    const intSignals = [];
    const completed = [];
    let usedTurn = false;
    const MewConnect = MewConnectSrc.default.Initiator;
    const mewConnectClient = MewConnect.init();

    mewConnectClient.initiatorStart(signalUrl);

    mewConnectClient.on('codeDisplay', code => {
      console.log('started - should call fallback');
      intSignals.push('codeDisplay');
      const connParts = code.split('_');
      const params = {
        connId: connParts[2].trim(),
        key: connParts[1].trim(),
        version: connParts[0].trim()
      };

      const recieverPeer = new MewConnectReceiver({ onlyTurn: true });

      setTimeout(() => {
        recieverPeer.receiverStart(signalUrl, params);
      }, 500);

      recieverPeer.on('signatureCheck', () => {
        recSignals.push('signatureCheck');
        if (!usedTurn) {
          usedTurn = true;
          // mewConnectClient.disconnectRTC();
          mewConnectClient.useFallback();
        }
      });
      recieverPeer.on('RtcInitiatedEvent', () => {
        recSignals.push('RtcInitiatedEvent');

      });
      recieverPeer.on('UsingFallback', () => {
        console.log('UsingFallback - event');
        recSignals.push('UsingFallback');
      });

      mewConnectClient.on('signatureCheck', () => {
        intSignals.push('signatureCheck');
      });
      mewConnectClient.on('SocketConnectedEvent', () => {
        intSignals.push('SocketConnectedEvent');
      });
      mewConnectClient.on('offerCreated', () => {
        intSignals.push('offerCreated');
      });
      mewConnectClient.on('sendOffer', () => {
        intSignals.push('sendOffer');
      });
      mewConnectClient.on('answerReceived', () => {
        intSignals.push('answerReceived');
      });
      mewConnectClient.on('RtcInitiatedEvent', () => {
        intSignals.push('RtcInitiatedEvent');
      });
      mewConnectClient.on('UsingFallback', () => {
        intSignals.push('UsingFallback');
      });

      mewConnectClient.on('RtcConnectedEvent', () => {
        setTimeout(() => {
          mewConnectClient.disconnectRTC();
          fallbackLogger('intSignals', intSignals);
          chaiExpect(intSignals).to.be.an('array').to.include.members(['UsingFallback', 'signatureCheck', 'SocketConnectedEvent', 'sendOffer', 'answerReceived', 'codeDisplay', 'RtcInitiatedEvent']);
          completed.push('Initiator');
          if (completed.includes('Initiator') && completed.includes('Receiver')) {
            done();
          }
        }, 500);
      });

      recieverPeer.on('RtcConnectedEvent', () => {
        setTimeout(() => {
          recieverPeer.disconnectRTC();
          fallbackLogger('recSignals', recSignals);
          chaiExpect(recSignals).to.be.an('array').to.include.members(['RtcInitiatedEvent', 'signatureCheck', 'UsingFallback']);
          completed.push('Receiver');

          if (completed.includes('Initiator') && completed.includes('Receiver')) {
            done();
          }
        }, 500);
      });

    });
  });

});
