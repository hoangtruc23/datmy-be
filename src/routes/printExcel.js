const express = require('express')
const previousDebtController = require('../controllers/previousDebtController')
const router = express.Router()

router.post('/importFile', previousDebtController.importFile)

module.exports = router