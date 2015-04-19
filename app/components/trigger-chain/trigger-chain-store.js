var flux = require('flux-react');
var actions = require('./trigger-chain-actions');
var processTriggerChain = require('../../processing/trigger-chain');
var _ = require('lodash');
var chainInAction;
module.exports = flux.createStore({
  step: 0,
  chainLength: 0,
  feedbackTriggers: [],
  triggerValues: [],
  sequence: [],

  actions: [
    actions.initSequence,
    actions.changeLength,
    actions.changeStep,
    actions.returnSequence,
    actions.addTriggerToFeedback,
    actions.deleteTriggerFromFeedback
  ],

  initSequence: function () {
    chainInAction = processTriggerChain();
    chainInAction.initChain(this.chainLength, this.feedbackTriggers);
    chainInAction.set();
    this.triggerValues = chainInAction.getChainSnapshot();
    this.emitChange();
  },

  changeLength: function (length) {

    if (this.triggerValues.length != length) {
      this.triggerValues = _.map(_.range(length), function () {
        return 0;
      })
    }
    this.chainLength = length;
  },

  changeStep: function (step) {
    this.step = step;
    this.sequence.unshift(chainInAction.moveValueThroughChain());
    this.trueMSequence = chainInAction.isMSequence(this.sequence);
    this.triggerValues = chainInAction.getChainSnapshot();
    this.emitChange();
  },

  returnSequence: function (lastStep) {
    this.step = lastStep;
    this.sequence = chainInAction.getSequence();
    this.triggerValues = chainInAction.getChainSnapshot();
    this.emitChange();
  },

  addTriggerToFeedback: function (triggerNumber) {
    this.feedbackTriggers.push(triggerNumber);
  },

  deleteTriggerFromFeedback: function (triggerNumber) {
    this.feedbackTriggers = _.without(this.feedbackTriggers, triggerNumber);
  },

  exports: {
    getTriggerValues: function () {
      return this.triggerValues;
    },
    getSequence: function () {
      return this.sequence;
    },
    getStep: function () {
      return this.step;
    },
    getLength: function () {
      return this.chainLength;
    }
  }
});