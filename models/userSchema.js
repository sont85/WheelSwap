var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  displayName: String,
  email: {type : String},
  image: String,
  inventory: [{type: mongoose.Schema.ObjectId, ref: 'Car'}]
});

module.exports  = mongoose.model('User', userSchema);
