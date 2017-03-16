<template>
  <div class="container">
    <mt-header title="消耗">
          <router-link to="" slot="left" @click.native="back">
            <mt-button><i class="fa fa-chevron-left"></i></mt-button>
          </router-link>
          <router-link to="" slot="right" @click.native="saveConsume">保存</router-link>
    </mt-header>
    <table class="top-table">
      <thead>
      <tr>
        <th>次数：<input type="number" v-model="consume.times"></th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr class="tr-color"  @click="loadComponent('addMaterial')">
        <td>耗材</td>
        <td><router-link to=""><img class="img-plus" src="../../assets/plus.png"></router-link></td>
      </tr>
      </tbody>
    </table>
    <table class="table">
      <tr v-for="item in consume.materials">
        <td>{{item.name}}</td>
        <td>数量：{{item.amount}}</td>
      </tr>
      <tr class="tr-color" @click="loadComponent('chooseEmployee')">
        <td>操作人</td>
        <td><router-link to=""><img class="img-plus" src="../../assets/plus.png"></router-link></td>
      </tr>
      <tr v-for="item in consume.operators">
        <td v-text="item.name"></td>
        <td v-text="item.identity"></td>
      </tr>
    </table>
  </div>
</template>

<script>
import router from '../../router/index.js';
import { MessageBox } from 'mint-ui';
export default {
  data () {
    return {
      flag: {
        mFlag: false,
        oFlag: false
      },
      consume: {
        times: '',
        maxTimes: '',
        materials: [],
        operators: []
      }
    };
  },
  activated () {
    var self = this;
    var productItemInfo = self.$route.params.productItemInfo;
    var materialInfo = self.$store.getters.getCurrentSelectMaterial;
    var operatorsInfo = self.$store.getters.getSelectSaleInfo;
    if (productItemInfo) {
      self.consume.maxTimes = window.parseInt(productItemInfo);
    }
    if (typeof materialInfo === 'string' && self.flag.mFlag) {
      let infoes = String(materialInfo).split('_');
      let temp = {id: window.parseInt(infoes[0]), name: infoes[1], amount: infoes[2]};
      self.consume.materials.push(temp);
      self.flag.mFlag = false;
    }
    if (typeof operatorsInfo === 'string' && self.flag.oFlag) {
      let infoes = String(operatorsInfo).split('-');
      let temp = {id: window.parseInt(infoes[0]), name: infoes[1], identity: infoes[2]};
      self.consume.operators.push(temp);
      self.flag.oFlag = false;
    }
  },
  watch: {
    'consume.times': function () {
      let times = window.parseInt(this.consume.times);
      let maxTimes = window.parseInt(this.consume.maxTimes);
      if (times > maxTimes) {
        MessageBox({title: '', message: '本项目只剩' + maxTimes + '次'});
      }
    }
  },
  methods: {
    reset () {
      this.consume = {
        times: '',
        maxTimes: '',
        materials: [],
        operators: []
      };
    },
    back () {
      this.reset();
      this.$store.commit('SETCURRENTCONSUMEINFO', undefined);
      router.go(-1);
    },
    loadComponent (componentName) {
      if (componentName === 'addMaterial') {
        this.flag.mFlag = true;
        router.push({path: '/' + componentName});
      } else if (componentName === 'chooseEmployee') {
        this.flag.oFlag = true;
        router.push({name: componentName, params: {type: 2}});
      }
    },
    saveConsume () {
      let materials = this.consume.materials;
      let ctimes = window.parseInt(this.consume.times);
      let cMaxTimes = this.consume.maxTimes;
      if (ctimes > 0 && materials.length > 0) {
        let maxTimes = window.parseInt(cMaxTimes);
        if (ctimes > maxTimes) {
          MessageBox({title: '', message: '本项目只剩' + maxTimes + '次'});
        } else {
          this.$store.commit('SETCURRENTCONSUMEINFO', this.consume);
          this.reset();
          router.push({path: '/consume'});
        }
      } else if (materials.length === 0) {
        MessageBox({title: '', message: '请添加耗材'});
      } else {
        MessageBox({title: '', message: '请添加次数'});
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.top-table {
  th {
    input {
      outline: 0;
      border: 0;
      background: #FFF;
    }
  }
}
.table{
    margin-top: -30px;
    .tr-color{
      background: #efefef;
    }
    td{
      padding:0;
      border-bottom: 1px solid #dddddd;
      height:40px;
    }
    td:first-child{
      text-align:left;
      padding-left: 20px;
    }
    td:last-child{
      text-align:right;
      padding-right: 20px;
    }
    .btn-add{
      color: #a61e42;
      background: #ffffff;
      border: 1px solid #a61e42;

    }

}
</style>
