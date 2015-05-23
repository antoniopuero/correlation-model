var React = require('react');
var _ = require('lodash');

//supported classnames: carrier-generator, prn-generator, data-generator, xor, multiply

module.exports = React.createClass({
  displayName: 'PrincipalSchemaView',

  renderHighlightBlock: function (className) {
    return (<span className={className}></span>);
  },

  render: function () {
    var {highlighted} = this.props;



    return (
      <div className="principal-schema">
        <img src="assets/principal-schema.png"/>
        {_.map(highlighted, this.renderHighlightBlock)}
      </div>
    );
  }

});
