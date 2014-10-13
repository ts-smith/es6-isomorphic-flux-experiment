var _ = require('lodash');
   


var config = {
   '/': {
      async: true,
      get: (ai, params, resolve, reject) => {
         reject({redirect: "/slide/0"});
      },
      '/slide': {
         '/:id': {
            always: (ai, params, resolve, reject) => {

               ai.dispatch("RECEIVE_ROUTING_VALUES", {
                  slideIndex: _.parseInt(params.id),
                  mountPoint: "/slide/" + _.parseInt(params.id)
               });
               resolve();

            },
            get: (ai, params, resolve, reject) => {
               ai.dispatch("RECEIVE_ROUTING_VALUES", {selection: null});
               resolve();
            },
            '/selection': {
               '/:selection': {
                  get: (ai, params, resolve, reject) => {
                     ai.dispatch("RECEIVE_ROUTING_VALUES", {selection: params.selection});
                     resolve();
                  }
               }
            }
         }
      }
   }
}
module.exports = config;
/*
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
*/
