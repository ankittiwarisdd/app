var faqObj = require('../../../models/faqs/faqs.js');
var constantObj = require('../../../../config/constants.js');

//************Listing of category***************//
exports.listFaqs = function(req, res) {	
	var outputJSON = "";
    //console.log("here");return false;	
	faqObj.find({is_deleted:false}, function(err, data) {
		if(err) {
			outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
		}
		else {
			outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}
		}
		res.jsonp(outputJSON);
	});
}

//************Add Category***************//
exports.addFaq = function(req, res) {
	 var errorMessage = "";
     var outputJSON = "";
     var scObjArr = {};
     scObjArr.question = req.body.question;
     scObjArr.answer = req.body.answer;

     faqObj(scObjArr).save(function(err, data) { 
          if(err) {
               switch(err.name) {
                    case 'ValidationError':
                    
                         for(field in err.errors) {
                              if(errorMessage == "") {
                                   errorMessage = err.errors[field].message;
                              }
                              else {                                  
                                   errorMessage+=", " + err.errors[field].message;
                              }
                         }
                    break;
               }               
            outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.faqAddFailure};
          }else {
            outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.faqAddSuccess};
            res.jsonp(outputJSON);
          }          
     });
}


//**********get Category data for HTML file for updating category data********//
exports.editFaq = function(req, res) {
     var outputJSON = "";     
     faqObj.findById(req.params.faqId, function(err, data) {
          if(err) {
               outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
          }
          else {
               outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}
          }
          res.jsonp(outputJSON);
     });
}

//**********update category details********//
exports.updateFaq = function(req, res) {
    var reqId = req.body._id;
    var myData = req.body;
    delete req.body._id;
    faqObj.update({_id:reqId},myData,function(err, data) {
        //console.log(err);return false;
        if(err) {
            outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.faqUpdateFailure};
        }
        else {
            outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.faqUpdateSuccess, 'data': data}
        }
        return res.jsonp(outputJSON);
    })
}


//**********get Category data for HTML file for updating category data********//
exports.viewFaq = function(req, res) {
     var outputJSON = "";     
     faqObj.findById(req.params.faqId, function(err, data) {
          if(err) {
               outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
          }
          else {
               outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}
          }
          res.jsonp(outputJSON);
     });
}
