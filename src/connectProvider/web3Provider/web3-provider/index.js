import WSProvider from './providers/ws-provider';
import InAppProvider from './providers/in-app-provider';
class MEWProvider {
  constructor(host, options, store, eventHub) {
    if (host && typeof host === 'string') {
      return new WSProvider(host, options, store, eventHub);
    }
    return new InAppProvider(host, options, store, eventHub);
  }
}

export default MEWProvider;
