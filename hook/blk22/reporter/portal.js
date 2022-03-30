
const {Worker, workerData} = require('worker_threads')

class Portal{
    constructor(config, handle){

		let reporter = new Worker(config.path, {
	        workerData : {
	            html : config.html,
	            port : config.port,
	            greeting : config.greeting
	        }
	    }).on('message', data => handle(reporter, data))

    }

}

module.exports = Portal
