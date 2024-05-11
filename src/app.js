const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const bodyParser = require('body-parser');
const {checkOverload} = require('./helpers/check.connect');
const cors = require('cors');
const app = express()
require('dotenv').config()
// init middlewares
app.use(cors());
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Middleware để giới hạn kích thước yêu cầu
app.use((req, res, next) => {
    bodyParser.json({ limit: '1mb' })(req, res, (err) => {
        if (err && err instanceof SyntaxError && err.status === 413 && err.message === 'Request body is too large') {
            throw new RequestTooLong('Error: Request too long') 
        } else {
            next();
        }
    });
});

// checkOverload()
// init db
require('./dbs/init.postgre')
// init routes 
app.use('', require('./routers'))

// handling error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const status = error.status || 500
    return res.status(status).json({
        status: 'error',
        code: status,
        stack: error.stack,
        message: error.message || 'Interal Server Error'
    })
})

module.exports = app