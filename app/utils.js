'use strict';

var _ = require('lodash');


module.exports = {
  objectDiff: function (firstObj, secondObj) {
    var resultObj = {};

    _.each(firstObj, function (value, key) {
      if (!_.isEqual(secondObj[key], value)) {
        resultObj[key] = value;
      }
    });

    return resultObj;
  }
};