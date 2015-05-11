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
      commonChannelSignalWithNoise: Store.getCommonChannelSignalWithNoise(),
      firstSignalCorrelation: Store.getFirstSignalCorrelation(),
      secondSignalCorrelation: Store.getSecondSignalCorrelation()
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
      secondSignalCorrelation: Store.getSecondSignalCorrelation()
    });
  },

  render: function () {
    var self = this;

    var {commonChannelSignalWithNoise, firstSignalCorrelation, secondSignalCorrelation} = this.state;

    return (
      <div className="common-channel-with-noise-container">
        <h2>{texts.CDMA.heading}</h2>
        <p>{texts.CDMA.introPart}</p>
        <LinearGraph data={commonChannelSignalWithNoise} width={800} height={400}/>
        <p className="text-center">{texts.CDMA.signalWithNoiseInCommonChannelCaption}</p>
        <LinearGraph data={firstSignalCorrelation} width={800} height={400}/>
        <p className="text-center">{texts.CDMA.firstSignalCorrelationCapture}</p>
        <LinearGraph data={secondSignalCorrelation} width={800} height={400}/>
        <p className="text-center">{texts.CDMA.secondSignalCorrelationCapture}</p>
      </div>
    );
  }

});
