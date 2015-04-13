var flux = require('flux-react');
var actions = require('./trigger-chain-actions');
var processTriggerChain = require('../../processing/trigger-chain');
var chainInAction;
module.exports = flux.createStore({
  step: 0,
  triggerValues: [],
  sequence: [],
  trueMSequence: false,

  actions: [
    actions.initSequence,
    actions.changeStep,
    actions.returnSequence
  ],

  initSequence: function (config) {
    chainInAction = processTriggerChain.initChain.apply(processTriggerChain, config);
    chainInAction.set();
    this.triggerValues = chainInAction.getChainSnapshot();
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
    this.trueMSequence = chainInAction.isMSequence(this.sequence);
    this.emitChange();
  },

  exports: {
    getTriggerValues: function () {
      return this.triggerValues;
    },
    getSequence: function () {
      return this.sequence;
    },
    isMSequence: function () {
      return this.trueMSequence;
    },
    getStep: function () {
      return this.step;
    }
  }
});