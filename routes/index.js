var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/cartrade');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'WheelSwap' });
});

router.get('/marketplace', function (req, res, next) {
  res.render('inventory', {title: 'WheelSwap'});
});

router.get('/myinventory', function (req, res, next) {
  res.render('myinventory', {title: 'My Inventory'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login Page'});
});

router.get('/addcar', function(req, res, next) {
  res.rend('addcar', {title: 'Add Car'});
});

router.get('/editcar', function(req, res, next) {
  res.rend('editcar', {title: 'Edit Car'});
});

router.get('/trade', function(req, res, next) {
  res.rend('trade', {title: 'Trade Car'});
});

module.exports = router;
