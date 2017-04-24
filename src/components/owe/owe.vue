<template>
  <div class="container">
    <mt-header title="欠单">
      <router-link to="" slot="left" @click.native="back">
        <mt-button><i class="fa fa-chevron-left"></i></mt-button>
      </router-link>
      <router-link to="" slot="right" @click.native="submitOweRecord">提交</router-link>
    </mt-header>
    <table class="top-table">
      <thead>
      <tr>
        <th></th>
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
        <th colspan="2">
        </th>
      </tr>
      </thead>
      <tbody>
      <tr @click="chooseRouter('saleItem')">
        <td colspan="2">{{oweRecord.currentSaleItem.code}}</td>
        <td colspan="2">{{oweRecord.currentSaleItem.date}} <i class="fa fa-chevron-right"></i>
        </td>
      </tr>
      <tr>
        <td colspan="4">欠款金额：{{oweRecord.currentSaleItem.oweMoney}}</td>
      </tr>
      <tr>
        <td colspan="4">现金支付：<input type="text" placeholder="请填写金额" v-model="oweRecord.cashPay"></td>
      </tr>
      <tr>
        <td colspan="4">储蓄卡支付：<input type="text" placeholder="请填写金额" v-model="oweRecord.cardPay"></td>
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
      <tr class="tr-swipe" v-for="(consult, index) in oweRecord.consults">
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
            :title="consult.name">
            <span>{{consult.identify}}</span>
          </mt-cell-swipe>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import router from '../../router/index.js';
