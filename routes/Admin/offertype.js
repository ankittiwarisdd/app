module.exports = function(app, express, passport) {

	var router = express.Router();

	var catObj = require('../../app/controllers/Admin/offertypes/controller.js');
	
	router.post('/addOfferType', passport.authenticate('basic', {session:false}), catObj.addOfferType);
	router.get('/listOfferTypes', passport.authenticate('basic', {session:false}), catObj.listOfferTypes);	
	router.get('/editOfferType/:offertypeId', passport.authenticate('basic', {session:false}), catObj.editOfferType);
	router.post('/updateOfferType', passport.authenticate('basic', {session:false}), catObj.updateOfferType);
	router.post('/statusOfferType', passport.authenticate('basic', {session:false}), catObj.statusOfferType);
	router.post('/deleteOfferType', passport.authenticate('basic', {session:false}), catObj.deleteOfferType);

	app.use('/offertypes', router);

}