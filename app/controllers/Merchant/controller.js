var merchantObj = require('./../../../app/models/merchants/merchants.js');   //Calling Object
var downloads = require('./../../../app/models/downloads/downloads.js');
var constantObj = require('../../../config/constants.js');  //Calling constant messages for session flash statements
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');

var extra = {
    apiKey: 'AIzaSyAf6FtW5v1TWsFZw3iVomysv-NQSmGdat0', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};
var geocoderProvider = 'google';
var httpAdapter = 'https';
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

var ip = require('ip');
var satelize = require('satelize');

var qs = require('querystring');
var request = require('request');
var jwt = require('jwt-simple');
var moment = require('moment');
var session = require('express-session');


//authenticate
exports.authenticate = function(req, res) {
    session.merchant = req.user;
    res.jsonp({'status':'success', 'messageId':200, 'message':'Merchant logged in successfully','merchant':req.user});
}

exports.checkloggedin = function(req, res) {
    if (session.merchant) {
        res.jsonp({'status':'success', 'messageId':200, 'message':'Merchant logged in successfully','merchant':session.merchant});
    }else{
        res.jsonp({'status':'success', 'messageId':200, 'message':'Merchant not logged in'});
    }
}

//logout
exports.logout = function(req, res) {
  //console.log("Coming !!!!!!1");return;
    session.merchant = null;
    res.jsonp({'status':'success', 'messageId':200, 'message':'Merchant logged out successfully'});    
}

exports.findLatLong = function(req,res){
     var merchantId = req.params.merchantId;
     //console.log(req.body.merchant);return;
     merchantObj.findById({_id:merchantId},{latitude:1,longitude:1}, function(err, data) {
          if(err) {
               outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
          }
          else {
               outputJSON = {'status':'success', 'messageId':200, 'data': data}
          }
          res.jsonp(outputJSON);
     });
}


///////////////////////
// login seller
///////////////////////
exports.registerMerchant = function(req, res) {  
    var outputJSON = "";
    var errorMessage = "";
    if(req.body.businessType == 1){
      req.body.businessType = "physical";
    }else if(req.body.businessType == 2){
      req.body.businessType = "ecom";
    }else{
      req.body.businessType = "both";
    } 

    geocoder.geocode(req.body.tradingAddress+', '+req.body.city, function(err, geores) {
        for(var attributename in geores){
          geores.latitude = geores[attributename].latitude; 
          geores.longitude = geores[attributename].longitude;
        }
        req.body.latitude = geores.latitude;
        req.body.longitude = geores.longitude;
        req.body.category = req.body.categories;
        req.body.subcategory = req.body.subcategories;
        delete req.body.categories;
        delete req.body.subcategories;
        var data = req.body;
        merchantObj(data).save(function(err, data) {
            if(err) {
              switch(err.name) {
                case 'ValidationError':
                  for(field in err.errors) {
                    if(errorMessage == "") {
                      errorMessage = err.errors[field].message;
                    }
                    else {              
                      errorMessage+="\r\n" + err.errors[field].message;
                    }
                  }//for
                break;
              }//switch
              outputJSON = {'status': 'error', 'messageId':401, 'message':errorMessage};
            }//if
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
               //outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.consumerAddSuccess, 'data':data};
              outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.merchantAddSuccess};
            }
            return res.jsonp(outputJSON);
        });
    }); 
}

exports.getFrontCountry = function(req, res) {
   // console.log(req.params.country);return false;
    var countryIN = req.params.country;
    var country = require('countryjs');
    //console.log(countryIN);console.log(country);return false;
        var getState = country.states(countryIN);
       // console.log(getState);return false;
        var countryInfo = country.info(countryIN);
        //console.log(getState);return false;
        outputJSON = {'status': 'success', 'messageId':200,'states':getState,'country':countryInfo.name};
        res.json(outputJSON);
  }
exports.uploadPic = function(req, res){
     var fs = require('fs');
     var gm = require('gm');//.subClass({ imageMagick: true });
     //var easyimg = require('easyimage'); 
     var imageMagick = gm.subClass({ imageMagick: true });

     var formidable = require('formidable');
     var form = new formidable.IncomingForm();          
     var RecordLocator = "";
     form.parse(req, function(err, fields, files) {
          var file_name = "";
           if(files.file.name){
                uploadDir = 'public/images/merchantProfiles';
                
                file_name = files.file.name;
                file_name = file_name.split('.');
                ext = file_name[file_name.length-1];
                RecordLocator = file_name[0];
                var name = (new Date()).getTime();
                file_name = name+'.'+ext;
                fs.renameSync(files.file.path, uploadDir + "/" + file_name);
                res.jsonp(file_name);
           }
      });
}

