var React = require('react');

var Router = require('react-router');
var $ = require('jquery');
var _ = require('lodash');
var classNames = require('classnames');

var mainActions = require('./actions/main-actions');
var mainStore = require('./stores/main-store');

var Redirect = Router.Redirect;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;


var SignalWithSequence = require('./pages/signal-with-sequence/signal-with-sequence-view');
var SignalOnCarrier = require('./pages/signal-on-carrier/signal-on-carrier-view');
var CommonChannel = require('./pages/common-channel/common-channel-view');
var CommonChannelWithNoise = require('./pages/common-channel-with-noise/common-channel-with-noise-view');
var CodeDivision = require('./pages/code-divison-multiple-access/code-division-view');
var SequenceGuessing = require('./pages/sequence-guessing/sequence-guessing-view');

var routesOrder = ['signal-sequence'
  , 'signal-on-carrier'
  , 'common-channel'
  , 'common-channel-with-noise'
  , 'code-division'
  , 'sequence-guessing'];

var deleteLeadingSlash = function (path) {
  return path.replace(/^\//, '');
};

var getIndex = function (hashPath) {
  return _.indexOf(routesOrder, deleteLeadingSlash(hashPath));
};

var hasNext = function (hashPath) {
  var index = getIndex(hashPath);
  return index !== -1 && index !== (routesOrder.length - 1);
};

var hasPrev = function (hashPath) {
  var index = getIndex(hashPath);
  return index !== -1 && index !== 0;
};
var goNext = function (hashPath) {
  var index = getIndex(hashPath) + 1;
  return routesOrder[index];
};

var goPrev = function (hashPath) {
  var index = getIndex(hashPath) - 1;
  return routesOrder[index];
};

var App = React.createClass({

  getInitialState: function () {
    mainActions.getTexts();
    return {
      texts: mainStore.getTexts()
    }
  },


  componentWillMount: function () {
    mainStore.addChangeListener(this.changeState);
  },
  componentWillUnmount: function () {
    mainStore.removeChangeListener(this.changeState);
  },

  changeState: function () {
    this.setState({
      texts: mainStore.getTexts()
    });
  },

  render: function () {
    var currentPath = Router.HashLocation.getCurrentPath();
    var prevLink, nextLink;
    var texts = this.state.texts;
    if (hasPrev(currentPath) && texts.commonTexts) {
      prevLink = <Link to={goPrev(currentPath)} className="btn btn-default btn-lg">{texts.commonTexts.prevButton}</Link>;
    }
    if (hasNext(currentPath) && texts.commonTexts) {
      nextLink = <Link to={goNext(currentPath)} className="btn btn-default btn-lg">{texts.commonTexts.nextButton}</Link>;
    }
    return _.isEmpty(texts) ? (<div></div>) : (
      <div>

        <div className="container">
          {/* this is the important part */}
          <RouteHandler/>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-6 col-xs-6">
              {prevLink}
            </div>
            <div className="col-md-6 col-xs-6 text-right">
              {nextLink}
            </div>
          </div>
        </div>
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
    <Redirect from="/" to="signal-sequence"/>
  </Route>
);

module.exports = routes;