var mongoose = require('mongoose');
var  bcrypt = require('bcryptjs');
 SALT_WORK_FACTOR = 10;
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var offerSchema = new mongoose.Schema({
  title: String, 
  time_from: { type: String},
  time_to: { type: String},
  from: { type: Date},
  to: { type: Date},
  type: { type: String, default:null},
  type_description: { type: String, default:null},
  description: { type: String},
  businessType:{
        type: 'string',
        enum: ['physical', 'ecom', 'both'],
        defaultsTo:'physical'
  },
  code:{type:String},
  qr_image:{type:String, default:null},
  publish:{type:Boolean, default:false},
  latitude: {type:String, default:null},
  longitude: {type:String, default:null},
  distance: {type: String, default:null},
  time_left: {type: String, default:null},
  enable: {type: Boolean, default:true},
  is_deleted:{type:Boolean, default:false},
  image:{type:String, default:null},
  merchant: {type: mongoose.Schema.Types.ObjectId, ref: 'merchants'},
  subcategory: {type: mongoose.Schema.Types.ObjectId, ref: 'subcategories'},
  consumer: [{type: mongoose.Schema.Types.ObjectId, ref: 'consumers'}],
  createdDate:{type:Date, default: Date.now}
});

var offerObj = mongoose.model('offers', offerSchema);
module.exports = offerObj;