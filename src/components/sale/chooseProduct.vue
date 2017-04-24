<template>
  <div class="container">
    <mt-header title="选择产品项目">
      <router-link to="" slot="left" @click.native="back">
        <mt-button ><i class="fa fa-chevron-left"></i></mt-button>
      </router-link>
    </mt-header>
    <div class="search">
      <input type="search" placeholder="搜索" @keydown.13="searchProductItem"  @input="searchProductItem" v-model="search.option">
    </div>
    <span>项目</span>
    <table class="table">
      <tr @click="selectTreatment(item, 'treatment')" v-for="item in search.treatments">
        <td>{{item.name | subStr}}</td>
        <td>次数：{{item.times}}</td>
        <td>金额：{{item.price}}</td>
      </tr>
    </table>
    <span>产品</span>
    <table class="table">
      <tr @click="selectTreatment(item, 'product')" v-for="item in search.products">
        <td>{{item.name | subStr}}</td>
        <td>次数：1</td>
        <td>金额：{{item.price3}}</td>
      </tr>
    </table>
  </div>
</template>


<script>
import { Toast } from 'mint-ui';
import router from '../../router/index.js';
export default {
  data () {
    return {
      store: {
        id: 0,
        name: ''
      },
      search: {
        option: '',
        products: [],
        treatments: []
      },
      productItems: {
        products: [],
        treatments: []
      }
    };
  },
  filters: {
    subStr: function (value) {
      let result = value;
      if (value) {
        result = String(value).substring(0, 10);
      }
      return result;
    }
  },
  activated () {
    let self = this;
    let store = self.store;
    let isInitData = false;
    let localStore = window.localStorage.getItem('store');
    let allProductAndTreatment = self.$store.getters.getAllProductAndTreatment;
    if (localStore) {
      let storeArray = String(localStore).split('-');
      let id = storeArray[0];
      if (store.id > 0) {
        if (String(store.id) !== String(id)) {
          isInitData = true;
          self.store.id = id;
        }
      } else {
        isInitData = true;
        self.store.id = id;
      }
    }
    if (typeof allProductAndTreatment === 'object' && isInitData) {
      if (allProductAndTreatment) {
        let products = allProductAndTreatment.products;
        let treatments = allProductAndTreatment.treatments;
        self.search.treatments = treatments;
        self.search.products = products;
        self.productItems.treatments = treatments;
        self.productItems.products = products;
      } else {
        Toast({message: '没有相关的数据', position: 'middle', duration: 2000});
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    let search = this.search;
    search.option = '';
    search.products = this.productItems.products;
    search.treatments = this.productItems.treatments;
    next(true);
  },
  methods: {
    back () {
      router.go(-1);
    },
    selectTreatment (item, type) {
      if (item) {
        let productInfo = '';
        if (type === 'product') {
          productInfo = item.id + '_' + item.name + '_1_' + item.price3 + '_1';
        } else if (type === 'treatment') {
          productInfo = item.id + '_' + item.name + '_' + item.times + '_' + item.price + '_2_' + item.projtp;
        }
        this.$store.commit('SETSELECTPRODUCTINFO', productInfo);
        this.back();
      }
    },
    searchProductItem () {
      let products = this.productItems.products;
      let treatments = this.productItems.treatments;
      let regex = /^(\w|[\u4E00-\u9FA5])*$/gi;
      let search = this.search;
      if (search.option && regex.test(search.option)) {
        search.products = [];
        search.treatments = [];
        let option = String(search.option).toUpperCase();
        for (let index = 0; index < products.length; index++) {
          let product = products[index];
          if (product) {
            let name = String(product.name);
            if (String(name).indexOf(option) >= 0) {
              search.products.push(product);
            }
          }
        }
        for (let index = 0; index < treatments.length; index++) {
          let treatment = treatments[index];
          if (treatment) {
            let name = String(treatment.name);
            if (String(name).indexOf(option) >= 0) {
              search.treatments.push(treatment);
            }
          }
        }
      } else if (!search.option) {
        search.products = products;
        search.treatments = treatments;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
span {
  float: left;
  margin: 20px 0 0 20px;
}
input{
  width: 80%;
  height: 35px;
  background: #a61e42;
  margin: 20px auto;
  color: white;
  border: none;
  outline:none;
  border-radius: 4px;
  font-size: 14px;
  text-indent:10px;
  margin: 10 auto;
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
  border-collapse: collapse;
  width:100%;
  font-size:14px;
  border: none;
  tr{
    position: relative;
    width: 100%;
    border-bottom: 1px solid #dddddd;
    height: 40px;
    line-height: 40px;
    background: #efefef;
    display: block;
    margin-top:10px;
    border: none;
    td {
      border: none;
    }
    td:first-child {
      padding: 0;
      width: 49%;
      margin-left: 10px;
      text-align: left;
      position: absolute;
      top: 0;
      left: 0;
    }
    td:nth-child(2) {
      padding: 0;
      width: 20%;
      position: absolute;
      left: 49%;
      text-align: left;
    }
    td:last-child {
      padding: 0;
      width: 33%;
      text-align: left;
      position: absolute;
      top: 0px;
      left: 71%;
    }
  }

}

</style>
