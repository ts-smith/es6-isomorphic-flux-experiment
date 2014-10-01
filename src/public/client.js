var React = require('react/addons'),
    Fetcher = require('fetchr'),
    Application = require('./app'),
    Router = require('./util/router'),
    routes = require('./routes'),
    fetcher = new Fetcher({
        xhrPath: Application.config.xhrPath
    }),
    Navigator = require("./util/navigator"),
    dehydratedState = App && App.Context; // Sent from the server

window.React = React; // For chrome dev tool support

var router = new Router(routes);

var application = new Application({
    fetcher, router,
    initialState: dehydratedState
});

application.currentRoute = location.pathname + location.search; 

Navigator.setApplication(application);

application.context.actionInterface.dispatch("ON_CLIENT", application.context.actionInterface);

React.renderComponent(
   application.getComponent(),
   document.getElementById('app')
);




Navigator.onNavigate( (dehydratedContext, url, reactive) => {

   if (!reactive){
      history.pushState(null, "", url);
   }

   application.currentRoute = location.pathname + location.search; 

   application.context.rehydrate(dehydratedContext);

   application.context.actionInterface.dispatch("NAVIGATION");
});

window.onpopstate = Navigator.receiveNavigation;
