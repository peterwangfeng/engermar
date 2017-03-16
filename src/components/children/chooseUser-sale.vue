<template>
  <div class="container">
  <mt-header title="选择客户">
    <router-link to="" slot="left">
      <mt-button @click="returns"><i class="fa fa-chevron-left"></i></mt-button>
    </router-link>
    <router-link to="/newUserSale" slot="right">新建</router-link>
  </mt-header>
    <chooseUser></chooseUser>
  </div>
</template>

<script>
import chooseUser from './chooseUser';
import router from '../../router/index.js';
export default {
  name: 'chooseUserSale',
  data () {
    return {
    };
  },
  components: {
    chooseUser
  },
  methods: {
    returns () {
      router.go(-1);
    }
  }
};
</script>

