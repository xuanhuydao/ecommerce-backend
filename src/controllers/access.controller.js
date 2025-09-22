'use strict'

const AccessService = require("../services/access.service")

const { OK, CREATED, SuccessResponese } = require('../core/success.responese')

class AccessController {
    login = async (req, res, next) => {
        return new SuccessResponese({
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