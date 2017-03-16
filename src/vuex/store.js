import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    storeInfo: String,
    currentConsumerInfo: String,
    selectProductInfo: String,
    selectProductItemsInfo: String,
    selectConsultInfo: String,
    selectSaleInfo: String,
    selectAddConsumer: Object,
    currentProductBTC: String,
    currentSaleItemInfo: String,
    currentSelectMaterial: String,
    currentConsumeInfo: Object,
    currentSaleRecord: Object
  },
  mutations: {
    SETSTOREINFO (state, storeInfo) {
      state.storeInfo = storeInfo;
    },
    SETCURRENTCONSUMERINFO (state, currentConsumerInfo) {
      state.currentConsumerInfo = currentConsumerInfo;
    },
    SETSELECTPRODUCTINFO (state, selectProductInfo) {
      state.selectProductInfo = selectProductInfo;
    },
    SELECTPRODUCTITEMSINFO (state, selectProductItemsInfo) {
      state.selectProductItemsInfo = selectProductItemsInfo;
    },
    SELECTCONSULTINFO (state, selectConsultInfo) {
      state.selectConsultInfo = selectConsultInfo;
    },
    SELECTSALEINFO (state, selectSaleInfo) {
      state.selectSaleInfo = selectSaleInfo;
    },
    SETADDCONSUMER (state, selectAddConsumer) {
      state.selectAddConsumer = selectAddConsumer;
    },
    SETCURRENTPRODUCTBTC (state, targetComponent) {
      state.currentProductBTC = targetComponent;
    },
    SETCURRENTSALEITEMINFO (state, currentSaleItemInfo) {
      state.currentSaleItemInfo = currentSaleItemInfo;
    },
    SETCURRENTSELECTMATERIAL (state, currentSelectMaterialInfo) {
      state.currentSelectMaterial = currentSelectMaterialInfo;
    },
    SETCURRENTCONSUMEINFO (state, currentConsumeInfo) {
      state.currentConsumeInfo = currentConsumeInfo;
    },
    SETCURRENTSALEFORM (state, currentSaleRecord) {
      state.currentSaleRecord = currentSaleRecord;
    },
    RESETSALEABOUT (state) {
      state.currentConsumerInfo = undefined;
      state.selectProductInfo = undefined;
      state.selectProductItemsInfo = undefined;
      state.selectConsultInfo = undefined;
      state.selectSaleInfo = undefined;
      state.selectAddConsumer = undefined;
      state.currentProductBTC = undefined;
      state.currentSaleItemInfo = undefined;
      state.currentSelectMaterial = undefined;
      state.currentConsumeInfo = undefined;
      state.currentSaleRecord = undefined;
    },
    RESET (state) {
      state.currentConsumerInfo = undefined;
      state.selectProductInfo = undefined;
      state.selectProductItemsInfo = undefined;
      state.selectConsultInfo = undefined;
      state.selectSaleInfo = undefined;
      state.selectAddConsumer = undefined;
    }
  },
  getters: {
    getStoreInfo: state => {
      return state.storeInfo;
    },
    getCurrentConsumerInfo: state => {
      return state.currentConsumerInfo;
    },
    getSelectProductInfo: state => {
      return state.selectProductInfo;
    },
    getSelectProductItemsInfo: state => {
      return state.selectProductItemsInfo;
    },
    getSelectConsultInfo: state => {
      return state.selectConsultInfo;
    },
    getSelectSaleInfo: state => {
      return state.selectSaleInfo;
    },
    getSelectAddConsumer: state => {
      return state.selectAddConsumer;
    },
    getCurrentProductBTC: state => {
      return state.currentProductBTC;
    },
    getCurrentSaleItemInfo: state => {
      return state.currentSaleItemInfo;
    },
    getCurrentSelectMaterial: state => {
      return state.currentSelectMaterial;
    },
    getCurrentConsumeInfo: state => {
      return state.currentConsumeInfo;
    },
    getCurrentSaleForm: state => {
      return state.currentSaleRecord;
    }
  }
});

export default store;
