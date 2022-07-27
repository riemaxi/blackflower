const configs = require('./test_config')
const crypto = require('crypto')

class Scheduler extends require('./manager').Scheduler{
	constructor(){
		super('./worker.js',configs.scheduler_add)
	}

	initialized(){
		super.initialized()
		this.counter = 0

		console.log('Test-Scheduler::initialized')

		for(let i=0; i<1000000; i++){
			let id = Math.floor(Math.random()*100000)
			let record = { value: id, name: 'name-' + id}

			let hash = crypto.createHash('sha256')

			hash.update(JSON.stringify(record))
			let key = hash.digest('hex')

			this.add(key, record, Date.now() + 1000)
		}

		setTimeout(()=> this.save(Date.now() + 1000), 1000)

	}

	message(msg){
		console.log('Test-Scheduler::message', msg.type, this.counter++)
		super.message(msg)
	}
}

new Scheduler()
