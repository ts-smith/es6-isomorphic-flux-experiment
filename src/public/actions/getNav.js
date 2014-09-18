module.exports = function (context, unusedPayload, done) {

   context.fetcher.read('nav', {}, {}, (err, info) => {

      context.dispatch('RECEIVE_NAV_DETAILS', info);

      done(err, info);

   });
};
