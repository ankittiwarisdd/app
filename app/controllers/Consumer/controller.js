var consumerObj = require('./../../../app/models/consumers/consumers.js'); 
var merchantObj = require('./../../../app/models/merchants/merchants.js');  //Calling Object
var constantObj = require('../../../config/constants.js');  //Calling constant messages for session flash statements
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var session = require('express-session');
var passport = require('passport'),LocalStrategy = require('passport-local').Strategy;

var session = require('express-session');
var geolib = require('geolib');



//authenticate
exports.authenticate = function(req, res, next) {
  passport.authenticate('local', function(err, consumer, info){
        if (err){
            next(err);
            return;
        }
        if (!consumer){
            res.json( {'status':'error', 'messageId':401, 'error':'Unauthorized', 'message':info.message } );
            return;
        }
        req.logIn(consumer, { session: true },function (err){
            // Should not cause any errors
            if (err){
                next(err);
            }
            else{
                res.json({'status':'success', 'messageId':200, 'message':'You are logged in successfully','consumer_id':consumer});
            }
            return; 
        });
    })(req, res, next);
  //if(req.user == "NotConsumer"){
  //  res.jsonp({'status':'error', 'messageId':401, 'message':'Invalid Email/Password'});
  //}else{
  //    session.consumer = req.user;
  //    res.jsonp({'status':'success', 'messageId':200, 'message':'You are logged in successfully','consumer':req.user});
  //}
}



passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
    },
    function(email, password, done) {

  //password = common.encrypt(password);

        var consumerDetail = {'email':email};
        consumerObj.findOne({'email':email}, function(err, consumer){
          //console.log(consumer);
            if (err) {
                return done(err);
            }
            if (!consumer){
                return done(null, false, { message: 'Incorrect email or password.' });
            } else {
                //console.log("--------------consumer",consumer);
                if(consumer.enable == false){
                    return done(null, false, { message: 'Your account is inactive, please contact administrator.'});
                } else {
                  //console.log(password+"......."+ consumer.password +"......."+ consumer["password"] + '.......'+ consumer.email);
                  bcrypt.compare(password,consumer.password, function(err,res) {
                    //console.log(res);
                      if (res==false) {
                         return done(null, false, { message: 'Incorrect email or password.' });
                      }else{                
                         return done(null,consumer);
                      }
                  });
                    //return done(null,consumer);
                }
            }
            
        });
    }
));
passport.serializeUser(function(consumer, done) {
  console.log(consumer);
  done(null, consumer);
});
passport.deserializeUser(function(id, done) {
  consumerObj.findById(id, function(err, consumer) {
    done(err, consumer);
  });
});


//logout
exports.logout = function(req, res) {
    session.consumer = null;
    res.jsonp({'status':'success', 'messageId':200, 'message':'Consumer logged out successfully'});    
}

exports.checkloggedin = function(req, res) {
    if (session.consumer) {
        res.jsonp({'status':'success', 'messageId':200, 'message':'Consumer logged in successfully','consumer':session.consumer});
    }else{
        res.jsonp({'status':'success', 'messageId':200, 'message':'Consumer not logged in'});

    }
}

//logout
exports.logout = function(req, res) {
   //console.log("Here");
    //console.log(req.user);
    //req.session.
    //console.log(req.session.id);
    session.merchant = null;
    //req.session.destroy();
    res.jsonp({'status':'success', 'messageId':200, 'message':'Merchant logged out successfully'});    
}




///////////////////////
// registerConsumer
///////////////////////
exports.registerConsumer = function(req, res) {
  var outputJSON = "";
  var errorMessage = "";
  //var randomstring = Math.random().toString(36).slice(-8);
//return res.jsonp(randomstring);
  //req.body.password = randomstring;
  var data = req.body;
  if(req.body.email == undefined){
       outputJSON = {'status': 'error', 'messageId':401, 'message':constantObj.messages.consumerEmailBlank};
       return res.jsonp(outputJSON);
  }else{
        consumerObj(data).save(function(err, data) {
//console.log(err);
//return res.jsonp(err);
             if(err) {
               switch(err.name) {
                 case 'ValidationError':
                   for(field in err.errors) {
                     if(errorMessage == "") {
                       errorMessage = err.errors[field].message;
           outputJSON = {'status': 'error', 'messageId':401, 'message':errorMessage};
                     }
                     else {              
                       errorMessage+="\r\n" + err.errors[field].message;
           outputJSON = {'status': 'error', 'messageId':401, 'message':errorMessage};
                     }
                   }
        return res.jsonp(outputJSON);
                 break;
               }
               outputJSON = {'status': 'error', 'messageId':401, 'message':constantObj.messages.consumerAddFailure};
             }
             else {
      var transporter = nodemailer.createTransport(
                            constantObj.gmailSMTPCredentials.type,
                            {
                            service: constantObj.gmailSMTPCredentials.service,
                            auth: {
                                user: constantObj.gmailSMTPCredentials.username,
                                pass: constantObj.gmailSMTPCredentials.password
                            }
                        });

                        var mailOptions = {
                            from: constantObj.gmailSMTPCredentials.username,
                            to: req.body.email,
                            subject: 'Offuz Registration',
                            html: 'You have successfully registered on Offuz.\n\n' +
                              'Below are your credentials to enjoy services of Offuz.\n\n'+
            'Email : '+req.body.email+'\n\n'+
            'Password : '+req.body.password+'\n\n'

                        };

                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, function(error, info){
                            if(error){
                                return console.log(error);
                            }
                            console.log('Message sent: ' + info.response);

                        });
               outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.consumerAddSuccess, 'data':data};
             }
             return res.jsonp(outputJSON);
         });
  }
}



