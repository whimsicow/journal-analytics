var express = require('express');
var router = express.Router();
const passport = require('passport');



router.get('/', function(req, res) {
    let user = '';
    if (req.isAuthenticated()) {
        res.render('login', {
        message1: "You are already signed in. ",
        link: '/users',
        linktext: "View your analytics."
        });
    
    } else {
        res.render('login', {
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