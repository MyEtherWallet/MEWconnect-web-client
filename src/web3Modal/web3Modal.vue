<template>
  <div>
    <p>
      <!-- use router-link component for navigation. -->
      <!-- specify the link by passing the `to` prop. -->
      <!-- `<router-link>` will be rendered as an `<a>` tag by default -->
      <router-link to="/home">Go to Home</router-link>

    </p>
    <button @click="setup">Click Button</button>
  </div>
</template>

<script>
/* eslint-disable */


import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
// @ts-ignore
import Fortmatic from 'fortmatic';
import Torus from '@toruslabs/torus-embed';
import Authereum from 'authereum';
import UniLogin from '@unilogin/provider';
// @ts-ignore
import MewConnect from '@myetherwallet/mewconnect-web-client';

export default {
  name: 'web3Modal',
  data () {
    return {
      web3: {}
    };
  },
  mounted () {
  },
  methods: {
    async setup () {
      console.log(process.env.REACT_APP_INFURA_ID); // todo remove dev item
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: process.env.REACT_APP_INFURA_ID
          }
        },
        torus: {
          package: Torus
        },
        fortmatic: {
          package: Fortmatic,
          options: {
            key: process.env.REACT_APP_FORTMATIC_KEY
          }
        },
        authereum: {
          package: Authereum
        },
        unilogin: {
          package: UniLogin
        },
        mewconnect: {
          package: MewConnect,
          options: {
            infuraId: process.env.REACT_APP_INFURA_ID
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
