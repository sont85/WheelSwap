var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  userName: String,
  email: {type : String},
  image: String,
  inventory: [{
    model : String,
    year: Number,
    color: String,
    condition: String,
    email: String,
    userName: String,
    imageUrl: {type: String, default : 'http://cliparts.co/cliparts/Big/Kkz/BigKkzggT.png'}
  }],
  trade: [{}]
});

var User = mongoose.model('User', userSchema);
module.exports = User;
