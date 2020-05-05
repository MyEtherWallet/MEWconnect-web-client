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

// import parseTokensData from './web3Provider/helpers/parseTokensData';
import debugLogger from 'debug';
import PopUpCreator from '../connectWindow/popUpCreator';

const debugConnectionState = debugLogger('MEWconnect:connection-state');

let state = {
  wallet: null
};
let eventHub = new EventEmitter();
let popUpCreator = {};
export default class Integration extends EventEmitter {
  constructor() {
    super();
    // this.emitter = new EventEmitter();
    this.initiator = new Initiator();
    this.popUpHandler = new PopUpHandler();
    this.connectionState = false;
    this.chainIdMapping = Object.keys(Networks).reduce(
      (acc, curr) => {
        if (Networks[curr].length === 0) return acc;
        acc.push({
          name: Networks[curr][0].type.name_long.toLowerCase(),
          chainId: Networks[curr][0].type.chainID,
          key: Networks[curr][0].type.name
        });
        return acc;
      },
      [{ name: 'mainnet', chainId: 1, key: 'ETH' }]
    );
    this.returnPromise = null;
    popUpCreator = new PopUpCreator();
  }

  showNotifier() {
    this.popUpHandler.showNotice('connected', {
      border: 'rgba(5, 158, 135, 0.88) solid 2px'
    });
  }

  static get getConnectionState(){
    return MEWconnectWallet.getConnectionState();
  }

  static get isConnected(){
    return MEWconnectWallet.getConnectionState() !== 'disconnected'
  }

  async enable() {
    // eslint-disable-next-line no-console
    /*
    *     if (
      MEWconnectWallet.getConnectionState() === 'disconnected' &&
      this.returnPromise === null
    )
    * */
    if (
      MEWconnectWallet.getConnectionState() === 'disconnected'
    ) {
      this.returnPromise = this.enabler();
    }
    if (popUpCreator.popupWindowOpen) {
      popUpCreator.popupWindow.focus();
    }
    return this.returnPromise;
  }

  async enabler() {
    if (
      !state.wallet &&
      MEWconnectWallet.getConnectionState() === 'disconnected'
    ) {
      MEWconnectWallet.setConnectionState('connecting');
      this.connectionState = 'connecting';
      debugConnectionState(MEWconnectWallet.getConnectionState());
      state.wallet = await MEWconnectWallet(state, popUpCreator);
      this.popUpHandler.showNotice('connected', {
        border: 'rgba(5, 158, 135, 0.88) solid 2px'
      });
      this.popUpHandler.hideNotifier();
      this.createDisconnectNotifier();
      debugConnectionState(MEWconnectWallet.getConnectionState());
    }

    if (state.web3 && state.wallet) {
      await state.web3.eth.getTransactionCount(
        state.wallet.getChecksumAddressString()
      );
    }

    if (state.web3Provider && state.wallet) {
      console.log(state.web3Provider); // todo remove dev item
      if(state.web3Provider.accountsChanged){
        state.web3Provider.accountsChanged([
          state.wallet.getChecksumAddressString()
        ]);
      }
    }
    return [state.wallet.getChecksumAddressString()];
  }

  identifyChain(check) {
    if (typeof check === 'number') {
      const result = this.chainIdMapping.find(value => value.chainId === check);
      if (result) return result.key;
    } else if (typeof check === 'string') {
      let result = this.chainIdMapping.find(value => value.chainId == check);
      if (result) return result.key;
      result = this.chainIdMapping.find(
        value => value.name === check.toLowerCase()
      );
      if (result) return result.key;
      result = this.chainIdMapping.find(
        value => value.key === check.toLowerCase()
      );
      if (result) return result.key;
    }
    return 'ETH';
  }

