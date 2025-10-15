const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const db = require('./db/db')
const schoolRouter = require('./routes/school.routes')


const app = express()
const PORT = process.env.PORT || 8080;
app.use(bodyParser.json())

app.use('/api',schoolRouter)
app.listen(PORT,()=>{
    console.log(`Server is Running in PORT: http://localhost:${PORT}`)
})