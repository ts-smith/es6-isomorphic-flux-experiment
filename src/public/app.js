var Context = require('./Context'),
    MessageStore = require('./stores/ListStore'),
    NavStore = require('./stores/NavStore'),
    AsyncStore = require('./stores/AsyncStore'),
    Application = require('./components/ListComponent.js');


Context.registerStore(MessageStore);
Context.registerStore(NavStore);
Context.registerStore(AsyncStore);

function App({fetcher, initialState, router}) {
   this.context = new Context({ fetcher });
   this.router = router;
   
   if (initialState) { 
      this.context.rehydrate(initialState);
   }
}

App.prototype.getComponent = function () {
    return Application({context: this.context.componentInterface});
};

module.exports = App;
module.exports.config = {
    xhrPath: '/api'
}
