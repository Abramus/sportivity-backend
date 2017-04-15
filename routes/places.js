var place = require('../models/place');
var express = require('express');
var router = express.Router();
var app    = express();
var config = require('../config'); // get our config file
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

///////////////
//CHECK TOKEN//
///////////////

// app.set('superSecret', config.secret); // secret variable
// // route middleware to verify a token
// router.use(function(req, res, next) {

//   // check header or url parameters or post parameters for token
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];

//   // decode token
//   if (token) {

//     // verifies secret and checks exp
//     jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
//       if (err) {
//         return res.json({ success: false, message: 'Failed to authenticate token.' });    
//       } else {
//         // if everything is good, save to request for use in other routes
//         req.decoded = decoded;    
//         next();
//       }
//     });
//   } else {

//     // if there is no token
//     // return an error
//     // return res.status(403).send({ 
//     //     success: false, 
//     //     message: 'No token provided.' 
//     // });
    
//   }
// });

router.route("/places")
    .get(function(req,res,next){
        var response = {};
        //Zczytanie wszystkich parametrów 
        var query = require('url').parse(req.url,true).query;
        //console.log('The category is %s', query.category);
        var categories = query.category + ',';
        var categoriesArray = categories. split(',');

        //IF THERE IS NO CATEGORY GIVEN
        if(query.category == null) {
        	place.find({},function(err,data){
	        	// Mongo command to fetch all data from collection.
	            if(err) {
	                response = {"error" : true,"message" : "Error fetching data"};
	            } else {
	                response = {"error" : false,"message" : data};
	            }
	            res.json(response);
        	});
        } else {

        	place.find({categories: {$in: categoriesArray}}).exec(function(err,data){
	        	// Mongo command to fetch all data from collection.
	            if(err) {
	                response = {"error" : true,"message" : "Error fetching data"};
	            } else {
	                response = {"error" : false,"message" : data};
	            }
	            res.json(response);
        	});
        }
        
    })
    .post(function(req, res) {
    var db = new place(req.body);
    var response = {};

    db.save(function(err){
        // save() will run insert() command of MongoDB.
        // it will add new data in collection.
            if(err) {
                response = {"error" : true,"message" : "Error adding data"};
            } else {
                response = {"error" : false,"message" : "Data added", "Data inserted": db};
            }

            res.json(response);
        });
  });
router.route('/places/:id').get(function(req, res) {
	  place.findOne({ _id: req.params.id}, function(err, place) {
	    if (err) {
	      return res.send(err);
	    }

	    res.json(place);
	  });
	});
router.route('/places/:id').put(function(req,res){
	  place.findOne({ _id: req.params.id }, function(err, place) {
	    if (err) {
	      return res.send(err);
	    }

	    for (prop in req.body) {
	      place[prop] = req.body[prop];
	    }
		    // save the movie
		    place.save(function(err) {
		      if (err) {
		        return res.send(err);
		      }

		      res.json({ message: 'Place updated!' });
		    });
	  	});
	});
router.route('/places/:id').delete(function(req, res) {
	  place.remove({
	    _id: req.params.id
	  }, function(err, user) {
	    if (err) {
	      return res.send(err);
	    }

	    res.json({ message: 'Successfully deleted' });
	  });
	});

module.exports = router;