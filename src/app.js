require('dotenv').config()

const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()


// init middlewares
app.use(morgan('dev')) // dev, combined, common, short, tiny
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// init database
require('./dbs/init.mongodb')
// const {checkOverLoad} = require('./helpers/check.connect')
// checkOverLoad()

// init routes
app.use('', require('./routes'))
// handle error

module.exports = app