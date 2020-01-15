<template>
  <div id="app">
    <h1>Click button</h1>
    <button @click="onClick">Click</button>
  </div>
</template>

<script>

export default {
  name: 'app',
  methods:{
    onClick(){
      window.alert("clicked")
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
