var express = require('express');
var router = express.Router();
const passport = require('passport');
const db = require('../db');

require('dotenv').config();

// Ensures users are authenticated before allowing them to access page
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

router.get('/', ensureAuthenticated, function(req, res, next) { 
    db.one(`select firstname, picture from users where email = '${req.user}'`)
        .then((result) => {
            res.render('teammembers', {
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

router.get('/search?', ensureAuthenticated, function(req, res, next) {
    if(!req.body) {
        return res.status(400).send('No files were uploaded.');
    }
    
    db.many(`
        SELECT distinct on (evs.email) evs.email, evs.accountname, urs.firstname, urs.picture 
	    from events evs
		    inner join users urs
		    on urs.email = evs.email
        where 
            evs.accountid = '${req.query.accountid}'
            and evs.propertyid = '${req.query.propertyid}'   
            order by evs.email;
    `)
        .then((result) => {
            console.log(result);
            // res.redirect('/teammembers');
        }) 

        .catch((error) => {
            console.log(error);
        })

})

module.exports = router;