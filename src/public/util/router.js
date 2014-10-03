var urlPattern = require('url-pattern'),
    querystring = require('querystring'),
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
   runRoute (context, url, options) {
      var {currentRoute, method} = _.defaults(options,{
         currentRoute: null,
         method: "get"
      });

      var relative = url[0] != "/" && currentRoute;

      if (relative){
         var relativeTo = currentRoute.slice(0,
               currentRoute.lastIndexOf("/") + 1
            );

         url = relativeTo + url;
      }


      var actionPath = this.getRoutePath(url);

      if (currentRoute){
         var oldPath = this.getRoutePath(currentRoute);
         actionPath = this.routeDiffs(oldPath, actionPath);
      }

      this.currentRoute = url;
      return this.runPathActions(context, actionPath, method);
   }
   diffUrls(current, next){
      return this.routeDiffs(
         this.getRoutePath(current), 
         this.getRoutePath(next)
      )
   }
   routePieces(route){
      var internalRoute = route;

      if (route[route.length - 1] === "/"){
         //end slashes can be handled by "trunk"
         internalRoute = route.slice(0,-1);
      }
      else internalRoute = route;

      var [pureRoute, params] = internalRoute.split("?");

      var pieces = pureRoute.split("/").map(piece => {return "/" + piece;});

      return {pieces, params: querystring.parse(params)};

   }
   //route table state
   getRoutePath(url){
      var {pieces, params} = this.routePieces(url);
      //console.log(pieces);
      var matches = [];
      recursiveMatch([this.routes], 0); 
      if (matches[matches.length - 1]){
         matches[matches.length - 1].terminal = true;
      }

      if (matches){
         _.assign(matches[matches.length -1].params, params);
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

         if (!currentRoutePart 
            || currentRoutePart.route != nextRoutePart.route 
            || !_.isEqual(currentRoutePart.params, nextRoutePart.params)
            || !currentRoutePart.terminal && nextRoutePart.terminal){
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
         var rejected = false;

         if (pathActions[0]) {
            runPathAction( pathActions[0], makeNext(pathActions[index]) )
         }
         else {
            console.log("no actions (nonsense route?)");
            resolve(context);
         }

         function makeNext(pathAction){

            if (pathAction) return function(){
               //this may not work
               if (!rejected){
                  ++index;
                  runPathAction( pathAction, makeNext(pathActions[index]));
               }
            }
            else return false;
         }


         function runPathAction(action, next){

            if (next){

               var async = action.route.props.async;

               if (async){
                     Promise.all(
                        [self.executePathActionP(context, action)
                        ,self.executePathActionP(context, action, "trunk")]
                     )
                     .then(next)
                     .catch(reject);
               }
               else {
                  actionPromises.push( 
                     self.executePathActionP(context, action),
                     self.executePathActionP(context, action, "trunk") 
                  );
                  next();
               }
            }
            else {
               //async irrelevant
               actionPromises.push(
                  self.executePathActionP(context, action),
                  self.executePathActionP(context, action, method),
                  self.executePathActionP(context, action, "leaf")
               );


               Promise.all( actionPromises )
               .then(() => {
                  resolve(context);
               })
               .catch(err => {
                  rejected = true;
                  reject(err);
               });
            }
         }
      });
   }
}

module.exports = Router;
