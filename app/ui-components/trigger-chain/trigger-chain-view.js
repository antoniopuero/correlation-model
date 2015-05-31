var React = require('react');
var actions = require('../../actions/guessing-actions');
var TriggerEntity = require('../trigger/trigger-view');
var _ = require('lodash');


module.exports = React.createClass({
  displayName: 'TriggerChain',

  getInitialState: function () {
    var {chainLength, maxStep, step, triggerValues, feedbackTriggers, uneditable} = this.props;
    return {
      step: step,
      chainLength: chainLength,
      triggerValues: triggerValues,
      triggersInFeedback: feedbackTriggers,
      maxStep: maxStep,
      uneditable: uneditable
    };
  },

  componentWillReceiveProps: function (nextProps) {

    var {chainLength, maxStep, step, triggerValues, feedbackTriggers} = nextProps;
    this.setState({
      step: step,
      chainLength: chainLength,
      triggerValues: triggerValues,
      triggersInFeedback: feedbackTriggers,
      maxStep: maxStep
    });
  },

  renderTrigger: function (value, index) {
    var uneditable = this.state.uneditable;
    var isInFeedback = _.indexOf(this.state.triggersInFeedback, index + 1) !== -1;
    if (!value) {
      value = 0;
    }
    return (
      <TriggerEntity value={value} number={index + 1} inFeedback={isInFeedback} uneditable={uneditable}/>
    );
  },

  render: function () {
    return (
      <div className="trigger-chain-wrapper">
        <span className="feedback-line"></span>
        <div className="row trigger-chain">
          {_.map(this.state.triggerValues, this.renderTrigger)}
        </div>
        <span className="line-out"></span>
        <div className="xor-wrapper">
          <span className="xor">+</span>
          <div className="white-holder"></div>
        </div>
      </div>
    );
  }

});
