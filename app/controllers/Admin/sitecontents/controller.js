var sitecontentObj = require('../../../models/sitecontents/sitecontents.js');
var constantObj = require('../../../../config/constants.js');

//************Listing of category***************//
exports.listSiteContents = function(req, res) {	
	var outputJSON = "";
    //console.log("here");return false;	
	sitecontentObj.find({is_deleted:false}, function(err, data) {
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
exports.addSiteContent = function(req, res) {
	 var errorMessage = "";
     var outputJSON = "";
     var scObjArr = {};
     scObjArr.name = req.body.name;
     scObjArr.description = req.body.description;

     sitecontentObj(scObjArr).save(function(err, data) { 
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
            outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.siteContentAddFailure};
          }else {
            outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.siteContentAddSuccess};
            res.jsonp(outputJSON);
          }          
     });
}


//**********get Category data for HTML file for updating category data********//
exports.editSiteContent = function(req, res) {
     var outputJSON = "";     
     sitecontentObj.findById(req.params.sitecontentId, function(err, data) {
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
exports.updateSiteContent = function(req, res) {
    var reqId = req.body._id;
    var myData = req.body;
    delete req.body._id;
    sitecontentObj.update({_id:reqId},myData,function(err, data) {
        //console.log(err);return false;
        if(err) {
            outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.siteContentUpdateFailure};
        }
        else {
            outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.siteContentUpdateSuccess, 'data': data}
        }
        return res.jsonp(outputJSON);
    })
}


//**********get Category data for HTML file for updating category data********//
exports.viewSiteContent = function(req, res) {
     var outputJSON = "";     
     sitecontentObj.findById(req.params.sitecontentId, function(err, data) {
          if(err) {
               outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
          }
          else {
               outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}
          }
          res.jsonp(outputJSON);
     });
}
