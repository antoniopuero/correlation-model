var flux = require('flux-react');
var actions = require('./actions.js');
var _ = require('lodash');

module.exports = flux.createStore({
  triggerChain: [],
  step: 0,
  sequence: [],
  initNewSequence: '',
  isMSequence: false,
  actions: [
    actions.stepForward,
    actions.lastStep,
    actions.initChainConf,
    actions.updateSequence,
    actions.initSequence
  ],

  initChainConf: function (chainConf) {
    this.triggerChain = chainConf;
    this.maxStep = Math.pow(2, chainConf[0]) - 1;
  },

  stepForward: function () {
    if (this.step < this.maxStep) {
      this.step += 1;
      this.emitChange();
    }
  },

  lastStep: function () {
    this.step = this.maxStep;
    this.emitChange();
  },

  updateSequence: function (value, isMSequence) {
    if (_.isArray(value)) {
      this.sequence = value;
    } else {
      this.sequence.unshift(value);
    }
    this.isMSequence = isMSequence;
    this.emitChange();
  },

  initSequence: function () {
    this.step = 0;
    this.sequence = [];
    this.isMSequence = false;
    this.initNewSequence = _.uniqueId('sequence_');
    this.emitChange();
  },

  exports: {
    getChainConf: function () {
      return this.triggerChain;
    },
    getStep: function () {
      return this.step;
    },
    getSequence: function () {
      return this.sequence;
    },
    getMaxStep: function () {
      return this.maxStep;
    },
    isMSequence: function () {
      return this.isMSequence
    },
    getUniqueId: function () {
      return this.initNewSequence
    }
  }
});