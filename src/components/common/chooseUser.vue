<template>
  <div class="container">
  <mt-header title="选择客户">
    <router-link to="" slot="left">
      <mt-button @click="back"><i class="fa fa-chevron-left"></i></mt-button>
    </router-link>
    <router-link to="/newUser" slot="right">新建</router-link>
  </mt-header>
    <input type="search" placeholder=" 搜索" @keydown.13="searchUser"  @input="searchUser" v-model="searchUserObject.searchOption">
    <table class="table" v-infinite-scroll="loadMore" infinite-scroll-disabled="load.isLoading" infinite-scroll-distance="10">
      <tr @click="selectConsumer(consumer)" v-for="consumer in searchUserObject.tempComsumer">
          <td v-text="consumer.fullnm"></td>
          <td v-text="store.name"></td>
      </tr>
    </table>
  </div>
</template>

<script>
import router from '../../router/index';
import {Toast} from 'mint-ui';
import infiniteScroll from 'vue-infinite-scroll';
export default {
  name: 'chooseUser',
  directives: {infiniteScroll},
  data () {
    return {
      message: '选择客户',
      load: {
        isLoading: false,
        currentIndex: 20
      },
      searchUserObject: {
        searchOption: '',
        tempComsumer: []
      },
      store: {
        id: 0,
        name: ''
      },
      consumers: []
    };
  },
  activated () {
    this.initData();
  },
  beforeRouteLeave (to, from, next) {
    let allCustomer = this.consumers;
    this.searchUserObject.searchOption = '';
    this.searchUserObject.tempComsumer = [];
    if (allCustomer.length <= 20) {
      this.load.currentIndex = allCustomer.length;
    } else {
      this.load.currentIndex = 20;
    }
    next(true);
  },
  methods: {
    loadMore: function() {
      let currentIndex = this.load.currentIndex;
      let targetIndex = Number(currentIndex + 10);
      let allCustomer = this.consumers;
      let consumerList = this.searchUserObject.tempComsumer;
      if (currentIndex <= allCustomer.length) {
        if (targetIndex > allCustomer.length) {
          targetIndex = allCustomer.length;
        }
        if (currentIndex <= allCustomer.length) {
          for (let index = currentIndex; index < targetIndex; index++) {
            consumerList.push(allCustomer[index]);
          }
          this.searchUserObject.tempComsumer = consumerList;
        }
        this.load.currentIndex = targetIndex;
      }
    },
    back () {
      router.go(-1);
    },
    initData () {
      let self = this;
      let localStore = window.localStorage.getItem('store');
      let allCustomer = self.$store.getters.getAllCustomer;
      if (localStore) {
        let storeArray = String(localStore).split('-');
        self.store.id = storeArray[0];
        self.store.name = storeArray[1];
      }
      if (typeof allCustomer === 'object') {
        self.consumers = allCustomer;
        let temp = [];
        if (allCustomer.length <= 20) {
          self.load.currentIndex = allCustomer.length;
        } else {
          self.load.currentIndex = 20;
        }
        for (let index = 0; index < self.load.currentIndex; index++) {
          temp.push(allCustomer[index]);
        }
        self.searchUserObject.tempComsumer = temp;
        if (allCustomer.length === 0) {
          Toast({message: '没有相关的数据', position: 'middle', duration: 2000});
        }
      }
    },
    searchUser () {
      let regex = /^(\w|[\u4E00-\u9FA5])*$/gi;
      var searchUser = this.searchUserObject;
      var consumers = this.consumers;
      if (searchUser.searchOption && regex.test(searchUser.searchOption)) {
        searchUser.tempComsumer = [];
        let option = String(searchUser.searchOption).toUpperCase();
        for (let index = 0; index < consumers.length; index++) {
          var user = consumers[index];
          if (user) {
            let name = String(user.fullnm).toUpperCase();
            if (String(name).indexOf(option) >= 0) {
              searchUser.tempComsumer.push(user);
            }
          }
        }
      } else if (!searchUser.option) {
        searchUser.tempComsumer = consumers;
      }
    },
    selectConsumer (consumer) {
      if (consumer) {
        var consumerInfo = consumer.id + '-' + consumer.fullnm + '-' + this.store.name;
        this.$store.commit('SETCURRENTCONSUMERINFO', consumerInfo);
        router.go(-1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container{
 text-align: center;
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
  margin-top: 15px;
  tr{
    border-bottom: 1px solid #dddddd;
    height: 40px;
    line-height: 40px;
  }
  td{
    padding: 0 20px;
  }
  td:first-child{
    text-align: left;
  }
  td:last-child{
    text-align: right;
  }
}

</style>
