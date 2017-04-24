<template>
  <div class="container">
    <mt-header title="退货">
          <router-link to="" slot="left" @click.native="back">
            <mt-button><i class="fa fa-chevron-left"></i></mt-button>
          </router-link>
          <router-link to="" slot="right" @click.native="submitReturnRecord">提交</router-link>
    </mt-header>
    <table class="top-table">
      <thead>
      <tr @click="open('return-picker')">
        <th>日期</th>
        <th>{{returnRecord.date}}</th>
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
      <tr>
        <th colspan="2">销售单</th>
        <th colspan="2"></th>
      </tr>
      </thead>
      <tbody>
      <tr @click="chooseRouter('saleItem')">
        <td colspan="2">{{returnRecord.currentSaleItem.code}}</td>
        <td colspan="2">{{returnRecord.currentSaleItem.date}} <i class="fa fa-chevron-right"></i>
        </td>
      </tr>
      <tr class="tr-color">
        <td>产品项目列表</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr class="special-tr"></tr>
      <tr v-for="returnItem in returnRecord.currentSaleItem.items">
        <td>{{returnItem.fullnm}}<p>剩余次数:{{returnItem.lefttimes}}</p></td>
        <td>单价：{{returnItem.singlePrice}}<p></p></td>
        <td>X{{returnItem.atimes}}<p></p></td>
        <td>{{returnItem.amountDis}}<p><mt-button class="btn-add btn-return" @click="returnGoods(returnItem)">退货</mt-button></p></td>
      </tr>
      <tr class="tr-color">
        <td style="text-align:left;border-bottom:1px solid #dddddd" colspan="4">现金差价：<input type="text" placeholder="请填写金额" v-model="returnRecord.cashPay" class="input-color" ></td>
      </tr>
      <tr class="tr-color">
        <td  style="text-align:left" class="left" colspan="4">储蓄卡差价：<input type="text" v-model="returnRecord.cardPay" placeholder="请填写金额" class="input-color"></td>
      </tr>
      <tr>
        <td  style="text-align:left" class="left" colspan="4">退货原因：<input type="text" v-model="returnRecord.reason" ></td>
      </tr>
      </tbody>
    </table>
     <mt-datetime-picker
      ref="return-picker"
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
import {Toast} from 'mint-ui';
import { MessageBox } from 'mint-ui';
import date from '../common/date';
import router from '../../router/index.js';
import {host} from '../../common/js/const';
export default {
  components: {
    date
  },
  data () {
    return {
      datepicker: {
        startDate: null,
        endDate: null,
        value: ''
      },
      saleRecord: {
        currentConsumer: {
          id: 0,
          name: '客户姓名',
          storeName: '所属门店'
        }
      },
      returnRecord: {
        date: '请选择时间',
        cashPay: '',
        cardPay: '',
        reason: '',
        currentSaleItem: {
          number: 0,
          code: '请选择销售单',
          date: '日期',
          items: [],
          accIdList: []
        },
        changeProductItem: []
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
      this.returnRecord.date = result;
    },
    initData () {
      let self = this;
      let currentConsumer = self.saleRecord.currentConsumer;
      let currentSaleItem = self.returnRecord.currentSaleItem;
      let currentConsumerInfo = self.$store.getters.getCurrentConsumerInfo;
      let currentSaleRecord = self.$store.getters.getCurrentSaleForm;
      let newSaleRecord = self.$store.getters.getSaleRecord;
      if (typeof newSaleRecord === 'object') {
        let customer = newSaleRecord[0];
        // let items = newSaleRecord[1];
        let saleRecordOB = newSaleRecord[2];
        let accIdList = newSaleRecord[3];
        let saleDetails = newSaleRecord[4];
        self.saleRecord.currentConsumer.id = customer.number ;
        self.saleRecord.currentConsumer.name = customer.name;
        self.saleRecord.currentConsumer.storeName = customer.storeName;
        self.returnRecord.currentSaleItem.number = saleRecordOB.id;
        self.returnRecord.currentSaleItem.code = saleRecordOB.code;
        let accId = accIdList.join('-');
        self.getReturnOrigin(saleDetails, accId);
        self.$store.commit('SETSALERECORD', undefined);
      } else {
        if (typeof currentConsumerInfo === 'string') {
          let infoes = String(currentConsumerInfo).split('-');
          currentConsumer.id = window.parseInt(infoes[0]);
          currentConsumer.name = infoes[1];
          currentConsumer.storeName = infoes[2];
        }
        if (typeof currentSaleRecord === 'object') {
          let accId = '';
          currentSaleItem.number = currentSaleRecord.id;
          currentSaleItem.code = currentSaleRecord.code;
          currentSaleItem.date = currentSaleRecord.date;
          let saleRecord = currentSaleRecord.saleRecord;
          if (saleRecord) {
            for (let index = 0; index < saleRecord.length; index++) {
              let target = saleRecord[index];
              if (target) {
                if (index === saleRecord.length - 1) {
                  accId = accId + target.accid;
                } else {
                  accId = accId + target.accid + '-';
                }
              }
            }
          }
          self.getReturnOrigin(saleRecord, accId);
        }
      }
    },
    getReturnOrigin (saleRecord, accId) {
      let self = this;
      let url = host + 'market/consumer/customeraccount';
      let params = '?idList=' + accId;
      self.$http.get(url + params, {
        emulateJSON: true
      }).then(function (response) {
        let target = response.data;
        if (target.code === '100') {
          let data = target.data;
          if (data) {
            let items = [];
            let productList = data.productList;
            for (let index = 0; index < productList.length; index++) {
              let product = productList[index];
              for (let i = 0; i < saleRecord.length; i++) {
                let sr = saleRecord[i];
                if (String(sr.accid === product.id) && String(sr.prdtp) === String(product.acctp) && String(sr.prdid) === String(product.recid)) {
                  let temp = {id: sr.prdid, accid: product.id, fullnm: product.name, lefttimes: product.lefttimes, atimes: product.atimes, originPrice: sr.price4, singlePrice: sr.price5, amountDis: sr.price5 * sr.quantity, type: sr.prdtp, quantity: sr.quantity};
                  items.push(temp);
                }
              }
            }
            self.returnRecord.currentSaleItem.items = items;
          }
        }
      }, function (response) {
      });
    },
    reset () {
      this.saleRecord = {
        currentConsumer: {
          id: 0,
          name: '客户姓名',
          storeName: '所属门店'
        }
      };
      this.returnRecord = {
        date: '请选择时间',
        cashPay: '',
        cardPay: '',
        reason: '',
        currentSaleItem: {
          number: 0,
          date: '日期',
          code: '请选择销售单',
          items: []
        },
        changeProductItem: []
      };
    },
    back () {
      router.push({path: '/home'});
    },
    returnGoods (item) {
      let residue = window.parseInt(item.lefttimes);
      if (residue > 0) {
        let message = '退货次数范围为1~' + residue;
        MessageBox.prompt(message, '请输入退货次数').then(({ value, action }) => {
          let times = window.parseInt(value);
          if (action === 'confirm' && times >= 0 && times <= residue) {
            let temp = {id: item.id, product: item, returnGoodsTimes: times};
            this.returnRecord.changeProductItem.push(temp);
            item.lefttimes = item.lefttimes - times;
          } else if (times < 0 || times > residue) {
            Toast({message: message, position: 'middle', duration: 2000});
          }
        });
      } else {
        Toast({message: '剩余次数为0, 无法执行该操作', position: 'middle', duration: 2000});
      }
    },
    chooseRouter (type) {
      if (type === 'saleItem') {
        let currentConsumer = this.saleRecord.currentConsumer;
        if (currentConsumer.id > 0 && String(currentConsumer.name).indexOf('客户姓名') < 0) {
          router.push({name: 'saleItem', params: {customerId: this.saleRecord.currentConsumer.id, state: -1, residue: 1}});
        } else {
          MessageBox({title: '', message: '请选择客户'});
        }
      }
      if (type === 'chooseUser') {
        this.$store.commit('SETORIGIN', 'returns');
        router.push({name: 'chooseUser'});
      }
    },
    submitReturnRecord () {
      let cardPay = 0;
      let cashPay = 0;
      let regex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/g;
      let returnRecord = this.returnRecord;
      let date = returnRecord.date;
      let saleRecord = this.saleRecord;
      let currentConsumer = saleRecord.currentConsumer;
      let consumerId = currentConsumer.id;
      if (returnRecord.cashPay) {
        cashPay = window.parseInt(returnRecord.cashPay);
      }
      if (returnRecord.cardPay) {
        cardPay = window.parseInt(returnRecord.cardPay);
      }
      let dateTestResult = regex.test(date);
      if (dateTestResult && cashPay >= 0 && cardPay >= 0 && consumerId > 0 && String(currentConsumer.name).indexOf('客户姓名') < 0) {
        let url = host + 'market/returnRecord/add';
        let tempReturnRecord = [];
        for (let index = 0; index < returnRecord.changeProductItem.length; index++) {
          let target = returnRecord.changeProductItem[index].product;
          let times = returnRecord.changeProductItem[index].returnGoodsTimes;
          if (target) {
            let temp = {id: target.id, fullnm: target.fullnm, type: target.type, amount: target.quantity, times: target.atimes, consumeTimes: times, accid: target.accid, lefttimes: target.lefttimes, singlePrice: target.singlePrice, originPrice: target.originPrice};
            tempReturnRecord.push(temp);
          }
        }
        let tempReturnRecordJSON = JSON.stringify(tempReturnRecord);
        let data = {consumerId: String(consumerId), product: tempReturnRecordJSON, cardPay: String(cardPay), cashPay: String(cashPay), reason: returnRecord.reason, date: date};
        this.$http.post(url, data, {emulateJSON: true}).then(function (response) {
          let target = response.data;
          if (target.code === '100') {
            this.$store.commit('RESETSALEABOUT');
            Toast({message: '退货成功', position: 'middle', duration: 1000, iconClass: 'icon icon-success'});
            this.back();
          } else {
            MessageBox({title: '', message: '服务器异常，退货提交失败'});
          }
        }, function (response) {
        });
      } else if (!dateTestResult) {
        MessageBox({title: '', message: '请选择时间'});
      } else if (consumerId === 0 && String(currentConsumer.name).indexOf('客户姓名') >= 0) {
        MessageBox({title: '', message: '请选择客户'});
      }
    }
  }
};
</script>

<style lang="scss" scoped>
mint-msgbox-confirm,.mint-msgbox-btn{
  color: #a71e42 !important;
}
.table{
    .tr-color{
      background: #efefef;
    }
    .special-tr {
      height: 30px;
    }
    .input-color{
      background: #efefef;
    }
    td{
      padding:0;
      border-bottom: none;
      height:40px;
      p{
        border-bottom: 1px solid #dddddd;
        width: 100%;
        height: 40px;
      }
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
      width:60px;
      height: 18px;
      font-size: 12px;
      color: #a61e42;
      font-weight: 600;
      background: #ffffff;
      border: 1px solid #a61e42;
    }
    .btn-return{
      float: right;
      margin-top: 12px;
    }

}
</style>
