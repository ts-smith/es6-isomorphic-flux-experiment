var _ = require('lodash');
    //setSlide = require("./actions/setSlide");
   


var config = {
   '/slide': {
      '/:id': {
         get: (ai, params, resolve, reject) => {

            ai.dispatch("RECEIVE_INDEX", {slideIndex: _.parseInt(params.id)});
            resolve();

            /*
            ai.executeActionP(setSlide, {slideIndex: _.parseInt(params.id)})
            .then(resolve)
            .catch(err => {
               console.error(err); reject();
            });
            */
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
