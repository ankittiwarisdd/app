var offerObj = require('./../../../app/models/offers/offers.js');
var subcatObj = require('./../../../app/models/subcategories/subcategories.js');
var consumerObj = require('./../../../app/models/consumers/consumers.js');
var constantObj = require('../../../config/constants.js');
var randomstring = require("randomstring");
var paginate = require("mongoose-pagination");

var geolib = require('geolib');
var dateFormat = require('dateformat');


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

var request = require('request');

//************Listing of merchants***************//
exports.listOffers = function(req, res) {	
	var outputJSON = "";	
	offerObj.find({is_deleted:false}, function(err, data) {
		if(err) {
			outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
		}
		else {
			outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}
		}
		res.jsonp(outputJSON);
	});
}

//************Listing of merchants***************//
exports.manageOffers = function(req, res) { 
  var outputJSON = "";
  var merchantId = req.params.merchantId;
  offerObj.find({is_deleted:false,merchant:merchantId}, function(err, data) {
    if(err) {
      outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
    }
    else {
      outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}
    }
    res.jsonp(outputJSON);
  });
}


exports.saveOffer = function(req,res){
  var qrcode = randomstring.generate({length: 12,charset: 'alphabetic'});
  req.body.code = qrcode;

  var str1 = req.body.from;
  req.body.from = str1.substr(0, 10);
  req.body.time_from = str1.substr(11, 18);
  var str2 = req.body.to;
  req.body.to = str2.substr(0, 10);
  req.body.time_to = str2.substr(11, 18);
    if(req.body.businessType == 1){
      req.body.businessType = "physical";
    }else if(req.body.businessType == 2){
      req.body.businessType = "ecom";
    }else{
      req.body.businessType = "both";
    }
    req.body.enable = true;
  //console.log(req.body);return false;
    var data = req.body;
    offerObj(data).save(function(err, data) { 
    //console.log(err);console.log(data);return false;       
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
          outputJSON = {'status': 'error', 'messageId':401, 'message':constantObj.messages.offerAddFailure};
        }//if
        else {
          outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.offerAddSuccess};
        }
        res.jsonp(outputJSON);
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
                uploadDir = 'public/images/offerImages';
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
exports.editOffer = function(req, res) {
     var outputJSON = "";     
     offerObj.findById(req.params.offerId, function(err, data) {
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
exports.updateOffer = function(req, res) {
    var reqId = req.body._id;
        if(req.body.businessType == 1){
          req.body.businessType = "physical";
        }else if(req.body.businessType == 2){
          req.body.businessType = "ecom";
        }else{
          req.body.businessType = "both";
        }
        var str1 = req.body.from;
        req.body.from = str1.substr(0, 10);
        req.body.time_from = str1.substr(11, 18);
        var str2 = req.body.to;
        req.body.to = str2.substr(0, 10);
        req.body.time_to = str2.substr(11, 18);
        req.body.enable = true;
        var myData = req.body;
        delete req.body._id;
        offerObj.update({_id:reqId},myData,function(err, data) {
            if(err) {
                outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.offerUpdateFailure};
            }
            else {
                outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.offerUpdateSuccess, 'data': data}
            }
            return res.jsonp(outputJSON);
        });
}

//**********delete Merchant image********//
exports.deleteImageOffer = function(req, res){
    var  fs = require('fs');
    uploadDir = 'public/images/offerImages/';
    var picName = req.body.image;
    var Id = req.body.offerId;
    //console.log(req.body);return false;
    offerObj.findOne({_id:Id}, function(err, data) {
        var pics = data.image;
        offerObj.update({_id: Id}, {$unset: {image: 1 }}, function(err, data) { 
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
exports.statusOffer = function(req, res) {
     var outputJSON = "";
     var errorCount =0;
     var inputData = req.body;
     //console.log(req.body);return false;
     for(var attributename in inputData){           
            id = inputData[attributename]._id;                      
            offerObj.findById(id, function(err, data) {
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
          outputJSON = {'status': 'error', 'messageId':402, 'message':constantObj.messages.offerStatusUpdateFailure};
     }
     else {
          outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.offerStatusUpdateSuccess};
     }
     res.jsonp(outputJSON);
}


exports.deleteOffer = function(req, res) {    
     var outputJSON = "";
     var errorCount =0;
     var inputData = req.body;
     for(var attributename in inputData){
            id = inputData[attributename]._id;                      
            offerObj.findById(id, function(err, data) {
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
          outputJSON = {'status': 'success', 'messageId':402, 'message':constantObj.messages.offerDeleteFailure};
     }
     else {
          outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.offerDeleteSuccess};
     }
     res.jsonp(outputJSON);
}


//***************************//
exports.getOfferByCat = function(req, res) {
  test={}; 
  var consumerID = req.body.consumer;
  var catID = req.body.subcategory;
  var radius = req.body.radius;
  var consumerlat = req.body.latitude;
  var consumerlong = req.body.longitude;
  var businessTypeInput = req.body.businessType;
  if(businessTypeInput == "physical"){
    businessType = ["physical","both"];
  }else if(businessTypeInput == "ecom"){
    businessType = ["ecom","both"];
  }else{
    businessType = ["physical","ecom","both"];
  }
  //console.log(businessType);return false;
  var offset = req.body.offset;
  var limit = req.body.limit;
  var outputJSON = "";
 // console.log(catID);return false;
  consumerObj.findById(consumerID,{"__v":0,"is_deleted":0,"createdDate":0,"enable":0,"category":0}, function(err, data) {
    if(data.use_current_location == true){
      //console.log("here");return false;
      var zipData = data.country+","+data.postal_code;
        geocoder.geocode(zipData, function(err1, data1) {
            var consumerlat = data1[0].latitude;
            var consumerlong = data1[0].longitude;
            var radius = req.body.radius;
            var catID = req.body.subcategory;
            if(catID == undefined){
                    offerObj.find({"enable":true,"businessType":{$in:businessType}},{"__v":0,"is_deleted":0,"createdDate":0,"enable":0}).populate('merchant').lean().paginate(offset, limit).exec(function(err, data1) {          
                      if(err) {
                        outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
                      }
                      else if(data1 == ""){
                        outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
                      }
                      else{
                        data3 = [];
                        for(var i=0; i < data1.length; i++){
                            if(data1[i].consumer){
                              for(var attributename in data1[i].consumer){
                                  if(consumerID == data1[i].consumer[attributename]){
                                    data1[i]["is_fav"]=true;
                                  }else{
                                    data1[i]["is_fav"]=false;
                                  }
                              }
                            } 
                            delete data1[i].consumer;
                            var merchantLat = data1[i].latitude;
                            var merchantLong = data1[i].longitude;
                            
                            var res1 = geolib.getDistance(
                              {latitude: consumerlat, longitude: consumerlong},
                              {latitude: merchantLat, longitude: merchantLong}
                            );

                            var distance = res1/1000;
                            if(distance <= radius){
                                data1[i]["distance"] = distance;
                                data3.push(data1[i]);
                            }     
                        }
                        test = {};
                        test.offer=new Array();
                        for(var j=0; j < data3.length; j++){
                            test.subcategory = data;
                            test.offer.push(data3[j]);
                        }             
                        if(test.offer == ""){
                          outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
                        }else{
                          outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': test};
                        }
                      }
                      res.jsonp(outputJSON);
                    });
            }else{
                  subcatObj.findById(catID,{"__v":0,"is_deleted":0,"createdDate":0,"enable":0,"category":0}, function(err, data) {
                  if(err){
                      outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
                  }else{
                    var subCatFindId = data._id;
                    offerObj.find({"subcategory":subCatFindId,"enable":true,"businessType":{$in:businessType}},{"__v":0,"is_deleted":0,"createdDate":0,"enable":0}).populate('merchant').lean().paginate(offset, limit).exec(function(err, data1) {          
                      if(err) {
                        outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
                      }
                      else if(data1 == ""){
                        outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
                      }
                      else{
                        data3 = [];
                        for(var i=0; i < data1.length; i++){
                            if(data1[i].consumer){
                              for(var attributename in data1[i].consumer){
                                  if(consumerID == data1[i].consumer[attributename]){
                                    data1[i]["is_fav"]=true;
                                  }else{
                                    data1[i]["is_fav"]=false;
                                  }
                              }
                            } 
                            delete data1[i].consumer;
                            var merchantLat = data1[i].latitude;
                            var merchantLong = data1[i].longitude;
                            
                            var res1 = geolib.getDistance(
                              {latitude: consumerlat, longitude: consumerlong},
                              {latitude: merchantLat, longitude: merchantLong}
                            );

                            var distance = res1/1000;
                            if(distance <= radius){
                                data1[i]["distance"] = distance;
                                data3.push(data1[i]);
                            }     
                        }
                        test = {};
                        test.offer=new Array();
                        for(var j=0; j < data3.length; j++){
                            test.subcategory = data;
                            test.offer.push(data3[j]);
                        }            
                        if(test.offer == ""){
                          outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
                        }else{
                          outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': test};
                        }
                      }
                      res.jsonp(outputJSON);
                    });
                  }                  
              });
            }             
        });
    }else{

      if(catID == undefined){
            offerObj.find({"enable":true,"businessType":{$in:businessType}},{"__v":0,"is_deleted":0,"createdDate":0,"enable":0}).populate('merchant').lean().paginate(offset, limit).exec(function(err, data1) {  

              if(err) {
                outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
              }
              else if(data1 == ""){
                outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
              }
              else{
                  data3 = [];
                  for(var i=0; i < data1.length; i++){
                      if(data1[i].consumer){
                        for(var attributename in data1[i].consumer){
                            if(consumerID == data1[i].consumer[attributename]){
                              data1[i]["is_fav"]=true;
                            }else{
                              data1[i]["is_fav"]=false;
                            }
                        }
                      } 
                      delete data1[i].consumer;
                      var merchantLat = data1[i].latitude;
                      var merchantLong = data1[i].longitude;
                      
                      var res1 = geolib.getDistance(
                        {latitude: consumerlat, longitude: consumerlong},
                        {latitude: merchantLat, longitude: merchantLong}
                      );

                      var distance = res1/1000;
                      if(distance <= radius){
                          data1[i]["distance"] = distance;
                          data3.push(data1[i]);
                      }     
                  }
                  test = {};
                  test.offer=new Array();
                  for(var j=0; j < data3.length; j++){
                      test.subcategory = data;
                      test.offer.push(data3[j]);
                  }            
                  if(test.offer == ""){
                    outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
                  }else{
                    outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': test};
                  }
              }
              res.jsonp(outputJSON);
            });
      }else{
            subcatObj.findById(catID,{"__v":0,"is_deleted":0,"createdDate":0,"enable":0,"category":0}, function(err, data) {
                if(err){
                    outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
                }else{
                  var subCatFindId = data._id;
                  offerObj.find({"subcategory":subCatFindId,"enable":true,"businessType":{$in:businessType}},{"__v":0,"is_deleted":0,"createdDate":0,"enable":0}).populate('merchant').lean().paginate(offset, limit).exec(function(err, data1) { 
        //console.log(data);console.log(data1);return false;    
                    if(err) {
                      outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
                    }
                    else if(data1 == ""){
                      outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
                    }
                    else{
                      data3 = [];
                      for(var i=0; i < data1.length; i++){
                          if(data1[i].consumer){
                            for(var attributename in data1[i].consumer){
                                if(consumerID == data1[i].consumer[attributename]){
                                  data1[i]["is_fav"]=true;
                                }else{
                                  data1[i]["is_fav"]=false;
                                }
                            }
                          } 
                          delete data1[i].consumer;
                          var merchantLat = data1[i].latitude;
                          var merchantLong = data1[i].longitude;

                          var res1 = geolib.getDistance(
                            {latitude: consumerlat, longitude: consumerlong},
                            {latitude: merchantLat, longitude: merchantLong}
                          );

                          var distance = res1/1000;
                          if(distance <= radius){
                              data1[i]["distance"] = distance;
                              data3.push(data1[i]);
                          }     
                      }
                      test = {};
                      test.offer=new Array();
                     // console.log(data3);
                      for(var j=0; j < data3.length; j++){
                          test.subcategory = data;
                          test.offer.push(data3[j]);
                      }    
                      //console.log(test.offer);
                      if(test.offer == ""){
                        outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
                      }else{
                        outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': test};
                      }                      
                    }
                    res.jsonp(outputJSON);
                  });
                }          
            }); 
        }
    }
  });  
}



// var funcAdd = function(data,data1){
//     test={};
//     test.offer=new Array();
//     test.offer.push(data1);
//     test.subcategory=data;
//     return test;
// }


//******************//
exports.getOffer = function(req, res) {
    var offerId = req.body.offerId;
    var outputJSON = "";  
    var offset = req.body.offset;
    var limit = req.body.limit;   
    offerObj.findById(offerId).populate('subcategory').populate('merchant').paginate(offset, limit).exec(function(err, data) {
        if(err) {
             outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
        }
        else if(data == ""){
          outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
        }
        else{
          var now = new Date();
          var firstDate = dateFormat(now, "m/d/yyyy h:MM TT");
          var secondDate =dateFormat(data.to, "m/d/yyyy ")+data.time_to;
          var date1 = new Date(firstDate);
          var date2 = new Date(secondDate);

          var secondsInAMinute = 60;
          var secondsInAnHour  = 60 * secondsInAMinute;
          var secondsInADay    = 24 * secondsInAnHour;
          
          var timeDiff = Math.abs(date2.getTime() - date1.getTime())/1000;
          var days = Math.floor(timeDiff / secondsInADay); 
        // extract hours
          var hourSeconds = timeDiff % secondsInADay;
          var hours = Math.floor(hourSeconds / secondsInAnHour);
        // extract minutes
          var minuteSeconds = hourSeconds % secondsInAnHour;
          var minutes = Math.floor(minuteSeconds / secondsInAMinute);
          if(minutes >= 30){
            var timeLeft = days+" days "+hours+" hours "+minutes+" minutes";
          }else{
            var timeLeft = days+" days "+hours+" hours";
          }
          data["time_left"] = timeLeft;
          outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}
        }
        res.jsonp(outputJSON);
    });
}