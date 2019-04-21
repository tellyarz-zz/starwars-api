const Comment = require('../models/comment.model');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const uuid = require('uuid/v1');
const should = chai.should();

chai.use(chaiHttp);

describe('Comments', () => {
    /*afterEach((done) => {
        // before each test, empty the client table
        // for a fresh test
        Client.client().destroyAll(function(err){
            Comment.comment().destroyAll(function(err){
                done();
            });            
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

    describe('/GET comments', () => {
        it('it should retrieve comments', (done) => {
          chai.request(server)
              .get('/comments?movie_id=1')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.comments.should.be.a('array');
                done();
              });
        });
    });

    describe('/POST comment', () => {
        let comment = {"movie_id":5, "message":"Forgive Apart..."};
        it('it should save comment', (done) => {            
          chai.request(server)
              .post('/comment')
              .send(comment)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('msg').eql('comment saved')
                done();
              });
        });
    });

    
});




