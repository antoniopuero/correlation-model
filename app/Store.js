'use strict';
var flux = require('flux-react');
var actions = require('./actions.js');
var _ = require('lodash');
var processTriggerChain = require('./processing/trigger-chain');
var signalHelpers = require('./processing/signal-helpers');
var triggerChainConst = require('./constants/trigger-chains');
var signalConst = require('./constants/signals');


module.exports = (function () {

  var randomChain = triggerChainConst.getRandomChain(),
    randomSignal = signalConst.getRandomSignal(),
    chainInAction = processTriggerChain(),
    refSequence;

  chainInAction.initChain.apply(chainInAction, randomChain);
  chainInAction.set();
  refSequence = chainInAction.getSequence();

  return flux.createStore({
    triggerChain: randomChain,
    maxStep: Math.pow(2, randomChain[0]) - 1,
    step: 0,
    sequence: [],
    refSequence: refSequence,
    signal: signalHelpers.mixSignalWithMSequence(randomSignal, refSequence),
    correlation: [],
    isMSequence: false,
    hiddenButtons: true,
    newSequenceId: '',
    actions: [
      actions.stepForward,
      actions.lastStep,
      actions.updateSequence,
      actions.initSequence,
      actions.hideGetButtons
    ],

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

    updateSequence: function (value) {
      if (_.isArray(value)) {
        this.sequence = value;
      } else {
        this.sequence.unshift(value);
      }

      this.isMSequence = chainInAction.isMSequence(this.sequence);
      if (this.sequence.length && this.isMSequence) {
        this.correlation = signalHelpers.correlation(this.signal, this.sequence);
      }
      this.emitChange();
    },

    initSequence: function () {
      this.step = 0;
      this.sequence = [];
      this.isMSequence = false;
      this.hiddenButtons = false;
      this.newSequenceId = _.uniqueId('sequence_');
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
        return this.newSequenceId;
      },
      getHidden: function () {
        return this.hiddenButtons;
      },
      getSignal: function () {
        return this.signal;
      },
      getCorrelation: function () {
        return this.correlation;
      }
    }
  });
})();