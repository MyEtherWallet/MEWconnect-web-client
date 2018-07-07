

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

const MewConnectInitiator = require('./MewConnectInitiator');
const MewConnectCrypto = require('./MewConnectCrypto');
const MewConnectInitiatorClient = require('./MewConnectInitiatorClient');
const MewConnectReceiverClient = require('./MewConnectReceiverClient');

module.exports.Crypto = MewConnectCrypto;
module.exports.Initiator = MewConnectInitiator;
module.exports.InitiatorClient = MewConnectInitiatorClient;
module.exports.ReceiverClient = MewConnectReceiverClient;
