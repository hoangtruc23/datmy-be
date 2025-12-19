const machinePropertyService = require('../services/machinePropertyService')
const response = require('../utils/response/response')


const machinePropertyController = {
    // getAllProperties: async (req, res, next) => {
    //     try {
    //         const result = await machineSettingService.getMachine(req.query)
    //         return res.status(200).json(response.success(result))
    //     } catch (error) {
    //         next(error)
    //     }
    // },
    create: async (req, res, next) => {
        try {
            const result = await machinePropertyService.create(req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}

module.exports = machinePropertyController