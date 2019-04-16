const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/client.controller');
const MovieController = require('../controllers/movie.controller');
const RateLimiter = require('../config/rate-limiter');

const limiter = new RateLimiter(router);

router.get('/', (req, res)=>{
  console.log('in home');
  res.status(200).send({status:'ok'});
});

router
  .get('/clients', limiter.usingRemoteAddress('/clients', 'get'), (req, res) => {
    // all client
    ClientController.getClients(req, res);
  })
  .post('/client', limiter.usingRemoteAddress('/client', 'post'), (req, res) => {
    // create client
    ClientController.createClient(req, res);
  })
  .post('/token', limiter.checkApiKey('/token', 'post'), (req, res) => {
    // get token for client
    ClientController.getToken(req, res);
  });

// movie route
router.get('/movies', limiter.usingRemoteAddress('/movies', 'get'), (req, res) => {
  // fetch movies
  MovieController.fetchMovies(req, res);
});

//comment route
router.post('/comment')
module.exports = router;