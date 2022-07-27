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
		this.list(Date.now())
	}

	message(msg){
		console.log('Test-Scheduler::message', msg.data)
		super.message(msg)
	}
}

new Scheduler()
