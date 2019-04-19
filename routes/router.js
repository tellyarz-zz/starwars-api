const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const movieController = require('../controllers/movie.controller');
const commentController = require('../controllers/comment.controller');
const characterController = require('../controllers/character.controller');
const RateLimiter = require('../config/rate-limiter');

const limiter = new RateLimiter(router);

router.get('/', (req, res)=>{
  res.status(200).send({status:'ok', description:'Starwars API'});
});

// client endpoints
router
  .get('/clients', clientController.getClients)
  .post('/client', clientController.createClient)
  .post('/token', clientController.getToken);

// movie route
router.get('/movies', movieController.fetchMovies);

//comment route
router
  .post('/comment', commentController.saveComment)
  .get('/comments', commentController.getMovieComments);


// character route
router.get('/characters', characterController.getmovieCharacters);

module.exports = router;