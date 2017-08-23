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
                title: 'Journal Analytics',
                navmessage: 'Welcome, ',
                name: result.firstname,
                pic: result.picture,
                navlink3: '/teammembers',
                navlinktext3: 'Team Management',
                navlink2: '/eventlist',
                navlinktext2: 'Team Events',
                navlink1: '/logout',
                navlinktext1: 'Logout'
                });
            })
            .catch((error) => {
                res.render('error', {  
                error: error
                });
            });
    } else {
        res.render('index', {
            title: 'Journal Analytics',  
            navlink1: '/login',
            navlinktext1: 'Login'
        });
    }    
})

module.exports = router;
