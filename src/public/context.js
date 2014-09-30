var Dispatcher = require('dispatchr')();

class Context{
   constructor({fetcher}){
      this.dispatcher = new Dispatcher({});
      this.fetcher = fetcher || null;
      this.actionInterface = this.getActionInterface();
      this.componentInterface = this.getComponentInterface();
   }
   clone(){
      var newContext = new Context({fetcher: this.fetcher})
      newContext.rehydrate(this.dehydrate());
      return newContext;
   }
   getComponentInterface(){
      var self = this;
      return {
         executeAction (actionController, payload) {
            actionController(self.actionInterface, payload, (err) => {
               if (err) {
                  console.error(err);
               }
            });
         },
         getStore: this.dispatcher.getStore.bind(this.dispatcher)
      }
   }
   getActionInterface() {
      var self = this;
      return {
         dispatch: self.dispatcher.dispatch.bind(self.dispatcher),
         executeAction (actionController, payload, done) {
            actionController(self.actionInterface, payload, done)
         },
         //this isn't necessary for the client since they just listen for events
         executeActionP(actionController, payload){
            return new Promise((resolve,reject) => {
               actionController(self.actionInterface, payload || {}, (err, result) => {
                  if (err) reject(err)
                  else resolve(result)
               })
            });
         },
         fetcher: self.fetcher,
         getStore: self.dispatcher.getStore.bind(self.dispatcher)
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
