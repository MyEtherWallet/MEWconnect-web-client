<template>
  <div>
    <p>
      <router-link to="/interactive">Interactive Demo</router-link>

    </p>
    <p>
      <router-link to="/web3Modal">Web3 Modal Example</router-link>
    </p>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <p>
      <a href="https://github.com/MyEtherWallet/MEWconnect-web-client/tree/mewconnect-demo" target="_blank">Code for this example</a>
    </p>
    <p>
      <a href="https://github.com/MyEtherWallet/MEWconnect-web-client">Github</a>
    </p>
  </div>
</template>

<script>
/* eslint-disable */


export default {
  name: 'home',
  title: 'MEWconnect client demo',
  data () {
    return {
      web3: {}
    };
  },
  mounted () {
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
