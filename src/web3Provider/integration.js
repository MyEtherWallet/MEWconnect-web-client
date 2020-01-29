import PopUpCreator from '../popUpCreator';
import path from 'path';
import QrCode from 'qrcode';
import Initiator from '../connectClient/MewConnectInitiator';
import Web3 from 'web3';
import MEWProvider from './wallets/web3-provider';
import Networks from './wallets/networks';
import url from 'url';

export default class Integration {
  constructor(RPC_URL) {
    this.sessionId = '';
    this.sessionId = false;
    this.actionsPendingSessionId = [];
    this.walletLinkUrl = 'connect-MEWconnect';
    this.walletLinkOrigin = '';
    // this.injectIframe();
    this.actionsPendingIframeLoad = [];
    this.initiator = new Initiator();
    this.connectionString = '';
    const network = Networks['ETH'];
    console.log(Networks); // todo remove dev item
    this.startWeb3();
    this.popUpHandler = new PopUpCreator();
    // this.initiator.on(this.initiator.lifeCycle.codeDisplay, (text) => {
    //   this.connectionString = text;
    // });
    this.initiator.on(this.initiator.lifeCycle.codeDisplay, (text) => {
      this.popUpHandler.showPopupWindow(text);
    });
  }

  async openPopupWindow() {
    this.showPopupWindow();
  }

  showPopupWindow(qrcode = '') {
    this.initiator.initiatorStart();
  }

  makeWeb3Provider(RPC_URL, CHAIN_ID) {

  }

  startWeb3(RPC_URL) {
    const defultNetwork = Networks['ETH'][0];
    console.log(defultNetwork); // todo remove dev item
    const hostUrl = RPC_URL
      ? url.parse(RPC_URL)
      : url.parse(defultNetwork.url);
    const options = {};
    console.log(hostUrl); // todo remove dev item
    // // eslint-disable-next-line
    const parsedUrl = `${hostUrl.protocol}//${hostUrl.host}${
      defultNetwork.port ? ':' + defultNetwork.port : ''
    }${hostUrl.pathname}`;
    console.log(parsedUrl); // todo remove dev item
    const web3Instance = new Web3(
      new MEWProvider(
        parsedUrl,
        options
        // {
        //   state,
        //   dispatch
        // },
        // this._vm.$eventHub
      )
    );
    web3Instance.currentProvider.sendAsync = web3Instance.currentProvider.send;
    console.log(web3Instance); // todo remove dev item
  }

}