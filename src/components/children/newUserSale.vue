<template>
  <div class="container">
    <mt-header title="新建客户">
      <router-link to="" slot="left">
        <mt-button @click="returnChoose"><i class="fa fa-chevron-left"></i></mt-button>
      </router-link>
    </mt-header>
    <newUser></newUser>
  </div>
</template>

<script>
import router from '../../router/index.js';
import newUser from './newUser';
export default {
  name: 'newUserSale',
  data () {
    return {
      message: '选择客户',
      searchUser: ''
    };
  },
  components: {
    newUser
  },
  methods: {
    returnChoose () {
      router.go(-1);
    }
  }
};
</script>
