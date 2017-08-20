const express = require('express');
const router = express.Router();
const db = require('../db')

router.get('/events', (req, res, next) => {
    console.log(req.body);
  db.any(`
    SELECT date(event_date), description, method, accountname, propertyname, email, eventlink from events
    where event_date::date >= '2017-06-20'
    and event_date::date <= '2017-07-02'
    and accountid = '61516060'
    and propertyid = 'UA-61516060-1'    
    order by event_date DESC;
  `)
  .then(results => {
    res.send(results)
  })
  .catch(console.log)
  });

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
    
    db.none(`insert into events (event_date, description, method, accountname, accountid, propertyname, propertyid, email, eventlink)
        values ('${req.body.date}', '${description}', '${req.body.method}', '${req.body.accountName}', '${req.body.accountId}', '${req.body.propertyName}', '${req.body.propertyId}', '${req.user}', NULLIF('${req.body.eventlink}',''));
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
