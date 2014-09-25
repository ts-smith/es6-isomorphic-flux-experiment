var readList = require('./actions/readList'),
    getNav = require('./actions/getNav'),
    setNavProp = require("./actions/setNavProp"),
    async = require("./actions/asyncTask");


var config = {
   '/': {
      trunk: [getNav],
      //always: [getNav],
      get: function(ai,p,r){
         console.log("what");
         ai.executeActionP(getNav).then(r);
      },
      '/list': {
         get: (ai, params, resolve, reject) => {
            Promise.all([
               ai.executeActionP(readList),
               ai.executeActionP(setNavProp, {view: "list"})
            ]).then(resolve);
         }
      },
      '/something-else': {
         get: (ai, params, resolve, reject) => {
            //console.log("setting nav prop", setNavProp);
            ai.executeActionP(setNavProp, {view: "something-else"}).then(resolve).
            catch(console.error);
         }
      },
      '/async': {
         async: true,
         always: (ai, params, resolve, reject) => {
            ai.executeActionP(async.longTask)
            .then(() => {
               return ai.executeActionP(setNavProp, {view: "async"});
            })
            .then(resolve);
         },
         '/one': {
            get: (ai, params, resolve, reject) => {
               ai.executeActionP(async.smallTask, "one").then(resolve);
            }
         },
         '/two': {
            get: (ai, params, resolve, reject) => {
               ai.executeActionP(async.smallTask, "two").then(resolve);
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
