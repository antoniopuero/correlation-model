var React = require('react');

var classNames = require('classnames');

module.exports = React.createClass({
  displayName: 'Checkbox',

  render: function () {
    var {name, handler, checked} = this.props;

    var classes = classNames('checkbox', {checked: checked});

    return (
      <div className={classes}>
        <label>
          <input type="checkbox" onChange={handler} checked={checked}/>{name}
        </label>
        <span className="line-through"></span>
      </div>
    );
  }

});
