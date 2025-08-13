const systemService = require('../services/systemServices')
const response = require('../utils/response/response')

const systemController = {
    getAllApi: async (req, res, next) => {
        try {
            const result = await systemService.getAllApi(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllPermission: async (req, res, next) => {
        try {
            const result = await systemService.getAllPermission(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}

module.exports = systemController
