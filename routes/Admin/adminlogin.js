var passport = require('passport'),
 LocalStrategy = require('passport-local').Strategy;
module.exports = function(app, express, passport) {

	var router = express.Router();

	var adminLoginObj = require('../../app/controllers/Admin/adminlogins/adminlogins.js');
	router.post('/authenticate', passport.authenticate('adminLogin', {session:false}), adminLoginObj.authenticate);
  	router.get('/loggedin',adminLoginObj.checkloggedin);
	router.get('/logout',adminLoginObj.logout);
	router.get('/reset/:token', adminLoginObj.resetPassword);
	router.post('/forgot_password', passport.authenticate('basic', {session:false}), adminLoginObj.forgot_password);
	router.post('/resetAdminPassword', passport.authenticate('basic', {session:false}), adminLoginObj.resetAdminPassword);
	router.post('/changePassword', passport.authenticate('basic', {session:false}), adminLoginObj.changePassword);

	router.post('/auth/facebook', adminLoginObj.facebookLogin);
	router.post('/auth/twitter', adminLoginObj.twitterLogin);
	router.post('/auth/google', adminLoginObj.googeLogin);
	app.use('/adminlogin', router);

}