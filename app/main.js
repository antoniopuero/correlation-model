var React = require('react');

var Router = require('react-router'); // or var Router = ReactRouter; in browsers

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var SignalWithSequence = require('./pages/signal-with-sequence/signal-with-sequence-view');
var SignalOnCarrier = require('./pages/signal-on-carrier/signal-on-carrier-view');
var CommonChannel = require('./pages/common-channel/common-channel-view');
var CommonChannelWithNoise = require('./pages/common-channel-with-noise/common-channel-with-noise-view');
var CodeDivision = require('./pages/code-divison-multiple-access/code-division-view');
var SequenceGuessing = require('./pages/sequence-guessing/sequence-guessing-view');
//var App = require('./App.js');
//React.render(<App/>, document.body);

var App = React.createClass({
  render: function () {
    return (
      <div>
        <header>
          <ul>
            <li><Link to="signal-sequence">signal-sequence</Link></li>
            <li><Link to="signal-on-carrier">signal-on-carrier</Link></li>
            <li><Link to="common-channel">common-channel</Link></li>
            <li><Link to="common-channel-with-noise">common-channel-with-noise</Link></li>
            <li><Link to="code-division">code-division</Link></li>
            <li><Link to="sequence-guessing">sequence-guessing</Link></li>
          </ul>
        </header>

        {/* this is the important part */}
        <RouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="signal-sequence" handler={SignalWithSequence}/>
    <Route name="signal-on-carrier" handler={SignalOnCarrier}/>
    <Route name="common-channel" handler={CommonChannel}/>
    <Route name="common-channel-with-noise" handler={CommonChannelWithNoise}/>
    <Route name="code-division" handler={CodeDivision}/>
    <Route name="sequence-guessing" handler={SequenceGuessing}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});