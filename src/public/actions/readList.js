module.exports = function (context, unusedPayload, done) {

   context.fetcher.read('list', {}, {}, (err, messages) => {

      context.dispatch('RECEIVE_LIST_ITEMS', messages);
      done(err, messages);

   });
};
