<template>
  <div class="container">
    <mt-header title="选择销售单">
          <router-link to="" slot="left" @click.native="back">
            <mt-button ><i class="fa fa-chevron-left"></i></mt-button>
          </router-link>
    </mt-header>
    <input type="search" placeholder="搜索" @keydown.13="searchSaleItem" @input="searchSaleItem" v-model="searchSaleItemObject.option">
    <table class="table" @click="selectSaleItem(saleItem)" v-for="saleItem in searchSaleItemObject.tempSaleItem">
      <tr class="tr-head">
        <td colspan="2">销售单号：{{saleItem.id}}</td>
        <td colspan="2">日期：{{saleItem.date}}</td>
      </tr>
      <tr v-for="item in saleItem.saleRecord">
        <td>{{item.prdnm}}</td>
        <td >单价：{{item.price5}}</td>
        <td>X{{item.atimes}}</td>
        <td>共{{item.price5 * item.atimes}}元</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import { host } from '../../common/js/const';
import router from '../../router/index.js';
export default {
  data () {
    return {
      searchSaleItemObject: {
        tempSaleItem: [],
        option: ''
      },
      consumer: {
        id: 0
      },
      saleRecords: []
    };
  },
  activated () {
    this.initData();
  },
  methods: {
    initData () {
      var self = this;
      var customerId = self.$route.params.customerId;
      var state = self.$route.params.state;
      let url = host + 'market/' + customerId + '/salerecords?state=' + state;
      self.$http.get(url, {
        emulateJSON: true
      }).then(function (response) {
        let target = response.data;
        if (target.code === '100') {
          let data = target.data;
          if (data) {
            let saleRecordMap = data.saleRecordMap;
            let saleRecordDateMap = data.saleFormDateMap;
            for (let key in saleRecordMap) {
              let saleForm = saleRecordMap[key];
              let saleFormDate = saleRecordDateMap[key];
              let temp = {id: key, date: saleFormDate, saleRecord: saleForm};
              self.saleRecords.push(temp);
            }
            self.searchSaleItemObject.tempSaleItem = self.saleRecords;
          } else {
            Toast({message: '没有相关的数据', position: 'middle', duration: 2000});
          }
        } else {
        }
      }, function (response) {
      });
    },
    reset () {
      this.searchSaleItemObject = {
        tempSaleItem: [],
        option: ''
      };
      this.saleRecords = [];
    },
    back () {
      this.reset();
      router.go(-1);
    },
    searchSaleItem () {
      let regex = /^(\d)*$/g;
      let searchSaleItemObject = this.searchSaleItemObject;
      let option = searchSaleItemObject.option;
      let saleRecords = this.saleRecords;
      if (option && regex.test(option)) {
        searchSaleItemObject.tempSaleItem = [];
        for (let index = 0; index < saleRecords.length; index++) {
          let saleRecord = saleRecords[index];
          if (saleRecord) {
            if (String(saleRecord).indexOf(option) >= 0) {
              searchSaleItemObject.salerecords.push(saleRecord);
            }
          }
        }
      } else if (!searchSaleItemObject.option) {
        searchSaleItemObject.tempSaleItem = saleRecords;
      }
    },
    selectSaleItem (saleItem) {
      if (saleItem) {
        this.$store.commit('SETCURRENTSALEFORM', saleItem);
        this.back();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
input{
  width: 80%;
  height: 35px;
  background: #a61e42;
  margin: 20px 0 15px 0;
  color: white;
  border: none;
  outline:none;
  border-radius: 4px;
  font-size: 14px;
  text-indent:10px;
}
input::-webkit-input-placeholder{
  color: #ffffff;
}
input:-moz-placeholder{
  color:#ffffff;
}
input::-moz-placeholder{
  color:#ffffff;
}
input:-ms-input-placeholder {
  color:#ffffff;
}
.table{
  width:100%;
  font-size:12px;
  color: #a4a4a4;
  .tr-head{
    color: #666666;
    font-weight: 600;
  }
  tr{
    border-bottom: 1px solid #dddddd;
    height: 40px;
    line-height: 40px;
    border:none;
  }
  td{
    padding: 0 20px;
    text-align: left;
    border:none;
  }
  td:first-child{
    padding-right: 0;
  }
}
</style>
