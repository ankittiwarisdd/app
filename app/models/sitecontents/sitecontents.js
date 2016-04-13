var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sitecontentSchema = new mongoose.Schema({
  name: {type:String, required:'Please enter siteContent name'},
  description: {type:String},
  enable: {type: Boolean, default:true},
  is_deleted:{type:Boolean, default:false},
  createdDate:{type:Date, default: Date.now}  
});

var sitecontentObj = mongoose.model('sitecontents', sitecontentSchema);
module.exports = sitecontentObj;