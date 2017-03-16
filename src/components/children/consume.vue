<template>
  <div class="container">
    <mt-header title="消耗">
          <router-link to="" slot="left" @click.native="back">
            <mt-button><i class="fa fa-chevron-left"></i></mt-button>
          </router-link>
          <router-link to="" slot="right" @click.native="submitConsumeRecord">提交</router-link>
    </mt-header>
    <table class="top-table">
      <thead>
      <tr>
        <th>日期</th>
        <th><date></date></th>
      </tr>
      <tr>
        <th>客户</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr @click="loadUserSale('chooseUserSale')">
        <td>{{consume.customer.name}}</td>
        <td>{{consume.customer.storeName}} <router-link to="" slot="left"><i class="fa fa-chevron-right"></i></router-link></td>
      </tr>
      </tbody>
    </table>
    <table class="table">
      <thead>
      <tr>
        <th colspan="2">产品项目</th>
        <th colspan="2">
         <!--  <router-link to="" slot="left"><img class="img-plus" src="../../assets/plus.png"></router-link> -->
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="productItem in consume.productItems">
        <td>{{productItem.name}}</td>
        <td>剩余次数:{{productItem.residueTimes}}</td>
        <td>消耗次数:{{productItem.consumeTimes}}</td>
        <td><router-link to="" @click.native="addConsume(productItem)"><mt-button class="btn-add">添加</mt-button></router-link></td>
        <td><p>耗材：<span v-for="material in productItem.materials"><span>{{material}}</span></span>，操作师：</p></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import router from '../../router/index.js';
