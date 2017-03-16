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
        <p>当前门店：{{store.name}} <router-link to="/chooseStore" slot="left"><mt-button type="primary" class="btn-small"> 切 换 </mt-button></router-link></p>
      </div>
      <div class="function-count">
        <p>业务功能</p>
      </div>
    <table class="img-table">
    <tr>
      <td>
        <router-link to="" @click.native="selectModule('sale')">
          <img src="../assets/2-1.png">
        </router-link>
      </td>
      <td>
        <router-link to="" @click.native="selectModule('consume')">
          <img src="../assets/3-1.png">
        </router-link>
      </td>
    </tr>
    <tr>
      <td>
        <router-link to="" @click.native="selectModule('returns')">
          <img src="../assets/4-1.png">
        </router-link>
      </td>
      <td>
        <router-link to="" @click.native="selectModule('owe')">
          <img src="../assets/5-1.png">
        </router-link>
      </td>
    </tr>
    </table>
  </div>
  </div>
</template>

<script>
import { host } from '../common/js/const';
import router from '../router/index';
import { MessageBox } from 'mint-ui';
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
  activated () {
    this.initData();
  },
  methods: {
    initData () {
      var self = this;
      var localStore = window.sessionStorage.getItem('store');
      var storeInfo = self.$store.getters.getStoreInfo;
      if (typeof storeInfo === 'string') {
        let storeInfoArray = String(storeInfo).split('-');
        self.store.id = storeInfoArray[0];
        self.store.name = storeInfoArray[1];
      } else if (localStore) {
        let storeInfoArray = String(localStore).split('-');
        self.store.id = storeInfoArray[0];
        self.store.name = storeInfoArray[1];
      }
    },
    count () {
      var self = this;
      let userId = window.sessionStorage.getItem('userId');
      var url = host + 'market/' + userId + '/commission?dateId=20170228 ';
      self.$http.get(url, {emulateJSON: true}).then(function (response) {
        var target = response.data.data;
        if (target) {
          // var commissions = target.userCommissions;
          // console.log(commissions.length);
        }
      }, function (response) {
      });
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
          window.sessionStorage.setItem('loginUser', '');
          self.$store.commit('RESET');
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
