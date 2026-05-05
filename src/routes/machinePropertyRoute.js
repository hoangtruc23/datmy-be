const express = require('express')
const machinePropertyController = require('../controllers/machinePropertyController')
const router = express.Router()

//machinePropery/create
router.post(
    '/create',
    machinePropertyController.create,
)
//machinePropery/update
router.post(
    '/update/:id',
    machinePropertyController.update,
)
//machinePropery/delete
router.post(
    '/delete/:id',
    machinePropertyController.delete,
)


module.exports = router