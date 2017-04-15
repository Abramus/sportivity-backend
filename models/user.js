var mongoose    =   require("mongoose");
var Schema 		= 	mongoose.Schema;
var ObjectId 	= 	Schema.ObjectId;

var userSchema  = 	new Schema({
    email : String,
    name : String,
    password : String,
    age : { 
        type: Number,
        default: 0
    },
    birthDate : { 
        type: Date,
        default: Date.now
    },
    city : {
        type: String,
        default: ""
    },
    sportsCategories : [{
        type: String,
        default: ""
    }],
    admin: {
        type: Boolean,
        default: false
    },
    photoURL: {
        type: String,
        default: ""
    },
    participatedEvents: {
        type: Number,
        default: 0
    },
    events: [{
        type: ObjectId,
        ref: 'event',
        default: null
    }],
    friends : [{
    	type: ObjectId,
    	ref: 'user',
        default: null
    }]
});


module.exports 	= 	mongoose.model('user',userSchema);