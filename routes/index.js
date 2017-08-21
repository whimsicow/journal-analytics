var express = require('express');
var router = express.Router();
const passport = require('passport');
const db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.isAuthenticated()) {
        db.one(`select firstname, picture from users where email = '${req.user}'`)
            .then((result) => {
                res.render('index', {
                ftrlink: '/logout',
                ftrlinktext: 'Logout',
                navmessage: 'Welcome, ',
                name: result.firstname,
                pic: result.picture,
                navlink2: '/logout',
                navlinktext2: 'Logout'
                });
            })
            .catch((error) => {
                res.render('error', {  
                error: error
                });
            });
    } else {
        res.render('index', {  
            ftrlink: '/login',
            ftrlinktext: 'Login',
            navlink2: '/login',
            navlinktext2: 'Login'
        });
    }    
})

module.exports = router;
