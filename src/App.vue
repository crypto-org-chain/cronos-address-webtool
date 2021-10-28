<template>
  <div id="app">
    <Home msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import Home from './components/Home.vue'

export default {
  name: 'App',
  components: {
    Home
  }
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  background-image: linear-gradient( rgba(245, 207, 0, .2), rgba(253, 235, 135, .2));
}
</style>
