import Vue from 'vue';
import Router from 'vue-router';
import Resource from 'vue-resource';
import welcome from '../components/login/Hello';
import login from '../components/login/login';
import forget from '../components/login/forget';
import home from '../components/home/home';
import chooseStore from '../components/home/chooseStore';
import sale from '../components/sale/sale';
import saleSubmit from '../components/sale/saleSubmit';
import productItem from '../components/sale/productItem';
import chooseProduct from '../components/sale/chooseProduct';
import salesStatistics from '../components/sale/salesStatistics';
import consume from '../components/consume/consume';
import addConsume from '../components/consume/addConsume';
import addMaterial from '../components/consume/addMaterial';
import chooseMaterial from '../components/consume/chooseMaterial';
import owe from '../components/owe/owe';
import returns from '../components/return/return';
import chooseEmployee from '../components/common/chooseEmployee';
import chooseUser from '../components/common/chooseUser';
import saleItem from '../components/common/saleItem';
import newUser from '../components/common/newUser';
import {LOGIN, SALERECORD, CONSUMERADD, RETURNADD, SALERECORDADD, OWNRECORDADD, USERRECORDADD, CUSTOMERACCOUNT} from '../common/js/const';
import { Indicator } from 'mint-ui';
Vue.use(Router);
Vue.use(Resource);
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: welcome
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/sale',
      name: 'sale',
      component: sale
    },
    {
      path: '/chooseUser',
      name: 'chooseUser',
      component: chooseUser
    },
    {
      path: '/newUser',
      name: 'newUser',
      component: newUser
    },
    {
      path: '/forget',
      name: 'forget',
      component: forget
    },
    {
      path: '/chooseEmployee',
      name: 'chooseEmployee',
      component: chooseEmployee
    },
    {
      path: '/saleSubmit',
      name: 'saleSubmit',
      component: saleSubmit
    },
    {
      path: '/productItem',
      name: 'productItem',
      component: productItem
    },
    {
      path: '/chooseProduct',
      name: 'chooseProduct',
      component: chooseProduct
    },
    {
      path: '/consume',
      name: 'consume',
      component: consume
    },
    {
      path: '/addConsume',
      name: 'addConsume',
      component: addConsume
    },
    {
      path: '/addMaterial',
      name: 'addMaterial',
      component: addMaterial
    },
    {
      path: '/chooseMaterial',
      name: 'chooseMaterial',
      component: chooseMaterial
    },
    {
      path: '/returns',
      name: 'returns',
      component: returns
    },
    {
      path: '/saleItem',
      name: 'saleItem',
      component: saleItem
    },
    {
      path: '/owe',
      name: 'owe',
      component: owe
    },
    {
      path: '/chooseStore',
      name: 'chooseStore',
      component: chooseStore
    },
    {
      path: '/salesStatistics',
      name: 'salesStatistics',
      component: salesStatistics
    }
  ]
});
Vue.http.interceptors.push((request, next) => {
  let url = request.url;
  if (String(url).indexOf(LOGIN) >= 0 ||
    String(url).indexOf(SALERECORD) >= 0 || String(url).indexOf(CUSTOMERACCOUNT) >= 0) {
    Indicator.open({text: '加载中', spinnerType: 'fading-circle'});
  } else if (String(url).indexOf(CONSUMERADD) >= 0 || String(url).indexOf(OWNRECORDADD) >= 0 || String(url).indexOf(SALERECORDADD) >= 0 || String(url).indexOf(RETURNADD) >= 0 || String(url).indexOf(USERRECORDADD) >= 0) {
    Indicator.open({text: '提交中', spinnerType: 'fading-circle'});
  }
  next((response) => {
    Indicator.close();
    return response;
  });
});
export default router;
