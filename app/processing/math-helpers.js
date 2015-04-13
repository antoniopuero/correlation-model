var _ = require('lodash');

module.exports = {
  xor: function (values) {
    return _.reduce(values, function (result, val) {
      return result ^ val;
    });
  },
  multiply: function (values) {
    return _.reduce(values, function (result, val) {
      return result * val;
    });
  },
  add: function (val1, val2) {
    return val1 + val2;
  },
  sign: function (x) {
    return x ? x < 0 ? -1 : 1 : 0;
  },

  findTheCloserBinary: function (length) {
    var n = 0;
    while (Math.pow(2, n) <= length - 1) {
      if (length - 1 <= Math.pow(2, n + 1)) {
        break;
      }
      n += 1;
    }
    return Math.pow(2, n + 1);
  }
};