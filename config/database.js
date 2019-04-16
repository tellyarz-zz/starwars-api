const caminte = require('caminte');
const config = require('../config/config');

const Schema = caminte.Schema;

const dbConfig = {
    driver: config[config.env].database.dialect,   
    host: config[config.env].database.host,
    port: config[config.env].database.port,
    username: config[config.env].database.user,
    password:config[config.env].database.password,
    database: config[config.env].database.dname,
    pool: false // optional for use pool directly
};
let schema = new Schema(dbConfig.driver, dbConfig);
module.exports = schema;