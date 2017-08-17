var express = require('express');
var router = express.Router();
const passport = require('passport');

// const db = require('../db');
/* GET users listing. */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

router.get('/', ensureAuthenticated, function(req, res) {
    let user = '';
    if (req.isAuthenticated()) {
        user = JSON.stringify(req.user, null, 4);
        console.log(user);
    }
    res.render('users', {
        title: "The Swan House"
    });
});



module.exports = router;
