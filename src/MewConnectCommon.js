import EventEmitter from 'events';
import { isBrowser } from 'browser-or-node'
import { detect } from 'detect-browser';

import {
  versions,
  connectionCodeSchemas,
  connectionCodeSeparator,
  signal,
  rtc,
  stages,
  lifeCycle,
  communicationTypes
} from './constants';
import { version, stunServers } from './config';

export default class MewConnectCommon extends EventEmitter {
  constructor() {
    super();

    this.isBrowser = isBrowser

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
    var wrtc = {
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
    var doesNotHaveWebRTC = MewConnectCommon.getBrowserRTC() == null;
    return !doesNotHaveWebRTC;
    // return false
  }

  static checkBrowser() {
    const browser = detect();
    const version = browser.version.split(0, 1)[0];
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
        return MewConnectCommon.buildBrowserResult(
          true,
          'Safari',
          'version: ' + browser.version
        );
      } else if (browser.name === 'ie') {
        return MewConnectCommon.buildBrowserResult(
          true,
          'Internet Explorer',
          '',
          true
        );
      } else if (browser.name === 'edge') {
        return MewConnectCommon.buildBrowserResult(
          true,
          'Edge',
          'version: ' + browser.version,
          true
        );
      } else {
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
          if (minVersion >= +version) {
            return MewConnectCommon.buildBrowserResult(
              true,
              name,
              'version: ' + version
            );
          } else {
            return MewConnectCommon.buildBrowserResult(false, '', '');
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  static buildBrowserResult(status, browser, version, noSupport) {
    return {
      status: status,
      browser: browser,
      version: version,
      noSupport: noSupport || false
    };
  }
}
