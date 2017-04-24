<template>
  <div class="container">
    <mt-header title="新建客户">
      <router-link to="" slot="left">
        <mt-button @click="back"><i class="fa fa-chevron-left"></i></mt-button>
      </router-link>
    </mt-header>
    <div class="content">
      <mt-field label="姓名" placeholder="请输入姓名" v-model="newConsumer.username"></mt-field>
      <mt-field label="门店"  type="text" v-model="newConsumer.selectedStore.name" readonly></mt-field>
     <!--  <select class="selectStore" v-model="newConsumer.selectedStore.id">
        <option v-for="store in stores" v-bind:value="store.id">{{store.name}}</option>
      </select> -->
      <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="newConsumer.phone"></mt-field>
      <mt-field label="性别" type="text"></mt-field>
      <select class="selectSex" v-model="newConsumer.selectedSex">
        <option v-for="sex in sexs" v-bind:value="sex.value">{{sex.text}}</option>
      </select>
      <mt-field label="生日" placeholder="请选择生日" type="text" v-model="newConsumer.birthday" @click.native="open('newUser-picker')"></mt-field>
      <mt-button type="primary" size="large" class="btn" @click.native="addConsumer">保存并使用</mt-button>
      <mt-datetime-picker
        ref="newUser-picker"
        type="date"
        v-model="datepicker.value"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        :startDate="datepicker.startDate"
        :endDate="datepicker.endDate"
        @confirm="handleChange">
      </mt-datetime-picker>
    </div>
  </div>
</template>

<script>
import {host} from '../../common/js/const';
import router from '../../router/index.js';
import { MessageBox } from 'mint-ui';
// import { Toast } from 'mint-ui';
export default {
  data () {
    return {
      datepicker: {
        startDate: null,
        endDate: null,
        value: ''
      },
      newConsumer: {
        username: '',
        selectedStore: {},
        selectedSex: 0,
        phone: '',
        birthday: ''
      },
      currentStore: {
        id: 0,
        name: ''
      },
      stores: [],
      sexs: [
        {text: '女', value: '0'},
        {text: '男', value: '1'}
      ]
    };
  },
  created () {
    let self = this;
    let now = new Date();
    let startDate = new Date(1920, 0, 1);
    self.datepicker.startDate = startDate;
    self.datepicker.endDate = now;
  },
  activated () {
    let self = this;
    let storeInfo = window.localStorage.getItem('store');
    if (storeInfo) {
      let storeInfoes = String(storeInfo).split('-');
      self.currentStore.id = window.parseInt(storeInfoes[0]);
      self.currentStore.name = storeInfoes[1];
      self.newConsumer.selectedStore = {id: storeInfoes[0], name: storeInfoes[1]};
    }
  },
  beforeRouteLeave (to, from, next) {
    this.newConsumer.username = '';
    this.newConsumer.phone = '';
    this.newConsumer.birthday = '';
    next(true);
  },
  methods: {
    back () {
      router.go(-1);
    },
    formatDate (value) {
      return (value && String(value).length === 1) ? '0' + value : value;
    },
    open (picker) {
      this.$refs[picker].open();
    },
    handleChange () {
      let result = '';
      let value = this.datepicker.value;
      if (value) {
        let year = value.getFullYear();
        let month = this.formatDate(Number(value.getMonth() + 1));
        let day = this.formatDate(value.getDate());
        result = year + '年' + month + '月' + day + '日';
      }
      this.newConsumer.birthday = result;
    },
    addConsumer () {
      let self = this;
      let newConsumer = self.newConsumer;
      let selectedStoreId = window.parseInt(newConsumer.selectedStore.id);
      let regex = /^1(3|4|5|7|8)\d{9}$/;
      if (newConsumer.phone && regex.test(newConsumer.phone) && newConsumer.username && newConsumer.selectedSex >= 0 && selectedStoreId > 0) {
        let birthday = String(newConsumer.birthday).replace(/\W/g, '-');
        let url = host + 'market/' + selectedStoreId + '/consumer/add';
        let data = {storeId: selectedStoreId, consumerName: newConsumer.username, gender: newConsumer.selectedSex, phone: newConsumer.phone, birthday: birthday};
        self.$http.post(url, data, {emulateJSON: true}).then(function (response) {
          let target = response.data;
          if (target.code === '100') {
            let data = target.data;
            if (data) {
              let customer = data.customer;
              let origin = self.$store.getters.getOrigin;
              let info = customer.id + '-' + customer.fullnm + '-' + self.newConsumer.selectedStore.name;
              let allCustomer = self.$store.getters.getAllCustomer;
              allCustomer.push(customer);
              self.$store.commit('SETALLCUSTOMER', allCustomer);
              self.$store.commit('SETCURRENTCONSUMERINFO', info);
              router.push({path: '/' + origin});
            }
          } else if (target.code === '2008') {
            MessageBox({title: '', message: '手机号码已存在'});
          } else if (target.code === '2010') {
            MessageBox({title: '', message: '用户名已存在'});
          }
        }, function (response) {
        });
      } else if (!regex.test(newConsumer.phone)) {
        MessageBox({title: '', message: '非法的手机号码'});
      } else {
        MessageBox({title: '', message: '姓名、门店、手机号、性别是必填项'});
      }
    }
  }
};
</script>

<style lang="scss">
.container{
 text-align: center;
 .content{
   width:90%;
   margin: 10px auto;
   position: relative;
   .selectStore{
     position:absolute;
     z-index: 200;
     left: 80px;
     top: 76px;
     height: 30px;
     width: 140px;
     font-size: 14px;
     border: none;
     outline: none;
     background: #f5f5f5;
   }
   .selectSex{
     position:absolute;
     z-index: 200;
     left: 80px;
     top: 196px;
     height: 30px;
     width: 140px;
     font-size: 14px;
     border: none;
     outline: none;
     background: #f5f5f5;
   }
 }
}
.mint-header{
  height: 35px !important;
  line-height: 35px !important;
  font-size: 16px !important;
  padding: 0 20px !important;
  background: #a61e42 !important;
}
.mint-cell-wrapper{
  min-height: 40px !important;
  background-size: 120% 0 !important;
  background: #f5f5f5;
  margin: 10px auto;
  font-size: 14px !important;
  border: none;
  outline:none;
  border-radius: 4px;
  padding: 0 !important;
}
.mint-field .mint-cell-title{
  width: 80px !important;
  text-align: center !important;
}
.mint-cell:last-child{
  background-size:100% 0 !important;
}
input{
  background: #f5f5f5;
}
.mint-button--large{
  position: absolute;
  bottom: 10px !important;
  height:40px !important;
  font-size: 18px !important;
  background:#a61e42 !important;
}
.btn{
 margin-top:150px;
}



</style>
