var flux = require('flux-react');
var actions = require('./actions.js');
var _ = require('lodash');
var processTriggerChain = require('./processing/trigger-chain');
var chainInAction;

module.exports = flux.createStore({
  triggerChain: [],
  step: 0,
  sequence: [],
  refSequence: [],
  initNewSequence: '',
  isMSequence: false,
  hiddenButtons: true,
  actions: [
    actions.stepForward,
    actions.lastStep,
    actions.initChainConf,
    actions.updateSequence,
    actions.initSequence,
    actions.hideGetButtons
  ],

  initChainConf: function (chainConf) {
    chainInAction = processTriggerChain();
    chainInAction.initChain.apply(chainInAction, chainConf);
    chainInAction.set();
    this.triggerChain = chainConf;
    this.maxStep = Math.pow(2, chainConf[0]) - 1;
    this.refSequence = chainInAction.getSequence();
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
    this.hiddenButtons = false;
    this.initNewSequence = _.uniqueId('sequence_');
    this.emitChange();
  },

  hideGetButtons: function () {
    this.hiddenButtons = true;
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
    getRefSequence: function () {
      return this.refSequence;
    },
    getMaxStep: function () {
      return this.maxStep;
    },
    isMSequence: function () {
      return this.isMSequence
    },
    getUniqueId: function () {
      return this.initNewSequence
    },
    getHidden: function () {
      return this.hiddenButtons;
    }
  }
});