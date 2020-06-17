<template>
  <div id="app">
    <h2>MEW connect client library example</h2>
        <!-- route outlet -->
    <!-- component matched by the route will render here -->
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
  },
  methods: {

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
