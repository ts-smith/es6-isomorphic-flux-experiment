var urlPattern = require('url-pattern');

var config = {
   '/routeRoot': {
      config: {
         data: "for this route"
      },
      get: (componentActionInterface, route, done) => {

      },
      "/subroute": {
         get: (componentActionInterface, route, done) => {

         }
      }
   }
}
//methods in the tree (or routes) could also defined what to do when route is left

//what is the appropriate communication interface between the client?
   //send route action
   //create route diff (how to I get old route, and in what format?) a store? this isn't really for the interface. does it fit with the architecture?
   //launch diff actions (oldRoute leave, route enter)


class Router{
   constructor(config){
      this.config = config;
      this.createRouteTree();
      //parse out router and create routing tree
   }
   createRouteTree(config){
      var routeTree = {};
      for (route in this.config){
         routeTree[route] = {
            pattern: urlPattern.newPattern(route+"(/_theRest)");
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