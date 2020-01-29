<template>
  <div id="app">
    <h2>connector</h2>
    <button @click="onClick">OPEN</button>
  </div>
</template>

<script>
import Integration from '../../../../src/web3Provider/integration'
export default {
  name: 'app',
  data(){
    return {
      connect: {}
    }
  },
  mounted() {
    this.connect = new Integration();
  },
  methods:{
    onClick(){
      this.connect.openPopupWindow();
    }
  }
}
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
