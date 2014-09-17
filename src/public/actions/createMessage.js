'use strict';

var ThreadStore = require('../stores/ThreadStore');

module.exports = function (context, {text}, done) {
   var timestamp = Date.now();

   var message = {
      id: 'm_' + timestamp,
      text
   };
   context.dispatch('RECEIVE_LIST_ITEMS', [message]);
   context.fetcher.create('list', message, {}, (err, messages) => {
      done();
   });
};
