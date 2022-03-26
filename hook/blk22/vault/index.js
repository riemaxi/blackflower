class DB extends require('./db'){
	constructor(host){
		super(host);
	}

	handleRequest(request, notify){
		switch(request.body.type){
			case 'transfer' : this.transfer(request, notify); break;
			case 'settle' : this.settle(request, notify); break;
			case 'balance' : this.balance(request, notify); break;	
		}
	}

	settle(request, notify){
		let data = request.body.data
		let query = `update item set secret='${data.secret}' where owner = '${data.sender}' and secret='${data.locker}'`
		console.log('settle:', query)

		request.body.timestamp = request.timestamp
		notify(request.body)
	}

	balance(request, notify){
		let data = request.body.data
		let query = `select count(serial) from item where secret='${data.secret}' and owner='${data.sender}'`
		console.log('balance:', query)

		request.body.timestamp = request.timestamp
		notify(request.body)
	}

	transfer(request, notify){
		let data = request.body.data
		let query = `update item set secret='${data.locker} and owner='${data.recipient}''  where owner = '${data.sender}' and secret='${data.secret}'`
		console.log('transfer:', query)

		request.body.timestamp = request.timestamp
		notify(request.body)
	}

	ready(result, config){
		console.log('db session initialized ...')
		this.close()
	}

	error(err){
		console.log('initialize::error',err)
	}

}


class Session extends require('./session'){
	constructor(es, config){
		super(es, config.channel.out, config.token, config.password, config.peer)

		this.delay = config.delay
		//this.reachout(config)

		this.db = new DB(config.db)
		console.log('session on')
	}

	greeting(token, password, peer){
	}

	response(sender, token, password, data){
		return {
			type : 0,
			timestamp : Date.now(),
			sender : token,
			recipient : sender,
			password : password,
			body : data
		}
	}

	reply(data, token, password ){
		if (data.type == 'timestamp'){
			//console.log('timestamp', data.body)
			return
		}

		this.db.handleRequest(
			data,
			result => {
				let r = this.response(data.sender, token, password, result)
				console.log('reply', r)
				this.send(r)		
			}
		)
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
