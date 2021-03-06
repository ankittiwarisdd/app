module.exports = function(app, express, passport) {

	var router = express.Router();

	var merchantObj = require('../../app/controllers/Admin/merchants/controller.js');
	console.log('inside admin');
	router.post('/upload', passport.authenticate('basic', {session:false}), merchantObj.upload);
	router.post('/addMerchant', passport.authenticate('basic', {session:false}), merchantObj.addMerchant);
	router.get('/listMerchants', passport.authenticate('basic', {session:false}), merchantObj.listMerchants);	
	router.get('/editMerchant/:merchantId', passport.authenticate('basic', {session:false}), merchantObj.editMerchant);
	router.post('/deleteImageMerchant', passport.authenticate('basic', {session:false}), merchantObj.deleteImageMerchant);
	router.post('/statusMerchant', passport.authenticate('basic', {session:false}), merchantObj.statusMerchant);
	router.post('/deleteMerchant', passport.authenticate('basic', {session:false}), merchantObj.deleteMerchant);
	router.post('/updateMerchant', passport.authenticate('basic', {session:false}), merchantObj.updateMerchant);
	router.get('/getCountry/:country', passport.authenticate('basic', {session:false}), merchantObj.getCountry);
	router.post('/changePassword', passport.authenticate('basic', {session:false}), merchantObj.changePassword);

	app.use('/merchants', router);

} 