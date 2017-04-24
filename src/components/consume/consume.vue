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
      <tr @click="open('consume-picker')">
        <th>日期</th>
        <th>{{consume.date}}</th>
      </tr>
      <tr>
        <th>客户</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr @click="loadUserSale('chooseUser')">
        <td>{{consume.customer.name}}</td>
        <td>{{consume.customer.storeName}} <router-link to="" slot="left"><i class="fa fa-chevron-right"></i></router-link></td>
      </tr>
      </tbody>
    </table>
    <table class="table">
      <thead>
      <tr>
        <th colspan="6">产品项目</th>
        </th>
      </tr>
      </thead>
      <tbody class="table-data">
        <ul class="table-data-ul">
          <li v-for="productItem in productItems" @click="showSub(productItem)">
            <div>{{productItem.fullnm | subStr}}</div>
            <div>剩余次数:{{productItem.residueTimes}}</div>
            <div>消耗次数:{{productItem.consumeTimes}}</div>
            <div v-if="!productItem.isMutiProject" class="btn-add-container"><router-link to="" @click.native="addConsume(productItem)"><mt-button class="btn-add">添加</mt-button></router-link></div>
            <div v-if="productItem.isMutiProject" class="icon-container">
              <span class="icon"><i :class="productItem.icon"></i></span>
            </div>
            <div class="data-block" v-if="productItem.isShowSubProject">
              <table class="table">
                <tr v-for="sub in productItem.subProject">
                  <td>{{sub.name}}</td>
                  <td>剩余次数:{{sub.lefttimes}}</td>
                  <td>消耗次数:{{sub.atimes - sub.lefttimes}}</td>
                  <td v-if="sub.lefttimes > 0"><router-link to="" @click.native="addConsume(productItem, sub)"><mt-button class="btn-add">添加</mt-button></router-link></td>
                </tr>
              </table>
            </div>
            <div class="material-list">
              <ul>
                <li v-for="(material, index) in productItem.materials">
                  <span>耗材：{{material | stringFilters}}，</span>
                  <span>操作师：{{productItem.operators[index] | stringFilters}}</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </tr>
      </tbody>
    </table>
    <mt-datetime-picker
      ref="consume-picker"
      type="date"
      v-model="datepicker.value"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      :startDate="datepicker.startDate"
      :endDate="datepicker.endDate"
      @confirm="handleChange">
    </mt-datetime-picker>
  </div>
</template>

