let config = require('./config');

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
        this.init();
    }

    init() {}

    onPending(data) {}
    addMessage(data) {}
    message_received(data){}
    sendImgChat(data){}


    onReply(data) {
        // SEE DATA STRUCTURE RECIVED:
        //console.log(data);
        console.log(this.db != null);
        switch (data.body.subject) {
            case 'pending':
                // buscar los mensajes no leidos del ke te envia esta solicitud y enviaselos
                this.onPending(data)
                break;
            case 'message':             // RECIVE MESSAGE AND SEND IT TO DESTINATION
                this.addMessage(data);
                break;
            case 'message-recived':     // WAIT FOR DELIVERY CONFIRMATION AND NOTIFY TO ORIGIN
                this.message_received(data)
                break;
            case 'image-chat':             // RECIVE MESSAGE AND SEND IT TO DESTINATION
                this.sendImgChat(data);
                break;

            default:
                break;
        }
    }

}

module.exports = AbstractApp
