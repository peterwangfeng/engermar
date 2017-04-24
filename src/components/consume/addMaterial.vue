<template>
  <div class="container">
    <mt-header title="添加耗材">
          <router-link to="" slot="left" @click.native="back">
            <mt-button><i class="fa fa-chevron-left"></i></mt-button>
          </router-link>
          <router-link to="" slot="right" @click.native="submitMaterial">添加</router-link>
    </mt-header>
    <table class="table">
      <tr class="table-header" @click="loadComponent('chooseMaterial')">
        <td>耗材：{{currentMaterial.name}}</td>
        <td><router-link to="" slot="right"><i class="fa fa-chevron-right"></i></router-link></td>
      </tr>
      <tr>
        <td colspan="2">用量：<input type="number" v-model="currentMaterial.amount"></td>
      </tr>
    </table>
  </div>
</template>

<script>
import router from '../../router/index.js';
import {Toast} from 'mint-ui';
export default {
  data () {
    return {
      flag: {
        cFlag: false
      },
      isClick: false,
      currentMaterial: {
        id: 0,
        name: '',
        singlePrice: '',
        amount: ''
      }
    };
  },
  activated () {
    var self = this;
    var currentMaterial = self.currentMaterial;
    var material = self.$store.getters.getCurrentSelectMaterial;
    if (typeof material === 'string' && self.flag.cFlag) {
      let infoes = String(material).split('_');
      if (infoes[0] !== String(currentMaterial.id)) {
        currentMaterial.id = window.parseInt(infoes[0]);
        currentMaterial.name = infoes[1];
        currentMaterial.singlePrice = infoes[2];
      }
      self.flag.cFlag = false;
    }
  },
  beforeRouteLeave (to, from, next) {
    if (!this.isClick) {
      this.destoryData();
    }
    this.isClick = false;
    next(true);
  },
  methods: {
    reset () {
      this.currentMaterial = {
        id: 0,
        name: '',
        amount: ''
      };
    },
    destoryData () {
      this.reset();
      this.$store.commit('SETCURRENTSELECTMATERIAL', null);
    },
    back () {
      this.isClick = false;
      this.destoryData();
      router.go(-1);
    },
    loadComponent (componentName) {
      if (componentName) {
        this.flag.cFlag = true;
        router.push({path: '/' + componentName});
      }
    },
    submitMaterial () {
      let currentMaterial = this.currentMaterial;
      let amount = window.parseInt(currentMaterial.amount);
      if (currentMaterial.id > 0 && amount >= 0) {
        let data = currentMaterial.id + '_' + currentMaterial.name + '_' + currentMaterial.amount + '_' + currentMaterial.singlePrice;
        this.$store.commit('SETCURRENTSELECTMATERIAL', data);
        this.reset();
        router.go(-1);
        this.isClick = true;
      } else {
        Toast({message: '耗材和用量不可为空', position: 'middle', duration: 1000});
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.table{
  border-collapse: collapse;
  width:100%;
  font-size:14px;
  .table-header{
    background: #efefef;
  }
  tr{
    border-bottom: 1px solid #dddddd;
    height: 40px;
    line-height: 40px;
    text-align:left;
  }
  td{
    padding: 0 20px;
  }
  .table-header td:first-child{
    width: 80%;
    text-align: left;
  }
  .table-header td:last-child{
    text-align: right;
  }
}

</style>
