var React = require('react');
var Store = require('../../stores/cdma-store');
var MainStore = require('../../stores/main-store');
var actions = require('../../actions/cdma-actions');
var Button = require('../../ui-components/button/button-view');
var LinearGraph = require('../../ui-components/linear-graph/linear-graph-view');
var ReactSlider = require('react-slider');
var classNames = require('classnames');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      commonChannelSignalWithNoise: Store.getCommonChannelSignalWithNoise(),
      firstSignalCorrelationClear: Store.getFirstSignalCorrelationClear(),
      firstSignalCorrelation: Store.getFirstSignalCorrelation(),
      firstSignalCorrelationSpectrum: Store.getFirstSignalCorrelationSpectrum(),
      firstSignalCorrelationMultipliedWithCarrierSpectrum: Store.getFirstSignalCorrelationMultipliedWithCarrierSpectrum(),
      noiseAmplitude: Store.getNoiseAmplitude(),
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
      commonChannelSignalWithNoise: Store.getCommonChannelSignalWithNoise(),
      firstSignalCorrelation: Store.getFirstSignalCorrelation(),
      firstSignalCorrelationClear: Store.getFirstSignalCorrelationClear(),
      firstSignalCorrelationSpectrum: Store.getFirstSignalCorrelationSpectrum(),
      firstSignalCorrelationMultipliedWithCarrierSpectrum: Store.getFirstSignalCorrelationMultipliedWithCarrierSpectrum(),
      noiseAmplitude: Store.getNoiseAmplitude()
    });
  },

  changeNoiseAmplitude: function (value) {
    actions.updateNoiseAmplitude(value);
  },

  render: function () {
    var self = this;

    var {commonChannelSignalWithNoise, firstSignalCorrelation, firstSignalCorrelationClear, firstSignalCorrelationSpectrum, firstSignalCorrelationMultipliedWithCarrierSpectrum, noiseAmplitude, texts} = this.state;

    return (
      <div className="common-channel-with-noise-container">
        <h2>{texts.CDMA.heading}</h2>

        <p dangerouslySetInnerHTML={{__html: texts.CDMA.introPart}}></p>

        <div className="noise-changer">
          <span className="noise-value">A<sub>noise</sub> = {noiseAmplitude}</span>
          <ReactSlider className="horizontal-slider" value={noiseAmplitude} min={0} max={25}
                       onAfterChange={this.changeNoiseAmplitude} withBars/>
        </div>

        <LinearGraph data={commonChannelSignalWithNoise} width={800} height={400} xAxisTitle={'t, c'} yAxisTitle={'U, В'} dividend={commonChannelSignalWithNoise.length / 5}/>

        <p className="text-center">{texts.CDMA.signalWithNoiseInCommonChannelCaption}</p>

        <LinearGraph data={firstSignalCorrelationClear} width={800} height={400}  xAxisTitle={'n'} yAxisTitle={'A'} dividend={firstSignalCorrelationClear.length / 5}/>

        <p className="text-center">a)</p>
        <LinearGraph data={firstSignalCorrelationSpectrum} width={800} height={400} xAxisTitle={'f, Гц'} yAxisTitle={'A'}/>
        <p className="text-center">b)</p>
        <LinearGraph data={firstSignalCorrelation} width={800} height={400} xAxisTitle={'n'} yAxisTitle={'A'} dividend={firstSignalCorrelation.length / 5}/>
        <p className="text-center">c)</p>
        <LinearGraph data={firstSignalCorrelationMultipliedWithCarrierSpectrum} width={800} height={400} xAxisTitle={'f, Гц'} yAxisTitle={'A'}/>
        <p className="text-center">d)</p>

        <p className="text-center">{texts.CDMA.firstSignalCorrelationCapture}</p>
      </div>
    );
  }

});
