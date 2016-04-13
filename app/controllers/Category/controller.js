var catObj = require('./../../../app/models/categories/categories.js');
var subcatObj = require('./../../../app/models/subcategories/subcategories.js');    //Calling Object
var constantObj = require('../../../config/constants.js');  //Calling constant messages for session flash statements

//authenticate
exports.getAllCategories = function(req, res) {
  var outputJSON = "";
  catObj.find({is_deleted:false,enable:true, subcategory: { $exists: true, $ne: [] }}, function(err, data) {
    if(err) {
      outputJSON = {'status':'failure', 'messageId':401, 'message': constantObj.messages.errorRetreivingData};
      res.jsonp(outputJSON);
    }
    else {
      outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}
      res.jsonp(outputJSON); 
    }
  });
}

