
const {workerData, parentPort} = require('worker_threads')
const express = require('express')

const exit = express()
const SseStream = require('ssestream').default

var next
let wd = workerData

let ok = indata => {
    try{
        let data = JSON.parse(indata)
        return  data.sender.length == wd.dimensions && 
                data.recipient.length == wd.dimensions
                ?data : null
    }catch(e){
        return null
    }
}

let forward = indata => {
    let data = ok(indata)
    data && next && next.write({
        event : 'data',
        data : indata
    })

    console.log('forward', data?data.timestamp : 'error' + indata)
}

let subscribe = (req, res) => {
    next = new SseStream(req)
    next.pipe(res)
    res.on('close', () => {
        next.unpipe(res)
        console.log('unlinked')
    })

    console.log('linked')
}

exit.get('/data', (req, res) =>  subscribe(req, res))
exit.listen(wd.exit, () => {

    const IO = require('socket.io').Server
    const server = require('http').createServer()
    
    const enter = new IO(server)    
    
    server.listen(wd.enter, () => {
        console.log(wd.greeting)

        enter.on('connection', socket => {
            socket.on('data', data => forward(data))
        })
    })    
})
