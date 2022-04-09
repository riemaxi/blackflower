const config = require('./config')
const {Worker} = require('worker_threads')

let sessions = []
for(let i = 0; i<config.gates; i++){
    let [enter, exit] = [config.session.enter.host + ':' + (config.session.enter.port + i), config.session.exit + i]
    let session = new Worker(config.session.path,  {
            workerData : {
                enter: enter,
                exit : exit,
                dimensions : config.data.dimensions,
                greeting : config.session.greeting.replace('ENTER', enter).replace('EXIT', exit)
            }
        }
    )

    sessions.push(session)
}

let forward = e => {
    sessions[e.data.band].postMessage(e)
}

new Worker(
    config.admin.path,
    {
        workerData : {
            port : config.admin.port,
            dimensions : config.data.dimensions,
            internal : {
                port : config.internal.port,
                greeting : config.internal.greeting.replace('PORT', config.internal.port)
            },
            greeting : config.admin.greeting.replace('PORT', config.admin.port)
        }
    }
).on('message', e => forward(e))