'use strict'

const keytokenModel = require('../models/keytoken.model')

class KeyTokenService {
    static createKeyToken = async ({userId, publicKey}) => {
        try {
            // const publicKeyString = publicKey.toString()    //publickey duoc tao ra la hash nen can chuyen qua string de luu vao database
            const tokens = await keytokenModel.create({
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