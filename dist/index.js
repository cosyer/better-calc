(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
    ? define(factory)
    : (global.Calc = factory());
})(this, function() {
  "use strict";
  /*
   * 将浮点数转换成字符串，通过字符串replace方法去掉小数点，放大倍数, 不能直接通过乘以某个数放大。
   * 这个方案有缺点就是本来js中最大值是2的53次方，由于要放大倍数，会受到最大安全值的限制。
   */
  function isUndef(v) {
    return v === undefined || v === null;
  }

  const Calc = {
    add(a, b) {
      let isNotANumber =
        isUndef(a) || isUndef(b) || isNaN(a - 0) || isNaN(b - 0);
      if (isNotANumber) {
        return NaN;
      }
      let aArr = a.toString().split(".");
      let bArr = b.toString().split(".");
      let p1 = (aArr[1] && aArr[1].replace(/0*$/, "").length) || 0;
      let p2 = (bArr[1] && bArr[1].replace(/0*$/, "").length) || 0;
      // 加法中，加数和被加数要同时放大10的n次方倍，最后结果除以10的n次方倍，n为最多位数。
      let maxPoint = Math.max(p1, p2);
      let subPoint = p1 - p2;
      let c = parseInt(a.toString().replace(/\./, ""));
      let d = parseInt(b.toString().replace(/\./, ""));
      if (subPoint > 0) {
        // 第一个数的小数点位多，后一位数要补0
        d = d * Math.pow(10, subPoint);
      } else if (subPoint < 0) {
        // 第二个数的小数点位多，第一个数要补0
        c = c * Math.pow(10, -subPoint);
      }
      return (c + d) / Math.pow(10, maxPoint);
    },

    sub(a, b) {
      return this.add(a, -b);
    },

    mul(a, b) {
      let isNotANumber =
        isUndef(a) || isUndef(b) || isNaN(a - 0) || isNaN(b - 0);
      if (isNotANumber) {
        return NaN;
      }
      let aArr = a.toString().split(".");
      let bArr = b.toString().split(".");
      // 存储每个数小数点后的位数
      let p1 = (aArr[1] && aArr[1].replace(/0*$/, "").length) || 0;
      let p2 = (bArr[1] && bArr[1].replace(/0*$/, "").length) || 0;
      // 乘法中，乘数放大10的n次方倍，被乘数放大10的n次方倍，最后结果要除以10的(m+n)次方倍
      let addPoint = p1 + p2;
      let c = parseInt(a.toString().replace(/\./, ""));
      let d = parseInt(b.toString().replace(/\./, ""));
      return (c * d) / Math.pow(10, addPoint);
    },

    div(a, b) {
      let isNotANumber =
        isUndef(a) || isUndef(b) || isNaN(a - 0) || isNaN(b - 0);
      if (isNotANumber) {
        return NaN;
      }
      let aArr = a.toString().split(".");
      let bArr = b.toString().split(".");
      // 存储每个数小数点后的位数
      let p1 = (aArr[1] && aArr[1].replace(/0*$/, "").length) || 0;
      let p2 = (bArr[1] && bArr[1].replace(/0*$/, "").length) || 0;

      // 除法中，除数放大10的m次方倍，被除数放大10的n次方倍，最后结果要除以10的(m-n)次方倍
      let subPoint = p1 - p2;
      let c = parseInt(a.toString().replace(/\./, ""));
      let d = parseInt(b.toString().replace(/\./, ""));
      return c / d / Math.pow(10, subPoint);
    }
  };

  return Calc;
});
