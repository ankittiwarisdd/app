module.exports = function(app, express, passport) {

	var router = express.Router();

	var subcatObj = require('../../app/controllers/Admin/subcategories/controller.js');
	
	//router.post('/uploadSub', passport.authenticate('basic', {session:false}), subcatObj.uploadSub);
	router.post('/addSubCategory', passport.authenticate('basic', {session:false}), subcatObj.addSubCategory);
	router.get('/listSubCategories', passport.authenticate('basic', {session:false}), subcatObj.listSubCategories);	
	router.get('/editSubCategory/:subCatId', passport.authenticate('basic', {session:false}), subcatObj.editSubCategory);
	router.post('/updateSubCategory', passport.authenticate('basic', {session:false}), subcatObj.updateSubCategory);
	//router.post('/deleteSubImage', passport.authenticate('basic', {session:false}), subcatObj.deleteSubImage);
	router.post('/statusSubCategory', passport.authenticate('basic', {session:false}), subcatObj.statusSubCategory);
	router.post('/deleteSubCategory', passport.authenticate('basic', {session:false}), subcatObj.deleteSubCategory);

	router.get('/fetchlist/:catId', passport.authenticate('basic', {session:false}), subcatObj.fetchlist);

	app.use('/subcategories', router);

}