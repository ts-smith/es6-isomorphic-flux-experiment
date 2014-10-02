module.exports = function (context, {slideIndex, direction}, done) {

   context.dispatch('RECEIVE_INDEX', {slideIndex, direction});
   done();

};
