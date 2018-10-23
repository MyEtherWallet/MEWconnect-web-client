import { version } from './config';

const versions = ['0.0.1'];

const connectionCodeSchemas = {
  '0.0.1': ['version', 'key', 'connId']
};

const connectionCodeSeparator = '_';

const signal = {
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
  RtcConnectedEmitted: "RtcConnectedEmitted",
  RtcClosedEvent: 'RtcClosedEvent',
  RtcDisconnectEvent: 'RtcDisconnectEvent',
  RtcFailedEvent: 'RtcFailedEvent',
  RtcErrorEvent: 'RtcErrorEvent',
  UsingFallback: 'UsingFallback',
  Failed: 'failed',
  attemptedDisconnectedSend: 'attemptedDisconnectedSend'
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
  signal,
  stages,
  rtc,
  iceConnectionState,
  RTCSignalingState,
  RTCIceGatheringState,
  lifeCycle,
  communicationTypes,
  loggerLevels
};
