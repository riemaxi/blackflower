const crypto = require('crypto')
const config = require('./config')


class DB extends require('./db'){
	constructor(config){
		super(config)
	}

	ready(result){
		console.log('initialized ...')
		this.close()
	}

	error(err){
		console.log('initialize::error',err)
	}
}

new DB(config.db)
