var favObj = require('./../../../app/models/favourites/favourites.js');
var offerObj = require('./../../../app/models/offers/offers.js');
var consumerObj = require('./../../../app/models/consumers/consumers.js');
var constantObj = require('../../../config/constants.js');
var paginate = require("mongoose-pagination");

var geolib = require('geolib');
//For fetching LAT and LONG
var extra = {
    apiKey: 'AIzaSyAf6FtW5v1TWsFZw3iVomysv-NQSmGdat0', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};
var geocoderProvider = 'google';
var httpAdapter = 'https';
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

//***************************//
exports.addToFav = function(req, res) {
  var consumerId = req.body.consumer;
  var offerId = req.body.offer;
  var outputJSON = "";
  offerObj.find({"consumer":consumerId,"_id":offerId}).lean().exec(function(err, data1) {
    if(data1 == ""){
      offerObj.update({_id:offerId},{$push:{consumer:consumerId}},{new:true}, function (err, data) {
        if(err) {
          outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.favouriteFailure};
        }
        else{
          outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.favouriteSuccess}
        }
        res.jsonp(outputJSON);
      });
    }else{
      outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.favouriteExist};
      res.jsonp(outputJSON);      
    }
  });
}


//******************//
exports.removeFromFav = function(req, res) {
    var consumerId = req.body.consumer;
    var offerId = req.body.offer;
    var outputJSON = "";
    //consumerObj.update({_id:consumerId},{$pull: { 'offer': offerId }},function(err,data){
    offerObj.update({_id:offerId},{$pull: { 'consumer': consumerId }},function(err,data){
          if(err) {
               outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.removeFavouriteFailure};
          }
          else{
            outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.removeFavouriteSuccess}
          }
          res.jsonp(outputJSON);
     });
}


//******************//
exports.getFav = function(req, res) {
    var consumerId = req.body.consumer;
    var outputJSON = "";  
    var offset = req.body.offset;
    var limit = req.body.limit;
    var consumerlat = req.body.latitude;
    var consumerlong = req.body.longitude;  
    //console.log(consumerId);
    consumerObj.findById(consumerId,{"__v":0,"is_deleted":0,"createdDate":0,"enable":0,"category":0}, function(err, data){
      //console.log(data);return false;
      if(data.use_current_location == true){
          var zipData = data.country+","+data.postal_code;
          geocoder.geocode(zipData, function(err1, data1) {
              var consumerlat = data1[0].latitude;
              var consumerlong = data1[0].longitude;
              offerObj.find({"is_deleted":false,"consumer":{$in:[consumerId]},"enable":true},{"__v":0,"is_deleted":0,"createdDate":0,"enable":0}).populate('merchant').lean().paginate(offset, limit).exec(function(err, data1) {
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
                                if(consumerId == data1[i].consumer[attributename]){
                                  data1[i]["is_fav"] = true;
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
                        //if(distance <= radius){
                            data1[i]["distance"] = distance;
                            data3.push(data1[i]);
                        //}        
                      } 
                      outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data3}
                    }
                    res.jsonp(outputJSON);
               });
          });
      }else{
          offerObj.find({"is_deleted":false,"consumer":{$in:[consumerId]},"enable":true},{"__v":0,"is_deleted":0,"createdDate":0,"enable":0}).populate('merchant').lean().paginate(offset, limit).exec(function(err, data1) {
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
                            if(consumerId == data1[i].consumer[attributename]){
                              data1[i]["is_fav"] = true;
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
                    //if(distance <= radius){
                        data1[i]["distance"] = distance;
                        data3.push(data1[i]);
                    //}        
                  } 
                  outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data3}
                }
                res.jsonp(outputJSON);
           });
      }
    }); 
       
}