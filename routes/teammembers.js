var express = require('express');
var router = express.Router();
const passport = require('passport');
const db = require('../db');

require('dotenv').config();

// Ensures users are authenticated before allowing them to access page
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

router.get('/', ensureAuthenticated, function(req, res, next) { 
    db.one(`select firstname, picture from users where email = '${req.user}'`)
        .then((result) => {
            res.render('users', {
                navmessage: 'Welcome, ',
                name: result.firstname,
                pic: result.picture,
                ftrlink: '/logout',
                ftrlinktext: 'Logout',
                navlink1: "/",
                navlinktext1: "Home",
                navlink2: '/logout',
                navlinktext2: 'Logout'
            });
        }) 
});

module.exports = router;