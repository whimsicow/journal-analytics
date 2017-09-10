const db = require('../db')
class Event {
    constructor(description, link, date) {
        // this.blah = blah
    }
    save() {
        return db.none(`insert into events (event_date, description, method, accountname, accountid, propertyname, propertyid, email, eventlink, date_added)
        values ('${req.body.date}', '${description}', '${req.body.method}', '${req.body.accountName}', '${req.body.accountId}', '${req.body.propertyName}', '${req.body.propertyId}', '${req.user}', NULLIF('${link}',''), '${date}');
    `)        
    }

    static getByDate() {
        return db.any(`
        SELECT evs.event_date, evs.event_id, evs.description, evs.method, evs.accountname, evs.propertyname, evs.email, evs.eventlink, evs.date_added, urs.firstname, urs.picture 
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
    }
}

module.exports = Event;