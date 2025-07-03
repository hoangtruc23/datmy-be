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
    cancel: async (req, res, next) => {
        try {
            const currentUserId = req.userId
            const { goodsReceiptId } = req.params
            const result = await goodsReceiptService.cancel(
                goodsReceiptId,
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
    exportReport: async (req, res, next) => {
        try {
            const buffer = await goodsReceiptService.exportReport(req.body)
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            )
            res.setHeader(
                'Content-Disposition',
                'attachment; filename="Bao_cao_nhap_kho.xlsx"',
            )
            res.send(buffer)
        } catch (error) {
            next(error)
        }
    },
    downloadInvoiceFile: async (req, res, next) => {
        try {
            const { id } = req.params
            await goodsReceiptService.downloadInvoiceFile(id, res)
        } catch (err) {
            next(err)
        }
    },
}

module.exports = goodsReceiptController
