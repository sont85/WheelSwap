var mongoose = require('mongoose');

var carSchema = new mongoose.Schema({
    model : String,
    year: Number,
    color: String,
    condition: String,
    ownerName: String,
    ownerId: {type: mongoose.Schema.ObjectId, ref: 'User'},
    value: {type: String, default: 'Not Available'},
    imageUrl: {type: String, default : '../images/car.png'}
});

module.exports = mongoose.model('Car', carSchema);
