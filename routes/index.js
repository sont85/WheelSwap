var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/wheelSwap');

var userSchema = new mongoose.Schema({
  userName: String,
  email: {type : String},
  image: String,
  inventory: {
    model : String,
    year: Number,
    color: String,
    condition: String,
    imageUrl: String
  }
});


var User = mongoose.model("User", userSchema);

router.get('/', function (req, res, next) {
  if (req.user){
    var entry = new User({
      userName: req.user.displayName,
      email: req.user.emails[0].value,
      image: req.user.photos[0].value
    });
    User.findOneAndUpdate({email: req.user.emails }, entry ,{upsert: true, new: true}, function(err, savedEntry){
      if (err) {
        console.log(err);
        res.send("fuck u")
      }
      console.log("success savedENtry", savedEntry);
    });
  }
  res.render("index");
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

router.get('/editcar', function(req, res, next) {
  res.render('editcar', {title: 'Edit Car'});
});

router.get('/trade', function(req, res, next) {
  res.render('trade', {title: 'Trade Car'});
});

module.exports = router;
