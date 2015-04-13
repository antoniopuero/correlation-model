/** @jsx React.DOM */
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
    var {chain, maxStep} = this.props;
    actions.initSequence(chain);
    return {
      step: Store.getStep(),
      triggerValues: Store.getTriggerValues(),
      maxStep: maxStep
    };
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    if (nextProps.step !== this.props.step) {
      if (nextProps.step === this.state.maxStep) {
        actions.returnSequence(this.state.maxStep);
      } else {
        actions.changeStep(nextProps.step);
      }
      return true;
    } else {
      return false;
    }
  },

  componentWillMount: function () {
    Store.addChangeListener(this.changeState);
  },
  componentWillUnmount: function () {
    Store.removeChangeListener(this.changeState);
  },
  changeState: function () {
    console.log(Store.getSequence())
    appActions.updateSequence(Store.getSequence(), Store.isMSequence());
    this.setState({
      triggerValues: Store.getTriggerValues()
    });
  },
  renderTrigger: function (value, index) {
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
