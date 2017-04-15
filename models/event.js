var mongoose  	=   require("mongoose");
var Schema 		=   mongoose.Schema;
var ObjectId 	= 	Schema.ObjectId;


var EventSchema  = new Schema({
    name : {
        type: String,
        default: ""
    },
    sportCategory: {
        type: String,
        default: ""
    },
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
    dateStart: { 
        type: Date,
        default: Date.now
    },
    dateEnd: { 
        type: Date,
        default: Date.now
    },
    pricing : {
        type: Number,
        default: 0
    },
    details: {
        type: String,
        default: ""
    },
    capacity : {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('event',EventSchema);