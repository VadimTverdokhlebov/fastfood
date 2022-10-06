import express from 'express'
import serverRouter from "./routes/servers.js"
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url));


const PORT = 8080
const HOST = 'localhost'

app.set('view engine', 'ejs')

app.use('/api', serverRouter)

app.get('/', (req, res) => {
    res.render('index')
    
})

app.use(express.static(`${__dirname}/public`));

app.listen(PORT, HOST, function () {
    console.log(`Server listens http://${HOST}:${PORT}`)
    
  })