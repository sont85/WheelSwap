var mongoose = require('mongoose');

var carSchema = new mongoose.Schema({
    model : { type: String, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    condition: {type: String, required: true },
    ownerName: {type: String, required: true },
    ownerId: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    value: {type: String, default: 'Not Available'},
    imageUrl: {type: String, default : '../images/car.png'}
});

module.exports = mongoose.model('Car', carSchema);
