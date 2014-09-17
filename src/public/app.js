'use strict';
var PreDifferentiatedContext = require('../context'),
    MessageStore = require('./stores/ListStore'),
    Application = require('./components/ListComponent.js');//possibly jsx, see compiler

//TODO get store and components, then try this shit out

PreDifferentiatedContext.registerStore(MessageStore);

function App({fetcher, initialState}) {
    this.preDifferentiatedContext = new PreDifferentiatedContext({ fetcher });
    if (initialState) { 
        this.context.rehydrate(initialState);
    }
}

App.prototype.getComponent = function () {
    return Application({context: this.preDifferentiatedContext.getComponentContext()});
    
};

module.exports = App;
module.exports.config = {
    xhrPath: '/api'
}
