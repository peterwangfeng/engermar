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
      <tr class="tr-swipe" v-for="(item, index) in consume.operators">
        <mt-cell-swipe
            @touchmove.native="selectSwipe('operator', index)"
            :right="[{
              content: '取消',
              style: { background: 'lightgray', color: '#fff' }
            },
            {
              content: '删除',
              style: { background: 'red', color: '#fff' },
              handler: () => rightButtonHandler()
            }]"
            :title="item.name">
            <span>操作师</span>
          </mt-cell-swipe>
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
      action: 'back',
      flag: {
        mFlag: false,
        oFlag: false
      },
      swipe: {
        operator: {
          isSelect: false,
          operatorIndex: -1
        }
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
    let self = this;
    let productItemInfo = self.$route.params.productItemInfo;
    let materialInfo = self.$store.getters.getCurrentSelectMaterial;
    let operatorsInfo = self.$store.getters.getSelectSaleInfo;
    if (productItemInfo) {
      self.consume.maxTimes = window.parseInt(productItemInfo);
    }
    if (typeof materialInfo === 'string' && self.flag.mFlag) {
      let infoes = String(materialInfo).split('_');
      let temp = {id: window.parseInt(infoes[0]), name: infoes[1], amount: infoes[2], singlePrice: infoes[3]};
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
  beforeRouteLeave (to, from, next) {
    let action = this.action;
    let path = to.path;
    if (String(action) === 'back' && String(path) === '/consume') {
      this.destoryData();
    }
    this.action = 'back';
    next(true);
  },
  methods: {
    selectSwipe (type, index) {
      let operator = this.swipe.operator;
      if (type === 'operator') {
        operator.isSelect = true;
        operator.operatorIndex = index;
      }
    },
    rightButtonHandler() {
      let operator = this.swipe.operator;
      let operators = this.consume.operators;
      if (operator.isSelect) {
        operators.splice(operator.saleIndex, 1);
      }
    },
    reset () {
      this.consume = {
        times: '',
        maxTimes: '',
        materials: [],
        operators: []
      };
    },
    destoryData () {
      this.reset();
      this.$store.commit('SETCURRENTCONSUMEINFO', undefined);
    },
    back () {
      this.action = 'back';
      this.destoryData();
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
      let ctimes = window.parseInt(this.consume.times);
      let cMaxTimes = this.consume.maxTimes;
      if (ctimes > 0) {
        let maxTimes = window.parseInt(cMaxTimes);
        if (ctimes > maxTimes) {
          MessageBox({title: '', message: '本项目只剩' + maxTimes + '次'});
        } else {
          this.action = 'submit';
          this.$store.commit('SETCURRENTCONSUMEINFO', this.consume);
          this.reset();
          router.push({path: '/consume'});
        }
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
    .tr-swipe {
   position: relative;
  a.mint-cell {
    padding: 0;
    position: absolute;
    width: 99.5%;
    background-color: #fff;
    box-sizing: border-box;
    color: inherit;
    min-height: 0;
    display: block;
    overflow: hidden;
  }
  div.mint-cell-wrapper {
    text-align: left;
    background: #fff;
    margin: 0 auto;
    font-size: 14px !important;
    border: none;
    outline: none;
    border-radius: 0;
    div.mint-cell-title {
      padding-left: 20px;
    }
    div.mint-cell-value {
      span {
        padding-right: 10px;
      }
    }
  }
  .mint-cell-swipe-button {
    line-height: 40px;
  }
}

}
</style>
