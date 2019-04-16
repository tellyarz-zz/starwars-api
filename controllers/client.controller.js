const Client = require('../models/client.model');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

class ClientController {
    // get all clients
    static getClients(req, res){
        // get token and verify
        let token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
        else{
            jwt.verify(token, config.secret, function(err, decoded) {
                if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });        
    
                Client.client().find(function(err, clients){
                    if(err){
                    res.status(500).send({responseCode:500, msg:err});
                    }           
                    res.status(200).send({responseCode:200, clients:clients});
                });
            });
        }
        
        
        
    }

    // create a client
    static createClient(req, res){
       try{
            Client.client().create(req.body, function(err) {
                if(err){
                    if(err.errno){
                        if(err.errno === 1062){
                            res.status(500).send({status:'failed', statusCode:500, msg:'client already exist'});
                        }else{
                            res.status(500).send({status:'failed', statusCode:500, msg:err.message});
                        }
                    }else{
                        res.status(500).send({status:'failed', statusCode:500, msg:err.message});
                    }
                    
                }else{
                    let token = jwt.sign({ id: req.body.uuid}, config.secret, 
                        {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(201).send({status:'ok', statusCode:201, token});
                }
                
            })
       }catch(e){
            res.status(500).send({status:'failed', statusCode:500, msg:e.message});
       }
        
    }

    // get token when client login
    static getToken(req, res) {
        const find = {client_email: req.body.email, api_key:req.body.api_key};
        Client.client().findOne({where: find}, function(err, client){
            if(err){
                res.status(500).send({responseCode:500, msg:err});
            }
            if(client){
                try{
                    // client available, get token
                    let token = jwt.sign(
                        { id: client.uuid, key:client.api_key }, 
                        config.secret, 
                    {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    res.status(200).send({'token':token});
                }catch(e){
                    console.log(e);
                    res.status(200).send({responseCode:500, msg:'could not get token'});
                }                
            }else{
                // client not found
                res.status(404).send({responseCode:404, msg:"Client not found"});
            }            
        });
    }
}

module.exports = ClientController;