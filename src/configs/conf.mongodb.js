'use strict'

const dev = {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 27017,
        dbName: process.env.DB_NAME || 'shopDEV'
}
const production = {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 27017,
        dbName: process.env.DB_NAME || 'shopDEV_production'
}

const config = { dev, production }
const env = process.env.NODE_ENV || 'dev'

module.exports = config[env]