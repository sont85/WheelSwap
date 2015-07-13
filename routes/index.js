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
    User.findOneAndUpdate({email: req.user.emails[0].value }, entry ,{upsert: true, new: true}, function(err, savedEntry){
      if (err) {
        console.log(err);
      }
      console.log('success savedEntry', savedEntry);
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
 User.findOne({email: req.params.userId, 'inventory._id': req.params.carId},{$set : {'inventory.$' : req.body}}, function(error, data) {
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

module.exports = router;
