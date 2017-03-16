const dateUtil = {
  format: function (n) {
    if (n) {
      return String(n).length > 1 ? n : '0' + n;
    }
  },
  getNow: function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = Number(date.getMonth() + 1);
    var day = date.getDate();
    return year + '-' + this.format(month) + '-' + this.format(day);
  }
};

export default dateUtil;
