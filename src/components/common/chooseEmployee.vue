<template>
  <div class="container">
    <mt-header :title="title">
      <router-link to="" slot="left" @click.native="back">
        <mt-button ><i class="fa fa-chevron-left"></i></mt-button>
      </router-link>
    </mt-header>
    <input type="search" placeholder="搜索" @keydown.13="searchUser"  @input="searchUser" v-model="searchUserObject.option">
    <table class="table">
      <tr @click="selectEmployee(user)" v-for="user in searchUserObject.users">
        <td>{{user.username}}({{user.mobilephone}})</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
// import { host } from '../../common/js/const';
import router from '../../router/index.js';
export default {
  data () {
    return {
      title: '',
      type: -1,
      isClick: false,
      searchUserObject: {
        option: '',
        users: []
      },
      users: [],
      storeSalesInfo: '',
      storeConsultsInfo: ''
    };
  },
  activated () {
    let self = this;
    let type = self.$route.params.type;
    let allEmployee = self.$store.getters.getAllEmployee;
    if (typeof allEmployee === 'object') {
      self.searchUserObject.users = self.users = allEmployee;
      if (allEmployee.length === 0) {
        Toast({message: '没有相关的数据', position: 'middle', duration: 2000});
      }
    }
    if (type === 0) {
      self.type = 0;
      self.title = '选择咨询师';
    } else if (type === 1) {
      self.type = 1;
      self.title = '选择销售';
    } else if (type === 2) {
      self.type = 2;
      self.title = '选择操作师';
    }
  },
  beforeRouteLeave (to, from, next) {
    this.searchUserObject.option = '';
    this.searchUserObject.users = this.users;
    if (!this.isClick) {
      if (this.type === 0) {
        this.$store.commit('SELECTCONSULTINFO', undefined);
      } else if (this.type === 1) {
        this.$store.commit('SELECTSALEINFO', undefined);
      } else if (this.type === 2) {
        this.$store.commit('SELECTSALEINFO', undefined);
      }
    }
    this.isClick = false;
    next(true);
  },
  methods: {
    reset () {
      this.searchUserObject = {
        option: '',
        users: []
      };
    },
    back () {
      this.isClick = false;
      router.go(-1);
    },
    searchUser () {
      let users = this.users;
      let regex = /^(\w|[\u4E00-\u9FA5])*$/gi;
      let searchUserObject = this.searchUserObject;
      if (searchUserObject.option && regex.test(searchUserObject.option)) {
        searchUserObject.users = [];
        let option = String(searchUserObject.option).toUpperCase();
        for (let index = 0; index < users.length; index++) {
          let employee = users[index];
          if (employee) {
            let name = String(employee.username);
            if (String(name).indexOf(option) >= 0) {
              searchUserObject.users.push(employee);
            }
          }
        }
      } else if (!searchUserObject.option) {
        searchUserObject.users = users;
      }
    },
    selectEmployee (employee) {
      let userInfo = '';
      if (employee) {
        if (this.type === 0) {
          userInfo = employee.id + '-' + employee.username + '-咨询师';
          this.storeConsultsInfo = userInfo;
          this.$store.commit('SELECTCONSULTINFO', this.storeConsultsInfo);
        } else if (this.type === 1) {
          userInfo = employee.id + '-' + employee.username + '-销售';
          this.storeSalesInfo = userInfo;
          this.$store.commit('SELECTSALEINFO', this.storeSalesInfo);
        } else if (this.type === 2) {
          userInfo = employee.id + '-' + employee.username + '-操作师';
          this.storeSalesInfo = userInfo;
          this.$store.commit('SELECTSALEINFO', this.storeSalesInfo);
        }
        this.isClick = true;
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
a:-webkit-any-link{
  text-decoration: none !important;
  font-size :13px !important;
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
    text-align: left;
  }
}
</style>
