var React = require('react');
var Store = require('../../stores/cdma-store');
var actions = require('../../actions/cdma-actions');
var Button = require('../../ui-components/button/button-view');
var LinearGraph = require('../../ui-components/linear-graph/linear-graph-view');
var classNames = require('classnames');
var texts = require('../../constants/texts');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      signalWithSequence: Store.getSignalWithSequence(),
      carrier: Store.getCarrier(),
      signalOnCarrier: Store.getFirstSignalOnCarrier()
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
      signalWithSequence: Store.getSignalWithSequence(),
      carrier: Store.getCarrier(),
      signalOnCarrier: Store.getFirstSignalOnCarrier()
    });
  },

  render: function () {
    var self = this;

    var {signalWithSequence, signalOnCarrier, carrier} = this.state;

    return (
      <div className="signal-on-carrier-container">
        <h2>{texts.signalOnCarrier.heading}</h2>
        <p>{texts.signalOnCarrier.introPart}</p>
        <LinearGraph data={signalWithSequence} width={800} height={400} emulateBars={true}/>
        <p className="text-center">{texts.signalOnCarrier.signalWithSequenceCapture}</p>
        <p>{texts.signalOnCarrier.aboutCarrying}</p>
        <LinearGraph data={carrier} width={800} height={400} withoutBrush={true}/>
        <p className="text-center">{texts.signalOnCarrier.carrierCaption}</p>
        <LinearGraph data={signalOnCarrier} width={800} height={400}/>
        <p className="text-center">{texts.signalOnCarrier.signalOnCarrierCapture}</p>
      </div>
    );
  }

});
