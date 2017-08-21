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
    db.one(`select * from users where email = '${req.user}'`)
        .then((result) => {
            res.render('teammembers', {
                title: "Welcome",
                name: result.firstname,
                pic: result.picture,
                ftrlink: '/logout',
                ftrlinktext: 'Logout',
                navlink: '/logout',
                navlinktext: 'Logout'
            });
        }) 
});

module.exports = router;