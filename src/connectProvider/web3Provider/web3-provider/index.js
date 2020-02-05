import HttpProvider from './providers/http-provider';
import WSProvider from './providers/ws-provider';

class MEWProvider {
  constructor(host, options, web3, eventHub) {
    if (host && typeof host === 'string') {
      if (/^http(s)?:\/\//i.test(host)) {
        return new HttpProvider(host, options, web3, eventHub);
      } else if (/^ws(s)?:\/\//i.test(host)) {
        return new WSProvider(host, options, web3, eventHub);
      } else if (host) {
        throw new Error('Can\'t autodetect provider for "' + host + '"');
      }
    }
  }
}

export default MEWProvider;
