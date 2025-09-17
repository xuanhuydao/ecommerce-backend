'use strict'

const apikeyModel = require("../models/apikey.model")
const crypto = require('crypto')

const findById = async ({ key}) => {
    // const apiKey = await apikeyModel.create({key: crypto.randomBytes(64).toString('hex'), permisstions: ['0000']})
    // console.log(apiKey)
    const objKey = await apikeyModel.findOne({key, status: true}).lean()
    return objKey
}

module.exports = {
    findById
}