import WSProvider from './providers/ws-provider';
import HttpProvider from './providers/http-provider';
class MEWProvider {
  constructor(host, options, store, eventHub) {
    if (host && typeof host === 'string') {
      if (/^http(s)?:\/\//i.test(host)) {
        store.noSubs = true;
        return new HttpProvider(host, options, store, eventHub);
      } else if (/^ws(s)?:\/\//i.test(host)) {
        return new WSProvider(host, options, store, eventHub);
      } else if (host) {
        throw new Error('Can\'t autodetect provider for "' + host + '"');
      }
    }
  }
}

export default MEWProvider;
