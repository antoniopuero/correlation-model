/** @jsx React.DOM */
var React = require('react');
var Store = require('./trigger-store');
var actions = require('./trigger-actions');

module.exports = React.createClass({
  displayName: 'TriggerEntity',

  getInitialState: function () {

    return {
      value: this.props.value,
      number: this.props.number
    };
  },

  componentWillMount: function () {
    Store.addChangeListener(this.changeState);
  },
  componentWillUnmount: function () {
    Store.removeChangeListener(this.changeState);
  },
  changeState: function () {
  },

  render: function() {
    return (
      <div className="trigger">
        <span className="value">{this.props.value}</span>
        <span className="number">{this.props.number}</span>
      </div>
    );
  }

});
