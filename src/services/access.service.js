'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, ConflictRequestError } = require("../core/error.response")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static signUp = async ({ name, email, password }) => {
        const holderModel = await shopModel.findOne({ email }).lean()

        if (holderModel) {
            throw new BadRequestError('Email already exists')
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newShop = await shopModel.create({ name, email, password: passwordHash, roles: [RoleShop.SHOP] })

        if (newShop) {

            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })
            if (!keyStore) {
                return new BadRequestError('keyStore error')
            }

            // create token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)

            return {
                'shop': getInfoData({ fields: ['_id', 'name', 'email', 'roles'], object: newShop }),
                publicKey,
                privateKey
            }
        }

        return null
    }
}

module.exports = AccessService