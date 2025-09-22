'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { type } = require('os')
const { BadRequestError, ConflictRequestError } = require('../core/error.responese')
const { token } = require('morgan')
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessService {
    static signUp = async ({ name, email, password }) => {


        //step1: check email exists?

        const holderShop = await shopModel.findOne({ email }).lean()
        if (holderShop) {
            throw new BadRequestError('Error: Shop already registered !')
        }
        //step2: hash password 
        const passwordHash = await bcrypt.hash(password, 10)

        //step3: crate new shop
        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

        if (!newShop) {
            throw new BadRequestError('Error:: Create shop failed !')
        }

        //step4 create publicKey, privateKey
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        console.log('Genarated keys ::: ', {privateKey, publicKey})

        //step5: save key to keyStore
        const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
        })

        if(!keyStore) {
            throw new BadRequestError('Error::: Cannot create key store')
        }

        //step6: create accesstoken + refreshToken
        const tokens = await createTokenPair(
            {userId: newShop._id, email},
            publicKey,
            privateKey
        )
        console.log('Created token success::: ', tokens)

        //step7 return data
        return {
            shop: getInfoData({
                fileds: ['_id', 'name', 'email'],
                object: newShop
            }),
            tokens
        }
        // if (newShop) {
        //     //created privateKey, publicKey
        //     // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        //     //     modulusLength: 4096,
        //     //     publicKeyEncoding: {
        //     //         type: 'pkcs1', //pkcs8
        //     //         format: 'pem'
        //     //     },
        //     //     privateKeyEncoding: {
        //     //         type: 'pkcs1',
        //     //         format: 'pem'
        //     //     }

        //     // })

        //     const privateKey = crypto.randomBytes(64).toString('hex')
        //     const publicKey = crypto.randomBytes(64).toString('hex')
        //     // public key cryptoGraphy standard 1

        //     console.log({ privateKey, publicKey })

        //     const keyStore = await KeyTokenService.createKeyToken({
        //         userId: newShop._id,
        //         publicKey,
        //         privateKey
        //     })

        //     if (!keyStore) {
        //         throw new BadRequestError('Error:: Cannot create key store !')
        //     }

        //     const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
        //     console.log(`Created token success:::`, tokens)

        //     return {
        //         code: 201,
        //         metadata: {
        //             shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop }),
        //             tokens
        //         }
        //     }
        //     //const token = await
        // }
    }
}

module.exports = AccessService