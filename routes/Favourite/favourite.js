module.exports = function(app, express, passport) {

  var router = express.Router();

  var favObj = require('./../../app/controllers/Favourite/controller.js');
  
  router.post('/addToFav', favObj.addToFav);
  router.post('/removeFromFav', favObj.removeFromFav); 
  router.post('/getFav', favObj.getFav);  

  app.use('/favourites', router);

}
