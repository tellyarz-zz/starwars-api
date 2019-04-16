const Comment = require('../models/comment.model');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const uuid = require('uuid/v1');

class CommentController { 
    static saveComment(req, res){
        try{
            // get token and verify
            let token = req.headers['x-access-token'];
            if (!token) return res.status(401).send({ auth: false, statusCode:401, message: 'No token provided.' });
            else{
                jwt.verify(token, config.secret, function(err, decoded) {
                    if (err) return res.status(500).send({ auth: false, statusCode:500, message: 'Failed to authenticate token.' });
                    
                    // add uuid and ip
                    req.body.uuid = uuid();
                    req.body.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    
                    if(req.body.message.length > 500){
                        req.body.message = req.body.message.substring(0, 497)+'...';
                    }

                    Comment.comment().create(req.body, function(err) {
                        if(err){
                            if(err.errno){
                                if(err.errno === 1062){
                                    res.status(500).send({status:'failed', statusCode:500, msg:'comment already exist'});
                                }else{
                                    res.status(500).send({status:'failed', statusCode:500, msg:err});
                                }
                            }else{
                                res.status(500).send({status:'failed', statusCode:500, msg:err});
                            }                        
                        }else{
                            res.status(200).send({status:"ok", statusCode:200, msg:'comment saved'})
                        }
                    });
                });
            }
        }catch(e){
            res.status(500).send({status:'failed', statusCode:500, msg:e.message});
        }
         
    }

    static getMovieComments(req, res){
        try{
            // get token and verify
            let token = req.headers['x-access-token'];
            if (!token) return res.status(401).send({ auth: false, statusCode:401, message: 'No token provided.' });
            else{
                jwt.verify(token, config.secret, function(err, decoded) {
                    if (err) return res.status(500).send({ auth: false, statusCode:500, message: 'Failed to authenticate token.' });
                    Comment.comment().find({where: {movie_id:parseInt(req.query.movie_id)}, order: 'id DESC'}, function(err, comment){
                        // console.log(comment);
                        if(err){
                            res.status(500).send({status:'failed', statusCode:500, msg:err});                            
                        }else{
                            res.status(200).send({status:'ok', statusCode:200, comments:comment});       
                        }            
                    });
                });
            }
        }catch(e){
            res.status(500).send({status:'failed', statusCode:500, msg:e.message});
        }
    }
}

module.exports = CommentController;