
var actions = {};

actions.longTask = function (context, unusedPayload, done) {

   setTimeout(() => {   

      context.dispatch('RECEIVE_SOME_DATA', [1,2,3]);
      done();

   }, 2500);
};

actions.smallTask = function(context, text, done){
   setTimeout(() => {   

      context.dispatch('RECEIVE_TEXT', text);
      done();

   }, 300);

};

module.exports = actions;
