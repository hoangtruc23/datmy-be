const express = require('express')
const machinePropertyController = require('../controllers/machinePropertyController')
const router = express.Router()


//machinePropery/create
router.post(
    '/create',
    machinePropertyController.create,
)


module.exports = router