exports.forgot_password = function(req, res) {
        var outputJSON = req.body.email;
//res.jsonp(outputJSON);
        if(req.body.email == undefined){
            outputJSON = {'status': 'error', 'messageId':401, 'message':constantObj.messages.consumerEmailBlank};
            return res.jsonp(outputJSON);
        }else{
            consumerObj.findOne({email:req.body.email}, function(err, data) {
            if (err) {
                outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
                res.jsonp(outputJSON);
            }else if(!data){
                outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.consumerEmailnotexist};
                res.jsonp(outputJSON);
              
            }else {
                var randomstring = Math.random().toString(36).slice(-8);
                req.body.password = randomstring;
                if(data) {
        data.password = randomstring;
                    data.save(function(err, data) {
                            if(err) {
                                outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
                            } else {
                                    var transporter = nodemailer.createTransport(
                                        constantObj.gmailSMTPCredentials.type,
                                        {
                                        service: constantObj.gmailSMTPCredentials.service,
                                        auth: {
                                            user: constantObj.gmailSMTPCredentials.username,
                                            pass: constantObj.gmailSMTPCredentials.password
                                        }
                                    });

                                    var mailOptions = {
                                        from: constantObj.gmailSMTPCredentials.username,
                                        to: req.body.email,
                                        subject: 'Offuz Updated Password',
                                        html: 'You are receiving this because you (or someone else) have requested to reset the password for your account.\n\n' +
                                              'Please use below mentioned password for further access:\n\n' +
                                              'Email : ' + req.body.email + '\n\n' +
                                              'Password : ' + req.body.password + '\n\n' +
                                              'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                                    };

                                    // send mail with defined transport object
                                    transporter.sendMail(mailOptions, function(error, info){
                                        if(error){
                                            return console.log(error);
                                        }
                                        console.log('Message sent: ' + info.response);

                                    });

                                outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successSendingForgotPasswordEmailCon}
                                
                            }
                            res.jsonp(outputJSON);                        
                        });                    
                } else {
                        outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successSendingForgotPasswordEmailCon}
                        res.jsonp(outputJSON);
                    }
                }
            });
        }
}


exports.update_profile = function(req, res) {
  // user_id, use_current_loc, distance, postal_code
  var consumerId = req.body.consumer;
  var use_current_loc = req.body.use_current_loc;
  var distance = req.body.distance;
  var postal_code = req.body.postal_code;
  var country = req.body.country;
  var myData = req.body;
  delete req.body.consumer;
        consumerObj.update({_id:consumerId},myData,function(err, data) {
            if(err) {
                outputJSON = {'status':'error', 'messageId':401, 'message': constantObj.messages.consumerUpdateFailure};
            }
            else {
                outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.consumerUpdateSuccess, 'data': data}
            }
            return res.jsonp(outputJSON);
        });
}

exports.getProfile = function(req, res) {
  var consumerId = req.body.consumer;
      consumerObj.findById({_id:consumerId},{"is_deleted":0,"__v":0,"enable":0}, function(err, data) {
        if(err) {
             outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
        }
        else {
             outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}
        }
        res.jsonp(outputJSON);
      });
}



exports.findLocations = function(req,res){
//console.log(req.body);return false; 
  var radius = req.body.radius;
  var consumerlat = req.body.latitude;
  var consumerlong = req.body.longitude;
  var outputJSON = "";
  merchantObj.find({is_deleted:false,enable:true},{"is_deleted":0,"__v":0,"enable":0}, function(err, data1) {
    if(err) {
      outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
      res.jsonp(outputJSON);
    }
    else {
        for(var attributename in data1){
          //console.log(attributename);
            var merchantLat = data1[attributename].latitude;
            var merchantLong = data1[attributename].longitude;
            var res1 = geolib.getDistance(
              {latitude: consumerlat, longitude: consumerlong},
              {latitude: merchantLat, longitude: merchantLong}
            );
            var distance = res1/1000;
            if(distance <= radius){
                data1[attributename]["distance"] = distance;
            }
        }
        outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data1};
        res.jsonp(outputJSON);
    }
  });
}
