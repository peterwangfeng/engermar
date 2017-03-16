<template>
  <div class="container">
    <mt-header title="选择门店">
      <router-link to="/home" slot="left">
        <mt-button><i class="fa fa-chevron-left"></i></mt-button>
      </router-link>
    </mt-header>
    <input type="text" placeholder="搜索" @keydown.13="searchStore" @input="searchStore" v-model="searchStoreObject.option">
    <table class="table">
        <tr @click="selectStore(item)" v-for="item in searchStoreObject.stores">
          <td v-text="item.name"></td>
        </tr>
    </table>
  </div>
</template>

<script>
import { host } from '../../common/js/const';
import router from '../../router/index';
export default {
  data () {
    return {
      stores: [],
      searchStoreObject: {
        option: '',
        stores: []
      }
    };
  },
  created: function () {
    this.getStores();
  },
  methods: {
    getStores () {
      var self = this;
      var url = host + 'market/departments';
      self.$http.get(url, {emulateJSON: true}).then(function (response) {
        var target = response.data.data;
        if (target != null) {
          self.searchStoreObject.stores = self.stores = target.departments;
        }
      }, function (response) {
      });
    },
    selectStore: function (store) {
      if (store) {
        this.$store.commit('SETSTOREINFO', store.id + '-' + store.name);
        window.sessionStorage.setItem('store', store.id + '-' + store.name);
        router.go(-1);
      }
    },
    searchStore () {
      var stores = this.stores;
      var searchStoreObject = this.searchStoreObject;
      let regex = /^(\w|[\u4E00-\u9FA5])*$/gi;
      if (searchStoreObject.option && regex.test(searchStoreObject.option)) {
        searchStoreObject.stores = [];
        let option = String(searchStoreObject.option).toUpperCase();
        for (let index = 0; index < stores.length; index++) {
          var store = stores[index];
          if (store) {
            let name = String(store.name).toUpperCase();
            if (String(name).indexOf(option) >= 0) {
              searchStoreObject.stores.push(store);
            }
          }
        }
      } else if (!searchStoreObject.option) {
        searchStoreObject.stores = stores;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container{
 text-align: center;
}
a:-webkit-any-link{
  text-decoration: none !important;
  font-size :13px !important;
}
input{
  width: 80%;
  height: 35px;
  background: #a61e42;
  margin: 15px auto;
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
    text-align: left;
  }
}
</style>
