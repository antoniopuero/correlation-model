var React = require('react');

module.exports = React.createClass({
  displayName: 'InputView',

  changeWrapper: function (e) {
    var {changeHandler, index, signalIndex} = this.props;
    changeHandler(e.target.value, index, signalIndex);
  },

  render: function () {
    var {changeHandler, value} = this.props;

    return (
      <div className="input-field">
        <input type="text" className="form-control" onChange={this.changeWrapper} value={value}/>
      </div>
    );
  }

});
