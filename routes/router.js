const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/client.controller');
const MovieController = require('../controllers/movie.controller');
const CommentController = require('../controllers/comment.controller');
const CharacterController = require('../controllers/character.controller');
const RateLimiter = require('../config/rate-limiter');

const limiter = new RateLimiter(router);

router.get('/', (req, res)=>{
  res.status(200).send({status:'ok', description:'Starwars API'});
});

// client endpoints
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
router
  .post('/comment', limiter.usingRemoteAddress('/comment', 'post'), (req, res) => {
    // save comment
    CommentController.saveComment(req, res);
  })
  .get('/comments', limiter.usingRemoteAddress('/comment', 'get'), (req, res) => {
    // fetch movies
    CommentController.getMovieComments(req, res);
  });


// character route
router.get('/characters', limiter.usingRemoteAddress('/characters', 'get'), (req, res) => {
  // get movie characters
  CharacterController.getmovieCharacters(req, res);
});

module.exports = router;