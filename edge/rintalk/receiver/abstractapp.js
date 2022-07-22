let config = require('./config')

class AbstractApp extends require('./session') {
    constructor(host) {
        super()
        this.connect(host)
    }

    initialize(data) {
        console.log('app initialized ...', data)
        this.login(config.accessKey, config.password)
    }

    onGranted(data) {
        console.log('onGranted ...');
    }

    onReply(data) {
        
        // SEE DATA STRUCTURE RECIVED:
        //console.log(data);

        switch (data.body.subject) {
            case 'message':             // RECIVE MESSAGE AND SEND IT TO DESTINATION
                this.reply(config.accessKey, data.body.detail.to, {
                    subject: 'message',
                    detail: { 
                        ...data.body.detail
                    }
                })
                break;
            case 'message-recived':     // WAIT FOR DELIVERY CONFIRMATION AND NOTIFY TO ORIGIN
                this.reply(config.accessKey, data.body.detail.from, {
                    subject: 'message-recived',
                    detail: { 
                        to: data.body.detail.to,
                        time: data.body.detail.time
                        }
                })
                break;         

            default:
                break;
        }
    }

}

module.exports = AbstractApp
