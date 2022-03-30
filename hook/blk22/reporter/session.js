const io = new require('socket.io-client')

class Session {
    constructor(es, host, token, password, peer){
        this.socket = io.connect(host)
        es.addEventListener('data', e => this.reply(JSON.parse(e.data), token, password))

        this.greeting( token, password, peer)
    }

    greeting(token, password, peer){
    }

    reply(data, token, password){
    }

    send(data){
        this.socket.emit('data',JSON.stringify(data))

    }

    close(){
        this.socket.close()
    }
}

module.exports = Session
