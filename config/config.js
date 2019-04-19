var config = {
    env: 'development', // development|test|production
    secret: 'iu-JHY-in-this-world20d-to-comee(mn',
    swBaseUrl: 'https://swapi.co/api/',
    development: {
        // database details
        redis: {
            host: '127.0.0.1', //'redis-16572.c61.us-east-1-3.ec2.cloud.redislabs.com', 
            port: 6379, //16572,
            password: '' //'Z1V9HpxjDNT7TienRAvMRluAhwH84xDn'
        },
        database: {
            host: 'localhost', //`'starwars.cvmakqb42azw.us-east-1.rds.amazonaws.com',
            dname: 'student_manager', //'starwars_dev2',
            user: 'jade',
            password: 'jade', //'NkXJtZp9iDpV65a',
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
            port: 3000
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
            port: 3000
        }
    }
}

module.exports = config;