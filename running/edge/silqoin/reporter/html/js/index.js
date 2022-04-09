

let es = new EventSource('/add')

let list = []
let counter = 0
const MAX_CAPACITY = 20

es.onmessage = event => {
    counter = (counter + 1) % 10000000
    list.unshift(JSON.parse(event.data))

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


let update = () => {
    let txs = document.getElementById('txs')
    txs.innerText = counter + ' txs'

    let report = document.getElementById('report')

    report.innerHTML = header + list.map( item => row(item.data)).join('')
}
