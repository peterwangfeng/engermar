import Vue from 'vue';
import Router from 'vue-router';
import Resource from 'vue-resource';
import Hello from '../components/Hello';
import home from '../project/home';
import sale from '../components/children/sale';
import chooseUser from '../components/children/chooseUser';
import newUser from '../components/children/newUser';
import forget from '../components/children/forget';
import chooseEmployee from '../components/children/chooseEmployee';
import saleSubmit from '../components/children/saleSubmit';
import productItem from '../components/children/productItem';
import chooseProduct from '../components/children/chooseProduct';
import consume from '../components/children/consume';
import addConsume from '../components/children/addConsume';
import addMaterial from '../components/children/addMaterial';
import chooseMaterial from '../components/children/chooseMaterial';
import returns from '../components/children/return';
import saleItem from '../components/children/saleItem';
import owe from '../components/children/owe';
import chooseStore from '../components/children/chooseStore';
import chooseUserSale from '../components/children/chooseUser-sale';
import newUserSale from '../components/children/newUserSale';
import salesStatistics from '../components/children/sales statistics';
import login from '../components/login';
import {LOGIN, CONSUMER, SALERECORD, PRODUCTITEMS} from '../common/js/const';
import { Indicator } from 'mint-ui';
Vue.use(Router);
Vue.use(Resource);
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
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
      path: '/chooseUserSale',
      name: 'chooseUserSale',
      component: chooseUserSale
    },
    {
      path: '/newUserSale',
      name: 'newUserSale',
      component: newUserSale
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
  if (String(url).indexOf(LOGIN) >= 0 || String(url).indexOf(CONSUMER) >= 0 ||
    String(url).indexOf(SALERECORD) >= 0 || String(url).indexOf(PRODUCTITEMS) >= 0) {
    Indicator.open({text: '加载中', spinnerType: 'fading-circle'});
  }
  next((response) => {
    Indicator.close();
    return response;
  });
});
export default router;
