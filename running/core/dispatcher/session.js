const {workerData, parentPort} = require('worker_threads')
const SseStream = require('ssestream').default

const exit = require('express')()
const EventSource = require('eventsource')

var targets = {}

let wd = workerData

let qdata = require('./data')(wd.dimensions)

let getq = token => qdata[token[0]][token[1]][token[2]][token[3]][token[4]][token[5]]
let setq = (token, value) => qdata[token[0]][token[1]][token[2]][token[3]][token[4]][token[5]] = value

let forward = indata => {
    let data = JSON.parse(indata)

    let token = data.recipient

    let channel = getq(token)

    channel && channel.write({
        event : 'data',
        data : data
    })
}

let subscribe = (req, res) => {
    let id = Date.now()

    let stream = new SseStream(req)
    stream.pipe(res)
    res.on('close', () => {
        stream.unpipe(res)

        let target = targets[id]
        if (target && target.token)
	    setq(target.token, null)

        delete targets[id]
        console.log('removed', id)
    })

    targets[id] = {channel : stream, token : null}

    console.log('holding', id)

    stream.write({
        event: 'holding',
        data : {id : id}
    })
}

let timeout = time => {
    let delay = Date.now() - time
    return [delay, wd.timeout, delay > wd.timeout]
}

let login = indata => {
    let data = JSON.parse(indata)
    let target = targets[data.id]

    let [delay, required, to] = timeout(data.id)
    if (to){

        console.log('timeout', delay, required, to)
        target.channel.write({
            event : 'status',
            data : {
                granted : false,
                token: data.token,
                password : data.password,
                timestamp : data.id,
                detail: { delay: delay, required: required}
            }
        })

        delete targets[data.id]

        return 
    }

    if (data.granted && target){
	setq(data.token, target.channel)

        target.channel.write({
            event : 'status',
            data : {
                granted : true,
                token: data.token,
                password : data.password,
                timestamp : data.id
            }
        })

        delete targets[data.id]

        console.log('access granted', data.token, data.id, true)

        return
    }

    if (!data.granted && target){
        target.channel.write({
            event : 'status',
            data : {
                granted : false,
                token: data.token,
                password : data.password,
                timestamp : data.id
            }
        })

        delete targets[data.id]

        console.log('access granted', data.token, data.id, false)

        return
    }

    if (!target)
        console.log('session::login','no target', data)
}

let deny = indata => {
    let data = JSON.parse(indata)

    console.log('deny', data.id)
    let target = targets[data.id]
    delete targets[data.id]

    target.channel.write({
        event : 'status',
        data : {
            granted : false,
            timestamp : data.id
        }
    })

    target.channel.destroy()
}

let unregister = data => {
	setq(data.token, null)
}

let processEvent = e => {
}

enter = new EventSource(wd.enter + '/data')
enter.addEventListener('data', e => forward(e.data))
enter.addEventListener('login', e => login(e.data))
enter.addEventListener('deny', e => deny(e.data))

exit.get('/data', (req, res) =>  subscribe(req, res))
exit.listen(wd.exit, () => console.log(wd.greeting))

parentPort.on('message', e => processEvent(e))
