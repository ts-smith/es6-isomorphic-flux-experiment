var React = require('react/addons'),
    Fetcher = require('fetchr'),
    Application = require('./app'),
    fetcher = new Fetcher({
        xhrPath: Application.config.xhrPath
    }),
    dehydratedState = App && App.Context; // Sent from the server

window.React = React; // For chrome dev tool support

var application = new Application({
    fetcher: fetcher,
    initialState: dehydratedState
});
window.context = application.context;

var app = application.getComponent(),
    mountNode = document.getElementById('app');

React.renderComponent(app, mountNode);
