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
                ftrlink: '/logout',
                ftrlinktext: 'Logout',
                navmessage: 'Welcome, ',
                name: result.firstname,
                pic: result.picture,
                navlink1: "/",
                navlinktext1: "Home",
                navlink2: '/logout',
                navlinktext2: 'Logout',
                message1: "You are already signed in. ",
                link: '/users',
                linktext: "View your analytics."
                });
            })
    
    } else {
        // not logged in
        res.render('login', {
        ftrlink: '/login',
        ftrlinktext: 'Login',
        navlink2: "/",
        navlinktext2: "Home",
        message1: "You are not currently signed in. Please ",
        link: '/auth/google',
        linktext: "sign in with Google."
        });
    }   
});

// router.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile'] }));

// router.get('/auth/google/callback', 
//   passport.authenticate('google', { 
//       successRedirect: '../users',
//       failureRedirect: '/' }));

// router.get('/logout', function(req, res) {
//   console.log('logging out');
//   req.logout();
//   res.redirect('/');
// });




module.exports = router;