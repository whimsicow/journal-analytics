const express = require('express');
const router = express.Router();
const db = require('../db')

router.get('/events', (req, res, next) => {
  //pseudo code for db query needs teamid from tables... foreign key to events table then select * .then()
  const fakeDBData = {
    event_id: 1,
    event_date: '08-18-2017',
    team_id: 1324234,
    description: 'demo day announcement',
    method: 'tweet',
    user_id: 123143432235
  }
  console.log('got events for team from db')

  res.send(fakeDBData)
})

router.post('/event', (req, res, next) => {
  console.log('post event')
})

router.post('/picture', (req, res, next) => {
    if(!req) {
        return res.status(400).send('No files were uploaded.');
    }
    db.one(`
        select picture from users where email = '${req.body.email}';
      `)
      .then((result) => {
        res.send(result);
        })
})

router.post('/eventstore', function(req, res, next) {
    if(!req) {
        return res.status(400).send('No files were uploaded.');
    }
    console.log(req);
})

module.exports = router;
