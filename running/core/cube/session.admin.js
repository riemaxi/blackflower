const SseStream = require('ssestream').default
const {workerData, parentPort} = require('worker_threads')
const express = require('express')
const { ok } = require('assert')

let eventSubscriber
let wd = workerData

let mainListener = () => {
    const app = express()
    app.use(express.json())

    app.listen(wd.port, () => console.log(wd.greeting))

    app.post('/register', (req, res) => register(req, res))
    app.post('/unregister', (req, res) => unregister(req, res))
    app.post('/login', (req, res) => login(req, res))

    let register = (req, res) => {
        console.log('register', req.body)
        res.send('ok register')
        res.end()
    }

    let unregister = (req, res) => {
        console.log('unregister', req.body)

        parentPort.postMessage({
                event : 'unsubscribe',
                data : req.body
        })

        res.send('ok unregister')
        res.end()
    }

    let ok = data => {
        return data.token.length == wd.dimensions
    }

    let login = (req, res) => {
        
        if (ok(req.body)){
            console.log('session.admin::ok', req.body)
            parentPort.postMessage({
                    id : 'login',
                    data : req.body
            })

            res.send('1')
            }
        else{
            parentPort.postMessage({
                id : 'login-deny',
                data : req.body
            })

            res.send('0')
        }
        res.end()
    }
}

let eventService = () => {
    let subscribe = (req, res) => {
        eventSubscriber = res

        req.on('close', () => {
            eventSubscriber = null
            console.log('event subscriber removed')
        })
    }

    let app = express()
    app.listen(wd.internal.port, () => console.log(wd.internal.greeting))
    app.get('/request', (req, res) => subscribe(req, res) )
}

let parentListener = () => {
    parentPort.on('message', e => {
        eventSubscriber.write(e)
    })
}

parentListener()
mainListener()
eventService()
