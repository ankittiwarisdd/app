var contentObj = require('./../../../app/models/contents/contents.js');
var faqObj = require('./../../../app/models/faqs/faqs.js');
var msgObj = require('./../../../app/models/messages/messages.js');
var constantObj = require('../../../config/constants.js');
var nodemailer = require('nodemailer');

//******************//
exports.getContent = function(req, res) {
    var outputJSON = "";
    var type = req.body.type;
    contentObj.find({"is_deleted":false,"type":type},{"__v":0,"is_deleted":0,"createdDate":0,"enable":0}, function(err, data) {
		if(err) {
			outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
		}
		else {
			outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}
		}
		res.jsonp(outputJSON);
	});
}

exports.getFaq = function(req, res) {
    var outputJSON = "";
    faqObj.find({is_deleted:false},{"__v":0,"is_deleted":0,"createdDate":0,"enable":0}, function(err, data) {
		if(err) {
			outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
		}
		else {
			outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}
		}
		res.jsonp(outputJSON);
	});
}


exports.contact = function(req, res) {
    var outputJSON = "";
    var email = req.body.email;
    var message = req.body.message;
    var data = req.body;
    //console.log(req.body);return false;
    msgObj(data).save(function(err, data) {
		if(err) {
			outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.messageAddFailure};
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
                to: "test1234@yopmail.com",
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
                console.log('Message sent: ' + info.response);

            });
               //outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.consumerAddSuccess, 'data':data};
            outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.messageAddSuccess};	
        }
		res.jsonp(outputJSON);
	});
}