let config = require('./config')

class App extends require('./abstractapp') {
    constructor() {
        super(config.host)
        this.init()
    }

    init() {
        console.log('Load initial data...');
    }    

    onReply(data) {
        super.onReply(data)
    }

}

// Create App to start
new App()
