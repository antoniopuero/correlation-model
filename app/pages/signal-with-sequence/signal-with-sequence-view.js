var React = require('react');
var Store = require('../../stores/cdma-store');
var MainStore = require('../../stores/main-store');
var actions = require('../../actions/cdma-actions');
var Button = require('../../ui-components/button/button-view');
var LinearGraph = require('../../ui-components/linear-graph/linear-graph-view');
var PrincipalSchema = require('../../ui-components/principal-schema/principal-schema-view');
var TriggerChain = require('../../ui-components/trigger-chain/trigger-chain-view');
var classNames = require('classnames');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      signal: Store.getSignal(),
      sequence: Store.getSequence(),
      signalWithSequence: Store.getSignalWithSequence(),
      triggerChainLength: Store.getTriggerChainLength(),
      step: Store.getStep(),
      maxStep: Store.getMaxStep(),
      triggerValues: Store.getTriggerValues(),
      feedbackTriggers: Store.getFeedbackTriggers(),
      spreadSignalSpectrum: Store.getSpreadSignalSpectrum(),
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
    this.setState({
      signal: Store.getSignal(),
      sequence: Store.getSequence(),
      signalWithSequence: Store.getSignalWithSequence(),
      triggerChainLength: Store.getTriggerChainLength(),
      triggerValues: Store.getTriggerValues(),
      feedbackTriggers: Store.getFeedbackTriggers(),
      step: Store.getStep()
    });
  },

  proceedChain: function () {
    actions.stepForward();
  },

  render: function () {
    var self = this;

    var {signal, sequence, signalWithSequence, texts, triggerChainLength, step, maxStep, triggerValues, feedbackTriggers, spreadSignalSpectrum} = this.state;

    return (
      <div className="signal-with-sequence-container">
        <h2>{texts.signalWithSequence.heading}</h2>
        <p dangerouslySetInnerHTML={{__html: texts.signalWithSequence.introPart}}></p>
        <LinearGraph data={signal} width={800} height={300} withoutBrush={true} emulateBars={true} xAxisTitle={'t, c'}/>
        <p className="text-center">{texts.signalWithSequence.signalCapture}</p>
        <p dangerouslySetInnerHTML={{__html: texts.signalWithSequence.aboutPRNCode}}></p>
        <TriggerChain chainLength={triggerChainLength} step={step} maxStep={maxStep} newSequenceId={'static'} triggerValues={triggerValues} feedbackTriggers={feedbackTriggers} uneditable={true}/>

        <Button name={texts.signalWithSequence.nextStep} handler={this.proceedChain}/>

        <pre>{sequence.join('')}</pre>
        <LinearGraph data={sequence} width={800} height={300} emulateBars={true} xAxisTitle={'t, c'}/>
        <p className="text-center">{texts.signalWithSequence.PRNCapture}</p>
        <p dangerouslySetInnerHTML={{__html: texts.signalWithSequence.aboutMixingSignalWithPRN}}></p>
        <LinearGraph data={signalWithSequence} width={800} height={300} emulateBars={true} xAxisTitle={'t, c'}/>
        <p className="text-center">{texts.signalWithSequence.signalWithSequenceCapture}</p>

        <LinearGraph data={spreadSignalSpectrum} width={800} height={300}emulateBars={true} xAxisTitle={'w, Гц'}/>
        <p className="text-center">{texts.signalWithSequence.signalWithSequenceSpectrumCapture}</p>

        <PrincipalSchema highlighted={['data-generator', 'prn-generator', 'xor']}/>
        <p className="text-center">{texts.signalWithSequence.principalSchemaCapture}</p>
        <p dangerouslySetInnerHTML={{__html: texts.signalWithSequence.aboutPrincipalSchema}}></p>
      </div>
    );
  }

});
