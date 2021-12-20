<template>
  <div id="app">
    <h2>MEW connect client library example</h2>
    <button @click="onClick">CONNECT</button>
    <h3>{{ userAddress }}</h3>
    <button @click="getBlockNumber">Get Block Number</button>
    <button @click="showThing">CHECK</button>
    <div v-show="userAddress === ''">
      <button @click="selectNetwork(1)">Mainnet</button>
      <button @click="selectNetwork(3)">Ropsten</button>
      <button @click="selectNetwork(5)">Goerli</button>
      <button @click="selectNetwork(42)">Kovan</button>
      <button @click="selectNetwork(137)">Matic</button>
      <button @click="selectNetwork(56)">BSC</button>
      <button @click="selectNetwork(4)">Rinkeby</button>
    </div>

    <ul v-show="userAddress !== ''">
      <!--      <ul>-->
      <li>
        <button @click="disconnect">Disconnect</button>
      </li>
      <li>
        <hr />
        <button @click="closeDataChannel">Close Data Channel</button>
      </li>
      <li>
        <hr />
        <h3>Sign tx Full details</h3>
        <button v-show="userAddress !== ''" @click="signTxNonStandard">
          send
        </button>
        {{ signedTxNonStandard }}
      </li>
      <li>
        <hr />
        <h3>Send</h3>
        <label for="toAmount1">
          to amount
          <input
            id="toAmount1"
            v-model="toAmount"
            placeholder="amount"
          /> </label
        ><br />
        <!--        <button v-show="userAddress !== ''" @click="sendTx">send</button>-->
        <button @click="sendTx">send</button>
        <h6>Sends to the connected wallet address</h6>
        <h3>Tx Hash:</h3>
        {{ txHash }}
      </li>
      <li>
        <hr />
        <h3>Send</h3>
        <label for="toAmount">
          to amount
          <input id="toAmount" v-model="toAmount" placeholder="amount" />
        </label>
        <label for="altNonce">
          alt nonce
          <input id="altNonce" v-model="altNonce" placeholder="altNonce" />
        </label>
        <label for="altGasPrice">
          altGasPrice
          <input
            id="altGasPrice"
            v-model="altGasPrice"
            placeholder="altGasPrice"
          /> </label
        ><br />
        <!--        <button v-show="userAddress !== ''" @click="sendTx">send</button>-->
        <button @click="sendTx2">send alt-nonce</button>
        <h6>Sends to the connected wallet address</h6>
        <h3>Tx Hash:</h3>
        {{ txHash }}
      </li>
      <li>
        <hr />
        <h3>Send Detailed</h3>
        <label for="toGasLimitDetailed">
          From Address

          <input
            id="fromAddressDetailed"
            v-model="fromAddressDetailed"
            placeholder="amount"
          />
        </label>
        <br />

        <label for="toGasPriceDetailed">
          Gas Price
          <input
            id="toGasPriceDetailed"
            v-model="toGasPriceDetailed"
            placeholder="amount"
          />
        </label>
        <br />
        <label for="toGasLimitDetailed">
          Gas Limit

          <input
            id="toGasLimitDetailed"
            v-model="toGasLimitDetailed"
            placeholder="amount"
          />
        </label>
        <br />
        <label for="toDataDetailed">
          Data
          <input
            id="toDataDetailed"
            v-model="toDataDetailed"
            placeholder="amount"
          />
        </label>
        <br />
        <label for="toAmountDetailed">
          Amount
          <input
            id="toAmountDetailed"
            v-model="toAmountDetailed"
            placeholder="amount"
          />
        </label>
        <br />
        <label for="toNonceDetailed">
          Nonce
          <input
            id="toNonceDetailed"
            v-model="toNonceDetailed"
            placeholder="amount"
          />
        </label>
        <br />
        <!--        <button v-show="userAddress !== ''" @click="sendTxDetailed">-->
        <!--          send-->
        <!--        </button>-->
        <button @click="sendTxDetailed">
          send
        </button>
        <h6>Sends to the connected wallet address</h6>
        <h3>Tx Hash:</h3>
        <label for="toGasLimitDetailed">
          To Address

          <input
            id="toAddressDetailed"
            v-model="toAddressDetailed"
            placeholder="amount"
          />
        </label>
        <br />
        <button v-show="userAddress !== ''" @click="sendTxDetailed2">
          send to address
        </button>
        <h3>Tx Hash:</h3>
        {{ txHash }}
      </li>
      <li>
        <hr />
        <h3>Sign Tx</h3>
        <button v-show="userAddress !== ''" @click="signTx">sign tx</button>
        {{ signedTx }}
      </li>
      <li>
        <hr />
        <h3>Send Token</h3>
        <label for="tokenAddress">
          token address
          <input
            id="tokenAddress"
            v-model="tokenAddress"
            placeholder="token address"
          /> </label
        ><br />
        <label for="tokenDecimals">
          token decimals
          <input
            id="tokenDecimals"
            v-model="tokenDecimals"
            placeholder="token decimals"
          /> </label
        ><br />
        <label for="tokenAmount">
          token amount
          <input
            id="tokenAmount"
            v-model="tokenAmount"
            placeholder="amount"
          /> </label
        ><br />

        <button v-show="tokenAddress !== ''" @click="approveToken(tokenAmount)">
          approve
        </button>
        <br />
        <button v-show="tokenAddress !== ''" @click="sendToken(tokenAmount)">
          send
        </button>
        <h3>Tx Hash:</h3>
        {{ tokenTxHash }}
      </li>
      <li>
        <hr />
        <button @click="getAccount">get account</button>
        <h3>{{ account }}</h3>
      </li>
      <li>
        <hr />
        <button @click="getEncryptionPublicKey">
          encrypt decrypt public key
        </button>
      </li>
      <li>
        <hr />
        <button @click="signTypedDataV3">
          signed Typed v3
        </button>
      </li>
      <li>
        <hr />
        <button @click="signTypedDataV4">
          signed Typed v4
        </button>
      </li>
      <li>
        <hr />
        <input v-model="messageToSign" />
        <button @click="signMessage">sign message</button><br />
        <textarea
          v-if="signature !== ''"
          v-model="signature"
          disabled
          style="margin: 0px; height: 169px; width: 454px;"
        ></textarea>
        <br />
      </li>
      <li>
        <hr />
        <button @click="getBalance">balance</button>
        <h3>{{ balance }}</h3>
      </li>
      <li>
        <hr />
        <input v-model="personalMessageToSign" />
        <button @click="personalSign">personal sign</button>
        <h3>{{ personalSignedResult }}</h3>
      </li>
      <li>
        <hr />
        <label for="ecRecoverSig">
          Signature
          <input
            id="ecRecoverSig"
            v-model="signatureToCheck"
            placeholder="amount"
          /> </label
        ><br />
        <label for="ecMessage">
          Message
          <input
            id="ecMessage"
            v-model="signatureFromMessage"
            placeholder="amount"
          /> </label
        ><br />
        <h6>if left empty this 1234 and checks</h6>

        <button @click="ecrecover">ecrecover</button>
        <h3>{{ ecRecoverAddress }}</h3>
      </li>
      <li>
        <hr />
        <button @click="getCoinBase">getCoinBase</button>
        <h3>{{ coinBase }}</h3>
      </li>
      <li>
        <hr />
        <button @click="makeCall">makeCall</button>
        <h3>{{ callRes }}</h3>
      </li>
      <li>
        <hr />
        <button @click="getChainId">getChainId</button>
        <h3>{{ chainId }}</h3>
      </li>
      <li>
        <hr />
        <button @click="createSubscription">createSubscription</button>
        <hr />
        <button @click="removeSubscription">removeSubscription</button>
      </li>
    </ul>
    <br />
    <hr style="width: 50%" />
    <h6>
      The two buttons below show the various windows and notification types that
      occur. They are for display only and use dummy data.
    </h6>
    <p>
      <button @click="animateDirect">Display popup window</button>
    </p>
    <p>
      <button @click="animateConnectedNotifier">
        Display connected notifier
      </button>
    </p>
    <p>
      <button @click="animateNotifier">Display action notifier</button>
      <button @click="animateNotifier(1)">Approve Transaction</button>
      <button @click="animateNotifier(2)">Transaction Sent</button>
      <button @click="animateNotifier(3)">Transaction Complete</button>
      <button @click="animateNotifier(4)">User Decline</button>
      <button @click="animateNotifier(5)">Transaction Failed</button>
      <button @click="animateNotifier(6)">Transaction Error</button>
      <button @click="animateNotifier(7)">Sign Message</button>
    </p>
    <p>{{ thing }}</p>
    <p>{{ checkOne }}</p>
  </div>
