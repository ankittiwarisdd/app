module.exports = function(app, express, passport) {

	var router = express.Router();

	var catObj = require('../../app/controllers/Admin/categories/controller.js');
	
	router.post('/upload', passport.authenticate('basic', {session:false}), catObj.upload);
	router.post('/addCategory', passport.authenticate('basic', {session:false}), catObj.addCategory);
	router.get('/listCategories', passport.authenticate('basic', {session:false}), catObj.listCategories);	
	router.get('/editCategory/:catId', passport.authenticate('basic', {session:false}), catObj.editCategory);
	router.post('/updateCategory', passport.authenticate('basic', {session:false}), catObj.updateCategory);
	router.post('/deleteImage', passport.authenticate('basic', {session:false}), catObj.deleteImage);
	router.post('/statusCategory', passport.authenticate('basic', {session:false}), catObj.statusCategory);
	router.post('/deleteCategory', passport.authenticate('basic', {session:false}), catObj.deleteCategory);

	app.use('/categories', router);

}