'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var logout = require('express-passport-logout');

// mongoose.connect('mongodb://localhost/wheelSwap');
mongoose.connect(process.env.MONGOLAB_URI);


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
  trade: [{}],
  history: [{}]
});

var User = mongoose.model('User', userSchema);

router.get('/', function (req, res, next) {
  if (req.user){
    User.findOne({email: req.user.emails[0].value }, function(error, user){
      if (error) {
        console.log('error');
      }
      if (!user) {
        var entry = new User({
          userName: req.user.displayName,
          email: req.user.emails[0].value,
          image: req.user.photos[0].value,
        });
        entry.save();
      }
      res.render('index');
    });
  }
  res.render('index');
});

router.get('/get_current_user', function (req, res){
  User.findOne({email: req.user.emails[0].value}, function(error, currentUser){
    if (error) {
      console.log(error);
    }
    res.json(currentUser);
  });
});

router.get('/markeplace_inventory', function(req, res){
  User.find().exec(function(error,data){
    res.json(data);
  });
});

router.post('/add_car', function(req, res, next) {
  User.findOne({email: req.user.emails[0].value}, function(error, user){
    if (error) {
      console.log(error);
    }
    user.inventory.push(req.body);
    user.save();
    res.json(user);
  });
});

router.patch('/edit_car/:userId/:carId', function(req, res){
 User.update({'email': req.params.userId, 'inventory._id': req.params.carId},{$set : {'inventory.$' : req.body}}, function(error, data) {
   if (error) {
     console.log('error', error);
   }
   res.json(data);
 });
});

router.delete('/delete_car/:userId/:carId', function(req, res) {
  User.update({email : req.params.userId}, { $pull : {inventory: {_id: req.params.carId}}}, function(error, data){
    if (error) {
      console.log(error);
    }
    res.send();
  });
});

router.patch('/trade_car', function(req, res){
  User.findOne({ email: req.body.myOffer.myEmail }, function(err, user){
    if (err) {
      console.log(err);
    }
    if (!user) {
      res.status(404);
    }
    user.trade.push(req.body.myOffer);
    user.save();
  });

  User.findOne({ email: req.body.theirOffer.myCar.email}, function(err, user){
    if (err) {
      console.log(err);
    }
    if (!user) {
      res.status(404);
    }
    user.trade.push(req.body.theirOffer);
    user.save();
  });
  res.send('good');
});

router.get('/get_pending_offer', function(req, res) {
  User.findOne({email: req.user.emails[0].value}, function(err, user) {
    if (err) {
      res.json(err);
    }
    if (!user) {
      res.status(404);
    }
    res.json(user.trade);
  });
});

router.patch('/accept_offer', function(req, res){
  console.log(req.body)
  var myCar = req.body.myCar;
  var selectedCar = req.body.selectedCar;
  User.findOne({'trade.myCar._id' : req.body.myCar._id}, function(err,user){
    if (!user) {
      res.status(404);
    }
    user.trade.forEach(function(item, index) {
      var dataId = item.myCar._id.toString();
      var myCarId = req.body.myCar._id.toString();
      if (dataId === myCarId) {
        user.trade.splice(index, 1);
      }
    });
    user.save();
  });
  User.findOne({'trade.myCar._id' : req.body.selectedCar._id}, function(err,user){
    if (!user) {
      res.status(404);
    }
    user.trade.forEach(function(item, index) {
      var dataId = item.myCar._id.toString();
      var myCarId = req.body.selectedCar._id.toString();
      if (dataId === myCarId) {
        user.trade.splice(index, 1);
      }
    });
    user.save();

  });
  delete myCar.userName;
  delete myCar.email;
  User.update({'email': req.body.myEmail, 'inventory._id': myCar._id}, {$set: {'inventory.$': selectedCar}}, function(err, response) {
      User.update({'email': selectedCar.email, 'inventory._id': selectedCar._id}, {$set: {'inventory.$': myCar}}, function(err, response) {
        User.findOne({'email': req.body.myEmail}, function(err, user) {
          user.history.push({tradeAway: myCar.year + ' ' + myCar.model, tradeAwayImageUrl: myCar.imageUrl, receive: selectedCar.year + ' ' + selectedCar.model, receiveImageUrl: selectedCar.imageUrl, tradedWith: selectedCar.email});
          user.save();
          User.findOne({'email': selectedCar.email}, function(err, user){
            user.history.push({tradeAway: selectedCar.year + ' ' + selectedCar.model, tradeAwayImageUrl: selectedCar.imageUrl, receive: myCar.year + ' ' + myCar.model, receiveImageUrl: myCar.imageUrl, tradedWith: myCar.email});
            user.save();
            res.send();
          });
        });
      });
  });
});

router.patch('/decline_offer', function(req, res){
  var myCar = req.body.myCar;
  var selectedCar = req.body.selectedCar;
  User.findOne({'trade.myCar._id' : req.body.myCar._id}, function(err,user){
    if (!user) {
      res.status(404);
    }
    user.trade.forEach(function(item, index) {
      var dataId = item.myCar._id.toString();
      var myCarId = req.body.myCar._id.toString();
      if (dataId === myCarId) {
        user.trade.splice(index, 1);
        user.save();
      }
    });
  });
  User.findOne({'trade.myCar._id' : req.body.selectedCar._id}, function(err,user){
    if (!user) {
      res.status(404);
    }
    user.trade.forEach(function(item, index) {
      var dataId = item.myCar._id.toString();
      var myCarId = req.body.selectedCar._id.toString();
      if (dataId === myCarId) {
        user.trade.splice(index, 1);
        user.save();
        res.send();
      }
    });
  });
});

router.get('/history', function(req, res) {
  User.findOne({email: req.user.emails[0].value}, function(err, user) {
    res.json(user.history);
  });
});
module.exports = router;
