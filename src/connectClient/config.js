import * as packageJSON from '../../package.json';

const env = 'production';
const version = packageJSON.version;
const V1endpoint = 'https://connect.mewapi.io';
const V2endpoint = 'wss://connect2.mewapi.io/staging';

const stunServers = [
  //{ urls: 'stun:global.stun.twilio.com:3478?transport=udp' }
  {
    username:
      '630befef281c1009fbff282f9871bb5881cf629c1da7ac3148a2979436b27ece',
    urls: 'turn:global.turn.twilio.com:3478',
    credential: 'k5qjsFwDvqzUMacCuk4UJJ4KOCO/sUWa1ww2uUs0EC4='
  }
];

export { env, version, stunServers, V1endpoint, V2endpoint };
