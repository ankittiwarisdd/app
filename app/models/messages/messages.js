var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var msgSchema = new mongoose.Schema({
  email: {type:String},
  message: {type:String},
  enable: {type: Boolean, default:true},
  is_deleted:{type:Boolean, default:false},
  createdDate:{type:Date, default: Date.now}  
});

var msgObj = mongoose.model('messages', msgSchema);
module.exports = msgObj;