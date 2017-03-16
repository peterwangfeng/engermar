<template>
  <span>{{date()}}</span>
</template>

<script>
import DateUtil from '../../common/js/DateUtil';
export default {
  name: 'date',
  data () {
    return {
    };
  },
  methods: {
    date () {
      return DateUtil.getNow();
    }
  }
};
</script>
