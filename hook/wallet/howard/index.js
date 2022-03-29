
class Session extends require('./session'){
	constructor(es, config){
		super(es, config.channel.out, config.token, config.password, config.peer)

		this.actions = {'assets': [], 'transfer' : [], 'balance': [], 'settle': []}

		this.operation = 2

		this.sendingOnce(config)
	}

	addTimestamp(action){
		let timestamp = Date.now()

		this.actions[action].push(timestamp)

		return timestamp
	}

	greeting(token, password, peer){
	}

	transfer(config){
		let tx = {
			type : 0,
			timestamp : this.addTimestamp('transfer'),
			sender : config.token,
			recipient : config.peer,
			password : config.password,
			body : {
				type : 'transfer',
				data: {
					sender :  config.tx.sender,
					recipient : config.tx.recipient,
					secret: '864995ea35b82212a9a2d456a3f89833f24651c4e5ebc21c18476a9afb065035',
					locker : 'aaaaaaaa35b82212a9a2d456a3f89833f24651c4e5ebc21c18476a9afb065035',
					amount : {
						silqoin : 10,
						coinelis: 20
					}
				}
			}
		}

		console.log('sending', tx.body.data.amount, 'from', tx.body.data.sender, 'to', tx.body.data.recipient)
		this.send(tx)
	}


	settle(config){
		let tx = {
			type : 0,
			timestamp : this.addTimestamp('settle'),
			sender : config.token,
			recipient : config.peer,
			password : config.password,
			body : {
				type : 'settle',
				data: {
					sender :  config.tx.recipient,
					recipient : config.tx.sender,
					secret: '864995ea35b82212a9a2d456a3f89833f24651c4e5ebc21c18476a9afb065035',
					locker : 'aaaaaaaa35b82212a9a2d456a3f89833f24651c4e5ebc21c18476a9afb065035',
					amount : {
						silqoin : 10,
						coinelis: 20
					}
				}
			}
		}

		console.log('earning', tx.body.data.amount, 'from', tx.body.data.sender, 'to', tx.body.data.recipient)
		this.send(tx)
	}

	balance(config){
		let tx = {
			type : 0,
			timestamp : this.addTimestamp('balance'),
			sender : config.token,
			recipient : config.peer,
			password : config.password,
			body : {
				type : 'balance',
				data: {
					sender :  config.tx.sender,
					recipient : config.tx.recipient,
					secret: '864995ea35b82212a9a2d456a3f89833f24651c4e5ebc21c18476a9afb065035',
				}
			}
		}

		console.log('balance from', tx.body.data.sender)
		this.send(tx)
	}

	assets(config){
		let tx = {
			type : 0,
			timestamp : this.addTimestamp('assets'),
			sender : config.token,
			recipient : config.peer,
			password : config.password,
			body : {
				type : 'assets',
				data: {
					sender :  config.tx.sender,
					recipient : config.tx.recipient,
					secret: '864995ea35b82212a9a2d456a3f89833f24651c4e5ebc21c18476a9afb065035',
				}
			}
		}

		console.log('assets from', tx.body.data.sender)
		this.send(tx)
	}

	sending(config){
		setInterval( () => {
			switch(this.operation){
				case 0: this.transfer(config); break;
				case 1: this.balance(config); break;
				case 2: this.settle(config); break;
				case 3 : this.assets(config); break;
			}

			console.log('pending', this.actions)
			this.operation = (this.operation + 1) % 4
		},
		config.delay)
	}

	sendingOnce(config){
		switch(this.operation){
			case 0: this.transfer(config); break;
			case 1: this.balance(config); break;
			case 2: this.settle(config); break;
			case 3: this.assets(config); break;
		}

		this.operation = (this.operation + 1) % 4
	}

    reply(data, token, password){
		let type = data.body.type
		let timestamp = data.body.timestamp

		this.actions[type] = this.actions[type].filter(item => item != timestamp)

		console.log('pending', this.actions)
		console.log(data.body.result)
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
		console.log(message)
	}
}

new Lobby( require('./config') )
