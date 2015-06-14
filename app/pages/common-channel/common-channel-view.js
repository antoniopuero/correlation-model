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
      firstSignalOnCarrier: Store.getFirstSignalOnCarrier(),
      secondSignalOnCarrier: Store.getSecondSignalOnCarrier(),
      commonChannelSignal: Store.getCommonChannelSignal(),
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
      firstSignalOnCarrier: Store.getFirstSignalOnCarrier(),
      secondSignalOnCarrier: Store.getSecondSignalOnCarrier(),
      commonChannelSignal: Store.getCommonChannelSignal()
    });
  },

  render: function () {
    var self = this;

    var {firstSignalOnCarrier, secondSignalOnCarrier, commonChannelSignal, texts} = this.state;

    return (
      <div className="common-channel-container">
        <h2>{texts.commonChannel.heading}</h2>
        <p dangerouslySetInnerHTML={{__html: texts.commonChannel.introPart}}></p>
        <LinearGraph data={firstSignalOnCarrier} width={800} height={300} xAxisTitle={'t, c'}/>
        <p className="text-center">{texts.commonChannel.firstSignalOnCarrierCapture}</p>
        <LinearGraph data={secondSignalOnCarrier} width={800} height={300} xAxisTitle={'t, c'}/>
        <p className="text-center">{texts.commonChannel.secondSignalOnCarrierCapture}</p>
        <LinearGraph data={commonChannelSignal} width={800} height={400} xAxisTitle={'t, c'}/>
        <p className="text-center">{texts.commonChannel.signalInCommonChannelCaption}</p>
      </div>
    );
  }

});
