module.exports = function(app, express, passport) {
    var router = express.Router();
    var merchantObj = require('./../../app/controllers/Merchant/controller.js');
	// router.post('/login', passport.authenticate('sellerlogin', {session:false}), sellerObj.login);
	router.post('/uploadPic', passport.authenticate('basic', {session:false}), merchantObj.uploadPic);
	router.post('/authenticate', passport.authenticate('merchantlogin', {session:false}), merchantObj.authenticate);
	router.post('/registerMerchant', passport.authenticate('basic', {session:false}), merchantObj.registerMerchant);	
	router.get('/logout',merchantObj.logout);
	router.get('/reset/:token', merchantObj.resetPassword);
	router.post('/forgot_password', passport.authenticate('basic', {session:false}), merchantObj.forgot_password);
	router.post('/resetMerchantPassword', passport.authenticate('basic', {session:false}), merchantObj.resetMerchantPassword);
	router.post('/findSubCategory', passport.authenticate('basic', {session:false}), merchantObj.findSubCategory);
	router.get('/findLatLong/:merchantId', passport.authenticate('basic', {session:false}), merchantObj.findLatLong);
	router.get('/getDashCount/:currentUserId',passport.authenticate('basic',{session:false}),merchantObj.getDashCount);
	router.get('/getFrontCountry/:country', passport.authenticate('basic', {session:false}), merchantObj.getFrontCountry);
	app.use('/merchants', router);
}