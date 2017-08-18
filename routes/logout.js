var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get('/', function(req, res) {
  console.log('logging out');
  req.logout();
  res.redirect('/login');
});

module.exports = router;
