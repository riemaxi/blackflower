let config = require('./config')

class App extends require('./abstractapp'){
    constructor(){
        super(config.host)
    }

    initialize(data){
        console.log('app initialized ...')
        this.login(config.accessKey, config.password)
    }

     serve(accessKey, peer, data){
        console.log('serving ...')
	super.serve(config.accessKey, config.peer, data)
     }

     play(accessKey, data){
	console.log('play...', data.body.to)
	super.play(config.accessKey, data)
     }
}

new App()
