var express = require('express');
var router = express.Router();
const passport = require('passport');



router.get('/', function(req, res) {
    let user = '';
    // logged in
    if (req.isAuthenticated()) {
        res.render('login', {
        ftrlink: '/logout',
        ftrlinktext: 'Logout',
        navlink: '/logout',
        navlinktext: 'Logout',
        message1: "You are already signed in. ",
        link: '/users',
        linktext: "View your analytics."
        });
    
    } else {
        // not logged in
        res.render('login', {
        ftrlink: '/login',
        ftrlinktext: 'Login',
        navlink: '/login',
        navlinktext: 'Login',
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