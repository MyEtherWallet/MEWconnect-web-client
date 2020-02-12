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
  </div>
</template>

<script>
import mewConnect from '../../../../src';
import WalletLink from 'walletlink';
import Web3 from 'web3';
import logo from '../../../../src/connectProvider/logo.svg';

export default {
  name: 'app',
  data() {
    return {
      logo: logo,
      connect: {},
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
  },
  methods: {
    animate() {
      this.connect.showNotice();
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
  }

  #element-img {
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
    from {
      top: 0;
      opacity: 0;
    }
    to {
      top: 30px;
      opacity: 1;
    }
  }

  @keyframes fadein {
    from {
      top: 0;
      opacity: 0;
    }
    to {
      top: 30px;
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeout {
    from {
      top: 30px;
      opacity: 1;
    }
    to {
      top: 0;
      opacity: 0;
    }
  }

  @keyframes fadeout {
    from {
      top: 30px;
      opacity: 1;
    }
    to {
      top: 0;
      opacity: 0;
    }
  }

  ul {
    list-style-type: none;

    li {
      text-align: center;
    }
  }
</style>
