const config = require('./config')

const express = require('express')
const app = express()
app.use(express.static(config.html))

app.listen(config.port, () => console.log(config.greeting(config.port)) )
