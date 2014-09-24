require('traceur');

var http = require('http'),
    express = require('express'),
    expressState = require('express-state'),
    React = require('react/addons'),
    bodyParser = require('body-parser'),
    Fetcher = require('fetchr'),
    Application = require('./public/app'),

    readList = require('./public/actions/readList'),
    getNav = require('./public/actions/getNav'),
    Router = require('./public/util/router'),
    routes = require('./public/routes');

var app = express();
expressState.extend(app);

app.set('state namespace', 'App');

app.set('view engine', 'jade')
app.set('views', __dirname + '/../templates');

Fetcher.registerFetcher(require('./resource/list'));
Fetcher.registerFetcher(require('./resource/nav'));

app.use(bodyParser.json())
app.use(Application.config.xhrPath, Fetcher.middleware());

var router = new Router(routes);

app.get("/list", (req,res) => {
   var fetcher = new Fetcher({req});
   //config can be passed to the application instance to modify all requests
   var application = new Application({fetcher});
   var executeActionP = application.context.actionInterface.executeActionP;

   Promise.all([readList, getNav].map(executeActionP))

   .then(() => {
      var html = React.renderComponentToString(application.getComponent());

      res.expose(application.context.dehydrate(), 'Context');

      res.render('layout', { html }, (err, markup) => {
         if (err) res.send(err, 500)
         else res.send(markup);
      });
   }).catch((err) => {
      console.error(err);
      res.send(500);
   });
});

app.use(express.static(__dirname + "/../assets/"));

app.use((req, res, next) => {
   var fetcher = new Fetcher({req});
   var application = new Application({fetcher, router});

   application.runRoute(req.url, req.method.toLowerCase(), {noDiff: true})

   .then(() => {

      var html = React.renderComponentToString(application.getComponent());

      res.expose(application.context.dehydrate(), 'Context');

      res.render('layout', { html }, (err, markup) => {
         if (err) res.send(err, 500)
         else res.send(markup);

      });
   })
   .catch(err => {
      console.err(err);
      res.send(500);
   });
});

var port = process.env.PORT || 3000;
http.createServer(app).listen(port);
console.log('Listening on port ' + port);
