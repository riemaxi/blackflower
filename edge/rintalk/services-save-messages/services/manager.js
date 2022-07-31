const fs = require('fs')

class DB{
	constructor(path){
		this.data = {}
		this.load(path)
	}

	load(path){
		fs.readFile(path, 'utf8', (error, data) => error?this.error(error) : this.initialize(data.trim()))
	}

	initialize(data){
		if (data != '')
			for(let entry of JSON.parse(data)){
				this.add(entry.key, entry.data)
			}
	}

	error(data){
		console.log(data)
	}

	add(key, data){
		this.data[key] = data
	}

	removeEntry(key){
		delete this.data[key]
	}

	remove(ok){
		this.data = this.data.filter(item => !ok(item))
	}

	get(key){
		return this.data[key]
	}

	list(ok){
		let result = Object
			.entries(this.data).filter( item => ok({key: item[0], data : {...item[1]}}) )
			.map(item => ({key: item[0], data : {...item[1]}}))

		return result
	}

	stringify(){
		return '[\n' + this.list( _ => true).map(item => JSON.stringify(item)).join(',\n') + '\n]'
	}

	save(path){
		console.log('db:save', path)
		fs.writeFile(path, this.stringify(), 'utf8', error => error && this.error(error))
	}

}

module.exports = {DB}

