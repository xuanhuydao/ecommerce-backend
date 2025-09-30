'use strict'

const AccessService = require("../services/access.service")

const { OK, CREATED, Successresponse } = require('../core/success.response')

class AccessController {
    hanlderRefreshToken = async(req, res, next) => {
        new Successresponse({
            message: 'Get token success',
            metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
        }).send(res)
    }

    logout = async (req, res, next) => {
        return new Successresponse({
            message: 'logout success',
            metadata: await AccessService.logout({keyStore: req.keyStore})
        }).send(res)
    }

    login = async (req, res, next) => {
        return new Successresponse({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    signUp = async (req, res, next) => {

        // return res.status(200).json({
        //     message: '',
        //     metadata: ''
        // })
        return new CREATED({
            message: 'created ok !',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res)
        // return res.status(201).json(await AccessService.signUp(req.body))

    }
}

module.exports = new AccessController()