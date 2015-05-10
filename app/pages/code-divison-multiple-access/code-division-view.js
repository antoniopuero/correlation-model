var React = require('react');
var Store = require('../../stores/cdma-store');
var actions = require('../../actions/cdma-actions');
var Button = require('../../ui-components/button/button-view');
var LinearGraph = require('../../ui-components/linear-graph/linear-graph-view');
var classNames = require('classnames');

module.exports = React.createClass({
  getInitialState: function () {
    return {
    };
  },
  componentWillMount: function () {
    Store.addChangeListener(this.changeState);
  },
  componentWillUnmount: function () {
    Store.removeChangeListener(this.changeState);
  },
  changeState: function () {
    this.setState({});
  },
  proceedChain: function () {
    actions.stepForward();
  },

  getWholeSequence: function () {
    actions.lastStep();
  },

  initSequence: function () {
    actions.initSequence();
  },

  render: function () {
    var self = this;

    return (
      <div className="container">
        code divison page
      </div>
    );
  }

});
