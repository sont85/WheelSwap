var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/cartrade');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'WheelSwap' });
});

router.get('/user', function (req, res, next) {
  console.log(req.user);

  res.render("user", {user: { name: req.user.displayName,
                                image: req.user._json.image.url }});

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
