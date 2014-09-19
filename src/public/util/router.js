var urlPattern = require('url-pattern'),
    _ = require("lodash");

require('traceur');

var config = {
   '/something-:rootVal': {
      config: {
         data: "for this route"
      },
      get: (componentActionInterface, route, done) => {
      },
      "/subroute": {
         get: (componentActionInterface, route, done) => {

         },
         "/:sub": { },
         "/zero": { }
      },
      "/anotherRouter": { }
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

var members = ["get", "post", "delete", "put", "async", 'config'];
var routes = new RouteTable("/",0);
function walkRouteDescription(description, routeTable, layer){
   var routes = Object.keys(description);
   for (var i = 0; i < routes.length; i++){
      var prop = routes[i];
      if (members.indexOf(prop) == -1){
         var route = prop;

         var subTable = new RouteTable(route, layer + 1);

         routeTable.addSubRoute(subTable);

         var subRoutes = description[route];
         console.log(layerIndent(layer), route);

         walkRouteDescription(subRoutes, subTable, layer + 1);
      }
      else {
         routeTable.addProp(prop,description[prop]);
      }
   }
}

function layerIndent(layer){
   var val = "";
   for (var i = 0; i < layer; i++){
      val += "\t";
   }
   return val;
}

//walkRouteDescription(config), 0

walkRouteDescription(config, routes, 0);
//console.log(JSON.stringify(routes, null, 2));
   

function routePieces(route){
   return route.split("/").map(piece => {return "/" + piece;});
}

var log = function(index, ...rest){
   var indent = layerIndent(index);
   console.log(indent, ...rest);
}

function getRoutePath(url, routes){
   var pieces = routePieces(url);
   var matches = [];
   recursiveMatch([routes], 0); 
   return matches;


   function recursiveMatch(table, index){
      //console.log("Table",table, index);
      if(!pieces[index]) {return};
      for (var i = 0; i < table.length; i++){
         var route = table[i];
         //console.log("route",route);
         var match = route.pattern.match(pieces[index]);
         if (match){
            matches.push({match, route});
            recursiveMatch(route.routeTable, index + 1 );
            break;
         }
      }
   }
}

var url = "/something-one/subroute";
var urlTwo = "/something-two/subroute/zero";

var matches = getRoutePath(url, routes);
var matchesTwo = getRoutePath(urlTwo, routes);

function routeDiffs(currentRoute, nextRoute){
   var newParts = [];
   for (var i = 0; i < nextRoute.length; i++){

      var routeOnePart = currentRoute[i];
      var routeTwoPart = nextRoute[i];

      if (!routeOnePart){
         newParts.push(routeTwoPart);
         continue;
      }

      if (routeOnePart.route != routeTwoPart.route || !_.isEqual(routeOnePart.match, routeTwoPart.match)){
         newParts.push(routeTwoPart);
      }
   }
   console.log(JSON.stringify(newParts, null, 2));
}
routeDiffs(matches, matchesTwo);

//log(0,JSON.stringify(matches, null, 2));

/*
routes.routeTable.forEach((route) => {
   //console.log(route.pattern);
   log(pieces[1], route.pattern);
   log(route.pattern.match(pieces[1]));
})
//console.log(routes.pattern);

log(routes.pattern.match(pieces[0]));
*/


//go over each route
   //create routing object
   //push to list
   //go over all sublists
      //add them to routing object as subroutes
      //recurse

//routes.routeTable = [];
//for route in routes.iterable:
   //routeTable.push






/*



{
   route: "__base",
   routeTable: [
      {
         route: "/something",
         routeTable: [],
         methods: []
      }

   ],
   methods: []

}


//start iteration with empty routeTable

class RouteTable{
   constructor(route, methods){
      this.route = route; //route could be a pattern
      this.pattern = makePattern(route);
      this.routeTable = [];
      this.methods = methods;
   }
}

var baseTable = new RouteTable("",[]);

recursiveGeneration(routeObject){
    

}


//have route description
//want to create route table




//methods in the tree (or routes) could also defined what to do when route is left

//what is the appropriate communication interface between the client?
   //send route action
   //create route diff (how to I get old route, and in what format?) a store? this isn't really for the interface. does it fit with the architecture?
   //launch diff actions (oldRoute leave, route enter)


var methods = ["get", "post", "delete", "put", "async", 'otherstuff'];
class Router{
   constructor(config){
      this.config = config;
      this.createRouteTree();
      //parse out router and create routing tree
   }
   createRouteTree(config){
      var routeTable = [];
      var noSlashes = /^\/*([^\/]*)/;


      function recursiveGenerate(){}

      //I want to map strings to the series of routes that match it
      //so each part of the route maps to a pattern
      //and I need to get the pattern from somewhere


      for (route in this.config){
         routeTree[route] = {
            pattern: urlPattern.newPattern(route);
         }
      }
   }
   //tells the router what component to render to when done routing, where to get the context from
   regsiterApplication(application){}

   diffRoutes(route){
      for (routeBase in this.routeTree){
      
         if         

      }
   }




   //need a diff routes method, which returns the difference between the two routes (what is a difference?)
      //is it just a routing branch below a place in the tree

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
