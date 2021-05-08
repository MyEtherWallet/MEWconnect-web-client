import * as packageJSON from '../../package.json';

const env = 'production';
const version = packageJSON.version;
const V1endpoint = 'https://connect.mewapi.io';
const V2endpoint = 'wss://connect2.mewapi.io/staging';

const stunServers = [
  { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }
];

// const stunServers = [{"url":"stun:global.stun.twilio.com:3478?transport=udp","urls":"stun:global.stun.twilio.com:3478?transport=udp"},{"url":"turn:global.turn.twilio.com:3478?transport=udp","username":"aab76696eb0285530c6f8ee95c5f075d3515d1e307a22414b1d179a2a3d44ed7","urls":"turn:global.turn.twilio.com:3478?transport=udp","credential":"eyAeQDLjJ8kO3Ru8Tnan7vpCwlU1yDvDpN312KG12WE="},{"url":"turn:global.turn.twilio.com:3478?transport=tcp","username":"aab76696eb0285530c6f8ee95c5f075d3515d1e307a22414b1d179a2a3d44ed7","urls":"turn:global.turn.twilio.com:3478?transport=tcp","credential":"eyAeQDLjJ8kO3Ru8Tnan7vpCwlU1yDvDpN312KG12WE="},{"url":"turn:global.turn.twilio.com:443?transport=tcp","username":"aab76696eb0285530c6f8ee95c5f075d3515d1e307a22414b1d179a2a3d44ed7","urls":"turn:global.turn.twilio.com:443?transport=tcp","credential":"eyAeQDLjJ8kO3Ru8Tnan7vpCwlU1yDvDpN312KG12WE="}]

export { env, version, stunServers, V1endpoint, V2endpoint };
