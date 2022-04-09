const {workerData, parentPort} = require('worker_threads')
const SseStream = require('ssestream').default

const exit = require('express')()
const EventSource = require('eventsource')

var next

let wd = workerData

const qdata = require('./data')(wd.dimensions)
let setq = (token, value) => qdata[token[0]][token[1]][token[2]][token[3]][token[4]][token[5]]

let granted = (token, password) => {
    try{
        return setq(token, password)
    }catch(e){
        return false
    }
}

let forward = indata => {
    let data = JSON.parse(indata)

    console.log('session::forward', data.sender, data.recipient, data.timestamp)
    
    next && granted(data.sender, data.password) && next.write({
        event : 'data',
        data : data
    })
}

let subscribe = (req, res) => {
    next = new SseStream(req)
    next.pipe(res)
    res.on('close', () => {
        next.unpipe(res)
    })

    console.log('linked')
}

enter = new EventSource(wd.enter + '/data')
enter.addEventListener('data', e => forward(e.data))

exit.get('/data', (req, res) =>  subscribe(req, res))
exit.listen(wd.exit, () => console.log(wd.greeting))

parentPort.on('message', e => processMessage(e))

let checkAccess = (token, password, timestamp) => {

    let g = granted(token, password)
    console.log('session::checkAccess', token.length, password.length, timestamp, g)
    next && next.write({
        event: 'login',
        data : {
            granted : g,
            id : timestamp,
            token : token,
            password : password
        }
    })
}

let forwardDeny = id => {
    console.log('forwardDeny', id)
    next && next.write({
            event : 'deny',
            data : {id : id}
        }
    )
}

let processMessage = e => {
    console.log('session::processMessage', e, wd.exit, e.id)
    switch(e.id){
        case 'login' : checkAccess(e.data.token, e.data.password, e.data.timestamp); break;
        case 'login-deny' : forwardDeny(e.data.timestamp)
    }
}
