module.exports = function(app, express, passport) {

	var router = express.Router();

	var faqObj = require('../../app/controllers/Admin/faqs/controller.js');
	
	//router.post('/uploadSub', passport.authenticate('basic', {session:false}), subcatObj.uploadSub);
	router.post('/addFaq', passport.authenticate('basic', {session:false}), faqObj.addFaq);
	router.get('/listFaqs', passport.authenticate('basic', {session:false}), faqObj.listFaqs);	
	router.get('/editFaq/:faqId', passport.authenticate('basic', {session:false}), faqObj.editFaq);
	router.get('/viewFaq/:faqId', passport.authenticate('basic', {session:false}), faqObj.viewFaq);
	router.post('/updateFaq', passport.authenticate('basic', {session:false}), faqObj.updateFaq);
	
	app.use('/faqs', router);

}