'use strict';
var flux = require('flux-react');
var actions = require('../actions/cdma-actions');
var _ = require('lodash');
var processTriggerChain = require('../processing/trigger-chain');
var signalHelpers = require('../processing/signal-helpers');
var mathHelpers = require('../processing/math-helpers');
var FFT = require('../processing/fft');


module.exports = (function () {

  var firstChain = [5, [3, 5]],
    firstSignal = [0, 1, 0, 1, 0],
    firstChainInAction = processTriggerChain(),
    secondRandomChain = [5, [2, 3, 4, 5]],
    secondSignal = [1, 0, 1, 0, 1],
    secondChainInAction = processTriggerChain(),
    dynamicChain = processTriggerChain(),
    carrier = signalHelpers.generateSin(10),
    firstRefSequence,
    secondRefSequence,
    firstSignalTransformed,
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


  dynamicChain.initChain.apply(dynamicChain, firstChain); //last trigger is always in the circuit
  dynamicChain.set();

  firstSignalWithSequence = signalHelpers.mixSignalWithMSequence(firstSignal, firstRefSequence);
  secondSignalWithSequence = signalHelpers.mixSignalWithMSequence(secondSignal, secondRefSequence);

  firstSignalTransformed = signalHelpers.transformBinaryData(firstSignalWithSequence);
  firstSignalOnCarrier = signalHelpers.addCarrier(firstSignalTransformed, carrier, carrier.length);

  secondSignalOnCarrier = signalHelpers.addCarrier(signalHelpers.transformBinaryData(secondSignalWithSequence), carrier, carrier.length);


  mixedSignal = signalHelpers.addSignals([
    firstSignalOnCarrier,
    secondSignalOnCarrier
  ]);

  mixedSignalWithNoise = signalHelpers.addRandomNoise(mixedSignal, 2);

  var firstSignalCorrelation = signalHelpers.correlation(mixedSignalWithNoise, signalHelpers.addCarrier(signalHelpers.transformBinaryData(firstRefSequence), carrier, carrier.length));

  var firstSignalCorrelationMultipliedWithCarrier = signalHelpers.multiplyWithCarrier(firstSignalCorrelation, carrier);

  var secondSignalCorrelationMultipliedWithCarrier = signalHelpers.multiplyWithCarrier(signalHelpers.correlation(mixedSignalWithNoise, signalHelpers.addCarrier(signalHelpers.transformBinaryData(secondRefSequence), carrier, carrier.length)), carrier);


  return flux.createStore({
    triggerChain: firstChain,
    signal: firstSignal,
    sequence: [],
    signalWithSequence: [],
    spreadSignalSpectrum: FFT(firstSignalWithSequence),
    carrier: carrier,
    firstSignalTransformed: firstSignalTransformed,
    firstSignalOnCarrier: firstSignalOnCarrier,
    secondSignalOnCarrier: secondSignalOnCarrier,
    mixedSignal: mixedSignal,
    mixedSignalWithNoise: mixedSignalWithNoise,
    firstSignalCorrelation: firstSignalCorrelation,
    firstSignalCorrelationSpectrum: FFT(firstSignalCorrelation),
    firstSignalCorrelationMultipliedWithCarrier: firstSignalCorrelationMultipliedWithCarrier,
    firstSignalCorrelationMultipliedWithCarrierSpectrum: FFT(firstSignalCorrelationMultipliedWithCarrier),
    secondSignalCorrelationMultipliedWithCarrier: secondSignalCorrelationMultipliedWithCarrier,
    step: 0,
    maxStep: Math.pow(2, firstChain[0]) - 1,
    triggerChainLength: firstChain[0],
    triggerValues: dynamicChain.getChainSnapshot(),
    feedbackTriggers: firstChain[1],
    noiseAmplitude: 2,
    actions: [
      actions.stepForward,
      actions.updateNoiseAmplitude
    ],

    updateNoiseAmplitude: function (amplitude) {
      this.noiseAmplitude = amplitude;
      if (amplitude) {
        this.mixedSignalWithNoise = signalHelpers.addRandomNoise(mixedSignal, amplitude);
      } else {
        this.mixedSignalWithNoise = mixedSignal;
      }

      this.firstSignalCorrelation = signalHelpers.correlation(this.mixedSignalWithNoise, signalHelpers.addCarrier(signalHelpers.transformBinaryData(firstRefSequence), carrier, carrier.length));

      this.firstSignalCorrelationMultipliedWithCarrier = signalHelpers.multiplyWithCarrier(this.firstSignalCorrelation, carrier);

      this.firstSignalCorrelationSpectrum = FFT(this.firstSignalCorrelation);
      this.firstSignalCorrelationMultipliedWithCarrierSpectrum = FFT(this.firstSignalCorrelationMultipliedWithCarrier);
      this.emitChange();
    },


    stepForward: function () {
      if (this.step < this.maxStep) {
        this.step += 1;
        this.sequence.unshift(dynamicChain.moveValueThroughChain());
        this.triggerValues = dynamicChain.getChainSnapshot();
        this.signalWithSequence = signalHelpers.mixSignalWithMSequence(firstSignal, this.sequence);
        this.emitChange();
      }
    },

    exports: {
      getSignal: function () {
        return this.signal;
      },
      getSequence: function () {
        return this.sequence;
      },
      getSignalWithSequence: function () {
        return firstSignalWithSequence;
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
      getFirstSignalCorrelationClear: function () {
        return this.firstSignalCorrelation;
      },
      getFirstSignalCorrelation: function () {
        return this.firstSignalCorrelationMultipliedWithCarrier;
      },
      getSecondSignalCorrelation: function () {
        return this.secondSignalCorrelationMultipliedWithCarrier;
      },
      getTriggerValues: function () {
        return this.triggerValues;
      },
      getFeedbackTriggers: function () {
        return this.feedbackTriggers;
      },
      getStep: function () {
        return this.step;
      },
      getMaxStep: function () {
        return this.maxStep;
      },
      getTriggerChainLength: function () {
        return this.triggerChainLength;
      },
      getNoiseAmplitude: function () {
        return this.noiseAmplitude;
      },
      getSpreadSignalSpectrum: function () {
        return this.spreadSignalSpectrum;
      },
      getTransformedSignal: function () {
        return this.firstSignalTransformed;
      },
      getFirstSignalCorrelationSpectrum: function () {
        return this.firstSignalCorrelationSpectrum;
      },
      getFirstSignalCorrelationMultipliedWithCarrierSpectrum: function () {
        return this.firstSignalCorrelationMultipliedWithCarrierSpectrum;
      }
    }
  });
})();