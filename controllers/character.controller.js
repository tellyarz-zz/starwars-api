const jwt = require('jsonwebtoken');
const config = require('../config/config');
const axios = require('axios');
const validator = require('validator');

exports.getmovieCharacters = (req, res) => {
    try{
        // get movie characters
        if(req.query.movie_id){
            // if movie_id is present
            let movieCharacters = `${config.swBaseUrl}films/${req.query.movie_id}`;
            axios.get(movieCharacters,{ responseType: 'json' })
            .then(function (response) { 
                // get character list url and fetch their details
                let characters = response.data.characters;
                let fetchedCharacters = characters.map(url => axios.get(url)); 
                
                axios.all(fetchedCharacters)
                .then(function(results) {
                    // all character profile fetched
                    let allData = results.map(r => r.data);
                    let processed = allData;

                    // filter parameter found
                    if(req.query.filter && !req.query.sort){
                        if(req.query.filter.length === 0 || req.query.filter === null){
                            res.status(400).send({status:'failed', statusCode:400, msg:'filter parameter is empty'});
                        }else{
                            // make sure filter is of gender
                            if(req.query.filter === 'male' || req.query.filter === 'female'){
                                processed = filterByGender(allData, req.query.filter); 
                            }else{
                                res.status(400).send({status:'failed', statusCode:400, msg:'value of filter should be male|female'});
                                // return 0;
                            }                                                                           
                        }
                    }
                    // filter and sort parameter found
                    if(req.query.filter && req.query.sort){
                        // make sure filter is of gender
                        if(req.query.filter === 'male' || req.query.filter === 'female'){
                            // check for sort value too
                            if(validateOrderValue(req.query.order) && validateSortValue(req.query.sort)){
                                let order = 'asc';
                                if(req.query.order === 'desc') order = 'desc';
                                processed = sortByKey(
                                    filterByGender(allData, req.query.filter), 
                                    req.query.sort
                                ); 
                            }else{
                                res.status(400).send({stauts:'failed', statusCode:400, 'msg':'invalid parameter values'});
                            }
                            
                        }else{
                            console.log('bad filter');
                            res.status(400).send({status:'failed', statusCode:400, msg:'value of filter should be male|female'});
                            // return 0;
                        }
                        
                    }

                    if(!req.query.filter && req.query.sort){
                        if(validateOrderValue(req.query.order) && validateSortValue(req.query.sort)){
                            let order = 'asc';
                            if(req.query.order === 'desc') order = 'desc';
                            processed = sortByKey(
                                allData, 
                                req.query.sort,
                                order
                            );
                        }else{
                            res.status(400).send({stauts:'failed', statusCode:400, 'msg':'invalid parameter values'});
                        }
                        
                    }



                    if(processed){
                        if(processed.length === 0) {
                            res.status(404).send({status:'ok', statusCode:404, characters:[], msg:`empty result`});
                        }else{
                            //get metadata
                            let meta = getMetaData(processed);
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
    }catch(e){
        res.status(500).send({status:'failed', statusCode:500, msg:e.message});
    }
};

/**
 * Filter collection by gender
 * @param {*} data 
 * @param {*} gender 
 */
const filterByGender = (data, gender) => {
    let newFiltered = [];
    newFiltered = data.filter(value => (value.gender === gender));
    return newFiltered;
}

/**
 * Get Metadata
 * @param {*} data 
 */
const getMetaData = (data) => {
    let tcount = data.length;
    let height = 0.0;
    // calculate height
    data.forEach(function(value) {
        height += parseFloat(value.height);
    });
    

    // convert height(cm) to feet and inches
    let inches = (height*0.393700787).toFixed(0);
    let feet = Math.floor(inches / 12);
    inches %= 12;
    inches = inches.toFixed(2);
    return {count:tcount, height, inches, feet};
}

/**
 * Sort collection by key
 * @param {*} objectArray 
 * @param {*} key 
 * @param {*} order 
 */
const sortByKey = (objectArray, key, order) => {
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

/**
 * validate sort value
 * @param {String} sort 
 */
const validateSortValue = (sort) => {
    let sortValues = ['name', 'gender', 'height'];
    if(sortValues.includes(sort)){
        return true;
    }else{
        return false;
    }
}

/**
 * validate order value
 * @param {String} order 
 */
const validateOrderValue = (order) => {
    if(["asc", "desc"].includes(order)) return true;
    else return false;
}
