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
    user = JSON.stringify(req.user, null, 4);

    res.render('users', {
        title: "The Swan House",
        name: req.user.name.givenName,
        ftrlink: '/logout',
        ftrlinktext: 'Logout',
        navlink: '/logout',
        navlinktext: 'Logout'
    });
});


module.exports = router;
