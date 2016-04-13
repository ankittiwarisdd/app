var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var faqSchema = new mongoose.Schema({
  question: {type:String, required:'Please enter question'},
  answer: {type:String},
  enable: {type: Boolean, default:true},
  is_deleted:{type:Boolean, default:false},
  createdDate:{type:Date, default: Date.now}  
});

var faqObj = mongoose.model('faqs', faqSchema);
module.exports = faqObj;