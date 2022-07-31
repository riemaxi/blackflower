let config = require('./config');
const {v4: uuidv4} = require('uuid');
class App extends require('./abstractapp') {

    constructor() {
        super(config.host);
    }

    init() {
        console.log('Load initial data...');
            if (this.db == null) {
              this.db = new DB();
            }
    }

    onPending(data) {
        console.log(data);
        let message = this.db.list(item =>( item.data.to === data.body.from || item.data.from === data.body.from )/*  && !item.data.verify */);
        console.log(message);
        this.reply(config.accessKey, data.body.from, {
            subject: 'pending',
            detail: {
                message
            }
        });
    }

   addMessage(data) {
        let verify = false;
        this.db.add(uuidv4(), {verify, ...data.body.detail});
        this.db.save(config.path);
        this.reply(config.accessKey, data.body.detail.to, {
            subject: 'message',
            detail: {
                ...data.body.detail
            }
        });
    }
    message_received(data) {

        console.log('Data Received');
        this.reply(config.accessKey, data.body.detail.from, {
            subject: 'message-recived',
            detail: {
                to: data.body.detail.to,
                time: data.body.detail.time
            }
        });
    }
}

class DB extends require('./services/manager').DB{
    constructor(){
        super(config.path)
    }
    initialize(data) {
        super.initialize(data);
    }
}

// Create App to start
new App()
