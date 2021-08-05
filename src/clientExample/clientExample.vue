<template>
  <div>
    <p>
      <!-- use router-link component for navigation. -->
      <!-- specify the link by passing the `to` prop. -->
      <!-- `<router-link>` will be rendered as an `<a>` tag by default -->
      <router-link to="/home">Go to Home</router-link>
    </p>
    <button @click="onClick">CONNECT</button>
    <h3>{{ userAddress }}</h3>
    <button @click="getBlockNumber">Get Block Number</button>
    <div v-show="userAddress === ''">
      <button @click="selectNetwork(1)">Mainnet</button>
      <button @click="selectNetwork(3)">Ropsten</button>
      <button @click="selectNetwork(5)">Goerli</button>
      <button @click="selectNetwork(42)">Kovan</button>
      <button @click="selectNetwork(137)">Matic</button>
      <button @click="selectNetwork(56)">BSC</button>
    </div>
    <ul v-show="userAddress !== ''">
      <li>
        <button @click="disconnect">Disconnect</button>
      </li>
      <li>
        <hr />
        <h2>Send</h2>
        <label for="toAmount">
          to amount
          <input
            id="toAmount"
            v-model="toAmount"
            placeholder="amount"
          /> </label
        ><br />
        <button v-show="userAddress !== ''" @click="sendTx">send</button>
        <h6>Sends to the connected wallet address</h6>
        <h3>Tx Hash:</h3>
        {{ txHash }}
      </li>
      <li>
        <hr />
        <h2>Send With Data</h2>
        <label for="toAmountData">
          to amount
          <input
            id="toAmountData"
            v-model="toAmount"
            placeholder="amount"
          /> </label
        ><br />
        <label for="toData">
          to data
          <input id="toData" v-model="toData" placeholder="0x" /> </label
        ><br />
        <label for="toAddressData">
          to data
          <input
            id="toAddressData"
            v-model="toAddressData"
            placeholder="0x"
          /> </label
        ><br />
        <button v-show="userAddress !== ''" @click="sendTxData">send</button>
        <h6>Sends to the connected wallet address</h6>
        <h3>Tx Hash:</h3>
        {{ txHash }}
      </li>
      <li>
        <hr />
        <h2>Send Token</h2>
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
        <h2>Other Actions</h2>
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
        <button @click="getBalance">balance</button>
        <h3>{{ balance }}</h3>
      </li>
      <li>
        <button @click="getCoinBase">getCoinBase</button>
        <h3>{{ coinBase }}</h3>
      </li>
      <li>
        <button @click="makeCall">makeCall</button>
        <h3>{{ callRes }}</h3>
      </li>
      <li>
        <button @click="getChainId">getChainId</button>
        <h3>{{ chainId }}</h3>
      </li>
      <li>
        <button @click="createSubscription">createSubscription</button>
      </li>
    </ul>
    <br />
    <hr style="width: 50%" />
    <h6>
      The buttons below show the various windows and notification types that
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
  </div>
</template>

<script>
/* eslint-disable */

import mewConnect from '@myetherwallet/mewconnect-web-client';

