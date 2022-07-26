const config = {
	path: '/mnt/d/blackflower/storage/messaging/000000000-0000000000'
}

class DB extends require('./manager').DB{
	constructor(){
		super(config.path)
	}

	initialize(data){
		super.initialize(data)
		this.list(item => item.data.token).forEach( item => console.log(item))
	}
}

const db = new DB()
