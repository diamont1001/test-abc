'use strict';

module.exports = {
  /* eslint-disable */
  /**
   * 时间戳格式化函数
   * @param  {string} format  格式 如'Y-m-d H:i:s'
   *   Year -
   *     L: 闰年（0/1）
   *     Y: 年份（数字4位），比如：2016
   *     y: 年份（数字2位），比如：16
   *
   *   Month -
   *     F: 月份（英文全写），比如：January
   *     M: 月份（英文缩写3个字母），比如：Sep
   *     m: 月份（01 ~ 12）
   *     n: 月份（1 ~ 12）
   *     t: 该月拥有天数（28 ~ 31）
   *
   *   Week -
   *     W: 第几个星期（0~52）
   *
   *   Day -
   *     d: 日期-天（01 ~ 31）
   *     j: 日期-天（1 ~ 31）
   *     S: 日期-天的英文后缀，比如：th, nd, st, rd, st
   *     l: 星期几（英文全写），比如：Tuesday
   *     D: 星期几（英文缩写3个字母），比如：Thu
   *     w: 一周的第几天（0 ~ 6）
   *     N: 一周的第几天（1 ~ 7）
   *     z: 一年的第几天（0 ~ 365）
   *
   *   Time -
   *     a: am / pm
   *     A: AM / PM
   *     H: 小时（00 ~ 23）
   *     h: 小时（01 ~ 12）
   *     G: 小时（0 ~ 23）
   *     g: 小时（1 ~ 12）
   *     i: 分钟（00 ~ 59）
   *     s: 秒（00 ~ 59）
   *     B: 未知
   *
   *   Timezone(时区) -
   *     O: +数字，比如：正八区为 +0800
   *     P: +数字:数字，比如：正八区为 +08:00
   *
   *   other -
   *     c: Full Date/Time，比如：2006-12-31T12:13:00+08:00
   *     U: 时间戳（秒）
   *
   * @param  {int}  timestamp 要格式化的时间戳 默认为当前时间
   * @return {string}      格式化后的时间字符串
   */
  stampFormat2Date(format, timestamp) {
    timestamp = timestamp <= 9999999999 ? timestamp * 1000 : timestamp; // 兼容传进来timestamp的单位是s的情况

    const jsdate = ((timestamp) ? new Date(timestamp) : new Date());
    const pad = function(n, c) {
      if ((n = n + '').length < c) {
        return new Array(++c - n.length).join('0') + n;
      }
      return n;

    };
    const txt_weekdays = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
    const txt_ordin = {
      1: 'st',
      2: 'nd',
      3: 'rd',
      21: 'st',
      22: 'nd',
      23: 'rd',
      31: 'st',
    };
    const txt_months = [ '', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
    var f = {
      // Day
      d() {
        return pad(f.j(), 2);
      },
      D() {
        return f.l().substr(0, 3);
      },
      j() {
        return jsdate.getDate();
      },
      l() {
        return txt_weekdays[f.w()];
      },
      N() {
        return f.w() + 1;
      },
      S() {
        return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th';
      },
      w() {
        return jsdate.getDay();
      },
      z() {
        return (jsdate - new Date(jsdate.getFullYear() + '/1/1')) / 864e5 >> 0; // eslint-disable-line no-bitwise
      },

      // Week
      W() {
        let a = f.z(),
          b = 364 + f.L() - a;
        let nd2,
          nd = (new Date(jsdate.getFullYear() + '/1/1').getDay() | 7) - 1;
        if (b <= 2 && ((jsdate.getDay() | 7) - 1) <= 2 - b) {
          return 1;
        }
        if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
          nd2 = new Date(jsdate.getFullYear() - 1 + '/12/31');
          return this.ctx.helper.stampFormat2Date('W', Math.round(nd2.getTime() / 1000));
        }
        return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0); // eslint-disable-line no-bitwise


      },

      // Month
      F() {
        return txt_months[f.n()];
      },
      m() {
        return pad(f.n(), 2);
      },
      M() {
        return f.F().substr(0, 3);
      },
      n() {
        return jsdate.getMonth() + 1;
      },
      t() {
        let n;
        if ((n = jsdate.getMonth() + 1) === 2) {
          return 28 + f.L();
        }
        if (n & 1 && n < 8 || !(n & 1) && n > 7) {
          return 31;
        }
        return 30;


      },

      // Year
      L() {
        const y = f.Y();
        return ((y % 4 === 0) && (y % 100 !== 0 || y % 400 === 0)) ? 1 : 0; // 四年一闰，百年不闰，四百年再闰
      },
      // o not supported yet
      Y() {
        return jsdate.getFullYear();
      },
      y() {
        return (jsdate.getFullYear() + '').slice(2);
      },

      // Time
      a() {
        return jsdate.getHours() > 11 ? 'pm' : 'am';
      },
      A() {
        return f.a().toUpperCase();
      },
      B() {
        // peter paul koch:
        const off = (jsdate.getTimezoneOffset() + 60) * 60;
        const theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
        let beat = Math.floor(theSeconds / 86.4);
        if (beat > 1000) beat -= 1000;
        if (beat < 0) beat += 1000;
        if ((String(beat)).length === 1) beat = '00' + beat;
        if ((String(beat)).length === 2) beat = '0' + beat;
        return beat;
      },
      g() {
        return jsdate.getHours() % 12 || 12;
      },
      G() {
        return jsdate.getHours();
      },
      h() {
        return pad(f.g(), 2);
      },
      H() {
        return pad(jsdate.getHours(), 2);
      },
      i() {
        return pad(jsdate.getMinutes(), 2);
      },
      s() {
        return pad(jsdate.getSeconds(), 2);
      },
      // u not supported yet

      // Timezone
      // e not supported yet
      // I not supported yet
      O() {
        let t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4);
        if (jsdate.getTimezoneOffset() > 0) t = '-' + t;
        else t = '+' + t;
        return t;
      },
      P() {
        const O = f.O();
        return (O.substr(0, 3) + ':' + O.substr(3, 2));
      },
      // T not supported yet
      // Z not supported yet

      // Full Date/Time
      c() {
        return f.Y() + '-' + f.m() + '-' + f.d() + 'T' + f.h() + ':' + f.i() + ':' + f.s() + f.P();
      },
      // r not supported yet
      U() {
        return Math.round(jsdate.getTime() / 1000);
      },
    };

    return format.replace(/[\\]?([a-zA-Z])/g, function(t, s) {
      let ret;

      if (t !== s) {
        // escaped
        ret = s;
      } else if (f[s]) {
        // a date function exists
        ret = f[s]();
      } else {
        // nothing special
        ret = s;
      }
      return ret;
    });
  },

  /* eslint-enable */


  // 数组去重
  deduplicates(array) {
    return Array.from(new Set(array));
  },
};
