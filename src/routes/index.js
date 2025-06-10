const express = require('express')
const router = express.Router()

const authRoute = require('./authRoute')
const userRoute = require('./userRoute')
const { isAuthenticated } = require('../middleware/auth')

router.use('/auth', authRoute)
router.use('/user', isAuthenticated, userRoute)

module.exports = router
