import PopUpCreator from '../popUpCreator';
import path from 'path';
import QrCode from 'qrcode';
import Initiator from '../connectClient/MewConnectInitiator';
import Web3 from 'web3';
import MEWProvider from './wallets/web3-provider';
import MEWconnectWallet from './wallets/MEWconnect';
import Networks from './wallets/networks';
import url from 'url';
import EventEmitter from 'events';
import EventNames from './wallets/web3-provider/events';

export default class Integration {
  constructor(RPC_URL) {
    this.sessionId = '';
    this.sessionId = false;
    this.actionsPendingSessionId = [];
    this.walletLinkUrl = 'connect-MEWconnect';
    this.walletLinkOrigin = '';
    // this.injectIframe();
    this.actionsPendingIframeLoad = [];
    this.eventHub = new EventEmitter();
    this.state = {};
    this.initiator = new Initiator();
    this.connectionString = '';
    const network = Networks['ETH'];
    console.log(Networks); // todo remove dev item
    // this.startWeb3();
    this.popUpHandler = new PopUpCreator();

  }

  async openPopupWindow() {
    this.showPopupWindow();
  }

  async enable() {
    this.state.wallet = await new MEWconnectWallet();
    console.log(this.state.wallet); // todo remove dev item
    return [this.state.wallet.getChecksumAddressString()];
    // this.showPopupWindow();
    // this.initiator.on(this.initiator.lifeCycle.codeDisplay, (text) => {
    //   this.popUpHandler.showPopupWindow(text);
    // });
  }

  disconnect() {
    const connection = this.state.wallet.getConnection();
    console.log(connection); // todo remove dev item
    connection.disconnectRTC();
  }

  showPopupWindow(qrcode = '') {
    this.initiator.initiatorStart();
    this.makeWeb3Provider();
  }

  ev(tx) {
    const signPromise = this.state.wallet.signTransaction(tx);

    signPromise
      .then(_response => {
        this.signedTxObject = _response;
        this.signedTx = this.signedTxObject.rawTransaction;
      })
      .catch(this.state.wallet.errorHandler);
  }

  setupListeners() {
    this.eventHub.on(EventNames.SHOW_TX_CONFIRM_MODAL, (tx, callback) => {
      console.log(tx); // todo remove dev item
      const signPromise = this.state.wallet.signTransaction(tx);
      this.popUpHandler.showNotificationPopupWindow('Check your phone to sign the transaction');
      signPromise
        .then(_response => {
          const signedTxObject = _response;
          const signedTx = signedTxObject.rawTransaction;
          this.popUpHandler.closePopupWindow();
          callback(signedTx);
        })
        .catch(this.state.wallet.errorHandler);
    });
  }

  makeWeb3Provider(RPC_URL) {
    const chain = 'ROP'; // 'ETH'
    const defaultNetwork = Networks[chain][0];
    this.state.network = defaultNetwork;
    console.log(defaultNetwork); // todo remove dev item
    const hostUrl = RPC_URL
      ? url.parse(RPC_URL)
      : url.parse(defaultNetwork.url);
    const options = {};
    console.log(hostUrl); // todo remove dev item
    // // eslint-disable-next-line
    const parsedUrl = `${hostUrl.protocol}//${hostUrl.host}${
      defaultNetwork.port ? ':' + defaultNetwork.port : ''
    }${hostUrl.pathname}`;
    console.log(parsedUrl); // todo remove dev item
    this.state.web3 = new Web3(
      new MEWProvider(
        parsedUrl,
        options,
        {
          state: this.state
          // dispatch
        },
        this.eventHub
      )
    );
    this.state.web3.currentProvider.sendAsync = this.state.web3.currentProvider.send;
    console.log(this.state.web3); // todo remove dev item
    this.setupListeners();
    return this.state.web3;
  }

}