var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new mongoose.Schema({
  name: {type:String, required:'Please enter sub-category name'},
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
  enable: {type: Boolean, default:false},
  is_deleted:{type:Boolean, default:false},
  createdDate:{type:Date, default: Date.now}  
});

var subcategoryObj = mongoose.model('subcategories', categorySchema);
module.exports = subcategoryObj;