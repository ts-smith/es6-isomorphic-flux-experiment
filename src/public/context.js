var Dispatcher = require('dispatchr')();

class Context{
   constructor(options){
      options = options || {};
      this.dispatcher = new Dispatcher({});
      this.router = new Router(options.routes);
      this.fetcher = options.fetcher || null;
      this.actionContext = this.getActionContext();
      this.componentContext = this.getComponentContext();
   },
   getComponentContext(){
      var self = this;
      return {
         executeAction (actionController, payload) {
            actionController(self.actionContext, payload, (err) => {
               if (err) {
                  console.error(err);
               }
            });
         },
         getStore: self.dispatcher.getStore.bind(self.dispatcher),
         makePath: self.router.makePath.bind(self.router)
      }
   },
   getActionContext() {
      var self = this;
      return {
         dispatch: self.dispatcher.dispatch.bind(self.dispatcher);
         executeAction (actionController, payload, done) {
            actionController(self.actionContext, payload, done);
         },
         fetcher: self.fetcher,
         getStore: self.dispatcher.getStore.bind(self.dispatcher)
      }
   },
   dehydrate(){
      return {
         this.dispatcher.dehydrate()
      }
   },
   rehydrate(state){
      this.dispatcher.rehydrate(state.dispatcher || {});
   }
}

//may not work with class syntax
Context.registerStore = Dispatcher.registerStore.bind(Dispatcher);

module.exports = Context;
