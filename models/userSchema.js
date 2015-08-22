var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  displayName: {type: String, required: true},
  email: {type : String, required: true},
  image: String,
  inventory: [{type: mongoose.Schema.ObjectId, ref: 'Car'}]
});

module.exports  = mongoose.model('User', userSchema);
