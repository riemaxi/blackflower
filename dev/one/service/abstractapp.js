
class AbstractApp extends require('./session'){
	constructor(host){
		super()
		this.connect(host)
	}

	onGranted(data){
			this.advertise(null, null, data)
	}

	onReply(data){
		switch(data.body.subject){
			case 'add' : this.add(data); break;
			case 'update' : this.updata(data); break;
			case 'get' : this.get(data); break;
			case 'remove' : this.remove(data); break;
			case 'list' : this.list(); break;
		}
	}

	advertise(accesskey, peer, data){
		this.signal(
		    accesskey,
		    peer, {
			subject: 'ad',
		        detail : {
				accesskey : accesskey,
				name: 'storage service',
				author: 'Coinelis Vrai',
				version: '2022-1.0.0',
				description : 'storage service',
				doc: 'working on it'
			}
		    })
	}

	replay(accesskey, data){
		super.reply(
		    accessKey,
		    data.body.from, {
		        subject: 'play',
		        detail : 'POW'
		    })
	}

	add(data){}
	remove(data){}
	list(){}
	get(){}
	update(){}

}

module.exports = AbstractApp
