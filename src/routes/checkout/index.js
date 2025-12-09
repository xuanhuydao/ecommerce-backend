const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const checkoutController = require('../../controllers/checkout.controller')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

//router.use(authentication)

router.post('/review', checkoutController.checkoutReview)
module.exports = router