var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/cartrade');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'WheelSwap' });
});

router.get('/listings/marketplace', function (req, res, next) {
  res.render('inventory', {title: 'WheelSwap'});
});

router.get('/myinventory', function (req, res, next) {
  res.render('myinventory', {title: 'My Inventory'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login Page'});
});

router.get('/listings/addcar', function(req, res, next) {
  res.rend('addcar', {title: 'Add Car'});
});

router.get('/listings/editcar', function(req, res, next) {
  res.rend('editcar', {title: 'Edit Car'});
});

router.get('/listings/trade', function(req, res, next) {
  res.rend('trade', {title: 'Trade Car'});
});

module.exports = router;
