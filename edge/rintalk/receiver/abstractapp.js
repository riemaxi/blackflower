let config = require('./config')

class AbstractApp extends require('./session') {
    constructor(host) {
        super()
        this.connect(host)
    }

    onGranted(data) {
        console.log('onGranted ...');
    }

    onReply(data) {
        switch (data.body.subject) {
            case 'message':
                console.log(data.body);
                this.reply(config.accessKey, data.body.detail.to, {
                    subject: 'message',
                    detail: { 
                        ...data.body.detail
                    }
                })
                break;
            case 'message-recived':
                console.log(data.body);
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
