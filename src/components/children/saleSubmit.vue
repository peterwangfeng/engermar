<template>
  <div class="container">
    <mt-header title="销售提交成功"></mt-header>
    <p>销售单: {{saleRecordId}} 提交成功!</p>
    <router-link to="/home">
      <mt-button class="btn-color">返回主页</mt-button>
    </router-link>
    <router-link to="/returns">
      <mt-button class="btn-color">退 货</mt-button>
    </router-link>
  </div>
</template>

<script>
import router from '../../router/index.js';
export default {
  data () {
    return {
      saleRecordId: 0
    };
  },
  activated () {
    var self = this;
    self.saleRecordId = self.$route.params.saleRecordId;
  },
  methods: {
    newUser () {
      router.push({path: '/newUser'});
    }
  }
};
</script>

<style lang="scss" scoped>
p{
  margin-top: 100px;
  font-size: 14px;
  font-weight: 600;
  color: #666666;
}
.btn-color{
  margin: 40px 15px;
  width: 90px;
  height: 35px;
  color: #a61e42;
  font-size: 14px;
  font-weight: 600;
  background: #f5f5f5;
}
</style>
