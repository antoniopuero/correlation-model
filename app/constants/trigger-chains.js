var hardcodedChains = [
  [5, [3, 5]],
  [5, [2, 5]],
  [10, [3, 10]],
  [10, [7, 10]]
];
module.exports = {
  getRandomChain: function () {
    return hardcodedChains[Math.floor(Math.random() * hardcodedChains.length)];
  }
};
