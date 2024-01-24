'use strict'

const JWT = require('jsonwebtoken')

/*
*  Note: publicKey get from DB
*/
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // access token
        const accessToken = await JWT.sign(payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`\n[ERROR]::Verify Token::${err.message}\n`)
            } else {
                console.log(`\n[SUCCESS]::Decode::${decode}\n`)
            }
        })

        return { accessToken, refreshToken }
    } catch (error) {
        console.error(`\n[ERROR]::createTokenPair::${error.message}\n`)
        return error
    }
}

module.exports = { createTokenPair }