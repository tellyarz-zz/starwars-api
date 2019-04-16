var config = {
    env: 'development',
    secret: 'iu-JHY-in-this-world20d-to-comee(mn',
    swBaseUrl: 'https://swapi.co/api/',
    development: {
        // database details
        redis: {
            host: '127.0.01',
            port: 6379,
            password: null
        },
        database: {
            host: 'localhost',
            dname: 'student_manager',
            user: 'jade',
            password: 'jade',
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
        database: {
            host: 'localhost',
            dname: 'student_manager_test',
            user: 'jade',
            password: 'jade',
            port:3306,
            dialect: 'mysql'
        },
        redis: {
            host: '127.0.01',
            port: 6379,
            password: null
        },
        // server details
        server: {
            host: '127.0.0.1',
            port: 3000
        }
    },
    production: {
        // database details
        database: {
            host: 'mongodb://test:testemployee1@ds035816.mlab.com',
            port: 35816,
            db: 'employee'
        },
        redis: {
            host: '127.0.01',
            port: 6379,
            password: null
        },
        // server details
        server: {
            host: '127.0.0.1',
            port: 3000
        }
    }
}

module.exports = config;