import date from './date';
import {host} from '../../common/js/const';
import { Toast } from 'mint-ui';
import { MessageBox } from 'mint-ui';
export default {
  components: {
    date
  },
  data () {
    return {
      flag: {
        pFlag: false
      },
      consume: {
        customer: {
          id: 0,
          name: '请选择客户',
          storeName: ''
        },
        productItems: [],
        changeProductItem: []
      },
      currentSelectedProduct: {
        id: 0,
        name: '',
        maxTims: 0,
        residueTimes: 0,
        consumeTimes: 0,
        isSelected: false,
        material: [],
        operators: []
      }
    };
  },
  activated () {
    var self = this;
    var consume = self.consume;
    var storeCustomerInfo = self.$store.getters.getCurrentConsumerInfo;
    var storeConsumeObject = self.$store.getters.getCurrentConsumeInfo;
    if (typeof storeCustomerInfo === 'string') {
      var infoes = String(storeCustomerInfo).split('-');
      consume.customer.id = window.parseInt(infoes[0]);
      consume.customer.name = infoes[1];
      consume.customer.storeName = infoes[2];
      self.initData(consume.customer);
    } else {
      consume.customer.id = 0;
      consume.customer.name = '请选择客户';
      consume.customer.storeName = '';
      consume.productItems = [];
    }
    if (typeof storeConsumeObject === 'object' && self.flag.pFlag) {
      let materials = [];
      let operators = [];
      let showMaterials = [];
      let showOperators = [];
      let currentSelectedProduct = self.currentSelectedProduct;
      currentSelectedProduct.consumeTimes = Number(storeConsumeObject.times);
      currentSelectedProduct.residueTimes = Number(currentSelectedProduct.consumeTimes - currentSelectedProduct.consumeTimes);
      currentSelectedProduct.materials = storeConsumeObject.materials;
      currentSelectedProduct.operators = storeConsumeObject.operators;
      for (let i = 0; i < storeConsumeObject.materials.length; i++) {
        let target = storeConsumeObject.materials[i];
        if (target) {
          let material = target.id + '-' + target.amount;
          showMaterials.push(target.name + '*' + target.amount);
          materials.push(material);
        }
      }
      for (let j = 0; j < storeConsumeObject.operators.length; j++) {
        let target = storeConsumeObject.operators[j];
        if (target) {
          showOperators.push(target.name);
          operators.push(String(target.id));
        }
      }
      for (let index = 0; index < self.consume.productItems.length; index++) {
        let target = self.consume.productItems[index];
        if (target) {
          if (window.parseInt(target.id) === window.parseInt(currentSelectedProduct.id)) {
            self.$set(target, 'materials', showMaterials);
            self.$set(target, 'operators', showOperators);
          }
        }
      }
      let temp = {id: currentSelectedProduct.id, fullnm: currentSelectedProduct.name, materials: materials, operators: operators};
      if (self.consume.changeProductItem.length > 0) {
        for (let index = 0; index < self.consume.changeProductItem.length; index++) {
          let target = self.consume.changeProductItem[index];
          if (target) {
            if (window.parseInt(target.id) === window.parseInt(currentSelectedProduct.id)) {
              target = null;
              break;
            }
          }
        }
        self.consume.changeProductItem.push(temp);
      } else {
        self.consume.changeProductItem.push(temp);
      }
      self.flag.pFlag = false;
    }
  },
  methods: {
    reset () {
      this.consume = {
        customer: {
          id: 0,
          name: '请选择客户',
          storeName: ''
        },
        productItems: [],
        changeProductItem: []
      };
    },
    initData (customer) {
      var self = this;
      if (customer.id > 0) {
        let url = host + 'market/' + customer.id + '/salerecords?residue=1';
        self.$http.get(url).then(function (response) {
          var target = response.data;
          if (target) {
            self.consume.productItems = [];
            let tempArray = [];
            let data = target.data;
            if (data) {
              let saleRecords = data.saleRecordMap;
              for (let key in saleRecords) {
                let product = saleRecords[key];
                if (product) {
                  tempArray.push(product);
                }
              }
              for (let i = 0; i < tempArray.length; i++) {
                let sf = tempArray[i];
                for (let j = 0; j < sf.length; j++) {
                  let product = sf[j];
                  let residueTimes = Number(Number(product.atimes) - Number(product.utimes));
                  let temp = {id: product.prdid, name: product.prdnm, residueTimes: residueTimes, consumeTimes: product.utimes, materials: [], operators: [], isChanged: false};
                  self.consume.productItems.push(temp);
                }
              }
            } else {
              Toast({message: '没有相关数据', position: 'middle', duration: 2000});
            }
          }
        }, function (response) {
        });
      }
    },
    back () {
      this.reset();
      this.$store.commit('RESETSALEABOUT');
      router.push({path: '/home'});
    },
    loadUserSale (targetComponent) {
      if (targetComponent) {
        router.push({path: '/' + targetComponent});
      }
    },
    submitConsumeRecord () {
      var customer = this.consume.customer;
      if (customer.id > 0 && String(customer.name).indexOf('请选择客户') < 0 && customer.storeName) {
        let url = host + 'market/userRecord/add';
        let userRecord = JSON.stringify(this.consume.changeProductItem);
        this.$http.post(url, {consumerId: this.consume.customer.id, userRecord: userRecord}, {
          emulateJSON: true
        }).then(function (response) {
          var target = response.data;
          if (target.code === '100') {
            this.back();
          } else {
            MessageBox({title: '', message: target.msg});
          }
        }, function (response) {
        });
      } else {
        MessageBox({title: '', message: '请选择客户'});
      }
    },
    addConsume (productItem) {
      var self = this;
      self.flag.pFlag = true;
      productItem.isChanged = true;
      let residueTimes = window.parseInt(productItem.residueTimes);
      let consumeTimes = window.parseInt(productItem.consumeTimes);
      self.currentSelectedProduct.id = productItem.id;
      self.currentSelectedProduct.name = productItem.name;
      self.currentSelectedProduct.maxTims = residueTimes;
      self.currentSelectedProduct.consumeTimes = consumeTimes;
      self.currentSelectedProduct.residueTimes = residueTimes;
      self.$store.commit('SETSELECTPRODUCTINFO', String(productItem.id));
      router.push({name: 'addConsume', params: {productItemInfo: residueTimes}});
    }
  }
};
</script>

<style lang="scss" scoped>

.table{
    border:none;
    td{
      padding:0;
      border: none;
      height: 60px;
      font-size: 13px;
      p{
        // border-bottom: 1px solid #dddddd;
        padding: 0;
        margin: 0;
        text-align: left;
        color: #bbbbbb;
      }
    }
    td:first-child{
      text-align:left;
      padding-left: 20px;
    }
    tr {
      position: relative;
      border-bottom: 1px solid #dddddd;
      td:last-child {
        p {
          height: 35px;
          position: absolute;
          left: 20px;
        }
      }
    }
    .btn-add{
      width:60px;
      height: 18px;
      font-size: 12px;
      color: #a61e42;
      font-weight: 600;
      background: #ffffff;
      border: 1px solid #a61e42;
    }
}
</style>
