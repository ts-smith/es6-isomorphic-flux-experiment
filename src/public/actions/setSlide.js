module.exports = function (context, {slideIndex}, done) {

   context.dispatch('RECEIVE_INDEX', {slideIndex});
   done();

};
