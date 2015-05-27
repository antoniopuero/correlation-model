'use strict';
var flux = require('flux-react');
var actions = require('../actions/guessing-actions');
var _ = require('lodash');
var processTriggerChain = require('../processing/trigger-chain');
var signalHelpers = require('../processing/signal-helpers');
var triggerChainConst = require('../constants/trigger-chains');
var signalConst = require('../constants/signals');


module.exports = (function () {

  var firstRandomChain = triggerChainConst.getRandomChain(),
    firstRandomSignal = signalConst.getRandomSignal(),
    firstChainInAction = processTriggerChain(),
    secondRandomChain = triggerChainConst.getRandomChain(),
    secondRandomSignal = signalConst.getRandomSignal(),
    secondChainInAction = processTriggerChain(),
    dynamicChain = processTriggerChain(),
    firstRefSequence,
    secondRefSequence,
    mixedSignal;

  console.log(firstRandomSignal, secondRandomSignal);

  firstChainInAction.initChain.apply(firstChainInAction, firstRandomChain);
  firstChainInAction.set();
  firstRefSequence = firstChainInAction.getSequence();

  secondChainInAction.initChain.apply(secondChainInAction, secondRandomChain);
  secondChainInAction.set();
  secondRefSequence = secondChainInAction.getSequence();


  dynamicChain.initChain(firstRandomChain[0], [firstRandomChain[0]]); //last trigger is always in the circuit
  dynamicChain.set();

  mixedSignal = signalHelpers.addSignals([
    signalHelpers.transformBinaryData(signalHelpers.mixSignalWithMSequence(firstRandomSignal, firstRefSequence)),
    signalHelpers.transformBinaryData(signalHelpers.mixSignalWithMSequence(secondRandomSignal, secondRefSequence))
  ]);

  return flux.createStore({
    triggerChain: firstRandomChain,
    maxStep: Math.pow(2, firstRandomChain[0]) - 1,
    step: 0,
    sequence: [],
    firstRefSequence: firstRefSequence,
    signal: mixedSignal,
    correlation: [],
    isMSequence: false,
    hiddenButtons: true,
    newSequenceId: _.uniqueId('sequence_'),
    triggerValues: dynamicChain.getChainSnapshot(),
    feedbackTriggers: [firstRandomChain[0]],
    userInputSignals: [_.map(firstRandomSignal, () => ''), _.map(firstRandomSignal, () => '')],
    signalCorrectnessArray: ['', ''],
    actions: [
      actions.initSequence,
      actions.hideGetButtons,
      actions.addTriggerToFeedback,
      actions.deleteTriggerFromFeedback,
      actions.userChangeInputSignals
    ],

    clearSequence: function () {
      this.step = 0;
      this.sequence = [];
      this.isMSequence = false;
      this.correlation = [];
      this.hiddenButtons = false;
      this.newSequenceId = _.uniqueId('sequence_');
    },

    calculateCorrelation: function () {
      if (this.sequence.length) {
        this.isMSequence = signalHelpers.isMSequence(this.sequence);
        this.correlation = signalHelpers.correlation(mixedSignal, signalHelpers.transformBinaryData(this.sequence));
      }
    },

    //stepForward: function () {
    //  if (this.step < this.maxStep) {
    //    this.step += 1;
    //    this.sequence.unshift(dynamicChain.moveValueThroughChain());
    //    this.triggerValues = dynamicChain.getChainSnapshot();
    //    this.calculateCorrelation();
    //    this.emitChange();
    //  }
    //},

    initSequence: function () {
      this.clearSequence();
      dynamicChain = processTriggerChain();
      dynamicChain.initChain(firstRandomChain[0], this.feedbackTriggers);
      dynamicChain.set();
      this.triggerValues = dynamicChain.getChainSnapshot();
      this.sequence = dynamicChain.getSequence();
      this.triggerValues = dynamicChain.getChainSnapshot();
      this.calculateCorrelation();
      this.emitChange();
    },

    hideGetButtons: function () {
      this.hiddenButtons = true;
      this.emitChange();
    },

    addTriggerToFeedback: function (triggerNumber) {
      this.clearSequence();
      this.feedbackTriggers.push(triggerNumber);
      this.emitChange();
    },

    deleteTriggerFromFeedback: function (triggerNumber) {
      this.clearSequence();
      this.feedbackTriggers = _.without(this.feedbackTriggers, triggerNumber);
      this.emitChange();
    },

    userChangeInputSignals: function (signalIndex, userInputSignals) {
      var parsedSignal = _.map(userInputSignals[signalIndex], parseFloat);
      this.userInputSignals = userInputSignals;

      if (!_.any(parsedSignal, _.isNaN)) {
        if (_.isEqual(parsedSignal, firstRandomSignal) && _.indexOf(this.signalCorrectnessArray, 'first') === -1) {
          this.signalCorrectnessArray[signalIndex] = 'first';
        } else if (_.isEqual(parsedSignal, secondRandomSignal) && _.indexOf(this.signalCorrectnessArray, 'second') === -1) {
          this.signalCorrectnessArray[signalIndex] = 'second';
        } else {
          this.signalCorrectnessArray[signalIndex] = '';
        }
      } else {
        this.signalCorrectnessArray[signalIndex] = '';
      }

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
        return this.firstRefSequence;
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
      },
      getTriggerValues: function () {
        return this.triggerValues;
      },
      getFeedbackTriggers: function () {
        return this.feedbackTriggers;
      },
      getUserInputSignals: function () {
        return this.userInputSignals;
      },
      getSignalCorrectnessArray: function () {
        return this.signalCorrectnessArray;
      },
      allSignalsAreCorrect: function () {
        return _.reduce(this.signalCorrectnessArray, function (acc, correct) {
          return acc && correct;
        }, true);
      }
    }
  });
})();