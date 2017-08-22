//setup
var express = require('express');
var router = express.Router();
const passport = require('passport');
const db = require('../db');

// gets all information not submitted to github in .env file
//database/hostname etc
require('dotenv').config();

// Ensures users are authenticated before allowing them to access page
// native to passport
// returns next: what we write after this
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
  }

// 
router.get('/', ensureAuthenticated, function(req, res) {
    db.one(`select firstname, picture from users where email = '${req.user}'`)
    .then((result) => {
        res.render('teamevents', {
            navmessage: 'Welcome, ',
            ftrlink: '/logout',
            ftrlinktext: 'Logout',
            navlink1: "/",
            navlinktext1: "Home",
            navlink2: '/logout',
            navlinktext2: 'Logout',
            members: result
        });
    }) 
});

router.get('/delete/:id', ensureAuthenticated, function(req, res, next) {
    db.none(`
    DELETE from events
    where event_id=${req.params.id};
    `)
     .then((result) => {
            res.status(202).send('success');
        })
      .catch((err) => {
          res.status(500).send(`<p class="event-error">Server connection error. Your event could not be removed at this time. Please try again later.</p>`);
      })
})

router.post('/:id/edit', function(req, res, next) {

})


module.exports = router;