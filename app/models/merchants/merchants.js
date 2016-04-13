var mongoose = require('mongoose');
var  bcrypt = require('bcryptjs');
 SALT_WORK_FACTOR = 10;
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var merchantSchema = new mongoose.Schema({
  email: {type: String, lowercase: true ,unique: "Email already Exist", required: 'Please enter the email'},
  username: {type: String,unique: "Username already Exist", required: 'Please enter the username'},
  password : {type:String,required: true},
  displayName: String,
  tradingName: String,
  tradingAddress: String,
  phone: String,
  zip:String,
  city: String,
  country: {type:String, default:null},
  state: {type:String, default:null},
  latitude: {type:String, default:null},
  longitude: {type:String, default:null},
  timezone: {type:String, default:null},
  businessType:{
        type: 'string',
        enum: ['physical', 'ecom', 'both'],
        defaultsTo:'physical'
  },
  enable: {type: Boolean, default:true},
  is_deleted:{type:Boolean, default:false},
  verificationToken: String,      
  resetPasswordToken: String,
  resetPasswordExpires: Date,  
  image:{type:String, default:null},
  category: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
  subcategory: [{type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory'}],
  createdDate:{type:Date, default: Date.now}
});

merchantSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});


//custom validations

merchantSchema.path("email").validate(function(value) {
   var validateExpression = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
   return validateExpression.test(value);
}, "Please enter valid email address");

merchantSchema.path("username").validate(function(value) {
  validateExpression = /^[a-zA-Z0-9]*$/;
  return validateExpression.test(value);
}, "Please enter valid username name"); 

merchantSchema.path('phone').validate(function(value) {
  var validateExpression = /^([0-9]){5,15}$/;
  return validateExpression.test(value);
}, "Please enter valid phone");


merchantSchema.statics.serializeUser = function(merchant, done){
    done(null, merchant);
};

merchantSchema.statics.deserializeUser = function(obj, done){
    done(null, obj);
};

merchantSchema.plugin(uniqueValidator, {message: "Email already exists"});

var merchantObj = mongoose.model('merchants', merchantSchema);
module.exports = merchantObj;