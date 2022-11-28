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
import messageConstants from '../messageConstants';

// import parseTokensData from './web3Provider/helpers/parseTokensData';
import debugLogger from 'debug';
import PopUpCreator from '../connectWindow/popUpCreator';

const debugConnectionState = debugLogger('MEWconnect:connection-state');
const debug = debugLogger('MEWconnect:stand-alone-provider');

let state = {
  wallet: null
};
const eventHub = new EventEmitter();
let popUpCreator = {};
export default class Integration extends EventEmitter {
  constructor() {
    super();
    this.lastHash = null;
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

  showNotifierDemo(details) {
    if (details === 'sent') {
      this.popUpHandler.showNotice({
        type: messageConstants.sent,
        hash:
          '0x543284135d7821e0271272df721101420003cb0e43e8c2e2eed1451cdb571fa4',
        explorerPath: state.network.type.blockExplorerTX
      });
    } else {
      this.popUpHandler.showNotice(details);
    }
  }

  showConnectedNotice() {
    this.popUpHandler.showConnectedNotice();
  }

  static get getConnectionState() {
    return MEWconnectWallet.getConnectionState();
  }

  static get isConnected() {
    return MEWconnectWallet.getConnectionState() !== 'disconnected';
  }

  async enable() {
    if (MEWconnectWallet.getConnectionState() === 'disconnected') {
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
      this.popUpHandler.showConnectedNotice();
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
      if (state.web3Provider.accountsChanged) {
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
      if (result) return result;
    } else if (typeof check === 'string') {
      let result = this.chainIdMapping.find(value => value.chainId == check);
      if (result) return result;
      result = this.chainIdMapping.find(
        value => value.name === check.toLowerCase()
      );
      if (result) return result;
      result = this.chainIdMapping.find(
        value => value.key === check.toLowerCase()
      );
      if (result) return result;
    }
    return 'ETH';
  }

  makeWeb3Provider(CHAIN_ID, RPC_URL, _noCheck = false) {
    try {
      const chain = this.identifyChain(CHAIN_ID);
      const defaultNetwork = Networks[chain.key][0];
      state.network = defaultNetwork;
      const hostUrl = url.parse(RPC_URL || defaultNetwork.url);
      const options = {};
      if (!/[wW]/.test(hostUrl.protocol)) {
        throw Error('websocket rpc endpoint required');
      }
      if (!_noCheck) {
        if (
          !hostUrl.hostname.includes(chain.name) &&
          hostUrl.hostname.includes('infura.io')
        ) {
          throw Error(
            `ChainId: ${CHAIN_ID} and infura endpoint ${hostUrl.hostname} do not match`
          );
        }
      }

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
    } catch (e) {
      debug(e);
    }
  }

  createDisconnectNotifier() {
    const connection = state.wallet.getConnection();
    debugConnectionState(MEWconnectWallet.getConnectionState());
    connection.webRtcCommunication.on(
      connection.lifeCycle.RtcDisconnectEvent,
      () => {
        this.popUpHandler.showNotice(messageConstants.disconnect);
        MEWconnectWallet.setConnectionState('disconnected');
        state.wallet = null;
        this.emit('disconnected');
      }
    );

    connection.webRtcCommunication.on(
      connection.lifeCycle.RtcClosedEvent,
      () => {
        this.popUpHandler.showNotice(messageConstants.disconnect);
        MEWconnectWallet.setConnectionState('disconnected');
        state.wallet = null;
        this.emit('disconnected');
      }
    );
  }

  disconnect() {
    if (state.wallet) {
      const connection = state.wallet.getConnection();
      connection.disconnectRTC();
      MEWconnectWallet.setConnectionState('disconnected');
      this.emit('disconnected');
    }
    state = {};
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
          messageConstants.notConnected
        );
      } else {
        this.popUpHandler.showNoticePersistentEnter(messageConstants.approveTx);

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
      if (!state.wallet) {
        this.popUpHandler.showNoticePersistentEnter(
          messageConstants.notConnected
        );
      } else {
        this.popUpHandler.showNoticePersistentEnter(
          messageConstants.signMessage
        );

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
      this.popUpHandler.showNotice(messageConstants.approveTx);
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
      this.lastHash = hash;
      this.popUpHandler.showNotice(
        {
          type: messageConstants.sent,
          hash: hash,
          explorerPath: state.network.type.blockExplorerTX
        },
        10000
      );
    });
    eventHub.on('Receipt', () => {
      this.lastHash = null;
      this.popUpHandler.showNotice(messageConstants.complete);
    });
    eventHub.on('Error', () => {
      if (this.lastHash !== null) {
        this.popUpHandler.showNotice(
          {
            type: messageConstants.failed,
            hash: this.lastHash,
            explorerPath: state.network.type.blockExplorerTX
          },
          10000
        );
      } else {
        this.popUpHandler.showNotice(messageConstants.error);
      }
    });
  }
}
