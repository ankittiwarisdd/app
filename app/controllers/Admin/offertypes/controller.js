var offerTypeObj = require('../../../models/offertypes/offertypes.js');
var constantObj = require('../../../../config/constants.js');

//************Listing of category***************//
exports.listOfferTypes = function(req, res) {	
	var outputJSON = "";
    //console.log("here");return false;	
	offerTypeObj.find({is_deleted:false}, function(err, data) {
		if(err) {
			outputJSON = {'status':'error', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
		}
		else {
			outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}
		}
		res.jsonp(outputJSON);
	});
}

//************Add Category***************//
exports.addOfferType = function(req, res) {
	 var errorMessage = "";
     var outputJSON = "";

     var ObjArr = {};
     ObjArr.name = req.body.name;
     ObjArr.enable = true;

     offerTypeObj(ObjArr).save(function(err, data) { 
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
            outputJSON = {'status': 'error', 'messageId':401, 'message':constantObj.messages.offerTypeAddFailure};
          }else {
            outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.offerTypeAddSuccess};
            res.jsonp(outputJSON);
          }          
     });
}


//**********get Category data for HTML file for updating category data********//
exports.editOfferType = function(req, res) {
     var outputJSON = "";     
     offerTypeObj.findById(req.params.offertypeId, function(err, data) {
          if(err) {
               outputJSON = {'status':'error', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
          }
          else {
               outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}
          }
          res.jsonp(outputJSON);
     });
}

//**********update category details********//
exports.updateOfferType = function(req, res) {
    var reqId = req.body._id;
    var myData = req.body;
    delete req.body._id;
    offerTypeObj.update({_id:reqId},myData,function(err, data) {
        //console.log(err);return false;
        if(err) {
            outputJSON = {'status':'error', 'messageId':401, 'message': constantObj.messages.offerTypeUpdateFailure};
        }
        else {
            outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.offerTypeUpdateSuccess, 'data': data}
        }
        return res.jsonp(outputJSON);
    })
}


//**********Update status of category********//
exports.statusOfferType = function(req, res) {
     var outputJSON = "";
     var errorCount =0;
     var inputData = req.body;
     //console.log(req.body);return false;
     for(var attributename in inputData){           
            id = inputData[attributename]._id;                      
            offerTypeObj.findById(id, function(err, data) {
               if(err) {
                    errorCount++;
               }
               else {
                    data.enable = inputData[attributename].enable;
                    data.save(function(err, data) {
                         if(err) {
                              errorCount++;
                         }                         
                    });
               }               
            });
     }
     if(errorCount > 0) {
          outputJSON = {'status': 'error', 'messageId':401, 'message':constantObj.messages.offerTypeStatusUpdateFailure};
     }
     else {
          outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.offerTypeStatusUpdateSuccess};
     }
     res.jsonp(outputJSON);
}


exports.deleteOfferType = function(req, res) {    
     var outputJSON = "";
     var errorCount =0;
     var inputData = req.body;
     for(var attributename in inputData){
            id = inputData[attributename]._id;                      
            offerTypeObj.findById(id, function(err, data) {
               if(err) {
                    errorCount++;
               }
               else {
                    data.is_deleted = inputData[attributename].is_deleted;
                    data.save(function(err, data) {
                         if(err) {
                              errorCount++;
                         }                         
                    });
               }               
            });
     }
     if(errorCount > 0) {
          outputJSON = {'status': 'error', 'messageId':401, 'message':constantObj.messages.offerTypeDeleteFailure};
     }
     else {
          outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.offerTypeDeleteSuccess};
     }
     res.jsonp(outputJSON);
}