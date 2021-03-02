/* eslint-disable */
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
import { nativeCheck, mobileCheck } from './platformDeepLinking';
import { DISCONNECTED, CONNECTING, CONNECTED } from '../config';
import BigNumber from 'bignumber.js';
import packageJson from '../../package.json'

const debugConnectionState = debugLogger('MEWconnect:connection-state');
const debugErrors = debugLogger('MEWconnectError');

let state = {
  wallet: null
};

const infuraUrlFormater = (name, infuraId) => {
  return `wss://${name}.infura.io/ws/v3/${infuraId}`;
};
const eventHub = new EventEmitter();
let popUpCreator = {};
const recentDataRecord = [];

export default class Integration extends EventEmitter {
  constructor(options = {}) {
    super();
    if (window.web3) {
      if (window.web3.currentProvider) {
        if (
          window.web3.currentProvider.isMewConnect ||
          window.web3.currentProvider.isTrust
        ) {
          this.runningInApp = true;
          state.web3Provider = window.web3.currentProvider;
        } else {
          this.runningInApp = false;
        }
      } else {
        this.runningInApp = false;
      }
    } else {
      this.runningInApp = false;
    }

    this.windowClosedError = options.windowClosedError || false;
    this.subscriptionNotFoundNoThrow =
      options.subscriptionNotFoundNoThrow || true;
    // eslint-disable-next-line
    this.infuraId = !!options.infuraId ? options.infuraId : false;

    this.CHAIN_ID = options.chainId || 1;
    this.RPC_URL = options.rpcUrl || false;
    this.noUrlCheck = options.noUrlCheck || false;
    this.lastHash = null;
    this.initiator = new Initiator();
    this.popUpHandler = new PopUpHandler();
    this.connectionState = false;
    this.chainIdMapping = this.createChainMapping();
    this.returnPromise = null;
    this.disconnectComplete = false;
    popUpCreator = new PopUpCreator();
  }

  createChainMapping() {
    return Object.keys(Networks).reduce(
      (acc, curr) => {
        if (Networks[curr].length === 0) return acc;
        acc.push({
          name:
            Networks[curr][0].type.name_long === 'Ethereum'
              ? 'mainnet'
              : Networks[curr][0].type.name_long.toLowerCase(),
          chainId: Networks[curr][0].type.chainID,
          key: Networks[curr][0].type.name
        });
        return acc;
      },
      [{ name: 'mainnet', chainId: 1, key: 'ETH' }]
    );
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
    return (
      MEWconnectWallet.getConnectionState() !== DISCONNECTED &&
      MEWconnectWallet.getConnectionState() !== CONNECTING
    );
  }

  get getWalletOnly(){
    if(state.wallet){
      return state.wallet
    }
  }

  enable() {
    popUpCreator.on('fatalError', () => {
      MEWconnectWallet.setConnectionState(DISCONNECTED);
    })
    if (this.runningInApp) {
      return new Promise((resolve, reject) => {
        state.web3Provider
          .request({
            method: 'eth_requestAccounts',
            params: []
          })
          .then(address => {
            eventHub.emit('accountsChanged', address);
            this.popUpHandler.showConnectedNotice();
            MEWconnectWallet.setConnectionState(CONNECTED);
            resolve(address);
          })
          .catch(console.error);
      });
    }

    return nativeCheck().then(res => {
      if (res) {
        if (typeof popUpCreator.popupWindowOpen === 'boolean') {
          popUpCreator.showDialog();
        }
        if (MEWconnectWallet.getConnectionState() === DISCONNECTED) {
          this.returnPromise = this.enabler();
        }
        return this.returnPromise;
      }
    });
  }

  enabler() {
    // eslint-disable-next-line
    return new Promise(async (resolve, reject) => {
      if (
        !state.wallet &&
        MEWconnectWallet.getConnectionState() === DISCONNECTED
      ) {
        MEWconnectWallet.setConnectionState(CONNECTING);
        this.connectionState = CONNECTING;
        debugConnectionState(MEWconnectWallet.getConnectionState());
        popUpCreator.setWindowClosedListener(() => {
          if (this.windowClosedError) {
            reject('ERROR: popup window closed');
          }
          this.emit('popupWindowClosed');
        });

        state.wallet = await MEWconnectWallet(
          state,
          popUpCreator,
          this.popUpHandler
        );
        console.log(`Using MEWconnect v${packageJson.version}`); // todo remove dev item
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
        eventHub.emit('accounts_available', [
          state.wallet.getChecksumAddressString()
        ]);
      }

      resolve([state.wallet.getChecksumAddressString()]);
    });
  }

  identifyChain(check) {
    if (typeof check === 'number') {
      const result = this.chainIdMapping.find(value => value.chainId === check);
      if (result) return result;
    } else if (typeof check === 'string') {
      let result = this.chainIdMapping.find(value => {
        return value.chainId.toString() == check.toLowerCase();
      });
      if (result) return result;
      result = this.chainIdMapping.find(
        value => value.name.toLowerCase() == check.toLowerCase()
      );
      if (result) return result;
      result = this.chainIdMapping.find(
        value => value.key.toLowerCase() == check.toLowerCase()
      );
      if (result) return result;
    }
    return 'ETH';
  }

