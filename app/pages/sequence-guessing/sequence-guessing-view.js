var React = require('react');
var Store = require('../../stores/guessing-store');
var MainStore = require('../../stores/main-store');
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
      allSignalsAreCorrect: Store.allSignalsAreCorrect(),
      triggerValues: Store.getTriggerValues(),
      feedbackTriggers: Store.getFeedbackTriggers(),
      texts: MainStore.getTexts()
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
      signalCorrectnessArray: Store.getSignalCorrectnessArray(),
      allSignalsAreCorrect: Store.allSignalsAreCorrect(),
      triggerValues: Store.getTriggerValues(),
      feedbackTriggers: Store.getFeedbackTriggers()
    }, this.state);
    this.setState(stateDiff);
  },

  initSequence: function () {
    actions.initSequence();
  },

  render: function () {
    var self = this;
    var classes = classNames('sequence-wrapper', {
      'm-sequence': self.state.isMSequence
    });

    var correct = classNames({
      'hidden': !self.state.allSignalsAreCorrect
    });

    var {triggerChainLength, step, maxStep, newSequenceId, sequence, correlation, signal, userInputSignals, signalCorrectnessArray, triggerValues, feedbackTriggers, texts} = this.state;

    return (
      <div className="sequence-guessing-container">
        <h2>{texts.sequenceGuessing.heading}</h2>
        <p dangerouslySetInnerHTML={{__html: texts.sequenceGuessing.introPart}}></p>

        <LinearGraph data={signal} width={800} height={300}/>
        <p className="text-center">{texts.sequenceGuessing.commonChannelCaption}</p>

        <TriggerChain chainLength={triggerChainLength} step={step} maxStep={maxStep} newSequenceId={newSequenceId} triggerValues={triggerValues} feedbackTriggers={feedbackTriggers}/>
        <pre className={classes}>{sequence.join('')}</pre>
        <Button name={texts.sequenceGuessing.sequenceInitButton} handler={this.initSequence}/>

        <LinearGraph data={correlation} xOffset={50} width={800} height={300}/>

        <p dangerouslySetInnerHTML={{__html: texts.sequenceGuessing.inputSignals}}></p>

        <InputSection userInputSignals={userInputSignals} signalCorrectnessArray={signalCorrectnessArray}/>

        <form action="/finished" method="POST" className={correct}>
          <button type="submit" className="btn btn-primary btn-lg pull-right">{texts.commonTexts.finishButton}</button>
        </form>

      </div>
    );
  }

});
