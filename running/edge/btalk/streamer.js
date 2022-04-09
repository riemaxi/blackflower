const {Server} = require('socket.io')
const ss = require('socket.io-stream')

let start = (port, ready) => {
	ready()
    /*var io = new Server({ cors : { origin: "*"}})

    io.listen(port, () => {
        io.of('/stream').on('connection', socket => {
            ss(socket).on('stream', stream => {
                console.log('streaming...', typeof stream)
            })
        })

        ready()
    })*/
}

module.exports = {start}
