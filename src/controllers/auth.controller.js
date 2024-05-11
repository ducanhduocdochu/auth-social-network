'use strict'
const { CREATED, SuccessResponse } = require('../core/success.reponse')
const AuthService = require('../services/auth.service')

class AuthController{
    register = async ( req, res, next ) => {
        new CREATED({
            message: 'Registered successfully!',
            metadata: await AuthService.register(req.body),
        }).send(res)
    }

    login = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Login successfully!',
            metadata: await AuthService.login(req.body)
        }).send(res)
    }

    logout = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Logout Success!',
            metadata: await AuthService.logout(req.keyStore, req.refreshToken)
        }).send(res)
    }

    handlerRefreshToken = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get token success!',
            metadata: await AuthService.handlerRefreshToken({refreshToken: req.refreshToken, user: req.user, keyStore: req.keyStore})
        }).send(res)
    }
    
}

module.exports = new AuthController()