var contentObj = require('../../../models/contents/contents.js');
var constantObj = require('../../../../config/constants.js');

//************Listing of category***************//
exports.listContents = function(req, res) {	
	var outputJSON = "";
    //console.log("here");return false;	
	contentObj.find({is_deleted:false}, function(err, data) {
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
exports.addContent = function(req, res) {
	 var errorMessage = "";
     var outputJSON = "";
     var scObjArr = {};
     scObjArr.name = req.body.name;
     scObjArr.description = req.body.description;

     contentObj(scObjArr).save(function(err, data) { 
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
            outputJSON = {'status': 'failure', 'messageId':203, 'message':constantObj.messages.contentAddFailure};
          }else {
            outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.contentAddSuccess};
            res.jsonp(outputJSON);
          }          
     });
}


//**********get Category data for HTML file for updating category data********//
exports.editContent = function(req, res) {
     var outputJSON = "";     
     contentObj.findById(req.params.contentId, function(err, data) {
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
exports.updateContent = function(req, res) {
    var reqId = req.body._id;
    var myData = req.body;
    delete req.body._id;
    contentObj.update({_id:reqId},myData,function(err, data) {
        //console.log(err);return false;
        if(err) {
            outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.contentUpdateFailure};
        }
        else {
            outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.contentUpdateSuccess, 'data': data}
        }
        return res.jsonp(outputJSON);
    })
}


//**********get Category data for HTML file for updating category data********//
exports.viewContent = function(req, res) {
     var outputJSON = "";     
     contentObj.findById(req.params.contentId, function(err, data) {
          if(err) {
               outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
          }
          else {
               outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}
          }
          res.jsonp(outputJSON);
     });
}
