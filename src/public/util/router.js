var urlPattern = require('url-pattern'),
    _ = require("lodash");

require('traceur');

//the methods can map to a function, a list of actions, a or promise

//in syncronous mode
   //the list of actions will all be run, and after they are done, the component will be rendered
   //the function will be passed resolve and reject and must call resolve when it is done to render the whole thing
      //function signature is componentActionInterface, params, resolve, reject

//in async mode
   //this list of actions will be collected, and the next level will be run once they are done
   //the function will be passed componentActionInterface, params, resolve, reject

   //waterfall mode
      //the list of actions will be executed in sequence

//params looks like
/*
   {_passed: {}, //from previous async calls
      ..the rest 
   }

*/

//how to handle redirects?

var config = {
   '/something-:rootVal': {
      config: {
         data: "for this route"
      },
      get: (componentActionInterface, params, done) => { },
      "/": {
         get: (componentActionInterface, params, done) => { } 
      },
      "/subroute": {
         get: (componentActionInterface, params, done) => { },
         "/sub": { },
         "/zero": { }
      },
      "/anotherRoute": { 
         "/sub": { }
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
   constructor(routingDescription, currentRoute){
      this.routes = new RouteTable("/",0);
      this.generateRoutingTable(routingDescription, this.routes, 0);
      this.currentRoute = currentRoute || "/"; //what do?
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
      return route.split("/").map(piece => {return "/" + piece;});
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
               matches.push({match, route});
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

   loadApplication(application){}
   runRoute(url, {method, noDiff}) {
      var actionPath = this.getRoutePath(url);

      if (!noDiff){
         var oldPath = this.getRoutePath(this.currentRoute);
         actionPath = routeDiffs(oldPath, actionPath);
      }

      this.currentRoute = url;
   }
}


var url = "/something-one/subroute/sub";
var urlTwo = "/something-one/anotherRoute/sub";
var urlErr = "/something-one/anotherRoute/sub/er1/er2";
var withRoot = "/something-one/";

var router = new Router(config);


//console.log(router.diffUrls(url, urlTwo));
console.log(router.diffUrls(urlTwo, withRoot));

/*

//methods in the tree (or routes) could also defined what to do when route is left

//what is the appropriate communication interface between the client?
   //send route action
   //create route diff (how to I get old route, and in what format?) a store? this isn't really for the interface. does it fit with the architecture?
   //launch diff actions (oldRoute leave, route enter)

   //routing is calling actions with the context of a given application, recursively

   //have a method for initiating routing on the client side
      //route to ('url') should diff the route against the current route and call all the actions in the diff
      //if no optimize is set, use the whole tree

      //calling done isn't necessary on client (although knowing when all route functions have completed could be useful)

   //have a method for handling routing on the server
      //needs to go over object, and create routes for it
      //for each mapped route, it should then execute the function specified.
      
      //after all the functions are called, render a component and send it out
}





   */
