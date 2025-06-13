const express = require('express')
const router = express.Router()

const authRoute = require('./authRoute')
const userRoute = require('./userRoute')
const supplierRoute = require('./supplierRoute')

router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/supplier', supplierRoute)

module.exports = router
