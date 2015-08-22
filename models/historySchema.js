var mongoose = require('mongoose');

var historySchema = new mongoose.Schema({
  traderA: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  traderB: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  carA: { type: mongoose.Schema.ObjectId, ref: 'Car', required: true },
  carB: { type: mongoose.Schema.ObjectId, ref: 'Car', required: true },
  status: { type: String, required: true },
  date: { type: String, default: new Date().toLocaleDateString() }
});

module.exports = mongoose.model('History', historySchema);
