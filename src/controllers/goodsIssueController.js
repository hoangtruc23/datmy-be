const goodsIssueService = require('../services/goodsIssueService')
const response = require('../utils/response/response')

const goodsIssueController = {
    getAll: async (req, res, next) => {
        try {
            const result = await goodsIssueService.getAll(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getById: async (req, res, next) => {
        try {
            const { goodsIssueId } = req.params
            const result = await goodsIssueService.getById(goodsIssueId)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    createTemporary: async (req, res, next) => {
        try {
            const currentUserId = req.userId
            const result =
                await goodsIssueService.createTemporary(currentUserId)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    create: async (req, res, next) => {
        try {
            const currentUserId = req.userId
            const { goodsIssueId } = req.params
            const result = await goodsIssueService.create(
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
            const result = await goodsIssueService.update(
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
            const result = await goodsIssueService.cancel(
                goodsIssueId,
                currentUserId,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    addProduct: async (req, res, next) => {
        try {
            const result = await goodsIssueService.addProduct(req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    updateProduct: async (req, res, next) => {
        try {
            const { goodsIssueDetailId } = req.params
            const result = await goodsIssueService.updateProduct(
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
                await goodsIssueService.deleteProduct(goodsIssueDetailId)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    approval: async (req, res, next) => {
        try {
            const currentUserId = req.userId
            const result = await goodsIssueService.approval(
                req.body,
                currentUserId,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    exportReport: async (req, res, next) => {
        try {
            const buffer = await goodsIssueService.exportReport(req.body);
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            );
            res.setHeader(
                'Content-Disposition',
                'attachment; filename="Bao_cao_ban_hang.xlsx"',
            );
            res.send(buffer);
        } catch (error) {
            next(error);
        }
    },
}

module.exports = goodsIssueController
