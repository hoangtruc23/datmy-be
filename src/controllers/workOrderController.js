const response = require('../utils/response/response')
const workOrderService = require('../services/workOrderService')

const workOrderController = {
    getAll: async (req, res, next) => {
        try {
            const result = await workOrderService.getAll(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getById: async (req, res, next) => {
        try {
            const result = await workOrderService.getById(
                req.params.workOrderId,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getOverall: async (req, res, next) => {
        try {
            const result = await workOrderService.getOverall()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    create: async (req, res, next) => {
        try {
            const result = await workOrderService.create(req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const result = await workOrderService.update(
                req.params.workOrderId,
                req.body,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    delete: async (req, res, next) => {
        try {
            const result = await workOrderService.delete(req.params.workOrderId)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}
module.exports = workOrderController
