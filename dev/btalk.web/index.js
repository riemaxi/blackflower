const config = require('./config')
const {Worker, workerData} = require('worker_threads')

let notify = m => {
    console.log(m)
}

for(let i=0; i < config.size; i++){
    new Worker(config.session.path, { 
        workerData : {
            html : config.session.html,
            port : config.session.port, 
            greeting : config.session.greeting,
            index : i,
            stream_port: config.session.stream.port
        }
    }).on('message', e => notify(e))
}

