var mongoose = require('mongoose');
var  bcrypt = require('bcryptjs');
 SALT_WORK_FACTOR = 10;
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var adminloginSchema = new mongoose.Schema({
  firstname: {type:String, required:'Please enter the firstname'},
  lastname: {type:String, required: 'Please enter the lastname'},
  email: {type: String, lowercase: true ,unique:'Email already exist', required: 'Please enter the email'},
  username: {type: String, unique: true,unique:'Username already exist' ,required: 'Please enter the username'},
  password: { type: String, select: false, required: 'Please enter the password' },
  displayName: String,
  role:{
        type: 'string',
        enum: ['Admin'],
        default:'Admin'
  },
  enable: {type: Boolean, default:false},
  is_deleted:{type:Boolean, default:false},
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdDate:{type:Date, default: Date.now}  
});

adminloginSchema.pre('save', function(next) {
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



adminloginSchema.path("email").validate(function(value) {
   var validateExpression = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
   return validateExpression.test(value);
}, "Please enter valid email address");

adminloginSchema.path("username").validate(function(value) {
  validateExpression = /^[a-zA-Z0-9]*$/;
  return validateExpression.test(value);
}, "Please enter valid username name"); 

adminloginSchema.plugin(uniqueValidator, {message: "Username already exists"});

var adminLoginObj = mongoose.model('users', adminloginSchema);
module.exports = adminLoginObj;