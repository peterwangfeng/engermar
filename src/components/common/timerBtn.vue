<template>
  <mt-button :disabled="disabled || time > 0 ">{{text}}</mt-button>
</template>

<script>
export default {
  name: 'timerBtn',
  props: {
    second: {
      type: Number,
      default: 60
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      time: 0
    };
  },
  methods: {
    run () {
      this.time = this.second;
      this.timer();
    },
    timer () {
      if (this.time > 0) {
        this.time--;
        setTimeout(this.timer, 1000);
      }
    }
  },
  computed: {
    text () {
      return this.time > 0 ? this.time + 's' : '获取验证码';
    }
  }
};
</script>
