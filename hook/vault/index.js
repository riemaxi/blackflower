class DB extends require('./db'){
	constructor(host){
		super(host);
	}

	handleRequest(request, notify){
		switch(request.body.type){
			case 'transfer' : this.transfer(request, notify); break;
			case 'settle' : this.settle(request, notify); break;
			case 'balance' : this.balance(request, notify); break;	
			case 'assets' : this.assets(request, notify); break;	
		}
	}

	settle(request, notify){
		try{
			let data = request.body.data
			let squery = `update item set secret='${data.secret}' where serial % 2 = 0 and owner = '${data.sender}' and secret='${data.locker}' limit ${data.amount.silqoin}`
			let cquery = `update item set secret='${data.secret}' where serial % 2 = 1 and owner = '${data.sender}' and secret='${data.locker}' limit ${data.amount.coinelis}`
			let query = squery + ';' + cquery

			this.execute(query, result => {
				request.body.timestamp = request.timestamp
				request.body.result = { s: result[0].affectedRows, c: result[1].affectedRows}

				notify(request.body)
			}, e => console.log(e))
		}catch(e){
			request.body = { result : e}
			notify(request.body)
		}
	}

	checkBalance(owner, secret, amount, notify){
		let query = `select sum(1 - serial % 2) s, sum(serial % 2) c from item where secret='${secret}' and owner='${owner}'`
		this.execute(query, result => {
			notify({s: result[0].s - amount.silqoin, c: result[0].c - amount.coinelis})
		})
	}

	transfer(request, notify){
		try{
			let data = request.body.data
			this.checkBalance(data.sender, data.secret, data.amount, result => {

				if (result.s < 0 || result.c < 0){
					notify(result)
					return
				}

				let squery = `update item set secret='${data.locker}', owner='${data.recipient}'  where serial % 2 = 0 and  owner = '${data.sender}' and secret='${data.secret}' limit ${data.amount.silqoin}`
				let cquery = `update item set secret='${data.locker}', owner='${data.recipient}'  where serial % 2 = 1 and  owner = '${data.sender}' and secret='${data.secret}' limit ${data.amount.coinelis}`
				let query = squery + ';' + cquery

				this.execute(query , result => {
					request.body.timestamp = request.timestamp
					request.body.result = { s: result[0].affectedRows, c: result[1].affectedRows}
	
					notify(request.body)
				}, e => console.log(e))

			})
		}catch(e){
			request.body = { result : e}
			notify(request.body)
		}

	}

	balance(request, notify){
		let data = request.body.data
		let query = `select sum(1 - serial % 2) s, sum(serial % 2) c from item where secret='${data.secret}' and owner='${data.sender}'`

		console.log('balance req:', query)
		this.execute(query, result => {
			console.log('balance res:', result[0])

			request.body.timestamp = request.timestamp
			request.body.result = result[0]

			notify(request.body)
		})
	}

	assets(request, notify){
		let data = request.body.data
		let query = `select serial % 2 den from item where secret='${data.secret}' and owner='${data.sender}'`
		console.log('assets req:', query)
		this.execute(query, result => {

			console.log('assets res:', result)
			request.body.timestamp = request.timestamp
			request.body.result = result
	
			notify(request.body)
		})

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
