const client = require('./redis-database');
const Client = require('../models/client.model');

class RateLimiter {

    constructor(router) {
        this.limiter = require('express-limiter')(router, client);
    }

    // for IP only
    usingRemoteAddress(path, method) {
        return this.limiter ({
            path: path,
            method: method,
            lookup: ['connection.remoteAddress'],
            total: 50,
            expire: 100 * 60 * 60,
            onRateLimited: function(req, res, next) { 
                res.status(429).json('Too many request, Rate limit exceeded');
            }
        });
    }

    
    //For get request paramter    
    asGetParameter(path, method, param) {
        return this.limiter({
            path: path,
            method: method,
            lookup: ['params.id'],
            total: 5,
            expire: 1000 * 60 * 60, 
            onRateLimited: function (request, response, next) {
                response.status(429).json('You are not welcome here, Rate limit exceeded');
            }
        });
    }

    checkApiKey(path, method) {
        return this.limiter({
            path: path,
            method: method,
            lookup: async (request, response, opts, next) => {
                try {
                    const validKeyResult = await this.isValidApiKey(request.body.api_Key);
                    if (validKeyResult) {
                        opts.lookup = 'params.apiKey'
                        opts.total = 50
                    } else {
                        opts.lookup = 'connection.remoteAddress'
                        opts.total = 20
                    }
                } catch (error) {
                    opts.lookup = 'connection.remoteAddress'
                    opts.total = 20
                }
                return next()
            },
            total: 50,
            expire: 1000 * 60 * 60, // one hour
            onRateLimited: function (request, response, next) {
                // return next();
                response.status(429).json('Too many request, Rate limit exceeded');
            }
        });
    }
     
    isValidApiKey(apiKey) {
        /**
        * Here based on `apiKey` you should rreturn true or false.
        *`apiKey` can be compared with any api key stored in database.
        */
        return new Promise( (resolve, reject) => {
            const find = {api_key:apiKey};
            Client.client().findOne({where: find}, function(err, client){
                if(err){
                    reject(false);
                }
                if(client){
                    resolve(true);
                }else{
                    reject(false);
                }
            });
        });
    }
}

module.exports = RateLimiter;