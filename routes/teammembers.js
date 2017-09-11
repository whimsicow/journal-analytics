var express = require('express');
var router = express.Router();
const passport = require('passport');
const db = require('../db');
const ensureAuthenticated = require('../utils').ensureAuthenticated;

require('dotenv').config();

// Ensures users are authenticated before allowing them to access page
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.redirect('/login');
// }

router.get('/', ensureAuthenticated, function(req, res) { 
    db.one(`select firstname, picture from users where email = '${req.user}'`)
        .then((result) => {
            res.render('teammembers', {
                title: 'Journal Analytics',
                navmessage: 'Welcome, ',
                name: result.firstname,
                pic: result.picture,
                navlink2: '/eventlist',
                navlinktext2: 'Team Events',
                navlink1: '/logout',
                navlinktext1: 'Logout'
            });
        })
        .catch((error) => {
            res.redirect('/login');
        }) 
});

router.get('/search?', ensureAuthenticated, function(req, res, next) {
    if(!req.body) {
        return res.status(400).send('No files were uploaded.');
    }
    
    db.any(`
        SELECT distinct on (evs.email) evs.email, evs.accountname, urs.firstname, urs.picture 
	    from events evs
		    inner join users urs
		    on urs.email = evs.email
        where 
            evs.accountid = '${req.query.accountid}'
            and evs.propertyid = '${req.query.propertyid}'   
            order by evs.email ASC;
    `)
        .then((result) => {
            res.send(result);
        })  

        .catch((error) => {
            res.status(404).send(`<p class="event-error">Server connection error. Please try your search again later.</p>`)
        })

})

module.exports = router;