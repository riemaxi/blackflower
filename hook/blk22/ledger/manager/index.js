
class Session extends require('./session'){
	constructor(es, config){
		super(es, config.channel.out, config.token, config.password, config.peer)

		this.delay = config.delay
		this.reachout(config)
	}

	greeting(token, password, peer){
	}

	response(sender, token, password){
		return {
			type : 0,
			timestamp : Date.now(),
			sender : token,
			recipient : sender,
			password : password,
			body : 'pow'
		}
	}

	reply(data, token, password ){
		if (data.type == 'timestamp'){
			console.log('timestamp', data.body)
			return
		}

		setTimeout( () => {
			let r = this.response(data.sender, token, password)

			console.log(r.timestamp, 'sending', r.body, 'from', token, 'to', data.sender)
			this.send(r)		
		},
		this.delay)
	}

	reachout(config){
		let r = this.response(config.peer, config.token, config.password)

		console.log('reaching out', r.body, 'from', config.token, 'to', config.peer)
		this.send(r)		
	}
}


class Lobby extends require('./lobby'){
	constructor(config){
		super(config)
	}

	granted(es, config, data){
		new Session(es, config)
	}

	denied(message){
		console.log('denied', message)
	}
}

new Lobby( require('./config') )
