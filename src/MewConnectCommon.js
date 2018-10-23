import createLogger from 'logging';
import EventEmitter from 'events';
import { isBrowser } from 'browser-or-node';
import { detect } from 'detect-browser';

import {
  versions,
  connectionCodeSchemas,
  connectionCodeSeparator,
  signal,
  rtc,
  iceConnectionState,
  stages,
  lifeCycle,
  communicationTypes
} from './constants';
import { version, stunServers } from './config';

const logger = createLogger('MewConnectCommon');

export default class MewConnectCommon extends EventEmitter {
  constructor() {
    super();

    this.isBrowser = isBrowser;

    this.jsonDetails = {
      stunSrvers: [...stunServers],
      signals: {
        ...signal
      },
      stages: {
        ...stages
      },
      lifeCycle: {
        ...lifeCycle
      },
      rtc: {
        ...rtc
      },
      communicationTypes: {
        ...communicationTypes
      },
      iceConnectionState: {
        ...iceConnectionState
      },
      connectionCodeSeparator,
      version,
      versions,
      connectionCodeSchemas
    };
  }

  isJSON(arg) {
    try {
      JSON.parse(arg);
      return true;
    } catch (e) {
      return false;
    }
  }

  static getBrowserRTC() {
    if (typeof window === 'undefined') return null;
    const wrtc = {
      RTCPeerConnection:
        window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection,
      RTCSessionDescription:
        window.RTCSessionDescription ||
        window.mozRTCSessionDescription ||
        window.webkitRTCSessionDescription,
      RTCIceCandidate:
        window.RTCIceCandidate ||
        window.mozRTCIceCandidate ||
        window.webkitRTCIceCandidate
    };
    if (!wrtc.RTCPeerConnection) return null;
    return wrtc;
  }

  static checkWebRTCAvailable() {
    const doesNotHaveWebRTC = MewConnectCommon.getBrowserRTC() == null;
    return !doesNotHaveWebRTC;
    // return false
  }

  static checkBrowser() {
    let browser = detect();
    if(browser === null){
      browser = {version: {split: () => [1]}}
    }
    const browserVersion = browser.version.split(0, 1)[0];
    /*
    * Chrome > 23
    * Firefox > 22
    * Opera > 18
    * Safari > 11 (caveats exist)
    * Edge - none (RTCDataChannel not supported)
    * IE - none
    * */
    if (typeof window !== 'undefined') {
      if (browser.name === 'safari') {
        // eslint-disable-next-line global-require
        require('webrtc-adapter');
        return MewConnectCommon.buildBrowserResult(
          true,
          'Safari',
          `version: ${browser.version}`
        );
      }
      if (browser.name === 'ie') {
        return MewConnectCommon.buildBrowserResult(
          true,
          'Internet Explorer',
          '',
          true
        );
      }
      if (browser.name === 'edge') {
        return MewConnectCommon.buildBrowserResult(
          true,
          'Edge',
          `version: ${browser.version}`,
          true
        );
      }
      let name = '';
      let minVersion = 0;

      if (browser.name === 'opera') {
        name = 'Opera';
        minVersion = 18;
      } else if (browser.name === 'firefox') {
        name = 'Firefox';
        minVersion = 22;
      } else if (browser.name === 'chrome') {
        name = 'Chrome';
        minVersion = 23;
      } else {
        return MewConnectCommon.buildBrowserResult(false, '', '', true);
      }

      try {
        if (minVersion >= +browserVersion) {
          return MewConnectCommon.buildBrowserResult(
            true,
            name,
            `version: ${browserVersion}`
          );
        }
        return MewConnectCommon.buildBrowserResult(false, '', '');
      } catch (e) {
        logger.error(e);
      }
    }
  }

  static buildBrowserResult(status, browser, browserVersion, noSupport) {
    return {
      status,
      browser,
      browserVersion,
      noSupport: noSupport || false
    };
  }
}
