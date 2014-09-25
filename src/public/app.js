var Context = require('./Context'),
    MessageStore = require('./stores/ListStore'),
    NavStore = require('./stores/NavStore'),
    AsyncStore = require('./stores/AsyncStore'),
    Application = require('./components/ListComponent.js');


Context.registerStore(MessageStore);
Context.registerStore(NavStore);
Context.registerStore(AsyncStore);

function App({fetcher, initialState, router}) {
    this.context = new Context({ fetcher, router });
    this.otherContext = new Context({ fetcher, router });
    if (initialState) { 
       this.context.rehydrate(initialState);
    }
}
var serial = 0;

App.prototype.getComponent = function () {
    return Application({context: this.context.componentInterface, key: serial++});
};

module.exports = App;
module.exports.config = {
    xhrPath: '/api'
}
