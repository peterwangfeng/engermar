<template>
  <div>
    <mt-header title="忘记密码">
      <router-link to="/login" slot="left">
        <mt-button><i class="fa fa-chevron-left"></i></mt-button>
      </router-link>
    </mt-header>
    <div class="input">
      <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="user.phone"></mt-field>
      <mt-field label="验证码" type="text" v-model="user.smsCode">
      <div @click="send" >
        <timer-btn :disabled="disabled"  class="btn-send" ref="btn" :second="90"></timer-btn>
      </div>
      </mt-field>
      <mt-field label="新密码" placeholder="请输入密码" :type="passwordInput.type" v-model="user.password">
        <img @click="changeInputType" :src="passwordInput.src">
      </mt-field>
      <mt-button type="primary" size="large" class="big-btn" @click="changePassword">提 交</mt-button>
    </div>
  </div>
</template>

<script>
import { host } from '../../common/js/const';
import img_gray_password from '../../assets/6-1.png';
import img_red_password from '../../assets/6-2.png';
import timerBtn from './timerBtn';
import { MessageBox } from 'mint-ui';
import { Toast } from 'mint-ui';
export default {
  data () {
    return {
      user: {
        password: '',
        phone: '',
        smsCode: ''
      },
      passwordInput: {
        src: img_gray_password,
        type: 'password'
      },
      disabled: false
    };
  },
  methods: {
    changeInputType: function () {
      let passwordInput = this.passwordInput;
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordInput.src = img_red_password;
      } else {
        passwordInput.type = 'password';
        passwordInput.src = img_gray_password;
      }
    },
    send (str) {
      var self = this;
      let phone = self.user.phone;
      let regex = /^1(3|4|5|7|8)\d{9}$/g;
      if (phone !== '' && regex.test(phone)) {
        var url = host + 'account/' + phone + '/SMSCode?type=1';
        self.$http.get(url).then(function (response) {
          var target = response.data;
          if (target.code === '100') {
            self.disabled = true;
            setTimeout(this.sended, 2000);
          } else if (target.code === '2001') {
            MessageBox({title: '', message: '手机号码没有注册'});
          }
        }, function (response) {
        });
      } else if (phone === '') {
        MessageBox({title: '', message: '手机号码不可为空'});
      } else {
        MessageBox({title: '', message: '非法的手机号码'});
      }
    },
    sended () {
      this.$refs.btn.run();
      this.disabled = false;
    },
    changePassword () {
      let user = this.user;
      let phoneRegex = /^1(3|4|5|7|8)\d{9}$/g;
      let passwordRegex = /^[a-zA-Z0-9]{4,}$/g;
      if (user.phone && phoneRegex.test(user.phone) && user.smsCode && user.password && passwordRegex.test(user.password)) {
        let url = host + 'account/' + user.phone + '/reset';
        let data = {password: user.password, code: user.smsCode};
        this.$http.post(url, data, {
          emulateJSON: true
        }).then(function (response) {
          let target = response.data;
          if (target.code === '100') {
            Toast({message: '修改密码成功', position: 'middle', duration: 2000});
          } else {
            Toast({message: '服务器异常', position: 'middle', duration: 2000});
          }
        }, function (response) {
        });
      }
    }
  },
  components: {
    timerBtn
  }
};
</script>

<style scoped>
.input{
  width:80%;
  margin: 120px auto;
}
.big-btn{
  float:left;
  margin-top: 50px;
  height:35px;
  font-size: 18px;
  background: #a61e42;
}
.btn-send{
  background: #a71e42;
  height: 40px;
  width: 90px;
  margin-top: 10px;
  font-size: 13px;
  color: #ffffff;
}
img{
  margin: 22px 20px 0 0;
  width: 25px;
  height: 15px;
}
</style>
