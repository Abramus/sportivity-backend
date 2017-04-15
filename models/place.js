var mongoose    =   require("mongoose");
var Schema 		=   mongoose.Schema;
var ObjectId 	= 	Schema.ObjectId;

var LocationSchema = new Schema({  
    type: String,
    coordinates: [Number]
});

var placeSchema  = new Schema({
    name : {
        type: String,
        default: ""
    },
    street : {
        type: String,
        default: ""
    },
    city : {
        type: String,
        default: ""
    },
    about : {
        type: String,
        default: ""
    },
    phoneNumb : {
        type: String,
        default: ""
    },
    loc : LocationSchema,
    sportCategories: [{
        type: String,
        default: ""
    },],
    photosURL: [{
        type: String,
        default: ""
    },],
    events : [{
        type: ObjectId,
        ref: 'event'
    }]
});

module.exports = mongoose.model('place',placeSchema);