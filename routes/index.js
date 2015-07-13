var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var logout = require('express-passport-logout');

mongoose.connect('mongodb://localhost/wheelSwap');
// mongoose.connect(process.env.MONGOLAB_URI);


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
  }],
  trade: [{}]
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
    console.log(currentUser);
    res.json(currentUser);
  });
});

router.get('/markeplace_inventory', function(req, res){
  User.find().exec(function(error,data){
    console.log(data);
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
    console.log('saved entry', user);
    res.json(user);
  });
});

router.patch('/edit_car/:userId/:carId', function(req, res){
  console.log(req.body);
 console.log(req.params.userId, req.params.carId);
 User.update({'email': req.params.userId, 'inventory._id': req.params.carId},{$set : {'inventory.$' : req.body}}, function(error, data) {
   if (error) {
     console.log('error', error);
   }
   console.log('data',data);
   res.json(data);
 });
});

router.delete('/delete_car/:userId/:carId', function(req, res) {
  User.update({email : req.params.userId}, { $pull : {inventory: {_id: req.params.carId}}}, function(error, data){
    if (error) {
      console.log(error);
    }
    console.log(data);
  });
  // res.json({message: "deleted"})
});

router.patch('/trade_car', function(req, res){
  console.log(req.body);
  // console.log("myEmail", req.body.myOffer.myEmail);
  // console.log("theirEmail",req.body.theirOffer.theirEmail);
  //
  // console.log("otherEmail", req.body.myOffer.selectedCar.email);
  // console.log("otherEmail", req.body.theirOffer.myCar.email);

  User.findOne({ email: req.body.myOffer.myEmail }, function(err, user){
    if (err) {
      console.log(err);
    }
    if (!user) {
      res.status(404);
    }
    user.trade.push(req.body.myOffer);
    user.save();
    console.log('theUser', user);
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
  console.log(req.body);

});
router.patch('/decline_offer', function(req, res){
  console.log(req.body);
});

module.exports = router;
