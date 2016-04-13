module.exports = function(app, express, passport) {

	var router = express.Router();

	var offerObj = require('./../../app/controllers/Offer/controller.js');
	
	router.post('/upload', passport.authenticate('basic', {session:false}), offerObj.upload);
	router.post('/saveOffer/', passport.authenticate('basic', {session:false}), offerObj.saveOffer);
	router.get('/listOffers', passport.authenticate('basic', {session:false}), offerObj.listOffers);	
	router.get('/editOffer/:offerId', passport.authenticate('basic', {session:false}), offerObj.editOffer);
	router.post('/deleteImageOffer/', passport.authenticate('basic', {session:false}), offerObj.deleteImageOffer);
	router.post('/statusOffer', passport.authenticate('basic', {session:false}), offerObj.statusOffer);
	router.post('/deleteOffer', passport.authenticate('basic', {session:false}), offerObj.deleteOffer);
	router.post('/updateOffer', passport.authenticate('basic', {session:false}), offerObj.updateOffer);

	router.get('/manageOffers/:merchantId', passport.authenticate('basic', {session:false}), offerObj.manageOffers);

	router.post('/getOfferByCat', offerObj.getOfferByCat);
	router.post('/getOffer', offerObj.getOffer);
	

	app.use('/offers', router);

}
