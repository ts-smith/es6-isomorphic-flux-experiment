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
app.set('views', __dirname + '../templates');

Fetcher.registerFetcher(require('./resource/list'));
app.use(Application.config.xhrPath, Fetcher.middleware());

app.get("/list", function(req,res) {
   var fetcher = new Fetcher({req});
   var application = new Application({fetcher});

   application.context.actionInterface.executeAction(readList, {}, (err) => {
      if (err) {
         res.error(err);
         return;
      }
      var html = React.renderComponentToString(application.getComponent());

      res.expose(application.context.dehydrate(), 'Context');

      res.render('layout', { html }, (err, markup) => {
         res.send(markup);
      });
   });
});


var port = process.env.PORT || 3000;
http.createServer(app).listen(port);
console.log('Listening on port ' + port);
