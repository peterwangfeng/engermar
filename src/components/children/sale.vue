<template>
  <div class="container">
    <mt-header title="销售">
      <router-link to="" slot="left" @click.native="back">
        <mt-button><i class="fa fa-chevron-left"></i></mt-button>
      </router-link>
      <router-link to="" slot="right" @click.native="submitSaleRecord">提交</router-link>
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
      <tr @click="chooseRouter('chooseUserSale')">
        <td>{{saleRecord.currentConsumer.name}}</td>
        <td>{{saleRecord.currentConsumer.storeName}} <i class="fa fa-chevron-right"></i></td>
      </tr>
      </tbody>
    </table>
    <table class="table">
      <thead>
      <tr @click="chooseRouter('productItem')">
        <th colspan="2">产品项目</th>
        <th colspan="2">
          <img class="img-plus" src="../../assets/plus.png">
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in saleRecord.productItems">
        <td class="item-name">{{item.name}}</td>
        <td class="item-singlePrice">单价：{{item.singlePrice}}</td>
        <td class="item-amount">X{{item.times}}</td>
        <td class="item-sumPrice">共：{{item.sumPrice}}</td>
      </tr>
      <tr>
        <td colspan="4" class="all-sumPrice">总价：{{allProductItemSumPrice}}</td>
      </tr>
      <tr>
        <td colspan="4">应收总价：<input type="text" placeholder="请填写金额" v-model="saleRecord.total"></td>
      </tr>
      <tr>
        <td colspan="4">现金支付：<input type="text" placeholder="请填写金额" v-model="saleRecord.cashPay"></td>
      </tr>
      <tr>
        <td colspan="4">储蓄卡支付：<input type="text" placeholder="请填写金额" v-model="saleRecord.cardPay"></td>
      </tr>
      </tbody>
    </table>
    <table class="table">
      <thead>
      <tr @click="selectEmployee('chooseCounselor')">
        <th>咨询师</th>
        <th>
          <img class="img-plus" src="../../assets/plus.png">
        </th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="consult in saleRecord.consults">
          <td v-text="consult.username"></td>
          <td v-text="consult.identify"></td>
        </tr>
      </tbody>
    </table>
    <table class="table">
      <thead>
      <tr @click="selectEmployee('chooseSaler')">
        <th>销售</th>
        <th>
          <img class="img-plus" src="../../assets/plus.png">
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="sale in saleRecord.sales">
        <td v-text="sale.username"></td>
        <td v-text="sale.identify"></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import date from './date';
