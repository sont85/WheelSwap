var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var routes = require('./routes/index');
// var users = require('./routes/users');
var auth = require('./routes/auth');

var app = express();

passport.use(new GoogleStrategy({
  clientID: '260657249477-biu2qgp1a8kt2d8s2f03mslneuefda38.apps.googleusercontent.com',
  clientSecret: 'zBHF9LndcyxZbNV1YiQAHliQ',
  // callbackURL: 'http://localhost:3000/auth/google/callback'},
  callbackURL: 'https://wheelswap.herokuapp.com/auth/google/callback'},
  function(req, accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret:"codinghouse", resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done){
  done(null, user)
});

passport.deserializeUser(function(user, done){
  done(null, user)
});
app.use('/', routes);
// app.use('/users', users);
app.use('/auth', auth);

var logout = function(req, res){
  if (req.isAuthenticated()){
    req.logout();
  }
  res.redirect('/');
};
app.get('/logout', logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
module.exports = app;
