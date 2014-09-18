var Dispatcher = require('dispatchr')();

class Context{
   constructor(options){
      options = options || {};
      this.dispatcher = new Dispatcher({});
      this.fetcher = options.fetcher || null;
      this.actionInterface = this.getActionInterface();
      this.componentInterface = this.getComponentInterface();
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
         getStore: self.dispatcher.getStore.bind(self.dispatcher)
      }
   }
   getActionInterface() {
      var self = this;
      return {
         dispatch: self.dispatcher.dispatch.bind(self.dispatcher),
         executeAction (actionController, payload, done) {
            actionController(self.actionInterface, payload, done)
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
