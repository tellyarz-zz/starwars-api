const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');
const commentController = require('../controllers/comment.controller');
const characterController = require('../controllers/character.controller');

router.get('/', (req, res)=>{
  res.status(200).send({status:'ok', description:'Starwars API'});
});

// movie route
router.get('/movies', movieController.fetchMovies);

//comment route
router
  .post('/comment', commentController.saveComment)
  .get('/comments', commentController.getMovieComments);


// character route
router.get('/characters', characterController.getmovieCharacters);

module.exports = router;