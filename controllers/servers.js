'use strict'

import fs from 'fs'

let dataProduct = fs.readFileSync('data.json')
let product = JSON.parse(dataProduct)


export const getProduct = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(product) 
    
}