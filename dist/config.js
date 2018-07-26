'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var env = 'production';
var version = '0.0.1';

var stunServers = [{ 'url': 'stun:global.stun.twilio.com:3478?transport=udp' }];

exports.env = env;
exports.version = version;
exports.stunServers = stunServers;