var React = require('react');
var Checkbox = require('../checkbox/checkbox-view');
var actions = require('../../actions/guessing-actions');

module.exports = React.createClass({
  displayName: 'TriggerEntity',


  addTriggerToFeedback: function (e) {
    if (e.target.checked) {
      actions.addTriggerToFeedback(this.props.number);
    } else {
      actions.deleteTriggerFromFeedback(this.props.number);
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
