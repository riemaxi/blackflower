const config = {
	path: './storage/db.js'
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
