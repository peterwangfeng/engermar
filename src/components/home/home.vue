<template>
  <div class="container">
    <mt-header title="我的">
      <router-link to="" slot="right" @click.native="logout">退出</router-link>
    </mt-header>
    <div class="home-content">
      <div class="content-count">
        <span><router-link to="/salesStatistics" slot="right">销售统计表</router-link></span>
        <p> 昨日提成：{{count()}} </p>
        <div class="count-commission">个人销售提成：{{percentage.person}}</div>
        <div class="count-commission">手工操作：{{percentage.operate}}</div>
      </div>
      <div class="store-count">
        <p>当前门店：<span>{{store.name}}</span><router-link to="/chooseStore" slot="left"><mt-button type="primary" class="btn-small"> 切 换 </mt-button></router-link></p>
      </div>
      <div class="function-count">
        <p>业务功能</p>
      </div>
    <table class="img-table">
    <tr>
      <td>
        <router-link to="" @click.native="selectModule('sale')">
          <img src="../../assets/2-1.png">
        </router-link>
      </td>
      <td>
        <router-link to="" @click.native="selectModule('consume')">
          <img src="../../assets/3-1.png">
        </router-link>
      </td>
    </tr>
    <tr>
      <td>
        <router-link to="" @click.native="selectModule('returns')">
          <img src="../../assets/4-1.png">
        </router-link>
      </td>
      <td>
        <router-link to="" @click.native="selectModule('owe')">
          <img src="../../assets/5-1.png">
        </router-link>
      </td>
    </tr>
    </table>
  </div>
  </div>
</template>

<script>
import { host } from '../../common/js/const';
import router from '../../router/index';
import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';
export default {
  data () {
    return {
      percentage: {
        person: '暂无',
        operate: '暂无'
      },
      store: {
        id: 0,
        name: '请选择门店'
      }
    };
  },
  beforeRouteLeave (to, from, next) {
    let path = to.path;
    if (String(path) === '/login') {
      MessageBox.confirm('确定退出该应用?').then(action => {
        if (action === 'confirm') {
          this.destoryData();
          next(true);
        } else {
          next(false);
        }
      });
    } else {
      next(true);
    }
  },
  activated () {
    let self = this;
    let localStore = window.localStorage.getItem('store');
    if (localStore) {
      let store = self.store;
      let storeInfoArray = String(localStore).split('-');
      let id = store.id;
      if (String(id) !== String(storeInfoArray[0])) {
        store.id = storeInfoArray[0];
        store.name = storeInfoArray[1];
        self.initAppData(storeInfoArray[0]);
      }
    }
  },
  methods: {
    initAppData (storeId) {
      Indicator.open({text: '数据更新中', spinnerType: 'fading-circle'});
      this.getAllProductAndTreatment(storeId);
    },
    getAllProductAndTreatment (storeId) {
      let self = this;
      let url = host + 'market/' + storeId + '/productItems';
      self.$http.get(url).then(function (response) {
        let target = response.data;
        if (target.code === '100') {
          let data = target.data;
          if (data) {
            let result = {
              products: null,
              treatments: null
            };
            let tempTreatments = [];
            let products = data.productList;
            let treatments = data.treatmentList;
            let treatmentInfoMap = data.treatmentInfoMap;
            if (treatments) {
              for (let index = 0; index < treatments.length; index++) {
                let target = treatments[index];
                let treatmentInfo = treatmentInfoMap[target.id];
                let temp = {id: target.id, name: target.name, price: treatmentInfo, times: target.ctimes, projtp: target.projtp};
                tempTreatments.push(temp);
              }
            }
            result.products = products.sort();
            result.treatments = tempTreatments.sort();
            self.$store.commit('SETALLPRODUCTANDTREATMENT', result);
          } else {
            self.$store.commit('SETALLPRODUCTANDTREATMENT', []);
          }
          self.getAllEmployee(storeId);
        }
      }, function (response) {
      });
    },
    getAllEmployee (storeId) {
      let self = this;
      let url = host + 'market/' + storeId + '/employee';
      self.$http.get(url).then(function (response) {
        let target = response.data;
        if (target.code === '100') {
          let data = target.data;
          if (data) {
            self.$store.commit('SETALLEMPLOYEE', data.users.sort());
          } else {
            self.$store.commit('SETALLEMPLOYEE', []);
          }
          self.getAllCustomers(storeId);
        }
      }, function (response) {
      });
    },
    getAllCustomers (storeId) {
      let self = this;
      let url = host + 'market/' + storeId + '/consumers';
      self.$http.get(url, {
        emulateJSON: true
      }).then(function (response) {
        let target = response.data;
        if (target.code === '100') {
          let data = target.data;
          if (data) {
            self.$store.commit('SETALLCUSTOMER', data.customers.sort());
          } else {
            self.$store.commit('SETALLCUSTOMER', []);
          }
        }
        Indicator.close();
      }, function (response) {
      });
    },
    destoryData () {
      this.store.id = 0;
      this.store.name = '请选择门店';
      window.sessionStorage.setItem('loginUser', '');
      this.$store.commit('RESET');
    },
    count () {
      // var self = this;
      // let userId = window.sessionStorage.getItem('userId');
      // var url = host + 'market/' + userId + '/commission?dateId=20170228 ';
      // self.$http.get(url, {emulateJSON: true}).then(function (response) {
      //   var target = response.data.data;
      //   if (target) {
      //     // var commissions = target.userCommissions;
      //     // console.log(commissions.length);
      //   }
      // }, function (response) {
      // });
    },
    selectModule (moduleName) {
      var store = this.store;
      if (store.id > 0 && store.name && String(store.name).indexOf('请选择门店') < 0) {
        router.push({path: '/' + moduleName});
      } else if (store.id === 0) {
        MessageBox({title: '', message: '请选择门店'});
      }
    },
    logout () {
      var self = this;
      let url = host + 'account/logout';
      self.$http.get(url).then(function (response) {
        var target = response.data;
        if (target.code === '100') {
          router.push({path: '/login'});
        }
      }, function (response) {
      });
    }
  }
};
</script>

<style lang="scss">
body{
  padding: 0;
  margin: 0;
  font-family: '微软雅黑' !important;
}
a{
  text-decoration: none !important;
}
a:-webkit-any-link{
  text-decoration: none !important;
  font-size :12px !important;
}
.home-content{
  text-align: left;
  .content-count{
    padding: 20px 20px;
    background: #b91742;
    color: #ffffff;
    span{
      position: absolute;
      right: 20px;
      a{
        color :#ffffff;
      }
    }
    p{
      margin: 0;
      padding: 0;
      font-size: 16px;
    }
    .count-commission{
      font-size: 12px;
      margin-top:30px;
    }
  }
  .store-count{
    margin: 20px 20px;
    font-size: 15px;
    button{
      font-size:13px;
      float: right;
      background: #B91742;
      width: 60px;
      height: 25px;
    }
  }
  .function-count{
    p{
    padding: 20px 20px 0 20px;;
    font-size: 15px;
    }
  }
  .img-table{
    text-align: center;
    width: 100%;
    margin:10px auto;
    border-collapse: collapse;
    border:1px solid #dddddd;
    img{
      width: 150px;
      height: 80px;
    }
    td{
      padding: 6px 0 3px 0;
      border:1px solid #dddddd;
    }
  }
}

</style>
