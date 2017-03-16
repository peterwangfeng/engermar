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
      <tr>
        <th colspan="2">销售单</th>
        <th colspan="2"></th>
      </tr>
      </thead>
      <tbody>
      <tr @click="chooseRouter('saleItem')">
        <td colspan="2">{{returnRecord.currentSaleItem.number}}</td>
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
        <td>{{returnItem.prdnm}}<p>剩余次数:{{returnItem.atimes - returnItem.utimes}}</p></td>
        <td>单价：{{returnItem.price5}}<p></p></td>
        <td>X{{returnItem.atimes}}<p></p></td>
        <td>{{returnItem.atimes * returnItem.price5}}<p><mt-button class="btn-add btn-return" @click="returnGoods(returnItem)">退货</mt-button></p></td>
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
  </div>
</template>

<script>
import {Toast} from 'mint-ui';
import { MessageBox } from 'mint-ui';
import date from './date';
import router from '../../router/index.js';
import {host} from '../../common/js/const';
export default {
  components: {
    date
  },
  data () {
    return {
      saleRecord: {
        currentConsumer: {
          id: 0,
          name: '客户姓名',
          storeName: '所属门店'
        }
      },
      returnRecord: {
        cashPay: '',
        cardPay: '',
        reason: '',
        currentSaleItem: {
          number: '请选择销售单',
          date: '日期',
          items: []
        },
        changeProductItem: []
      }
    };
  },
  activated () {
    this.initData();
  },
  methods: {
    initData () {
      var self = this;
      var currentConsumerInfo = self.$store.getters.getCurrentConsumerInfo;
      var currentSaleRecord = self.$store.getters.getCurrentSaleForm;
      if (typeof currentConsumerInfo === 'string') {
        let infoes = String(currentConsumerInfo).split('-');
        self.saleRecord.currentConsumer.id = window.parseInt(infoes[0]);
        self.saleRecord.currentConsumer.name = infoes[1];
        self.saleRecord.currentConsumer.storeName = infoes[2];
      } else {
        self.saleRecord.currentConsumer.id = 0;
        self.saleRecord.currentConsumer.name = '请选择客户';
        self.saleRecord.currentConsumer.storeName = '';
      }
      if (typeof currentSaleRecord === 'object') {
        self.returnRecord.currentSaleItem.number = currentSaleRecord.id;
        self.returnRecord.currentSaleItem.date = currentSaleRecord.date;
        self.returnRecord.currentSaleItem.items = currentSaleRecord.saleRecord;
      } else {
        self.returnRecord.currentSaleItem.number = '请选择销售单';
      }
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
        cashPay: '',
        cardPay: '',
        reason: '',
        currentSaleItem: {
          number: '请选择销售单',
          date: '日期',
          items: []
        },
        changeProductItem: []
      };
    },
    back () {
      this.reset();
      this.$store.commit('RESETSALEABOUT');
      router.push({path: '/home'});
    },
    returnGoods (item) {
      let residue = window.parseInt(item.atimes - item.utimes);
      let message = '退货次数范围为0~' + residue;
      MessageBox.prompt(message, '请输入退货次数').then(({ value, action }) => {
        let times = window.parseInt(value);
        if (action === 'confirm' && times >= 0 && times <= residue) {
          this.returnGoodsTimes = times;
          let temp = {id: item.id, product: item, returnGoodsTimes: times};
          this.returnRecord.changeProductItem.push(temp);
          item.atimes = item.atimes - times;
        } else if (times < 0 || times > residue) {
          Toast({message: message, position: 'middle', duration: 2000});
        }
      });
    },
    chooseRouter (type) {
      if (type === 'saleItem') {
        let currentConsumer = this.saleRecord.currentConsumer;
        if (currentConsumer.id > 0 && String(currentConsumer.name).indexOf('客户姓名') < 0) {
          router.push({name: 'saleItem', params: {customerId: this.saleRecord.currentConsumer.id, state: -1}});
        } else {
          MessageBox({title: '', message: '请选择客户'});
        }
      }
      if (type === 'chooseUserSale') {
        router.push({path: '/chooseUserSale'});
      }
    },
    submitReturnRecord () {
      let cardPay = 0;
      let cashPay = 0;
      var returnRecord = this.returnRecord;
      var saleRecord = this.saleRecord;
      var currentSaleItem = returnRecord.currentSaleItem;
      var currentConsumer = saleRecord.currentConsumer;
      var consumerId = currentConsumer.id;
      if (returnRecord.cashPay) {
        cashPay = window.parseInt(returnRecord.cashPay);
      }
      if (returnRecord.cardPay) {
        cardPay = window.parseInt(returnRecord.cardPay);
      }
      if (cashPay >= 0 && cardPay >= 0 && consumerId > 0 && String(currentConsumer.name).indexOf('客户姓名') < 0) {
        let url = host + 'market/returnRecord/add';
        let tempReturnRecord = [];
        for (let index = 0; index < returnRecord.changeProductItem.length; index++) {
          let target = returnRecord.changeProductItem[index].product;
          let times = returnRecord.changeProductItem[index].returnGoodsTimes;
          if (target) {
            let temp = {id: target.prdid, fullnm: target.prdnm, type: target.prdtp, deptId: target.deptid, amount: target.quantity, times: target.atimes, consumeTimes: times};
            tempReturnRecord.push(temp);
          }
        }
        let tempReturnRecordJSON = JSON.stringify(tempReturnRecord);
        let data = {consumerId: String(consumerId), saleRecordId: currentSaleItem.number, returnRecord: tempReturnRecordJSON, cardPay: String(cardPay), cashPay: String(cashPay), reason: returnRecord.reason};
        this.$http.post(url, data, {emulateJSON: true}).then(function (response) {
          var target = response.data;
          if (target.code === '100') {
            this.$store.commit('RESETSALEABOUT');
            MessageBox({message: '退货成功'}).then(action => {
              this.back();
            });
          } else {
            MessageBox({title: '', message: '服务器异常，退货提交失败'});
          }
        }, function (response) {
        });
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
