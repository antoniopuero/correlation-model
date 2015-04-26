var React = require('react');
var Store = require('./trigger-chain-store');
var actions = require('./trigger-chain-actions');
var appActions = require('../../actions');
var TriggerEntity = require('../trigger/trigger-view');
var _ = require('lodash');

var chainInAction;

module.exports = React.createClass({
  displayName: 'TriggerChain',

  getInitialState: function () {
    var {chainLength, maxStep} = this.props;
    actions.changeLength(chainLength);
    return {
      step: Store.getStep(),
      chainLength: Store.getLength(),
      triggerValues: Store.getTriggerValues(),
      maxStep: maxStep
    };
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.newSequenceId !== this.props.newSequenceId) {
      actions.initSequence();
    }

    if (nextProps.step !== this.props.step) {
      if (nextProps.step === this.state.maxStep) {
        actions.returnSequence(this.state.maxStep);
      } else {
        actions.changeStep(nextProps.step);
      }
      appActions.updateSequence(Store.getSequence());
    }
  },

  componentWillMount: function () {
    Store.addChangeListener(this.changeState);
  },
  componentWillUnmount: function () {
    Store.removeChangeListener(this.changeState);
  },
  changeState: function () {
    this.setState({
      triggerValues: Store.getTriggerValues()
    });
  },
  renderTrigger: function (value, index) {
    if (!value) {
      value = 0;
    }
    return (
        <TriggerEntity value={value} number={index + 1}/>
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
