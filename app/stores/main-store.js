'use strict';
var flux = require('flux-react');
var actions = require('../actions/main-actions');
var _ = require('lodash');
var $ = require('jquery');


module.exports = (function () {

  return flux.createStore({
    texts: {},
    actions: [
      actions.getTexts
    ],

    getTexts: function () {
      var self = this;
      $.get('/texts', function (texts) {
        self.texts = texts;
        self.emitChange();
      });
    },


    exports: {
      getTexts: function () {
        return this.texts;
      }
    }
  });
})();