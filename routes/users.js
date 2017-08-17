var express = require('express');
var router = express.Router();
const passport = require('passport');

// const db = require('../db');
/* GET users listing. */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

router.get('/', ensureAuthenticated, function(req, res) {
  res.send("access granted. secure stuff happens here");
});


/* GET home page. */
router.get('/', function(req, res, next) {
  let user = '';
  if (req.isAuthenticated()) {
    user = JSON.stringify(req.user, null, 4);
  }
  res.render('users', {
    user: user,
    title: "The Swan House",
    message: "Choose a member to see their status.",
  });
});

// router.get('/auth/github', passport.authenticate('github'));

// // GitHub will call this URL
// router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
//   function(req, res) {
//     res.redirect('/');
//   }
// );


module.exports = router;

// app.get('/logout', function(req, res) {
//         req.logout(); 
//         res.redirect('/');
//     });