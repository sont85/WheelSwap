var mongoose = require('mongoose');

var carSchema = new mongoose.Schema({
    model : String,
    year: Number,
    color: String,
    condition: String,
    ownerName: String,
    ownerId: {type: mongoose.Schema.ObjectId, ref: 'User'},
    imageUrl: {type: String, default : 'http://cliparts.co/cliparts/Big/Kkz/BigKkzggT.png'},
    solicit: {},
    unsolicit: Array

});

var Car = mongoose.model('Car', carSchema);
module.exports = Car;
