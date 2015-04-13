var _ = require('lodash');

var sync = function (firstSeq, secondSeq, frequencyRate, appliedFn) {
  return _.map(_.range(firstSeq.length * frequencyRate), function (index) {
    var res = [firstSeq[Math.floor(index / frequencyRate) % firstSeq.length], secondSeq[index % secondSeq.length]];
    return _.isFunction(appliedFn) ? appliedFn.call(null, res) : res;
  });
};

module.exports = {
  sync: sync
};