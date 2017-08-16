var express = require('express');
var router = express.Router();


// const db = require('../db');
/* GET users listing. */
router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
  res.render('users', {
    title: "The Swan House",
    message: "Choose a member to see their status.",
  })
});

module.exports = router;
