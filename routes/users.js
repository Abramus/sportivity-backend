var config 				= 	require('../config'); // get our config file
var user 				= 	require('../models/user');
var userResponseModels 	=	require('../responseModels/userResponseModels');
var event 				=	require('../models/event');

var express 			= 	require('express');
var jwt    				= 	require('jsonwebtoken'); // used to create, sign, and verify tokens
var router 				= 	express.Router();
var app    				= 	express();


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


router.route("/users")
//Poranie wszystkich userów
    .get(function(req,res){
        var response = {};
        user.find({}, userResponseModels.modelForAllUsers).exec(function(err,data){
            if(err) {
                response = {error : true, message : "Error fetching data"};
                res.status(400).json(response);
            } else {
                response = {error : false, message : data};
                res.status(200).json(response);
            }
        });
    })
//Zapisanie nowego usera ze sprawdzeniem czy taki email już istnieje
    .post(function(req,res){
        var db = new user(req.body);
        var response = {};
        user.findOne({ email: req.body.email }).exec(function (err, data) {
			if(err) {
	            response = {error : true, message : "Error adding data"};
	            res.status(400).json(response);      
	    	} else {
	    		if(data) {
		            response = {"error" : true,"message" : "User already exists."};
			        res.status(400).json(response);
			    } else {
			    	db.save(function(err){
			            if(err) {
			                response = {error : true, message : "Error adding data"};
			                res.status(400).json(response);
			            } else {
			                response = {error : false, message : "User added", "Data inserted": db};
			                res.status(200).json(response);
			            }
	        		});
			    }
	        }
        })
    });

router.route('/users/:id').get(function(req, res) {
	var response = {};
	user.findOne({ _id: req.params.id })
	.populate('friends')
	.populate('events')
	.populate('evetnts.place')
	.exec(function (err, data) {
		if(err) {
        	response = {"error" : true,"message" : "Error fetching data"};
    	} else {
            response = {"error" : false,"message" : data};
        }
        res.json(response);
	})
});
router.route('/users/:id').put(function(req,res){
	  user.findOne({ _id: req.params.id }, function(err, user) {
	    if (err) {
	      return res.send(err);
	    }

	    for (prop in req.body) {
	      user[prop] = req.body[prop];
	    }
		    // save the user
		    user.save(function(err) {
		      if (err) {
		        return res.send(err);
		      }

		      res.json({ message: 'User updated!' });
		    });
	  	});
	});
router.route('/users/:id').delete(function(req, res) {
	  user.remove({
	    _id: req.params.id
	  }, function(err, user) {
	    if (err) {
	      return res.send(err);
	    }
	    res.json({ message: 'Successfully deleted' });
	  });
	});
module.exports = router;