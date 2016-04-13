var merchantObj = require('../../../models/merchants/merchants.js');
var constantObj = require('../../../../config/constants.js');

//For fetching LAT and LONG
var extra = {
    apiKey: 'AIzaSyAf6FtW5v1TWsFZw3iVomysv-NQSmGdat0', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};
var geocoderProvider = 'google';
var httpAdapter = 'https';
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

var ip = require('ip');
var satelize = require('satelize');

var bcrypt = require('bcryptjs');

//************Listing of merchants***************//
exports.listMerchants = function(req, res) {	
	var outputJSON = "";	
	merchantObj.find({is_deleted:false},function(err, data) {
		if(err) {
			outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
		}
		else {
			outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}
		}
		res.jsonp(outputJSON);
	});
}

var saveMerchant = function(req,res){
  //console.log(req.body);
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
          outputJSON = {'status': 'error', 'messageId':401, 'message':constantObj.messages.merchantAddFailure};
        }//if
        else {
          outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.merchantAddSuccess};
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

//************Add Merchant***************//
exports.addMerchant = function(req, res) {
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
              outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.merchantAddSuccess};
            }
            return res.jsonp(outputJSON);
        });
    });  

}


//**********Upload Merchant Profile Images********//
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

//**********get Merchant data for HTML file for updating merchant data********//
exports.editMerchant = function(req, res) {
     var outputJSON = "";     
     merchantObj.findById(req.params.merchantId, function(err, data) {
          if(err) {
               outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
          }
          else {
               outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}
          }
          res.jsonp(outputJSON);
     });
}

//**********update Merchant details********//
exports.updateMerchant = function(req, res) {
    //console.log(req.body);return false;
    geocoder.geocode(req.body.tradingAddress+', '+req.body.city, function(err, geores) {
        for(var attributename in geores){
          geores.latitude = geores[attributename].latitude; 
          geores.longitude = geores[attributename].longitude;
        }
        req.body.latitude = geores.latitude;
        req.body.longitude = geores.longitude;
        if(req.body.businessType == 1){
          req.body.businessType = "physical";
        }else if(req.body.businessType == 2){
          req.body.businessType = "ecom";
        }else{
          req.body.businessType = "both";
        }
        req.body.category = req.body.categories;
        req.body.subcategory = req.body.subcategories;
        var reqId = req.body._id;
        var myData = req.body;
        delete req.body._id;
        delete req.body.categories;
        delete req.body.subcategories;
        merchantObj.update({_id:reqId},myData,function(err, data) {
            if(err) {
                outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.merchantUpdateFailure};
            }
            else {
                outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.merchantUpdateSuccess, 'data': data}
            }
            return res.jsonp(outputJSON);
        });
    }); 
}

//**********delete Merchant image********//
exports.deleteImageMerchant = function(req, res){
    var  fs = require('fs');
    uploadDir = 'public/images/merchantProfiles/';
    var picName = req.body.image;
    var Id = req.body.merchantId;
    //console.log(req.body);return false;
    merchantObj.findOne({_id:Id}, function(err, data) {
        var pics = data.image;
        merchantObj.update({_id: Id}, {$unset: {image: 1 }}, function(err, data) { 
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

//**********Update status of Merchant********//
exports.statusMerchant = function(req, res) {
     var outputJSON = "";
     var errorCount =0;
     var inputData = req.body;
     //console.log(req.body);return false;
     for(var attributename in inputData){           
            id = inputData[attributename]._id;                      
            merchantObj.findById(id, function(err, data) {
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
     //console.log(errorCount);
     if(errorCount > 0) {
          outputJSON = {'status': 'error', 'messageId':402, 'message':constantObj.messages.merchantStatusUpdateFailure};
     }
     else {
          outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.merchantStatusUpdateSuccess};
     }
     res.jsonp(outputJSON);
}


exports.deleteMerchant = function(req, res) {    
     var outputJSON = "";
     var errorCount =0;
     var inputData = req.body;
     for(var attributename in inputData){
            id = inputData[attributename]._id;                      
            merchantObj.findById(id, function(err, data) {
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
          outputJSON = {'status': 'success', 'messageId':402, 'message':constantObj.messages.merchantDeleteFailure};
     }
     else {
          outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.categoryDeleteSuccess};
     }
     res.jsonp(outputJSON);
}


exports.changePassword = function(req, res) {

  var errorMessage = "";
  var outputJSON = "ass";
  //console.log(req.body);return false;
   if (req.body.newPassword != req.body.confirmPassword) {
         outputJSON = {'status': 'failure', 'messageId':401, 'message':"Confirm Password must math with New Password"};
         res.jsonp(outputJSON);
   }else{     
      if (req.body.oldpassword) {        
         var id = req.body.userId;
         merchantObj.findOne({_id:id},{'password':1}, function(err, data) {
          //console.log(data);return false;
            if(!err) {              
                  bcrypt.compare(req.body.oldPassword, data.password, function(err,result) {  
                  //console.log(result);return false;                      
                        if (result==false) {
                               outputJSON = {'status': 'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
                               res.jsonp(outputJSON);
                        }else{
                              data.password = req.body.newPassword;
                             // console.log(data);return false;
                              data.save(function(err, data) {                                 
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
                               
                                   outputJSON = {'status': 'failure', 'messageId':401, 'message':constantObj.messages.userPasswordUpdateFailure};
                                   res.jsonp(outputJSON);
                                 }//if
                                 else {
                                   outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.userPasswordUpdate};
                                   res.jsonp(outputJSON);
                                 }
                              });
                        }
                  });
            }else{
                outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.PasswordRequired};
                res.jsonp(outputJSON);
            }
          });
      }else{
         outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.PasswordRequired};
          res.jsonp(outputJSON);   
      }
   }
}