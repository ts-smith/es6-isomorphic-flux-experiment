'use strict';

module.exports = function (context, {text}, done) {
   var timestamp = Date.now();

   var message = {
      id: 'm_' + timestamp,
      text
   };

   //multiple things should be dispatched here
   context.dispatch('RECEIVE_LIST_ITEMS', [message]);

   //should do OPTIMISTIC_SEND_LIST_ITEMS
   //then do action create list items which actually does the creation
   //not sure about how to break up multi part actions yet

   context.fetcher.create('list', message, {}, (err, messages) => {
      //not sure what done is needed for, may be for convenience of actionInterface
      //not sure how dispatch sequences things
      done(err,messages);
   });
};
