const express = require('express');
const config = require('./config/config');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./routes/router');
const rateLimit = require("express-rate-limit");

const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

const app = express();
const logDirectory = path.join(__dirname, 'log');

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
//write stream file
const logStream = rfs('access.log', {
	interval: '1d', //rotate daily
	path: logDirectory
});

// setup rate limit
if(config.env === 'production'){
	// enable proxy, since behind proxy
	app.enable("trust proxy");
}
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 mins
	max: 500,
	message: {status:'failed', statusCode:429, msg:'Too many request, please try after 15 mins'}
});


// setup middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(morgan('combined', {stream: logStream}));	
app.use('/', router);
app.use(function(req, res, next) {
	return res.status(404).send({status:'failed', statusCode:404, msg:	`route ${req.url} not found`});
});
app.use(function(err, req, res, next) {
	return res.status(500).send({status:'failed', statusCode:500, msg:err.message});
});

// start server
if(!module.parent){
	app.listen(
		config[config.env].server.port, 
		config[config.env].server.host, 
		()=>console.log(`${config.env} Server running at port ${config[config.env].server.port}`)
	);
}



module.exports = app;
