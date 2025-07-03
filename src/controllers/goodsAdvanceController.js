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
            const { goodsAdvanceId } = req.params
            const result = await goodsAdvanceService.getById(goodsAdvanceId)
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
            const { goodsAdvanceId } = req.params
            const result = await goodsAdvanceService.create(
                goodsAdvanceId,
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
            const { goodsAdvanceId } = req.params
            const result = await goodsAdvanceService.update(
                goodsAdvanceId,
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
            const { goodsAdvanceId } = req.params
            const result = await goodsAdvanceService.cancel(
                goodsAdvanceId,
                req.body,
                currentUserId,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    extend: async (req, res, next) => {
        try {
            const currentUserId = req.userId
            const { goodsAdvanceId } = req.params
            const result = await goodsAdvanceService.extend(
                goodsAdvanceId,
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
            const { goodsAdvanceDetailId } = req.params
            const result = await goodsAdvanceService.updateProduct(
                goodsAdvanceDetailId,
                req.body,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    deleteProduct: async (req, res, next) => {
        try {
            const { goodsAdvanceDetailId } = req.params
            const result =
                await goodsAdvanceService.deleteProduct(goodsAdvanceDetailId)
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
    exportReport: async (req, res, next) => {
        try {
            const buffer = await goodsAdvanceService.exportReport(req.body);
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            );
            res.setHeader(
                'Content-Disposition',
                'attachment; filename="Bao_cao_tam_ung.xlsx"',
            );
            res.send(buffer);
        } catch (error) {
            next(error);
        }
    },
}

module.exports = goodsAdvanceController
