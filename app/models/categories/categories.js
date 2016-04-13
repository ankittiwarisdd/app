var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new mongoose.Schema({
  name: {type:String, required:'Please enter category name'},  
  image:{type:String,default:null},
  enable: {type: Boolean, default:false},
  icon:{type:String,default:null},
  subcategory: [],
  is_deleted:{type:Boolean, default:false},
  createdDate:{type:Date, default: Date.now}  
});

var categoryObj = mongoose.model('categories', categorySchema);
module.exports = categoryObj;