var Dispatcher = require('dispatchr')();

class Context{
   constructor({fetcher}){
      this.dispatcher = new Dispatcher({});
      this.fetcher = fetcher || null;
      this.actionInterface = this.getActionInterface();
      this.componentInterface = this.getComponentInterface();
   }
   getComponentInterface(){
      return {
         executeAction (actionController, payload) {
            actionController(this.actionInterface, payload, (err) => {
               if (err) {
                  console.error(err);
               }
            });
         },
         getStore: this.dispatcher.getStore.bind(this.dispatcher)
      }
   }
   getActionInterface() {
      return {
         dispatch: this.dispatcher.dispatch.bind(this.dispatcher),
         executeAction (actionController, payload, done) {
            actionController(this.actionInterface, payload, done)
         },
         //this isn't necessary for the client since they just listen for events
         executeActionP(actionController, payload){
            return new Promise((resolve,reject) => {
               actionController(this.actionInterface, payload || {}, (err, result) => {
                  if (err) reject(err)
                  else resolve(result)
               })
            });
         },
         fetcher: this.fetcher,
         getStore: this.dispatcher.getStore.bind(this.dispatcher)
      }
   }
   dehydrate(){
      return {
         dispatcher: this.dispatcher.dehydrate()
      }
   }
   rehydrate(state){
      this.dispatcher.rehydrate(state.dispatcher || {});
   }
}

//may not work with class syntax
Context.registerStore = Dispatcher.registerStore.bind(Dispatcher);

module.exports = Context;
