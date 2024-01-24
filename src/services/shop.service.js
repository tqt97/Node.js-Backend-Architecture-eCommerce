'use strict'

const shopModel = require("../models/shop.model")

const options = { email: 1, password: 1, name: 1, status: 1, roles: 1 }
const findByEmail = async ({ email, select = options }) => {
    return await shopModel.findOne({ email }).select(select).lean()
}

module.exports = { findByEmail }