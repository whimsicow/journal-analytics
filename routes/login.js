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
                title: 'Journal Analytics',
                navmessage: 'Welcome, ',
                name: result.firstname,
                pic: result.picture,
                navlink3: '/teammembers',
                navlinktext3: 'Team Management',
                navlink2: '/eventlist',
                navlinktext2: 'Team Events',
                navlink1: '/logout',
                navlinktext1: 'Logout',
                message1: "You are already signed in. ",
                link: '/users',
                linktext: "View your analytics."
                });
            })
            .catch((error) => {
                 res.render('login', {
                    title: 'Journal Analytics',
                    message1: "You are not currently signed in. Please ",
                    link: '/auth/google',
                    linktext: "sign in with Google."
                    });
            })
    
    } else {
        // not logged in
        res.render('login', {
            title: 'Journal Analytics',
            navlink1: "/",
            navlinktext1: "Home",
            message1: "You are not currently signed in. Please ",
            link: '/auth/google',
            linktext: "sign in with Google."
            });
    }   
});





module.exports = router;