const response = require('../utils/response/response')
const technicianService = require('../services/technicianService')

const technicianController = {
    getAll: async (req, res, next) => {
        try {
            const result = await technicianService.getAll(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getById: async (req, res, next) => {
        try {
            const result = await technicianService.getById(
                req.params.technicianId,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getOverall: async (req, res, next) => {
        try {
            const result = await technicianService.getOverall()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    create: async (req, res, next) => {
        try {
            const result = await technicianService.create(req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const result = await technicianService.update(
                req.params.technicianId,
                req.body,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    changeActive: async (req, res, next) => {
        try {
            const result = await technicianService.changeActive(
                req.params.technicianId,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}
module.exports = technicianController
