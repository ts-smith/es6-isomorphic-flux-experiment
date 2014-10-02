var Context = require('./Context'),
    PresentationStore = require('./stores/PresentationStore'),
    NavStore = require('./stores/NavStore'),
    Application = require('./components/Application.js');

Context.registerStore(PresentationStore);
Context.registerStore(NavStore);

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
