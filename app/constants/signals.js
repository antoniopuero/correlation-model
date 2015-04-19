var hardcodedSignals = [
  [1, 0, 1, 1],
  [1, 0, 0, 1],
  [1, 1, 1, 0],
  [1, 0, 1, 0],
  [1, 1, 1, 1],
  [0, 0, 0, 0]
];
module.exports = {
  getRandomSignal: function () {
    return hardcodedSignals[Math.floor(Math.random() * hardcodedSignals.length)];
  }
};