</template>

<script>
/* eslint-disable */

import mewConnect from '../../../src';

import PopUpCreator from '../../../src/connectWindow/popUpCreator';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import messageConstants from '../../../src/messageConstants';
import ethUtil from 'ethereumjs-utils';
import * as sigUtil from 'eth-sig-util';
const NetworkEndPoints = {
  1: 'https://nodes.mewapi.io/rpc/eth',
  3: 'https://nodes.mewapi.io/rpc/rop',
  5: 'wss://nodes.mewapi.io/ws/goerli',
  42: 'https://nodes.mewapi.io/rpc/kovan',
  137: 'wss://nodes.mewapi.io/ws/matic',
  56: 'https://nodes.mewapi.io/rpc/bsc',
  4: 'wss://nodes.mewapi.io/ws/rinkeby'
};
let web3;

const signTx = () => {
  web3.eth.getBalance(this.userAddress).then(bal => this.balance);
  web3.eth.getGasPrice().then(gasPrice => {
    console.log(gasPrice); // todo remove dev item
    web3.eth.getTransactionCount(this.userAddress).then(nonce => {
      web3.eth
        .sendTransaction({
          from: this.userAddress,
          to: this.userAddress,
          nonce,
          value: new BigNumber(0).times(new BigNumber(10).pow(18)).toFixed(),
          gasPrice: gasPrice /*,
              gasLimit: '0xa'// 21000*/
        })
        .once('transactionHash', hash => {
          console.log(['Hash', hash]);
          this.tokenTxHash = hash;
        })
        .once('receipt', res => {
          console.log(['Receipt', res]);
        })
        .on('error', err => {
          console.log(['Error', err]);
        })
        .then(txhash => console.log('THEN: ', txhash))
        .catch(err => console.error(err));
    });
  });
};
export default {
  name: 'app',
  data() {
    return {
      connect: {},
      altPopup: {},
      userAddress: '',
      ethereum: {},
      balance: 0,
      web3: {},
      coinBase: 0,
      txHash: '',
      callRes: '',
      chainId: 0,
      account: '',
      tokenAddress: '',
      tokenDecimals: 18,
      tokenTxHash: '',
      tokenAmount: 0,
      toAmount: 0,
      signature: '',
      messageToSign: 'sign this',
      personalMessageToSign: '1234',
      toGasPriceDetailed: 0,
      toGasLimitDetailed: 0,
      toDataDetailed: '',
      toAmountDetailed: 0,
      toNonceDetailed: '',
      signedTx: '',
      signedTxNonStandard: '',
      signatureToCheck: '',
      signatureFromMessage: '',
      ecRecoverAddress: '',
      personalSignedResult: '',
      toAddressDetailed: '',
      fromAddressDetailed: '',
      thing: false,
      checker: false,
      checkOne: '',
      altNonce: '',
      altGasPrice: ''
    };
  },
  mounted() {
    //localStorage.debug = '*';
    console.log('LOADEDED'); // todo remove dev item
    this.connect = new mewConnect.Provider({
      windowClosedError: true,
      chainId: 1,
      rpcUrl: NetworkEndPoints[1]
    });
    this.connect.on('popupWindowClosed', () => {
      console.log(`popup window closed EVENT`);
    });
    this.ethereum = this.connect.makeWeb3Provider();
    this.web3 = new Web3(this.ethereum);
    this.web3.eth
      .getBalance('0x192627797720b7c5EC7b9FAAeafa41FF49f866e3')
      .then(console.log)
      .catch(console.error);
    this.web3.eth.net.getId().then(console.log);
    web3 = this.web3;
    this.ethereum.on('accountsChanged', accounts => {
      console.log(`accountsChanged User's address is ${accounts[0]}`);
    });

    this.ethereum.on('disconnected', () => {
      console.log(`accountsChanged User's address is DISCONNECTED`);
      console.log('Provider');
      this.userAddress = '';
    });
    this.connect.on('disconnected', () => {
      console.log(`accountsChanged User's address is DISCONNECTED`);
      console.log('Wallet Core');
    });
    console.log(this.ethereum.on); // todo remove dev item
    this.ethereum.on('disconnect', () => {
      console.log('Provider: disconnect');
      this.userAddress = '';
    });
    this.connect.on('disconnect', () => {
      console.log('Wallet Core: disconnect');
      this.userAddress = '';
    });
    this.ethereum.on('connect', () => {
      console.log('Provider: connect');
    });
    this.connect.on('connect', () => {
      console.log('Wallet Core: connect');
    });
    this.altPopup = new PopUpCreator();
    this.thing = 27;
  },
  methods: {
    closeDataChannel() {
      this.connect.closeDataChannelForDemo();
    },
    getBlockNumber() {
      this.web3.eth.getBlockNumber().then(console.log);
    },
    showThing() {
      // if (
      //   window.web3.currentProvider.isMewConnect ||
      //   window.web3.currentProvider.isTrust
      // ) {
      //   this.checkOne = window.web3.currentProvider;
      //   const web3Provider = window.web3.currentProvider
      //     .enable()
      //     .then(web3Provider => {
      //       this.runningInApp = true;
      //       web3Provider.send('eth_requestAccounts').then(accounts => {
      //         console.log(`User's address is ${accounts[0]}`);
      //         this.userAddress = accounts[0];
      //       });
      //       web3Provider.getAccounts().then(res => {
      //         window.alert(res);
      //       });
      //       this.userAddress = web3Provider.postMessage('requestAccounts', 123);
      //       state.web3Provider.on('message', res => {
      //         window.alert(res);
      //       });
      //     });
      // }
    },
    selectNetwork(chainId) {
      this.connect = new mewConnect.Provider({
        windowClosedError: true,
        chainId,
        rpcUrl: NetworkEndPoints[chainId]
      });
      this.ethereum = this.connect.makeWeb3Provider();
      this.web3 = new Web3(this.ethereum);
      this.web3.eth.getBlockNumber().then(console.log);
      this.web3.eth.net.getId().then(console.log);
    },
    animate() {
      this.connect.showNotice();
    },
    animateDirect() {
      this.altPopup.showPopupWindow('sdfsdfsdf');
    },
    animateNotifier(type) {
      switch (type) {
        case 1:
          this.connect.showNotifierDemo(messageConstants.approveTx);
          break;
        case 2:
          this.connect.showNotifierDemo(messageConstants.sent);
          break;
        case 3:
          this.connect.showNotifierDemo(messageConstants.complete);
          break;
        case 4:
          this.connect.showNotifierDemo(messageConstants.decline);
          break;
        case 5:
          this.connect.showNotifierDemo(messageConstants.failed);
          break;
        case 6:
          this.connect.showNotifierDemo(messageConstants.error);
          break;
        case 7:
          this.connect.showNotifierDemo(messageConstants.signMessage);
          break;
        default:
          this.connect.showNotifierDemo();
      }
    },
    animateConnectedNotifier() {
      this.connect.showConnectedNotice();
    },
    async onClick() {
      try {
        const accounts = await this.ethereum.enable();
        console.log('ACCOUNTS', accounts); // todo remove dev item
        console.log(`User's address is ${accounts[0]}`);
        this.userAddress = accounts[0];
      } catch (e) {
        console.error(e); // todo replace with proper error
      }
      console.log(mewConnect.Provider.isConnected); // todo remove dev item
    },
    disconnect() {
      this.connect.disconnect();
      this.userAddress = '';
    },
    getAccount() {
      console.log(this.ethereum); // todo remove dev item
      this.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          console.log(`User's address is ${accounts[0]}`);
        });
    },
    getBalance() {
      console.log('this.userAddress', this.userAddress); // todo remove dev item
      let value = 'something';
      value = value.replace('some', '');
      console.log(value); // todo remove dev item
      console.log('PROVIDER this.userAddress', Object.keys(this.userAddress)); // todo remove dev item
      console.log('this.userAddress', this.userAddress.replace('0x', '')); // todo remove dev item
      this.web3.eth.getBalance(this.userAddress).then(res => {
        console.log(res); // todo remove dev item
        this.balance = res;
      });
    },
    sendTx() {
      this.web3.eth.getBalance(this.userAddress).then(bal => this.balance);
      this.web3.eth.getGasPrice().then(gasPrice => {
        console.log('gasPrice', gasPrice); // todo remove dev item
        this.web3.eth.getTransactionCount(this.userAddress).then(nonce => {
          console.log('nonce', nonce); // todo remove dev item
          this.web3.eth
            .sendTransaction({
              from: this.userAddress,
              to: this.userAddress,
              nonce,
              value: new BigNumber(this.toAmount)
                .times(new BigNumber(10).pow(18))
                .toFixed()
            })
            .once('transactionHash', hash => {
              console.log(['Hash', hash]);
              this.txHash = hash;
            })
            .once('receipt', res => {
              console.log(['Receipt', res]);
            })
            .on('error', err => {
              console.log(['Error', err]);
            })
            .then(txhash => console.log('THEN: ', txhash))
            .catch(err => console.error(err));
        });
      });
    },
    sendTx2() {
      this.web3.eth.getBalance(this.userAddress).then(bal => this.balance);
      this.web3.eth.getGasPrice().then(gasPrice => {
        if (this.altGasPrice !== '') {
          gasPrice = this.altGasPrice;
        }
        console.log('gasPrice', gasPrice); // todo remove dev item
        this.web3.eth.getTransactionCount(this.userAddress).then(nonce => {
          if (this.altNonce !== '') {
            nonce = this.altNonce;
          }
          console.log('nonce', nonce); // todo remove dev item
          this.web3.eth
            .sendTransaction({
              from: this.userAddress,
              to: this.userAddress,
              nonce,
              value: new BigNumber(this.toAmount)
                .times(new BigNumber(10).pow(18))
                .toFixed()
            })
            .once('transactionHash', hash => {
              console.log(['Hash', hash]);
              this.txHash = hash;
            })
            .once('receipt', res => {
              console.log(['Receipt', res]);
            })
            .on('error', err => {
              console.log(['Error', err]);
            })
            .then(txhash => console.log('THEN: ', txhash))
            .catch(err => console.error(err));
        });
      });
    },
    sendTxDetailed() {
      this.sendTxDetailed2();
    },
    sendTxDetailed2() {
      this.web3.eth
        .signTransaction({
          from:
            this.fromAddressDetailed !== ''
              ? this.fromAddressDetailed
              : this.userAddress,
          to:
            this.toAddressDetailed !== ''
              ? this.toAddressDetailed
              : this.userAddress,
          nonce: this.toNonceDetailed !== '' ? this.toNonceDetailed : undefined,
          value: new BigNumber(this.toAmount)
            .times(new BigNumber(10).pow(18))
            .toFixed(),
          gasPrice: this.toGasPriceDetailed,
          data: this.toDataDetailed,
          gasLimit: this.toGasLimitDetailed
        })
        .then(txhash => {
          console.log('THEN: ', txhash);
          this.web3.eth
            .sendSignedTransaction(txhash)
            .then(result => console.log('RESULT', result));
        })
        .catch(console.error);
    },
    signTx() {
      this.web3.eth.getBalance(this.userAddress).then(bal => this.balance);
      this.web3.eth.getGasPrice().then(gasPrice => {
        console.log('gasPrice', gasPrice); // todo remove dev item
        this.web3.eth.getTransactionCount(this.userAddress).then(nonce => {
          console.log('nonce', nonce); // todo remove dev item
          this.web3.eth
            .signTransaction({
              from: this.userAddress,
              to: this.userAddress,
              nonce,
              value: 0,
              gasPrice: gasPrice
            })
            .then(txhash => {
              console.log('THEN: ', txhash);
              this.signedTx = txhash;
            })
            .catch(err => console.error(err));
        });
      });
    },
    signTxNonStandard() {
      this.web3.eth.getBalance(this.userAddress).then(bal => this.balance);
      this.web3.eth.getGasPrice().then(gasPrice => {
        this.web3.eth.getTransactionCount(this.userAddress).then(nonce => {
          console.log('NONCE', nonce); // todo remove dev item
          this.web3.eth
            .signTransaction(
              {
                from: this.userAddress,
                to: this.userAddress,
                nonce,
                value: 0,
                gasPrice: gasPrice,
                data: '0x',
                gas: '0x5208',
                gasLimit: '0x5208'
              },
              this.userAddress
            )
            .then(txhash => {
              this.signedTxNonStandard = txhash;
            })
            .catch(err => console.error(err));
        });
      });
    },
    signTypedDataV4() {
      const data = {
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' }
          ],
          Person: [
            { name: 'name', type: 'string' },
            { name: 'wallet', type: 'address' }
          ],
          Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person' },
            { name: 'contents', type: 'string' }
          ]
        },
        primaryType: 'Mail',
        domain: {
          name: 'Ether Mail',
          version: '1',
          chainId: 1,
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
        },
        message: {
          sender: {
            name: 'Cow',
            wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
          },
          recipient: {
            name: 'Bob',
            wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
          },
          contents: 'Hello, Bob!'
        }
      };
      this.ethereum
        .request({
          method: 'eth_signTypedData_v4',
          params: [this.userAddress, JSON.stringify(data)]
        })
        .then(sig => {
          console.log('typed data sig', sig);
          console.log(
            sigUtil
              .recoverTypedSignature(
                {
                  sig,
                  data
                },
                'V4'
              )
              .toString('hex')
          );
        });
    },
    signTypedDataV3() {
      const data = {
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' }
          ],
          Person: [
            { name: 'name', type: 'string' },
            { name: 'wallet', type: 'address' }
          ],
          Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person' },
            { name: 'contents', type: 'string' }
          ]
        },
        primaryType: 'Mail',
        domain: {
          name: 'Ether Mail',
          version: '1',
          chainId: 1,
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
        },
        message: {
          sender: {
            name: 'Cow',
            wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
          },
          recipient: {
            name: 'Bob',
            wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
          },
          contents: 'Hello, Bob!'
        }
      };
      this.ethereum
        .request({
          method: 'eth_signTypedData_v3',
          params: [this.userAddress, JSON.stringify(data)]
        })
        .then(sig => {
          console.log('typed data sig', sig);
          console.log(
            sigUtil
              .recoverTypedSignature(
                {
                  sig,
                  data
                },
                'V3'
              )
              .toString('hex')
          );
        });
    },
    getEncryptionPublicKey() {
      this.ethereum
        .request({
          method: 'eth_getEncryptionPublicKey',
          params: [this.userAddress]
        })
        .then(pubkey => {
          console.log(`User's public encryption key ${pubkey}`);
          const encryptedMessage = Buffer.from(
            JSON.stringify(
              sigUtil.encrypt(
                pubkey,
                { data: 'Hello world! ' + new Date().getTime() },
                'x25519-xsalsa20-poly1305'
              )
            ),
            'utf8'
          );

          const encryptedMessageHex = ethUtil.bufferToHex(encryptedMessage);
          console.log('encrypted message', encryptedMessageHex);
          setTimeout(() => {
            this.ethereum
              .request({
                method: 'eth_decrypt',
                params: [encryptedMessageHex, this.userAddress]
              })
              .then(decryptedMessage =>
                console.log('The decrypted message is:', decryptedMessage)
              )
              .catch(error => console.log(error.message));
          }, 2000);
          setTimeout(() => {
            this.ethereum
              .request({
                method: 'eth_decrypt',
                params: [encryptedMessage.toString('utf8'), this.userAddress]
              })
              .then(decryptedMessage =>
                console.log(
                  'The decrypted struct message is:',
                  decryptedMessage
                )
              )
              .catch(error => console.log(error.message));
          }, 4000);
        });
    },
    signMessage() {
      this.web3.eth
        .sign(this.messageToSign, this.userAddress)
        .then(_signedMessage => {
          this.signature = JSON.stringify(
            {
              address: this.userAddress,
              msg: this.messageToSign,
              sig: _signedMessage,
              version: '3',
              signer: 'MEWconnect'
            },
            null,
            2
          );
        })
        .catch(e => {
          console.log(e);
        });
    },
    sendToken(amount, decimals = 18) {
      const jsonInterface = [
        {
          constant: false,
          inputs: [
            { name: '_to', type: 'address' },
            { name: '_amount', type: 'uint256' }
          ],
          name: 'transfer',
          outputs: [{ name: '', type: 'bool' }],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ];
      const contract = new this.web3.eth.Contract(jsonInterface);
      const data = contract.methods
        .transfer(
          this.tokenAddress.toLowerCase(),
          new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toFixed()
        )
        .encodeABI();

      let gasLimit = 100000;
      this.web3.eth
        .estimateGas({
          from: this.userAddress,
          to: this.tokenAddress,
          value: 0,
          data
        })
        .then(gas => {
          console.log(gas);
          gasLimit = gas;
        })
        .catch(console.error);

      this.web3.eth.getGasPrice().then(gasPrice => {
        this.web3.eth.getTransactionCount(this.userAddress).then(nonce => {
          this.web3.eth
            .sendTransaction({
              from: this.userAddress,
              to: this.tokenAddress,
              nonce,
              value: 0,
              gasPrice: gasPrice,
              gas: gasLimit,
              data
            })
            .once('transactionHash', hash => {
              console.log(['Hash', hash]);
              this.txHash = hash;
            })
            .once('receipt', res => {
              console.log(['Receipt', res]);
            })
            .on('error', err => {
              console.log(['Error', err]);
            })
            .then(txhash => console.log('THEN: ', txhash));
        });
      });
    },
    approveToken(amount, decimals = 18) {
      const jsonInterface = [
        {
          constant: false,
          inputs: [
            {
              internalType: 'address',
              name: 'usr',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: 'wad',
              type: 'uint256'
            }
          ],
          name: 'approve',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool'
            }
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ];
      const contract = new this.web3.eth.Contract(jsonInterface);
      const data = contract.methods
        .approve(
          this.tokenAddress.toLowerCase(),
          new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toFixed()
        )
        .encodeABI();

      let gasLimit = 100000;
      this.web3.eth
        .estimateGas({
          from: this.userAddress,
          to: this.tokenAddress,
          value: 0,
          data
        })
        .then(gas => {
          console.log(gas);
          gasLimit = gas;
        })
        .catch(console.error);

      this.web3.eth.getGasPrice().then(gasPrice => {
        this.web3.eth.getTransactionCount(this.userAddress).then(nonce => {
          this.web3.eth
            .sendTransaction({
              // from: this.userAddress,
              to: this.tokenAddress,
              nonce,
              value: 0,
              gasPrice: gasPrice,
              gas: gasLimit,
              data
            })
            .once('transactionHash', hash => {
              console.log(['Hash', hash]);
              this.txHash = hash;
            })
            .once('receipt', res => {
              console.log(['Receipt', res]);
            })
            .on('error', err => {
              console.log(['Error', err]);
            })
            .then(txhash => console.log('THEN: ', txhash));
        });
      });
    },
    getCoinBase() {
      this.web3.eth.getCoinbase().then(cb => (this.coinBase = cb));
    },
    makeCall() {
      this.web3.eth
        .call({
          to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // contract address
          data:
            '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
        })
        .then(res => (this.callRes = res));
    },
    getChainId() {
      this.web3.eth.getChainId().then(res => (this.chainId = res));
    },
    personalSign() {
      this.web3.eth.personal.sign(
        this.personalMessageToSign,
        this.userAddress,
        '',
        (err, result) => {
          if (!err) {
            this.personalSignedResult = result;
            // console.log('result:', result); // todo remove dev item
          }
          console.log(err);
        }
      );
    },
    async ecrecover() {
      try {
        const msg = '1234';
        if (this.signatureToCheck === '' && this.signatureFromMessage === '') {
          console.log('lklklklk', this.signatureFromMessage, this.userAddress); // todo remove dev item
          this.signatureFromMessage = '1234';
          this.signatureToCheck = await this.web3.eth.personal.sign(
            this.signatureFromMessage,
            this.userAddress
          );
        }
        console.log('toCheck', this.signatureToCheck); // todo remove dev item
        const res = this.web3.eth.personal
          .ecRecover(
            this.signatureFromMessage,
            this.signatureToCheck,
            (err, address) => {
              if (!err) {
                this.ecRecoverAddress = address;
                console.log(
                  'ecRecoverResult:',
                  address.toLowerCase() === this.userAddress.toLowerCase()
                );
                // todo remove dev item
              } else console.error(err);
            }
          )
          .then(console.log)
          .catch(console.error);
        console.log('res', res); // todo remove dev item
      } catch (e) {
        console.error(e);
      }
    },
    createSubscription() {
      this.subscription = this.web3.eth
        .subscribe('newBlockHeaders', function(error, result) {
          if (!error) {
            console.log(result);
          } else {
            console.log(error);
          }
        })
        .on('data', function(transaction) {
          console.log(transaction);
        })
        .on('error', function(transaction) {
          console.log(transaction);
        })
        .on('connected', function(transaction) {
          console.log(transaction);
        });
    },
    removeSubscription() {
      this.subscription.unsubscribe(function(error, success) {
        if (success) console.log('Successfully unsubscribed!');
      });
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

ul {
  list-style-type: none;

  li {
    text-align: center;
  }
}
</style>
