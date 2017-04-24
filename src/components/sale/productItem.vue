<template>
  <div class="container">
    <mt-header title="添加产品">
      <router-link to="" slot="left" @click.native="back">
        <mt-button ><i class="fa fa-chevron-left"></i></mt-button>
      </router-link>
      <router-link to="" slot="right" @click.native="addProduct">添加</router-link>
    </mt-header>
    <table class="table">
      <tr @click="chooseRouter" class="table-header">
        <td>{{selectProduct.name}}</td>
        <td :class="[selectProduct.isExist ? '':classObject.classA ]">次数：{{selectProduct.times}}</td>
        <td :class="[selectProduct.isExist ? '':classObject.classA ]">{{selectProduct.price}}</td>
        <td><router-link to="/chooseProduct" slot="right"><i class="fa fa-chevron-right"></i></router-link></td>
      </tr>
      <tr>
        <td colspan="4">数量：<input type="text" v-model="productItem.amount"></td>
      </tr>
      <tr>
        <td colspan="4">实际单价：<input type="text" v-model="productItem.realPrice"></td>
      </tr>
      <tr>
        <td colspan="4">小计：{{sumPrice}}</td>
      </tr>
    </table>
  </div>
</template>


<script>
import { MessageBox } from 'mint-ui';
import router from '../../router/index.js';
export default {
  data () {
    return {
      flag: {
        pFlag: false
      },
      targetComponent: '',
      selectProduct: {
        id: 0,
        name: '',
        times: 0,
        price: 0,
        type: -1,
        isExist: false
      },
      productItem: {
        amount: 1,
        realPrice: 0.00,
        sumPrice: 0.00
      },
      selectAllProduct: [],
      classObject: {
        classA: 'none'
      }
    };
  },
  computed: {
    sumPrice: function () {
      this.productItem.sumPrice = this.productItem.amount * this.productItem.realPrice;
      return this.productItem.sumPrice.toFixed(2);
    }
  },
  activated () {
    this.initData();
  },
  methods: {
    reset () {
      this.selectProduct = {
        id: 0,
        name: '',
        times: 0,
        price: 0,
        type: -1,
        projtp: 0,
        isExist: false
      };
      this.productItem = {
        amount: 1,
        realPrice: 0,
        sumPrice: 0
      };
    },
    destoryData () {
      this.reset();
      this.$store.commit('SELECTPRODUCTITEMSINFO', null);
    },
    back () {
      this.destoryData();
      router.go(-1);
    },
    chooseRouter () {
      this.flag.pFlag = true;
      router.push({path: '/chooseProduct'});
    },
    initData () {
      let self = this;
      let storeTargetComponent = self.$store.getters.getCurrentProductBTC;
      let storeSelectProduct = self.$store.getters.getSelectProductInfo;
      if (typeof storeSelectProduct === 'string' && self.flag.pFlag) {
        let storeSelectProducts = String(storeSelectProduct).split('_');
        self.selectProduct.isExist = true;
        self.selectProduct.id = storeSelectProducts[0];
        self.selectProduct.name = storeSelectProducts[1];
        self.selectProduct.times = storeSelectProducts[2];
        self.selectProduct.price = storeSelectProducts[3];
        self.selectProduct.type = storeSelectProducts[4];
        if (storeSelectProducts.length > 5) {
          self.selectProduct.projtp = storeSelectProducts[5];
        } else {
          self.selectProduct.projtp = 0;
        }
        self.productItem.realPrice = self.selectProduct.price;
        self.flag.pFlag = false;
      } else {
        self.selectProduct.isExist = false;
        self.selectProduct.name = '请选择产品';
      }
      if (typeof storeTargetComponent === 'string') {
        self.targetComponent = storeTargetComponent;
      }
    },
    addProduct () {
      let productItem = this.productItem;
      let selectProduct = this.selectProduct;
      let selectProductId = window.parseInt(selectProduct.id);
      if (productItem.amount >= 1 && productItem.realPrice >= 0 && selectProductId > 0) {
        let productItemInfo = this.selectProduct.id + '_' + this.selectProduct.name + '_' + productItem.realPrice + '_' + productItem.amount + '_' + productItem.sumPrice + '_' + this.selectProduct.times + '_' + this.selectProduct.type + '_' + this.selectProduct.projtp + '_' + this.selectProduct.price;
        this.$store.commit('SELECTPRODUCTITEMSINFO', productItemInfo);
        router.push({path: '/' + this.targetComponent});
        this.reset();
        this.$store.commit('SETSELECTPRODUCTINFO', null);
        this.$store.commit('SETCURRENTPRODUCTBTC', null);
      } else if (selectProductId === 0) {
        MessageBox({title: '', message: '请选择产品'});
      } else if (productItem.amount <= 0) {
        MessageBox({title: '', message: '数量至少为1'});
      } else if (productItem.realPrice < 0) {
        MessageBox({title: '', message: '单价不可小于0'});
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.none {
  display: none;
}
.table {
  i {
    color: #a71e42;
  }
  border-collapse: collapse;
  width:100%;
  font-size:14px;
  .table-header{
    background: #efefef;
    td {
      padding: 0;
    }
    td:first-child {
      padding-left: 18px;
    }
  }
}
</style>
