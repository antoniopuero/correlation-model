var flux = require('flux-react');

module.exports = flux.createActions([
  'updateSequence',
  'initSequence',
  'hideGetButtons',
  'addTriggerToFeedback',
  'deleteTriggerFromFeedback',
  'userChangeInputSignals'
]);