<template>
  <div>
    <p>
      <router-link to="/home">Go to Home</router-link>

    </p>
    <button @click="setup">Show web3 modal popup</button>
    <br/>
    <br/>
    <br/>
    <p>
      <a href="https://github.com/MyEtherWallet/MEWconnect-web-client/blob/mewconnect-demo/src/web3Modal/web3Modal.vue" target="_blank">Code for this example</a>
    </p>
  </div>
</template>

<script>
/* eslint-disable */


import Web3 from 'web3';
import Web3Modal from 'web3modal';
// @ts-ignore
import MewConnect from '@myetherwallet/mewconnect-web-client';

export default {
  name: 'web3Modal',
  title: 'web3 Modal Example',
  data () {
    return {
      web3: {}
    };
  },
  mounted () {
  },
  methods: {
    async setup () {
      const providerOptions = {
        mewconnect: {
          package: MewConnect,
          options: {
            infuraId: process.env.REACT_APP_INFURA_ID || '859569f6decc4446a5da1bb680e7e9cf'
          }
        },
      };

      const web3Modal = new Web3Modal({
        network: 'mainnet', // optional
        cacheProvider: true, // optional
        providerOptions // required
      });

      const provider = await web3Modal.connect();

      this.web3 = new Web3(provider);
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
