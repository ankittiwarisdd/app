module.exports = function(app, express, passport) {

	var router = express.Router();

	var contentObj = require('../../app/controllers/Admin/contents/controller.js');
	
	//router.post('/uploadSub', passport.authenticate('basic', {session:false}), subcatObj.uploadSub);
	router.post('/addContent', passport.authenticate('basic', {session:false}), contentObj.addContent);
	router.get('/listContents', passport.authenticate('basic', {session:false}), contentObj.listContents);	
	router.get('/editContent/:contentId', passport.authenticate('basic', {session:false}), contentObj.editContent);
	router.get('/viewContent/:contentId', passport.authenticate('basic', {session:false}), contentObj.viewContent);
	router.post('/updateContent', passport.authenticate('basic', {session:false}), contentObj.updateContent);
	
	app.use('/contents', router);

}