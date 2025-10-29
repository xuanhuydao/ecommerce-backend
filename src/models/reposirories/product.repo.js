'use strict'

const { slice } = require('lodash')
const { getSelectData, getUnSelectData } = require('../../utils')
const { product, electronic, clothing, furniture } = require('../product.model')
const { Types } = require('mongoose')


const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}

    const products = product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)   
    .select(getSelectData(select))
    .lean()

    return products
}

const findProduct = async ({ product_id, unselect = [] }) => {
    return await product.findById(product_id).select(getUnSelectData(unselect))
}

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isPublish: true,
        $text: { $search: regexSearch }
        }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .lean()

    return results
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if (!foundShop) return null

    foundShop.isDraft = false
    foundShop.isPublish = true

    await foundShop.save()

    return foundShop
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if (!foundShop) return null

    foundShop.isDraft = true
    foundShop.isPublish = false

    await foundShop.save()

    return foundShop
}

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct
}