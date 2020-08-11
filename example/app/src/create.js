/* eslint-disable */

export default class MewWalletConnector {
  constructor(url) {
this.mewConnect = '';
this.provider = '';
    this.url = url;
  }

  async activate() {
    let account;
    const { default: MewConnect } =  await import('../../../src');
    console.log(MewConnect); // todo remove dev item
    if (!MewConnect.Provider.isConnected) {
      this.mewConnect = new MewConnect.Provider({ windowClosedError: true });

      this.provider = this.mewConnect.makeWeb3Provider(1, this.url, true);
      this.mewConnect.on('disconnected', () => {
        // this.emitDeactivate();
      });
      account = await this.mewConnect
        .enable()
        .catch(() => {
          throw new Error('The user rejected the request.');
        })
        .then(accounts => accounts[0]);
    }



    return { provider: this.provider, chainId: 1, account: account };
  }

   async getProvider(){
    return this.provider;
  }

   async getChainId() {
    return 1;
  }

   async getAccount() {
    return this.provider.send('eth_accounts').then(accounts => accounts[0]);
  }

   deactivate() {
    this.provider.close();
    // this.emitDeactivate();
  }

   async close() {
    this.provider.close();
    // this.emitDeactivate();
  }
}