'use strict'

const express = require('express')
const authController = require('../controllers/auth.controller')
const asyncHandler = require('../helpers/asyncHandler')
const { authentication } = require('../controllers/middlewares/authUtils.middleware')
const router = express.Router()

// Register
router.post('/register', asyncHandler(authController.register))
// Login
router.post('/login', asyncHandler(authController.login))

router.use(authentication)
// Logout
router.post('/logout', asyncHandler(authController.logout))
// Refresh token
router.post('/refresh', asyncHandler(authController.handlerRefreshToken))

module.exports = router