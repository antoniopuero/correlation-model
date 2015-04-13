/** @jsx React.DOM */
var React = require('react');
var Store = require('./Store.js');
var actions = require('./actions.js');
var triggerChainConst = require('./constants/trigger-chains');
var TriggerChain = require('./components/trigger-chain/trigger-chain-view');
var Button = require('./components/button/button-view');
var classNames = require('classnames');
console.log(classNames)
module.exports = React.createClass({
  getInitialState: function () {
    var randomChain = triggerChainConst.getRandomChain();
    actions.initChainConf(randomChain);
    return {
      triggerChain: Store.getChainConf(),
      sequence: Store.getSequence(),
      maxStep: Store.getMaxStep()
    };
  },
  componentWillMount: function () {
    Store.addChangeListener(this.changeState);
  },
  componentWillUnmount: function () {
    Store.removeChangeListener(this.changeState);
  },
  changeState: function () {
    this.setState({
      step: Store.getStep(),
      sequence: Store.getSequence(),
      isMSequence: Store.isMSequence()
    });
  },
  proceedChain: function () {
    actions.stepForward();
  },

  getWholeSequence: function () {
    actions.lastStep();
  },

  render: function () {
    var self = this;
    var classes = classNames('sequence-wrapper', {
      'm-sequence': self.state.isMSequence
    });
    return (
      <div className="container">
        <TriggerChain chain={this.state.triggerChain} step={this.state.step} maxStep={this.state.maxStep}/>
        <div className={classes}>{this.state.sequence.join('')}</div>
        <Button name="One step" handler={this.proceedChain}/>
        <Button name="Whole sequence" handler={this.getWholeSequence}/>
      </div>
    );
  }

});
