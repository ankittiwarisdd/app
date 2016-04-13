module.exports = function(app, express, passport) {

  var router = express.Router();

  var downObj = require('./../../app/controllers/Download/controller.js');
  
  router.post('/addToDownload', downObj.addToDownload);
  router.post('/removeFromDownload', downObj.removeFromDownload); 
  router.post('/getDownload', downObj.getDownload); 
  router.get('/getSiteContent', downObj.getSiteContent);

  app.use('/downloads', router);

}
