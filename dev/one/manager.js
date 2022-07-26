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
		return Object
			.entries(this.data).filter( item => ok({key: item[0], data : {...item[1]}}) )
			.map(item => ({key: item[0], data : {...item[1]}}))
	}

	stringify(){
		return '[\n' + this.list( _ => true).map(item => JSON.stringify(item)).join(',\n') + '\n]'
	}

	save(path){
		console.log('db:save', path)
		fs.writeFile(path, this.stringify(), 'utf8', error => error && this.error(error))
	}

}

const {Worker} = require('worker_threads')
class Scheduler{
	constructor(workerPath, configs){
		this.initCount = 0
		this.ranges = {}
		for(let config of configs){
			let worker = new Worker(workerPath, { workerData : config } )
			worker.on('message', msg => this.message(msg))

			this.ranges[config.range.start + ':' + config.range.end] = worker
		}

	}

	initialized(){}


	message(msg){
		switch (msg.type){
			case 'initialized' :{
					this.initCount++
					if (this.initCount == Object.keys(this.ranges).length)
						this.initialized()
				}; break
		}
	}

	lookup(key){
		let range = Object.keys(this.ranges)
				.map(range => {
					let values = range.split(':')
					return {start: values[0], end : values[1]}
				})
				.find( range => parseInt(range.start) <= key && key <= parseInt(range.end))

			return range && this.ranges[range.start + ':' + range.end]
	}

	add(key, data, token){
		let worker = this.lookup(key)
		worker && worker.postMessage({type : 'add', key, data, token})
	}

	remove(key, token){
		let worker = this.lookup(key)
		worker && worker.postMessage({type: 'remove', key, token})
	}

	get(key, token){
		let worker = this.lookup(key)
		worker && worker.postMessage({type: 'get', key, token})
	}

	list(token){
		for (let worker of Object.values(this.ranges))
			worker.postMessage({type: 'list', token})
	 }

	save(token){
		for (let worker of Object.values(this.ranges))
			worker.postMessage({type: 'save', token})
	 }

}

module.exports = {DB, Scheduler}
