import * as packageJSON from '../../package.json';

const env = 'production';
const version = packageJSON.version;
const V1endpoint = 'wss://connect.mewapi.io';
const V2endpoint = 'wss://connect2.mewapi.io/staging';

const stunServers = [
  { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }
];

export { env, version, stunServers, V1endpoint, V2endpoint };
