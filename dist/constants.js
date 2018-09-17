'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var version = '0.0.1';

var versions = ['0.0.1'];

var connectionCodeSchemas = {
  '0.0.1': ['version', 'key', 'connId']
};

var connectionCodeSeparator = '_';

var signal = {
  'attemptingTurn': 'attemptingTurn',
  'turnToken': 'turnToken',
  'tryTurn': 'tryTurn',
  'connection': 'connection',
  'connect': 'connect',
  'signature': 'signature',
  'offerSignal': 'offerSignal',
  'offer': 'offer',
  'answerSignal': 'answerSignal',
  'answer': 'answer',
  'rtcConnected': 'rtcConnected',
  'disconnect': 'disconnect',
  'handshake': 'handshake',
  'confirmation': 'confirmation',
  'invalidConnection': 'InvalidConnection',
  'confirmationFailedBusy': 'confirmationFailedBusy',
  'confirmationFailed': 'confirmationFailed'
};

var rtc = {
  'error': 'error',
  'connect': 'connect',
  'close': 'close',
  'data': 'data',
  'signal': 'signal'
};

var stages = {
  'initiator': 'initiator',
  'receiver': 'receiver'
};

var lifeCycle = {
  'RtcInitiatedEvent': 'RtcInitiatedEvent',
  'signatureCheck': 'signatureCheck',
  'SocketConnectedEvent': 'SocketConnectedEvent',
  'confirmationFailedEvent': 'confirmationFailedEvent',
  'confirmationFailedBusyEvent': 'confirmationFailedBusyEvent',
  'invalidConnectionEvent': 'invalidConnectionEvent',
  'codeDisplay': 'codeDisplay',
  'checkNumber': 'checkNumber',
  'ConnectionId': 'ConnectionId',
  'receiverVersion': 'receiverVersion',
  'RtcConnectedEvent': 'RtcConnectedEvent',
  'RtcClosedEvent': 'RtcClosedEvent',
  'RtcDisconnectEvent': 'RtcDisconnectEvent',
  'RtcErrorEvent': 'RtcErrorEvent'
};

var communicationTypes = {
  'address': 'address',
  'signMessage': 'signMessage',
  'signTx': 'signTx'
};

var loggerLevels = {
  'errorLvl': 'error',
  'warnLvl': 'warn',
  'infoLvl': 'info',
  'verboseLvl': 'verbose',
  'debugLvl': 'debug',
  'sillyLvl': 'silly'
};

exports.version = version;
exports.versions = versions;
exports.connectionCodeSchemas = connectionCodeSchemas;
exports.connectionCodeSeparator = connectionCodeSeparator;
exports.signal = signal;
exports.stages = stages;
exports.rtc = rtc;
exports.lifeCycle = lifeCycle;
exports.communicationTypes = communicationTypes;
exports.loggerLevels = loggerLevels;