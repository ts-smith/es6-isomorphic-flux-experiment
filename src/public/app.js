var Context = require('./Context'),
    MessageStore = require('./stores/ListStore'),
    NavStore = require('./stores/NavStore'),
    Application = require('./components/ListComponent.js');


Context.registerStore(MessageStore);
Context.registerStore(NavStore);

function App({fetcher, initialState}) {
    this.context = new Context({ fetcher });
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
