const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const db = require('./db/db')
const schoolRouter = require('./routes/school.routes')


const app = express()
const PORT = process.env.PORT || 8080;
app.use(bodyParser.json())
app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).json({ 
        success: false,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred on the server.'
    });
});
app.use('/api',schoolRouter)
app.listen(PORT,()=>{
    console.log(`Server is Running in PORT: http://localhost:${PORT}`)
})