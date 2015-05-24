'use strict';
var flux = require('flux-react');
var actions = require('../actions/cdma-actions');
var _ = require('lodash');
var processTriggerChain = require('../processing/trigger-chain');
var signalHelpers = require('../processing/signal-helpers');


module.exports = (function () {

  var firstChain = [5, [2, 5]],
    firstSignal = [1, 0, 1, 1, 0],
    firstChainInAction = processTriggerChain(),
    secondRandomChain = [5, [3, 5]],
    secondSignal = [1, 1, 0, 1, 0],
    secondChainInAction = processTriggerChain(),
    carrier = signalHelpers.generateSin(10),
    firstRefSequence,
    secondRefSequence,
    firstSignalOnCarrier,
    secondSignalOnCarrier,
    firstSignalWithSequence,
    secondSignalWithSequence,
    mixedSignal,
    mixedSignalWithNoise;

  firstChainInAction.initChain.apply(firstChainInAction, firstChain);
  firstChainInAction.set();
  firstRefSequence = firstChainInAction.getSequence();

  secondChainInAction.initChain.apply(secondChainInAction, secondRandomChain);
  secondChainInAction.set();
  secondRefSequence = secondChainInAction.getSequence();

  firstSignalWithSequence = signalHelpers.mixSignalWithMSequence(firstSignal, firstRefSequence);
  secondSignalWithSequence = signalHelpers.mixSignalWithMSequence(secondSignal, secondRefSequence);

  firstSignalOnCarrier = signalHelpers.addCarrier(signalHelpers.transformBinaryData(firstSignalWithSequence), carrier, carrier.length);

  secondSignalOnCarrier = signalHelpers.addCarrier(signalHelpers.transformBinaryData(secondSignalWithSequence), carrier, carrier.length);


  mixedSignal = signalHelpers.addSignals([
    firstSignalOnCarrier,
    secondSignalOnCarrier
  ]);

  mixedSignalWithNoise = signalHelpers.addRandomNoise(mixedSignal, 1);

  var firstSignalCorrelation = signalHelpers.multiplyWithCarrier(signalHelpers.correlation(mixedSignalWithNoise, signalHelpers.addCarrier(signalHelpers.transformBinaryData(firstRefSequence), carrier, carrier.length)), carrier);

  var secondSignalCorrelation = signalHelpers.multiplyWithCarrier(signalHelpers.correlation(mixedSignalWithNoise, signalHelpers.addCarrier(signalHelpers.transformBinaryData(secondRefSequence), carrier, carrier.length)), carrier);


  return flux.createStore({
    triggerChain: firstChain,
    signal: firstSignal,
    sequence: firstRefSequence,
    signalWithSequence: firstSignalWithSequence,
    carrier: carrier,
    firstSignalOnCarrier: firstSignalOnCarrier,
    secondSignalOnCarrier: secondSignalOnCarrier,
    mixedSignal: mixedSignal,
    mixedSignalWithNoise: _.flatten(mixedSignalWithNoise),
    firstSignalCorrelation: firstSignalCorrelation,
    secondSignalCorrelation: secondSignalCorrelation,
    firstPhase: 0,
    secondPhase: 0,
    actions: [
      actions.updatePhaseFirstSignal,
      actions.updatePhaseSecondSignal
    ],

    calculateCorrelation: function () {
      if (this.sequence.length) {
        this.isMSequence = signalHelpers.isMSequence(this.sequence);
        this.correlation = signalHelpers.correlation(signalHelpers.transformBinaryData(this.signal), signalHelpers.transformBinaryData(this.sequence));
      }
    },

    updatePhaseFirstSignal: function (phase) {
      this.firstPhase = phase;
      this.firstSignalCorrelation = signalHelpers.multiplyWithCarrier(signalHelpers.correlation(mixedSignalWithNoise, signalHelpers.addCarrier(signalHelpers.transformBinaryData(firstRefSequence), carrier, carrier.length)), signalHelpers.generateSin(10, phase));
      this.emitChange();
    },

    updatePhaseSecondSignal: function (phase) {
      this.secondPhase = phase;
      this.secondSignalCorrelation = signalHelpers.multiplyWithCarrier(signalHelpers.correlation(mixedSignalWithNoise, signalHelpers.addCarrier(signalHelpers.transformBinaryData(secondRefSequence), carrier, carrier.length)), signalHelpers.generateSin(10, phase));
      this.emitChange();
    },

    exports: {
      getSignal: function () {
        return this.signal;
      },
      getSequence: function () {
        return this.sequence;
      },
      getSignalWithSequence: function () {
        return this.signalWithSequence;
      },
      getCarrier: function () {
        return this.carrier;
      },
      getFirstSignalOnCarrier: function () {
        return this.firstSignalOnCarrier;
      },
      getSecondSignalOnCarrier: function () {
        return this.secondSignalOnCarrier;
      },
      getCommonChannelSignal: function () {
        return this.mixedSignal;
      },
      getCommonChannelSignalWithNoise: function () {
        return this.mixedSignalWithNoise;
      },
      getFirstSignalCorrelation: function () {
        return this.firstSignalCorrelation;
      },
      getSecondSignalCorrelation: function () {
        return this.secondSignalCorrelation;
      },
      getFirstSignalPhase: function () {
        return this.firstPhase;
      },
      getSecondSignalPhase: function () {
        return this.secondPhase;
      }
    }
  });
})();