<template>
  <img id="img" src="../assets/hello.jpg">
</template>
<script>
import router from '../router/index.js';
export default {
  mounted: function () {
    this.timer();
  },
  methods: {
    timer () {
      var img = document.getElementById('img');
      img.style.display = 'block';
      window.setTimeout(this.hide, 2000);
    },
    hide () {
      router.push('/login');
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#img{
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2000;
}
</style>
