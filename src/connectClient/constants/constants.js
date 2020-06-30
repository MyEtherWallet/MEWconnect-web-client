import { version } from '../config';

const versions = ['0.0.1'];

const connectionCodeSchemas = {
  '0.0.1': ['version', 'key', 'connId']
};

const connectionCodeSeparator = '_';

const rtc = {
  error: 'error',
  connect: 'connect',
  close: 'close',
  data: 'data',
  signal: 'signal'
};

const iceConnectionState = {
  new: 'new',
  connecting: 'connecting',
  connected: 'connected',
  disconnected: 'disconnected',
  failed: 'failed',
  closed: 'closed'
};

const RTCSignalingState = {
  stable: 'stable',
  'have-local-offer': 'have-local-offer',
  'have-remote-offer': 'have-remote-offer',
  'have-local-pranswer': 'have-local-pranswer',
  'have-remote-pranswer': 'have-remote-pranswer'
};

const RTCIceGatheringState = {
  new: 'new',
  gathering: 'gathering',
  complete: 'complete'
};

const stages = {
  initiator: 'initiator',
  receiver: 'receiver'
};

const lifeCycle = {
  AuthRejected: 'AuthRejected',
  RtcInitiatedEvent: 'RtcInitiatedEvent',
  signatureCheck: 'signatureCheck',
  SocketConnectedEvent: 'SocketConnectedEvent',
  confirmationFailedEvent: 'confirmationFailedEvent',
  confirmationFailedBusyEvent: 'confirmationFailedBusyEvent',
  invalidConnectionEvent: 'invalidConnectionEvent',
  codeDisplay: 'codeDisplay',
  checkNumber: 'checkNumber',
  ConnectionId: 'ConnectionId',
  receiverVersion: 'receiverVersion',
  offerCreated: 'offerCreated',
  sendOffer: 'sendOffer',
  answerReceived: 'answerReceived',
  RtcConnectedEvent: 'RtcConnectedEvent',
  RtcConnectedEmitted: 'RtcConnectedEmitted',
  RtcClosedEvent: 'RtcClosedEvent',
  RtcDisconnectEvent: 'RtcDisconnectEvent',
  RtcDestroyedEvent: 'RtcDestroyedEvent',
  RtcFailedEvent: 'RtcFailedEvent',
  RtcErrorEvent: 'RtcErrorEvent',
  UsingFallback: 'UsingFallback',
  Failed: 'failed',
  attemptedDisconnectedSend: 'attemptedDisconnectedSend',
  connected: 'connected',
  disconnected: 'disconnected'
};

const communicationTypes = {
  address: 'address',
  signMessage: 'signMessage',
  signTx: 'signTx'
};

const loggerLevels = {
  errorLvl: 'error',
  warnLvl: 'warn',
  infoLvl: 'info',
  verboseLvl: 'verbose',
  debugLvl: 'debug',
  sillyLvl: 'silly'
};

export {
  version,
  versions,
  connectionCodeSchemas,
  connectionCodeSeparator,
  stages,
  rtc,
  iceConnectionState,
  RTCSignalingState,
  RTCIceGatheringState,
  lifeCycle,
  communicationTypes,
  loggerLevels
};
