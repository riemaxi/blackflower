const EventSource = require('eventsource')
const axios = require('axios')

class Lobby{
	constructor(config){
		let es = new EventSource(config.channel.in + '/data')
		es.addEventListener('status', e => this.processStatus(es, config, JSON.parse(e.data)))
		es.addEventListener('holding', e => this.login(config, JSON.parse(e.data)))
	}

	processStatus(es, config, data){
		if (data.granted)
			this.granted(es, config, data)
		else
			this.denied(config, data)
	}

	granted(es, config, data){
	}

	denied(config, data){
	}

	login(config, data){
		axios.post(config.login,{
			band : config.band,
			token : config.token,
			password : config.password,
			timestamp : data.id
		})

	}

}

module.exports = Lobby
