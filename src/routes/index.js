const express = require('express')
const router = express.Router()

const authRoute = require('./authRoute')
const userRoute = require('./userRoute')
const supplierRoute = require('./supplierRoute')

const warehouseRoute = require('./warehousesRoute')
const uploadRoute = require('./uploadRoute')
const productCategoryRoute = require('./productCategoryRoute')
const customerRoute = require('./customerRoute')
const brandRoute = require('./brandRoute')
const goodsReceiptRoute = require('./goodsReceiptRoute')

router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/supplier', supplierRoute)
router.use('/warehouse', warehouseRoute)
router.use('/upload', uploadRoute)
router.use('/productCategory', productCategoryRoute)
router.use('/customer', customerRoute)
router.use('/brand', brandRoute)
router.use('/goodsReceipt', goodsReceiptRoute)

module.exports = router
