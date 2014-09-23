var urlPattern = require('url-pattern'),
    _ = require("lodash");

require('traceur');

//how to handle redirects?

//need to understand/write
   //getResult (shorthand for executePathActionP and callPathFunction self dispatcher, not necessary)
      //also includes place for "method", which would be passed in to the entire function, and would then dispatch the selected method instead of just calling the "always" function
   //render, or what to do when done


//these functions could be part of some pathAction prototype
function actionType(pathAction, method = "always"){
   var action = pathAction.route.props[method];
   var async = pathAction.route.props.async;

   if (!action){
      return {type: false, async: false};
   }
   if (_.isArray(action)){
      return {type: "array", async};
   }
   else return {type: "function", async};
}




var config = {
   '/something-:rootVal': {
      config: { data: "for this route" },
      async: true,
      always: (componentActionInterface, params, resolve, reject) => { 
         console.log("/something-:rootVal always", params);
         console.log("async action");
         setTimeout(()=>{

            console.log("done");
            resolve();
         }, 1000);
      },
      "/subroute": {
         always: (componentActionInterface, params, resolve, reject) => {
            console.log("/subroute always", params);
            resolve();
         },
         get: (componentActionInterface, params, resolve, reject) => { 
            console.log("/subroute get", params);
            resolve();
         },
         "/sub": { 
            get: (componentActionInterface, params, resolve, reject) => {
               console.log("/sub get", params);
               resolve();
            }
         },
         "/zero": { }
      },
      "/anotherRoute": { 
         async: true,
         always: (componentActionInterface, params, resolve, reject) => {
            console.log("/anotherRoute always");
            console.log("async");
            setTimeout(() => {
               console.log("done");
               resolve();
            },500)
         },
         "/sub": {
            get: (componentActionInterface, params, resolve, reject) => {
               console.log("/sub get");
               resolve();
            }
         },
      }
   }
}

class RouteTable {
   constructor(route,depth){
      this.routeTable = []; 
      this.depth = depth;
      this.route = route;
      this.pattern = urlPattern.newPattern(route);
      this.props = {};
   }
   addSubRoute(routeTable){
      this.routeTable.push(routeTable);
   }
   addProp(prop, value){
      this.props[prop] = value;
   }
}

RouteTable.members = ["always", "get", "post", "delete", "put", "async", 'config'];

class Router{
   constructor(routingDescription, currentRoute = "/"){
      this.routes = new RouteTable("/",0);
      this.generateRoutingTable(routingDescription, this.routes, 0);
      this.currentRoute = currentRoute;
   }
   generateRoutingTable(description, routeTable, layer){
      var routes = Object.keys(description);
      for (var i = 0; i < routes.length; i++){
         var prop = routes[i];
         if (RouteTable.members.indexOf(prop) == -1){
            var route = prop;

            var subTable = new RouteTable(route, layer + 1);

            routeTable.addSubRoute(subTable);

            var subRoutes = description[route];

            this.generateRoutingTable(subRoutes, subTable, layer + 1);
         }
         else {
            routeTable.addProp(prop,description[prop]);
         }
      }
   }
   diffUrls(current, next){
      return this.routeDiffs(
         this.getRoutePath(current), 
         this.getRoutePath(next)
      )
   }
   routePieces(route){
      var internalRoute;
      if (route[route.length - 1] === "/"){
         internalRoute = route.slice(0,-1);
      }
      else internalRoute = route;
      return internalRoute.split("/").map(piece => {return "/" + piece;});
   }
   getRoutePath(url){
      var pieces = this.routePieces(url);
      var matches = [];
      recursiveMatch([this.routes], 0); 
      return matches;


      function recursiveMatch(table, index){
         if(!pieces[index]) {return};
         for (var i = 0; i < table.length; i++){
            var route = table[i];
            var match = route.pattern.match(pieces[index]);
            if (match){
               matches.push({params: match, route});
               recursiveMatch(route.routeTable, index + 1 );
               return;
            }
         }
         console.log("Warning: Route part \"" + pieces[index] + "\" of \"" + url + "\" not matched");
      }
   }
   routeDiffs(currentRoute, nextRoute){
      for (var i = 0; i < nextRoute.length; i++){

         var currentRoutePart = currentRoute[i];
         var nextRoutePart = nextRoute[i];

         if (!currentRoutePart || currentRoutePart.route != nextRoutePart.route || !_.isEqual(currentRoutePart.match, nextRoutePart.match)){
            return nextRoute.slice(i);
         }
      }
      return [];
   }

