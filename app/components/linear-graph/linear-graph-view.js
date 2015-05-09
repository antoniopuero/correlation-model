var React = require('react');
var _ = require('lodash');
var {LineChart, Brush} = require('react-d3-components');

var previousExtent = [];

module.exports = React.createClass({
  displayName: 'LinearGraph',

  getInitialState: function () {

    var {data, width, height, xOffset} = this.props;

    xOffset = xOffset ? xOffset : 0;

    var graphData = {};

    if (_.isArray(data)) {
      graphData.values = _.map(data, function (value, index) {
        return {x: xOffset + index, y: value};
      });
    } else {
      graphData = data;
    }

    var yValues = _.map(graphData.values, function (value) {
      return value.y;
    });

    var minY = Math.min.apply(Math, yValues);
    var maxY = Math.max.apply(Math, yValues);

    return {
      graphData: graphData,
      dataSetLength: yValues.length,
      width: width,
      height: height,
      yScale: d3.scale.linear().domain([minY, maxY]).range([height - 70, 0]),
      xScale: d3.scale.linear().domain([0, graphData.values.length]).range([0, width - 70]),
      xScaleBrush: d3.scale.linear().domain([0, graphData.values.length]).range([0, width - 70])
    };
  },

  componentWillReceiveProps: function (nextProps) {

    var {data, width, height, xOffset} = nextProps;

    xOffset = xOffset ? xOffset : 0;

    if (_.isEqual(data, this.props.data) && _.isEqual(width, this.props.width)) {
      return;
    }

    var graphData = {};

    if (_.isArray(data)) {
      graphData.values = _.map(data, function (value, index) {
        return {x: index + xOffset, y: value};
      });
    } else {
      graphData = data;
    }

    var yValues = _.map(graphData.values, function (value) {
      return value.y;
    });

    var minY = Math.min.apply(Math, yValues);
    var maxY = Math.max.apply(Math, yValues);

    var xScaleDomain = !_.isEmpty(previousExtent) ? previousExtent : [0, graphData.values.length];
    var xScale = d3.scale.linear().domain(xScaleDomain).range([0, width - 70]);
    var xScaleBrush = d3.scale.linear().domain([0, graphData.values.length]).range([0, width - 70]);
    var yScale = d3.scale.linear().domain([minY, maxY]).range([height - 70, 0]);

    this.setState({
      graphData: graphData,
      dataSetLength: yValues.length,
      yScale: yScale,
      xScale: xScale,
      xScaleBrush: xScaleBrush
    });
  },

  _onChange: function (extent) {
    previousExtent = extent;
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
            yScale={this.state.yScale}
            />

          <div className="brush" style={{float: 'none'}}>
            <Brush
              width={this.state.width}
              height={50}
              margin={{top: 0, bottom: 30, left: 50, right: 20}}
              xScale={this.state.xScaleBrush}
              extent={[0, Math.floor(this.state.dataSetLength / 50)]}
              onChange={this._onChange}
              />
          </div>
        </div>
      );
    }
  }

});
