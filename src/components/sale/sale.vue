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
      <tr @click="open('sale-picker')">
        <th>日期</th>
        <th>{{saleRecord.date}}</th>
      </tr>
      <tr>
        <th>客户</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr @click="chooseRouter('chooseUser')">
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
        <tr class="tr-swipe" v-for="(consult, index) in saleRecord.consults">
          <mt-cell-swipe
            @touchmove.native="selectSwipe('consult', index)"
            :right="[{
              content: '取消',
              style: { background: 'lightgray', color: '#fff' }
            },
            {
              content: '删除',
              style: { background: 'red', color: '#fff' },
              handler: () => rightButtonHandler()
            }]"
            :title="consult.username">
            <span>{{consult.identify}}</span>
          </mt-cell-swipe>
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
        <tr class="tr-swipe" v-for="(sale, index) in saleRecord.sales">
          <mt-cell-swipe
            @touchmove.native="selectSwipe('sale', index)"
            :right="[{
              content: '取消',
              style: { background: 'lightgray', color: '#fff' }
            },
            {
              content: '删除',
              style: { background: 'red', color: '#fff' },
              handler: () => rightButtonHandler()
            }]"
            :title="sale.username">
            <span>{{sale.identify}}</span>
          </mt-cell-swipe>
        </tr>
      </tbody>
    </table>
    <mt-datetime-picker
      ref="sale-picker"
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
import date from '../common/date';
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
      datepicker: {
        startDate: null,
        endDate: null,
        value: ''
      },
      swipe: {
        sale: {
          isSelect: false,
          saleIndex: -1
        },
        consult: {
          isSelect: false,
          consultIndex: -1
        }
      },
      saleRecord: {
        date: '请选择时间',
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
  created () {
    let self = this;
    let now = new Date();
    let startDate = new Date(1990, 0, 1);
    self.datepicker.startDate = startDate;
    self.datepicker.endDate = now;
    self.datepicker.value = now.getFullYear() + '-' + Number(now.getMonth() + 1) + '-' + now.getDate();
  },
  activated () {
    this.initData();
  },
  beforeRouteLeave (to, from, next) {
    let path = to.path;
    if (String(path) === '/home') {
      this.reset();
      this.$store.commit('RESETSALEABOUT');
    }
    next(true);
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
      this.saleRecord.date = result;
    },
    initData () {
      let self = this;
      let currentConsumerInfo = self.$store.getters.getCurrentConsumerInfo;
      let storeProductItemsInfo = self.$store.getters.getSelectProductItemsInfo;
      let storeConsultsInfo = self.$store.getters.getSelectConsultInfo;
      let storeSalesInfo = self.$store.getters.getSelectSaleInfo;
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
        let temp = {id: result[0], name: result[1], singlePrice: result[2], times: result[3], sumPrice: result[4], amount: result[5], type: result[6], projtp: result[7], originPrice: result[8]};
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
        date: '请选择时间',
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
      router.push({path: '/home'});
    },
    selectSwipe (type, index) {
      let sale = this.swipe.sale;
      let consult = this.swipe.consult;
      if (type === 'consult') {
        consult.isSelect = true;
        consult.consultIndex = index;
        sale.isSelect = false;
        sale.saleIndex = -1;
      } else if (type === 'sale') {
        sale.isSelect = true;
        sale.saleIndex = index;
        consult.isSelect = false;
        consult.consultIndex = -1;
      }
    },
    rightButtonHandler() {
      let sale = this.swipe.sale;
      let consult = this.swipe.consult;
      let consults = this.saleRecord.consults;
      let sales = this.saleRecord.sales;
      if (sale.isSelect) {
        sales.splice(sale.saleIndex, 1);
      } else if (consult.isSelect) {
        consults.splice(consult.consultIndex, 1);
      }
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
      if (type === 'chooseUser') {
        this.$store.commit('SETORIGIN', 'sale');
        router.push({name: 'chooseUser'});
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
      let saleRecord = this.saleRecord;
      let regex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/g;
      if (saleRecord.total) {
        total = window.parseInt(saleRecord.total);
      }
      if (saleRecord.cashPay) {
        cashPay = window.parseInt(saleRecord.cashPay);
      }
      if (saleRecord.cardPay) {
        cardPay = window.parseInt(saleRecord.cardPay);
      }
      let date = saleRecord.date;
      let dateTestResult = regex.test(date);
      let consumerId = saleRecord.currentConsumer.number;
      let consumerName = saleRecord.currentConsumer.name;
      let consumerStore = saleRecord.currentConsumer.storeName;
      let consults = saleRecord.consults;
      let sales = saleRecord.sales;
      let productItems = saleRecord.productItems;
      let saleRecordObject = [saleRecord.currentConsumer, productItems];
      if (dateTestResult && total >= 0 && cashPay >= 0 && cardPay >= 0 && String(consumerName).indexOf('客户姓名') < 0 && String(consumerStore).indexOf('所属门店') < 0 && productItems && productItems.length > 0 && cardPay + cashPay <= total && consumerId > 0) {
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
          let temp = {id: target.id, fullnm: target.name, singlePrice: target.singlePrice, times: target.times, sumPrice: target.sumPrice, amount: target.amount * target.times, type: target.type, projtp: target.projtp, originPrice: target.originPrice};
          productItemList.push(temp);
        }
        let data = {consumerId: String(consumerId), realPrice: this.allProductItemSumPrice, price: String(total), cardPay: String(cardPay), cashPay: String(cashPay), saleId: saleId, consultId: consultId, product: JSON.stringify(productItemList), date: date};
        this.$http.post(url, data, {
          emulateJSON: true
        }).then(function (response) {
          let target = response.data;
          if (target.code === '100') {
            let saleRecord = target.data.saleRecord;
            let accIdList = target.data.accIdList;
            let saleDetails = target.data.saleDetails;
            router.push({name: 'saleSubmit', params: {saleRecordId: saleRecord.code}});
            saleRecordObject.push(saleRecord);
            saleRecordObject.push(accIdList);
            saleRecordObject.push(saleDetails);
            this.$store.commit('SETSALERECORD', saleRecordObject);
            this.$store.commit('RESETSALEABOUT');
            this.reset();
          } else {
            MessageBox({title: '', message: '服务器异常，订单提交失败'});
          }
        }, function (response) {
        });
      } else if (!dateTestResult) {
        MessageBox({title: '', message: '时间不可为空，请选择时间'});
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
    td {
      padding:0 10px;
      border-bottom: 1px solid #dddddd;
      a:-webkit-any-link{
        color: #000000 !important;
      }
    }
    td:first-child{
      width: 40%;
      text-align:left;
    }
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
table:last-child {
  tbody {
    .tr-swipe {
      div.mint-cell-value {
        span {
          padding-right: 18px;
        }
      }
    }
  }
}
</style>
