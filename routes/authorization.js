var express   = require('express');
var jwt       = require('jsonwebtoken'); // used to create, sign, and verify tokens
var app       = express();
var router    = express.Router();
var user      = require('../models/user');
var config    = require('../config'); // get our config file


// ////////////////////
// //AUTHORIZATION AND TOKEN GENERATING
// ////////////////////

app.set('superSecret', config.secret); // secret variable
// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.route("/authenticate")
	.post(function(req, res) {
  user.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.status(404).json({ "error": true, "message": 'Authentication failed. User not found.', "data" : null});
    } else if (user) {
      // check if password matches
      if (user.password != req.body.password) {
        res.status(403).json({ "error": true, "message": 'Authentication failed. Wrong password.',  "data" : null });
      } else {
        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresIn: 31104000 // expires in 24 hours
        });
        // return the information including token as JSON
        res.status(200).json({
          "error": false,
          "message": null,
          "data" : {
            "token": token
          }
        });
      }   
    }
  });
});

module.exports = router;