'use strict';

var _MewConnectInitiator = require('./MewConnectInitiator');

var _MewConnectInitiator2 = _interopRequireDefault(_MewConnectInitiator);

var _MewConnectCrypto = require('./MewConnectCrypto');

var _MewConnectCrypto2 = _interopRequireDefault(_MewConnectCrypto);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// const MewConnectInitiator = require('./MewConnectInitiator')
// const MewConnectCrypto = require('./MewConnectCrypto')

// const MewConnectInitiatorClient = require('./MewConnectInitiatorClient')

// INITIATOR CLIENT
// The initiator client is the integration end of the connection,
// and sends the connection details to
// the signal server which then waits for a corresponding receiver connection.

// RECEIVER CLIENT
// The receiver client is the Mobile/Remote end of the connection and is where the connection
// details are entered to connect to the signal server which uses the supplied details to
// match it with an initiator which triggers the exchange of information used to establish
// a direct connection.

// CRYPTO
// the crypto constructor is a collection of methods used by both the initiator and receiver
// in creating the direct connection

var MewConnectReceiverClient = require('./MewConnectReceiverClient');

module.exports.Crypto = _MewConnectCrypto2.default;
module.exports.Initiator = _MewConnectInitiator2.default;
// module.exports.InitiatorClient = MewConnectInitiatorClient
module.exports.ReceiverClient = MewConnectReceiverClient;
