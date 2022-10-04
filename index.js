const app = require('express')()

const PORT = 3000
const HOST = 'localhost'

app.get('/', (req, res) => {
    res.status(200).type('text/plain')
    res.send('Home page')
})

app.listen(PORT, HOST, function () {
    console.log(`Server listens http://${HOST}:${PORT}`)
  })