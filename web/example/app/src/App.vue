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
    <button  @click="animate">animate</button>
    <div id="element">
      <img id="element-img" :src="logo"/>
      <div id="element-text">
        Stuff qqqqqqqqqqqqqqqqqqqqqqqq
      </div>
    </div>
  </div>
</template>

<script>
import Integration from '../../../../src/web3Provider/integration';
import WalletLink from 'walletlink';
import Web3 from 'web3';
import logo from '../../../../src/web3Provider/logo.svg'
export default {
  name: 'app',
  data() {
    return {
      logo: logo,
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
    animate(){
      this.connect.showNotice();
      // const element = window.document.getElementById('element')
      // const elementText = window.document.getElementById('element-text')
      //
      // elementText.textContent = 'Stuff shown';
      // element.className = "show";
      // setTimeout(function(){ element.className = element.className.replace("show", ""); }, 2800);
    },
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
      const ETH_JSONRPC_URL = 'https://mainnet.infura.io/v3/';
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

  #element-img{
    height: 25%;
    width: 75%;
  }

  #element {
    visibility: hidden; /* Hidden by default. Visible on click */
    min-width: 250px; /* Set a default minimum width */
    margin-left: -125px; /* Divide value of min-width by 2 */
    background-color: rgba(51, 51, 51, 0.2); /* Black background color */
    color: #000000; /* White text color */
    text-align: center; /* Centered text */
    border-radius: 2px; /* Rounded borders */
    padding: 16px; /* Padding */
    position: fixed; /* Sit on top of the screen */
    z-index: 1; /* Add a z-index if needed */
    right: 30px; /* Center the snackbar */
    top: 30px; /* 30px from the bottom */
  }

  /* Show the snackbar when clicking on a button (class added with JavaScript) */
  #element.show {
    visibility: visible; /* Show the snackbar */
    /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
    However, delay the fade out process for 2.5 seconds */
    -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
    animation: fadein 0.5s, fadeout 0.5s 2.5s;
  }

  /* Animations to fade the snackbar in and out */
  @-webkit-keyframes fadein {
    from {top: 0; opacity: 0;}
    to {top: 30px; opacity: 1;}
  }

  @keyframes fadein {
    from {top: 0; opacity: 0;}
    to {top: 30px; opacity: 1;}
  }

  @-webkit-keyframes fadeout {
    from {top: 30px; opacity: 1;}
    to {top: 0; opacity: 0;}
  }

  @keyframes fadeout {
    from {top: 30px; opacity: 1;}
    to {top: 0; opacity: 0;}
  }
</style>
