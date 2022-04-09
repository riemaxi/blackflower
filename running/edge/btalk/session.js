const express = require('express')
const app = express()
const streamer = require('./streamer')

const { workerData, parentPort } = require('worker_threads')
let wd = workerData

app.use(express.static(wd.html))

let start = (port, stream_port) => {

    let clients = []

    let broadcast = () => {
        for(let client of clients)
            client.channel.write('data: pow\n\n')
    }


    let removeClient = (id) => {
        clients = clients.filter(item => item.id != id)
        parentPort.postMessage({id : 'r', data : {id : id, size: clients.length, port : port, index : wd.index}})
    }

    let addCient = (req, res) => {
        const headers = {
            'Content-Type' : 'text/event-stream',
            'Connection' : 'keep-alive',
            'Cache-Control' : 'no-cache'
        }

        res.writeHead(200, headers)

        let id = Date.now()
        res.write('data: ' + id + '\n\n')

        clients.push( {
            id : id,
            channel : res
        } )

        res.on('close', () => removeClient(id))

        parentPort.postMessage({id : 'a', data : {id : id, size: clients.length, port : port, index: wd.index}})
    }

    app.listen(port, () => {
        streamer.start(stream_port, ()=> {
            console.log(wd.greeting.replace('PORT', port).replace('STREAM_PORT', stream_port))
        })
    })
    app.get('/add', (req, res) => addCient(req, res))

}

start(wd.port + wd.index, wd.stream_port + wd.index)

