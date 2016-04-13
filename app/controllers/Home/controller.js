//var merchantModel = require('./../../../app/models/merchants/merchants.js');   //Calling Object
var constantObj = require('../../../config/constants.js'); 
var catObj = require('./../../../app/models/categories/categories.js'); 
var subcatObj = require('./../../../app/models/subcategories/subcategories.js'); 
var offobj = require('./../../../app/models/offers/offers.js');
var SmeMessage = require('./../../../app/models/smemessages/smemessages.js');
var nodemailer = require('nodemailer');
///////////////////////
// home website
///////////////////////
exports.home = function(req, res) {
   outputJSON = "I am here";
   catObj.find(function(err,data){
    if(err){
        res.jsonp({'status':'error', 'messageId':201,'data':err});
     }else{
         res.jsonp({'status':'success', 'messageId':200,'data':data});
     }   })
    // if(req.merchant == "Not merchant"){
    //     res.jsonp({'status':'error', 'messageId':201, 'message':'Unauthorised merchant','data':req.user});
    // }else{
    //     res.jsonp({'status':'success', 'messageId':200, 'message':'Merchant logged in successfully','data':req.user});
    // }
}    
exports.getSubCat =function(req, res) {
	var id = Object(req.params.catId);
   subcatObj.find({category:id},function(err,data){
   	 if(err){
        res.jsonp({'status':'error', 'messageId':201,'data':err});
     }else{
         res.jsonp({'status':'success', 'messageId':200,'data':data});
     }
  // console.log(data);console.log(err);
})
}
exports.getOffer =function(req, res) {
	var id = Object(req.params.offerId);
   offobj.find({subcategory:id},function(err,data){
   	 if(err){
        res.jsonp({'status':'error', 'messageId':201,'data':err});
     }else{
         res.jsonp({'status':'success', 'messageId':200,'data':data});
     }
  // console.log(data);console.log(err);
})
}
exports.sendSmeMessage = function(req,res) {
    var outputJSON = "";
    var email = req.body.email;
    var message = req.body.message;
    var data = req.body;
    //console.log(req.body);return false;
    console.log(data);
    SmeMessage(data).save(function(err, data) {
    if(err) {
      outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.messagePostFailed};
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
                to: "pkoc3010@gmail.com",
                //to: req.body.email,
                subject: 'Offuz Feedback',
                html: 'New notification from Offuz.\n\n' +
                    'Below are the details of consumer:\n\n'+
            'Email : '+email+'\n\n'+
                  'Message : '+message+'\n\n'
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log(info);
                console.log('Message sent: ' + info.response);

            });
               //outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.consumerAddSuccess, 'data':data};
            outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.messagePostSuccess};  
        }
    res.jsonp(outputJSON);
  });
}
