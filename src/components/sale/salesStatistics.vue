<template>
  <div class="container">
    <mt-header title="销售统计">
      <router-link to="/home" slot="left">
        <mt-button><i class="fa fa-chevron-left"></i></mt-button>
      </router-link>
    </mt-header>
    <table class="table">
      <tr>
        <td><date></date></td>
        <td></td>
      </tr>
      <tr>
        <td>销售（成交）</td>
        <td v-text="salesStatistics.salesTurnOver"></td>
      </tr>
      <tr>
        <td>销售（实收）</td>
        <td v-text="salesStatistics.salesPaid"></td>
      </tr>
      <tr>
        <td>消耗</td>
        <td v-text="salesStatistics.consumes"></td>
      </tr>
      <tr>
        <td>客人数</td>
        <td v-text="salesStatistics.customers"></td>
      </tr>
      <tr>
        <td>项目种数</td>
        <td v-text="salesStatistics.treatmentType"></td>
      </tr>
      <tr>
        <td>项目次数</td>
        <td v-text="salesStatistics.treatmentTimes"></td>
      </tr>
      <tr>
        <td>耗材种类</td>
        <td v-text="salesStatistics.materialType"></td>
      </tr>
      <tr>
        <td>耗材数量</td>
        <td v-text="salesStatistics.materialAmount"></td>
      </tr>
    </table>
  </div>
</template>

<script>
import date from '../common/date';
export default {
  name: 'chooseUser',
  props: 'msg',
  components: {
    date
  },
  data () {
    return {
      salesStatistics: {
        salesTurnOver: '暂无',
        salesPaid: '暂无',
        consumes: '暂无',
        customers: '暂无',
        treatmentType: '暂无',
        treatmentTimes: '暂无',
        materialType: '暂无',
        materialAmount: '暂无'
      }
    };
  },
  methods: {
    userReturn () {
    }
  }
};
</script>

<style lang="scss" scoped>
.container{
 text-align: center;
}
.table{
  border-collapse: collapse;
  width:100%;
  font-size:14px;
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
