
class Histogram{
    constructor( area ){
        this.area = document.getElementById(area)
    }

    update( items ){
        let max = Math.min(1000, items.reduce( (a,b) => a >= b?a:b))
        let scale = 60/max
        for(let i of [0,1,2,3,4,5,6,7,8,9,10]){
            this.area.innerHTML = items.map( value => `<label style="height: ${Math.min(60,value * scale)}px; background-color: #d2cce4"></label>`)
        }
    }
}

let es = new EventSource('/add')

let list = []
let txs = 0
let lastTxs = 0
let tps = 0
let tpsPoint = []

let histogram = new Histogram('histogram')

const MAX_CAPACITY = 20

setInterval(() =>{
    tps = txs - lastTxs
    lastTxs = txs

    tpsPoint.push(tps)
    if (tpsPoint.length > 10)
        tpsPoint.shift()

}, 1000)

es.onmessage = event => {
    let item = JSON.parse(event.data)
    list.unshift(item)

    txs = item.txs

    if (list.length >= MAX_CAPACITY)
        list.pop()

    update()

}


let row = data => `<div class='Row'>
    <label class='Col'>${data.timestamp}</label>
    <label class='Col'>${data.amount} slq</label>
    <label class='Col'>${data.from}</label>
    <label class='Col'>${data.to}</label>
    <label class='Col'>${data.reason}</label>
</div>` 

let header = `<div class='Header'>
    <label class='Col'>timestamp</label>
    <label class='Col'>amount</label>
    <label class='Col'>from</label>
    <label class='Col'>to</label>
    <label class='Col'>reason</label>
</div>` 


let updateNumbers = () => {
    let elemTxs = document.getElementById('txs')
    elemTxs.innerText = txs

    let elemTps = document.getElementById('tps')
    elemTps.innerText = tps
}

let updateTable = () => {
     let report = document.getElementById('report')
    report.innerHTML = header + list.map( item => row(item.data)).join('')
}

let updateHistogram = () => {
    histogram.update( tpsPoint )
}

let update = () => {
    updateNumbers()
    updateTable()
    updateHistogram()
}