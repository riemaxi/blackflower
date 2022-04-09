const express = require('express')
const app = express()

const { workerData, parentPort } = require('worker_threads')
let wd = workerData

app.use(express.static(wd.html))

let start = port => {

    let clients = []

    let broadcast = data => {
        for(let client of clients)
            client.channel.write(`data: ${JSON.stringify(data)}\n\n`)
    }


    let removeClient = (id) => {
        clients = clients.filter(item => item.id != id)
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
    }

    app.listen(port, () => {
           console.log(wd.greeting.replace('PORT', port))
           
           parentPort.postMessage({id : 'started'})
           parentPort.on('message', data => broadcast(data)) 
    })

    app.get('/add', (req, res) => addCient(req, res))


}

start(wd.port)
