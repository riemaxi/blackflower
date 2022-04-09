let config = {
    size : 1,
    session : {
        port : 2000,
        path: './session.js',
        html: './html',
        greeting: 'B-Talk on PORT and STREAM_PORT',
        stream: {
            port: 9090
        }
    }
}

module.exports = config
