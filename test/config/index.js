'use strict';

import wrtc from 'wrtc';

const stunServers = [{ urls: 'stun:global.stun.twilio.com:3478?transport=udp' }];
const websocketURL = process.env.WEBSOCKET_URL || 'wss://connect2.mewapi.io/staging'
const webRTCOptions = {
  trickle: false,
  iceTransportPolicy: 'relay',
  config: {
    iceServers: stunServers
  },
  wrtc: wrtc
};

export { stunServers, websocketURL, webRTCOptions };
