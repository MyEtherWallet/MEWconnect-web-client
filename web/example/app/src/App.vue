<template>
  <div id="app">

    <ul>
      <li>
        <h2>connector</h2>
        <button @click="onClick">OPEN</button>
        <h3>{{userAddress}}</h3>
      </li>
    </ul>
    <ul v-show="userAddress !== ''">
      <li>
        <button @click="disconnect">Disconnect</button>
      </li>
      <li>
        <h3>Send</h3>
        <button v-show="userAddress !== ''" @click="sendTx">send</button>
        <h3>Tx Hash: </h3> {{txHash}}
      </li>
      <li>
        <button @click="getBalance">balance</button>
        <h3>{{balance}}</h3>
      </li>
      <li>
        <button @click="getCoinBase">getCoinBase</button>
        <h3>{{coinBase}}</h3>
      </li>
      <li>
        <button @click="makeCall">makeCall</button>
        <h3>{{callRes}}</h3>
      </li>
      <li>
        <button @click="getChainId">getChainId</button>
        <h3>{{chainId}}</h3>
      </li>
      <li>
        <button @click="createSubscription">createSubscription</button>
      </li>
    </ul>

    <button @click="animate">animate</button>
    <p><button @click="animateDirect">animate direct</button></p>
    <p><button @click="animateNotifier">animate notifier</button></p>
  </div>
</template>

<script>
// import mewConnect from '../../../../dist';
import mewConnect from '../../../../src';

import WalletLink from 'walletlink';
import PopUpCreator from '../../../../src/connectClient/popUpCreator'
import Web3 from 'web3';

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
      chainId: 0
    };
  },
  mounted() {
    this.connect = new mewConnect.Provider();
    this.ethereum = this.connect.makeWeb3Provider(3);
    this.web3 = new Web3(this.ethereum);
    this.altPopup = new PopUpCreator();
  },
  methods: {
    animate() {
      this.connect.showNotice();
    },
    animateDirect(){
      this.altPopup.showPopupWindow('sdfsdfsdf')
    },
    animateNotifier(){
      this.connect.showNotifier();
    },
    onClick() {
      this.connect.enable().then((accounts) => {
        console.log(`User's address is ${accounts[0]}`);
        this.userAddress = accounts[0];
      });
    },
    disconnect() {
      this.connect.disconnect();
    },
    getBalance() {
      this.web3.eth.getBalance(this.userAddress).then(bal => this.balance = bal);
    },
    sendTx() {
      this.web3.eth.getBalance(this.userAddress).then(bal => this.balance);
      this.web3.eth.getTransactionCount(this.userAddress).then(nonce => {
        this.web3.eth.sendTransaction({
          from: this.userAddress,
          to: this.userAddress,
          nonce,
          value: 1000000000000000000,
          gasPrice: 1000000000,
          gas: 21000
        }).once('transactionHash', hash => {
          console.log(['Hash', hash]); // todo remove dev item
          this.txHash = hash
          // dispatch('addNotification', ['Hash', tx.from, tx, hash]);
        })
          .once('receipt', res => {
            console.log(['Receipt', res]); // todo remove dev item
            // dispatch('addNotification', ['Receipt', tx.from, tx, res]);
          })
          .on('error', err => {
            console.log(['Error', err]); // todo remove dev item
            // dispatch('addNotification', ['Error', tx.from, tx, err]);
          })
          .then(txhash => console.log("THEN: ", txhash));
      });
    },
    getCoinBase() {
      this.web3.eth.getCoinbase()
        .then(cb => this.coinBase = cb);
    },
    makeCall() {
      this.web3.eth.call({
        to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // contract address
        data: '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003'
      })
        .then(res => this.callRes = res);
    },
    getChainId() {
      this.web3.eth.getChainId().then(res => this.chainId = res);
    },
    createSubscription() {
      let subscription = this.web3.eth.subscribe('newBlockHeaders', function(error, result) {
        if (!error) {
          console.log(result);
        } else {
          console.log(error); // todo remove dev item
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
    /*background-color: #2c3e50;*/
  }



  ul {
    list-style-type: none;

    li {
      text-align: center;
    }
  }
</style>
