import PopUpHandler from './popUpHandler';
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
}
export default class Integration {
  constructor(RPC_URL) {
    this.eventHub = new EventEmitter();

    this.initiator = new Initiator();
    const network = Networks['ETH'];
    console.log(Networks); // todo remove dev item
    this.popUpHandler = new PopUpHandler();
    this.connectionState = false;
    this.chainIdMapping = Object.keys(Networks).reduce((acc, curr) => {
      console.log(Networks[curr]); // todo remove dev item
      if (Networks[curr].length === 0) return acc;
      acc.push({
        name: Networks[curr][0].type.name_long.toLowerCase(),
        chainId: Networks[curr][0].type.chainID,
        key: Networks[curr][0].type.name
      });
      return acc;
    }, [{ name: 'mainnet', chainId: 1, key: 'ETH' }]);
    console.log(this.chainIdMapping); // todo remove dev item
  }

  showNotice() {
    this.popUpHandler.showPopupWindow('lksdfsdfsdfsdfsdfsdfsdfsfsfdsf');
  }

  async enable() {
    if (!state.wallet) {
      this.connectionState = 'connecting';
      state.wallet = await new MEWconnectWallet(state);
      this.popUpHandler.showNotice('connected', { border: 'rgba(5, 158, 135, 0.88) solid 2px' });
      this.popUpHandler.hideNotifier();
      this.disconnectNotifier();
    }
    if (state.web3) {
      await state.web3.eth.getTransactionCount(state.wallet.getChecksumAddressString());
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

  makeWeb3Provider(CHAIN_ID) {
    const chain = this.identifyChain(CHAIN_ID);
    const defaultNetwork = Networks[chain][0];
    state.network = defaultNetwork;
    const hostUrl = url.parse(defaultNetwork.url);
    const options = {};
    // // eslint-disable-next-line
    const parsedUrl = `${hostUrl.protocol}//${hostUrl.host}${
      defaultNetwork.port ? ':' + defaultNetwork.port : ''
    }${hostUrl.pathname}`;
    state.web3 = new Web3(
      new MEWProvider(
        parsedUrl,
        options,
        {
          state: state
        },
        this.eventHub
      )
    );
    state.web3.currentProvider.sendAsync = state.web3.currentProvider.send;
    this.setupListeners();
    return state.web3;
  }

  disconnectNotifier() {
    const connection = state.wallet.getConnection();
    connection.webRtcCommunication.on(connection.lifeCycle.RtcDisconnectEvent, () => {
      this.popUpHandler.showNotice('disconnected');
    });
    connection.webRtcCommunication.on(connection.lifeCycle.RtcClosedEvent, () => {
      this.popUpHandler.showNotice('disconnected');
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
      // this.parseRawTx(tx);
      // if (tx.hasOwnProperty('ensObj')) {
      //   delete tx['ensObj'];
      // }
      this.responseFunction = resolve;
      const signPromise = state.wallet.signTransaction(tx);
      this.popUpHandler.showNotice('Check your phone to sign the transaction');
      state.wallet.signTransaction(tx)
        .then(_response => {
          resolve(_response);
        })
        .catch(state.wallet.errorHandler);
    });

    this.eventHub.on(EventNames.SHOW_MSG_CONFIRM_MODAL, (msg, resolve) => {
      state.wallet.signMessage(msg)
        .then(result => {
          resolve(result);
        });
    });
    this.eventHub.on('showSendSignedTx', (tx, resolve) => {
      console.log('showSendSignedTx'); // todo remove dev item
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
      // this.parseRawTx(this.signedTxObject.tx);
      this.responseFunction(this.signedTxObject);
    });
    this.eventHub.on('Hash', (hash) => {
      this.popUpHandler.showNotice(`Transaction sent: <a href="${state.network.type.blockExplorerTX.replace('[[txHash]]', hash)}" target="_blank">View</a>`);
    });
    this.eventHub.on('Receipt', () => {
      this.popUpHandler.showNotice('Transaction Completed');
    });
    this.eventHub.on('Error', () => {
      this.popUpHandler.showNotice('Error');
    });
  }

  parseRawTx(tx) {
    let tokenData = '';
    if (tx.to && tx.data) {
      tokenData = parseTokensData(
        tx.data,
        tx.to,
        state.web3,
        state.network.type.tokens,
        state.network.type.name
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