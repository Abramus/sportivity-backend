'use strict';

//Tylko na heroku
 var env = require('dotenv');
 env.config({silent: true});

var app = require('./app'); //Require our app

app.set('port', process.env.PORT || 8000);
//app.set('port', 8000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});