const { update } = require("lodash")
const { getUnSelectData, getSelectData, convertToObjectIdMongodb } = require("../../utils")
const { Cart } = require('../cart.model')

const createUserCart = async ({ userId, product }) => {
    const query = {
        cart_userId: userId,
        cart_state: 'active'
    }
    const updateOrInsert = {
        $addToSet: {
            cart_products: product
        }
    } 
    const options = { upsert: true, new: true }

    return await Cart.findOneAndUpdate(query, updateOrInsert, options)
}

const updateUserCartQuantity = async ({ userId, product }) => {
    const { productId, quantity } = product
    const query = {
        cart_userId: userId,
        'cart_products.productId': productId,
        cart_state: 'active'
    }
    const updateSet = {
        $inc: {
            'cart_products.$.quantity': quantity
        }
    }
    const options = { upsert: true, new: true }

    return await Cart.findOneAndUpdate(query, updateSet, options)
}

const deleteUserCart = async ({ userId, productId }) => {
    const query = { cart_userId: userId, cart_state: 'active' }
    updateSet = {
        $pull: {
            cart_products: {
                productId
            }
        }
    }
    const deleteCart = await Cart.updateOne(query, updateSet)

    return deleteCart
}
module.exports = {
    createUserCart,
    updateUserCartQuantity,
    deleteUserCart
}