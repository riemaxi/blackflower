const {v4: uuidv4} = require('uuid')
const config = {
	path: '../storage/db.js'
}

class DB extends require('./manager').DB{
	constructor(){
		super(config.path)
	}

	initialize(data){
		super.initialize(data)
		let size = 0
		let interval = setInterval(() => {
			let id = Date.now()
			this.add(id, {name: 'name-' + id, description: 'description-' + id})
			console.log(id)

			size++
			if (size>10){
				this.save(config.path)
				clearInterval(interval)
			}
		},10)
	}
	Message(from, to, time, text) {
		this.add(uuidv4(), {from, to, time, text});
		this.save(config.path)
	}
}

const db = new DB()



