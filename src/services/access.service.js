'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, ConflictRequestError, AuthFailureError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    /*
    * Login
    * Step 1: Check email
    * Step 2: Check password
    * Step 3: Create token
    * Step 4: Create key token
    * Step 5: Return
    * */
    static login = async ({ email, password, refreshToken = null }) => {
        const shop = await findByEmail({ email })
        if (!shop) throw new BadRequestError('Shop not found')

        const match = bcrypt.compareSync(password, shop.password)
        if (!match) throw new AuthFailureError('Password is not correct')

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const { _id: userId } = shop

        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)
        console.log(`\n[AccessService]::createTokenPair::${JSON.stringify(tokens)}\n`);

        await KeyTokenService.createKeyToken({
            userId,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        })

        return {
            'shop': getInfoData({ fields: ['_id', 'name', 'email', 'roles'], object: shop }),
            tokens
        }

    }

    static signUp = async ({ name, email, password }) => {
        const holderModel = await shopModel.findOne({ email }).lean()

        if (holderModel) throw new BadRequestError('Email already exists')

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
            if (!keyStore) return new BadRequestError('Create key token error')
            
            // create token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)

            return {
                'shop': getInfoData({ fields: ['_id', 'name', 'email', 'roles'], object: newShop }),
                tokens
            }
        }

        return null
    }
}

module.exports = AccessService