import PopUpCreator from '../../node_modules/@myetherwallet/mewconnect-web-client/src/connectWindow/popUpCreator.js';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import ethUtil from 'ethereumjs-utils';
import * as sigUtil from 'eth-sig-util';
const messageConstants = {
  decline: 'decline',
  approveTx: 'approveTx',
  disconnect: 'disconnect',
  complete: 'complete',
  sent: 'sent',
  failed: 'failed',
  signMessage: 'signMessage',
  error: 'error',
  notConnected: 'notConnected'
};
const NetworkEndPoints = {
  1: 'https://nodes.mewapi.io/rpc/eth',
  3: 'https://nodes.mewapi.io/rpc/rop',
  5: 'wss://nodes.mewapi.io/ws/goerli',
  42: 'https://nodes.mewapi.io/rpc/kovan',
  137: 'wss://nodes.mewapi.io/ws/matic',
  56: 'https://nodes.mewapi.io/rpc/bsc'
};
export default {
  name: 'app',
  title: 'Interactive Demo',
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
      toData: '0x',
      toAddressData: '',
      messageToSign: 'sign this'
    };
  },
  mounted() {
    // Initialize the provider based client
    this.connect = new mewConnect.Provider({
      windowClosedError: true,
      chainId: 1,
      rpcUrl: NetworkEndPoints[1]
    });
    // Create the MEWconnect web3 provider
    this.ethereum = this.connect.makeWeb3Provider();
    // Create a web3 instance using the MEWconnect web3 provider
    this.web3 = new Web3(this.ethereum);
    // See the 'onClick' method below for starting the connection sequence
    // listener on the web3 provider emiting when the account changes (at the moment this is also the same as a connection being established.)
    this.ethereum.on('accountsChanged', accounts => {
      console.log(`accountsChanged User's address is ${accounts[0]}`);
    });

    this.altPopup = new PopUpCreator();
  },
  methods: {
    getBlockNumber() {
      this.web3.eth.getBlockNumber().then(console.log);
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
    partialReset() {
      this.toAddressData = '';
      this.toData = '0x';
      this.toAmount = 0;
    },
    onClick() {
      this.connect.enable().then(accounts => {
        console.log(`User's address is ${accounts[0]}`);
        this.userAddress = accounts[0];
      });
    },
    disconnect() {
      this.connect.disconnect();
      this.userAddress = '';
    },
    getAccount() {
      this.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          console.log(`User's address is 1${accounts[0]}`);
        });
    },
    getBalance() {
      this.web3.eth
        .getBalance(this.userAddress)
        .then(bal => (this.balance = bal));
    },
    sendTx() {
      this.web3.eth.getBalance(this.userAddress).then(bal => this.balance);
      this.web3.eth.getGasPrice().then(gasPrice => {
        this.web3.eth.getTransactionCount(this.userAddress).then(nonce => {
          this.web3.eth
            .sendTransaction({
              from: this.userAddress,
              to: this.userAddress,
              nonce,
              value: new BigNumber(this.toAmount)
                .times(new BigNumber(10).pow(18))
                .toFixed(),
              gasPrice: gasPrice,
              gas: 21000
            })
            .once('transactionHash', hash => {
              console.log(['Hash', hash]);
              this.tokenTxHash = hash;
              this.partialReset();
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
    sendTxData() {
      this.web3.eth.getBalance(this.userAddress).then(bal => this.balance);
      this.web3.eth.getGasPrice().then(gasPrice => {
        this.web3.eth.getTransactionCount(this.userAddress).then(nonce => {
          const rawTx = {
            from: this.userAddress,
            to:
              this.toAddressData === '' ? this.userAddress : this.toAddressData,
            nonce,
            value: new BigNumber(this.toAmount)
              .times(new BigNumber(10).pow(18))
              .toFixed(),
            gasPrice: gasPrice,
            data: this.toData
          };
          this.web3.eth.estimateGas(rawTx).then(gasLimit => {
            rawTx.gas = gasLimit;
            this.web3.eth
              .sendTransaction(rawTx)
              .once('transactionHash', hash => {
                console.log(['Hash', hash]);
                this.tokenTxHash = hash;
                this.partialReset();
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
          const encryptedMessage = ethUtil.bufferToHex(
            Buffer.from(
              JSON.stringify(
                sigUtil.encrypt(
                  pubkey,
                  { data: 'Hello world! ' + new Date().getTime() },
                  'x25519-xsalsa20-poly1305'
                )
              ),
              'utf8'
            )
          );
          console.log('encrypted message', encryptedMessage);
          this.ethereum
            .request({
              method: 'eth_decrypt',
              params: [encryptedMessage, this.userAddress]
            })
            .then(decryptedMessage =>
              console.log('The decrypted message is:', decryptedMessage)
            )
            .catch(error => console.log(error.message));
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
    sendToken(amount, decimals = this.tokenDecimals) {
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
    approveToken(amount, decimals = this.tokenDecimals) {
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
    createSubscription() {
      let subscription = this.web3.eth
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
