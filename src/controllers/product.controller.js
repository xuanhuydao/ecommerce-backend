'use strict'

const { Successresponse } = require('../core/success.response')
const ProductService = require('../services/product.service')
const ProductServiceV2 = require('../services/product.service.xxx')

class ProductController {
    createProduct = async (req, res, next) => {
        // new Successresponse({
        //     message: 'Created product!',
        //     metadata: await ProductService.createProduct(req.body.product_type, {
        //          ...req.body,
        //           product_shop: req.user.userId 
        //     })
        // }).send(res)

        new Successresponse({
            message: 'Created product!',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                 ...req.body,
                  product_shop: req.user.userId 
            })
        }).send(res)
    }
}

module.exports = new ProductController()