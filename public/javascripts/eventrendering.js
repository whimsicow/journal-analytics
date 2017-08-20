

const db = require('../../db');

//must pass in dbConfig in here!!!!

class Event {
    constructor(event_id, event_date, desc, method, email, accountname, accountid, propertyname, propertyid, eventlink) {
        this.event_id = event_id;
        this.event_date = event_date;
        this.description = desc;
        this.method = method;
        this.email = email;
        this.accountname = accountname;
        this.accoutnid = accoutnid;
        this.propertyname = propertyname;
        this.propertyid = propertyid;
        this.eventlink = eventlink;
    };
    // safe way would be to go into postgress and see what happens and copy and paste
    
    save() {
        //truthy value
        if (this.email){
            // update what?
            // update how?
                // key value pairs
            //update where?
            // 
            return db.one(`
                update events
                set
                    description=${this.description},
                    method=${this.method},
                    eventlink=${this.eventlink},
                where email=${this.email}
            `)
        } else {
            //where to insert? 
            // what to insert?
            // returning what? (if want to return)
            return db.one(`
            insert into events 
            (description, method, eventlink, email)
            values
            ('${this.description}','${this.method}', '${this.eventlink}', '${this.email}')
            returning email;
            `);    
        }
    };
    // pass in id as we are goign to search for this
    static get(email) {
        // I know I'll return something
        // arrow function protects me from this key word being redefined
        return db.one(`
            select description, method, eventlink 
                from events
                where email=${email};
        `).then((result) => {
            //result is one record
            let c = new Class();
            c.event_id = result.event_id;
            c.name = result.name;
            c.email = result.email;
            c.address = result.address;
            return c;
        })
    }
};

module.exports = Event;


