var express = require('express');
var router = express.Router();
const passport = require('passport');


router.get('/',
  function(req, res){
    res.render('login');
  });

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { 
      successRedirect: '/users',
      failureRedirect: '/login' }));

router.get('/logout', function(req, res) {
  console.log('logging out');
  req.logout();
  res.redirect('/login');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

// function ensureAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//       // req.user is available for use here
//       return next();
//     }

//       // denied. redirect to login
//     res.redirect('/login');
// }

// router.get('/protected', ensureAuthenticated, function(req, res) {
//   res.send("access granted. secure stuff happens here");
// });


// /* GET home page. */
// router.get('/', function(req, res, next) {
//   let user = '';
//   if (req.isAuthenticated()) {
//     user = JSON.stringify(req.user, null, 4);
//   }
//   res.render('users', {
//     title: "The Swan House",
//     message: "Choose a member to see their status.",
//   });
// });

// router.get('/auth/google', passport.authenticate('google'));

// router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/login');
//   }
// );



module.exports = router;