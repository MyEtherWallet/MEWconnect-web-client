import PopUpHandler from '../connectWindow/popUpHandler';
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

const state = {
  wallet: null
};
export default class Integration {
  constructor() {
    this.eventHub = new EventEmitter();
    this.initiator = new Initiator();
    this.popUpHandler = new PopUpHandler();
    this.connectionState = false;
    this.chainIdMapping = Object.keys(Networks).reduce((acc, curr) => {
      if (Networks[curr].length === 0) return acc;
      acc.push({
        name: Networks[curr][0].type.name_long.toLowerCase(),
        chainId: Networks[curr][0].type.chainID,
        key: Networks[curr][0].type.name
      });
      return acc;
    }, [{ name: 'mainnet', chainId: 1, key: 'ETH' }]);
    this.returnPromise = null;
  }



  showNotice() {
    this.popUpHandler.showPopupWindow('lksdfsdfsdfsdfsdfsdfsdfsfsfdsf');
  }

  showNotifier() {
    this.popUpHandler.showNotice('connected', { border: 'rgba(5, 158, 135, 0.88) solid 2px' });

  }

  async enable() {
    if(MEWconnectWallet.getConnectionState() === 'disconnected' && this.returnPromise === null){
      this.returnPromise = this.enabler();
    }
    console.log(MEWconnectWallet.getConnectionState()); // todo remove dev item
    console.log(this.returnPromise); // todo remove dev item
    return this.returnPromise;
  }

  async enabler() {

    if (!state.wallet && MEWconnectWallet.getConnectionState() === 'disconnected' ) {
      MEWconnectWallet.setConnectionState('connecting');
      this.connectionState = 'connecting';
      state.wallet = await new MEWconnectWallet(state);
      this.popUpHandler.showNotice('connected', { border: 'rgba(5, 158, 135, 0.88) solid 2px' });
      this.popUpHandler.hideNotifier();
      this.disconnectNotifier();
    }

    if (state.web3 && state.wallet) {
      await state.web3.eth.getTransactionCount(state.wallet.getChecksumAddressString());
    }

    if (state.web3Provider && state.wallet) {
      state.web3Provider.accountsChanged([state.wallet.getChecksumAddressString()]);
    }
    return [state.wallet.getChecksumAddressString()];
  }

  identifyChain(check) {
    if (typeof check === 'number') {
      let result = this.chainIdMapping.find(value => value.chainId === check);
      if (result) return result.key;
    } else if (typeof check === 'string') {
      let result = this.chainIdMapping.find(value => value.chainId == check);
      if (result) return result.key;
      result = this.chainIdMapping.find(value => value.name === check.toLowerCase());
      if (result) return result.key;
      result = this.chainIdMapping.find(value => value.key === check.toLowerCase());
      if (result) return result.key;
    }
    return 'ETH';
  }

  makeWeb3Provider(CHAIN_ID, RPC_URL) {
    const chain = this.identifyChain(CHAIN_ID);
    const defaultNetwork = Networks[chain][0];
    state.network = defaultNetwork;
    const hostUrl = url.parse(RPC_URL || defaultNetwork.url);
    const options = {};
    if (!/[wW]/.test(hostUrl.protocol)) {
      throw Error('websocket rpc endpoint required');
    }
    if (!hostUrl.hostname.includes(chain.name) && hostUrl.hostname.includes('infura.io')) {
      throw Error(`ChainId: ${CHAIN_ID} and infura endpoint ${hostUrl.hostname} d match`);
    }
    // // eslint-disable-next-line
    const parsedUrl = `${hostUrl.protocol}//${hostUrl.host}${
      defaultNetwork.port ? ':' + defaultNetwork.port : ''
    }${hostUrl.pathname}`;
    const web3Provider = new MEWProvider(
      parsedUrl,
      options,
      {
        state: state
      },
      this.eventHub
    );
    state.web3Provider = web3Provider;
    state.web3 = new Web3(
      web3Provider
    );
    state.web3.currentProvider.sendAsync = state.web3.currentProvider.send;
    this.setupListeners();
    return web3Provider;
  }

  disconnectNotifier() {
    const connection = state.wallet.getConnection();
    console.log(connection); // todo remove dev item
    connection.webRtcCommunication.on(connection.lifeCycle.RtcDisconnectEvent, () => {
      this.popUpHandler.showNotice('disconnected');
      MEWconnectWallet.setConnectionState('disconnected');
    });

    connection.webRtcCommunication.on(connection.lifeCycle.RtcClosedEvent, () => {
      this.popUpHandler.showNotice('disconnected');
      MEWconnectWallet.setConnectionState('disconnected');
    });
  }

  disconnect() {
    const connection = state.wallet.getConnection();
    connection.disconnectRTC();

  }

  sign(tx) {
    if (state.wallet) {
      return state.wallet.signTransaction(tx);
    }
  }

  setupListeners() {
    this.eventHub.on(EventNames.SHOW_TX_CONFIRM_MODAL, (tx, resolve) => {
      this.responseFunction = resolve;
      this.popUpHandler.showNoticePersistentEnter('Check your phone to sign the transaction');
      state.wallet.signTransaction(tx)
        .then(_response => {
          this.popUpHandler.showNoticePersistentExit();
          resolve(_response);
        })
        .catch(err => {
          this.popUpHandler.showNoticePersistentExit();
          state.wallet.errorHandler(err);
        });
    });

    this.eventHub.on(EventNames.SHOW_MSG_CONFIRM_MODAL, (msg, resolve) => {
      this.popUpHandler.showNoticePersistentEnter('Check your phone to sign the transaction');
      state.wallet.signMessage(msg)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          this.popUpHandler.showNoticePersistentExit();
        });
    });

    this.eventHub.on('showSendSignedTx', (tx, resolve) => {
      this.popUpHandler.showNotice();
      const newTx = new Transaction(tx);
      this.responseFunction = resolve;
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
      this.responseFunction(this.signedTxObject);
    });
    this.eventHub.on('Hash', (hash) => {
      this.popUpHandler.showNotice(`Transaction sent: <a href="${state.network.type.blockExplorerTX.replace('[[txHash]]', hash)}" target="_blank">View</a>`, 10000);
    });
    this.eventHub.on('Receipt', () => {
      this.popUpHandler.showNotice('Transaction Completed');
    });
    this.eventHub.on('Error', () => {
      this.popUpHandler.showNotice('Error');
    });
  }

}