  makeWeb3Provider(
    CHAIN_ID = this.CHAIN_ID,
    RPC_URL = this.RPC_URL,
    _noCheck = this.noUrlCheck
  ) {
    let chainError = false;
    let web3Provider;
    try {
      if (this.runningInApp) {
        if (state.web3Provider) {
          web3Provider = state.web3Provider;
        } else {
          web3Provider = window.web3.currentProvider;
        }
      } else {
        const chain = this.identifyChain(CHAIN_ID || 1);
        const defaultNetwork = Networks[chain.key][0];
        state.network = defaultNetwork;
        if (this.infuraId && !this.RPC_URL) {
          RPC_URL = infuraUrlFormater(chain.name, this.infuraId);
        }
        const hostUrl = url.parse(RPC_URL || defaultNetwork.url);
        const options = {
          subscriptionNotFoundNoThrow: this.subscriptionNotFoundNoThrow
        };
        if (
          !/[wW]/.test(hostUrl.protocol) &&
          !/[htpHTP]/.test(hostUrl.protocol)
        ) {
          throw Error('Invalid rpc endpoint supplied to MEWconnect during setup');
        }
        if (!_noCheck && !this.infuraId) {
          if (
            !hostUrl.hostname.includes(chain.name) &&
            hostUrl.hostname.includes('infura.io')
          ) {
            chainError = true;
            throw Error(
              `ChainId: ${CHAIN_ID} and infura endpoint ${hostUrl.hostname} don't match`
            );
          }
        }
        const parsedUrl = `${hostUrl.protocol}//${
          hostUrl.hostname ? hostUrl.hostname : hostUrl.host
        }${hostUrl.port ? ':' + hostUrl.port : ''}${
          hostUrl.pathname ? hostUrl.pathname : ''
        }`;
        state.enable = this.enable.bind(this);
        web3Provider = new MEWProvider(
          parsedUrl,
          options,
          {
            state: state
          },
          eventHub
        );
      }

      state.enable = this.enable.bind(this);
      web3Provider.close = this.disconnect.bind(this);
      web3Provider.disconnect = this.disconnect.bind(this);
      state.web3Provider = web3Provider;

      state.web3 = new Web3(web3Provider);
      if (!this.runningInApp) {
        state.web3.currentProvider.sendAsync = state.web3.currentProvider.send;
      }

      this.setupListeners();
      web3Provider.enable = this.enable.bind(this);
      web3Provider.isMewConnect = true;
      web3Provider.isMEWconnect = true;
      web3Provider.name = 'MewConnect';
      return web3Provider;
    } catch (e) {
      debugErrors('makeWeb3Provider ERROR');
      if (chainError) {
        throw e;
      } else {
        // eslint-disable-next-line
        console.error(e);
      }
    }
  }

  createDisconnectNotifier() {
    const connection = state.wallet.getConnection();
    debugConnectionState(MEWconnectWallet.getConnectionState());
    connection.webRtcCommunication.on(
      connection.lifeCycle.RtcDisconnectEvent,
      () => {
        this.popUpHandler.showNotice(messageConstants.disconnect);
        MEWconnectWallet.setConnectionState(connection.lifeCycle.disconnected);
        if (state.wallet !== null && state.web3Provider.disconnectCallback) {
          state.web3Provider.disconnectCallback();
          this.emit('disconnect')
        }
        state.wallet = null;
        this.emit(DISCONNECTED);
      }
    );

    connection.webRtcCommunication.on(
      connection.lifeCycle.RtcClosedEvent,
      () => {
        this.popUpHandler.showNotice(messageConstants.disconnect);
        MEWconnectWallet.setConnectionState(connection.lifeCycle.disconnected);
        if (state.wallet !== null && state.web3Provider.disconnectCallback) {
          state.web3Provider.disconnectCallback();
          this.emit('disconnect')
        }
        state.wallet = null;
        this.emit(connection.lifeCycle.disconnected);
      }
    );
  }

  disconnect() {
    try {
      if (this.runningInApp) {
        return true;
      }
      if (state.wallet) {
        const connection = state.wallet.getConnection();
        connection.disconnectRTC();
        MEWconnectWallet.setConnectionState(DISCONNECTED);
        return true;
      }
      state = {};
      // eslint-disable-next-line
      console.warn('No connected wallet found');
      return true;
    } catch (e) {
      debugErrors('disconnect ERROR');
      // eslint-disable-next-line
      console.error(e);
      return false;
    }
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

            if (err.reject) {
              this.popUpHandler.noShow();
              setTimeout(() => {
                this.popUpHandler.showNotice('decline');
              }, 250);
            } else {
              debugErrors('sign transaction ERROR');
              state.wallet.errorHandler(err);
            }
            resolve(err);
          });
      }
    });

    eventHub.on(EventNames.WALLET_NOT_CONNECTED, () => {
      if (!state.wallet) {
        this.popUpHandler.showNoticePersistentEnter(
          messageConstants.notConnected
        );
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
          .catch(err => {
            if (err.reject) {
              this.popUpHandler.noShow();
              setTimeout(() => {
                this.popUpHandler.showNotice(messageConstants.declineMessage);
              }, 250);
            } else {
              debugErrors('sign message ERROR');
              state.wallet.errorHandler(err);
            }
            resolve(err);
          });
      }
    });
    // TODO: Is this getting used?
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
          gasPrice: `0x${newTx.gasPrice.toString('hex')}`,
          gas: `0x${newTx.gas.toString('hex')}`,
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
    eventHub.on('Error', e => {
      debugErrors('SendTx:Error ERROR');
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
