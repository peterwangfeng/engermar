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
        <td colspan="2">销售单号：{{saleItem.code}}</td>
        <td colspan="2">日期：{{saleItem.date}}</td>
      </tr>
      <tr class="tr-data" v-for="item in saleItem.saleRecord">
        <td>{{item.prdnm}}</td>
        <td >单价：{{item.price5}}</td>
        <td>X{{item.atimes}}</td>
        <td>共{{item.price5 * item.quantity}}元</td>
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
  beforeRouteLeave (to, from, next) {
    this.reset();
    next(true);
  },
  methods: {
    initData () {
      let self = this;
      let customerId = self.$route.params.customerId;
      let state = self.$route.params.state;
      let residue = self.$route.params.residue;
      let url = host + 'market/' + customerId + '/salerecords?state=' + state ;
      if (residue === 0 || residue) {
        url = url + '&residue=' + residue;
      }
      self.$http.get(url, {
        emulateJSON: true
      }).then(function (response) {
        let target = response.data;
        if (target.code === '100') {
          let data = target.data;
          if (data) {
            let saleRecordMap = data.saleRecordMap;
            let saleFormMap = data.saleFormMap;
            let saleFormDateMap = data.saleFormDateMap;
            if (saleFormMap && saleFormMap.length > 0) {
              for (let index = 0; index < saleFormMap.length; index++) {
                let saleForm = saleFormMap[index];
                let id = saleForm.id;
                let date = saleFormDateMap[id];
                let owe = Number(saleForm.amountdis) - Number(saleForm.amountpaid);
                let temp = {id: id, date: date, owe: owe, code: saleForm.code, saleRecord: []};
                self.saleRecords.push(temp);
              }
              for (let key in saleRecordMap) {
                for (let index = 0; index < self.saleRecords.length; index++) {
                  let target = self.saleRecords[index];
                  if (String(target.id) === String(key)) {
                    let saleRecord = saleRecordMap[key];
                    target.saleRecord = saleRecord;
                  }
                }
              }
            } else {
              Toast({message: '没有相关的数据', position: 'middle', duration: 2000});
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
  tr {
    border-bottom: 1px solid #dddddd;
    height: 40px;
    line-height: 40px;
    border:none;
    td{
      padding: 0;
      text-align: left;
      border:none;
    }
  }
  .tr-head{
    color: #666666;
    font-weight: 600;
    td:first-child {
      width: 60%;
      padding-left: 10px;
      padding-right: 2px;
    }
    td:last-child {
      padding: 0;
      text-align: center;
    }
  }
  .tr-data {
    td:first-child {
      padding-left: 10px;
    }
    td:last-child {
      text-align: center;
    }
  }
}
</style>
