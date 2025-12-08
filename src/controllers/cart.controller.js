const CartService = require('../services/cart.service')
const { Successresponse } = require('../core/success.response')

class CartController {
    /**
     * @des add to cart for user 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @method POST
     */
    //new
    addToCart = async (req, res, next ) => {
        new Successresponse({
            message: 'Create new cart success',
            metadata: await CartService.addToCart({ ...req.body })
        }).send(res)
    }

    //update + -
    update = async (req, res, next) => {
        new Successresponse({
            message: 'update cart success',
            metadata: await CartService.addtoCartV2({ ...req.body })
        }).send(res)
    }

    delete = async (req, res, next) => {
        new Successresponse({
            message: 'deleted cart success',
            metadata: await CartService.deleteUserCart({ ...req.body })
        }).send(res)
    }

    getListCart = async (req, res, next) => {
        new Successresponse({
            message: 'get list cart success',
            metadata: await CartService.getListCart({ ...req.query })
        }).send(res)
    }
}

module.exports = new CartController()