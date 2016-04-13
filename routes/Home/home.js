module.exports = function(app, express, passport) {
    var router = express.Router();
    var homeObj = require('./../../app/controllers/Home/controller.js');
	// router.post('/login', passport.authenticate('sellerlogin', {session:false}), sellerObj.login);
	 router.get('/home', homeObj.home);
	// router.post('/updatePassword', sellerObj.updatePassword);
	// router.post('/changePassword', sellerObj.changePassword);
	//console.log('here'); return false;
      router.get('/getSubCat/:catId', homeObj.getSubCat);
	  router.get('/getOffer/:offerId', homeObj.getOffer);
	  router.post('/sendSmeMessage', homeObj.sendSmeMessage);
	// router.post('/reset/:token', sellerObj.updatePassword);        
	app.use('/', router);
}