'use strict'

const { filter, update } = require('lodash')
const keyTokenModel = require('../models/keytoken.model')

class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            //level 0
            // const publicKeyString = publicKey.toString()    //publickey duoc tao ra la hash nen can chuyen qua string de luu vao database
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })  
            const filter = {user: userId}, update = {
                publicKey,privateKey, refreshTokensUsed: [], refreshToken
            }, options = {upsert: true, new: true}
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }
}

module.exports = KeyTokenService