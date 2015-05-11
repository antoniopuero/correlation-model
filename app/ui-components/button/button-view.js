var React = require('react');

module.exports = React.createClass({
  displayName: 'Button',

  render: function() {
    var {name, handler} = this.props;

    return (
      <button className="btn btn-default btn-lg" onClick={handler}>{name}</button>
    );
  }

});
