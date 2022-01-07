import * as packageJSON from '../../package.json';

const env = 'production';
const version = packageJSON.version;
const V1endpoint = 'https://connect.mewapi.io';
const V2endpoint = 'wss://connect2.mewapi.io/staging';

const stunServers = [
  { urls: 'stun:stun.l.google.com:19302' }
  // {
  //   username:
  //     '9462b94f4f1cc9a3ca90f0ac6be22aa447107d1f7bdc78fcaba68d68e6e69dc6',
  //   urls: 'turn:global.turn.twilio.com:3478',
  //   credential: 'zZ6qBgjCIwkWv+Qc4oZDq/EgEEjdTJHzS++55YZ0yDc='
  // }
];

export { env, version, stunServers, V1endpoint, V2endpoint };
