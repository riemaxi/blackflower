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
        let message = this.db.list(item =>( item.data.to === data.body.from || item.data.from === data.body.from )/*  && !item.data.verify */); // send All now
        this.reply(config.accessKey, data.body.from, {
            subject: 'pending',
            detail: {
                message
            }
        });
    }

   async addMessage(data) {
        let verify = false;
        let exist = await this.db.list(item =>( item.data.time === data.body.detail.time ));
        if (exist.length<=0) {
            console.log('Send Message...');
            this.db.add(uuidv4(), {verify, ...data.body.detail});
            this.db.save(config.path);
            this.reply(config.accessKey, data.body.detail.to, {
                subject: 'message',
                detail: {
                    ...data.body.detail
                }
            });
        }
        
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

    sendImgChat(data) {
        console.log('Image Recived! Sending ...');
        this.reply(config.accessKey, data.body.detail.to, {
            subject: 'image-chat',
            detail: {
                ...data.body.detail
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
