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
app.set('superSecret', config.secret); // secret variable
// route middleware to verify a token
router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.status(403).send({ "error": true, "message" : "Token authentication failed.", "data": null });
      } else {
        // if everything is good, save to request for use in other routes
        //req.decoded = decoded;   
        next();
      }
    });
  } else {
    //if there is no token
    //return an error
    return res.status(403).send({ "error": true, "message" : "No token provided.", "data": null });
  }
});


router.route("/users")
//Poranie wszystkich userów
    .get(function(req,res){
        var response = {};
        user.find({}, userResponseModels.modelForAllUsers).exec(function(err,data){
            if(err) {
                response = {"error" : true, "message" : "Error fetching data" + err, "data": null};
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
    })
//Zapisanie nowego usera ze sprawdzeniem czy taki email już istnieje
    .post(function(req,res){
        var db = new user(req.body);
        var response = {};
        user.findOne({ email: req.body.email }).exec(function (err, data) {
			if(err) {
	            response = {"error" : true, "message" : "Error adding data", "data": null};
	            res.status(400).json(response);      
	    	} else {
	    		if(data) {
		            response = {"error" : true, "message" : "User already exists.", "data": null};
			        res.status(400).json(response);
			    } else {
			    	db.save(function(err){
			            if(err) {
			                response = {"error" : true, "message" : "Error adding data", "data": null};
			                res.status(400).json(response);
			            } else {
			                response = {"error" : false, "message" : "User added", "data": db};
			                res.status(201).json(response);
			            }
	        		});
			    }
	        }
        });
    });

//Wyszukiwanie userów po zdefiniowanych parametrach
router.route('/users/search').get(function(req, res) {
	var response = {};
	var searchValue = req.query.searchValue;
    user.find({ $or:[ {name : new RegExp(searchValue)}, {email : new RegExp(searchValue)}]}, userResponseModels.modelForAllUsers).exec(function(err, items) {
        if(err) {
        	response = {"error" : true, "message" : "Error fetching data", "data": null};
        	res.status(400).json(response);
    	} else {
        	response = {"error" : false, "message" : null, "data": items};
        	res.status(200).json(response);
    	}
    });
});

//Wyszukiwanie konkretnego użytkownika
router.route('/users/id').get(function(req, res) {
	var response = {};
	var userId 	= req.query.userId;
	user.findOne({ _id: userId },userResponseModels.modelForUserProfile)
	.populate('events')
	.populate('friends')
	.exec(function (err, data) {
		if(err) {
        	response = {"error" : true, "message" : "Error fetching data", "data": data};
        	res.status(400).json(response);
    	} else {
    		if(data) {
	            response = {"error" : false, "message" : null, "data": data};
	            res.status(200).json(response);
        	} else {
        		response = {"error" : false, "message" : "No data available.", "data": data};
	            res.status(200).json(response);
        	}
        }
	});
});

//Pobranie własnego profilu
router.route('/users/myProfile').get(function(req, res) {
	var response = {};
	var myUserId 	= req.query.myUserId;
	//TODO
	//Trzeba dorobić jakieś sprawdzenie, że ktoś pobiera swój własny profil.
	user.findOne({ _id: myUserId },userResponseModels.modelForProfileOwner)
	.populate('events')
	.populate('friends')
	.exec(function (err, data) {
		if(err) {
        	response = {"error" : true, "message" : "Error fetching data", "data": null};
        	res.status(400).json(response);
    	} else {
    		if(data) {
	            response = {"error" : false, "message" : null, "data": data};
	            res.status(200).json(response);
        	} else {
        		response = {"error" : false, "message" : "No data available.", "data": data};
	            res.status(200).json(response);
        	}
        }
	});
});

//Sprawdzenie czy followuje danego usera
router.route('/users/isFriend').get(function(req, res) {
	var response = {};
	var myUserId = req.query.myUserId;
	var userId = req.query.userId;
	var isFriend = false;
	user.findOne({ _id: myUserId })
	.exec(function (err, data) {
		if(err) {
        	response = {"error" : true, "message" : "Error fetching data", "data": null};
        	res.status(400).json(response);
    	} else {
    		if(data) {
    			//Check if I follow
    			if(data.friends.indexOf(userId) > -1)
    				isFriend = true;
    			response = {"error" : false, "message" :  null, "data" : {
    				"is Friend" : isFriend
    				}
    			};
            	res.status(200).json(response);
    		} else {
    			response = {"error" : false, "message" :  "No data available.", "data" : null};
	            res.status(200).json(response);
    		}
        }
	});
});

//Dodanie usera do friends
router.route('/users/addFriend').put(function(req, res) {
	var response = {};
	var myUserId = req.query.myUserId;
	var userId = req.query.userId;
	user.findOne({ _id: myUserId })
	.exec(function (err, data) {
		if(err) {
        	response = {"error" : true, "message" : "Error fetching data.", "data": null};
        	res.status(400).json(response);
    	} else {
    		if(data) {
    			//Check if already following
    			if(data.friends.indexOf(userId) > -1) {
    				response = {"error" : true, "message" : "Friend already added.", "data": null};
			        res.status(400).json(response);
	    		} else {
	    			//Add new friend
	    			data.friends.push(userId);
	    			data.save(function(err) {
					    if (err) {
					        return res.send(err);
					    }
		    			response = {"error" : false, "message": "Friend added", "data": data};
		            	res.status(200).json(response);
	            	});
	            	//Wysłanie push'a do tego znajomego
	            	//TODO
	    		}
    		} else {
    			response = {"error" : false, "message": "No such user", "data": null};
	            res.status(200).json(response);
    		}
        }
	});
});

//Usunięcie usera z friends
router.route('/users/removeFriend').delete(function(req, res) {
	var response = {};
	var myUserId = req.query.myUserId;
	var userId = req.query.userId;
	user.update( { _id: myUserId }, { $pull: {friends : userId } }).exec(function (err, data) {
		if(err) {
	    	response = {"error" : true,"message" : "Error fetching data", "data": null};
	    	res.status(400).json(response);
		} else {
			if(data.nModified == 0) {
				response = {"error" : false, "message" : "Friend not found", "data": data};
        		res.status(200).json(response);
	        } else {
	        	response = {"error" : false,"message" : "Friend removed successfully", "data": null};
        		res.status(200).json(response);
	        }
	    }
	});
});

//Uaktualnienie własnych danych
router.route('/users/updateProfile').put(function(req, res) {
	var response = {};
	var myUserId = req.query.myUserId;
	//TODO
	//Trzeba dorobić jakieś sprawdzenie, że ktoś pobiera swój własny profil.
	user.findOne({ _id: myUserId })
	.exec(function (err, data) {
		if(err) {
        	response = {"error" : true,"message" : "Error fetching data", "data": null};
        	res.status(400).json(response);
    	} else {
    		if(data) {
    			//Odczytanie wszystkich propertiesów, które chcemy zaktualizować
    			for (prop in req.body) {
			      data[prop] = req.body[prop];
			    }
			    data.save(function(err) {
				    if (err) {
				    	return res.send(err);
				    }
    				response = {"error" : false, "message": "User updated!", "data": data};
            		res.status(200).json(response);
	            });
    		} else {
    			response = {"error" : false, "message": "No such user", "data": null};
	            res.status(200).json(response);
    		}
        }
	});
});

//Zapytania do dodawania i uzupełniania bazy danych przez nas - adminów
router.route("/users/:id").get(function(req,res){
    var response = {};
    user.find({_id: req.params.id}, userResponseModels.modelForAdmins).exec(function(err,data){
        if(err) {
            response = {"error" : true, "message" : "Error fetching data",  "data": data};
            res.status(400).json(response);
        } else {
        	if(data) {
            	response = {"error" : false, "message" : null, "data": data};
            	res.status(200).json(response);
            } else {
            	response = {"error" : false, "message" : "No data available.",  "data": null};
            	res.status(200).json(response);
            }
        }

    });
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
	      res.json({ "error" : false, "message" : 'User updated!', "data": user });
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
    res.json({ "error" : false, "message" : 'Successfully deleted', "data": user });
  });
});

module.exports = router;