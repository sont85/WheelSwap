var mongoose = require('mongoose');

var historySchema = new mongoose.Schema({
  traderA: { type: mongoose.Schema.ObjectId, ref: 'User' },
  traderB: { type: mongoose.Schema.ObjectId, ref: 'User' },
  carA: {type: mongoose.Schema.ObjectId, ref: 'Car' },
  carB: {type: mongoose.Schema.ObjectId, ref: 'Car' },
  status: String,
  date: String
});

module.exports = mongoose.model('History', historySchema);
