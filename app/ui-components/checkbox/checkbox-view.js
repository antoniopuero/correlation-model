var React = require('react');

var classNames = require('classnames');

module.exports = React.createClass({
  displayName: 'Checkbox',

  render: function () {
    var {name, handler, checked, uneditable} = this.props;

    var classes = classNames('checkbox', {checked: checked, uneditable: uneditable});

    return (
      <div className={classes}>
        <label>
          <input type="checkbox" onChange={handler} checked={checked}/>{name}
        </label>
        <span className="line-through"></span>
        <span className="arrow"></span>
        <span className="xor">+</span>
      </div>
    );
  }

});
