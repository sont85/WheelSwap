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
    imageUrl: String
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
    User.findOneAndUpdate({email: req.user.emails[0].value }, entry ,{upsert: true, new: true}, function(err, savedEntry){
      if (err) {
        console.log(err);
      }
      console.log('success savedEntry', savedEntry);
      res.render("index")
      return
    });
  }
  res.render('index');
});

router.get('/myinventory', function (req, res, next) {
  res.render('myinventory', {title: 'My Inventory'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login Page'});
});

router.get('/addcar', function(req, res, next) {
  res.render('addcar', {title: 'Add Car'});
});

router.post('/addcar', function(req, res, next) {
  User.findOne({email: req.user.emails[0].value}, function(error, user){
    user.inventory.push(req.body);
    user.save();
    console.log("saved entry", user);
  });
  res.redirect('index');
});


router.get('/editcar', function(req, res, next) {
  res.render('editcar', {title: 'Edit Car'});
});

router.get('/trade', function(req, res, next) {
  res.render('trade', {title: 'Trade Car'});
});

module.exports = router;
