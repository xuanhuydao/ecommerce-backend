'use strict'

const AccessService = require("../services/access.service")

const { OK, CREATED } = require('../core/success.responese')

class AccessController {
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