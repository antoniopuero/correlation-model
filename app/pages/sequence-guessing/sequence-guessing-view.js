var React = require('react');
var Store = require('../../stores/guessing-store');
var actions = require('../../actions/guessing-actions');
var TriggerChain = require('../../ui-components/trigger-chain/trigger-chain-view');
var Button = require('../../ui-components/button/button-view');
var LinearGraph = require('../../ui-components/linear-graph/linear-graph-view');
var InputSection = require('../../ui-components/input-section/input-section-view');
var classNames = require('classnames');
var utils = require('../../utils');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      step: Store.getStep(),
      triggerChain: Store.getChainConf(),
      triggerChainLength: Store.getChainConf()[0],
      sequence: Store.getSequence(),
      refSequence: Store.getRefSequence(),
      signal: Store.getSignal(),
      correlation: Store.getCorrelation(),
      maxStep: Store.getMaxStep(),
      hiddenButtons: Store.getHidden(),
      userInputSignals: Store.getUserInputSignals(),
      signalCorrectnessArray: Store.getSignalCorrectnessArray(),
    };
  },
  componentWillMount: function () {
    Store.addChangeListener(this.changeState);
  },
  componentWillUnmount: function () {
    Store.removeChangeListener(this.changeState);
  },
  changeState: function () {
    var stateDiff = utils.objectDiff({
      step: Store.getStep(),
      sequence: Store.getSequence(),
      isMSequence: Store.isMSequence(),
      newSequenceId: Store.getUniqueId(),
      hiddenButtons: Store.getHidden(),
      correlation: Store.getCorrelation(),
      userInputSignals: Store.getUserInputSignals(),
      signalCorrectnessArray: Store.getSignalCorrectnessArray()
    }, this.state);
    this.setState(stateDiff);
  },
  proceedChain: function () {
    actions.stepForward();
  },

  getWholeSequence: function () {
    actions.lastStep();
  },

  initSequence: function () {
    actions.initSequence();
  },

  render: function () {
    var self = this;
    var classes = classNames('sequence-wrapper', {
      'm-sequence': self.state.isMSequence
    });

    var hidden = classNames({
      'hidden': self.state.hiddenButtons
    });

    var {triggerChainLength, step, maxStep, newSequenceId, sequence, correlation, signal, userInputSignals, signalCorrectnessArray} = this.state;

    return (
      <div className="container">
        <TriggerChain chainLength={triggerChainLength} step={step} maxStep={maxStep} newSequenceId={newSequenceId}/>
        <div className={classes}>{sequence.join('')}</div>
        <Button name="Init chain with feedback" handler={this.initSequence}/>
        <div className={hidden}>
          <Button name="One step" handler={this.proceedChain}/>
          <Button name="Whole sequence" handler={this.getWholeSequence}/>
        </div>

        <LinearGraph data={correlation} xOffset={50} width={800} height={400}/>
        <LinearGraph data={signal} width={800} height={400}/>
        <InputSection userInputSignals={userInputSignals} signalCorrectnessArray={signalCorrectnessArray}/>

      </div>
    );
  }

});
