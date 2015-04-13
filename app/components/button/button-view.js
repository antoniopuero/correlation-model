/** @jsx React.DOM */
var React = require('react');

module.exports = React.createClass({
  displayName: 'Button',

  render: function() {
    var {name, handler} = this.props;

    return (
      <button className="btn btn-default" onClick={handler}>{name}</button>
    );
  }

});
