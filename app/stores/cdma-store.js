'use strict';
var flux = require('flux-react');
var actions = require('../actions/cdma-actions');
var _ = require('lodash');
var processTriggerChain = require('../processing/trigger-chain');
var signalHelpers = require('../processing/signal-helpers');
var signalConst = require('../constants/signals');


module.exports = (function () {

  var firstRandomChain = [5, [2, 5]],
    firstRandomSignal = signalConst.getRandomSignal(),
    firstChainInAction = processTriggerChain(),
    secondRandomChain = [5, [3, 5]],
    secondRandomSignal = signalConst.getRandomSignal(),
    secondChainInAction = processTriggerChain(),
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


  mixedSignal = signalHelpers.addSignals([
    signalHelpers.mixSignalWithMSequence(firstRandomSignal, firstRefSequence),
    signalHelpers.mixSignalWithMSequence(secondRandomSignal, secondRefSequence)
  ]);

  return flux.createStore({
    triggerChain: firstRandomChain,
    signal: mixedSignal,
    correlation: [],
    actions: [
    ],

    calculateCorrelation: function () {
      if (this.sequence.length) {
        this.isMSequence = signalHelpers.isMSequence(this.sequence);
        this.correlation = signalHelpers.correlation(signalHelpers.transformBinaryData(this.signal), signalHelpers.transformBinaryData(this.sequence));
      }
    },

    exports: {

    }
  });
})();