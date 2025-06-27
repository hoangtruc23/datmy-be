const goodsAdvanceService = require('../services/goodsAdvanceService')
const response = require('../utils/response/response')

const goodsAdvanceController = {
    getAll: async (req, res, next) => {
        try {
            const result = await goodsAdvanceService.getAll(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getById: async (req, res, next) => {
        try {
            const { goodsIssueId } = req.params
            const result = await goodsAdvanceService.getById(goodsIssueId)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    createTemporary: async (req, res, next) => {
        try {
            const currentUserId = req.userId
            const result =
                await goodsAdvanceService.createTemporary(currentUserId)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    create: async (req, res, next) => {
        try {
            const currentUserId = req.userId
            const { goodsIssueId } = req.params
            const result = await goodsAdvanceService.create(
                goodsIssueId,
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
            const { goodsIssueId } = req.params
            const result = await goodsAdvanceService.update(
                goodsIssueId,
                req.body,
                currentUserId,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    cancel: async (req, res, next) => {
        try {
            const currentUserId = req.userId
            const { goodsIssueId } = req.params
            const result = await goodsAdvanceService.cancel(
                goodsIssueId,
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
            const result = await goodsAdvanceService.addProduct(req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    updateProduct: async (req, res, next) => {
        try {
            const { goodsIssueDetailId } = req.params
            const result = await goodsAdvanceService.updateProduct(
                goodsIssueDetailId,
                req.body,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    deleteProduct: async (req, res, next) => {
        try {
            const { goodsIssueDetailId } = req.params
            const result =
                await goodsAdvanceService.deleteProduct(goodsIssueDetailId)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    approval: async (req, res, next) => {
        try {
            const currentUserId = req.userId
            const result = await goodsAdvanceService.approval(
                req.body,
                currentUserId,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}

module.exports = goodsAdvanceController
