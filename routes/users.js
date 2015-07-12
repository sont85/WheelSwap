var express = require('express');
var router = express.Router();
var mongoose = require("mongoose")


inventorySchema = new mongoose.Schema({
  model: String,
  year: Number,
  color: String,
  condition: String,
});

userSchema = new mongoose.Schema({
  user: {type: String, required: true},
  inventory: [inventorySchema],
  email: String

});

var User = mongoose.model("User", userSchema)
/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  res.render("users", {user: { name: req.user.displayName,
                              image: req.user._json.image.url }});

});

module.exports = router;
