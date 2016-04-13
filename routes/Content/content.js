module.exports = function(app, express, passport) {

	var router = express.Router();

	var contentObj = require('../../app/controllers/Content/controller.js');

	router.post('/getContent', supportCrossOriginScript, contentObj.getContent);
	router.get('/getFaq', supportCrossOriginScript, contentObj.getFaq);	
	router.post('/contact', contentObj.contact);
	
	app.use('/contents', router);

}

function supportCrossOriginScript(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT, HEAD, JSONP");
	next();
}