<script>
import router from '../../router/index.js';
import date from '../common/date';
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
      datepicker: {
        startDate: null,
        endDate: null,
        value: ''
      },
      classObject: {
        none: 'none',
        rightToDown: 'fa fa-chevron-right'
      },
      productItems: [],
      consume: {
        date: '请选择时间',
        customer: {
          id: 0,
          name: '请选择客户',
          storeName: ''
        },
        productItems: [],
        changeProductItem: []
      },
      currentSubProject: {
        id: 0,
        lefttimes: 0
      },
      currentSelectedProduct: {
        id: 0,
        accid: 0,
        name: '',
        type: '',
        maxTims: 0,
        atimes: 0,
        residueTimes: 0,
        consumeTimes: 0,
        isSelected: false,
        singlePrice: 0,
        originPrice: 0,
        material: [],
        operators: []
      }
    };
  },
  filters: {
    stringFilters: function (value) {
      let result = '';
      if (value) {
        result = String(value).replace(/\[\"\]/g, '');
      }
      return result;
    },
    subStr: function (value) {
      let result = '';
      if (value) {
        result = String(value).substring(0, 7);
      }
      return result;
    }
  },
  created () {
    let self = this;
    let now = new Date();
    let startDate = new Date(1990, 0, 1);
    self.datepicker.startDate = startDate;
    self.datepicker.endDate = now;
    self.datepicker.value = now.getFullYear() + '-' + Number(now.getMonth() + 1) + '-' + now.getDate();
  },
  activated () {
    let self = this;
    let consume = self.consume;
    let storeCustomerInfo = self.$store.getters.getCurrentConsumerInfo;
    let storeConsumeObject = self.$store.getters.getCurrentConsumeInfo;
    if (typeof storeCustomerInfo === 'string' && !self.flag.pFlag) {
      let infoes = String(storeCustomerInfo).split('-');
      consume.customer.id = window.parseInt(infoes[0]);
      consume.customer.name = infoes[1];
      consume.customer.storeName = infoes[2];
      self.initData(consume.customer);
    }
    if (typeof storeConsumeObject === 'object' && self.flag.pFlag) {
      let subs = [];
      let materials = [];
      let operators = [];
      let showMaterials = [];
      let showOperators = [];
      let productItems = self.productItems;
      let currentSelectedProduct = self.currentSelectedProduct;
      let productId = currentSelectedProduct.id;
      let productAccId = currentSelectedProduct.accid;
      let consumeTimes = storeConsumeObject.times;
      let consumeMaterials = storeConsumeObject.materials;
      let consumeOperators = storeConsumeObject.operators;
      for (let i = 0; i < consumeMaterials.length; i++) {
        let target = consumeMaterials[i];
        if (target) {
          let material = target.id + '-' + target.amount;
          showMaterials.push(target.name + '*' + target.amount);
          materials.push(material);
        }
      }
      for (let j = 0; j < consumeOperators.length; j++) {
        let target = consumeOperators[j];
        if (target) {
          showOperators.push(target.name);
          operators.push(String(target.id));
        }
      }
      for (let index = 0; index < productItems.length; index++) {
        let target = productItems[index];
        if (String(target.id) === String(productId) && String(target.accid) === String(productAccId)) {
          let residue = Number(target.residueTimes) - Number(consumeTimes);
          let consume = Number(Number(target.consumeTimes) + Number(consumeTimes));
          if (residue >= 0) {
            target.residueTimes = residue;
            target.consumeTimes = consume;
          }
          target.materials.push(showMaterials);
          target.operators.push(showOperators);
          if (target.isMutiProject) {
            let subProject = target.subProject;
            if (subProject && subProject.length > 0) {
              for (let s = 0; s < subProject.length;s++) {
                let sub = subProject[s];
                if (String(sub.id) === String(self.currentSubProject.id)) {
                  let lefttimes = Number(sub.lefttimes) - Number(consumeTimes);
                  if (residue >= 0) {
                    sub.lefttimes = lefttimes;
                    subs.push(sub);
                  }
                }
              }
            }
          }
        }
      }
      let temp = {id: currentSelectedProduct.id, fullnm: currentSelectedProduct.name, accid: currentSelectedProduct.accid, originPrice: currentSelectedProduct.originPrice, singlePrice: currentSelectedProduct.singlePrice, type: currentSelectedProduct.type, atimes: currentSelectedProduct.atimes, materials: materials, operators: operators, consumeTimes: consumeTimes, subs: subs};
      self.consume.changeProductItem.push(temp);
      self.flag.pFlag = false;
    }
  },
  beforeRouteLeave (to, from, next) {
    let path = to.path;
    if (String(path) === '/home') {
      this.reset();
      this.$store.commit('RESETSALEABOUT');
    }
    next(true);
  },
  methods: {
    formatDate (value) {
      return (value && String(value).length === 1) ? '0' + value : value;
    },
    open (picker) {
      this.$refs[picker].open();
    },
    handleChange () {
      let result = '';
      let value = this.datepicker.value;
      if (value) {
        let year = value.getFullYear();
        let month = this.formatDate(Number(value.getMonth() + 1));
        let day = this.formatDate(value.getDate());
        result = year + '-' + month + '-' + day;
      }
      this.consume.date = result;
    },
    reset () {
      this.consume = {
        date: '请选择时间',
        customer: {
          id: 0,
          name: '请选择客户',
          storeName: ''
        },
        productItems: [],
        changeProductItem: []
      };
      this.productItems = [];
    },
    initData (customer) {
      var self = this;
      if (customer.id > 0) {
        let url = host + 'market/' + customer.id + '/customeraccount?type=2&residue=1';
        self.$http.get(url).then(function (response) {
          var target = response.data;
          if (target) {
            self.productItems = [];
            let tempArray = [];
            let mpRelative = {};
            let data = target.data;
            if (data) {
              let customerAccountList = data.productList;
              let saleRecordInfo = data.saleRecordInfo;
              let mutiProject = data.mutiProject;
              if (customerAccountList.length > 0) {
                for (let index = 0;index < customerAccountList.length; index++) {
                  let subProject = [];
                  let ca = customerAccountList[index];
                  if (ca) {
                    tempArray.push(ca);
                    if (mutiProject) {
                      for (let index = 0; index < mutiProject.length; index++) {
                        let subp = mutiProject[index];
                        if (subp && String(subp.accId) === String(ca.id)) {
                          subProject.push(subp);
                        }
                      }
                      mpRelative['_' + ca.id] = subProject;
                    }
                  }
                }
                for (let i = 0; i < tempArray.length; i++) {
                  let isMutiProject = false;
                  let targetSaleRecordInfo = {
                    originPrice: 0,
                    singlePrice: 0
                  };
                  let ca = tempArray[i];
                  let consumeTimes = Number(Number(ca.atimes) - Number(ca.lefttimes));
                  for (let key in saleRecordInfo) {
                    if (key) {
                      let keys = String(key).split('_');
                      if (String(keys[0]) === String(ca.id) && String(keys[1]) === String(ca.acctp) &&
                        String(keys[2]) === String(ca.recid)) {
                        let value = saleRecordInfo[key];
                        if (!value) {
                          targetSaleRecordInfo.originPrice = 0;
                          targetSaleRecordInfo.singlePrice = 0;
                        } else {
                          let values = String(value).split('_');
                          targetSaleRecordInfo.originPrice = values[0];
                          targetSaleRecordInfo.singlePrice = values[1];
                        }
                      }
                    }
                  }
                  let subProject = mpRelative['_' + ca.id];
                  if (subProject && subProject.length > 0) {
                    isMutiProject = true;
                  } else {
                    isMutiProject = false;
                  }
                  let temp = {accid: ca.id, id: ca.recid, fullnm: ca.name, residueTimes: ca.lefttimes, type: ca.acctp, originPrice: targetSaleRecordInfo.originPrice, singlePrice: targetSaleRecordInfo.singlePrice, atimes: ca.atimes, isMutiProject: isMutiProject, subProject: subProject, consumeTimes: consumeTimes, materials: [], operators: [], isShowSubProject: false, icon: 'fa fa-chevron-right'};
                  self.productItems.push(temp);
                }
              } else {
                Toast({message: '没有相关数据', position: 'middle', duration: 2000});
              }
            } else {
              Toast({message: '没有相关数据', position: 'middle', duration: 2000});
            }
          }
        }, function (response) {
        });
      }
    },
    showSub (productItem) {
      if (productItem.isMutiProject) {
        productItem.isShowSubProject = !productItem.isShowSubProject;
      }
      if (productItem.isShowSubProject) {
        productItem.icon = 'fa fa-chevron-down';
      } else {
        productItem.icon = 'fa fa-chevron-right';
      }
    },
    back () {
      router.push({path: '/home'});
    },
    loadUserSale (targetComponent) {
      this.flag.pFlag = false;
      if (targetComponent) {
        if (targetComponent === 'chooseUser') {
          this.$store.commit('SETORIGIN', 'consume');
        }
        router.push({path: '/' + targetComponent});
      }
    },
    submitConsumeRecord () {
      let regex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/g;
      let date = this.consume.date;
      let dateTestResult = regex.test(date);
      let customer = this.consume.customer;
      let changeProductItem = this.consume.changeProductItem;
      if (dateTestResult && customer.id > 0 && String(customer.name).indexOf('请选择客户') < 0 && customer.storeName) {
        let totalMoney = 0;
        let url = host + 'market/userRecord/add';
        let userRecord = JSON.stringify(changeProductItem);
        if (changeProductItem && changeProductItem.length > 0) {
          for (let index = 0; index < changeProductItem.length; index++) {
            let target = changeProductItem[index];
            totalMoney = Number(totalMoney + target.consumeTimes * target.singlePrice);
          }
        }
        let data = {consumerId: customer.id, product: userRecord, totalMoney: totalMoney, date: date};
        this.$http.post(url, data, {
          emulateJSON: true
        }).then(function (response) {
          var target = response.data;
          if (target.code === '100') {
            Toast({message: '提交成功', iconClass: 'icon icon-success', position: 'middle', duration: 2000});
            this.back();
          } else {
            MessageBox({title: '', message: '后台异常, 保存失败'});
          }
        }, function (response) {
        });
      } else if (!dateTestResult) {
        MessageBox({title: '', message: '请选择时间'});
      } else {
        MessageBox({title: '', message: '请选择客户'});
      }
    },
    addConsume (productItem, subProject) {
      let self = this;
      self.flag.pFlag = true;
      let currentSubProject = self.currentSubProject;
      let currentSelectedProduct = self.currentSelectedProduct;
      let residueTimes = window.parseInt(productItem.residueTimes);
      let consumeTimes = window.parseInt(productItem.consumeTimes);
      currentSelectedProduct.accid = productItem.accid;
      currentSelectedProduct.id = productItem.id;
      currentSelectedProduct.name = productItem.name;
      currentSelectedProduct.maxTims = residueTimes;
      currentSelectedProduct.consumeTimes = consumeTimes;
      currentSelectedProduct.residueTimes = residueTimes;
      currentSelectedProduct.type = productItem.type;
      currentSelectedProduct.atimes = productItem.atimes;
      currentSelectedProduct.singlePrice = productItem.singlePrice;
      currentSelectedProduct.originPrice = productItem.originPrice;
      if (subProject) {
        currentSubProject.id = subProject.id;
        currentSubProject.lefttimes = subProject.lefttimes;
        residueTimes = subProject.lefttimes;
      }
      self.$store.commit('SETSELECTPRODUCTINFO', String(productItem.id));
      router.push({name: 'addConsume', params: {productItemInfo: residueTimes}});
    }
  }
};
</script>

<style lang="scss" scoped>
.none {
  display: none;
}
.table {
  border: none;
  thead {
    tr {
      th {
        text-align: left;
      }
    }
  }
  tbody.table-data {
    ul.table-data-ul{
      display: block;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      li {
        line-height: 40px;
        list-style: none;
        border: none;
        div {
          float: left;
          display: inline-block;
          .btn-add{
            width: 50px;
            height: 18px;
            font-size: 12px;
            color: #a61e42;
            font-weight: 600;
            background: #fff;
            border: 1px solid #a61e42;
          }
          .fa {
            color: #a61e42;
          }
        }
        div:first-child {
          width: 31%;
        }
        div:nth-child(2) {
          width: 25%;
        }
        div:nth-child(3) {
          width: 25%;
        }
        div.icon-container {
          width: 19%;
          text-align: right;
          span {
            margin: 0 10px;
          }
        }
        div.data-block {
          width: 100%;
          margin: 0;
          padding: 0;
          .table {
            color: #363636;
            border: none;
            tr {
              td {
                margin: 0;
                padding: 0;
                border: none;
              }
              td:first-child {
                width: 31%;
                padding-left: 25px;
              }
              td:last-child {
                text-align: center;
              }
            }
            tr:last-child {
              border-bottom: 1px solid #ddd;
            }
          }
        }
        div.material-list {
          height: 100%;
          width: 100%;
          ul {
            padding: 0;
            color: #bbb;
            font-size: 12px;
            padding: 0;
            li {
              text-align: left;
              height: 18px;
              border: none;
              margin: 0 0 0 15px;
            }
          }
        }
      }
    }
  }
}
</style>
