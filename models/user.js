var mongoose    =   require("mongoose");
var Schema 		= 	mongoose.Schema;
var ObjectId 	= 	Schema.ObjectId;

var userSchema  = 	new Schema({
    email : String,
    name : String,
    password : String,
    age : Number,
    birthDate : Date,
    city : String,
    sportsCategories : [String],
    admin: Boolean,
    photoURL: String,
    participatedEvents: Number,
    events: [{
        type: ObjectId,
        ref: 'event'
    }],
    friends : [{
    	type: ObjectId,
    	ref: 'user'
    }]
});



module.exports 	= 	mongoose.model('user',userSchema);