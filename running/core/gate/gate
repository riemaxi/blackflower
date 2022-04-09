const config = require('./config')
const {Worker} = require('worker_threads')

for(let i = 0; i<config.gates; i++){
    let [enter, exit] = [config.session.enter + i, config.session.exit + i]
    new Worker(config.session.path,  {
            workerData : {
                enter : enter,
                exit : exit,
                dimensions : config.data.dimensions,
                greeting : config.session.greeting.replace('ENTER', enter).replace('EXIT', exit)
            }
        }
    )
}