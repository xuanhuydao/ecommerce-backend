'use strict'

const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, secretKey) => {
    try {
        //accessToken
        const accessToken = JWT.sign(payload, secretKey, {
            expiresIn: '2 days'
        })

        const refreshToken = JWT.sign(payload, secretKey, {
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, secretKey, (error, decode) => {
            if (error) {
                console.log(`error verify::: `, error)
            } else {
                console.log(`decode verify:::`, decode)
            }
        })

        return { accessToken, refreshToken }
    } catch (error) {

    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /*
        1 - check userId missing???
        2 - get AccessToken
        3 - verifyToken
        4 - check user in dbs
        5 - check keyStore with this userId
        6 - Ok all => return next
    */

    //1
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid request')

    //2
    const keyStore = await findByUserId(req.headers[HEADER.CLIENT_ID])
    if (!keyStore) throw new NotFoundError('Not found keyStore')

    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid keyStore')

    try {
        const decodeUser = await JWT.verify(accessToken, keyStore.secretKey)
        console.log(decodeUser)
        if (userId !== decodeUser.user) throw new AuthFailureError('Invalid Userid')
        req.keyStore = keyStore

        return next()
    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token, secretKey) => {
    return await JWT.verify(token, secretKey)
}
module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}