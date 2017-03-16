<template>
  <div class="container">
    <input type="search" placeholder=" 搜索" @keydown.13="searchUser"  @input="searchUser" v-model="searchUserObject.searchOption">
    <table class="table">
      <tr @click="selectConsumer(consumer)" v-for="consumer in searchUserObject.tempComsumer">
          <td v-text="consumer.fullnm"></td>
          <td v-text="store.name"></td>
      </tr>
    </table>
  </div>
</template>

<script>
import { host } from '../../common/js/const';
import router from '../../router/index';
export default {
  name: 'chooseUser',
  data () {
    return {
      message: '选择客户',
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
    var self = this;
    var localStore = window.sessionStorage.getItem('store');
    var store = self.$store.getters.getStoreInfo;
    if (typeof store === 'string') {
      let storeArray = String(store).split('-');
      self.store.id = storeArray[0];
      self.store.name = storeArray[1];
    } else if (localStore) {
      let storeArray = String(localStore).split('-');
      self.store.id = storeArray[0];
      self.store.name = storeArray[1];
    }
    let url = host + 'market/' + self.store.id + '/consumers';
    self.$http.get(url, {
      emulateJSON: true
    }).then(function (response) {
      var target = response.data.data;
      if (target) {
        var consumers = target.customers;
        self.searchUserObject.tempComsumer = self.consumers = consumers;
      }
    }, function (response) {
    });
  },
  methods: {
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
