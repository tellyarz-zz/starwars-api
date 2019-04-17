const config = require('../config/config');

class RedisDatabase {
    constructor(){
        this.redis = require('redis');
    }

    connectDB() {
    
        const client = this.redis.createClient({
            host: config[config.env].redis.host,
            port: config[config.env].redis.port,
            password: config[config.env].redis.password
        });

        client.on('error', (err) => {
            console.log(`Error with redis connection: ${err}`);
        });

        client.on('ready', (err) => {
            //console.log('Redis ready...');
        });

        return client;
    }
}

module.exports = new RedisDatabase().connectDB();