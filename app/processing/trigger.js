module.exports = function (options) {

  var previousValue;
  var newValue;

  var setValue = function (value) {
    newValue = value;
  };

  var getValue = function () {
    var value = previousValue;
    previousValue = newValue;
    return value;
  };

  var getWithoutReassign = function () {
    return previousValue;
  };

  var set = function () {
    previousValue = 1;
  };

  var reset = function () {
    previousValue = 0;
  };

  return {
    setValue: setValue,
    getValue: getValue,
    getWithoutReassign: getWithoutReassign,
    set: set,
    reset: reset
  }
};
