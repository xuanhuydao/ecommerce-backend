const express = require("express")
const asyncHandler = require('../../helpers/asyncHandler')
const cartController = require('../../controllers/cart.controller')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

router.use(authentication)

router.post('', asyncHandler(cartController.addToCart))
router.patch('', asyncHandler(cartController.update))
router.delete('', asyncHandler(cartController.delete))
router.get('', asyncHandler(cartController.getListCart))

module.exports = router