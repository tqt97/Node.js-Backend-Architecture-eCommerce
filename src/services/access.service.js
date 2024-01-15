'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    constructor() {
    }

    static signUp = async ({ name, email, password }) => {
        try {
            // step 1: check if email exists
            const holderModel = await shopModel.findOne({ email }).lean()

            if (holderModel) {
                return {
                    code: '400',
                    message: 'Email already exists',
                    status: 'error'
                }
            }

            const passwordHash = await bcrypt.hash(password, 10)
            console.log(`[SUCCESS]::signUp::passwordHash::${passwordHash}`);

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
                    return {
                        code: '500',
                        message: 'Create token error',
                        status: 'error'
                    }
                }

                const publicKeyObject = crypto.createPublicKey(publicKeyString)

                // create token pair
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKeyObject, privateKey)

                return {
                    code: 201,
                    message: 'Sign up success',
                    'metadata': {
                        'shop': getInfoData({ fields: ['_id', 'name', 'email', 'roles'], object: newShop }),
                        'tokens': tokens
                    },
                }
            }

            return {
                code: 200,
                metadata: null
            }

        } catch (error) {
            return {
                code: '500',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService