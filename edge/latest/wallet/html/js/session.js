import { io } from "./socket.io.esm.min.js";

export class Session {
    constructor() {
        console.log('ready ...')
    }

    connect(host) {
        this.socket = io.connect(host, { reconnect: true,  transports: ['websocket'] })

        this.socket.on('connect', () => {
            this.onConnect()

            this.socket.on('session', data => this.initialize(data))
            this.socket.on('granted', data => this.onGranted(data))
            this.socket.on('denied', data => this.onDenied(data))
            this.socket.on('reply', data => this.onReply(data))
        })

        this.socket.on('connect_err', error => this.onError(error))
    }

    onError(error) {
        console.log(`connect_error due to ${error.message}`);
    }

    onConnect() {
        console.log('connect')
    }

    onGranted(data) {}
    onDenied(data) {}
    onReply(data) {}
    initialize(data) {}

    send(type, data) {
        data.timestamp = Date.now()
        this.socket.emit(type, data)
    }

    login(accessKey, password) {
        this.send('login', {
            accessKey: accessKey,
            password: password
        })
    }

    logout() {
        this.send('logout', {})
    }


    signal(from, to, data) {
        this.send('signal', {
            from: from,
            to: to,
            ...data
        })
    }

    reply(from, to, data) {
        this.send('reply', {
            from: from,
            to: to,
            ...data
        })
    }
}
