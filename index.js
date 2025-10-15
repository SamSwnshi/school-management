const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const db = require('./db/db')

const app = express()
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json())


app.listen(PORT,()=>{
    console.log(`Server is Running in PORT: http://localhost:${PORT}`)
})