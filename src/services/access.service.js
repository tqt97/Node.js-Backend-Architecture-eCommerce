'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
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

    constructor() { }

    static signUp = async ({ name, email, password }) => {
        const holderModel = await shopModel.findOne({ email }).lean()

        if (holderModel) {
            throw new ConflictRequestError('Email already exists')
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newShop = await shopModel.create({ name, email, password: passwordHash, roles: [RoleShop.SHOP] })

        if (newShop) {
            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                }
            })

            const publicKeyString = await KeyTokenService.createKeyToken({ userId: newShop._id, publicKey })
            if (!publicKeyString) {
                return new BadRequestError('Key token not created')
            }

            const publicKeyObject = crypto.createPublicKey(publicKeyString)

            // create token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKeyObject, privateKey)

            return {
                    'shop': getInfoData({ fields: ['_id', 'name', 'email', 'roles'], object: newShop }),
                    'tokens': tokens
            }
        }

        return null
    }
}

module.exports = AccessService