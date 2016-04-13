var subcatObj = require('../../../models/subcategories/subcategories.js');
var catObj = require('../../../models/categories/categories.js');
var constantObj = require('../../../../config/constants.js');

//************Listing of category***************//
exports.listSubCategories = function(req, res) {	
	var outputJSON = "";
    //console.log("here");return false;	
	subcatObj.find({is_deleted:false}, function(err, data) {
		if(err) {
			outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
		}
		else {
			outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}
		}
		res.jsonp(outputJSON);
	});
}

//************Listing of sub-category using catId***************//
exports.fetchlist = function(req, res) {  
  var outputJSON = "";
  var catId = req.params.catId;
    //console.log("here");return false; 
  subcatObj.find({is_deleted:false,category:catId}, function(err, data) {
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
exports.addSubCategory = function(req, res) {
	   var errorMessage = "";
     var outputJSON = "";
     
     var subcatObjArr = {};
     subcatObjArr.name = req.body.name;
     subcatObjArr.category = req.body.category;
     subcatObjArr.enable = true;
     subcatObj(subcatObjArr).save(function(err, data) { 
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
            outputJSON = {'status': 'error', 'messageId':401, 'message':constantObj.messages.subcategoryAddFailure};
          }else {
            subcatObjArr._id = data._id;
            catObj.update({_id:req.body.category},{$push:{subcategory:subcatObjArr}},{new:true}, function (err, data) {
                if (err) {
                    outputJSON = {'status': 'error', 'messageId':401, 'message':constantObj.messages.subcategoryAddFailure};
                    res.jsonp(outputJSON);
                }else{
                  outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.subcategoryAddSuccess};
                  res.jsonp(outputJSON);
                }
            });           
          }          
     });
}


//**********get Category data for HTML file for updating category data********//
exports.editSubCategory = function(req, res) {
     var outputJSON = ""; 
     subcatObj.findById(req.params.subCatId, function(err, data) {
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
exports.updateSubCategory = function(req, res) {
    var reqId = req.body._id;
    var myData = req.body;
    //console.log(myData);return false;
    delete req.body._id;
    subcatObj.update({_id:reqId},myData,function(err, data) {
        //console.log(err);console.log(data);return false;
        if(err) {
            outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.subCategoryUpdateFailure};
            return res.jsonp(outputJSON);
        }
        else {
          myData._id = reqId;
          if(myData.oldCategory == myData.category){
            outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.subCategoryUpdateSuccess, 'data': data};
            return res.jsonp(outputJSON);             
          }else{
            catObj.update({_id:myData.oldCategory},{$pull: { 'subcategory':{"_id":myData._id}}},function(err1,datas){
              if(err1) {
                  outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.subCategoryUpdateFailure};
                  return res.jsonp(outputJSON);
              }else{
                  delete myData.createdDate;
                  delete myData.is_deleted;
                  delete myData.oldCategory;
                  catObj.update({_id:myData.category},{$push:{subcategory:myData}},{new:true}, function (err2, datas1) {
                      if (err2) {
                        outputJSON = {'status': 'error', 'messageId':401, 'message':constantObj.messages.subCategoryUpdateFailure};
                        res.jsonp(outputJSON);
                      }else{
                        outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.subCategoryUpdateSuccess};
                        res.jsonp(outputJSON);
                      }
                  });   
              }
            });       
          }       
        }
    });

}

// //**********delete category image********//
// exports.deleteSubImage = function(req, res){
//     var  fs = require('fs');
//     uploadDir = 'public/images/sectorImages/';
//     var picName = req.body.image;
//     var Id = req.body.categoryId;
//     catObj.findOne({_id:Id}, function(err, data) {
//         var pics = data.image;
//         catObj.update({_id: Id}, {$unset: {image: 1 }}, function(err, data) { 
//                if(data.ok==1){   
//                 if(fs.existsSync(uploadDir+"/"+picName)){
//                    fs.unlink(uploadDir+"/"+picName);
//                     returnJSON = {'status':'success','messageId':200,'message':'Image removed successfully','data':data}
//                     res.json(returnJSON);
//                 }
//                }           
//         });
//     });
// }

//**********Update status of category********//
exports.statusSubCategory = function(req, res) {
     var outputJSON = "";
     var errorCount =0;
     var inputData = req.body;
     //console.log(req.body);return false;
     for(var attributename in inputData){           
            id = inputData[attributename]._id;                      
            subcatObj.findById(id, function(err, data) {
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
          outputJSON = {'status': 'error', 'messageId':402, 'message':constantObj.messages.subCategoryStatusUpdateFailure};
     }
     else {
          outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.subCategoryStatusUpdateSuccess};
     }
     res.jsonp(outputJSON);
}


exports.deleteSubCategory = function(req, res) {    
     var outputJSON = "";
     var errorCount =0;
     var inputData = req.body;
     for(var attributename in inputData){
            id = inputData[attributename]._id;                      
            subcatObj.findById(id, function(err, data) {
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
          outputJSON = {'status': 'success', 'messageId':402, 'message':constantObj.messages.subCategoryDeleteFailure};
     }
     else {
          outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.subCtegoryDeleteSuccess};
     }
     res.jsonp(outputJSON);
}