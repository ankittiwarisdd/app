var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var smemsgSchema = new mongoose.Schema({
  email: {type:String},
  message: {type:String},
  enable: {type: Boolean, default:true},
  is_deleted:{type:Boolean, default:false},
  createdDate:{type:Date, default: Date.now}  
});

var smemsgObj = mongoose.model('smemessages', smemsgSchema);
module.exports = smemsgObj;