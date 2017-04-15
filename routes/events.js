var event 	= 	require('../models/event');
var place 	= 	require('../models/place');
var user 	= 	require('../models/user');
var express = 	require('express');
var router 	= 	express.Router();
var app 	= 	express();
var config	= 	require('../config'); // get our config file
var jwt    	= 	require('jsonwebtoken'); // used to create, sign, and verify tokens

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

router.route("/events")
    .get(function(req,res){
       var response = {};
        //Zczytanie wszystkich kategorii do arraya 
        var categoriesArray = req.query.category;
        if(categoriesArray == null) {
        	event.find({})
            .sort({dateStart: -1}).exec(function(err,data){
                if(err) {
                    response = {"error" : true,"message" : "Error fetching data"};
                    res.status(400).json(response);
                } else {
                    response = {"error" : false,"message" : data};
                    res.status(200).json(response);
                }
            });
        } else {
        	event.find({sportCategory: { $in: categoriesArray } })
            .sort({dateStart: -1}).exec(function(err,data){
            if(err) {
                    response = {"error" : true,"message" : "Error fetching data"};
                    res.status(400).json(response);
                } else {
                    response = {"error" : false,"message" : data};
                    res.status(200).json(response);
                }
            });
        }
    })
    .post(function(req, res) {
        var db = new event(req.body);
        var response = {};
        db.save(function(err){
            if(err) {
                response = {"error" : true,"message" : "Error adding data"};
                res.status(400).json(response);
            } else {
                response = {"error" : false,"message" : "Data added", "Data inserted": db};
                //TODO
                //Wysłanie push'a do znajomych ownera, ze stworzył event
                res.status(200).json(response);
            }
        });
  });

//Pobranie jednego eventu z propagacją
router.route('/events/id').get(function(req, res) {
    var response = {};
    event.findOne({ _id: req.query.eventId })
    .populate('attendees')
    .populate('host')
    .populate('place')
    .exec(function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
            res.status(400).json(response);
        } else {
            response = {"error" : false,"message" : data};
            res.status(200).json(response);
        }
    })
});

//Zapisanie się na event
router.route('/events/signUp').put(function(req, res) {
    var response = {};
    var myUserId = req.query.myUserId;
    var eventId = req.query.eventId;

    event.findOne({ _id: eventId })
    .exec(function (err, data) {
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
            res.status(400).json(response);
        } else {
            if(data) {
                //Check if already signed in
                if(data.attendees.indexOf(myUserId) > -1) {
                    response = {"error" : true,"message" : "User already signed un."};
                    res.status(400).json(response);
                } else {
                    //Add new friend
                    data.attendees.push(myUserId);
                    data.save(function(err) {
                        if (err) {
                            console.log(err);
                            return res.send(err);
                        }
                        response = {"error" : false, "message": "Successfully signed up"};
                        res.status(200).json(response);
                    });
                    //Wysłanie push'a organizatora, że ktoś się zapisał ??
                    //TODO
                }
            } else {
                response = {"error" : false, "message": "No such event"};
                res.status(400).json(response);
            }
        }
    });
});

//Wypisanie się z eventu
router.route('/events/signOut').delete(function(req, res) {
    var response = {};
    var myUserId = req.query.myUserId;
    var eventId = req.query.eventId;
    event.update( { _id: eventId }, { $pull: {attendees : myUserId } }).exec(function (err, data) {
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
            res.status(400).json(response);
        } else {
            if(data.nModified == 0) {
                response = {"error" : false,"message" : "User not found"};
                res.status(400).json(response);
            } else {
                response = {"error" : false,"message" : "User signed out successfully"};
                res.status(200).json(response);
            }
        }
    });
});

router.route('/events/:id').get(function(req, res) {
	var response = {};
	event.findOne({ _id: req.params.id })
	.populate('attendees')
    .populate('host')
    .populate('place')
	.exec(function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
            res.status(400).json(response);
        } else {
            response = {"error" : false,"message" : data};
            res.status(200).json(response);
        }
    })
});
router.route('/events/:id').put(function(req,res){
	event.findOne({ _id: req.params.id }, function(err, event) {
	    if (err) {
	      return res.send(err);
	    }
	    for (prop in req.body) {
	      event[prop] = req.body[prop];
	    }
	    event.save(function(err) {
	      if (err) {
	        return res.send(err);
	      }
	      res.json({ message: 'event updated!' });
	    });
  	});
});
router.route('/events/:id').delete(function(req, res) {
	  event.remove({
	    _id: req.params.id
	  }, function(err, user) {
	    if (err) {
	      return res.send(err);
	    }
	    res.json({ message: 'Successfully deleted' });
	  });
});

module.exports = router;