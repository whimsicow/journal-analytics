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
    if (res['id_token']) {
        console.log(res['id_token']);
    }
    
    res.render('users', {
        title: "Welcome",
        name: req.user.name.givenName,
        pic: req.user.photos[0]['value'],
        ftrlink: '/logout',
        ftrlinktext: 'Logout',
        navlink: '/logout',
        navlinktext: 'Logout'
    });
});


module.exports = router;
