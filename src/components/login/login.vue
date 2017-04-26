<template>
  <div class="login">
    <img class="login"  src="../../assets/logo.png">
    <div class="input">
      <mt-field label="工 号" placeholder="请输入工号" type="text" v-model="user.workcode"></mt-field><i class="fa fa-user"></i>
      <mt-field label="密 码" placeholder="请输入密码" type="password" v-model="user.password"></mt-field><i class="fa fa-lock"></i>
      <router-link to="/forget" slot="right" class="forget">忘记密码</router-link>
      <mt-button type="primary" size="large" class="big-btn" @click="checkUser">登 录</mt-button>
    </div>
  </div>
</template>
<script>
import { host } from '../../common/js/const';
import router from '../../router/index.js';
import { MessageBox } from 'mint-ui';
export default {
  name: 'hello',
  data () {
    return {
      user: {
        workcode: '',
        password: ''
      }
    };
  },
  beforeRouteLeave (to, from, next) {
    this.user.workcode = '';
    this.user.password = '';
    next(true);
  },
  methods: {
    checkUser () {
      let self = this;
      let user = self.user;
      let regex = /[a-zA-Z0-9]/g;
      let testResult = regex.test(user.workcode);
      let url = host + 'account/login';
      if (user.workcode !== '' && testResult && user.password !== '') {
        self.$http.post(url, {workcode: user.workcode, password: user.password}, {emulateJSON: true
        }).then(function (response) {
          let target = response.data;
          if (target.code === '100') {
            let data = target.data;
            if (data) {
              let loginUser = data.loginUser;
              if (user.workcode === loginUser.workcode) {
                window.sessionStorage.setItem('userId', loginUser.id);
                router.push({path: '/home'});
              }
            }
          } else if (target.code === '2001') {
            MessageBox({title: '', message: '用户不存在'});
          } else if (target.code === '2002') {
            MessageBox({title: '', message: '密码错误'});
          } else if (target.code === '2011') {
            MessageBox({title: '', message: '非在职员工'});
          }
        }, function (response) {
        });
      } else if (!testResult) {
        MessageBox({title: '', message: '用户名不存在'});
      } else {
        MessageBox({title: '', message: '用户名和密码不能为空'});
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login{
  text-align: center;
  width: 100%;
}
img.login{
  margin: 80px 0 50px 0;
  width: 175px;
  height: 175px;
}

.input{
  width:80%;
  margin: 0 auto;
  font-size: 14px;
  position: relative;
}

.big-btn{
  float:left;
  margin-top: 30px;
  height:40px;
  font-size: 18px;
  background: #a71e42;
}
.forget{
  float:right;
  margin-top: 15px;
  color:#a71e42;
}
i.fa-user{
  color: #a71e42;
  position: absolute;
  left: 8px;
  top: 24px;
}
i.fa-lock{
  color: #a71e42;
  position: absolute;
  left: 8px;
  top: 84px;
}
</style>
