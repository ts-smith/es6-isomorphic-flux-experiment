require('traceur');

var http = require('http'),
    express = require('express'),
    expressState = require('express-state'),
    React = require('react/addons'),
    Fetcher = require('fetchr'),
    Application = require('./public/app'),
    Promise = require('es6-promise').Promise,

    readList = require('./public/actions/readList'),
    getNav = require('./public/actions/getNav');

var app = express();
expressState.extend(app);

app.set('state namespace', 'App');

app.set('view engine', 'jade')
app.set('views', __dirname + '/../templates');

Fetcher.registerFetcher(require('./resource/list'));
Fetcher.registerFetcher(require('./resource/nav'));

app.use(Application.config.xhrPath, Fetcher.middleware());

app.get("/list", (req,res) => {
   var fetcher = new Fetcher({req});
   //config can be passed to the application instance to modify all requests
   var application = new Application({fetcher});
   var actionInterface = application.context.actionInterface;

   Promise.all([ 
      new Promise((resolve,reject) => {
         actionInterface.executeAction(readList, {}, (err) => {
            if (err) reject(err);
            else resolve();
         });
      }),
      new Promise((resolve,reject) => {
         actionInterface.executeAction(getNav, {}, (err) => {
            if (err) reject(err)
            else resolve(); 
         });
      })
   ]).then(() => {
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


var port = process.env.PORT || 3000;
http.createServer(app).listen(port);
console.log('Listening on port ' + port);
