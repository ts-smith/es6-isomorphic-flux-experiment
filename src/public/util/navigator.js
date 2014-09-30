var _ = require("lodash");

var app = null;
var navigationCallback = _.noop;

function setApplication(application){
   app = application;
}

var serial = 0;
function last(func){
   var id = serial++;

   return function(){
      if (id + 1 == serial){

         func.apply(func, arguments);

      }
   }
}


function navigateTo(href){

   var transitionContext = app.context.clone();

   var currentRoute = location.pathname + location.search;

   app.router.runRoute(transitionContext, href, {currentRoute})

   .then( last( _.partialRight(emitNavigation, href) ) )

   .catch (err => {
      transitionContext = null;
      console.error(err);
   });

}


function emitNavigation(newContext, url){

   var newState = newContext.dehydrate();

   navigationCallback(newState, url); 
}

function onNavigate(callback){
   navigationCallback = callback;
}

module.exports = {
   setApplication,
   navigateTo,
   onNavigate
}
