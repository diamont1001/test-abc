export default {
  sleepAsync: async(ms=1000) => {
    return new Promise(resolve => {
      setTimeout(()=> {
        resolve();
      }, ms);
    });
  },

  // 数字单位格式化（万、亿）
  numberFormat: (number) => {
    try {
      let tmp = parseInt(number);
      if (tmp === 0 || isNaN(tmp)) {
        return '0';
      }
      if (tmp < 10000) {
        return number + '';
      }
      tmp = Math.floor((tmp / 10000 + 0.05) * 10) / 10;
      if (tmp < 10000) {
        return tmp + '万';
      }
      tmp = Math.floor((tmp / 10000 + 0.05) * 10) / 10;
      return tmp + '亿';
    } catch (e) {
      return number + '';
    }
  },
};