var _ = require('lodash');
var commonSignalLength = 5;
module.exports = {
  getRandomSignal: function () {
    return _.map(_.range(commonSignalLength), function () {
      return Math.round(Math.random());
    });
  }
};
