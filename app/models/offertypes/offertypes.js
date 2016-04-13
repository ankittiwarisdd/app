var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var offerTypeSchema = new mongoose.Schema({
  name: {type:String, required:'Please enter category name'},
  enable: {type: Boolean, default:false},
  is_deleted:{type:Boolean, default:false},
  createdDate:{type:Date, default: Date.now}  
});

var offerTypeObj = mongoose.model('offertypes', offerTypeSchema);
module.exports = offerTypeObj;