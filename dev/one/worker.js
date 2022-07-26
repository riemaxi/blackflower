const {workerData, parentPort} = require('worker_threads')

class DB extends require('./manager').DB{
	constructor(){
		super(workerData.path)
	}

	initialize(data){
		parentPort.postMessage({type: 'initialized', data: workerData.id} )
		parentPort.on('message', msg => {
			switch(msg.type){
				case 'add' : this.add(msg.key, msg.data, msg.token); break;
				case 'remove' : this.remove(msg.key, msg.token); break;
				case 'get' : this.get(msg.key, msg.token); break;
				case 'list' : this.select(msg.token); break;
				case 'save' : this.save(msg.token); break;
			}
		})
	}

	reply(type, data){
		parentPort.postMessage({type, data})
	}

	add(key, data, token){
		super.add(key, data)
		this.reply('add', {key, data, token})
	}

	remove(key, token){
		super.removeEntry(key)
		this.reply('add', {key, token})
	}

	get(key){
		let data  = super.get(key)
		this.reply('get', {data, token})
	}

	select(token){
		let data = super.list( _ => true)
		this.reply('list', {data:'', token})
	}

	save(token){
		super.save(workerData.path)
		this.reply('save', { time : Date.now(), token})
	}
}

new DB()
