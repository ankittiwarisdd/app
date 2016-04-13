var catObj = require('../../../models/categories/categories.js');
var constantObj = require('../../../../config/constants.js');

//************Listing of category***************//
exports.listCategories = function(req, res) {	
	var outputJSON = "";
    //console.log("here");return false;	
	catObj.find({is_deleted:false}, function(err, data) {
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
exports.addCategory = function(req, res) {
	 var errorMessage = "";
     var outputJSON = "";

     var catObjArr = {};
     catObjArr.name = req.body.name;
     catObjArr.image = req.body.image;
     catObjArr.icon = req.body.icon;
     catObjArr.enable = true;

     catObj(catObjArr).save(function(err, data) { 
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
            outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.categoryAddFailure};
          }else {
            outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.categoryAddSuccess};
            res.jsonp(outputJSON);
          }          
     });
}

//**********Upload Category Images********//
exports.upload = function(req, res){
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
                uploadDir = 'public/images/sectorImages';
                
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

//**********get Category data for HTML file for updating category data********//
exports.editCategory = function(req, res) {
     var outputJSON = "";     
     catObj.findById(req.params.catId, function(err, data) {
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
exports.updateCategory = function(req, res) {
    var reqId = req.body._id;
    var myData = req.body;
    delete req.body._id;
    catObj.update({_id:reqId},myData,function(err, data) {
        //console.log(err);return false;
        if(err) {
            outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.categoryUpdateFailure};
        }
        else {
            outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.categoryUpdateSuccess, 'data': data}
        }
        return res.jsonp(outputJSON);
    })
}

//**********delete category image********//
exports.deleteImage = function(req, res){
    var  fs = require('fs');
    uploadDir = 'public/images/sectorImages/';
    var picName = req.body.image;
    var Id = req.body.categoryId;
    catObj.findOne({_id:Id}, function(err, data) {
        var pics = data.image;
        catObj.update({_id: Id}, {$unset: {image: 1 }}, function(err, data) { 
               if(data.ok==1){   
                if(fs.existsSync(uploadDir+"/"+picName)){
                   fs.unlink(uploadDir+"/"+picName);
                    returnJSON = {'status':'success','messageId':200,'message':'Image removed successfully','data':data}
                    res.json(returnJSON);
                }
               }           
        });
    });
}

//**********Update status of category********//
exports.statusCategory = function(req, res) {
     var outputJSON = "";
     var errorCount =0;
     var inputData = req.body;
     //console.log(req.body);return false;
     for(var attributename in inputData){           
            id = inputData[attributename]._id;                      
            catObj.findById(id, function(err, data) {
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
          outputJSON = {'status': 'error', 'messageId':402, 'message':constantObj.messages.categoryStatusUpdateFailure};
     }
     else {
          outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.categoryStatusUpdateSuccess};
     }
     res.jsonp(outputJSON);
}


exports.deleteCategory = function(req, res) {    
     var outputJSON = "";
     var errorCount =0;
     var inputData = req.body;
     for(var attributename in inputData){
            id = inputData[attributename]._id;                      
            catObj.findById(id, function(err, data) {
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
          outputJSON = {'status': 'success', 'messageId':402, 'message':constantObj.messages.categoryDeleteFailure};
     }
     else {
          outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.categoryDeleteSuccess};
     }
     res.jsonp(outputJSON);
}