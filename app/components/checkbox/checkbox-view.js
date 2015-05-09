var React = require('react');

module.exports = React.createClass({
  displayName: 'Checkbox',

  render: function () {
    var {name, handler, checked} = this.props;

    return (
      <div className="checkbox">
        <label>
          <input type="checkbox" onChange={handler} checked={checked}/>{name}
        </label>
      </div>
    );
  }

});
