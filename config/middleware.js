const bodyParser = require('body-parser');
const router = require('../routes/router');
const morgan = require('morgan');

class Middleware {

	constructor(app, logStream){
		this.app = app;
		this.logStream = logStream;
	}

	setMiddleWare(){
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({extended:false}));	
		this.app.use(morgan('combined', {stream: this.logStream}));	
		this.app.use('/', router);
		this.app.use(function(req, res, next) {
			return res.status(400).send({responseCode:404, msg:	`route ${req.url} not found`});
		});
		this.app.use(function(err, req, res, next) {
			return res.status(500).send({responseCode:500, error:err});
		});
	}

}

module.exports = Middleware;