
class Session extends require('./session'){
	constructor(es, config){
		super(es, config.channel.out, config.token, config.password, config.peer)

		this.buckets = [
			[ 5, 0, 0, 0, 0, 0 ],
			[ 5, 0, 0, 0, 0, 1 ],
			[ 5, 0, 0, 0, 0, 2 ],
			[ 5, 0, 0, 0, 0, 3 ],
			[ 5, 0, 0, 0, 0, 4 ]
		]

		this.current = 0

		this.delay = config.delay
		this.sendRecords(config)

		this.reporter = config.peer
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
			console.log('timestamp', data.body)
			return
		}

		this.report(token, password, this.reporter,  data.body)
	}

	report(sender, password, recipient, data){
		let r = {
			type : 0,
			timestamp : Date.now(),
			sender : sender,
			recipient : recipient,
			password : password,
			body : data
		}

		this.send(r)
	}

	record(creator, data){
		const peers = [
			'SpiderMan',
			'KickAss', 
			'Ramona', 
			'Malanga',
			'Gina' 
		]

		const reasons = [
			'no reason',
			'debt',
			'present',
			'salary',
			'la luchita'
		]
	
		let idx = Math.floor(Math.random()*peers.length)
		let from = peers[idx]
		let to = peers.filter((_,i) => i != idx)[(idx + 1) % (peers.length - 1)]


		return {
			creator: creator,
			data : {
				timestamp : Date.now(),
				from : from,
				to : to,
				amount: Math.floor(Math.random() * 10) + 1,
				reason: reasons[ Math.floor(Math.random()*reasons.length)]

			}
		}
	}

	sendRecords(config){
		setInterval( () => {
			let r = this.response(this.buckets[this.current], config.token, config.password, this.record(config.token, 'transaction'))

			console.log(r.timestamp, 'sending ...')
			this.send(r)

			this.current = (this.current + 1) % this.buckets.length
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
