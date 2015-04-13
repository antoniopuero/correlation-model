/** @jsx React.DOM */
var React = require('react');

module.exports = React.createClass({
  displayName: 'Checkbox',

  render: function () {
    var {name, handler} = this.props;

    return (
      <div class="checkbox">
        <label>
          <input type="checkbox" onChange={handler} value={this.state.value}/>{name}
        </label>
      </div>
    );
  }

});
