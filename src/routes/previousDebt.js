const express = require('express')
const previousDebtController = require('../controllers/previousDebtController')
const { uploadMemoryFile } = require('../middlewares/upload')

const router = express.Router()

router.post('/importFile', uploadMemoryFile.single('file'), previousDebtController.importFile)

module.exports = router