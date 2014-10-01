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

Navigator.setApplication(application);

application.context.actionInterface.dispatch("ON_CLIENT", application.context.actionInterface);

React.renderComponent(
   application.getComponent(),
   document.getElementById('app')
);




Navigator.onNavigate( (dehydratedContext, url) => {
   application.context.rehydrate(dehydratedContext);
   history.pushState(dehydratedContext, "", url);

   application.context.actionInterface.dispatch("NAVIGATION");
});

window.onpopstate = function(event) {

   //this is super defensive and should never not be true now
   if (event.state){
      application.context.rehydrate(event.state);

      application.context.actionInterface.dispatch("NAVIGATION");
   }
   else {
      location.reload();
   }
   
};
