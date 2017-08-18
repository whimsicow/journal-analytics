var express = require('express');
var router = express.Router();
const passport = require('passport');
const db = require('../db');


/* GET users listing. */

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

router.get('/', ensureAuthenticated, function(req, res, next) { 
   
    db.one(`
        insert into users (email, firstname, surname, picture)
        values ('${req.user.emails[0].value}', '${req.user.name.givenName}', '${req.user.name.familyName}', '${req.user.photos[0].value}')
        on conflict (email)
        do update set (firstname, surname, picture) = ('${req.user.name.givenName}', '${req.user.name.familyName}', '${req.user.photos[0].value}')
        where users.email = '${req.user.emails[0].value}';
        select * from users where email = '${req.user.emails[0].value}';
      `)
        .then((result) => {
            res.render('users', {
                title: "Welcome",
                name: result.firstname,
                pic: result.picture,
                ftrlink: '/logout',
                ftrlinktext: 'Logout',
                navlink: '/logout',
                navlinktext: 'Logout'
            });
        })
        .catch((err) => {
            console.log(err);
            res.render('error', {
                message: err.message
            })
        })  
});


module.exports = router;
