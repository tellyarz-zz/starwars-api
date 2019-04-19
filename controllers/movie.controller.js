const CommentModel = require('../models/comment.model');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const axios = require('axios');
/**
 * Fetch Movies for swapi.co
 * @param {Request} req 
 * @param {Response} res 
 */
exports.fetchMovies = (req, res) => {
    try{
        let token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ status:'failed', statusCode:401, msg: 'No token provided.' });
        else{
            jwt.verify(token, config.secret, function(err, decoded) {
                if (err) return res.status(500).send({ status:'failed', statusCode:500, msg: 'Failed to authenticate token.' }); 

                // now first get all comments in the database
                CommentModel.comment().find(function(err, comment){
                    if(err){
                        res.status(500).send({status:'failed', statusCode:500, msg:'Failed to process list'});
                    }else{
                        // list is available empty or not
                        // count comment
                        let movie = `${config.swBaseUrl}films/`;
                        axios.get(movie,{ responseType: 'json' })
                        .then(function (response) {                         
                            let data = normalizeMovie(response.data.results); 
                            for(let j=0; j<data.length; j++){
                                let seen = false;
                                let count = 0;
                                for(let k=0; k<comment.length; k++){
                                    if(!seen) seen = true;
                                    if(comment[k].movie_id === parseInt(data[j].id)){
                                        count += 1;
                                    }
                                }
                                if(!seen) data[j].comments = 0;
                                else{
                                    data[j].comments = count;
                                }
                            }   
                            
                            // now sort by release date earliest to newest
                            data = data.sort(function(a, b) {
                                a = new Date(a.release_date);
                                b = new Date(b.release_date);
                                return a<b ? -1 : a>b ? 1 : 0;
                            });
                            
                            res.status(200).send(
                                {status:'ok', statusCode:200, movies:data}
                            );
                                            
                        })
                        .catch(function (error) {
                            res.status(500).send({status:'failed', statusCode:500, msg:error.message});
                        });
                    }            
                });
                
            });               
        }
        
    }catch(e){
        res.status(500).send({status:'failed', statusCode:500, msg:e.message});
    }
};

const normalizeMovie = (movieData) => {
    // remove unwanted  fields
    // first get the id
    let unwanted = [
        "episode_id", "director", "producer", "created",
        "characters", "planets", "starships", "vehicles", "species", "url", "edited"
    ];
    for(let i= 0; i<movieData.length; i++){
        let stripUrl = movieData[i].url.split('/'); 
        if(stripUrl.length > 0){
            movieData[i].id = stripUrl[(stripUrl.length - 1) - 1];
            for(var ele=0;  ele<unwanted.length; ele++){
                delete movieData[i][unwanted[ele]];
            };                
        }     
    }
    return movieData;
}