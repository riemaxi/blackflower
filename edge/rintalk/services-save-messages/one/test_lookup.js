const config = {
	path: '/mnt/d/blackflower/storage/messaging/000000000-0000000000'
}

class DB extends require('./manager').DB{
	constructor(){
		super(config.path)
	}

	initialize(data){
		super.initialize(data)
		console.log( this.get('1658839985392'))
	}
}

const db = new DB()



