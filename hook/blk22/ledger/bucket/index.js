
class DB extends require('./db'){
	constructor(host){
		super(host)
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
}

	greeting(token, password, peer){
		console.log('Session ', token, ' is on ...')
	}

	response(sender, token, password, data){
		return {
			type : 0,
			timestamp : Date.now(),
			sender : token,
			recipient : sender,
			password : password,
			body : data || {}
		}
	}

	reply(data, token, password ){
		if (data.type == 'timestamp'){
			console.log('timestamp', data.body)
			return
		}

		let r = this.response(data.sender, token, password, data.body)

		console.log(r.timestamp, 'sending', r.body, 'from', token, 'to', data.sender)
		this.send(r)		
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


let config = {...require('./config')}
var db = new DB(config.db)



let size = 6

let booter = setInterval(()=> {
	if (size > 0){
		let sessConfig = {...config}

		sessConfig.token = [5,0,0,0,0,size-1]

		new Lobby(sessConfig)

		size--
	}else{
		clearInterval(booter)
		console.log('all sessions on ...')
	}
}, 4000)
