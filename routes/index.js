'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var logout = require('express-passport-logout');
var User = require('../models/userSchema');
var Car = require('../models/carSchema');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/wheelSwap');
router.get('/', function (req, res, next) {
  console.log(req.user)
  res.render('index', {user: req.user});
});

module.exports = router;
