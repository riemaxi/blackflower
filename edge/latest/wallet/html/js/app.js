import {AbstractApp} from './abstractapp.js'
import {config} from './config.js'

class App extends AbstractApp{
	constructor(){
		super(config.host)
	}

	initialize(data) {
		super.initialize(data)

		console.log('app initialized ...', data)
	}

	//event
	onGranted(data) {
		super.onGranted(data)

		console.log('granted')
	}
	onDenied(data) {
		console.log('denied')
	}

	onLogin(data){
		console.log('login', data)
		this.connect(config.host)

		if (data.accessKey)
			this.login(config.accessKey, config.password)
		else
			this.login('key', 'password')

	}

	onPassword(data){
		console.log('password', config.accessKey)
	}

}

new App()
