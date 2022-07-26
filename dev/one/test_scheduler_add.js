const configs = [
	{
		id : 'data-00',
		path: '/mnt/d/blackflower/storage/messaging/data-00',
		range :	{start:0, end: 9}
	},

	{
		id : 'data-10',
		path: '/mnt/d/blackflower/storage/messaging/data-10',
		range :	{start:10, end: 19}
	},

	{
		id : 'data-20',
		path: '/mnt/d/blackflower/storage/messaging/data-20',
		range :	{start:20, end: 29}
	},

	{
		id : 'data-30',
		path: '/mnt/d/blackflower/storage/messaging/data-30',
		range :	{start:30, end: 39}
	},

	{
		id : 'data-40',
		path: '/mnt/d/blackflower/storage/messaging/data-40',
		range :	{start:40, end: 49}
	}
]

class Scheduler extends require('./manager').Scheduler{
	constructor(){
		super('./worker.js',configs)
	}

	initialized(){
		super.initialized()

		console.log('Test-Scheduler::initialized')

		for(let i=0; i<50; i++){
			let key = Math.floor(Math.random()*50)
			this.add(key, { value: key}, Date.now() + 1000)
		}

		setTimeout(()=> this.save(Date.now() + 1000), 1000)

	}

	message(msg){
		console.log('Test-Scheduler::message', msg.type)
		super.message(msg)
	}
}

new Scheduler()
