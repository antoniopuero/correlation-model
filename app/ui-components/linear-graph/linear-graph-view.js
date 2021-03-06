var React = require('react');
var _ = require('lodash');
var classNames = require('classnames');
var {LineChart, Brush} = require('react-d3-components');

module.exports = React.createClass({
  displayName: 'LinearGraph',

  getInitialState: function () {

    var {data, width, height, xOffset, emulateBars, emulateBinary, xAxisTitle, yAxisTitle, dividend} = this.props;

    var yAxis = {label: yAxisTitle};

    if (emulateBinary) {
      yAxis.tickFormat = d3.format('.0f');
      yAxis.tickValues = [0, 1];
    }

    xOffset = xOffset ? xOffset : 0;

    var graphData = {};

    let divide = dividend || 1;

    if (_.isArray(data)) {

      if (emulateBars) {

        graphData.values = _.map(_.range(data.length * 20), function (index) {
          return {x: index/ (20 * divide), y: data[Math.floor(index/20)]};
        });

      } else {
        graphData.values = _.map(data, function (value, index) {
          return {x: index / divide, y: value};
        });

      }

    } else {
      graphData = data;
    }

    var xValues = _.map(graphData.values, function (value) {
      return value.x;
    });

    var yValues = _.map(graphData.values, function (value) {
      return value.y;
    });

    var minY = Math.min.apply(Math, yValues);
    var maxY = Math.max.apply(Math, yValues);

    var minX = Math.min.apply(Math, xValues);
    var maxX = Math.max.apply(Math, xValues);

    return {
      graphData: graphData,
      xAxisTitle: xAxisTitle,
      yAxis: yAxis,
      dataSetLength: maxX,
      width: width,
      height: height,
      yScale: d3.scale.linear().domain([minY - 0.1, maxY  + 0.1]).range([height - 70, 0]),
      xScale: d3.scale.linear().domain([minX - 0.1, maxX + 0.1]).range([0, width - 70]),
      xScaleBrush: d3.scale.linear().domain([minX - 0.1, maxX + 0.1]).range([0, width - 70])
    };
  },

  componentWillReceiveProps: function (nextProps) {

    var {data, width, height, xOffset, emulateBars, dividend} = nextProps;

    xOffset = xOffset ? xOffset : 0;

    if (_.isEqual(data, this.props.data) && _.isEqual(width, this.props.width)) {
      return;
    }

    var graphData = {};

    let divide = dividend || 1;

    if (_.isArray(data)) {

      if (emulateBars) {

        graphData.values = _.map(_.range(data.length * 20), function (index) {
          return {x: index/ (20 * divide), y: data[Math.floor(index/20)]};
        });

      } else {

        graphData.values = _.map(data, function (value, index) {
          return {x: index / divide, y: value};
        });

      }

    } else {
      graphData = data;
    }

    var xValues = _.map(graphData.values, function (value) {
      return value.x;
    });

    var yValues = _.map(graphData.values, function (value) {
      return value.y;
    });

    var minY = Math.min.apply(Math, yValues);
    var maxY = Math.max.apply(Math, yValues);

    var minX = Math.min.apply(Math, xValues);
    var maxX = Math.max.apply(Math, xValues);

    var xScaleDomain = !_.isEmpty(this.previousExtent) ? this.previousExtent : [minX - 0.1, maxX + 0.1];
    var xScale = d3.scale.linear().domain(xScaleDomain).range([0, width - 70]);
    var xScaleBrush = d3.scale.linear().domain([minX - 0.1, maxX + 0.1]).range([0, width - 70]);
    var yScale = d3.scale.linear().domain([minY - 0.1, maxY  + 0.1]).range([height - 70, 0]);

    this.setState({
      graphData: graphData,
      dataSetLength: maxX,
      yScale: yScale,
      xScale: xScale,
      xScaleBrush: xScaleBrush
    });
  },

  _onChange: function (extent) {
    this.previousExtent = extent;
    this.setState({xScale: d3.scale.linear().domain([extent[0], extent[1]]).range([0, this.state.width - 70])});
  },


  render: function () {
    var classes = classNames('brush', {hidden: this.props.withoutBrush});
    //if (_.isEmpty(this.state.graphData.values)) {
    //  return (<div></div>);
    //} else {
      return (
        <div>
          <LineChart
            data={this.state.graphData}
            width={this.state.width}
            height={this.state.height}
            margin={{top: 10, bottom: 50, left: 50, right: 20}}
            xScale={this.state.xScale}
            yScale={this.state.yScale}
            xAxis={{label: this.state.xAxisTitle}}
            yAxis={this.state.yAxis}
            />

          <div className={classes} style={{float: 'none'}}>
            <Brush
              width={this.state.width}
              height={50}
              margin={{top: 0, bottom: 30, left: 50, right: 20}}
              xScale={this.state.xScaleBrush}
              extent={[0, this.state.dataSetLength]}
              onChange={this._onChange}
              />
          </div>
        </div>
      );
    }
  //}

});
