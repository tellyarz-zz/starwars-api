const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const uuid = require('uuid/v1');
const should = chai.should();

chai.use(chaiHttp);

describe('Movies', () => {
    /*afterEach((done) => {
        // before each test, empty the client table
        // for a fresh test
        Client.client().destroyAll(function(err){
            done();
        });
    });*/

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

    describe('/GET movies', () => {
        it('it should retrieve movies', (done) => {
          chai.request(server)
              .get('/movies')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.movies.should.be.a('array');
                done();
              });
        });
    });

    
});




