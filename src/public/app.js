var Context = require('./Context'),
    MessageStore = require('./stores/ListStore'),
    NavStore = require('./stores/NavStore'),
    Application = require('./components/ListComponent.js');


Context.registerStore(MessageStore);
Context.registerStore(NavStore);

function App({fetcher, initialState, router}) {
    this.context = new Context({ fetcher });
    if (router) {
       this.router = router.instance(this.context);
    }
    if (initialState) { 
       this.context.rehydrate(initialState);
    }
}

App.prototype.getComponent = function () {
    return Application({context: this.context.componentInterface});
    
};
App.prototype.runRoute = function(...args){
   if (this.router){
      return this.router.runRoute(...args);
   }
   else return Promise.reject();
}

module.exports = App;
module.exports.config = {
    xhrPath: '/api'
}
