const Comment = require('../models/comment.model');
const uuid = require('uuid/v1');
const validator = require('validator');

/**
 * Save Movie Comment
 */
exports.saveComment = (req, res) => {
    try{
        // add uuid and ip
        req.body.uuid = uuid();
        req.body.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        
        if(req.body.message.length > 500){
            res.status(400).send({status:'failed', statusCode:400, msg:'comment character count should not be more than 500'});
        }else{
            // validate and sanitize
            if(!validator.isEmpty(req.body.message)){
                // sanitize
                req.body.message = validator.trim(req.body.message);

                // store in db
                Comment.comment().create(req.body, function(err) {
                    if(err){
                        if(err.errno){
                            if(err.errno === 1062){
                                res.status(500).send({status:'failed', statusCode:500, msg:'comment already exist'});
                            }else{
                                res.status(500).send({status:'failed', statusCode:500, msg:err.message});
                            }
                        }else{
                            res.status(500).send({status:'failed', statusCode:500, msg:err});
                        }                        
                    }else{
                        res.status(200).send({status:"ok", statusCode:200, msg:'comment saved'})
                    }
                });
            }else{
                res.status(400).send({status:'failed', statusCode:400, msg:'comment provided is not valid'});
            }
        }
    }catch(e){
        res.status(500).send({status:'failed', statusCode:500, msg:e.message});
    }        
}

/**
 * Get Movie comment
 */
exports.getMovieComments = (req, res) => {
    try{
        if(req.query.movie_id){
            Comment.comment().find({where: {movie_id:parseInt(req.query.movie_id)}, order: 'id DESC'}, function(err, comment){
                // console.log(comment);
                if(err){
                    res.status(500).send({status:'failed', statusCode:500, msg:err});                            
                }else{
                    res.status(200).send({status:'ok', statusCode:200, comments:comment});       
                }            
            });
        }else{
            res.status(500).send({status:'failed', statusCode:500, msg:'no movie id supplied see documentation'});
        }        
    }catch(e){
        res.status(500).send({status:'failed', statusCode:500, msg:e.message});
    }
}