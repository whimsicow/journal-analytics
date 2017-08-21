var express = require('express');
var router = express.Router();
const passport = require('passport');
const db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
     db.one(`select * from users where email = '${req.user}'`)
        .then((result) => {
            console.log(result);
            res.render('index', {
                message: "Welcome, ",
                name: result.firstname,
                pic: result.picture,
                ftrlink: '/logout',
                ftrlinktext: 'Logout',
                navlink: '/logout',
                navlinktext: 'Logout'
            });
        })
        .catch((error) => {
            res.render('index', {  
                ftrlink: '/login',
                ftrlinktext: 'Login',
                navlink: '/login',
                navlinktext: 'Login'
            });
        });
})

module.exports = router;
