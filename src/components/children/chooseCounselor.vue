<template>
  <div class="container">
    <mt-header title="选择咨询师">
          <router-link to="" slot="left">
            <mt-button @click="returns"><i class="fa fa-chevron-left"></i></mt-button>
          </router-link>
    </mt-header>
    <input type="search" placeholder=" 搜索" @keydown.13="searchCounselor">
    <table class="table">
      <tr>
        <td>张三(18888880889)</td>
      </tr>
    </table>
  </div>
</template>

<script>
import router from '../../router/index.js';
export default {
  data () {
    return {
      message: '选择客户',
      searchUser: ''
    };
  },
  methods: {
    returns () {
      router.go(-1);
    }

  }
};
</script>

<style lang="scss" scoped>
.container{
 text-align: center;
}
a:-webkit-any-link{
  text-decoration: none !important;
  font-size :13px !important;
}
input{
  width: 80%;
  height: 35px;
  background: #a61e42;
  margin: 20px auto;
  color: white;
  border: none;
  outline:none;
  border-radius: 4px;
  font-size: 14px;
  text-indent:10px;
}
input::-webkit-input-placeholder{
  color: #ffffff;
}
input:-moz-placeholder{
  color:#ffffff;
}
input::-moz-placeholder{
  color:#ffffff;
}
input:-ms-input-placeholder {
  color:#ffffff;
}
.table{
  border-collapse: collapse;
  width:100%;
  font-size:14px;
  margin-top: 30px;
  tr{
    border-bottom: 1px solid #dddddd;
    height: 40px;
    line-height: 40px;
  }
  td{
    padding: 0 20px;
    text-align: left;
  }
}
</style>
