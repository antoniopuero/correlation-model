var flux = require('flux-react');

module.exports = flux.createActions([
  'initSequence',
  'changeLength',
  'changeStep',
  'returnSequence',
  'addTriggerToFeedback',
  'deleteTriggerFromFeedback'

]);