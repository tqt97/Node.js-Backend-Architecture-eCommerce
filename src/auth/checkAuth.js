'use strict'

const { findById } = require("../services/apiKey.service")

const HEADER = {
    API_KEY: 'x-api-key',
    ACCESS_TOKEN: 'x-access-token',
    REFRESH_TOKEN: 'x-refresh-token',
    USER_ID: 'x-user-id',
    USER_ROLES: 'x-user-roles',
    AUTHORIZATION: 'Authorization'
}

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            return res.status(401).json({
                message: `Unauthorized: missing api key`,
            })
        }

        // check object key
        const objectKey = await findById(key)
        if (!objectKey) {
            return res.status(401).json({
                message: `Unauthorized: invalid api key`,
            })
        }

        req.objectKey = objectKey
        return next()

    } catch (error) {
        return res.status(401).json({
            message: `Unauthorized: ${error.message}`,
        })
    }
}

const checkPermission = (permission) => {
    return async (req, res, next) => {
        if (!req.objectKey.permissions) {
            return res.status(401).json({
                message: `Unauthorized: missing permissions`,
            })
        }
        console.log(`[INFO]::Permissions::${req.objectKey.permissions}`)

        if (!req.objectKey.permissions.includes(permission)) {
            return res.status(401).json({
                message: `Unauthorized: permission denied`,
            })
        }
        return next()
    }
}

const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

module.exports = { apiKey, checkPermission, asyncHandler }