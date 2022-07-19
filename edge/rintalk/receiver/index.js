let config = require('./config')
const path = require('path');
// get filesystem module
const fs = require("fs");

class App extends require('./abstractapp') {
    constructor() {
        super(config.host)
        this.messages = []
        this.init()
    }

    init() {
        try {
            const data = require('./db/data.json')
            this.messages = data.messages
            console.log('Load initial data... ok');

        } catch (error) {
            console.log(error);
        }
    }

    initialize(data) {
        console.log('app initialized ...', data)
        this.login(config.accessKey, config.password)
    }

    onGranted(data) {
        console.log('onGranted ...ok');
    }

    onReply(data) {
        super.onReply(data)
    }

    get toJson() {
        return {
            messages: this.messages
        }
    }

    saveDB() {
        const dbPath = path.join(__dirname, './db/data.json')
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson))
    }


}

new App()
