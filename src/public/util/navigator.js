var _ = require("lodash");

var app = null;
var navigationCallback = _.noop;
var currentRoute;

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


function navigateTo(href, optimize = true){

   var transitionContext = app.context.clone();

   var currentRoute = optimize === true? app.currentRoute : optimize;

   app.router.runRoute(transitionContext, href, {currentRoute})

   .then( last( _.partialRight(emitNavigation, href) ) )

   .catch (err => {
      transitionContext = null;
      console.error(err);
   });

}
function receiveNavigation(){
   var transitionContext = app.context.clone();

   var previousRoute = app.currentRoute;
   var receivedRoute = location.pathname + location.search;

   app.router.runRoute(transitionContext, receivedRoute, {currentRoute: previousRoute})

   .then( last( _.partialRight(emitNavigation, null, true) ) )

   .catch (err => {
      transitionContext = null;
      console.error(err);
   });



}


function emitNavigation(newContext, url, reactive = false){

   var newState = newContext.dehydrate();

   navigationCallback(newState, url, reactive); 
}

function onNavigate(callback){
   navigationCallback = callback;
}

module.exports = {
   setApplication,
   navigateTo,
   receiveNavigation,
   onNavigate
}
