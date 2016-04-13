var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var session = require("express-session");
var cors = require("cors");

var db = require('./config/db.js');
var passport = require('passport');
LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var fs = require('fs');

var userLoginObj = require('./app/models/adminlogins/adminlogin.js');
//var userLoginObj = require('./app/models/users/users.js');
//var buyerLoginObj = require('./app/models/buyers/buyers.js');
var loginMerchantObj = require('./app/models/merchants/merchants.js');
var RememberMeStrategy = require('passport-remember-me').Strategy;

var constantObj = require('./config/constants.js');
var fs = require('fs');

// var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.engine('html',function(path,opt,fn){  //manishp
  fs.readFile(path,'utf-8',function(err,str){
    if(err) return str;
    return fn(null,str);
  });
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/admin', function (req, res) {
    res.render('admin.html');
});

app.get('/sme', function (req, res) {
    res.render('sme.html');
});

app.get('/',function(req,res){
  res.render('home.html');
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '5mb'}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);

//API Security - Browser Authentication/Basic Authentication
var users = [{username:'offuz', password:'offuz'}];
passport.use('basic',new BasicStrategy({}, function (username, password, done) {

    findByUsername(username, function(err, user) {
      if (err) { return done(err); }
          if (!user) { return done(null, false); }
          if (user.password != password) { return done(null, false); }
          return done(null, user);
      });
  }
));

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

var tokens = {}
function consumeRememberMeToken(token, fn) {
  var uid = tokens[token];
  // invalidate the single-use token
  delete tokens[token];
  return fn(null, uid);
}

function saveRememberMeToken(token, uid, fn) {
  tokens[token] = uid;
  return fn();
}

//Admin login
var LocalStrategy = require('passport-local').Strategy;
passport.use('adminLogin',new LocalStrategy(
  function(username, password, done) {      
    userLoginObj.findOne({$or: [
              { 'username': username }, 
              { 'email': username  }
          ],enable:true,is_deleted:false},{password:1, firstname:1, lastname:1, username : 1}, function(err, adminuser) {
      if(err) {
             return done(err);
      }
      if(!adminuser) {
         //console.log("in adminuser");
         return done(null, false);
      }               
      bcrypt.compare(password,adminuser.password, function(err,res) {
          if (res==false) {
             return done(null, false);
          }else{

            //console.log(adminuser);return;                        
             return done(null, {id: adminuser});
          }
      });
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  userLoginObj.findById(id, function(err, user) {
    done(err, user);
  });
});

//Merchant login
passport.use('merchantlogin',new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
    },
    function(email, password, done) {
    var merchantDetail = {'email':email};
    loginMerchantObj.findOne({'email':email}, function(err, merchant){
        if (err) {
            return done(err);
        }
        if (!merchant){
            return done(null, false, { message: 'Incorrect email or password.' });
        } else {
            if(merchant.enable == false){
                return done(null, false, { message: 'Your account is inactive, please contact administrator.'});
            } else {
              bcrypt.compare(password,merchant.password, function(err,res) {
                  if (res==false) {
                     return done(null, false, { message: 'Incorrect email or password.' });
                  }else{                
                     return done(null,merchant);
                  }
              });
            }
        }
        
    });
    }
  ));
passport.serializeUser(function(merchant, done) {
  done(null, merchant.id);
});
passport.deserializeUser(function(id, done) {
  loginMerchantObj.findById(id, function(err, merchant) {
    done(err, merchant);
  });
});

//Consumer login
passport.use('consumerlogin',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    function(email, password, done) {
      loginConsumerObj.findOne({'email': email, enable:true, is_deleted:false},{email:1, password:1}, function(err, consumer) {
        if(err) {
          return done(err);
        }       
        if(!consumer) {
          return done(null, false);
        }
        bcrypt.compare(password,consumer.password, function(err,res) {
            if (res==false) {
               return done(null, "NotConsumer");
            }else{                
               return done(null, {id: consumer});
            }
        });
      });
    }
  ));
passport.serializeUser(function(consumer, done) {
  done(null, consumer.id);
});
passport.deserializeUser(function(id, done) {
  loginConsumerObj.findById(id, function(err, consumer) {
    done(err, consumer);
  });
});


passport.use(new RememberMeStrategy(
  function(token, done) {
    consumeRememberMeToken(token, function(err, uid) {
      if (err) { return done(err); }
      if (!uid) { return done(null, false); }
      
    findById(uid, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);
      });
    });
  },
  issueToken
));

function issueToken(user, done) {
  var token = utils.randomString(64);
  saveRememberMeToken(token, user.id, function(err) {
    if (err) { return done(err); }
    return done(null, token);
  });
}


//require('./routes/Admin/page')(app, express, passport);
require('./routes/Home/home')(app, express, passport);
require('./routes/Merchant/merchant')(app, express, passport);
require('./routes/Offer/offer')(app, express, passport);
require('./routes/Consumer/consumer')(app, express, passport);
require('./routes/Category/category')(app, express, passport);
require('./routes/Favourite/favourite')(app, express, passport);
require('./routes/Download/download')(app, express, passport);
require('./routes/Content/content')(app, express, passport);

require('./routes/Admin/adminlogin')(app, express, passport);
require('./routes/Admin/category')(app, express, passport);
require('./routes/Admin/subcategory')(app, express, passport);
require('./routes/Admin/merchant')(app, express, passport);
require('./routes/Admin/offertype')(app, express, passport);
require('./routes/Admin/sitecontent')(app, express, passport);
require('./routes/Admin/content')(app, express, passport);
require('./routes/Admin/faq')(app, express, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
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
