var React = require('react');
var Checkbox = require('../checkbox/checkbox-view');
var chainAction = require('../trigger-chain/trigger-chain-actions');
var mainAction = require('../../actions');

module.exports = React.createClass({
  displayName: 'TriggerEntity',

  getInitialState: function () {

    return {
      value: this.props.value,
      number: this.props.number
    };
  },

  addTriggerToFeedback: function (e) {
    if (e.target.checked) {
      chainAction.addTriggerToFeedback(this.state.number);
    } else {
      chainAction.deleteTriggerFromFeedback(this.state.number);
    }

    mainAction.hideGetButtons();
  },

  render: function() {
    return (
      <div className="trigger">
        <span className="value">{this.props.value}</span>
        <span className="number">{this.props.number}</span>
        <Checkbox name={this.props.number} handler={this.addTriggerToFeedback}/>
      </div>
    );
  }

});
