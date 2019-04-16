const Client = require('../models/client.model');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const axios = require('axios');
const util = require('util');

class MovieController {
    /**
     * Fetch Movies for swapi.co
     * @param {Request} req 
     * @param {Response} res 
     */
    static fetchMovies(req, res){
        try{
            let token = req.headers['x-access-token'];
            if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
            else{
                let movie = `${config.swBaseUrl}films/`;
                axios.get(movie,{ responseType: 'json' })
                .then(function (response) {
                    let data = MovieController.normalizeMovie(response.data.results);
                    res.status(200).send(
                        {status:'ok', statusCode:200, movies:data}
                    );
                })
                .catch(function (error) {
                    res.status(500).send({status:'failed', statusCode:500, msg:error.message});
                });
            }
            
        }catch(e){
            res.status(500).send({status:'failed', statusCode:500, msg:e.message});
        }
    }

    static normalizeMovie(movieData){
        // remove unwanted  fields
        // first get the id
        let unwanted = [
            "episode_id", "director", "producer", "release_date", "created",
            "characters", "planets", "starships", "vehicles", "species", "url", "edited"
        ];
        for(let i= 0; i<movieData.length; i++){
            let stripUrl = movieData[i].url.split('/'); 
            if(stripUrl.length > 0){
                movieData[i].id = stripUrl[(stripUrl.length - 1) - 1];
            }
            // iterate over unwanted list and remove
            for(var ele=0;  ele<unwanted.length; ele++){
                console.log(unwanted[ele]);
                delete movieData[i][unwanted[ele]];
            };
            
        }
        return movieData;
    }
}

module.exports = MovieController;