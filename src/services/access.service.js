'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { type } = require('os')
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response')
const { token } = require('morgan')
const { findByEmail } = require('./shop.service')
const e = require('express')
const { set } = require('lodash')
const keytokenModel = require('../models/keytoken.model')
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessService {
    static login = async ({ email, password, refreshToken = null }) => {
        /*
            1 - check email in dbs
            2 - match password
            3 - create accessToken, refreshToken and save
            4 - generate tokens
            5 - get data return login
        */
        //step1
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new BadRequestError('Shop is not registered')

        //step2
        const match = await bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError('Authentication error')

        //step3
        // const privateKey = crypto.randomBytes(64).toString('hex')
        // const publicKey = crypto.randomBytes(64).toString('hex')
        const secretKey = crypto.randomBytes(64).toString('hex');

        //step4
        const tokens = await createTokenPair({ user: foundShop._id, email: foundShop.email }, secretKey)

        await KeyTokenService.createKeyToken({ userId: foundShop._id, secretKey, refreshToken: tokens.refreshToken })
        //step5
        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }
    }

    static logout = async ({ keyStore }) => {
        const keyDeleted = await KeyTokenService.removeKeyById(keyStore._id)
        console.log(keyDeleted)
        return keyDeleted
    }

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
        // const privateKey = crypto.randomBytes(64).toString('hex')
        // const publicKey = crypto.randomBytes(64).toString('hex')
        const secretKey = crypto.randomBytes(64).toString('hex')

        console.log('Genarated keys ::: ', secretKey)

        //step5: save key to keyStore
        const keyStore = await KeyTokenService.createKeyToken({
            userId: newShop._id,
            secretKey
        })

        if (!keyStore) {
            throw new BadRequestError('Error::: Cannot create key store')
        }

        //step6: create accesstoken + refreshToken
        const tokens = await createTokenPair(
            { userId: newShop._id, email },
            secretKey
        )
        console.log('Created token success::: ', tokens)

        //step7 return data
        return {
            shop: getInfoData({
                fields: ['_id', 'name', 'email'],
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
        //             shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
        //             tokens
        //         }
        //     }
        //     //const token = await
        // }
    }

    static handlerRefreshToken = async (refreshToken) => {
        /*
        check this token used ?
         */
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        if (foundToken) {
            //decode xem userid nao
            const { user, email } = await verifyJWT(refreshToken, foundToken.secretKey)
            console.log({user, email})
            //xoa tat ca token trong keystore
            await KeyTokenService.deleteKeyById(user)
            throw new ForbiddenError('Something wrong happend, pls relogin !')
        }

        //
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if(!holderToken) throw new AuthFailureError('Shop not registered ! 1')

        //verify token
        const { user, email } = await verifyJWT(refreshToken, holderToken.secretKey)
        console.log('[2] -- ',{user, email})
        //check userId
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new AuthFailureError('Shop not registered ! 2')

        //create 1 cap token moi
        const tokens = await createTokenPair({user, email}, holderToken.secretKey)

        //update token
        await keytokenModel.updateOne(
           { _id: holderToken._id},
           {
            $set: {refreshToken: tokens.refreshToken},
            $addToSet: {refreshTokensUsed: refreshToken}
           }
        )

        return {
            user: {user, email},
            tokens
        }
    }
}

module.exports = AccessService