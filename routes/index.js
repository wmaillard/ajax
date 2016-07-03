var express = require('express');
var router = express.Router();
var Moment = require('moment-timezone');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.post('/newRecord', function(req, res, next){
	console.log(req.body);
	res.send({'success':true});
});


module.exports = router;
