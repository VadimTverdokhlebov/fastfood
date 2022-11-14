import express from 'express'
import serverRouter from "./routes/servers.js"
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';


const app = express();
const PORT = 8080
const HOST = 'localhost'

app.use(cors());

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use('/api', serverRouter)

app.use(express.static(`${__dirname}/public`));

app.listen(PORT, HOST, function () {
    console.log(`Server listens http://${HOST}:${PORT}`)
    
  })