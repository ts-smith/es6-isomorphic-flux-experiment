var _ = require("lodash");

var app = null;
var navigationCallback = _.noop;
var currentRoute;

function setApplication(application){
   app = application;
}

var serial = 0;
function last(success, fail){
   var id = serial++;

   return [ 
      function(){
         if (id + 1 == serial){

            success.apply(success, arguments);

         }
      }, 
      function(){
         if (id + 1 == serial){
            fail.apply(fail, arguments);
         }
      }
   ];
}


function navigateTo(href, optimize = true){

   var transitionContext = app.context.clone();

   var currentRoute = optimize === true? app.currentRoute : optimize;

   var routing = app.router.runRoute(transitionContext, href, {currentRoute});

   routing.then.apply(routing, 
      last( 
         _.partialRight(emitNavigation, href),

         (reason) => {
            transitionContext = null;

            if (reason.redirect) {
               navigateTo(reason.redirect);
            }
            else {
               console.error(err);
            }
         }
      ) 
   )


}
function receiveNavigation(){
   var transitionContext = app.context.clone();

   var previousRoute = app.currentRoute;
   var receivedRoute = location.pathname + location.search;

   var routing = app.router.runRoute(transitionContext, receivedRoute, {currentRoute: previousRoute});

   routing.then.apply(routing,
      last( 
         _.partialRight(emitNavigation, null, true),

         (reason) => {
            transitionContext = null;

            if (reason.redirect) {
               navigateTo(reason.redirect);
            }
            else {
               console.error(err);
            }
         }
      ) 
   )
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
