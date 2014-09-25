var urlPattern = require('url-pattern'),
    _ = require("lodash");


//how to handle redirects? use reject?

//possible to diff actions and not routes?

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

RouteTable.members = ["always", "trunk", "leaf", "get", "post", "delete", "put", "async", 'config'];
//trunk is called when not terminal
//leaf is called when terminal

class Router{
   constructor(routingDescription){
      this.routes = new RouteTable("/",0);
      this.generateRoutingTable(routingDescription["/"] || routingDescription, this.routes, 0);
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
   instance(context, currentRoute){
      var self = this;
      return {
         context, currentRoute, 
         runRoute: function (url, method = "get", {noDiff} = {}) {
            var actionPath = self.getRoutePath(url);

            if (!noDiff && currentRoute){
               var oldPath = self.getRoutePath(this.currentRoute);
               actionPath = self.routeDiffs(oldPath, actionPath);
            }

            this.currentRoute = url;
            return self.runPathActions(this.context, actionPath, method);
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
   //route table state
   getRoutePath(url){
      var pieces = this.routePieces(url);
      //console.log(pieces);
      var matches = [];
      recursiveMatch([this.routes], 0); 
      if (matches[matches.length - 1]){
         matches[matches.length - 1].terminal = true;
      }
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

   executePathActionP(context, pathAction, method = "always"){
      var action = pathAction.route.props[method];

      if (_.isArray(action)) return Promise.all (
            action.map(context.actionInterface.executeActionP)
      )
      else if (_.isFunction(action)) return new Promise((resolve, reject) => {
         action( context.actionInterface, pathAction.params, resolve, reject );
      })
      else return Promise.resolve();
   }

   runPathActions(context, pathActions, method){
      console.log("actions: " + JSON.stringify(
         pathActions.map(action => {return action.route.route}), 

      null, 2));

      var index = 1;
      var actionPromises = [];
      var self = this;


      return new Promise((resolve,reject) => {

         if (pathActions[0]) {
            runPathAction( pathActions[0], makeNext(pathActions[index]) )
         }
         else {
            console.log("no actions (nonsense route?)");
            resolve();
         }

         function makeNext(pathAction){

            if (pathAction) return function(){
               ++index;
               runPathAction( pathAction, makeNext(pathActions[index]));
            }
            else return false;
         }


         function runPathAction(action, next){

            //console.log("running action " + action.route.route);

            if (next){

               var async = action.route.props.async;

               if (async){
                     Promise.all(
                        [self.executePathActionP(context, action)
                        ,self.executePathActionP(context, action, "trunk")]
                     )
                     .then(next)
                     //.catch {stop prop, possibly redirect}
                     .catch(err => {
                        console.error(err);
                     })
               }
               else {
                  actionPromises.push( self.executePathActionP(context, action) );
                  actionPromises.push( self.executePathActionP(context, action, "trunk") );
                  next();
               }
            }
            else {
               //console.log('end of line');
               //async irrelevant
               actionPromises.push(self.executePathActionP(context, action));
               actionPromises.push(self.executePathActionP(context, action, method));
               actionPromises.push(self.executePathActionP(context, action, "leaf"));

               //console.log("methods executed");

               Promise.all( actionPromises )
               .then(() => {
                  //console.log("complete")
                  //render or something
                  resolve();
               })
               .catch(err => {
                  console.error("error: ", err);
                  reject("wat");
               })
               //.catch {stop prop, possibly redirect}
            }
         }
      });
   }
}

module.exports = Router;

//var url =      "/something-one/subroute/sub";
//var urlTwo =   "/something-one/anotherRoute/sub";
//var urlErr =   "/something-one/anotherRoute/sub/er1/er2";
//var withRoot = "/something-one/";

//var router = new Router(config);
//router.registerContext({});

//var routeDiffs = router.diffUrls(withRoot, urlTwo);

//console.log(routeDiffs);

/*
console.log("route: " + url)
router.runRoute(url)

.then(() => {
   console.log("\n\n");
   console.log("route: " + urlTwo)
   return router.runRoute(urlTwo)
})

.then(() => {
   console.log("\n\n"); 
   console.log("route: " + withRoot)
   return router.runRoute(withRoot);
})

.then(() => {
   console.log("\n\n");
   console.log("with un matched route");
   console.log("route: " + urlErr)
   return router.runRoute(urlErr, "post");
})

.then(() => {
   console.log("\n\n");
   console.log("nested async skip");
   console.log("route: " + urlTwo);
   return router.runRoute(urlTwo);
})
*/
