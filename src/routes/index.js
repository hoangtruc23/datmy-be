const express = require('express')
const router = express.Router()

const authRoute = require('./authRoute')
const userRoute = require('./userRoute')
const supplierRoute = require('./supplierRoute')

const warehouseRoute = require('./warehousesRoute')
const uploadRoute = require('./uploadRoute')
<<<<<<< HEAD
const productCategoryRoute = require('./productCategoryRoute')
=======
>>>>>>> 7cce48f58ffbf5295c11b2fbd118b0eb09bf7f71
const customerRoute = require('./customerRoute')

router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/supplier', supplierRoute)
router.use('/warehouse', warehouseRoute)
router.use('/upload', uploadRoute)
<<<<<<< HEAD
router.use('/productCategory', productCategoryRoute)
=======
>>>>>>> 7cce48f58ffbf5295c11b2fbd118b0eb09bf7f71
router.use('/customer', customerRoute)

module.exports = router
