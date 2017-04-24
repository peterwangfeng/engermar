// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from 'App';
import router from 'router/index';
import store from 'vuex/store';
import 'assets/libs/font-awesome-4.7.0/css/font-awesome.min.css';
import 'mint-ui/lib/style.min.css';
import Mint from 'mint-ui';
// import infiniteScroll from 'vue-infinite-scroll';
// Vue.use(infiniteScroll);
Vue.use(Mint);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
});
