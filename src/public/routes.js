var readList = require('./actions/readList'),
    getNav = require('./actions/getNav');


var config = {
   '/': {
      trunk: [getNav],
      //always: [getNav],
      get: function(ai,p,r){
         console.log("what");
         ai.executeActionP(getNav).then(r);
      },
      '/list': {
         get: [readList]
      },
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
}
module.exports = config;
