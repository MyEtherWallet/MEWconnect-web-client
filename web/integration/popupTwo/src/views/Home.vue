<template>
  <div class="home">
    <h1>Click button</h1>
    <button @click="onClick">Click</button>
  </div>

</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
  methods:{
    onClick(){
      window.alert("clicked")
    }
  }
}
</script>
