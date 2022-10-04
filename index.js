const express = require('express')
const app = express()
const handlebars = require('express-handlebars')

const PORT = 8000
const HOST = 'localhost'

app.use(express.static(`${__dirname}/public`));

app.listen(PORT, HOST, function () {
    console.log(`Server listens http://${HOST}:${PORT}`)
  })