module.exports = function(app, express, passport) {
    var router = express.Router();
    var consumerObj = require('./../../app/controllers/Consumer/controller.js');
	//router.post('/authenticate', passport.authenticate('consumerlogin', {session:false}), consumerObj.authenticate);
//console.log(consumerObj);return false;
	router.post('/authenticate', supportCrossOriginScript, consumerObj.authenticate);
	router.post('/registerConsumer/', supportCrossOriginScript, consumerObj.registerConsumer);
	router.post('/forgot_password', supportCrossOriginScript, consumerObj.forgot_password);	
	router.get('/logout',consumerObj.logout);  
	router.post('/update_profile', consumerObj.update_profile);	
	router.post('/getProfile', consumerObj.getProfile);      
	router.post('/findLocations', consumerObj.findLocations);
	app.use('/consumers', router);
}

function supportCrossOriginScript(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT, HEAD, JSONP");
	next();
}