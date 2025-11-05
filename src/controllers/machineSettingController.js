const response = require('../utils/response/response')
const machineSettingService = require('../services/machineSettingService')

const machineSettingController = {
    getMachine: async (req, res, next) => {
        try {
            const result = await machineSettingService.getMachine(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllProperties: async (req, res, next) => {
        try {
            const result = await machineSettingService.getAllProperties()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getDefaultValue: async (req, res, next) => {
        try {
            const result = await machineSettingService.getDefaultValue(
                req.params.propId,
                req.query,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    create: async (req, res, next) => {
        try {
            const result = await machineSettingService.create(req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            const result = await machineSettingService.getAll(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getById: async (req, res, next) => {
        try {
            const result = await machineSettingService.getById(
                req.params.machineSettingId,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const result = await machineSettingService.update(
                req.params.machineSettingId,
                req.body,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    delete: async (req, res, next) => {
        try {
            const result = await machineSettingService.delete(
                req.params.machineSettingId,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}

module.exports = machineSettingController
