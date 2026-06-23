const response = require('../utils/response/response')
const workOrderService = require('../services/workOrderService')

const workOrderController = {
    dashboard: async (req, res, next) => {
        try {
            const result = await workOrderService.dashboard(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            const result = await workOrderService.getAll(req.userId, req.query)
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
    getAllState: (req, res, next) => {
        try {
            const result = workOrderService.getAllState()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllProvinces: async (req, res, next) => {
        try {
            const result = await workOrderService.getAllProvinces()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllWards: async (req, res, next) => {
        try {
            const result = await workOrderService.getAllWards(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllPriority: (req, res, next) => {
        try {
            const result = workOrderService.getAllPriority()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllWorkType: (req, res, next) => {
        try {
            const result = workOrderService.getAllWorkType()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllType: (req, res, next) => {
        try {
            const result = workOrderService.getAllType()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllWorkRequestSource: (req, res, next) => {
        try {
            const result = workOrderService.getAllWorkRequestSource()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}
module.exports = workOrderController
