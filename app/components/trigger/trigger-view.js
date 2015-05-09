var React = require('react');
var Checkbox = require('../checkbox/checkbox-view');
var actions = require('../../actions');

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
      actions.addTriggerToFeedback(this.state.number);
    } else {
      actions.deleteTriggerFromFeedback(this.state.number);
    }

    actions.hideGetButtons();
  },

  render: function() {
    var {number, value, inFeedback} = this.props;
    return (
      <div className="trigger">
        <span className="value">{value}</span>
        <span className="number">{number}</span>
        <Checkbox name={number} checked={inFeedback} handler={this.addTriggerToFeedback}/>
      </div>
    );
  }

});
