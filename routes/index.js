'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var logout = require('express-passport-logout');
var User = require('../models/userSchema');
var Car = require('../models/carSchema');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/wheelSwap');
router.get('/', function (req, res, next) {
  res.render('index', {user: req.user});
});

router.get('/marketplace', function(req, res){
  Car.find(function(err, cars){
    res.json(cars);
  });
});

router.get('/user/inventory', function(req, res){
  User.findById(req.user._id).populate('inventory').exec(function(err, user){
    res.json(user);
  });
});

router.post('/user/car', function(req, res){
  User.findById(req.user._id, function(err, user){
    Car.create({
      model : req.body.model,
      year: req.body.year,
      color: req.body.color,
      condition: req.body.condition,
      ownerName: req.user.displayName,
      owner: req.user._id,
      imageUrl: req.body.imageUrl
    }, function(err, car){
      user.inventory.push(car._id);
      user.save();
    });
  });
});

router.delete('/user/car/:carId',function(req, res) {
  console.log(req.params.carId);
  Car.findByIdAndRemove(req.params.carId, function(err, car){
    console.log(car);
  });
  User.findById(req.user._id, function(err, user) {
    user.inventory.pull(req.params.carId);
    user.save();
  });
});

router.post('/user/car/:carId', function(req, res) {
  Car.findByIdAndUpdate(req.params.carId, { $set: {
    model : req.body.model,
    year: req.body.year,
    color: req.body.color,
    condition: req.body.condition,
    imageUrl: req.body.imageUrl
  }}, function(err, car) {
      console.log(car);
  });
});

router.get('/marketplace/trade/:carId', function(req, res){
  if (req.user) {
    Car.findById(req.params.carId, function(err, car) {
      User.findById(req.user._id).populate('inventory').exec(function(err, user){
        var tradeInfo = {
          myCars: user.inventory,
          carSolicited: car
        };
        res.json(tradeInfo);
      });
    });
  }
});


module.exports = router;
