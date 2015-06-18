var React = require('react');
var Store = require('../../stores/cdma-store');
var MainStore = require('../../stores/main-store');
var actions = require('../../actions/cdma-actions');
var Button = require('../../ui-components/button/button-view');
var LinearGraph = require('../../ui-components/linear-graph/linear-graph-view');
var PrincipalSchema = require('../../ui-components/principal-schema/principal-schema-view');
var classNames = require('classnames');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      signalWithSequence: Store.getSignalWithSequence(),
      carrier: Store.getCarrier(),
      signalOnCarrier: Store.getFirstSignalOnCarrier(),
      transformedSignal: Store.getTransformedSignal(),
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
      signalWithSequence: Store.getSignalWithSequence(),
      carrier: Store.getCarrier(),
      signalOnCarrier: Store.getFirstSignalOnCarrier()
    });
  },

  render: function () {
    var self = this;

    var {signalWithSequence, signalOnCarrier, carrier, texts, transformedSignal} = this.state;

    return (
      <div className="signal-on-carrier-container">
        <h2>{texts.signalOnCarrier.heading}</h2>
        <p dangerouslySetInnerHTML={{__html: texts.signalOnCarrier.introPart}}></p>

        <LinearGraph data={signalWithSequence} width={800} height={300} emulateBars={true}  emulateBinary={true} xAxisTitle={'t, c'}  dividend={signalWithSequence.length / 5}/>
        <p className="text-center">{texts.signalOnCarrier.signalWithSequenceCapture}</p>

        <PrincipalSchema highlighted={['carrier-generator', 'multiply', 'xor']}/>
        <p dangerouslySetInnerHTML={{__html: texts.signalOnCarrier.aboutCarrying}}></p>


        <LinearGraph data={transformedSignal} width={800} height={300} emulateBars={true} xAxisTitle={'t, c'} yAxisTitle={'U, В'} dividend={signalWithSequence.length / 5}/>
        <p className="text-center">{texts.signalOnCarrier.transformedSignalCaption}</p>


        <LinearGraph data={carrier} width={800} height={300} withoutBrush={true} xAxisTitle={'t, c'} dividend={signalOnCarrier.length / 5} yAxisTitle={'U, В'}/>
        <p className="text-center">{texts.signalOnCarrier.carrierCaption}</p>
        <LinearGraph data={signalOnCarrier} width={800} height={400} xAxisTitle={'t, c'}  yAxisTitle={'U, В'} dividend={signalOnCarrier.length / 5}/>
        <p className="text-center">{texts.signalOnCarrier.signalOnCarrierCapture}</p>
      </div>
    );
  }

});
