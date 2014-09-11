var pg = require('pg');

var conString = "postgres://trevorsmith@localhost/realm";

var client= new pg.Client(conString);

client.connect(function(err){
   if (err){
      return console.error('could not connect to database', err);
   }
   client.end();
});
