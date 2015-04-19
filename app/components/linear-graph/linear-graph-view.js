var React = require('react');
var Store = require('./linear-graph-store');
var actions = require('./linear-graph-actions'),
  _ = require('lodash'),
  {LineChart, Brush} = require('react-d3-components');

module.exports = React.createClass({
  displayName: 'LinearGraph',

  getInitialState: function () {
    var {data, width, height} = this.props;
    var dataForGraph = {};
    if (_.isArray(data)) {
      dataForGraph.values = _.map(data, function (value, index) {
        return {x: index, y: value};
      });
    } else {
      dataForGraph = data;
    }


    return {
      data: dataForGraph,
      width: width,
      height: height,
      xScale: d3.scale.linear().domain([0, dataForGraph.values.length]).range([0, width - 70]),
      xScaleBrush: d3.scale.linear().domain([0, dataForGraph.values.length]).range([0, width - 70])
    };
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
    return (
      <div>
        <LineChart
          data={this.state.data}
          width={this.state.width}
          height={this.state.height}
          margin={{top: 10, bottom: 50, left: 50, right: 20}}
          xScale={this.state.xScale}
          //xAxis={{tickValues: this.state.xScale.ticks(d3.time.day, 2), tickFormat: d3.time.format("%m/%d")}}
          />
        <div className="brush" style={{float: 'none'}}>
          <Brush
            width={this.state.width}
            height={50}
            margin={{top: 0, bottom: 30, left: 50, right: 20}}
            xScale={this.state.xScaleBrush}
            extent={[0, 2]}
            onChange={this._onChange}
            //xAxis={{tickValues: this.state.xScaleBrush.ticks(d3.time.day, 2), tickFormat: d3.time.format("%m/%d")}}
            />
        </div>
      </div>
    );
  }

});
