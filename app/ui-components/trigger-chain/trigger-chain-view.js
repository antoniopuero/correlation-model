var React = require('react');
var Store = require('../../stores/guessing-store');
var actions = require('../../actions/guessing-actions');
var TriggerEntity = require('../trigger/trigger-view');
var _ = require('lodash');


module.exports = React.createClass({
  displayName: 'TriggerChain',

  getInitialState: function () {
    var {chainLength, maxStep} = this.props;
    return {
      step: Store.getStep(),
      chainLength: chainLength,
      triggerValues: Store.getTriggerValues(),
      triggersInFeedback: Store.getFeedbackTriggers(),
      maxStep: maxStep
    };
  },

  componentWillReceiveProps: function (nextProps) {
  },

  componentWillMount: function () {
    Store.addChangeListener(this.changeState);
  },
  componentWillUnmount: function () {
    Store.removeChangeListener(this.changeState);
  },
  changeState: function () {
    this.setState({
      triggerValues: Store.getTriggerValues(),
      triggersInFeedback: Store.getFeedbackTriggers()
    });
  },
  renderTrigger: function (value, index) {
    var isInFeedback = _.indexOf(this.state.triggersInFeedback, index + 1) !== -1;
    if (!value) {
      value = 0;
    }
    return (
        <TriggerEntity value={value} number={index + 1} inFeedback={isInFeedback}/>
    );
  },

  render: function () {
    return (
      <div className="row trigger-chain">
        {_.map(this.state.triggerValues, this.renderTrigger)}
      </div>
    );
  }

});
