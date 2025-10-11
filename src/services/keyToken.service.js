'use strict'

const { filter, update } = require('lodash')
const keyTokenModel = require('../models/keytoken.model')
const { Types } = require('mongoose')
class KeyTokenService {
    static createKeyToken = async ({ userId, secretKey, refreshToken }) => {
        try {
            //level 0
            // const publicKeyString = publicKey.toString()    //publickey duoc tao ra la hash nen can chuyen qua string de luu vao database
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })  
            const filter = { user: userId }, update = {
                secretKey, refreshTokensUsed: [], refreshToken
            }, options = { upsert: true, new: true }
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.secretKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) })
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({refreshToken: refreshToken}).lean()
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }

    static deleteKeyById = async (user) => {
        return await keyTokenModel.deleteOne({user: user})
    }

    static removeKeyById = async (_id) => {
        return await keyTokenModel.deleteOne({ _id })
    }

}

module.exports = KeyTokenService