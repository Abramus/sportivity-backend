var place 		= require('../models/place');
var event 		= require('../models/event');
var express 	= require('express');
//var config 		= require('../config'); // get our config file
var jwt    		= require('jsonwebtoken'); // used to create, sign, and verify tokens
var router 		= express.Router();
var app    		= express();

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
//Pobranie wszystkich places na podstawie ewentualnych kategori
    .get(function(req,res){
        var response = {};
        //Zczytanie wszystkich kategorii do arraya 
        var categoriesArray = req.query.category;
        var longitude = req.query.longitude;
        var latitude = req.query.latitude;

        if(categoriesArray == null) {
        	 if(longitude == null || latitude == null) {
	        	place.find({}).exec(function(err,data){
		            if(err) {
		                response = {"error" : true, "message" : "Error fetching data.", "data": null};
		                res.status(400).json(response);
		            } else {
		                if(data) {
		                	response = {"error" : false, "message": null, "data": data};
		                	res.status(200).json(response);
		                } else {
		                	response = {"error" : false, "message": "No data available. Categories = null, long/lat = null.", "data": null};
		                	res.status(200).json(response);
		                }
		            }
	        	});
    		} else {
	        	place.find({loc: { $near :
		          {
		            $geometry: { type: "Point",  coordinates: [ longitude, latitude ] },
		            $minDistance: 1,
		            $maxDistance: 50000
		          }
	       		}},function(err,data){
		            if(err) {
		                response = {"error" : true, "message" : "Error fetching data.", "data": null};
		                res.status(400).json(response);
		            } else {
		                if(data) {
		                	response = {"error" : false, "message" : null, "data": data};
		                	res.status(200).json(response);
		                } else {
		                	response = {"error" : false, "message" : "No data available. Categories = null.", "data": data};
		                	res.status(200).json(response);
		                }
		            }
	        	});
	        }
        } else {
        	if(longitude == null || latitude == null) {
	        	place.find({sportCategories: {$in: categoriesArray}}).exec(function(err,data){
		            if(err) {
		                response = {"error": true,"message" : "Error fetching data", "data": null};
		                res.status(400).json(response);
		            } else {
		                if(data) {
		                	response = {"error": false, "message" : null, "data" : data};
		                	res.status(200).json(response);
		                } else {
		                	response = {"error": false, "message" : "No data available. Long/lat = null.", "data" : null};
		                	res.status(200).json(response);
		                }
		            }
	        	});
	        } else {
	        	place.find({sportCategories: {$in: categoriesArray}, loc: { $near :
		          {
		            $geometry: { type: "Point",  coordinates: [ longitude, latitude ] },
		            $maxDistance: 50000
		          }}}).exec(function(err,data){
		            if(err) {
		            	console.log(err);
		                response = {"error": true, "message": "Error fetching data", "data": null};
		                res.status(400).json(response);
		            } else {
		                if(data) {
		                	response = {"error" : false, "message": null, "data": data};
		                	res.status(200).json(response);
		                } else {
		                	response = {"error" : false, "message": "No data available.", "data": null};
		                	res.status(200).json(response);
		                }
		            }
	        	});
	        }
        }
    })
//Dodanie miejsca
	.post(function(req, res) {
		var db = new place(req.body);
		var response = {};
		place.findOne({ street: req.body.street }).exec(function (err, data) {
			if(err) {
	            response = {error : true, message : "Error adding data", "data": null};
	            res.status(400).json(response);      
	    	} else {
	    		if(data) {
		            response = {"error" : true, "message" : "Place already exists.", "data": null};
			        res.status(400).json(response);
			    } else {
					db.save(function(err) {
				        if(err) {
				            response = {"error" : true, "message" : "Error adding data", "data": null};
				             res.status(400).json(response);
				        } else {
				            response = {"error" : false, "message" : "Data added", "data": db};
				            res.status(200).json(response);
				        }
				    });
				}
			}
		});
	})
//Wyszukiwanie konkretnego miejsca
router.route('/places/id').get(function(req, res) {
	var response = {};
	var placeId  = req.query.placeId;
	place.findOne({ _id: placeId })
	.populate('events')
	.exec(function (err, data) {
		if(err) {
        	response = {"error" : true,"message" : "Error fetching data", "data": null};
        	res.status(400).json(response);
    	} else {
    		if(data) {
	            response = {"error" : false, "message" : null, "data": data};
	            res.status(200).json(response);
        	} else {
        		response = {"error" : false, "message" : "", "data": null};
	            res.status(200).json(response);
        	}
        }
	});
});
//Zapytania do dodawania i uzupełniania bazy danych przez nas - adminów
router.route('/places/:id').get(function(req, res) {
	place.find({}).exec(function(err,data){
        if(err) {
            response = {"error" : true, "message" : "Error fetching data", "data": null};
            res.status(400).json(response);
        } else {
        	if(data) {
            	response = {"error" : false, "message" : null, "data": data};
            	res.status(200).json(response);
            } else {
            	response = {"error" : false, "message" : "No data available.", "data": null};
            	res.status(200).json(response);
            }
        }
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
		      res.json({"error" : false, "message" : 'Place updated!', "data": place });
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
	    res.json({ "error" : false, "message" : 'Successfully deleted', "data": place });
	  });
});

module.exports = router;