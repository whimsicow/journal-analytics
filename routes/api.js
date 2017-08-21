const express = require('express');
const router = express.Router();
const moment = require('moment');
const db = require('../db')

function dateSifter(date) {
    if (date === "0daysAgo") {
        date = moment().format('YYYY-MM-DD');
        return date;
    } else if (date === "7daysAgo") {
        date = moment().subtract(7, 'days').format('YYYY-MM-DD');
        return date;
    } else if (date === "30daysAgo") {
        date = moment().subtract(30, 'days').format('YYYY-MM-DD');
        return date;
    } else {
        return date;
    }
}

router.post('/events', (req, res, next) => {
    var startdate = dateSifter(req.body.startdate);
    var enddate = dateSifter(req.body.enddate);
    
    db.any(`
    SELECT evs.event_date, evs.description, evs.method, evs.accountname, evs.propertyname, evs.email, evs.eventlink, evs.date_added, urs.firstname, urs.picture 
	from events evs
		inner join users urs
		on urs.email = evs.email
    where 
    	evs.event_date::date >= '${startdate}'
    	and evs.event_date::date <= '${enddate}'
    	and evs.accountid = '${req.body.accountid}'
    	and evs.propertyid = '${req.body.propertyid}'    
    	order by evs.event_date DESC;
    `)
    .then(results => {
        res.send(results)
    })
    .catch((err) => {
        console.log(err);
    })
})

// Store larger image provided by google analytics auth
router.post('/picture', (req, res, next) => {
    if(!req.body) {
        return res.status(400).send('No information provided.');
    }
    db.one(`
        select picture from users where email = '${req.body.email}';
      `)
      .then((result) => {
        res.send(result);
        })
})

// Store an event in database upon form submission
router.post('/eventstore', function(req, res, next) {
    if(!req.body) {
        return res.status(400).send('No information provided.');
    }
    
    var description = req.body.description;
    description = description.replace("'", "''");
    var date = moment().utc(-240);
    
    db.none(`insert into events (event_date, description, method, accountname, accountid, propertyname, propertyid, email, eventlink, date_added)
        values ('${req.body.date}', '${description}', '${req.body.method}', '${req.body.accountName}', '${req.body.accountId}', '${req.body.propertyName}', '${req.body.propertyId}', '${req.user}', NULLIF('${req.body.eventlink}',''), '${date}');
    `)
        .then((result) => {
            res.status(202).send('<span class="status-msg">Thank you! Your event has been added.</span>');
            res.end();
        }) 

        .catch((err) => {
            res.status(500).send('<span class="status-msg">Sorry, your event could not be added at this time. Please try again.</span>');
            res.end();
        })
})

module.exports = router;
