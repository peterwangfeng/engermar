<template>
  <div class="container">
    <mt-header title="选择耗材">
          <router-link to="" slot="left" @click.native="back">
            <mt-button><i class="fa fa-chevron-left"></i></mt-button>
          </router-link>
    </mt-header>
    <table class="table">
      <tr v-for="item in materials" @click="selectMaterial(item)">
        <td v-text="item.name"></td>
        <td v-text="item.scode"></td>
      </tr>
    </table>
  </div>
</template>

<script>
import {Toast} from 'mint-ui';
import router from '../../router/index.js';
import {host} from '../../common/js/const';
export default {
  data () {
    return {
      materials: [],
      currentProductId: 0
    };
  },
  activated () {
    var self = this;
    var storeProductInfo = self.$store.getters.getSelectProductInfo;
    if (typeof storeProductInfo === 'string') {
      let currentProductId = self.currentProductId = window.parseInt(storeProductInfo);
      let url = host + 'market/' + currentProductId + '/materials';
      self.$http.get(url).then(function (response) {
        var target = response.data;
        if (target.code === '100') {
          var data = target.data;
          if (data) {
            self.materials = data.materialList;
          } else {
            Toast({message: '没有相关的数据', position: 'middle', duration: 2000});
          }
        }
      }, function (response) {
      });
    }
  },
  methods: {
    back () {
      this.$store.commit('SETCURRENTSELECTMATERIAL', null);
      router.go(-1);
    },
    selectMaterial (item) {
      if (item) {
        let id = item.id;
        let name = item.name;
        let materialInfo = id + '_' + name;
        this.$store.commit('SETCURRENTSELECTMATERIAL', materialInfo);
        router.go(-1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.table{
  border-collapse: collapse;
  width:100%;
  font-size: 14px;
  tr{
    border-bottom: 1px solid #dddddd;
    height: 40px;
    line-height: 40px;
  }
  td{
    padding: 0 20px;
    :last-child{
      text-align: right;
    }
  }
}
</style>
