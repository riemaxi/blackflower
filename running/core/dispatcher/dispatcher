const config = require('./config')
const {Worker} = require('worker_threads')

for(let i=0; i<config.gates; i++){
    let [enter, exit] = [config.session.enter.host + ':' + (config.session.enter.port + i), config.session.exit + i]
    new Worker(config.session.path, {
        workerData : {
            timeout : config.session.timeout,
            enter : enter,
            exit : exit,
            dimensions : config.data.dimensions,
            greeting : config.session.greeting.replace('ENTER', enter).replace('EXIT', exit)
        }

    })
}


new Worker(
    config.admin.path,
    {
        workerData : {
            adminhost : config.admin.host,
            greeting : config.admin.greeting.replace('PORT', config.admin.port)
        }
    }
)