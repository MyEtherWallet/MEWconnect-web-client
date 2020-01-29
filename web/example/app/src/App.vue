<template>
  <div id="app">
    <h2>connector</h2>
    <button @click="onClick">OPEN</button>
    <h2>WalletLink</h2>
    <button @click="walletLink">OPEN</button>
    <h3>{{userAddress}}</h3>
    <button v-show="userAddress !== ''" @click="disconnect">Disconnect</button>
    <h3>Send</h3>
    <button v-show="userAddress !== ''" @click="sendTx">send</button>
    <h3>{{balance}}</h3>
    <button v-show="userAddress !== ''" @click="getBalance">balance</button>
  </div>
</template>

<script>
import Integration from '../../../../src/web3Provider/integration';
import WalletLink from 'walletlink';
import Web3 from 'web3';

export default {
  name: 'app',
  data() {
    return {
      connect: {},
      userAddress: '',
      ethereum: {},
      balance: 0
    };
  },
  mounted() {
    this.connect = new Integration();
    this.ethereum = this.connect.makeWeb3Provider();
  },
  methods: {
    onClick() {
      this.connect.enable().then((accounts) => {
        console.log(`User's address is ${accounts[0]}`)
        this.userAddress = accounts[0];
      })
    },
    disconnect(){
      this.connect.disconnect()
    },
    getBalance(){
      const web3 = new Web3(this.ethereum);
      web3.eth.getBalance(this.userAddress).then(bal => this.balance = bal)
    },
    sendTx(){
      const web3 = new Web3(this.ethereum);
      web3.eth.getBalance(this.userAddress).then(bal => this.balance)
      web3.eth.getTransactionCount(this.userAddress).then(nonce =>{
        web3.eth.sendTransaction({
          from: this.userAddress,
          to: this.userAddress,
          nonce,
          value: 1000000000000000000,
          gasPrice: 1000000000,
          gas: 21000
        })
          .then(console.log)
      })
    },
    walletLink() {
      const APP_NAME = 'My Awesome App';
      // const APP_LOGO_URL = "https://example.com/logo.png"
      const ETH_JSONRPC_URL = 'https://mainnet.infura.io/v3/c9b249497d074ab59c47a97bdfe6b401';
      const CHAIN_ID = 1;

// Initialize WalletLink
      const walletLink = new WalletLink({
        appName: APP_NAME
      });
      console.log(walletLink); // todo remove dev item
      // walletLink.openPopupWindow();
// Initialize a Web3 Provider object
      const ethereum = walletLink.makeWeb3Provider(ETH_JSONRPC_URL, CHAIN_ID);
      console.log(ethereum); // todo remove dev item
// Initialize a Web3 object
//       const web3 = new Web3(ethereum);
//
// // Optionally, have the default account be set automatically when available
//       ethereum.on('accountsChanged', (accounts) => {
//         web3.eth.defaultAccount = accounts[0];
//       });
//
//       // Use eth_RequestAccounts
//       ethereum.send("eth_requestAccounts").then((accounts) => {
//         console.log(`User's address is ${accounts[0]}`)
//
//       })
//
// Alternatively, you can use ethereum.enable()
      ethereum.enable().then((accounts) => {
        console.log(`User's address is ${accounts[0]}`)
      })
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
</style>
