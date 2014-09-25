var React = require('react/addons'),
    Fetcher = require('fetchr'),
    Application = require('./app'),
    Router = require('./util/router'),
    routes = require('./routes'),
    fetcher = new Fetcher({
        xhrPath: Application.config.xhrPath
    }),
    dehydratedState = App && App.Context; // Sent from the server

window.React = React; // For chrome dev tool support

var router = new Router(routes);

var application = new Application({
    fetcher, router,
    initialState: dehydratedState
});
window.context = application.context;

var app = application.getComponent(),
    mountNode = document.getElementById('app');

React.renderComponent(app, mountNode);

window.application = application;
window.mountNode = document.getElementById('app');
window.__router = router;

window.onpopstate = function(event) {
   console.log(event.state);

   context.rehydrate(event.state);

   //blegh
   React.renderComponent(application.getComponent(), mountNode);
   
};
