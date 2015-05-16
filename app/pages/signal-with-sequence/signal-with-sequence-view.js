var React = require('react');
var Store = require('../../stores/cdma-store');
var MainStore = require('../../stores/main-store');
var actions = require('../../actions/cdma-actions');
var Button = require('../../ui-components/button/button-view');
var LinearGraph = require('../../ui-components/linear-graph/linear-graph-view');
var classNames = require('classnames');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      signal: Store.getSignal(),
      sequence: Store.getSequence(),
      signalWithSequence: Store.getSignalWithSequence(),
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
      signalWithSequence: Store.getSignalWithSequence()
    });
  },

  render: function () {
    var self = this;

    var {signal, sequence, signalWithSequence, texts} = this.state;

    return (
      <div className="signal-with-sequence-container">
        <h2>{texts.signalWithSequence.heading}</h2>
        <p>{texts.signalWithSequence.introPart}</p>
        <LinearGraph data={signal} width={800} height={400} withoutBrush={true} emulateBars={true}/>
        <p className="text-center">{texts.signalWithSequence.signalCapture}</p>
        <p>{texts.signalWithSequence.aboutPRNCode}</p>
        <LinearGraph data={sequence} width={800} height={400} emulateBars={true}/>
        <p className="text-center">{texts.signalWithSequence.PRNCapture}</p>
        <p>{texts.signalWithSequence.aboutMixingSignalWithPRN}</p>
        <LinearGraph data={signalWithSequence} width={800} height={400} emulateBars={true}/>
        <p className="text-center">{texts.signalWithSequence.signalWithSequenceCapture}</p>
      </div>
    );
  }

});
