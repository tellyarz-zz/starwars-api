var config = {
    env: 'production', // development|test|production
    secret: 'iu-JHY-in-this-world20d-to-comee(mn',
    swBaseUrl: 'https://swapi.co/api/',
    development: {
        // database details
        redis: {
            host: '127.0.0.1',
            port: 6379,
            password: null
        },
        database: {
            host: 'starwars.cvmakqb42azw.us-east-1.rds.amazonaws.com',
            dname: 'starwars',
            user: 'jade',
            password: 'NkXJtZp9iDpV65a',
            port:3306,
            dialect: 'mysql'
        },
        // server details
        server: {
            host: '127.0.0.1',
            port: 3000
        }
    },
    test: {
        // database details
        redis: {
            host: '127.0.0.1',
            port: 6379,
            password: null
        },
        database: {
            host: 'starwars.cvmakqb42azw.us-east-1.rds.amazonaws.com',
            dname: 'starwars_dev',
            user: 'jade',
            password: 'NkXJtZp9iDpV65a',
            port:3306,
            dialect: 'mysql'
        },
        // server details
        server: {
            host: 'ec2-52-72-1-231.compute-1.amazonaws.com',
            port: 80
        }
    },
    production: {
        // database details
        // database details
        redis: {
            host: '127.0.0.1',
            port: 6379,
            password: null
        },
        database: {
            host: 'starwars.cvmakqb42azw.us-east-1.rds.amazonaws.com',
            dname: 'starwars',
            user: 'jade',
            password: 'NkXJtZp9iDpV65a',
            port:3306,
            dialect: 'mysql'
        },
        // server details
        server: {
            host: 'ec2-52-72-1-231.compute-1.amazonaws.com',
            port: 80
        }
    }
}

module.exports = config;