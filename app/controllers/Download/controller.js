var downObj = require('./../../../app/models/downloads/downloads.js');
var offerObj = require('./../../../app/models/offers/offers.js');
var sitecontentObj = require('./../../../app/models/sitecontents/sitecontents.js');
var consumerObj = require('./../../../app/models/consumers/consumers.js');
var constantObj = require('../../../config/constants.js');
var paginate = require("mongoose-pagination");


//***************************//
exports.addToDownload = function(req, res) {
  var consumerId = req.body.consumer;
  var offerId = req.body.offer;
  var outputJSON = req.body;
  var myData = req.body;
  downObj.find({"consumer":consumerId,"offer":offerId}).lean().exec(function(err, data1) {
    if(data1 == ""){
      downObj(myData).save(function(err, data) {
        if(err) {
          outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.downloadFailure};
        }
        else{
          outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.downloadSuccess}
        }
        res.jsonp(outputJSON);
      });
    }else{
      outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.downloadExist};
      res.jsonp(outputJSON);      
    }
  });
}


//******************//
exports.removeFromDownload = function(req, res) {
    var consumerId = req.body.consumer;
    var offerId = req.body.offer;
    var outputJSON = "";
    //consumerObj.update({_id:consumerId},{$pull: { 'offer': offerId }},function(err,data){
    downObj.update({'consumer': consumerId, "offer": offerId},{$set:{is_deleted:true}},function(err,data){
		if(err) {
			outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.removedownloadFailure};
		}
		else{
			outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.removedownloadSuccess}
		}
		res.jsonp(outputJSON);
     });
}


//******************//
exports.getDownload = function(req, res) {
    var consumerId = req.body.consumer;
    var outputJSON = "";
    var offset = req.body.offset;
    var limit = req.body.limit;
    //console.log(consumerId);
    downObj.find({"is_deleted":false,"consumer":consumerId,"enable":true},{"__v":0,"is_deleted":0,"createdDate":0,"enable":0}).populate('consumer').populate('offer').paginate(offset, limit).lean().exec(function(err, data1) {
          if(err) {
              outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
          }
          else if(data1 == ""){
              outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
          }
          else{
            outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data1}
          }
          res.jsonp(outputJSON);
     });
}


//******************//
exports.getSiteContent = function(req, res) {
    var outputJSON = "";    
    //console.log(consumerId);
    sitecontentObj.find({"is_deleted":false,"enable":true},{"__v":0,"is_deleted":0,"createdDate":0,"enable":0}).populate('consumer').populate('offer').lean().exec(function(err, data1) {
          if(err) {
              outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
          }
          else if(data1 == ""){
              outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
          }
          else{
              outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data1};
          }
          res.jsonp(outputJSON);
     });
}