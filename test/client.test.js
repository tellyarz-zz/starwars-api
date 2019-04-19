const Client = require('../models/client.model');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const config = require('../config/config');
const uuid = require('uuid/v1');
const should = chai.should();

chai.use(chaiHttp);

let token;

describe('Clients', () => {
    

    beforeEach((done) => {
        let user = {"uuid":uuid(), "client_name":"sunday okpokor", "client_email":`sundayokpokor${new Date().valueOf()}@gmail.com`, "api_key":"khd89HYt(*-dkdfhlnqU"};
        chai.request(server)
            .post('/client')
            .send(user)
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    describe('/GET clients', () => {
        it('it should require authorization', (done) => {
          chai.request(server)
              .get('/clients')
              .end((err, res) => {
                    res.should.have.status(401);
                done();
              });
        });
    });

    describe('/GET clients', () => {
        it('it should retrieve client(s)', (done) => {
          chai.request(server)
              .get('/clients')
              .set('x-access-token', token)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('clients');
                done();
              });
        });
    });
});




