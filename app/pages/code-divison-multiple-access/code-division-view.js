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
      firstSignalCorrelation: Store.getFirstSignalCorrelation(),
      secondSignalCorrelation: Store.getSecondSignalCorrelation(),
      firstPhase: Store.getFirstSignalPhase(),
      secondPhase: Store.getSecondSignalPhase(),
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
      secondSignalCorrelation: Store.getSecondSignalCorrelation(),
      firstPhase: Store.getFirstSignalPhase(),
      secondPhase: Store.getSecondSignalPhase()
    });
  },

  changeFirstPhase: function (value) {
    actions.updatePhaseFirstSignal(value);
  },

  changeSecondPhase: function (value) {
    actions.updatePhaseSecondSignal(value);
  },

  render: function () {
    var self = this;

    var {commonChannelSignalWithNoise, firstSignalCorrelation, secondSignalCorrelation, firstPhase, secondPhase, texts} = this.state;

    return (
      <div className="common-channel-with-noise-container">
        <h2>{texts.CDMA.heading}</h2>

        <p dangerouslySetInnerHTML={{__html: texts.CDMA.introPart}}></p>
        <LinearGraph data={commonChannelSignalWithNoise} width={800} height={400}/>

        <p className="text-center">{texts.CDMA.signalWithNoiseInCommonChannelCaption}</p>
        <LinearGraph data={firstSignalCorrelation} width={800} height={400}/>

        <div className="phase-changer">
          <span className="phase-value">Θ<sub>1</sub> = {firstPhase}<sup>o</sup></span>
          <ReactSlider className="horizontal-slider" value={firstPhase} min={0} max={180}
                       onAfterChange={this.changeFirstPhase} withBars/>
        </div>
        <p className="text-center">{texts.CDMA.firstSignalCorrelationCapture}</p>
        <LinearGraph data={secondSignalCorrelation} width={800} height={400}/>

        <div className="phase-changer">
          <span className="phase-value">Θ<sub>2</sub> = {secondPhase}<sup>o</sup></span>
          <ReactSlider className="horizontal-slider" value={secondPhase} min={0} max={180}
                       onAfterChange={this.changeSecondPhase}  withBars/></div>
        <p className="text-center">{texts.CDMA.secondSignalCorrelationCapture}</p>
      </div>
    );
  }

});
