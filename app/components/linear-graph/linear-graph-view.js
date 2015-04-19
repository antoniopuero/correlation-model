var React = require('react');
var actions = require('./linear-graph-actions')();
var Store = require('./linear-graph-store')(actions);
var _ = require('lodash');
var {LineChart, Brush} = require('react-d3-components');

module.exports = React.createClass({
  displayName: 'LinearGraph',

  getInitialState: function () {

    var {data, width, height, updating} = this.props;

    var graphData = {};

    if (_.isArray(data)) {
      graphData.values = _.map(data, function (value, index) {
        return {x: index, y: value};
      });
    } else {
      graphData = data;
    }

    return {
      graphData: graphData,
      width: width,
      height: height,
      xScale: d3.scale.linear().domain([0, graphData.values.length]).range([0, width - 70]),
      xScaleBrush: d3.scale.linear().domain([0, graphData.values.length]).range([0, width - 70])
    };
  },
  componentWillReceiveProps: function (nextProps) {
    console.log(nextProps)

    var {data, width, updating} = nextProps;

    var graphData = {};

    if (_.isArray(data)) {
      graphData.values = _.map(data, function (value, index) {
        return {x: index, y: value};
      });
    } else {
      graphData = data;
    }
    this.setState({
      graphData: graphData,
      xScale: d3.scale.linear().domain([0, graphData.values.length]).range([0, width - 70]),
      xScaleBrush: d3.scale.linear().domain([0, graphData.values.length]).range([0, width - 70])
    });
  },

  //componentWillMount: function () {
  //  Store.addChangeListener(this.changeState);
  //},
  //componentWillUnmount: function () {
  //  Store.removeChangeListener(this.changeState);
  //},
  //changeState: function () {
  //},

  _onChange: function (extent) {
    this.setState({xScale: d3.scale.linear().domain([extent[0], extent[1]]).range([0, this.state.width - 70])});
  },


  render: function () {
    if (_.isEmpty(this.state.graphData.values)) {
      return (<div></div>);
    } else {
      return (
        <div>
          <LineChart
            data={this.state.graphData}
            width={this.state.width}
            height={this.state.height}
            margin={{top: 10, bottom: 50, left: 50, right: 20}}
            xScale={this.state.xScale}
            />

          <div className="brush" style={{float: 'none'}}>
            <Brush
              width={this.state.width}
              height={50}
              margin={{top: 0, bottom: 30, left: 50, right: 20}}
              xScale={this.state.xScaleBrush}
              extent={[0, 2]}
              onChange={this._onChange}
              />
          </div>
        </div>
      );
    }
  }

});
