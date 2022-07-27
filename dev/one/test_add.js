const config = {
	path: '/mnt/d/blackflower/storage/messaging/000000000-0000000000'
}

class DB extends require('./manager').DB{
	constructor(){
		super(config.path)
	}

	initialize(data){
		super.initialize(data)

		let size = 0
		let interval = setInterval(() => {
			let id = Date.now() + 10000
			this.add(id, {name: 'name-' + id, description: 'description-' + id})
			console.log(id)

			size++
			if (size>10){
				this.save(config.path)
				clearInterval(interval)
			}
		},10)



	}
}

const db = new DB()



