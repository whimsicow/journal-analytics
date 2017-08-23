var express = require('express');
var router = express.Router();
const passport = require('passport');
const db = require('../db');

router.get('/', function(req, res) {
    // logged in
    if (req.isAuthenticated()) {
        db.one(`select firstname, picture from users where email = '${req.user}'`)
            .then((result) => {
                res.render('login', {
                navmessage: 'Welcome, ',
                name: result.firstname,
                pic: result.picture,
                navlink3: '/teammembers',
                navlinktext3: 'Team Management',
                navlink2: '/eventlist',
                navlinktext2: 'Team Events',
                navlink1: '/logout',
                navlinktext1: 'Logout',
                navlink1: "/",
                navlinktext1: "Home",
                message1: "You are already signed in. ",
                link: '/users',
                linktext: "View your analytics ",
                message2: "or ",
                link2: '/logout',
                linktext2: 'Logout'
                });
            })
    
    } else {
        // not logged in
        res.render('login', {
        navlink1: "/",
        navlinktext1: "Home",
        message1: "You are not currently signed in. Please ",
        link: '/auth/google',
        linktext: "sign in with Google."
        });
    }   
});





module.exports = router;