var React = require('react');
var _ = require('lodash');
var actions = require('../../actions');
var InputView = require('./input-view');
var classNames = require('classnames');

module.exports = React.createClass({
  displayName: 'InputSection',

  changeInputHandler: function (value, index, signalIndex) {
    var userInputSignals = _.clone(this.props.userInputSignals);
    userInputSignals[signalIndex][index] = value;
    actions.userChangeInputSignals(signalIndex, userInputSignals);
  },

  renderInput: function (userInputSignalValue, index, signalIndex) {
    return (<InputView value={userInputSignalValue} changeHandler={this.changeInputHandler} index={index} signalIndex={signalIndex}/>);
  },

  renderInputs: function (userInputSignal, index) {
    var self = this;
    var {signalCorrectnessArray} = this.props;
    var classes = classNames('correctness glyphicon glyphicon-ok', {'correct': signalCorrectnessArray[index]});
    return (
      <div>
        <span>{index + 1} signal</span>
        <div className="inputs">
          {_.map(userInputSignal, function (value, valueIndex) {return self.renderInput(value, valueIndex, index)})}
        </div>
        <span className={classes}></span>
      </div>
    );
  },

  render: function () {
    var {userInputSignals} = this.props;
    return (
      <div className="input-section">
        {_.map(userInputSignals, this.renderInputs)}
      </div>
    );
  }

});
