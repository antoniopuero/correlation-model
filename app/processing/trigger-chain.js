var _ = require('lodash');
var triggerEntity = require('./trigger');

var feedbackFunction = function (values) {
  return _.reduce(values, function (result, value) {
    return result ^ value;
  });
};

module.exports = function () {
  var triggers = [];
  var feedback;

  var initChain = function (triggersNumber, triggerIndexes) {
    for (var i =0; i < triggersNumber; i+= 1) {
      addTriggers(triggerEntity());
    }
    feedback = feedBackInit(triggerIndexes, feedbackFunction);
  };

  var addTriggers = function (newTriggers) {
    if (_.isObject(newTriggers)) {
      triggers.push(newTriggers);
    } else if (_.isArray(newTriggers)) {
      triggers = triggers.concat(newTriggers);
    } else {
      throw new Error('unsupported type of trigger');
    }
  };

  var feedBackInit = function (triggerIndexes, feedbackFunction) {
    return function () {

      var values = _.map(triggerIndexes, function (index) {
        return getTriggerValue(index - 1);
      });

      return feedbackFunction.call(this, values);
    }
  };

  var moveValueThroughChain = function () {
    _.each(triggers, function (trigger, index) {
      if (index == 0) {
        trigger.setValue(feedback());
      } else {
        trigger.setValue(triggers[index - 1].getValue());
      }
    });

    return _.last(triggers).getValue();
  };

  var getTriggerValue = function (index) {
    if (!triggers[index]) {
      throw new Error('out of range');
    } else {
      return triggers[index].getWithoutReassign();
    }
  };

  var getSequence = function () {
    var resultSequence = [];

    for (var i = 0, max = Math.pow(2, triggers.length) - 1; i < max; i += 1) {
      resultSequence.unshift(moveValueThroughChain());
    }
    return resultSequence;
  };

  var set = function () {
    _.each(triggers, function (trigger) {
      trigger.set();
    });
  };

  var reset = function () {
    _.each(triggers, function (trigger) {
      trigger.reset();
    });
  };

  var getChainLength = function () {
    return triggers.length;
  };

  var getChainSnapshot = function () {
    return _.map(triggers, function (val, index) {
      return getTriggerValue(index);
    });
  };

  return {
    initChain: initChain,
    addTriggers: addTriggers,
    moveValueThroughChain: moveValueThroughChain,
    getTriggerValue: getTriggerValue,
    set: set,
    reset: reset,
    getSequence: getSequence,
    getChainLength: getChainLength,
    getChainSnapshot: getChainSnapshot
  }
};