import {host} from '../../common/js/const';
import router from '../../router/index';
import { MessageBox } from 'mint-ui';
export default {
  components: {
    date
  },
  data () {
    return {
      flag: {
        sFlag: false,
        cFlag: false,
        pFlag: false
      },
      saleRecord: {
        total: '',
        realTotal: 0,
        cashPay: '',
        cardPay: '',
        currentConsumer: {
          number: 0,
          name: '客户姓名',
          storeName: '所属门店',
          isExist: false
        },
        productItems: [],
        sales: [],
        consults: []
      },
      classObject: {
        classA: 'none'
      }
    };
  },
  activated () {
    this.initData();
  },
  computed: {
    allProductItemSumPrice: function () {
      let sumPrice = '';
      for (let index = 0; index < this.saleRecord.productItems.length; index++) {
        let productItem = this.saleRecord.productItems[index];
        if (sumPrice === '') {
          sumPrice = 0;
        }
        sumPrice = window.parseInt(productItem.sumPrice) + window.parseInt(sumPrice);
      }
      this.saleRecord.total = this.saleRecord.realTotal = sumPrice;
      return sumPrice;
    }
  },
  methods: {
    initData () {
      var self = this;
      var currentConsumerInfo = self.$store.getters.getCurrentConsumerInfo;
      var storeProductItemsInfo = self.$store.getters.getSelectProductItemsInfo;
      var storeConsultsInfo = self.$store.getters.getSelectConsultInfo;
      var storeSalesInfo = self.$store.getters.getSelectSaleInfo;
      if (typeof currentConsumerInfo === 'string') {
        let infoes = String(currentConsumerInfo).split('-');
        self.saleRecord.currentConsumer.isExist = true;
        self.saleRecord.currentConsumer.number = infoes[0];
        self.saleRecord.currentConsumer.name = infoes[1];
        self.saleRecord.currentConsumer.storeName = infoes[2];
      } else {
        self.saleRecord.currentConsumer.name = '请选择客户';
        self.saleRecord.currentConsumer.storeName = '';
      }
      if (typeof storeProductItemsInfo === 'string' && self.flag.pFlag) {
        let result = String(storeProductItemsInfo).split('_');
        var temp = {id: result[0], name: result[1], singlePrice: result[2], times: result[3], sumPrice: result[4], amount: result[5], type: result[6]};
        self.saleRecord.productItems.push(temp);
        self.flag.pFlag = false;
      }
      if (typeof storeSalesInfo === 'string' && self.flag.sFlag) {
        let sales = self.saleRecord.sales;
        let employeeInfoes = String(storeSalesInfo).split('-');
        let temp = {id: employeeInfoes[0], username: employeeInfoes[1], identify: employeeInfoes[2]};
        if (sales.length > 0) {
          let flag = false;
          for (let index = 0; index < sales.length; index++) {
            let target = sales[index];
            if (window.parseInt(target.id) === window.parseInt(employeeInfoes[0])) {
              flag = true;
              break;
            }
          }
          if (!flag) {
            sales.push(temp);
          }
        } else {
          sales.push(temp);
        }
        self.flag.sFlag = false;
      }
      if (typeof storeConsultsInfo === 'string' && self.flag.cFlag) {
        let consults = self.saleRecord.consults;
        let employeeInfoes = String(storeConsultsInfo).split('-');
        let temp = {id: employeeInfoes[0], username: employeeInfoes[1], identify: employeeInfoes[2]};
        if (consults.length > 0) {
          let flag = false;
          for (let index = 0; index < consults.length; index++) {
            let target = consults[index];
            if (window.parseInt(target.id) === window.parseInt(employeeInfoes[0])) {
              flag = true;
              break;
            }
          }
          if (!flag) {
            consults.push(temp);
          }
        } else {
          consults.push(temp);
        }
        self.flag.cFlag = false;
      }
    },
    reset () {
      this.saleRecord = {
        total: '',
        realTotal: '',
        cashPay: '',
        cardPay: '',
        currentConsumer: {
          number: 0,
          name: '客户姓名',
          storeName: '所属门店',
          isExist: false
        },
        productItems: [],
        sales: [],
        consults: []
      };
    },
    back () {
      this.reset();
      this.$store.commit('RESETSALEABOUT');
      router.push({path: '/home'});
    },
    selectEmployee (type) {
      if (type === 'chooseCounselor') {
        this.flag.cFlag = true;
        router.push({name: 'chooseEmployee', params: {type: 0}});
      } else if (type === 'chooseSaler') {
        this.flag.sFlag = true;
        router.push({name: 'chooseEmployee', params: {type: 1}});
      }
    },
    chooseRouter (type) {
      if (type === 'chooseUserSale') {
        router.push({path: '/chooseUserSale'});
      }
      if (type === 'productItem') {
        this.flag.pFlag = true;
        this.$store.commit('SETCURRENTPRODUCTBTC', 'sale');
        router.push({path: '/productItem'});
      }
    },
    submitSaleRecord () {
      let total = 0;
      let cashPay = 0;
      let cardPay = 0;
      var saleRecord = this.saleRecord;
      if (saleRecord.total) {
        total = window.parseInt(saleRecord.total);
      }
      if (saleRecord.cashPay) {
        cashPay = window.parseInt(saleRecord.cashPay);
      }
      if (saleRecord.cardPay) {
        cardPay = window.parseInt(saleRecord.cardPay);
      }
      var consumerId = saleRecord.currentConsumer.number;
      var consumerName = saleRecord.currentConsumer.name;
      var consumerStore = saleRecord.currentConsumer.storeName;
      var consults = saleRecord.consults;
      var sales = saleRecord.sales;
      var productItems = saleRecord.productItems;
      if (total >= 0 && cashPay >= 0 && cardPay >= 0 && String(consumerName).indexOf('客户姓名') < 0 && String(consumerStore).indexOf('所属门店') < 0 && productItems && productItems.length > 0 && cardPay + cashPay <= total && consumerId > 0) {
        let saleId = '';
        let consultId = '';
        let productItemList = [];
        let url = host + 'market/saleRecord/add';
        for (let index = 0; index < sales.length; index++) {
          let target = sales[index];
          if (index < sales.length - 1) {
            saleId += (target.id + '-');
          } else if (index === sales.length - 1) {
            saleId += target.id;
          }
        }
        for (let index = 0; index < consults.length; index++) {
          let target = consults[index];
          if (index < consults.length - 1) {
            consultId += (target.id + '-');
          } else if (index === consults.length - 1) {
            consultId += target.id;
          }
        }
        for (let index = 0; index < productItems.length; index++) {
          let target = productItems[index];
          let temp = {id: target.id, fullnm: target.name, singlePrice: target.singlePrice, times: target.times, sumPrice: target.sumPrice, amount: target.amount * target.times, type: target.type};
          productItemList.push(temp);
          // if (index < productItems.length - 1) {
          //   productItem = productItem + '{"id": "' + target.id + '", "fullnm": "' + target.name + '", "singlePrice": "' + target.singlePrice + '", "times": "' + target.times + '", "sumPrice": "' + target.sumPrice + '","amount": "' + target.amount * target.times + '", "type":"' + target.type + '"},';
          // } else if (index === productItems.length - 1) {
          //   productItem = productItem + '{"id": "' + target.id + '", "fullnm": "' + target.name + '", "singlePrice": "' + target.singlePrice + '", "times": "' + target.times + '", "sumPrice": "' + target.sumPrice + '", "amount": "' + target.amount * target.times + '", "type":"' + target.type + '"}';
          // }
        }
        // productItem = '[' + productItem + ']';
        let data = {consumerId: String(consumerId), price: String(total), cardPay: String(cardPay), cashPay: String(cashPay), saleId: saleId, consultId: consultId, product: JSON.stringify(productItemList)};
        this.$http.post(url, data, {
          emulateJSON: true
        }).then(function (response) {
          var target = response.data;
          if (target.code === '100') {
            this.$store.commit('RESETSALEABOUT');
            var saleRecord = target.data.saleRecord;
            router.push({name: 'saleSubmit', params: {saleRecordId: saleRecord.id}});
            this.reset();
          } else {
            MessageBox({title: '', message: '服务器异常，订单提交失败'});
          }
        }, function (response) {
        });
      } else if (cardPay + cashPay > total) {
        MessageBox({title: '', message: '应收总价应小于现金与储蓄卡总和'});
      } else {
        MessageBox({title: '', message: '客户、产品项目、咨询师、销售为必选项'});
      }
    }
  }
};
</script>

