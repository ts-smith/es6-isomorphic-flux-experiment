require('traceur');

var http = require('http'),
    express = require('express'),
    expressState = require('express-state'),
    React = require('react/addons'),
    Fetcher = require('fetchr'),
    Application = require('./public/app'),
    readList = require('./public/actions/readList');

var app = express();
expressState.extend(app);

app.set('state namespace', 'App');

app.set('view engine', 'jade')
app.set('views', __dirname + '/../templates');

Fetcher.registerFetcher(require('./resource/list'));
app.use(Application.config.xhrPath, Fetcher.middleware());

app.get("/list", (req,res) => {
   var fetcher = new Fetcher({req});
   var application = new Application({fetcher});

   application.context.actionInterface.executeAction(readList, {}, (err) => {
      if (err) {
         res.send(err, 500);
         return;
      }
      var html = React.renderComponentToString(application.getComponent());

      res.expose(application.context.dehydrate(), 'Context');

      res.render('layout', { html }, (err, markup) => {
         if (err) res.send(err, 500)
         else res.send(markup);
      });
   });
});

app.use(express.static(__dirname + "/../assets/"));


var port = process.env.PORT || 3000;
http.createServer(app).listen(port);
console.log('Listening on port ' + port);
