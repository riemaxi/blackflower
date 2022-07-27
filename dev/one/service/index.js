let config = require('./config')

class App extends require('./abstractapp'){
	constructor(){
		super(config.host)
	}

	initialize(data){
		console.log('app initialized ...')
		this.login(config.accessKey, config.password)
	}

	onDenied(data){
		console.log('denied', data)
	}

	advertise(accessKey, peer, data){
		super.advertise(config.accessKey, config.marketplace, data)
		console.log('ready ...')
	}

	add(data){
		console.log('add', data)
	}

	remove(data){
		console.log('remove', data)
	}

	list(data){
		console.log('list', data)
	}

	get(data){
		console.log('get', data)
	}

	update(data){
		console.log('update', data)
	}

}

new App()
