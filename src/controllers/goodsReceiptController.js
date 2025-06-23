const goodsReceiptService = require('../services/goodsReceiptService')
const response = require('../utils/response/response')

const goodsReceiptController = {
    getAll: async (req, res, next) => {
        try {
            const result = await goodsReceiptService.getAll(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getById: async (req, res, next) => {
        try {
            const { goodsReceiptId } = req.params
            const result = await goodsReceiptService.getById(goodsReceiptId)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    createTemporary: async (req, res, next) => {
        try {
            const currentUserId = req.userId
            const result =
                await goodsReceiptService.createTemporary(currentUserId)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    create: async (req, res, next) => {
        try {
            const currentUserId = req.userId
            const { goodsReceiptId } = req.params
            const result = await goodsReceiptService.create(
                goodsReceiptId,
                req.body,
                currentUserId,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const currentUserId = req.userId
            const { goodsReceiptId } = req.params
            const result = await goodsReceiptService.update(
                goodsReceiptId,
                req.body,
                currentUserId,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    addProduct: async (req, res, next) => {
        try {
            const result = await goodsReceiptService.addProduct(req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    updateProduct: async (req, res, next) => {
        try {
            const { goodsReceiptDetailId } = req.params
            const result = await goodsReceiptService.updateProduct(
                goodsReceiptDetailId,
                req.body,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    deleteProduct: async (req, res, next) => {
        try {
            const { goodsReceiptDetailId } = req.params
            const result =
                await goodsReceiptService.deleteProduct(goodsReceiptDetailId)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    confirmQuantity: async (req, res, next) => {
        try {
            const { goodsReceiptDetailId } = req.params
            const currentUserId = req.userId
            const result = await goodsReceiptService.confirmQuantity(
                goodsReceiptDetailId,
                req.body,
                currentUserId,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    approval: async (req, res, next) => {
        try {
            const currentUserId = req.userId
            const result = await goodsReceiptService.approval(
                req.body,
                currentUserId,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}

module.exports = goodsReceiptController