import {host} from '../../common/js/const';
import { MessageBox } from 'mint-ui';
import {Toast} from 'mint-ui';
export default {
  data () {
    return {
      flag: {
        cFlag: false
      },
      swipe: {
        consult: {
          isSelect: false,
          consultIndex: -1
        }
      },
      saleRecord: {
        currentConsumer: {
          id: 0,
          name: '客户姓名',
          storeName: '所属门店',
          number: 0
        }
      },
      oweRecord: {
        cashPay: '',
        cardPay: '',
        currentSaleItem: {
          number: 0,
          code: '请选择销售单',
          date: '日期',
          items: [],
          oweMoney: ''
        },
        consults: []
      }
    };
  },
  activated () {
    let self = this;
    let consults = self.oweRecord.consults;
    let currentConsumer = self.saleRecord.currentConsumer;
    let currentSaleItem = self.oweRecord.currentSaleItem;
    let currentConsumerInfo = self.$store.getters.getCurrentConsumerInfo;
    let selectedConsultInfo = self.$store.getters.getSelectConsultInfo;
    let selectedSaleRecord = self.$store.getters.getCurrentSaleForm;
    if (typeof currentConsumerInfo === 'string') {
      let infoes = String(currentConsumerInfo).split('-');
      currentConsumer.id = window.parseInt(infoes[0]);
      currentConsumer.name = infoes[1];
      currentConsumer.storeName = infoes[2];
    } else {
      currentConsumer.name = '请选择客户';
      currentConsumer.storeName = '';
    }
    if (typeof selectedSaleRecord === 'object') {
      currentSaleItem.number = selectedSaleRecord.id;
      currentSaleItem.code = selectedSaleRecord.code;
      currentSaleItem.date = selectedSaleRecord.date;
      currentSaleItem.items = selectedSaleRecord.saleRecord;
      currentSaleItem.oweMoney = selectedSaleRecord.owe;
    } else {
      currentSaleItem.number = '请选择销售单';
    }
    if (typeof selectedConsultInfo === 'string' && self.flag.cFlag) {
      let infoes = String(selectedConsultInfo).split('-');
      let temp = {id: window.parseInt(infoes[0]), name: infoes[1], identity: infoes[2]};
      if (consults.length > 0) {
        let flag = false;
        for (let i = 0; i < consults.length; i++) {
          let target = consults[i];
          if (target) {
            if (target.id === window.parseInt(infoes[0])) {
              flag = true;
              break;
            }
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
  beforeRouteLeave (to, from, next) {
    let path = to.path;
    if (String(path) === '/home') {
      this.destoryData();
    }
    next(true);
  },
  methods: {
    selectSwipe (type, index) {
      let consult = this.swipe.consult;
      if (type === 'consult') {
        consult.isSelect = true;
        consult.consultIndex = index;
      }
    },
    rightButtonHandler() {
      let consult = this.swipe.consult;
      let consults = this.oweRecord.consults;
      if (consult.isSelect) {
        consults.splice(consult.consultIndex, 1);
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
      this.oweRecord = {
        cashPay: '',
        cardPay: '',
        currentSaleItem: {
          number: 0,
          date: '日期',
          code: '请选择销售单',
          oweMoney: 0
        },
        consults: []
      };
    },
    destoryData () {
      this.reset();
      this.$store.commit('RESETSALEABOUT');
    },
    back () {
      router.push({path: '/home'});
    },
    selectEmployee (type) {
      if (type === 'chooseCounselor') {
        this.flag.cFlag = true;
        router.push({name: 'chooseEmployee', params: {type: 0}});
      }
    },
    chooseRouter (type) {
      if (type === 'saleItem') {
        let customer = this.saleRecord.currentConsumer;
        if (customer.id > 0 && String(customer.name).indexOf('客户姓名') < 0) {
          router.push({name: 'saleItem', params: {customerId: this.saleRecord.currentConsumer.id, state: 2, residue: 0}});
        } else {
          MessageBox({title: '', message: '请选择客户'});
        }
      }
      if (type === 'chooseUser') {
        this.$store.commit('SETORIGIN', 'owe');
        router.push({name: 'chooseUser'});
      }
    },
    submitOweRecord () {
      let cashPay = 0;
      let cardPay = 0;
      let saleRecord = this.saleRecord;
      let oweRecord = this.oweRecord;
      let consults = oweRecord.consults;
      let consumerId = window.parseInt(saleRecord.currentConsumer.id);
      let saleRecordId = window.parseInt(oweRecord.currentSaleItem.number);
      if (oweRecord.cashPay) {
        cashPay = window.parseInt(oweRecord.cashPay);
      }
      if (oweRecord.cardPay) {
        cardPay = window.parseInt(oweRecord.cardPay);
      }
      let oweMoney = window.parseInt(oweRecord.currentSaleItem.oweMoney);
      let sumMoney = Number(cashPay + cardPay);
      if (cashPay >= 0 && cardPay >= 0 && consumerId > 0 && saleRecordId > 0 && oweMoney >= sumMoney) {
        let consultId = '';
        let url = host + 'market/ownRecord/add';
        for (let index = 0; index < consults.length; index++) {
          let target = consults[index];
          if (index === 0) {
            consultId = consultId + target.id + '-';
          } else {
            consultId = consultId + target.id;
          }
        }
        let data = {cashPay: String(cashPay), cardPay: String(cardPay), saleFormId: saleRecordId, consultId: consultId};
        this.$http.post(url, data, {emulateJSON: true}).then(function (response) {
          let target = response.data;
          if (target.code === '100') {
            Toast({message: '操作成功', position: 'middle', duration: 1000, iconClass: 'icon icon-success'});
            this.back();
          } else {
            MessageBox({title: '', message: '服务器异常，欠单提交失败'});
          }
        }, function (response) {
        });
      } else if (consumerId <= 0) {
        MessageBox({title: '', message: '请选择客户'});
      } else if (saleRecordId <= 0) {
        MessageBox({title: '', message: '请选择销售单'});
      } else if (sumMoney > oweMoney) {
        MessageBox({title: '', message: '现金支付与储蓄卡支付总和不应大于欠款总金额'});
      } else {
        MessageBox({title: '', message: '请填写金额'});
      }
    }
  }
};
</script>

<style lang="scss" scope>
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
    }
    th:last-child{
      text-align:right;
    }
    tr{
      padding:0 20px;
      height:40px;
      border-bottom: 1px solid #dddddd;
    }
    td,th{
      padding:0 20px;
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
    th:first-child{
      text-align: left;
    }
    th{
      padding:0 20px;
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
      padding:0 20px;
      border-bottom: 1px solid #dddddd;
    }
    td:first-child{
      text-align:left;
    }
    input{
      width: 65%;
      background: #ffffff;
      height: 30px;
      margin-bottom: 3px;
      font-size: 14px;
      border: none;
      outline: none;
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
