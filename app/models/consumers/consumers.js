var mongoose = require('mongoose');
var  bcrypt = require('bcryptjs');
 SALT_WORK_FACTOR = 10;
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var consumerSchema = new mongoose.Schema({
  email: {type: String, lowercase: true ,unique: "Email already Exist", required: 'Please enter the email'},
  password : {type:String,required: true}, //added on 29032016 by manishp
  latitude: {type:String, default:null},
  longitude: {type:String, default:null},
  timezone: {type:String, default:null},
  enable: {type: Boolean, default:true},
  use_current_location: {type: Boolean, default:false},
  distance : {type:String, default:10},
  postal_code : {type:String, default:null},  
  country : {type:String, default:null},
  //offer: [{type: mongoose.Schema.Types.ObjectId, ref: 'offers'}],
  is_deleted:{type:Boolean, default:false},
  createdDate:{type:Date, default: Date.now}
});

consumerSchema.pre('save', function(next) {
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

consumerSchema.path("email").validate(function(value) {
   var validateExpression = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
   return validateExpression.test(value);
}, "Please enter valid email address");


consumerSchema.statics.serializeUser = function(consumer, done){
    done(null, consumer);
};

consumerSchema.statics.deserializeUser = function(obj, done){
    done(null, obj);
};

consumerSchema.plugin(uniqueValidator, {message: "Email already exists"});

var consumerObj = mongoose.model('consumers', consumerSchema);
module.exports = consumerObj;