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
                navlink2: '/logout',
                navlinktext2: 'Logout'
            });
        })
        .catch((error) => {
            res.render('index', {  
                ftrlink: '/login',
                ftrlinktext: 'Login',
                navlink2: '/login',
                navlinktext2: 'Login'
            });
        });
})

module.exports = router;