   registerContext(context){
      this.context = context;
   }
   runRoute(url, method = "get", {noDiff} = {}) {
      var actionPath = this.getRoutePath(url);

      if (!noDiff){
         var oldPath = this.getRoutePath(this.currentRoute);
         actionPath = this.routeDiffs(oldPath, actionPath);
      }

      this.runPathActions(actionPath, method);
      this.currentRoute = url;
   }
   executePathActionP(pathAction, method = "always"){
      var action = pathAction.route.props[method];

      if (_.isArray(action)) return Promise.all (
            action.map(this.context.actionInterface.executeActionP)
      )
      else if (_.isFunction(action)) return new Promise((resolve, reject) => {
         action( this.context.actionInferface, pathAction.params, resolve, reject );
      })
      else return Promise.resolve();
   }

   runPathActions(pathActions, method){
      console.log("actions: " + JSON.stringify(
         pathActions.map(action => {return action.route.route}), 

      null, 2));

      var index = 1;
      var actionPromises = [];
      var self = this;

      if (pathActions[0]) {
         runPathAction( pathActions[0], makeNext(pathActions[index]) )
      }
      else {
         console.log("no actions (nonsense route?)");
      }

      function makeNext(pathAction){

         if (pathAction) return function(){
            ++index;
            runPathAction( pathAction, makeNext(pathActions[index]));
         }
         else return false;
      }

      function runPathAction(action, next){
         console.log("running action " + action.route.route);

         if (next){

            var async = action.route.props.async;

            if ( async){
                  self.executePathActionP(action)
                  .then(next)
                  //.catch {stop prop, possibly redirect}
                  .catch(err => {
                     console.error(err);
                  })
            }
            else {
               actionPromises.push( self.executePathActionP(action) );
               next();
            }
         }
         else {
            console.log('end of line');
            //async irrelevant
            actionPromises.push(self.executePathActionP(action));
            actionPromises.push(self.executePathActionP(action, method));

            console.log("methods executed");

            Promise.all( actionPromises )
            .then(() => {
               console.log("complete")
               //render or something
            })
            .catch(err => {
               console.error("error: ", err);
            })
            //.catch {stop prop, possibly redirect}
         }
      }
   }
}


var url =      "/something-one/subroute/sub";
var urlTwo =   "/something-one/anotherRoute/sub";
var urlErr =   "/something-one/anotherRoute/sub/er1/er2";
var withRoot = "/something-one/";

var router = new Router(config);
router.registerContext({});

var routeDiffs = router.diffUrls(withRoot, urlTwo);

//console.log(routeDiffs);

console.log("route: " + url)
router.runRoute(url);
setTimeout(() => {
   console.log("\n\n");
   console.log("route: " + urlTwo)
   router.runRoute(urlTwo);



   setTimeout(() => {
      console.log("\n\n"); 
      console.log("route: " + withRoot)
      router.runRoute(withRoot);


      setTimeout(() => {
         console.log("\n\n");
         console.log("with un matched route");
         console.log("route: " + urlErr)
         router.runRoute(urlErr);


         setTimeout(() => {
            console.log("\n\n");
            console.log("nested async skip");
            console.log("route: " + urlTwo);
            router.runRoute(urlErr);
         },1000);

      },1000);


   }, 1000)


},2000);
//router.runRoute(withRoot);
