// INITIATOR CLIENT
// The initiator client is the integration end of the connection,
// and sends the connection details to
// the signal server which then waits for a corresponding receiver connection.

// CRYPTO
// the crypto constructor is a collection of methods used by both the initiator and receiver
// in creating the direct connection
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import MewConnectClient from './connectClient/index';
import MewConnectProvider from './connectProvider/index';

export default {
  Initiator: MewConnectClient.Initiator,
  Crypto: MewConnectClient.Crypto,
  Client: MewConnectClient,
  Provider: MewConnectProvider
};
