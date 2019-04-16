const jwt = require('jsonwebtoken');
const config = require('../config/config');
const axios = require('axios');

class CharacterController {
    static getmovieCharacters(req, res){
        try{
            // get token and verify
            let token = req.headers['x-access-token'];
            if (!token) return res.status(401).send({ auth: false, statusCode:401, message: 'No token provided.' });
            else{
                jwt.verify(token, config.secret, function(err, decoded) {
                    if (err) return res.status(500).send({ auth: false, statusCode:500, message: 'Failed to authenticate token.' });

                    if(req.query.movie_id){
                        // if movie_id is present
                        let movieCharacters = `${config.swBaseUrl}films/${req.query.movie_id}`;
                        axios.get(movieCharacters,{ responseType: 'json' })
                        .then(function (response) { 
                            // get character list url and fetch their details
                            let characters = response.data.characters;
                            let promisedChars = characters.map(url => axios.get(url)); // or whatever
                            axios.all(promisedChars)
                            .then(function(results) {
                                // all character profile fetched
                                let allData = results.map(r => r.data);
                                let processed = allData;

                                // filter parameter found
                                if(req.query.filter && !req.query.sort){
                                    if(req.query.filter.length === 0 || req.query.filter === null){
                                        res.status(400).send({status:'failed', statusCode:400, msg:'filter parameter is empty'});
                                    }else{
                                        processed = CharacterController.filterByGender(allData, req.query.filter);                                        
                                    }
                                }
                                // filter and sort parameter found
                                if(req.query.filter && req.query.sort){
                                    let order = 'asc';
                                    if(req.query.order === 'desc') order = 'desc';
                                    processed = CharacterController.sortByKey(
                                        CharacterController.filterByGender(allData, req.query.filter), 
                                        req.query.sort
                                    );
                                }

                                if(!req.query.filter && req.query.sort){
                                    let order = 'asc';
                                    if(req.query.order === 'desc') order = 'desc';
                                    processed = CharacterController.sortByKey(
                                        allData, 
                                        req.query.sort,
                                        order
                                    );
                                }



                                if(processed){
                                    if(processed.length === 0) {
                                        res.status(404).send({status:'ok', statusCode:404, characters:[], msg:`empty result`});
                                    }else{
                                        //get metadata
                                        let meta = CharacterController.getMetaData(processed);
                                        let metadata = {                                                
                                            totalCharacters: meta.count,
                                            totalHeight: `${meta.height}(cm), ${meta.feet} feets and ${meta.inches} inches`                                                           
                                        }
                                        res.status(200).send({status:'ok', statusCode:200, metadata, characters:processed});
                                    }
                                }else{
                                    res.status(404).send({status:'ok', statusCode:404, characters:[], msg:`empty result`});
                                }
                                
                                
                            }).catch(er => {
                                res.status(500).send({status:'failed', statusCode:500, msg:er.message});
                            });
                                             
                        })
                        .catch(function (error) {
                            res.status(500).send({status:'failed', statusCode:500, msg:error.message});
                        });
                    }else{
                        res.status(400).send({status:'failed', statusCode:400, msg:'movie_id not found'});
                    }
                   
                });
            }
        }catch(e){
            res.status(500).send({status:'failed', statusCode:500, msg:e.message});
        }
    }

    static filterByGender(data, gender){
        let newFiltered = [];
        for(let i=0; i<data.length; i++){
            if(data[i].gender === gender){
                newFiltered.push(data[i]);
            }            
        }    
        return newFiltered;
    }

    static getMetaData(data){
        let tcount = data.length;
        let height = 0.0;
        // calculate height
        for(let j=0; j<data.length; j++){
            height += parseFloat(data[j].height);
        }

        // convert height(cm) to feet and inches
        let inches = (height*0.393700787).toFixed(0);
        let feet = Math.floor(inches / 12);
        inches %= 12;
        return {count:tcount, height, inches, feet};
    }

    static sortByKey(objectArray, key, order) {
        if(order === 'asc' || order === 'desc'){
            // sort by height and name
            return objectArray.sort(function(a, b) {
                let x, y;
                if(key === 'name' || key === 'gender'){
                    x = a[key].toLowerCase(); y = b[key].toLowerCase();
                }                    
                else{
                    x = parseFloat(a[key]); y = parseFloat(b[key]);
                }                    
                if(order === 'asc') return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                else return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            });
        }else{
            // invalid order
            return objectArray;
        }
        
    }
}

module.exports = CharacterController;