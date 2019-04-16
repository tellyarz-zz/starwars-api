const Client = require('../models/client.model');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

let token;

describe('Clients', () => {
    afterEach((done) => {
        // before each test, empty the client table
        // for a fresh test
        Client.client().destroyAll(function(err){
            done();
        });
    });

    beforeEach((done) => {
        let user = {"uuid":"c77428a0-5c6d-11e9-9134-17eb646773c9", "client_name":"sunday okpokor", "client_email":"sundayokpokor@gmail.com", "api_key":"khd89HYt(*-dkdfhlnqU"};
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




