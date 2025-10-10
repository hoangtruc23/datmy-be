const response = require('../utils/response/response')
const orderService = require('../services/orderService')

const orderController = {
    getAll: async (req, res, next) => {
        try {
            const result = await orderService.getAll(req.query, req.userId)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getById: async (req, res, next) => {
        try {
            const { orderIds } = req.body
            console.log('orderIds', orderIds)
            const result = await orderService.getById(orderIds)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    delete: async (req, res, next) => {
        try {
            const result = await orderService.delete(req.params.orderId)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    create: async (req, res, next) => {
        try {
            const result = await orderService.create(req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const result = await orderService.update(
                req.params.orderId,
                req.body,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}
module.exports = orderController
