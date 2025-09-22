'use strict'

const keyTokenModel = require('../models/keytoken.model')

class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey}) => {
        try {
            // const publicKeyString = publicKey.toString()    //publickey duoc tao ra la hash nen can chuyen qua string de luu vao database
            const tokens = await keyTokenModel.create({
                user: userId,
                publicKey,
                privateKey
            })

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }
}

module.exports = KeyTokenService