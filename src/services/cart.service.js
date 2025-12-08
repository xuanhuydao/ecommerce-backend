const { convertToObjectIdMongodb } = require('../utils')
const { BadRequestError, NotFoundError } = require('../core/error.response')

const { Cart } = require('../models/cart.model')
const { createUserCart, updateUserCartQuantity, deleteUserCart } = require('../models/reposirories/cart.repo')
const { getProductById } = require('../models/reposirories/product.repo')

class CartService {
    static async addToCart({ userId, product = {} }) {
        //check xem cart ton tai hay khong
        const userCart = await Cart.findOne({
            cart_userId: userId
        })

        if (!userCart) {
            return await createUserCart({ userId, product })
        }

        //neu co gio hang roi nhung chua co san pham
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        //gio hang ton tai, va co san pham roi thi update quantity
        return await updateUserCartQuantity({ userId, product })
    }

    /**
    {
    "userId": 1001,
    "shop_order_ids": {
        "shopId": "68dab39e20d5483042ffae59",
        "item_products": [
            {
            "quantity": 3,
            "price": 299000,
            "shopId": "68dab39e20d5483042ffae59",
            "old_quantity": 1,
            "productId": "6909c052fc92c9c1a36e86dc"
            }
        ]
    }
}
     */
    static async addtoCartV2({ userId, shop_order_ids }) {
        const  [{productId, quantity, old_quantity, shopId}]  = shop_order_ids.item_products
        //check product
        const foundProduct = await getProductById({ productId })
        if (!foundProduct) throw new NotFoundError('Product not exists')

        //compare 
        if (foundProduct.product_shop.toString() !== shopId) throw new NotFoundError('Product do not belong to the shop')

        if (quantity === 0) {

        }

        return await updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteUserCart({ userId, productId }) {
        return await deleteUserCart({ userId, productId })
    }

    static async getListCart({ userId }) {
        return await Cart.find({ cart_userId: userId })
    }
}

module.exports = CartService