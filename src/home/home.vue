<template>
  <div>
    <p>
      <!-- use router-link component for navigation. -->
      <!-- specify the link by passing the `to` prop. -->
      <!-- `<router-link>` will be rendered as an `<a>` tag by default -->
      <router-link to="/foo">Go to Foo</router-link>

    </p>
    <p>
      <router-link to="/bar">Go to Bar</router-link>
    </p>
  </div>
</template>

<script>
/* eslint-disable */


export default {
  name: 'home',
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
