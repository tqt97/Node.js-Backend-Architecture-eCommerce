const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()


// init middlewares
app.use(morgan('dev')) // dev, combined, common, short, tiny
app.use(helmet())
app.use(compression())
// init database
// init routes
app.get('/', (req, res, next) => {
    const str = "Hello World"
    return res.status(200).json({ 
        message: 'Hello World',
        metadata: str.repeat(1000) })
})
// handle error

module.exports = app