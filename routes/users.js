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
    db.one(`select * from users where email = '${req.user}'`)
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
});

router.post('/profile', function(req, res, next) {
    if(!req) {
        return res.status(400).send('No files were uploaded.');
    }
    db.one(`
        update users set picture = '${req.body.imageUrl}'
        where users.email = '${req.body.email}';
        select * from users where email = '${req.body.email}';
      `)
        
        .catch((err) => {
            console.log(err);
            res.render('error', {
                message: err.message
            })
        }) 
})

module.exports = router;
