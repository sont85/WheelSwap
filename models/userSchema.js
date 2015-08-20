var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  userName: String,
  email: {type : String},
  image: String,
  inventory: [{type: mongoose.Schema.ObjectId, ref: 'Car'}]
});

var User = mongoose.model('User', userSchema);
module.exports = User;
