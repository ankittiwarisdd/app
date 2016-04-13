var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var downloadSchema = new mongoose.Schema({
  enable: {type: Boolean, default:true},
  is_deleted:{type:Boolean, default:false},
  consumer: {type: mongoose.Schema.Types.ObjectId, ref: 'consumers'},
  offer: {type: mongoose.Schema.Types.ObjectId, ref: 'offers'},
  createdDate:{type:Date, default: Date.now}
});

var downObj = mongoose.model('downloads', downloadSchema);
module.exports = downObj;