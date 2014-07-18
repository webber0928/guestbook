var express = require('express')
	, app = express()
  , util = require('util')
  , mongoose = require('mongoose')
  , flash = require('connect-flash')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , methodOverride = require('method-override')
  , session = require('express-session')
  , morgan = require('morgan')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var port     = process.env.PORT || 3000; // set our port
var ac = require('./routes/account');
// var user;

require('./models/account');
var Account = mongoose.model( 'account' );

Account.find( function ( err, users, count ){
  // console.dir(users)
});
function findById(id, fn) {
	Account.find( function ( err, users, count ){
	  var idx = id - 1;
	  if (users[idx]) {
	    fn(null, users[idx]);
	  } else {
	    fn(new Error('User ' + id + ' does not exist'));
	  }
	});
}
function findByUsername(username, fn) {
	Account.find( function ( err, users, count ){
	  for (var i = 0, len = users.length; i < len; i++) {
	    var user = users[i];
	    if (user.username === username) {
	      return fn(null, user);
	    }
	  }
	  return fn(null, null);
	});
}
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

passport.serializeUser(function(user, done) {
  done(null, user.nid);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: '沒有此帳號 ' + username }); }
        if (user.password != password) { return done(null, false, { message: '密碼錯誤' }); }
        return done(null, user);
      })
    });
  }
));

// configure
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.Router());
app.use(express.static(__dirname + '/public'));
require('./models/account');

app.get('/account', ensureAuthenticated, ac.account);
app.get('/login', ac.loginG);
app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), ac.loginP);
app.get('/register', ac.registerG);
app.post('/register', ac.registerP);
app.get('/logout', ac.logout);
app.get('/', ac.index);
app.post('/', ac.indexP);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('web start listen ' + port);