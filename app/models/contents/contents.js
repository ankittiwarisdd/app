var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contentSchema = new mongoose.Schema({
  name: {type:String, required:'Please enter content name'},
  description: {type:String},
  enable: {type: Boolean, default:true},
  is_deleted:{type:Boolean, default:false},
  createdDate:{type:Date, default: Date.now}  
});

var contentObj = mongoose.model('contents', contentSchema);
module.exports = contentObj;