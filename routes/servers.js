import {Router} from 'express'
import {getProduct} from '../controllers/servers.js'

const router = Router()

router.get('/', getProduct)

export default  router 