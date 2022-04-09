const {workerData, parentPort} = require('worker_threads')
const EventSource = require('eventsource')

let wd = workerData

let es = new EventSource(wd.adminhost)
es.addEventListener('data', e => parentPort.postMessage(e.data))