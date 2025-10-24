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

    //query
    /**
     * @description get all drafts for shop
     * @param {Number} limit 
     * @param {Number} skip
     * @returns {JSON} 

     */
    getAllDraftsForShop = async (req, res, next) => {
        new Successresponse({
            message: 'Get list draft success !',
            metadata: await ProductServiceV2.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }
    //end query
}

module.exports = new ProductController()