//forgot password
exports.forgot_password = function(req, res) {
        var outputJSON = "";
        //console.log(req.body.email);
        crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
            merchantObj.findOne({email:req.body.email}, function(err, data) {
                //console.log(err);console.log(data);return false;
            if (err) {
              //console.log(err);return false;
                outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
                res.jsonp(outputJSON);
            }else if(!data){
               outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.sellerEmailnotexist};
                res.jsonp(outputJSON);
              
            }else {
              
                if(data) { 
                    merchantObj.findByIdAndUpdate({ _id: data._id}, 
                    { $set: {
                        resetPasswordToken:token,
                        resetPasswordExpires:Date.now() + 3600000
                        } 
                    }, function (err, data) {
                      
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
                                    subject: 'Offuz Reset Password',
                                    html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                                          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                          '<a href="http://' + req.headers.host + '/#/merchants/reset/' + token + '" target="_blank" >http://' + req.headers.host + '/merchants/reset/' + token + '</a>\n\n' +
                                          'If you did not request this, please ignore this email and your password will remain unchanged.\n'

                                };

                                // send mail with defined transport object
                                transporter.sendMail(mailOptions, function(error, info){
                                    if(error){
                                        return console.log(error);
                                    }
                                    console.log('Message sent: ' + info.response);

                                });

                            outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successSendingForgotPasswordEmail}
                            
                        }
                            res.jsonp(outputJSON);
                        });                    
                        } else {
                            outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successSendingForgotPasswordEmail}
                            res.jsonp(outputJSON);
                        }
                    }
            });
              
        });
}


exports.resetPassword = function(req, res) {
         var outputJSON = "";
        // console.log("Here");;return false;
         merchantObj.findOne({ resetPasswordToken: req.params.token}, function(err, data) {
            if(err) {
                outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
            } else {
                if(!data) {
                    outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.buyerPasswordResetToken};
                } else {
                    outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.buyerPasswordSuccess, 'data':data};
                }
            }
            res.jsonp(outputJSON);
        });
}


exports.resetMerchantPassword = function(req, res) {
  merchantObj.findOne({ resetPasswordToken: req.body.token}, function(err, data) {
        if(err) {
            outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
            res.jsonp(outputJSON);
        } else {
                  // console.log(data);return false;
            if(!data) {
                outputJSON = {'status':'failure', 'messageId':203, 'message':"Reset Password token has been expired"};
                res.jsonp(outputJSON);
            } else {
                data.password = req.body.newPassword;
                data.resetPasswordToken = undefined;
                data.resetPasswordExpires = undefined;
                
                data.save(function(err, data) {
                    if(err) {
                        outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
                        res.jsonp(outputJSON);
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
                                to: data.email,
                                subject: 'Offuz Reset Password',
                                html : 'Hello,\n\n' +
                                   'This is a confirmation that the password for your account ' + data.email + ' has just been changed.\n'
                            };

                            // send mail with defined transport object
                            transporter.sendMail(mailOptions, function(error, info){
                                if(error){
                                    return console.log(error);
                                }
                                console.log('Message sent: ' + info.response);

                            });                          

                            outputJSON = {'status':'success', 'messageId':200, 'message':'Password has been successfully updated'};
                            res.jsonp(outputJSON);
                        }
                });
                 
            }
        } 
    });
}


exports.findSubCategory = function(req, res) {
     var merchantId = req.body.merchant;
     //console.log(req.body.merchant);return;
     merchantObj.findById({_id:merchantId},{subcategory:1}, function(err, data) {
          if(err) {
               outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
          }
          else {
               outputJSON = {'status':'success', 'messageId':200, 'data': data}
          }
          res.jsonp(outputJSON);
     });
}

exports.getCountry = function(req, res) {
    //console.log(req.params.country);return false;
    var countryIN = req.params.country;
    var country = require('countryjs');
    //console.log(countryIN);console.log(country);return false;
        var getState = country.states(countryIN);
       // console.log(getState);return false;
        var countryInfo = country.info(countryIN);
        //console.log(getState);return false;
        outputJSON = {'status': 'success', 'messageId':200,'states':getState,'country':countryInfo.name};
        res.json(outputJSON);
  }

  exports.getDashCount = function(req,res) {
    var id = req.params.currentUserId;
    
    downloads.count({"_id":id},function(err,count) {
      if(err){
               outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};        
      } else{
        outputJSON = {'status': 'success', 'messageId':200,'downloadedOffers':count};

      }
      res.jsonp(outputJSON);
    });
  }