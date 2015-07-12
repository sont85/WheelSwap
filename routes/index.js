var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/wheelSwap');

var userSchema = new mongoose.Schema({
  userName: String,
  email: {type : String},
  image: String,
  inventory: [{
    model : String,
    year: Number,
    color: String,
    condition: String,
    imageUrl: {type: String, default : 'http://cliparts.co/cliparts/Big/Kkz/BigKkzggT.png'}
  }]
});


var User = mongoose.model('User', userSchema);

router.get('/', function (req, res, next) {
  if (req.user){
    var entry = new User({
      userName: req.user.displayName,
      email: req.user.emails[0].value,
      image: req.user.photos[0].value,
    });
    User.findOneAndUpdate({email: req.user.emails[0].value }, entry ,{upsert: true}, function(err, savedEntry){
      if (err) {
        console.log(err);
      }
      console.log('success savedEntry', savedEntry);
    });
  }
  res.render('index');
});

router.get('/getInventory', function (req, res) {

});

router.get('/getCurrentUser', function (req, res){
  User.findOne({email: req.user.emails[0].value}, function(error, currentUser){
    if (error) {
      console.log(error);
    }
    console.log(currentUser)
    res.json(currentUser);
  });
});

router.get('/getInventory', function(req, res){

});
router.post('/addcar', function(req, res, next) {
  User.findOne({email: req.user.emails[0].value}, function(error, user){
    if (error) {
      console.log(error);
    }
    user.inventory.push(req.body);
    user.save();
    console.log('saved entry', user);
    res.json(user);
  });
});

module.exports = router;
