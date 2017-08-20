const expect = require('chai').expect;
const Customer = require('../public/javascripts/eventrendering.js');

describe('Customers', () => {
    //expect to recieve done
    it("should be able to save to the database", (done) => {

        let myCustomer = new Customer('me', 'me@me.com', '123 me street', 'm2m2m2');
        myCustomer
            .save()
            .then((result) => {
                done();
            });
    });
    it('should be able to get a customer from the database', (done) => {
        Customer.get(1)
            .then((myCustomer) => {
                // console.log(myCustomer.name);
                // console.log(myCustomer.email);
                // console.log(myCustomer.address);
                // // mycustomer.password should be undefined because never assigned it in index.js get(id) function
                // console.log(myCustomer.password);
                //envokes done
                done();
            })
    })
    it('should save, provide an id , and then get via id', (done) => {
        let data = ['ronald mcdonald', 'r@micky-dees.com', 'everywhere', 'yum'];
        // ...data passes in data one at a time
        let c1 = new Customer(...data);
        c1.save()
            .then((result) => {
                let customer_id = result.customer_id
                Customer.get(customer_id)
                    .then((c2) => {
                        expect(c2.name).to.equal(data[0])
                        expect(c2.email).to.equal(data[1])
                        expect(c2.address).to.equal(data[2])
                        done();
                    });
            });
    });
    // detects if customer has id
    it('should have a customer_id when we retreive from db', (done) => {
        let data = ['ronald mcdonald', 'r@micky-dees.com', 'everywhere', 'yum'];
        
        let c1 = new Customer(...data);
        c1.save()
            .then((result) => {
                let customer_id = result.customer_id
                Customer.get(customer_id)
                    .then((c2) => {
                        expect(c2.customer_id).to.equal(customer_id)
                        done();
                    })
                    //heres a function to pass the error to
                    .catch(console.log);
            });
    });
    // detects if user's id exsists, if so and they want to update their name
    it('should update a user and retain the new values', (done) => {
        let data = ['ronald mcdonald', 'r@micky-dees.com', 'everywhere', 'yum'];
        let newName = 'oakley';
        let c1 = new Customer(...data);
        c1.save()
            .then((resultFromSave1) => {
                c1.customer_id = resultFromSave1.customer_id;
                // changes name
                c1.name = newName;
                // saves again
                c1.save()
                    // retrieve again
                    .then((resultFromSave2) => {
                        // grabing customer id out
                        let customer_id = resultFromSave1.customer_id
                        Customer.get(customer_id)
                        .then((c2) => {
                            //expect 
                            expect(c2.name).to.equal(newName)
                            done();
                    })
                    //heres a function to pass the error to
                    .catch(console.log);
            });
        });
    });
});