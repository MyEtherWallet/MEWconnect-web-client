import PopUpHandler from './popUpHandler';
import path from 'path';
import QrCode from 'qrcode';
import Initiator from '../connectClient/MewConnectInitiator';
import Web3 from 'web3';
import MEWProvider from './web3Provider/web3-provider/index';
import MEWconnectWallet from './web3Provider/MEWconnect/index';
import Networks from './web3Provider/networks/index';
import url from 'url';
import EventEmitter from 'events';
import EventNames from './web3Provider/web3-provider/events';
import { Transaction } from 'ethereumjs-tx';
import BigNumber from 'bignumber.js';
import * as unit from 'ethjs-unit';
import parseTokensData from './web3Provider/helpers/parseTokensData';

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
    this.state = {
      wallet: null
    };
    this.initiator = new Initiator();
    this.connectionString = '';
    const network = Networks['ETH'];
    console.log(Networks); // todo remove dev item
    // this.startWeb3();
    this.popUpHandler = new PopUpHandler();
    this.connectionState = false;
  }

  showNotice(){
    // this.popUpHandler.showNotice("disconnected", {border: 'rgba(5, 158, 135, 0.88) solid 2px'});
    this.popUpHandler.showPopupWindow('lksdfsdfsdfsdfsdfsdfsdfsfsfdsf');
  }

  async enable() {
    console.log(this.state.wallet); // todo remove dev item
    if(!this.state.wallet){
      this.connectionState = 'connecting';
      this.state.wallet = await new MEWconnectWallet(this.state);
      this.popUpHandler.showNotice("connected", {border: 'rgba(5, 158, 135, 0.88) solid 2px'});
      this.popUpHandler.hideNotifier();
      console.log(this.state.wallet); // todo remove dev item
      this.disconnectNotifier();
    }
    return [this.state.wallet.getChecksumAddressString()];
  }

  makeWeb3Provider(RPC_URL) {
    const chain = 'ROP'; // 'ETH'
    const defaultNetwork = Networks[chain][0];
    this.state.network = defaultNetwork;
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
    this.setupListeners();
    return this.state.web3;
  }

  disconnectNotifier() {
    const connection = this.state.wallet.getConnection();
    console.log(connection); // todo remove dev item
    console.log(connection.lifeCycle); // todo remove dev item
    connection.webRtcCommunication.on(connection.lifeCycle.RtcDisconnectEvent, () => {
      this.popUpHandler.showNotice("disconnected");
    });
    connection.webRtcCommunication.on(connection.lifeCycle.RtcClosedEvent, () => {
      this.popUpHandler.showNotice("disconnected");
    });


  }

  disconnect() {
    const connection = this.state.wallet.getConnection();
    console.log(connection); // todo remove dev item
    connection.disconnectRTC();
  }

  sign(tx) {
    if (this.state.wallet) {
      return this.state.wallet.signTransaction(tx);
    }
  }

  setupListeners() {
    this.eventHub.on(EventNames.SHOW_TX_CONFIRM_MODAL, (tx, resolve) => {
      this.parseRawTx(tx);
      if (tx.hasOwnProperty('ensObj')) {
        delete tx['ensObj'];
      }
      this.responseFunction = resolve;
      const signPromise = this.state.wallet.signTransaction(tx);
      this.popUpHandler.showNotice('Check your phone to sign the transaction');
      signPromise
        .then(_response => {
          const signedTxObject = _response;
          const signedTx = signedTxObject.rawTransaction;
          // this.popUpHandler.closePopupWindow();
          resolve(signedTxObject);
        })
        .catch(this.state.wallet.errorHandler);
    });

    this.eventHub.on('showSendSignedTx', (tx, resolve) => {
      const newTx = new Transaction(tx);
      // this.isHardwareWallet = this.account.isHardware;
      this.responseFunction = resolve;
      this.successMessage = 'Sending Transaction';
      this.signedTxObject = {
        rawTransaction: tx,
        tx: {
          to: `0x${newTx.to.toString('hex')}`,
          from: `0x${newTx.from.toString('hex')}`,
          value: `0x${newTx.value.toString('hex')}`,
          gas: `0x${newTx.gasPrice.toString('hex')}`,
          gasLimit: `0x${newTx.gasLimit.toString('hex')}`,
          data: `0x${newTx.data.toString('hex')}`,
          nonce: `0x${newTx.nonce.toString('hex')}`,
          v: `0x${newTx.v.toString('hex')}`,
          r: `0x${newTx.r.toString('hex')}`,
          s: `0x${newTx.s.toString('hex')}`
        }
      };
      this.parseRawTx(this.signedTxObject.tx);
      this.signedTx = this.signedTxObject.rawTransaction;
      this.responseFunction(this.signedTxObject);
    });
    this.eventHub.on('Hash', (hash) =>{
      this.popUpHandler.showNotice(`Transaction sent: <a href="${this.state.network.type.blockExplorerTX.replace('[[txHash]]', hash)}" target="_blank">View</a>`);
    })
    this.eventHub.on('Receipt', () =>{
      this.popUpHandler.showNotice("Transaction Completed");
    })
    this.eventHub.on('Error', () =>{
      this.popUpHandler.showNotice("Error");
    })
  }

  parseRawTx(tx) {
    let tokenData = '';
    if (tx.to && tx.data) {
      tokenData = parseTokensData(
        tx.data,
        tx.to,
        this.state.web3,
        this.state.network.type.tokens,
        this.state.network.type.name
      );
      tx.tokenTransferTo = tokenData.tokenTransferTo;
      tx.tokenTransferVal = tokenData.tokenTransferVal;
      tx.tokenSymbol = tokenData.tokenSymbol;
    }

    this.raw = tx;
    this.nonce = tx.nonce === '0x' ? 0 : new BigNumber(tx.nonce).toFixed();
    this.data = tx.data;
    this.gasLimit = new BigNumber(tx.gas).toFixed();
    this.gasPrice = parseInt(
      unit.fromWei(new BigNumber(tx.gasPrice).toFixed(), 'gwei')
    );
    this.toAddress = tx.to;
    this.amount = tx.value === '0x' ? '0' : new BigNumber(tx.value).toFixed();
    this.transactionFee = unit
      .fromWei(new BigNumber(tx.gas).times(tx.gasPrice).toFixed(), 'ether')
      .toString();
    this.ens = {};
    if (tx.hasOwnProperty('ensObj')) {
      this.ens = Object.assign({}, tx.ensObj);
    }
    this.lastRaw = tx;
  }

}