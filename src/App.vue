<template>
  <div id="app">
    <h2>MEWconnect client library examples</h2>
    <router-view></router-view>
  </div>
</template>

<script>
/* eslint-disable */


export default {
  name: 'app',
  data() {
    return {
    };
  },
  mounted() {
    this.$router.push('home')
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
