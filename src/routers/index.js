'use strict'

const express = require('express')
const router = express.Router()

router.use('/v1/api/auth', require('./auth.router'))

module.exports = router