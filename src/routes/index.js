const express = require('express')
const router = express.Router()

const authRoute = require('./authRoute')
const userRoute = require('./userRoute')
const supplierRoute = require('./supplierRoute')
const uploadRoute = require('./uploadRoute')
const productCategoryRoute = require('./productCategoryRoute')

router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/supplier', supplierRoute)
router.use('/upload', uploadRoute)
router.use('/productCategory', productCategoryRoute)

module.exports = router
