const express = require('express');
const router = express.Router();
const db = require('../db')

router.get('/events', (req, res, next) => {
  //pseudo code for db query needs teamid from tables... foreign key to events table then select * .then()
  // const fakeDBData = {
  //   event_id: 1,
  //   event_date: '08-18-2017',
  //   team_id: 1324234,
  //   description: 'demo day announcement',
  //   method: 'tweet',
  //   user_id: 123143432235
  // }
  db.query(`
    SELECT *
      from events
    order by event_date
  `)
  .then(results => {
    res.send(results)
  })
  .catch(console.log)
  });

router.post('/event', (req, res, next) => {
  console.log('post event')
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
    db.none(`insert into events (event_date, description, method, email)
        values ('${req.body.date}', '${description}', '${req.body.method}', '${req.user}');
    `)
        .catch((err) => {
            console.log(err);
            res.render('error', {
                message: err.message
            })
        }) 
})

module.exports = router;
