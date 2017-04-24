<template>
  <div class="container">
    <mt-header title="销售提交成功"></mt-header>
    <p>销售单: {{saleRecordId}} 提交成功!</p>
    <router-link to="">
      <mt-button class="btn-color" @click.native="targetComponent('home')">返回主页</mt-button>
    </router-link>
    <router-link to="">
      <mt-button class="btn-color" @click.native="targetComponent('returns')">退 货</mt-button>
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
    targetComponent (componentName) {
      if (componentName === 'home') {
        this.$store.commit('SETSALERECORD', undefined);
      }
      router.push({path: '/' + componentName});
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
