'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var logout = require('express-passport-logout');
var User = require('../models/userSchema');
var Car = require('../models/carSchema');
var History = require('../models/historySchema');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/wheelSwap');
router.get('/', function (req, res, next) {
  res.render('index', {user: req.user});
});

router.get('/marketplace', function(req, res){
  Car.find(function(err, cars){
    var data = {
      allCars : cars,
    };
    if (req.user) {
      data.currentUserName = req.user.displayName;
    }
    res.json(data);
  });
});

router.get('/user/inventory', function(req, res){
  User.findById(req.user._id).populate('inventory').exec(function(err, user){
    res.json(user);
  });
});

router.post('/user/car/add', function(req, res){
  User.findById(req.user._id, function(err, user){
    Car.create({
      model : req.body.model,
      year: req.body.year,
      color: req.body.color,
      condition: req.body.condition,
      ownerName: req.user.displayName,
      ownerId: req.user._id,
      imageUrl: req.body.imageUrl
    }, function(err, car){
      user.inventory.push(car._id);
      user.save();
      res.json('success');
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
    res.json('success');
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

router.post('/marketplace/trade/create', function(req, res) {
  History.create({
    carA: req.body.myCar._id,
    carB: req.body.selectedCar._id,
    traderA: req.body.myCar.ownerId,
    traderB: req.body.selectedCar.ownerId,
    status: 'pending'
  }, function(err, history){
    console.log(history);
    res.json('success');
  });
});

router.post('/marketplace/trade/decline', function(req, res){
  History.findById(req.body._id, function(err, history){
    history.status = 'cancel';
    history.carA.
    history.save();
    res.json('success');
  });
});
router.patch('/marketplace/trade/accept', function(req, res){
  console.log(req.body._id);
  History.find({$or :[{carA: req.body.carA._id, status: 'pending'}, {carB: req.body.carA._id, status: 'pending'}, {carA: req.body.carB._id, status: 'pending'}, {carA: req.body.carB._id, status: 'pending'}]}, function(err, histories){
    histories.forEach(function(item){
      if (item.status !== 'complete') {
        item.status = 'cancel';
        item.save();
      }
    });
  });
  History.findById(req.body._id).populate('traderA').populate('traderB').populate('carA').populate('carB').exec(function(err, history){
    history.status = 'complete';
    history.traderA.inventory.pull(history.carA._id);
    history.traderA.inventory.push(history.carB._id);
    history.traderB.inventory.pull(history.carB._id);
    history.traderB.inventory.push(history.carA._id);
    history.carA.ownerName = history.traderB.displayName;
    history.carA.ownerId = history.traderB._id;
    history.carB.ownerName = history.traderA.displayName;
    history.carB.ownerId = history.traderA._id;
    history.save();
    history.traderA.save();
    history.traderB.save();
    history.carA.save();
    history.carB.save();
    res.json('success');
  });
});

router.get('/user/history', function(req, res) {
  History.find({ traderA: req.user._id }).populate('traderA').populate('traderB').populate('carA').populate('carB').exec(function(err, history){
    History.find({ traderB: req.user._id }).populate('traderA').populate('traderB').populate('carA').populate('carB').exec(function(err, history2){
      res.json({history : history, history2 : history2 });
    });
  });
});


module.exports = router;
