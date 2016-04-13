module.exports = function(app, express, passport) {
    var router = express.Router();
    var catObj = require('./../../app/controllers/Category/controller.js');
	// router.post('/login', passport.authenticate('sellerlogin', {session:false}), sellerObj.login);
	
	router.get('/getAllCategories', catObj.getAllCategories);       
	app.use('/categories', router);
}

function supportCrossOriginScript(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT, HEAD, JSONP");
	next();
}