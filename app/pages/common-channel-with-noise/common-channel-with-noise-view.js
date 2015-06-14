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
      commonChannelSignal: Store.getCommonChannelSignal(),
      commonChannelSignalWithNoise: Store.getCommonChannelSignalWithNoise(),
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
      commonChannelSignal: Store.getCommonChannelSignal(),
      commonChannelSignalWithNoise: Store.getCommonChannelSignalWithNoise()
    });
  },

  render: function () {

    var {commonChannelSignal, commonChannelSignalWithNoise, texts} = this.state;

    return (
      <div className="common-channel-with-noise-container">
        <h2>{texts.commonChannelWithNoise.heading}</h2>
        <p dangerouslySetInnerHTML={{__html: texts.commonChannelWithNoise.introPart}}></p>
        <LinearGraph data={commonChannelSignal} width={800} height={400} xAxisTitle={'t, c'}/>
        <p className="text-center">{texts.commonChannelWithNoise.signalInCommonChannelCaption} xAxisTitle={'t, c'}</p>
        <LinearGraph data={commonChannelSignalWithNoise} width={800} height={400}/>
        <p className="text-center">{texts.commonChannelWithNoise.signalWithNoiseInCommonChannelCaption}</p>
      </div>
    );
  }

});
