const discountService = require('../services/discountService')
const response = require('../utils/response/response')

const discountController = {
    create: async (req, res, next) => {
        try {
            const result = await discountService.create(req.body)
            res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            const result = await discountService.getAll(req.query)
            res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getById: async (req, res, next) => {
        try {
            const result = await discountService.getById(req.params.id)
            res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getDiscountHistoryById: async (req, res, next) => {
        try {
            const result = await discountService.getDiscountHistoryById(req.params.id)
            res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getHistory: async (req, res, next) => {
        try {
            const result = await discountService.getHistory(req.query)
            res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    setRefund: async (req, res, next) => {
        try {
            const result = await discountService.setRefund(req.body)
            res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const result = await discountService.update(req.params.id, req.body)
            res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    delete: async (req, res, next) => {
        try {
            const result = await discountService.delete(req.params.id)
            res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}

module.exports = discountController
