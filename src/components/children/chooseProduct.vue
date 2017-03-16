<template>
  <div class="container">
    <mt-header title="选择产品项目">
      <router-link to="" slot="left" @click.native="back">
        <mt-button ><i class="fa fa-chevron-left"></i></mt-button>
      </router-link>
    </mt-header>
    <span>项目</span>
    <table class="table">
      <tr @click="selectTreatment(item, 'treatment')" v-for="item in productItems.treatments">
        <td>{{item.name}}</td>
        <td>次数：{{item.times}}</td>
        <td>金额：{{item.price}}</td>
      </tr>
    </table>
    <span>产品</span>
    <table class="table">
      <tr @click="selectTreatment(item, 'product')" v-for="item in productItems.products">
        <td>{{item.name}}</td>
        <td>次数：1</td>
        <td>金额：{{item.price3}}</td>
      </tr>
    </table>
  </div>
</template>


<script>
import { host } from '../../common/js/const';
import router from '../../router/index.js';
export default {
  data () {
    return {
      store: {
        id: 0,
        name: ''
      },
      productItems: {
        products: [],
        treatments: []
      }
    };
  },
  created () {
    let self = this;
    let tempTreatments = [];
    let localStore = window.sessionStorage.getItem('store');
    let store = self.$store.getters.getStoreInfo;
    if (typeof store === 'string') {
      let storeArray = String(store).split('-');
      self.store.id = storeArray[0];
    } else if (localStore) {
      let storeArray = String(localStore).split('-');
      self.store.id = storeArray[0];
    }
    let url = host + 'market/' + self.store.id + '/productItems';
    self.$http.get(url).then(function (response) {
      let target = response.data.data;
      if (target) {
        let products = target.productList;
        let treatments = target.treatmentList;
        let treatmentInfoMap = target.treatmentInfoMap;
        for (let index = 0; index < treatments.length; index++) {
          let target = treatments[index];
          let treatmentInfo = treatmentInfoMap[target.id];
          let treatmentInfoes = String(treatmentInfo).split('-');
          let temp = {id: target.id, name: target.fullnm, price: treatmentInfoes[0], times: treatmentInfoes[1]};
          tempTreatments.push(temp);
        }
        self.productItems.treatments = tempTreatments;
        self.productItems.products = products;
      }
    }, function (response) {
    });
  },
  methods: {
    back () {
      router.go(-1);
    },
    selectTreatment (item, type) {
      if (item) {
        let productInfo = '';
        if (type === 'product') {
          productInfo = item.id + '_' + item.name + '_1_' + item.price3 + '_2';
        } else if (type === 'treatment') {
          productInfo = item.id + '_' + item.name + '_' + item.times + '_' + item.price + '_1';
        }
        this.$store.commit('SETSELECTPRODUCTINFO', productInfo);
        this.back();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
span{
 float: left;
 margin-left: 20px;
 margin-top: 20px;
}
.table{
  border-collapse: collapse;
  width:100%;
  font-size:14px;
  border: none;
  tr{
    border-bottom: 1px solid #dddddd;
    height: 40px;
    line-height: 40px;
    background: #efefef;
    display: block;
    margin-top:10px;
    border: none;
  }
  td{
    padding: 0 20px;
    border: none;
  }
}

</style>
