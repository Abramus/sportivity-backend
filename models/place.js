var mongoose    =   require("mongoose");
var Schema 		=   mongoose.Schema;
var ObjectId 	= 	Schema.ObjectId;

var LocationSchema = new Schema({  
    type: String,
    coordinates: [Number]
});

var placeSchema  = new Schema({
    name : String,
    street : String,
    city : String,
    about : String,
    phoneNumb : String,
    loc : LocationSchema,
    sportCategories: [String],
    photosURL: [String],
    events : [{
        type: ObjectId,
        ref: 'event'
    }]
});

module.exports = mongoose.model('place',placeSchema);