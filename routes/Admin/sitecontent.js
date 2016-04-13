module.exports = function(app, express, passport) {

	var router = express.Router();

	var sitecontentObj = require('../../app/controllers/Admin/sitecontents/controller.js');
	
	//router.post('/uploadSub', passport.authenticate('basic', {session:false}), subcatObj.uploadSub);
	router.post('/addSiteContent', passport.authenticate('basic', {session:false}), sitecontentObj.addSiteContent);
	router.get('/listSiteContents', passport.authenticate('basic', {session:false}), sitecontentObj.listSiteContents);	
	router.get('/editSiteContent/:sitecontentId', passport.authenticate('basic', {session:false}), sitecontentObj.editSiteContent);
	router.get('/viewSiteContent/:sitecontentId', passport.authenticate('basic', {session:false}), sitecontentObj.viewSiteContent);
	router.post('/updateSiteContent', passport.authenticate('basic', {session:false}), sitecontentObj.updateSiteContent);
	
	app.use('/sitecontents', router);

}