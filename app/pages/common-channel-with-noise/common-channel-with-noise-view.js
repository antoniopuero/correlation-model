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
      commonChannelSignal: Store.getCommonChannelSignal(),
      commonChannelSignalWithNoise: Store.getCommonChannelSignalWithNoise()
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
      commonChannelSignal: Store.getCommonChannelSignal(),
      commonChannelSignalWithNoise: Store.getCommonChannelSignalWithNoise()
    });
  },

  render: function () {
    var self = this;

    var {commonChannelSignal, commonChannelSignalWithNoise} = this.state;

    return (
      <div className="common-channel-with-noise-container">
        <h2>{texts.commonChannelWithNoise.heading}</h2>
        <p>{texts.commonChannelWithNoise.introPart}</p>
        <LinearGraph data={commonChannelSignal} width={800} height={400}/>
        <p className="text-center">{texts.commonChannelWithNoise.signalInCommonChannelCaption}</p>
        <LinearGraph data={commonChannelSignalWithNoise} width={800} height={400}/>
        <p className="text-center">{texts.commonChannelWithNoise.signalWithNoiseInCommonChannelCaption}</p>
      </div>
    );
  }

});
