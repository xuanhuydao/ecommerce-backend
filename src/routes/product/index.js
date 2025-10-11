const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const productController = require('../../controllers/product.controller')
const { authentication } = require('../../auth/authUtils')
const router = express.Router() 

//authentication
router.use(authentication)

router.post('', asyncHandler(productController.createProduct))

module.exports = router