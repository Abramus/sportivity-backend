var express 		= require('express');
var bodyParser 		= require('body-parser');
var mongoose 		= require('mongoose');
var jwt    			= require('jsonwebtoken'); // used to create, sign, and verify tokens
var morgan   		= require('morgan');

var config 			= require('./config'); // get our config file
var users 			= require('./routes/users'); 
var places 			= require('./routes/places');
var events 			= require('./routes/events');
var authorization 	= require('./routes/authorization');

var app = express(); //Create the Express app

//Database connection
var dbName = 'SportivityDatabase';
//
//var connectionString = 'mongodb://localhost:27017/' + dbName;
var connectionString = 'mongodb://Patryk:Patryk@ds045465.mlab.com:45465/heroku_pv66mctg';

//Tylko na heorku
require('dotenv').config({path: './'});
require('dotenv').load();
mongoose.connect(process.env.DB_HOST);

//Database when deploy locally
// mongoose.Promise = global.Promise;
// mongoose.connect(connectionString);


app.set('superSecret', config.secret); // secret variable
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/api', authorization);
app.use('/api', events);
app.use('/api', users); //This is our route middleware
app.use('/api', places); 


// use morgan to log requests to the console
app.use(morgan('dev'));


module.exports = app;