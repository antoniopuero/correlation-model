var hardcodedChains = [
  [10, [2, 3, 8, 10]],
  [10, [1, 3, 7, 10]],
  [10, [1, 4, 9, 10]],
  [10, [1, 6, 9, 10]],
  [10, [1, 5, 8, 10]],
  [10, [1, 6, 8, 10]],
  [10, [3, 10]],
  [10, [7, 10]]
];
module.exports = {
  getRandomChain: function () {
    var index = Math.floor(Math.random() * hardcodedChains.length);
    var chain = hardcodedChains[index];
    hardcodedChains.splice(index, 1); //to avoid chains repeating
    return chain;
  }
};
