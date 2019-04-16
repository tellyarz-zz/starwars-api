const express = require('express');
const MiddleWare = require('./config/middleware');
const config = require('./config/config');
const app = express();

const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');
const logDirectory =path.join(__dirname, 'log');


class Server {
	constructor(){
		this.host = config[config.env].server.host;
		this.port = config[config.env].server.port;
	}

	// set up some middleware
	setMiddleWare(){
        // ensure log directory exists
        fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

        //write stream file
        const logStream = rfs('access.log', {
            interval: '1d', //rotate daily
            path: logDirectory
        });
        // set middleware
		new MiddleWare(app, logStream).setMiddleWare();
	}

	// start up server
	startUp(){
		this.setMiddleWare();
		app.listen(this.port, this.host, ()=>console.log(`${config.env} Server running at port ${this.port}`));
	}
}

const server= new Server();
server.startUp();

module.exports = app;