<style lang="scss">
.none {
  display: none;
}
.top-table{
    border-collapse: collapse;
    border:1px solid #dddddd;
    width:100%;
    font-size:14px;
    margin-bottom: 30px;
    i{
      color:#a61e42;
    }
    th:first-child{
      text-align: left;
      font-weight: normal;
    }
    th:last-child{
      text-align:right;
      font-weight: normal;
    }
    tr{
      padding:0 10px;
      height:40px;
      border-bottom: 1px solid #dddddd;
    }
    td,th{
      padding:0 10px;
      height:40px;
    }
    td{
      background: #efefef;
    }
    td:last-child{
      text-align:right;
    }
    td:first-child{
      text-align:left;
    }
}
.table{
    border-collapse: collapse;
    border:1px solid #dddddd;
    width:100%;
    font-size:14px;
    .item-name{
      padding-right: 0;
    }
    .item-singlePrice,.item-amount{
      padding: 0;
    }
    .item-sumPrice{
      padding-left: 0;
    }
    .all-sumPrice{
      text-align: right !important;
    }
    .img-plus{
      display: block;
      float: right;
    }
    i{
      color:#a71e42;
    }
    th:first-child{
      text-align: left;
    }
    th{
      padding:0 10px;
      height:40px;
      background: #efefef;
      border-bottom: 1px solid #dddddd;
    }
    th:last-child,td:last-child{
      text-align:right;
    }
    tr{
      height:40px;
      line-height:40px;
    }
    td{
      padding:0 10px;
      border-bottom: 1px solid #dddddd;
      a:-webkit-any-link{
        color: #000000 !important;
      }
    }
    td:first-child{
      text-align:left;
    }
}
</style>
