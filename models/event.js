var mongoose  	=   require("mongoose");
var Schema 		=   mongoose.Schema;
var ObjectId 	= 	Schema.ObjectId;


var EventSchema  = new Schema({
    name : String,
    sportCategory: String,
    attendees: [{
        type: ObjectId,
        ref: 'user'
    }],
    host : { 
        type: ObjectId,
        ref: 'user'
    },
    place: { 
        type: ObjectId,
        ref: 'place'
    },
    dateStart: Date,
    dateEnd: Date,
    pricing : Number,
    details: String,
    capacity : Number
});

module.exports = mongoose.model('event',EventSchema);