  makeWeb3Provider(CHAIN_ID, RPC_URL, _noCheck = false) {
    const chain = this.identifyChain(CHAIN_ID);
    const defaultNetwork = Networks[chain][0];
    state.network = defaultNetwork;
    const hostUrl = url.parse(RPC_URL || defaultNetwork.url);
    const options = {};
    if (!/[wW]/.test(hostUrl.protocol)) {
      throw Error('websocket rpc endpoint required');
    }
    if(!_noCheck){
      if (
        !hostUrl.hostname.includes(chain.name) &&
        hostUrl.hostname.includes('infura.io')
      ) {
        throw Error(
          `ChainId: ${CHAIN_ID} and infura endpoint ${hostUrl.hostname} d match`
        );
      }
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
      eventHub
    );
    web3Provider.close = this.disconnect.bind(this);
    state.web3Provider = web3Provider;
    state.web3 = new Web3(web3Provider);
    state.web3.currentProvider.sendAsync = state.web3.currentProvider.send;
    this.setupListeners();
    return web3Provider;
  }

  createDisconnectNotifier() {
    const connection = state.wallet.getConnection();
    debugConnectionState(MEWconnectWallet.getConnectionState());
    connection.webRtcCommunication.on(
      connection.lifeCycle.RtcDisconnectEvent,
      () => {
        this.popUpHandler.showNotice('disconnected');
        MEWconnectWallet.setConnectionState('disconnected');
        state.wallet = null;
        this.emit('disconnected')
      }
    );

    connection.webRtcCommunication.on(
      connection.lifeCycle.RtcClosedEvent,
      () => {
        this.popUpHandler.showNotice('disconnected');
        MEWconnectWallet.setConnectionState('disconnected');
        state.wallet = null;
        this.emit('disconnected')
      }
    );
  }

  disconnect() {
    if(state.wallet){
      const connection = state.wallet.getConnection();
      connection.disconnectRTC();
      MEWconnectWallet.setConnectionState('disconnected');
      this.emit('disconnected')
    }
    state = {}
  }

  sign(tx) {
    if (state.wallet) {
      return state.wallet.signTransaction(tx);
    }
  }

  setupListeners() {
    eventHub.on(EventNames.SHOW_TX_CONFIRM_MODAL, (tx, resolve) => {
      this.responseFunction = resolve;
      if (!state.wallet) {
        this.popUpHandler.showNoticePersistentEnter(
          'Phone not connected.  Please connect your phone and try again to sign the transaction'
        );
      } else {
        this.popUpHandler.showNoticePersistentEnter(
          'Check your phone to sign the transaction'
        );

      state.wallet
        .signTransaction(tx)
        .then(_response => {
          this.popUpHandler.showNoticePersistentExit();
          resolve(_response);
        })
        .catch(err => {
          this.popUpHandler.showNoticePersistentExit();
          state.wallet.errorHandler(err);
        });
    }
    });

    eventHub.on(EventNames.SHOW_MSG_CONFIRM_MODAL, (msg, resolve) => {
      console.log('state.wallet', state.wallet); // todo remove dev item
      if(!state.wallet) {
        this.popUpHandler.showNoticePersistentEnter(
          'Phone not connected.  Please connect your phone and try again to sign the transaction'
        );
      } else {
        this.popUpHandler.showNoticePersistentEnter(
          'Check your phone to sign the message'
        );
        console.log('state.wallet', state.wallet); // todo remove dev item

        // this.popUpHandler.showNoticePersistentEnter(
        //   'Check your phone to sign the transaction'
        // );
        state.wallet
          .signMessage(msg)
          .then(result => {
            resolve(result);
          })
          .catch(() => {
            this.popUpHandler.showNoticePersistentExit();
          });
      }
    });

    eventHub.on('showSendSignedTx', (tx, resolve) => {
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
    eventHub.on('Hash', hash => {
      this.popUpHandler.showNotice(
        `Transaction sent: <a href="${state.network.type.blockExplorerTX.replace(
          '[[txHash]]',
          hash
        )}" target="_blank">View</a>`,
        10000
      );
    });
    eventHub.on('Receipt', () => {
      this.popUpHandler.showNotice('Transaction Completed');
    });
    eventHub.on('Error', () => {
      this.popUpHandler.showNotice('Error');
    });
  }
}
