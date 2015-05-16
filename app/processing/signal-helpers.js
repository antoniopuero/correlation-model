var _ = require('lodash');
var mathHelpers = require('./math-helpers');
var syncronize = require('./syncronize');

module.exports = {
  meandrSignal: function (period, xspace, n) {
    var dx = (2 * Math.PI / period) * xspace;
    var x = 0;
    var signal = _.map(_.range(period / xspace), function () {
      x += dx;
      return mathHelpers.sign(Math.sin(x));
    });

    if (signal.length === 0) {
      throw new Error('memory leak will be caused!');
    }

    var result = [];
    if (n) {
      while (result.length < n) {
        result = result.concat(signal);
      }
      result.length = n;

    } else {
      result = signal;
    }

    return result;
  },
  setCustomSignal: function (signal, period) {
    return _.reduce(signal, function (accumulator, value) {
      return accumulator.concat(_.map(_.range(period), function () {
        return value;
      }))
    }, []);
  },

  mixSignalWithMSequence: function (signal, mSequence, numberOfMSeqs) {
    numberOfMSeqs = numberOfMSeqs ? numberOfMSeqs : 1;
    return syncronize.sync(signal, mSequence, mSequence.length * numberOfMSeqs, mathHelpers.xor);
  },

  generateSin: function (sinStep) {
    return _.map(_.range(0, 360, sinStep), function (value) {
      return Math.sin(Math.PI / 180 * value);
    });
  },

  generateCos: function (cosStep) {
    return _.map(_.range(0, 360, cosStep), function (value) {
      return Math.cos(Math.PI / 180 * value);
    });
  },

  addSignals: function (signals) {
    var maxSignalLength = Math.max.apply(Math, _.map(signals, function (signal) {
      return signal.length;
    }));

    return _.map(_.range(maxSignalLength), function (index) {
      return _.reduce(signals, function (currentAcc, signal) {
          if (signal[index]) {
            return currentAcc + signal[index];
          } else {
            return currentAcc;
          }
        }, 0);
    })

  },

  transformBinaryData: function (signal) {
    return _.map(signal, function (val) {
      return val ? -1 : 1;
    });
  },

  addCarrier: function (signal, carrier, carrierPeriodsInSignal) {

    return syncronize.sync(signal, carrier, carrierPeriodsInSignal, mathHelpers.multiply);
  },

  multiplyWithCarrier: function (signal, carrier) {

    return this.addCarrier(signal, carrier, 1);
  },

  addRandomNoise: function (signal, noiseAmplitude) {
    noiseAmplitude = noiseAmplitude ? noiseAmplitude : Math.max.apply(Math, signal);
    return _.map(signal, function (value, index) {
      return _.map(_.range(Math.ceil(Math.random() * 3)), function () {
        return value + _.random(-noiseAmplitude/2, noiseAmplitude/2, true);
      });
    });
  },

  isMSequence: function (sequence) {
    var zerosCount = 1, onesCount = 0;
    _.each(sequence, function (value) {
      value ? onesCount++ : zerosCount++;
    });
    return zerosCount === onesCount;
  },


  correlation: function (signal, anotherSignal, withNoise) {

    if (signal.length != anotherSignal.length) {
      signal = _.map(_.range(Math.floor(signal.length / anotherSignal.length)), function (value) {
        return signal.slice(value * anotherSignal.length, (value + 1) * anotherSignal.length);
      });
    } else {
      signal = [signal];
    }

    var correlation = _.reduce(signal, function (acc, partialSignal) {

      return acc.concat(_.map(partialSignal, function (value, index) {

        return _.reduce(anotherSignal, function (acc2, val2, index2) {
          var realIndex = (index + index2) % anotherSignal.length;
          var partialSignalValue = withNoise ? mathHelpers.average(partialSignal[index2]) : partialSignal[index2];

          return acc2 + partialSignalValue * anotherSignal[realIndex];
        }, 0);

      }));

    }, []);


    return correlation;
  }

};