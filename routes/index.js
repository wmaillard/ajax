var express = require('express');
var router = express.Router();
var Moment = require('moment-timezone');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { time: Moment().tz('America/Los_Angeles').format('MM-DD-YYYY HH:mm:ss') });
});

module.exports = router;
