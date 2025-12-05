const express = require('express')
const contractController = require('../controllers/contractController')

const router = express.Router()

// router.post(
//     '/create',
//     // validate(customerValidation.create),
//     contractController.create,
// )

router.get('/getOverview', contractController.getOverview)
router.get('/getAll', contractController.getAll)
router.get('/getById/:maintenanceId', contractController.getById)
router.post('/create', contractController.create)
router.put('/update', contractController.update)

module.exports = router
