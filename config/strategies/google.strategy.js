'use strict';
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../../models/userSchema');

var url = process.env.CALLBACK_URL ||
module.exports = function(app) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // callbackURL: 'http://localhost:3000/auth/google/callback'},
    callbackURL: 'https://wheelswap.herokuapp/auth/google/callback'},
    function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      User.findOne({ email: profile.emails[0].value }, function(err, user){
        if (!user) {
          User.create({
            displayName: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value
          }, function(err, newUser){
            done(null, newUser);
          });
        } else {
          done(null, user);
        }
      });
    }
  ));
};
