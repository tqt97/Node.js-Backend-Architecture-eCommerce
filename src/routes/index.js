'use strict'

const express = require('express')
const { apiKey, checkPermission } = require('../auth/checkAuth')
const router = express.Router()

// check api key
router.use(apiKey)
router.use(checkPermission('0000'))

router.use('/v1/api', require('./access'))


module.exports = router