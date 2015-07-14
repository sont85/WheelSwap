var mongoose = require('mongoose');

var tradeSchema = new mongoose.Schema({
    model : String,
    year: Number,
    color: String,
    condition: String,
    imageUrl: {type: String, default : 'http://cliparts.co/cliparts/Big/Kkz/BigKkzggT.png'}
});

var Trade = mongoose.model('trade', tradeSchema);
module.exports = Trade;
