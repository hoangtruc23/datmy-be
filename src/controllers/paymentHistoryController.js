const paymentHistoryService = require('../services/paymentHistoryService')
const response = require('../utils/response/response')

const paymentHistoryController = {
    create: async (req, res, next) => {
        try {
            const payment = await paymentHistoryService.create(req.body)
            return res.status(200).json(response.success(payment))
        } catch (err) {
            next(err)
        }
    },

    update: async (req, res, next) => {
        try {
            const payment = await paymentHistoryService.update(
                req.params.id,
                req.body,
            )
            return res.status(200).json(response.success(payment))
        } catch (err) {
            next(err)
        }
    },

    getAll: async (req, res, next) => {
        try {
            const { page, limit, search } = req.query
            const data = await paymentHistoryService.getAll(page, limit, search)
            return res.status(200).json(response.success(data))
        } catch (err) {
            next(err)
        }
    },
    getAllPaymentMethod: async (req, res, next) => {
        try {
            const paymentMethods = await paymentHistoryService.getAllPaymentMethod()
            return res.status(200).json(response.success(paymentMethods))
        } catch (err) {
            next(err)
        }
    },

    getById: async (req, res, next) => {
        try {
            const payment = await paymentHistoryService.getById(req.params.id)
            return res.status(200).json(response.success(payment))
        } catch (err) {
            next(err)
        }
    },

    delete: async (req, res, next) => {
        try {
            await paymentHistoryService.delete(req.params.id)
            return res.status(200).json(response.success(null))
        } catch (err) {
            next(err)
        }
    },
}

module.exports = paymentHistoryController
